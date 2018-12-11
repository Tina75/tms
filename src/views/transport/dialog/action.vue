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
        :order-count="orderCount">
      </send-fee>
      <pickup-fee
        v-else
        ref="pickupFee"
        :payment="payment"
        :settlement-type="settlementType"
        :settlement-pay-info="settlementPayInfo"
        :send-way="sendWay"
        :order-count="orderCount"></pickup-fee>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button :loading="btnLoading" type="primary" @click="submit">确定</Button>
      <Button type="default" @click.native="close">取消</Button>
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

export default {
  name: 'SendOrPickAction',
  components: { SendFee, SendCarrierInfo, OwnSendInfo, PickupFee },
  mixins: [ BaseDialog ],

  data () {
    return {
      show: true,
      loading: false,
      financeRulesInfo: {
        start: null,
        end: null,
        weight: null,
        volume: null
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
        accommodation: null // 住宿费 v1.08 新增
      },
      settlementType: '',
      settlementPayInfo: [],
      btnLoading: false,
      orderCount: 1
    }
  },
  created () {
    if (this.type === 'sendCar') {
      this.settlementPayInfo = [
        { payType: 1, fuelCardAmount: '', cashAmount: '' },
        { payType: 2, fuelCardAmount: '', cashAmount: '' },
        { payType: 3, fuelCardAmount: '', cashAmount: '' }
      ]
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
      } else {
        for (let key in this.financeRulesInfo) {
          this.financeRulesInfo[key] = this.orderCreate[key]
        }
        this.payment.mileage = this.orderCreate.distance ? this.orderCreate.distance / 1000 : null // 送货计费规则参数同步
      }
    }
  },
  methods: {

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
        this.orderCount = data.cargoList.length

        const billInfo = this.type === 'sendCar' ? data.waybill : data.loadbill

        // 派车方式
        this.sendWay = billInfo.assignCarType.toString()

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
        }

        for (let key in this.payment) {
          this.payment[key] = this.setMoneyUnit2Yuan(billInfo[key])
          if (key === 'mileage') {
            this.payment[key] = billInfo[key] / 1000 || null
          }
        }

        if (this.type === 'pickUp') {
          delete this.payment.cashBack // 提货去掉返现运费
          delete this.payment.tollFee // 提货去掉路桥费
          delete this.payment.tollFee // 提货去掉计费里程
          delete this.payment.accommodation // 提货去掉住宿费
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
      }).catch(err => console.error(err))
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      // return typeof money === 'number' ? money / 100 : null
      return (typeof money === 'number' && money !== 0) ? money / 100 : null
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        if (typeof temp[key] === 'number') {
          if (key === 'mileage') {
            temp[key] = temp[key] * 1000
          } else {
            temp[key] = temp[key] * 100
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
      if (z.sendWay === '1') { // 外转
        data = Object.assign(data, z.$refs.sendFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.sendFee.getSettlementType(),
          settlementPayInfo: z.$refs.sendFee.getSettlementPayInfo()
        })
      } else if (z.sendWay === '2') { // 自送
        data = Object.assign(data, z.$refs.sendFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
        delete data.cashBack // 自送没有返现
      }
      Server({
        url: '/waybill/assign/vehicle',
        method: 'post',
        data
      }).then(res => {
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
      if (z.sendWay === '1') { // 外转
        data = Object.assign(data, z.$refs.pickupFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.pickupFee.getSettlementType(),
          settlementPayInfo: z.$refs.pickupFee.getSettlementPayInfo()
        })
      } else if (z.sendWay === '2') { // 自送
        data = Object.assign(data, z.$refs.pickupFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
      }
      delete data.mileage // 提货去掉里程数
      Server({
        url: '/load/bill/pick/up',
        method: 'post',
        data
      }).then(res => {
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
