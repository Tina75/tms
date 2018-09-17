export default {
  data () {
    return {
      // 分页
      page: {
        current: 1,
        size: 10,
        total: 0
      },

      tabStatus: void 0, // 当前标签页
      currentBtns: [], // 当前按钮组

      isEasySearch: true, // 是否为简易搜索
      inSearching: false, // 当前是否搜索中
      easySelectMode: 1, // 简易搜索当前类型
      easySearchKeyword: '', // 简易搜索字段

      tableData: [], // 表格数据
      tableSelection: [] // 表格的选中项
    }
  },

  created () {
    // 初始化按钮组
    this.currentBtns = this.btnList[0].btns
    this.fetchData()
  },

  methods: {
    // 搜索
    startSearch () {
      if (this.isEasySearch && !this.easySearchKeyword) return
      else if (!this.isEasySearch) {
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
    // 重置搜索条件
    resetEasySearch () {
      if (this.easySearchKeyword === '') return
      this.easySearchKeyword = ''
      if (!this.inSearching) return
      this.page.current = 1
      this.inSearching = false
      this.fetchData()
    },
    resetSeniorSearch () {
      let needReset = false
      for (let key in this.seniorSearchFields) {
        if (this.seniorSearchFields[key] !== '') {
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
      this.tabStatus = this.setTabStatus(tab)
      // 重置搜索条件
      this.resetEasySearch()
      this.resetSeniorSearch()
    },
    // 分页切换
    pageChange (current) {
      this.page.current = current
      this.fetchData()
    },
    // 分页size改变
    pageSizeChange (size) {
      this.page.size = size
      this.fetchData()
    },
    // 表格显示项筛选
    tableColumnsChanged (columns) {
      this.extraColumns = columns
    },
    // 选中的表格行
    selectionChanged (selection) {
      this.tableSelection = selection
    },
    // 设置查询参数
    setFetchParams () {
      let params = {
        status: this.tabStatus,
        pageNo: this.page.current,
        pageSize: this.page.size
      }
      if (this.inSearching) {
        if (this.isEasySearch) {
          params.type = this.easySelectMode
          params.keyword = this.easySearchKeyword
        } else {
          params = Object.assign(params, this.seniorSearchFields)
        }
      }
      return params
    }
  }
}
