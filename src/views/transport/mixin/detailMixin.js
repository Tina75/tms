/**
 * 送货管理、提货管理、外转管理详情公有防范
 */

import _ from 'lodash'
import Float from '@/libs/js/float'
import { CAR } from '@/views/client/pages/client'
import { mapActions, mapGetters } from 'vuex'
import { roundFee, roundVolume, roundWeight, roundWeightKg, divideFee, divideFeeOrNull, isNumber } from '@/libs/js/config'
import NP from 'number-precision'
export default {
  data () {
    return {
      id: this.$route.query.id,
      no: this.$route.query.no,

      loading: false,
      inEditing: 'no', // no - 无状态 edit - 编辑状态 change - 改单状态
      carriers: [], // 承运商
      carrierDrivers: [], // 司机
      carrierCars: [], // 车辆
      currentBtns: [], // 当前按钮组

      detail: [], // 货物明细
      orderList: [], // 订单明细，用于分摊策略 v1.08新增

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
      changeCount: 0,
      // 异常详情label
      expLabel: (h) => {
        return h('div', [
          h('span', {
            domProps: {
              innerHTML: `异常详情  ${this.exceptionCount}`
            }
          })
        ])
      },
      // 改单详情label
      changelabel: (h) => {
        return h('div', [
          h('span', {
            domProps: {
              innerHTML: `改单记录  ${this.changeCount}`
            }
          })
        ])
      },
      // 吨列
      columnWeight: {
        title: '重量(吨)',
        key: 'weight',
        width: 140,
        render: (h, p) => {
          return h('div', {},
            p.row.cargoList.map((cargo) => h('div', { style: { 'lineHeight': 2 } }, isNumber(cargo.weight) ? cargo.weight : '-')))
        }
      },
      // 公斤列
      columnWeightKg: {
        title: '重量(公斤)',
        key: 'weightKg',
        width: 140,
        render: (h, p) => {
          return h('div', {},
            p.row.cargoList.map((cargo) => h('div', { style: { 'lineHeight': 2 } }, isNumber(cargo.weightKg) ? cargo.weightKg : '-')))
        }
      }
    }
  },

  created () {
    this.fetchData()
  },

  computed: {
    ...mapGetters([
      'WeightOption' // 重量配置 1 吨  2 公斤
    ]),
    // 根据日志收起展开动态计算高度
    logListHeight () {
      return { height: this.showLog ? 41 * this.logList.length + 'px' : '18px' }
    },
    // 支付总额
    paymentTotal () {
      let total
      total = NP.plus(
        Number(this.payment.freightFee),
        Number(this.payment.loadFee),
        Number(this.payment.unloadFee),
        Number(this.payment.insuranceFee),
        Number(this.payment.otherFee)
      )
      // total = Number(this.payment.freightFee) +
      //         Number(this.payment.loadFee) +
      //         Number(this.payment.unloadFee) +
      //         Number(this.payment.insuranceFee) +
      //         Number(this.payment.otherFee)
      if (this.pageName === 'feright') total = NP.plus(total, Number(this.payment.tollFee))
      return roundFee(total)
    },
    // 货物总计
    orderTotal () {
      return this.detail.reduce((last, item) => {
        const cargoCost = divideFee(item.cargoCost)
        return {
          cargoCost: roundFee(last.cargoCost + cargoCost),
          quantity: Float.round(last.quantity + item.quantity),
          weight: roundWeight(last.weight + item.weight),
          weightKg: roundWeightKg(last.weightKg + item.weightKg),
          volume: roundVolume(last.volume + item.volume)
        }
      }, {
        cargoCost: 0,
        quantity: 0,
        weight: 0,
        weightKg: 0,
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
    },
    activeTab () {
      return !this.isAbnomal ? 'detail' : 'exception'
    }
  },

  watch: {
    // 编辑状态且为待发运为货物列表添加操作栏
    inEditing (val) {
      if (!this.tableCanEdit) return
      if (this.status === '在途' || this.status === '已到货') return
      if (val === 'edit' && (this.status === '待发运' || this.status === '待提货')) {
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
                  // 移除货物列表，也要同步移除对应id的订单列表，分摊策略需校验
                  const list = this.orderList.filter(item => item.orderId !== id)
                  this.orderList = list
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
    ...mapActions([ 'getCargoDetail' ]),
    /**
     * 货物明细渲染,需要按货物单号分组
     * @param {*} h
     * @param {*} p
     * @param {*} key
     */
    scopedSlotsRender (h, p, key, defaultString = '-') {
      if (p.row.cargoList) {
        return h('div', {},
          // p.row.cargoList.map((cargo) => h('div', cargo[key] || defaultString))
          p.row.cargoList.map((cargo) => this.tableDataRender(h, cargo[key] || defaultString))
        )
      }
      return h('span', '-')
    },
    // 格式化包装尺寸
    formatDimension (cargo) {
      let text = ''
      if (isNumber(cargo.dimension.length) || isNumber(cargo.dimension.width) || isNumber(cargo.dimension.height)) {
        text = (isNumber(cargo.dimension.length) ? cargo.dimension.length : '-') + ' x ' + (isNumber(cargo.dimension.width) ? cargo.dimension.width : '-') + ' x ' + (isNumber(cargo.dimension.height) ? cargo.dimension.height : '-')
      } else {
        text = '-'
      }
      return text
    },
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
      this.inEditing = 'no'
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
            // 查询货物详情
            self.getCargoDetail(ids).then(list => {
              list.cargoList.forEach(item => {
                self.detail.push(item)
              })
              // 添加货物需同步对应订单信息
              list.orderList.forEach(item => {
                self.orderList.push(item)
              })
            })
          }
        }
      })
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      // return typeof money === 'number' ? money / 100 : null
      return divideFeeOrNull(money)
    },

    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        // if (typeof temp[key] === 'number') temp[key] = temp[key] * 100
        if (typeof temp[key] === 'number') {
          if (key === 'mileage') {
            temp[key] = Float.round(temp[key] * 1000)
          } else {
            temp[key] = Float.round(temp[key] * 100)
          }
        } else {
          temp[key] = 0
        }
      }
      return temp
    },

    // 校验
    validate () {
      if (this.pageName === 'feright' && !this.info.start) {
        this.$Message.error('请选择始发地')
        return false
      }
      if (this.pageName === 'feright' && !this.info.end) {
        this.$Message.error('请选择目的地')
        return false
      }
      if (this.pageName === 'feright' && !this.info.carrierName && this.inEditing === 'change') { // 改单时承运商不能为空
        this.$Message.error('请输入承运商')
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
