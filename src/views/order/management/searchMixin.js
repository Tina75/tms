import City from '@/libs/js/city'
import settlements from '@/libs/constant/settlement.js'
import pickups from '@/libs/constant/pickup.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      keywords: {
        consignerName: null,
        orderNo: null,
        waybillNo: null,
        customerOrderNo: null,
        createTimeStart: null,
        createTimeEnd: null,
        start: void 0, // 始发地
        end: void 0, // 目的地
        remark: null // 备注 created at 2018-12-10,v1.08, mys
      },
      /*
      cityCodes: {
        startCodes: [], // 始发地codes
        endCodes: [] // 目的地codes
      },
      */
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

  mounted () {
    if (this.$route.path === '/transport/receipt') { // v1.6 回单动态新增承运商搜索
      this.$set(this.keywords, 'carrierName', null)
      this.$set(this.keywords, 'driverName', null)
      this.$set(this.keywords, 'driverPhone', null)
      this.$set(this.keywords, 'carNo', null)
    }
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
        start: this.keywords.start || null,
        end: this.keywords.end || null
      }
      if (this.$route.path === '/transport/receipt') { // 回单列表搜索
        key.receiptStatus = this.keywords.receiptStatus
        key.recoveryTimeStart = this.keywords.recoveryTimeStart || null
        key.recoveryTimeEnd = this.keywords.recoveryTimeEnd || null
        key.returnTimeStart = this.keywords.returnTimeStart || null
        key.returnTimeEnd = this.keywords.returnTimeEnd || null
        key.carrierName = this.keywords.carrierName || null
        key.driverName = this.keywords.driverName || null
        key.driverPhone = this.keywords.driverPhone || null
        key.carNo = this.keywords.carNo || null
        // 简单搜索模式下当前搜索框值为空是默认不是搜索状态
        if (this.simpleSearch && (
          (this.selectStatus === 0 && !this.keywords.consignerName) ||
          (this.selectStatus === 1 && !this.keywords.orderNo) ||
          (this.selectStatus === 2 && !this.keywords.customerOrderNo) ||
          (this.selectStatus === 3 && !this.keywords.carrierName) ||
          (this.selectStatus === 4 && !this.keywords.driverName) ||
          (this.selectStatus === 5 && !this.keywords.driverPhone) ||
          (this.selectStatus === 6 && !this.keywords.carNo)
        )) {
          this.isSearching = false
        } else {
          this.isSearching = true
        }
      } else { // 订单列表、运输管理列表搜索
        key.status = this.keywords.status
        key.createTimeStart = this.keywords.createTimeStart || null
        key.createTimeEnd = this.keywords.createTimeEnd || null
        key.importId = this.keywords.importId || null
        key.remark = this.keywords.remark || null
        // 简单搜索模式下当前搜索框值为空是默认不是搜索状态
        if (this.simpleSearch && (
          (this.selectStatus === 0 && !this.keywords.consignerName) ||
          (this.selectStatus === 1 && !this.keywords.orderNo) ||
          (this.selectStatus === 2 && !this.keywords.waybillNo) ||
          (this.selectStatus === 3 && !this.keywords.customerOrderNo)
        )) {
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
        start: 0, // 始发地
        end: 0 // 目的地
      }
      // 订单列表状态字段status，回单列表状态字段receiptStatus, 时间搜索（不一致，根据路由判断）
      if (this.$route.path === '/transport/receipt') {
        key.receiptStatus = this.keywords.receiptStatus
        key.recoveryTimeStart = null
        key.recoveryTimeEnd = null
        key.returnTimeStart = null
        key.returnTimeEnd = null
        key.carrierName = null
        key.driverName = null
        key.driverPhone = null
        key.carNo = null
        this.recoveryTimes = ['', '']
        this.returnTimes = ['', '']
      } else { // 判断运输管理需要使用tabContent组件
        key.status = this.keywords.status
        key.createTimeStart = null
        key.createTimeEnd = null
        this.times = ['', '']
        key.importId = this.keywords.importId // 导入批次号
        key.remark = null
      }
      this.keywords = key
      // this.cityCodes = {
      //   startCodes: '',
      //   endCodes: ''
      // }
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
      this.keywords.createTimeStart = val[0] ? val[0] + ' 00:00:00' : val[0]
      this.keywords.createTimeEnd = val[1] ? val[1] + ' 23:59:59' : val[1]
      this.searchList()
    },
    // 修改回收开始结束时间
    handleRecoveryTimeChange (val) {
      this.keywords.recoveryTimeStart = val[0] ? val[0] + ' 00:00:00' : val[0]
      this.keywords.recoveryTimeEnd = val[1] ? val[1] + ' 23:59:59' : val[1]
      this.searchList()
    },
    // 修改返厂开始结束时间
    handleReturnTimeChange (val) {
      this.keywords.returnTimeStart = val[0] ? val[0] + ' 00:00:00' : val[0]
      this.keywords.returnTimeEnd = val[1] ? val[1] + ' 23:59:59' : val[1]
      this.searchList()
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
      // 将选中订单集合按时间由近及远排序
      this.selectOrderList.sort((a, b) => {
        return b.createTime - a.createTime
      })
      // 当前选中项id集合
      let ids = []
      this.selectOrderList.map((item) => {
        ids.push(item.id)
      })
      this.selectedId = ids
      // console.log(this.selectOrderList)
      // console.log(this.selectedId)
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
      let type = settlements.find(item => item.value === val)
      if (type) {
        return type.name
      }
      return '-'
    },
    // 提货状态转名称
    pickupToName (code) {
      let pick = pickups.find(item => item.value === code)
      if (pick) {
        return pick.name
      }
      return '-'
    },
    // 将地址字符串12位后的替换成...
    formatterAddress (str) {
      return str.slice(0, 12) + ' ...'
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
