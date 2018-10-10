import MoneyInput from '../components/MoneyInput'
import Server from '@/libs/js/server'
import Float from '@/libs/js/float'
import { CAR } from '@/views/client/client'
import { validateCityies } from '@/libs/constant/cityValidator'

export default {
  data () {
    return {
      id: this.$route.query.id,
      no: this.$route.query.no,
      loading: false,
      inEditing: false,
      carriers: [], // 承运商
      carrierDrivers: [], // 司机
      carrierCars: [], // 车辆
      currentBtns: [], // 当前按钮组

      detail: [], // 货物明细

      // 费用
      payment: {
        freightFee: '',
        loadFee: '',
        unloadFee: '',
        insuranceFee: '',
        otherFee: '',
        totalFee: ''
      },

      // 支付方式表格
      tablePayment: [
        {
          title: '付款方式',
          key: 'payType',
          align: 'center',
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
              return h(MoneyInput, {
                props: {
                  value: p.row.cashAmount,
                  placeholder: '请输入',
                  suffix: false
                },
                style: {
                  width: '70px'
                },
                on: {
                  'on-blur': (money) => {
                    let temp = p.row
                    temp.cashAmount = money
                    this.settlementPayInfoBack.splice(p.index, 1, temp)
                  }
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
              return h(MoneyInput, {
                props: {
                  value: p.row.fuelCardAmount,
                  placeholder: '请输入',
                  suffix: false
                },
                style: {
                  width: '70px'
                },
                on: {
                  'on-blur': (money) => {
                    let temp = p.row
                    temp.fuelCardAmount = money
                    this.settlementPayInfoBack.splice(p.index, 1, temp)
                  }
                }
              })
            }
          }
        }
      ],

      showLog: false,
      logList: []
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
      return Float.round(Number(this.payment.freightFee) +
      Number(this.payment.loadFee) +
      Number(this.payment.unloadFee) +
      Number(this.payment.insuranceFee ? this.payment.insuranceFee : 0) +
      Number(this.payment.otherFee))
    },
    // 货物总计
    orderTotal () {
      return this.detail.reduce((last, item) => {
        const cargoCost = item.cargoCost / 100
        return {
          cargoCost: Float.round(last.cargoCost + cargoCost),
          quantity: Float.round(last.quantity + item.quantity),
          weight: Float.round(last.weight + item.weight),
          volume: Float.round(last.volume + item.volume)
        }
      }, {
        cargoCost: 0,
        quantity: 0,
        weight: 0,
        volume: 0
      })
    },

    showButtons () {
      return this.currentBtns.filter(item => {
        return this.hasPower(item.code)
      })
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
                  const id = p.row.orderId
                  const temp = this.detail.filter(item => item.orderId !== id)
                  this.detail = temp
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
        if (this.btnList[i].status === this.status) {
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
      const self = this
      this.openDialog({
        name: 'dialogs/financeRule',
        data: {
          // partnerName: partnerName, // 可选
          // 以下数据必传
          partnerType: self.pageName === 'pickup' ? 3 : 2, // 计费规则分类 - 发货方1 承运商2 外转方3
          weight: self.orderTotal.weight, // 货物重量
          volume: self.orderTotal.volume, // 货物体积
          start: self.info.start, // 始发地code
          end: self.info.end // 目的地code
        },
        methods: {
          // 确认计费规则后返回金额(元)
          ok (charge) {
            self.payment.freightFee = charge || 0
          }
          // 如果有两层对话框，在计费规则中点击去设置按钮后需要关闭第一层对话框
          // closeParentDialog () {
          // self.close()
          // }
        }
      })
    },

    // 校验结算方式输入金额
    checkTotalAmount () {
      let total = 0
      this.settlementPayInfoBack.forEach(item => {
        total = total + Number(item.cashAmount) + Number(item.fuelCardAmount)
      })
      if (total !== Number(this.paymentTotal) && total !== 0) {
        this.$Message.error('结算总额应与费用合计相等')
        return false
      }
      return true
    },

    // 添加订单
    addOrder (type) {
      const self = this
      self.openDialog({
        name: 'transport/dialog/addOrder',
        data: {
          type,
          billHasSelected: Array.from(new Set(self.detail.map(item => item.orderId)))
        },
        methods: {
          confirm (ids) {
            self.fetchOrderDetail(ids)
          }
        }
      })
    },

    // 查询订单详情
    fetchOrderDetail (ids) {
      if (!ids.length) return
      Server({
        url: '/order/cargo/detail',
        method: 'post',
        data: { orderIds: ids }
      }).then(res => {
        res.data.data.cargoList.forEach(item => {
          this.detail.push(item)
        })
      }).catch(err => console.error(err))
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      return money ? money / 100 : 0
    },

    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        temp[key] = Number(temp[key]) * 100
      }
      return temp
    },
    // 格式化计费方式金额单位为分
    formatPayInfo () {
      // if (this.settlementType !== '1') return
      return this.settlementPayInfoBack.map(item => {
        return {
          payType: item.payType,
          fuelCardAmount: Number(item.fuelCardAmount) * 100,
          cashAmount: Number(item.cashAmount) * 100
        }
      })
    },
    // 校验
    validate () {
      if (this.info.start !== undefined && !this.info.start) {
        this.$Message.error('请输入始发地')
        return false
      }
      if (this.info.end !== undefined && !this.info.end) {
        this.$Message.error('请输入目的地')
        return false
      }
      if (this.info.start !== undefined || this.info.end !== undefined) return validateCityies(this.startCodes, this.endCodes)
      if (this.pageName === 'pickup' && !this.info.carrierName) {
        this.$Message.error('请输入承运商')
        return false
      }
      // if (!this.info.driverName) {
      //   this.$Message.error('请输入司机')
      //   return false
      // }
      if (this.info.driverPhone && !(/^1\d{10}$/.test(this.info.driverPhone))) {
        this.$Message.error('司机手机号格式不正确')
        return false
      }
      if (this.pageName === 'pickup' && !this.info.carNo) {
        this.$Message.error('请输入车牌号')
        return false
      }
      if (this.pageName === 'pickup' && !CAR.test(this.info.carNo)) {
        this.$Message.error('请输入正确的车牌号')
        return false
      }
      // if (!this.payment.freightFee) {
      //   this.$Message.error('请输入运输费')
      //   return false
      // }
      // if (!this.settlementType) {
      //   this.$Message.error('请选择结算方式')
      //   return false
      // }
      if (this.settlementType === '1' && !this.checkTotalAmount()) return false

      return true
    }
  }
}
