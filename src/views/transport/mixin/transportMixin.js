/**
 * 送货管理、提货管理、外转管理页面公有方法
 */

export default {
  data () {
    return {
      order: 'desc', // 倒序 asc升序

      // 输入下拉框所需数据
      linkage: false,
      keyFields: 'seniorSearchFields',

      // 分页
      page: {
        current: 1,
        size: 10
      },
      searchFields: {}, // 发起请求时的搜索字段

      tabStatus: 1, // 当前标签页
      currentBtns: [], // 当前按钮组

      isEasySearch: true, // 是否为简易搜索
      inSearching: false, // 当前是否搜索中
      easySelectMode: 1, // 简易搜索当前类型
      easySearchKeyword: '', // 简易搜索字段

      tableSelection: [], // 表格的选中项

      printData: [] // 待打印数据
    }
  },

  computed: {
    // tab切换后根据tab和权限确定应展示的按钮组
    showButtons () {
      return this.currentBtns.filter(item => {
        return this.hasPower(item.code)
      })
    }
  },

  created () {
    this.setTabToCustom()
  },

  methods: {
    // 显示用户筛选过的表头数据（本地）-已废弃，保存在数据库
    setTableColumns () {
      const columns = window.localStorage[this.tabType + '_COLUMNS']
      if (columns) this.extraColumns = JSON.parse(columns)
    },

    /**
     * 将tab切换到用户设置的tab页并查询数据
     * 1. 如果从其他页面进入，则从url获取tab tag并切换
     * 2. 如果直接打开，则从session中获取上次打开时最后切换到的tab
     * 3. 如果session也没有，则进入第一个tab
     */
    setTabToCustom () {
      let tab
      if (this.$route.query.tab !== undefined && this.$route.query.tab < this.tabList.length) {
        tab = this.tabList[this.$route.query.tab].name
        window.sessionStorage.setItem('TABHEADER_' + this.tabType, tab)
      } else {
        tab = window.sessionStorage['TABHEADER_' + this.tabType]
      }

      if (this.tab !== undefined) {
        this.tabStatus = this.setTabStatus(tab)
        this.tabChanged(tab)
      } else {
        this.tabStatus = this.setTabStatus(this.tabList[0].name)
        if (this.tabType === 'OUTER') this.currentBtns = this.btnList[0].btns
        this.fetchData()
      }
    },

    // 交易批量操作时是否已选择
    checkTableSelection () {
      if (!this.tableSelection.length) {
        this.$Message.error('请先选择后再操作')
        return false
      }
      return true
    },

    // 对没有操作的表格隐藏操作列，有操作的表格显示操作列
    triggerTableActionColumn (show) {
      const hasAction = this.tableColumns[1].key === 'action'
      if (hasAction && !show) { // 移除action
        this.tableColumns.splice(1, 1)
      } else if (!hasAction && show) { // 添加action
        this.tableColumns.splice(1, 0, this.tableActionColumn)
      }
    },

    // 查询数据
    fetchData () {
      this.tableSelection = []
      this.$refs.$table && this.$refs.$table.clearSelected() // 清空已选项
      this.searchFields = this.setFetchParams() // 设置请求搜索字段，page table组件会自动查询
      this.fetchTabCount && this.fetchTabCount() // 如果存在查询tab数量的方法则查询
    },

    // 清空已选项并查询数据
    clearSelectedAndFetch () {
      this.tableSelection = []
      this.$refs.$table.clearSelected()
      this.$refs.$table.fetch()
      this.fetchTabCount && this.fetchTabCount()
    },

    /**
     * 搜索
     * 如果是简易搜索则直接进行搜索
     * 如果是高级搜索且存在搜索关键字则搜索
     */
    startSearch () {
      if (!this.isEasySearch) {
        let canSearch = false
        for (let key in this.seniorSearchFields) {
          if (this.seniorSearchFields[key] !== '') canSearch = true
        }
        if (!canSearch) return
      }

      this.inSearching = true
      this.fetchData()
    },
    // 简易与高级搜索切换
    changeSearchType () {
      this.isEasySearch = !this.isEasySearch
      this.resetEasySearch()
      this.resetSeniorSearch()
    },
    // 重置简易搜索
    resetEasySearch () {
      if (this.easySearchKeyword === '') return
      this.easySearchKeyword = ''
      if (!this.inSearching) return
      this.page.current = 1
      this.inSearching = false
      this.fetchData()
    },
    // 重置高级搜索
    resetSeniorSearch () {
      let needReset = false
      for (let key in this.seniorSearchFields) {
        if (key === 'dateRange') {
          this.seniorSearchFields.dateRange = []
        } else if (this.seniorSearchFields[key] !== '') {
          this.seniorSearchFields[key] = ''
          needReset = true
        }
      }
      if (!needReset || !this.inSearching) return
      this.page.current = 1
      this.inSearching = false
      this.resetSeniorSearch()
      this.fetchData()
    },

    // tab切换
    tabChanged (tab) {
      // 设置当前的按钮组
      for (let i = 0; i < this.btnList.length; i++) {
        if (tab === this.btnList[i].tab) {
          this.currentBtns = this.btnList[i].btns
          break
        }
      }
      // 设置当前tab状态
      this.tabStatus = this.setTabStatus(tab)
      // 重置搜索条件
      this.resetEasySearch()
      this.resetSeniorSearch()
      // 搜索与查询
      if ((this.tabType === 'OUTER') || (this.tabType !== 'OUTER' && this.tabStatus)) this.fetchData()
      else this.fetchTabCount && this.fetchTabCount()
    },

    // 分页切换
    pageChange (current) {
      console.log(current)
      this.page.current = current
    },
    // 分页size改变
    pageSizeChange (size) {
      this.page.size = size
    },
    // 表格显示项筛选并存储
    // TMS1.1 18.10.22 已废弃
    tableColumnsChanged (columns) {
      this.extraColumns = columns
      window.localStorage.setItem(this.tabType + '_COLUMNS', JSON.stringify(columns))
    },
    // 选中的表格行
    selectionChanged (selection) {
      this.tableSelection = selection
    },
    // 表格按时间排序
    tableSort ({ order }) {
      this.order = order
      this.fetchData()
    },

    // 设置查询参数
    setFetchParams () {
      let params = {
        status: this.tabStatus,
        order: this.order === 'asc' ? 'asc' : 'desc'
      }
      if (this.inSearching) {
        if (this.isEasySearch) {
          if (this.easySearchKeyword) {
            params.type = this.easySelectMode
            params.keyWord = this.easySearchKeyword
          }
        } else {
          if (this.seniorSearchFields.dateRange[0]) {
            this.seniorSearchFields.startTime = this.seniorSearchFields.dateRange[0].Format('yyyy-MM-dd hh:mm:ss')
          } else this.seniorSearchFields.startTime = ''
          if (this.seniorSearchFields.dateRange[1]) {
            let endTime = this.seniorSearchFields.dateRange[1].getTime() + (24 * 60 * 60 - 1) * 1000
            this.seniorSearchFields.endTime = (new Date(endTime)).Format('yyyy-MM-dd hh:mm:ss')
          } else this.seniorSearchFields.endTime = ''

          for (let key in this.seniorSearchFields) {
            if (key === 'dateRange') continue
            if (this.seniorSearchFields[key]) {
              params[key] = this.seniorSearchFields[key]
            }
          }
        }
      }
      return params
    }
  }
}
