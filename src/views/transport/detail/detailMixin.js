import CarConfigs from './carConfigs.json'

const carType = CarConfigs.carType
const carLength = CarConfigs.carLength

export default {
  data () {
    return {
      id: this.$route.query.id,
      loading: false,
      inEditing: false,
      currentBtns: [], // 当前按钮组

      detail: [], // 货物明细

      // 支付方式表格
      tablePayment: [
        {
          title: '付款方式',
          key: 'payType',
          width: 100,
          render: (h, p) => {
            let type
            if (p.row.payType === 1) type = '预付'
            if (p.row.payType === 2) type = '到付'
            if (p.row.payType === 3) type = '回付'
            return h('span', {
              style: { fontWeight: 'bolder' }
            }, type)
          }
        },
        {
          title: '现金',
          key: 'cashAmount',
          render: (h, p) => {
            if (!this.inEditing) {
              return h('span', p.row.cashAmount)
            } else {
              return h('Input', {
                props: {
                  value: p.row.cashAmount,
                  placeholder: '请输入'
                },
                style: {
                  width: 'auto',
                  borderStyle: 'none'
                }
              })
            }
          }
        },
        {
          title: '油卡',
          key: 'fuelCardAmount',
          render: (h, p) => {
            if (!this.inEditing) {
              return h('span', p.row.fuelCardAmount)
            } else {
              return h('Input', {
                props: {
                  value: p.row.fuelCardAmount,
                  placeholder: '请输入'
                },
                style: {
                  width: 'auto',
                  borderStyle: 'none'
                }
              })
            }
          }
        }
      ],

      showLog: false,
      logList: [],

      carType,
      carLength
    }
  },

  created () {
    this.fetchData()
  },

  computed: {
    // 根据日志收起展开动态计算高度
    logListHeight () {
      return { height: this.showLog ? 41 * this.logList.length + 'px' : '15px' }
    },
    // 支付总额
    paymentTotal () {
      return this.payment.freightFee + this.payment.loadFee + this.payment.unloadFee + this.payment.insuranceFee + this.payment.otherFee
    },
    // 货物总计
    orderTotal () {
      return this.detail.reduce((last, item) => {
        return {
          cargoCost: last.cargoCost + item.cargoCost,
          quantity: last.quantity + item.quantity,
          weight: last.weight + item.weight,
          volume: last.volume + item.volume
        }
      }, {
        cargoCost: 0,
        quantity: 0,
        weight: 0,
        volume: 0
      })
    }
  },

  filters: {
    carTypeFilter (value) {
      for (let i = 0; i < carType.length; i++) {
        if (value === carType[i].value) {
          return carType[i].label
        }
      }
    },
    carLengthFilter (value) {
      for (let i = 0; i < carLength.length; i++) {
        if (value === carLength[i].value) {
          return carLength[i].label
        }
      }
    }
  },

  watch: {
    inEditing (val) {
      if (!this.tableCanEdit) return
      if (val) {
        this.tableColumns.unshift({
          title: '操作',
          key: 'action',
          width: 60,
          render: (h, p) => {
            return h('a', {
              on: {
                click: () => {
                  this.detail.splice(p.index, 1)
                }
              }
            }, '移出')
          }
        })
      } else {
        this.tableColumns.shift()
      }
    }
  },

  methods: {
    // 根据状态设置按钮
    setBtnsWithStatus () {
      for (let i = 0; i < this.btnList.length; i++) {
        if (this.btnList[i].status === this.info.status) {
          this.currentBtns = this.btnList[i].btns
          return
        }
      }
    },

    // 取消编辑
    cancelEdit () {
      this.inEditing = false
      this.fetchData()
    },

    // 计费规则
    showChargeRules () {
      this.openDialog({
        name: 'order/create/CounterDialog.vue',
        data: {
          value: 0
        },
        methods: {
          ok (charge) {
            this.payment.freightFee = charge || 0
          }
        }
      })
    },

    // 添加订单
    addOrder () {
      this.openDialog({
        name: 'transport/dialog/addOrder',
        data: {},
        methods: {
          add (orders) {
            console.log(orders)
          }
        }
      })
    }
  }
}
