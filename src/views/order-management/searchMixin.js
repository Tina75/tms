import City from '@/libs/js/city'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      keywords: {
        consignerName: null,
        orderNo: null,
        waybillNo: null,
        customerOrderNo: null,
        startTime: null,
        endTime: null,
        start: '', // 始发地
        end: '' // 目的地
      },
      cityCodes: {
        startCodes: [], // 始发地codes
        endCodes: [] // 目的地codes
      },
      times: ['', ''], // 下单开始结束时间
      recoveryTimes: ['', ''], // 回收开始结束时间
      returnTimes: ['', ''], // 返厂开始结束时间
      timeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() // 过滤当前日期之后的日期
        }
      },
      simpleSearch: true, // 简单搜索
      selectOrderList: [], // 跨页选择订单集合
      selectedId: [], // 选中的订单集合的ID集合
      isSearching: false // 是否正在搜索中
    }
  },

  computed: {
    ...mapGetters([
      'clients'
    ])
  },

  created () {
    const columns = window.sessionStorage[this.tabType + '_COLUMNS']
    if (columns) this.extraColumns = JSON.parse(columns)
  },

  mounted () {
  },

  methods: {
    ...mapActions([
      'getClients'
    ]),
    // 切换搜索条件  客户名称/订单号/运单号
    handleChangeSearchStatus (val) {
      this.clearKeywords()
      this.selectStatus = val
    },
    // 条件搜索
    searchList () {
      let key = {
        // status: this.keywords.status,
        consignerName: this.keywords.consignerName || null,
        orderNo: this.keywords.orderNo || null,
        waybillNo: this.keywords.waybillNo || null,
        customerOrderNo: this.keywords.customerOrderNo || null,
        // 地址搜索为最后一级区号
        start: (this.cityCodes.startCodes !== null && this.cityCodes.startCodes.length) ? this.cityCodes.startCodes[this.cityCodes.startCodes.length - 1] : null,
        end: (this.cityCodes.endCodes !== null && this.cityCodes.endCodes.length) ? this.cityCodes.endCodes[this.cityCodes.endCodes.length - 1] : null
      }
      if (this.$route.path === '/order-management/receipt') { // 回单列表搜索
        key.receiptStatus = this.keywords.receiptStatus
        key.recoveryTimeStart = this.keywords.recoveryTimeStart || null
        key.recoveryTimeEnd = this.keywords.recoveryTimeEnd || null
        key.returnTimeStart = this.keywords.returnTimeStart || null
        key.returnTimeEnd = this.keywords.returnTimeEnd || null
        // 简单搜索模式下当前搜索框值为空是默认不是搜索状态
        if (this.simpleSearch && ((this.selectStatus === 0 && !this.keywords.consignerName) || (this.selectStatus === 1 && !this.keywords.orderNo) || (this.selectStatus === 2 && !this.keywords.customerOrderNo))) {
          this.isSearching = false
        } else {
          this.isSearching = true
        }
      } else { // 订单列表、运输管理列表搜索
        key.status = this.keywords.status
        key.startTime = this.keywords.startTime || null
        key.endTime = this.keywords.endTime || null
        key.importId = this.keywords.importId || null
        // 简单搜索模式下当前搜索框值为空是默认不是搜索状态
        if (this.simpleSearch && ((this.selectStatus === 0 && !this.keywords.consignerName) || (this.selectStatus === 1 && !this.keywords.orderNo) || (this.selectStatus === 2 && !this.keywords.waybillNo))) {
          this.isSearching = false
        } else {
          this.isSearching = true
        }
      }
      this.keywords = key
      this.keyword = { ...this.keywords }
      this.selectOrderList = [] // 重置当前已勾选项
      this.selectedId = [] // 重置当前已勾选id项
    },
    // 清除keywords搜索
    clearKeywords () {
      let key = {
        consignerName: null,
        orderNo: null,
        waybillNo: null,
        customerOrderNo: null,
        start: '', // 始发地
        end: '' // 目的地
      }
      // 订单列表状态字段status，回单列表状态字段receiptStatus, 时间搜索（不一致，根据路由判断）
      if (this.$route.path === '/order-management/receipt') {
        key.receiptStatus = this.keywords.receiptStatus
        key.recoveryTimeStart = null
        key.recoveryTimeEnd = null
        key.returnTimeStart = null
        key.returnTimeEnd = null
        this.recoveryTimes = ['', '']
        this.returnTimes = ['', '']
      } else { // 判断运输管理需要使用tabContent组件
        key.status = this.keywords.status
        key.startTime = null
        key.endTime = null
        this.times = ['', '']
        key.importId = this.keywords.importId // 导入批次号
      }
      this.keywords = key
      this.cityCodes = {
        startCodes: '',
        endCodes: ''
      }
      if (!this.isSearching) return
      this.keyword = Object.assign({}, key, {
        start: null,
        end: null
      })
      this.selectOrderList = [] // 重置当前已勾选项
      this.selectedId = [] // 重置当前已勾选id项
      this.isSearching = false
    },
    // 高级搜索切换
    handleSwitchSearch () {
      this.simpleSearch = !this.simpleSearch
      this.clearKeywords()
    },
    // 修改下单开始结束时间
    handleTimeChange (val) {
      this.keywords.startTime = val[0]
      this.keywords.endTime = val[1]
    },
    // 修改回收开始结束时间
    handleRecoveryTimeChange (val) {
      this.keywords.recoveryTimeStart = val[0]
      this.keywords.recoveryTimeEnd = val[1]
    },
    // 修改返厂开始结束时间
    handleReturnTimeChange (val) {
      this.keywords.returnTimeStart = val[0]
      this.keywords.returnTimeEnd = val[1]
    },
    // 筛选列表显示字段
    handleColumnChange (columns) {
      this.extraColumns = columns
      window.sessionStorage.setItem(this.tabType + '_COLUMNS', JSON.stringify(columns))
    },
    // 列表批量选择操作
    handleSelectionChange () {
      // 当前选中集合
      this.selectOrderList = this.$refs.pageTable.selectedRow
      // 当前选中项id集合
      let ids = []
      this.$refs.pageTable.selectedRow.map((item) => {
        ids.push(item.id)
      })
      this.selectedId = ids
      console.log(this.selectOrderList)
      console.log(this.selectedId)
    },
    // 表格按时间排序
    tableSort ({ order }) {
    },
    // 格式化日期
    dateFormatter (timestamp) {
      return new Date(timestamp).Format('yyyy-MM-dd hh:mm:ss')
    },
    // 格式化城市
    cityFormatter (code) {
      if (!code) return ''
      return Array.from(new Set(City.codeToFullNameArr(code, 3))).join('')
    },
    // 结算方式码转为名称
    settlementToName (val) {
      let name
      switch (val) {
        case 1:
          name = '现付'
          break
        case 2:
          name = '到付'
          break
        case 3:
          name = '回付'
          break
        case 4:
          name = '月结'
          break
        default:
          name = ''
          break
      }
      return name
    },
    // 提货状态转名称
    pickupToName (code) {
      let name
      switch (code) {
        case 1:
          name = '上门提货'
          break
        case 2:
          name = '直接送货'
          break
      }
      return name
    },
    // 将地址字符串12位后的替换成...
    formatterAddress (str) {
      let dot = str.substring(12)
      return str.replace(dot, ' ...')
    },
    // 在途、已到货、已回单、已返厂取消操作栏
    deleteOperateCol () {
      if (this.tableColumns[1].title === '操作') {
        this.operateCol = this.tableColumns.splice(1, 1)
      }
    },
    // 全部、待提货、待调度、待回收、待返厂加上操作栏
    addOperateCol () {
      if (this.tableColumns[1].title !== '操作') {
        this.tableColumns.splice(1, 0, this.operateCol[0])
      }
    }
  }
}
