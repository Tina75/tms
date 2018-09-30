import Server from '@/libs/js/server'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      order: 'desc', // 倒序 asc升序
      carriers: [],
      carrierCars: [],
      // 分页
      page: {
        current: 1,
        size: 10
      },
      searchFields: {},

      tabStatus: void 0, // 当前标签页
      currentBtns: [], // 当前按钮组

      isEasySearch: true, // 是否为简易搜索
      inSearching: false, // 当前是否搜索中
      easySelectMode: 1, // 简易搜索当前类型
      easySearchKeyword: '', // 简易搜索字段

      tableSelection: [], // 表格的选中项

      printData: []
    }
  },

  computed: {
    ...mapGetters([
      'carrierDrivers'
    ]),

    showButtons () {
      return this.currentBtns.filter(item => {
        return this.hasPower(item.code)
      })
    }
  },

  created () {
    this.getCarriers()
    const columns = window.sessionStorage[this.tabType + '_COLUMNS']
    if (columns) this.extraColumns = JSON.parse(columns)
    const tab = window.sessionStorage['TABHEADER_' + this.tabType]
    if (tab) {
      this.tabStatus = this.setTabStatus(tab)
      this.tabChanged(tab)
    } else {
      this.currentBtns = this.btnList[1].btns
    }
    this.fetchData()
  },

  methods: {
    getCarriers () {
      Server({
        url: '/carrier/listOrderByUpdateTimeDesc',
        method: 'get',
        data: { type: 1 }
      }).then(res => {
        this.carriers = res.data.data.carrierList.map(item => {
          return {
            name: item.carrierName,
            value: item.carrierName,
            payType: item.payType,
            carrierPhone: item.carrierPhone,
            id: item.carrierId
          }
        })
      })
    },

    getCarrierCars (carrierId) {
      Server({
        url: '/carrier/list/carOrderByUpdateTimeDesc',
        method: 'get',
        data: { carrierId }
      }).then(res => {
        this.carrierCars = res.data.data.carList.map(item => {
          return {
            name: item.carNO,
            value: item.carNO,
            id: item.carId,
            driverName: item.driverName,
            driverPhone: item.driverPhone,
            carType: item.carType,
            carLength: item.carLength
          }
        })
      })
    },

    handleSelectCarrier (name, row) {
      this.getCarrierCars(row.id)
      this.$store.dispatch('getCarrierDrivers', row.id)
    },

    checkTableSelection () {
      if (!this.tableSelection.length) {
        this.$Message.error('请先选择后再操作')
        return false
      }
      return true
    },

    fetchData () {
      this.tableSelection = []
      this.searchFields = this.setFetchParams()
    },

    // 搜索
    startSearch () {
      // if (this.isEasySearch && !this.easySearchKeyword) return
      // else
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
        if (['startCodes', 'endCodes', 'dateRange'].indexOf(key) > -1) {
          this.seniorSearchFields[key] = []
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
      this.tabStatus = this.setTabStatus(tab)
      // 重置搜索条件
      this.resetEasySearch()
      this.resetSeniorSearch()
      // 搜索
      this.fetchData()
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
    // 表格显示项筛选
    tableColumnsChanged (columns) {
      this.extraColumns = columns
      window.sessionStorage.setItem(this.tabType + '_COLUMNS', JSON.stringify(columns))
    },
    // 选中的表格行
    selectionChanged (selection) {
      console.log(selection)
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
          if (this.seniorSearchFields.startCodes) {
            if (this.seniorSearchFields.startCodes.length) {
              this.seniorSearchFields.start = this.seniorSearchFields.startCodes[this.seniorSearchFields.startCodes.length - 1]
            } else this.seniorSearchFields.start = ''
          }

          if (this.seniorSearchFields.endCodes) {
            if (this.seniorSearchFields.endCodes.length) {
              this.seniorSearchFields.end = this.seniorSearchFields.endCodes[this.seniorSearchFields.endCodes.length - 1]
            } else this.seniorSearchFields.end = ''
          }

          if (this.seniorSearchFields.dateRange[0]) {
            this.seniorSearchFields.startTime = this.seniorSearchFields.dateRange[0].Format('yyyy-MM-dd hh:mm:ss')
          } else this.seniorSearchFields.startTime = ''
          if (this.seniorSearchFields.dateRange[1]) {
            let endTime = this.seniorSearchFields.dateRange[1].getTime() + (24 * 60 * 60 - 1) * 1000
            this.seniorSearchFields.endTime = (new Date(endTime)).Format('yyyy-MM-dd hh:mm:ss')
          } else this.seniorSearchFields.endTime = ''

          for (let key in this.seniorSearchFields) {
            if (['startCodes', 'endCodes', 'dateRange'].indexOf(key) > -1) continue
            if (this.seniorSearchFields[key].length) {
              params[key] = this.seniorSearchFields[key]
            }
          }
        }
      }
      return params
    }
  }
}
