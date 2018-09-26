import City from '../../libs/js/City'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      selectStatus: 0, // 当前搜索状态   0：客户名称   1：订单号  2：运单号
      selectList: [
        {
          value: 0,
          label: '客户名称'
        },
        {
          value: 1,
          label: '订单号'
        },
        {
          value: 2,
          label: '运单号'
        }
      ],
      keywords: {
        // status: null,
        consignerName: null,
        orderNo: null,
        waybillNo: null,
        customerOrderNo: null,
        startTime: null,
        endTime: null,
        start: [],
        end: []
      },
      times: ['', ''],
      timeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() // 过滤当前日期之后的日期
        }
      },
      simpleSearch: true, // 简单搜索
      selectOrderList: [], // 选中的订单集合
      isSearching: false // 是否正在搜索中
    }
  },

  computed: {
    ...mapGetters([
      'clients'
    ])
  },

  created () {
    // 初始化按钮组
  },

  mounted () {
    if (this.$route.path === '/order-management/order') {
      this.keywords.status = 10
    } else {
      this.keywords.receiptStatus = 0
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
        start: (this.keywords.start !== null && this.keywords.start.length) ? Number(this.keywords.start[this.keywords.start.length - 1]) : null,
        end: (this.keywords.end !== null && this.keywords.end.length) ? Number(this.keywords.end[this.keywords.end.length - 1]) : null,
        startTime: this.keywords.startTime || null,
        endTime: this.keywords.endTime || null
      }
      if (this.$route.path === '/order-management/order') {
        key.status = this.keywords.status
      } else {
        key.receiptStatus = this.keywords.receiptStatus
      }
      this.keywords = key
      this.keyword = {...this.keywords}
      this.selectOrderList = []
      // 简单搜索模式下当前搜索框值为空是默认不是搜索状态
      if (this.simpleSearch && ((this.selectStatus === 0 && !this.keywords.consignerName) || (this.selectStatus === 1 && !this.keywords.orderNo) || (this.selectStatus === 2 && !this.keywords.waybillNo))) {
        this.isSearching = false
      } else {
        this.isSearching = true
      }
    },
    // 清除keywords搜索
    clearKeywords () {
      let key = {
        // status: this.keywords.status,
        consignerName: null,
        orderNo: null,
        waybillNo: null,
        customerOrderNo: null,
        start: [],
        end: []
      }
      // 订单列表状态字段status，回单列表状态字段receiptStatus（不一致，根据路由判断）
      if (this.$route.path === '/order-management/order') {
        key.status = this.keywords.status
      } else {
        key.receiptStatus = this.keywords.receiptStatus
      }
      this.times = ['', '']
      this.keywords = key
      if (!this.isSearching) return
      this.keyword = Object.assign({}, key, {
        start: null,
        end: null,
        startTime: null,
        endTime: null
      })
      this.selectOrderList = []
      this.isSearching = false
    },
    // 高级搜索切换
    handleSwitchSearch () {
      this.simpleSearch = !this.simpleSearch
      this.clearKeywords()
    },
    // 修改开始结束时间
    handleTimeChange (val) {
      this.keywords.startTime = val[0]
      this.keywords.endTime = val[1]
    },
    // 筛选列表显示字段
    handleColumnChange (col) {
      this.extraColumns = col
    },
    // 列表批量选择操作
    handleSelectionChange (val) {
      console.log(val)
      this.selectOrderList = val
    },
    // 表格按时间排序
    tableSort ({ order }) {
    },
    // 格式化日期
    dateFormatter (timestamp) {
      return new Date(timestamp).Format('yyyy-MM-dd hh:mm:ss')
    },
    // 格式化城市
    cityFilter (code) {
      return City.codeToFullName(code, 3, '')
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
    }
  }
}
