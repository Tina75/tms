<template>
  <Modal v-model="show" :mask-closable="false" transfer class="transport-action" width="1032"  @on-visible-change="close">
    <p slot="header" style="text-align:center">
      派车
    </p>
    <div class="sub-title">
      <div class="send-label">派车方式：</div>
      <RadioGroup v-model="sendWay">
        <Radio label="2">自送</Radio>
        <Radio label="1">外转</Radio>
        <!-- <Radio label="3">下发承运商</Radio> -->
      </RadioGroup>
    </div>
    <div>
      <send-carrier-info
        v-if="sendWay === '1'"
        ref="SendCarrierInfo"
        :carrier-info="carrierInfo"
        :source-type="type === 'sendCar' ?  'sendCar' : 'pickup'"></send-carrier-info>
      <own-send-info v-else ref="ownSendInfo" :form="ownInfo"></own-send-info>

      <send-fee
        v-if="type === 'sendCar'"
        ref="sendFee"
        :payment="payment"
        :settlement-type="settlementType"
        :settlement-pay-info="settlementPayInfo"
        :finance-rules-info="financeRulesInfo"
        :send-way="sendWay"
        :send-fee-orders="orderList"
        :fee-pass-allocation="allocationStrategy">
      </send-fee>
      <pickup-fee
        v-else
        ref="pickupFee"
        :payment="payment"
        :settlement-type="settlementType"
        :settlement-pay-info="settlementPayInfo"
        :send-way="sendWay"
        :pick-fee-orders="orderList"
        :fee-pass-allocation="allocationStrategy"></pickup-fee>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button :loading="btnLoading" type="primary" @click="submit">确定</Button>
      <Button type="default" @click.native="close">取消</Button>
      <Button type="default" style="width: 35px; height: 35px;min-width: 0;padding: 0;vertical-align: top;" @click.native="toSetting">
        <FontIcon type="shezhi" size="20" color="#999"></FontIcon>
      </Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'

import SendFee from '../components/SendFee'
import SendCarrierInfo from '../components/SendCarrierInfo'
import OwnSendInfo from '../components/ownSendInfo'
import PickupFee from '../components/PickupFee'
import { defaultOwnForm } from '@/components/own-car-form/mixin.js'
import Server from '@/libs/js/server'
import float from '@/libs/js/float'
import FontIcon from '@/components/FontIcon'
import _ from 'lodash'
import TMSURL from '@/libs/constant/url'
import { divideMileage, divideFeeOrNull } from '@/libs/js/config'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SendOrPickAction',
  components: { SendFee, SendCarrierInfo, OwnSendInfo, PickupFee, FontIcon },
  mixins: [ BaseDialog ],

  data () {
    return {
      show: true,
      loading: false,
      financeRulesInfo: {
        start: null,
        end: null,
        weight: null,
        volume: null,
        cargoInfos: null
      },
      sendWay: '1',
      // 外转赋值给子组件
      carrierInfo: {
        assignCarType: 1, // 派车类型，1：外转，2：自送
        carrierName: '',
        driverName: '',
        driverPhone: '',
        carNo: '',
        carType: '',
        carLength: '',
        remark: '',
        carrierWaybillNo: '' // 承运商运单号
      },
      // 自送赋值给子组件
      ownInfo: {
        assignCarType: 1, // 派车类型，1：外转，2：自送
        ...defaultOwnForm
      },
      payment: {
        freightFee: null,
        loadFee: null,
        unloadFee: null,
        insuranceFee: null,
        otherFee: null,
        cashBack: null,
        tollFee: null, // 路桥费
        mileage: null, // 计费里程 v1.06 新增
        accommodation: null, // 住宿费 v1.08 新增
        infoFee: null // 信息费 v1.11 新增
      },
      settlementType: '',
      settlementPayInfo: [],
      btnLoading: false,
      orderList: [], // 订单list
      allocationStrategy: null // 编辑的时候需要带入的分摊策略，1、按订单数  2、按件数 3、按重量 4、按体积
    }
  },
  computed: {
    ...mapGetters([
      'DispatchSet'
    ])
  },
  created () {
    if (this.type === 'sendCar') {
      if (this.DispatchSet.paySettlementAdvanceOption === 1) { // 预付
        this.settlementPayInfo.push(
          { payType: 1, fuelCardAmount: '', cashAmount: '' }
        )
      }
      if (this.DispatchSet.paySettlementArriveOption === 1) { // 到付
        this.settlementPayInfo.push(
          { payType: 2, fuelCardAmount: '', cashAmount: '' }
        )
      }
      if (this.DispatchSet.paySettlementReceiptOption === 1) { // 回付
        this.settlementPayInfo.push(
          { payType: 3, fuelCardAmount: '', cashAmount: '' }
        )
      }
      if (this.DispatchSet.paySettlementTailOption === 1) { // 尾款
        this.settlementPayInfo.push(
          { payType: 4, fuelCardAmount: '', cashAmount: '' }
        )
      }
    } else {
      this.settlementPayInfo = [
        { payType: 2, fuelCardAmount: '', cashAmount: '' }
      ]
    }
    // 受理开单 不请求
    if (this.actionOrigin !== 'orderCreate') {
      this.fetchData()
    } else {
      this.settlementType = '1'
      if (this.type === 'pickUp') {
        delete this.payment.cashBack // 提货去掉返现运费
        delete this.payment.tollFee // 提货去掉路桥费
        delete this.payment.mileage // 提货去掉计费里程
        delete this.payment.accommodation // 提货去掉住宿费
        delete this.payment.infoFee // 提货去掉信息费
      } else {
        for (let key in this.financeRulesInfo) {
          this.financeRulesInfo[key] = this.orderCreate[key]
        }
        this.payment.mileage = this.orderCreate.distance ? this.orderCreate.distance / 1000 : null // 送货计费规则参数同步
      }
    }
  },
  methods: {
    ...mapActions([
      'checkDriverPhone'
    ]),
    // 查询数据
    fetchData () {
      this.loading = true
      Server({
        url: this.type === 'sendCar' ? '/waybill/details' : '/load/bill/details',
        method: 'post',
        data: { [this.type === 'sendCar' ? 'waybillId' : 'pickUpId']: this.id }
      }).then(res => {
        const data = res.data.data
        // 订单数量
        this.orderList = data.orderList

        const billInfo = this.type === 'sendCar' ? data.waybill : data.loadbill

        // 派车方式
        this.sendWay = billInfo.assignCarType.toString()
        // 带入已有的分摊策略
        this.allocationStrategy = billInfo.allocationStrategy

        // 将承运商信息赋值给子组件
        if (this.sendWay === '1') { // 外转
          for (let key in this.carrierInfo) {
            this.carrierInfo[key] = billInfo[key]
          }
        } else { // 自送
          for (let key in this.ownInfo) {
            this.ownInfo[key] = billInfo[key]
          }
        }

        if (this.type === 'sendCar') {
          for (let key in this.financeRulesInfo) {
            this.financeRulesInfo[key] = billInfo[key]
          }
          // 将货物信息按货物名称累加数量
          let arr = []
          let list = _.groupBy(data.cargoList, 'cargoName')
          _.forEach(list, (value, key) => {
            let quantity = _.sumBy(value, (i) => {
              return i.quantity
            })
            arr.push({
              key: key,
              value: quantity
            })
          })
          this.financeRulesInfo.cargoInfos = arr
          // console.log(this.financeRulesInfo)
        }

        for (let key in this.payment) {
          this.payment[key] = this.setMoneyUnit2Yuan(billInfo[key])
          if (key === 'mileage') {
            this.payment[key] = divideMileage(billInfo[key])
          }
        }

        if (this.type === 'pickUp') {
          delete this.payment.cashBack // 提货去掉返现运费
          delete this.payment.tollFee // 提货去掉路桥费
          delete this.payment.tollFee // 提货去掉计费里程
          delete this.payment.accommodation // 提货去掉住宿费
          delete this.payment.infoFee // 提货去掉信息费
        }

        this.settlementType = billInfo.settlementType ? billInfo.settlementType.toString() : '1'
        // 将收费信息中的金额单位转为元
        let temp = this.settlementPayInfo.map((item, i) => {
          if (!billInfo.settlementPayInfo[i]) return item
          else {
            const temp = billInfo.settlementPayInfo[i]
            temp.fuelCardAmount = this.setMoneyUnit2Yuan(temp.fuelCardAmount)
            temp.cashAmount = this.setMoneyUnit2Yuan(temp.cashAmount)
            return Object.assign(item, temp)
          }
        })
        this.settlementPayInfo = temp

        this.loading = false
      }).catch()
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      return divideFeeOrNull(money)
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        if (typeof temp[key] === 'number') {
          if (key === 'mileage') {
            temp[key] = float.round(temp[key] * 1000)
          } else {
            temp[key] = float.round(temp[key] * 100)
          }
        }
      }
      return temp
    },

    submit () {
      if (this.actionOrigin !== 'orderCreate') {
        if (this.type === 'sendCar') {
          this.doSendAction()
        } else {
          this.doPickAction()
        }
      } else {
        this.doImmediately()
      }
    },

    // 派车模块数据校验
    checkSendValidate () {
      const z = this
      let sendFeeComp = z.$refs.sendFee
      let carrierInfoComp = z.$refs.SendCarrierInfo
      let ownSendInfo = z.$refs.ownSendInfo
      if (z.sendWay === '1' && carrierInfoComp.checkCarrierInfo() && sendFeeComp.validate()) {
        return true
      }
      if (z.sendWay === '2' && ownSendInfo.checkOwnSendInfo() && sendFeeComp.validate()) {
        return true
      }
      return false
    },
    // 送货派车
    doSendAction () {
      const z = this
      if (!z.checkSendValidate()) return
      z.btnLoading = true
      let data = {
        waybillId: this.id || '',
        assignCarType: z.sendWay
      }
      // 订单数大于1需要传分摊策略
      if (this.orderList.length > 1) {
        data.allocationStrategy = z.$refs.sendFee.getAllocationStrategy()
      }
      if (z.sendWay === '1') { // 外转
        data = Object.assign(data, z.$refs.sendFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.sendFee.getSettlementType(),
          settlementPayInfo: z.$refs.sendFee.getSettlementPayInfo()
        })
        // 填了司机手机号需要走校验
        if (z.$refs.SendCarrierInfo.getCarrierInfo().driverPhone) {
          z.isPhoneUsed(z.$refs.SendCarrierInfo, data)
        } else {
          z.callSendInterface(data)
        }
      } else if (z.sendWay === '2') { // 自送
        data = Object.assign(data, z.$refs.sendFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
        delete data.cashBack // 自送没有返现
        // 填了司机手机号需要走校验
        if (z.$refs.ownSendInfo.getOwnSendInfo().driverPhone || z.$refs.ownSendInfo.getOwnSendInfo().assistantDriverPhone) {
          z.isPhoneUsed(z.$refs.ownSendInfo, data)
        } else {
          z.callSendInterface(data)
        }
      }
    },

    // 调送货派车接口
    callSendInterface (data) {
      const z = this
      Server({
        url: '/waybill/assign/vehicle',
        method: 'post',
        data: data
      }).then(() => {
        this.$Message.success('操作成功')
        z.btnLoading = false
        this.complete()
        this.close()
      }).catch(() => {
        z.btnLoading = false
      })
    },

    // 提货模块数据校验
    checkPickValidate () {
      const z = this
      let pickFeeComp = z.$refs.pickupFee
      let carrierInfoComp = z.$refs.SendCarrierInfo
      let ownSendInfo = z.$refs.ownSendInfo
      if (z.sendWay === '1' && carrierInfoComp.checkCarrierInfo() && pickFeeComp.validate()) {
        return true
      }
      if (z.sendWay === '2' && ownSendInfo.checkOwnSendInfo() && pickFeeComp.validate()) {
        return true
      }
      return false
    },

    // 提货派车
    doPickAction () {
      const z = this
      if (!z.checkPickValidate()) return
      z.btnLoading = true
      let data = {
        pickUpId: this.id || '',
        assignCarType: z.sendWay
      }
      // 订单数大于1需要传分摊策略
      if (this.orderList.length > 1) {
        data.allocationStrategy = z.$refs.pickupFee.getAllocationStrategy()
      }
      if (z.sendWay === '1') { // 外转
        data = Object.assign(data, z.$refs.pickupFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.pickupFee.getSettlementType(),
          settlementPayInfo: z.$refs.pickupFee.getSettlementPayInfo()
        })
        delete data.mileage // 提货去掉里程数
        // 填了司机手机号需要走校验
        if (z.$refs.SendCarrierInfo.getCarrierInfo().driverPhone) {
          z.isPhoneUsed(z.$refs.SendCarrierInfo, data)
        } else {
          z.callPickupInterface(data)
        }
      } else if (z.sendWay === '2') { // 自送
        data = Object.assign(data, z.$refs.pickupFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
        delete data.mileage // 提货去掉里程数
        // 填了司机手机号需要走校验
        if (z.$refs.ownSendInfo.getOwnSendInfo().driverPhone || z.$refs.ownSendInfo.getOwnSendInfo().assistantDriverPhone) {
          z.isPhoneUsed(z.$refs.ownSendInfo, data)
        } else {
          z.callPickupInterface(data)
        }
      }
    },

    // 调提货派车接口
    callPickupInterface (data) {
      const z = this
      Server({
        url: '/load/bill/pick/up',
        method: 'post',
        data: data
      }).then(() => {
        this.$Message.success('操作成功')
        z.btnLoading = false
        this.complete()
        this.close()
      }).catch(() => {
        z.btnLoading = false
      })
    },

    // 立即发运
    doImmediately () {
      const z = this
      let data = {
        assignCarType: z.sendWay
      }
      if (this.type === 'sendCar') {
        if (!z.checkSendValidate()) return
        if (z.sendWay === '1') { // 外转
          data = Object.assign(data, z.$refs.sendFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
            settlementType: z.$refs.sendFee.getSettlementType(),
            settlementPayInfo: z.$refs.sendFee.getSettlementPayInfo()
          })
        } else if (z.sendWay === '2') { // 自送
          data = Object.assign(data, z.$refs.sendFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
          delete data.cashBack // 自送没有返现
        }
        this.complete(data)
        this.close()
      } else if (this.type === 'pickUp') {
        if (!z.checkPickValidate()) return
        if (z.sendWay === '1') { // 外转
          data = Object.assign(data, z.$refs.pickupFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
            settlementType: z.$refs.pickupFee.getSettlementType(),
            settlementPayInfo: z.$refs.pickupFee.getSettlementPayInfo()
          })
        } else if (z.sendWay === '2') { // 自送
          data = Object.assign(data, z.$refs.pickupFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
        }
        delete data.mileage // 提货去掉里程数
        this.complete(data)
        this.close()
      }
    },

    // 校验主副司机手机号有没有被更改
    isPhoneUsed (comp, data) {
      const z = this
      let phoneList = []
      if (z.sendWay === '1') { // 外转
        comp.getCarrierInfo().driverPhone && phoneList.push(comp.getCarrierInfo().driverPhone)
      } else {
        comp.getOwnSendInfo().driverPhone && phoneList.push(comp.getOwnSendInfo().driverPhone)
        comp.getOwnSendInfo().assistantDriverPhone && phoneList.push(comp.getOwnSendInfo().assistantDriverPhone)
      }
      z.checkDriverPhone(phoneList).then((res) => {
        // res[0].used = true
        if (!_.every(res, { used: false })) { // 有变更过手机号
          let name = ''
          if (z.sendWay === '1') {
            if (_.every(res, { used: true })) {
              name = '司机'
            }
          } else {
            if (res.length > 1 && _.every(res, { used: true })) {
              name = '主司机和副司机'
            } else {
              let obj = _.find(res, { used: true })
              if (obj.phone === comp.getOwnSendInfo().driverPhone) {
                name = '主司机'
              }
              if (obj.phone === comp.getOwnSendInfo().assistantDriverPhone) {
                name = '副司机'
              }
            }
          }
          z.checkPhoneDialog(name, data)
        } else {
          z.type === 'sendCar' ? z.callSendInterface(data) : z.callPickupInterface(data)
        }
      })
      this.btnLoading = false
    },
    // 打开司机手机号校验弹窗
    checkPhoneDialog (name, data) {
      const _this = this
      _this.openDialog({
        name: 'transport/dialog/checkDriverPhone',
        data: { name: name },
        methods: {
          ok (node) {
            _this.type === 'sendCar' ? _this.callSendInterface(data) : _this.callPickupInterface(data)
          }
        }
      })
    },
    // 跳转派车设置页面
    toSetting () {
      this.openTab({
        path: TMSURL.SETTING,
        title: '设置',
        query: {
          tab: 'dispatch'
        }
      })
      this.close()
    }
  }
}

</script>
<style lang='stylus'>
 .transport-action
  .ivu-modal-body
    padding 10px 40px 16px 30px
  .ivu-form
    .ivu-form-item-label
      font-size 14px
      font-family 'PingFangSC-Regular'
      color #777
</style>
<style lang='stylus' scoped>
.sub-title
    font-size 14px
    font-family 'PingFangSC-Medium'
    font-weight 500
    color rgba(51,51,51,1)
    padding 17px 0 18px 0
    .send-label
      display inline-block
      margin-right 20px
      vertical-align middle
    .ivu-radio-group-item
        margin-right 41px
</style>
