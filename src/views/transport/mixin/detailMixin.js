/**
 * 送货管理、提货管理、外转管理详情公有防范
 */

import _ from 'lodash'
import Server from '@/libs/js/server'
import Float from '@/libs/js/float'
import { CAR } from '@/views/client/client'

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

      showLog: false,
      logList: [], // 操作日志
      exceptionCount: 0,
      // 异常详情label
      expLabel: (h) => {
        return h('div', [
          h('span', {
            domProps: {
              innerHTML: `异常详情  ${this.exceptionCount}`
            }
          })
        ])
      }
    }
  },

  created () {
    this.fetchData()
  },

  computed: {
    // 根据日志收起展开动态计算高度
    logListHeight () {
      return { height: this.showLog ? 41 * this.logList.length + 'px' : '18px' }
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
    // 根据状态及权限展示按钮组
    showButtons () {
      return this.currentBtns.filter(item => {
        return this.hasPower(item.code)
      })
    },
    isAbnomal () {
      return this.$route.query.abnormal === 1
    }
  },

  watch: {
    // 编辑状态为货物列表添加操作栏
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

    // 添加订单
    addOrder (type) {
      const self = this
      self.openDialog({
        name: 'transport/dialog/addOrder',
        data: {
          type,
          billHasSelected: _.uniq(self.detail.map(item => item.orderId))
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
      return typeof money === 'number' ? money / 100 : null
    },

    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        if (typeof temp[key] === 'number') temp[key] = temp[key] * 100
      }
      return temp
    },

    // 校验
    validate () {
      if (!this.info.start) {
        this.$Message.error('请选择始发地')
        return false
      }
      if (!this.info.end) {
        this.$Message.error('请选择目的地')
        return false
      }
      if (this.pageName === 'pickup' && !this.info.carrierName) {
        this.$Message.error('请输入承运商')
        return false
      }
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
      if (this.settlementType === '1' && !this.$refs.$payInfo.validate()) return false

      return true
    },

    // 上传按钮
    updateExcept (data) {
      // data: {
      //   id: this.id,
      //   type: type // 单据类型 1 提货单 2 外转单 3 运单
      // }
      console.log('编辑对话', data)
      const self = this
      this.openDialog({
        name: 'transport/dialog/abnormal',
        data,
        methods: {
          complete () {
            self.fetchData()
          }
        }
      })
    }
  }
}
