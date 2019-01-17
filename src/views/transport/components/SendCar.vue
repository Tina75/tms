<template>
  <div>
    <div :style="source === 'action' && 'border-top: none;'" class="sub-title">
      <div class="send-label">派车方式：</div>
      <RadioGroup v-model="sendWay">
        <Radio label="2">自送</Radio>
        <Radio label="1">外转</Radio>
        <!-- <Radio label="3">下发承运商</Radio> -->
      </RadioGroup>
    </div>
    <div v-if="sendWay === '1'">
      <send-carrier-info ref="SendCarrierInfo"></send-carrier-info>

      <send-fee
        ref="sendFee"
        :mileage="mileage"
        :send-fee-orders="sendOrders"
        :finance-rules-info="financeRulesInfo"
        :settlement-pay-info="settlementPayInfo">
      </send-fee>
    </div>
    <div v-else>
      <own-send-info ref="ownSendInfo"></own-send-info>
      <send-fee
        ref="sendFee"
        :send-fee-orders="sendOrders"
        send-way="2"></send-fee>
    </div>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SendFee from './SendFee'
import SendCarrierInfo from './SendCarrierInfo'
import OwnSendInfo from './ownSendInfo'
import { mapGetters } from 'vuex'
// import Server from '@/libs/js/server'

export default {
  name: 'SendCarComponent',
  components: { SendFee, SendCarrierInfo, OwnSendInfo },
  mixins: [ BaseDialog ],
  props: {
    // 传入的订单list,需要校验数量、体积、重量
    sendOrders: {
      type: Array
    },
    mileage: {
      type: [Number, String],
      default: null
    },
    // 计费规则传入start、end、weight、volume
    financeRulesInfo: {
      type: Object
    },
    // 页面来源
    source: {
      type: String,
      default: 'dispatch'
    }
  },
  data () {
    return {
      sendWay: '1',
      settlementPayInfo: []
    }
  },
  computed: {
    ...mapGetters([
      'DispatchSet'
    ])
  },
  created () {
    this.sendWay = this.DispatchSet.selfSendOption === 1 ? '2' : '1' // 派车方式优先读取配置
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
  },
  methods: {
    // 外转info传参
    getCarrierInfo () {
      return this.$refs.SendCarrierInfo.getCarrierInfo()
    },
    // 自送info传参
    getOwnSend () {
      return this.$refs.ownSendInfo.getOwnSendInfo()
    },
    // 格式化金额单位为分
    getformatMoney () {
      return this.$refs.sendFee.formatMoney()
    },
    // 多段付类型
    getSettlementType () {
      return this.$refs.sendFee.getSettlementType()
    },
    // 多段付传参
    getSettlementPayInfos () {
      return this.$refs.sendFee.getSettlementPayInfo()
    },
    // 分摊策略传参
    getAllocationStrategy () {
      return this.$refs.sendFee.getAllocationStrategy()
    },
    // 派车模块数据校验
    checkValidate () {
      if (this.sendWay === '1' && this.getCheckCarrierInfo() && this.$refs.sendFee.validate()) {
        return true
      }
      if (this.sendWay === '2' && this.getCheckOwnSendInfo() && this.$refs.sendFee.validate()) {
        return true
      }
      return false
    },
    // 承运商信息校验
    getCheckCarrierInfo () {
      return this.$refs.SendCarrierInfo.checkCarrierInfo()
    },
    // 自送info信息校验
    getCheckOwnSendInfo () {
      return this.$refs.ownSendInfo.checkOwnSendInfo()
    }
  }
}

</script>
<style lang='stylus'>
 @import "../style/detail.styl"

 .part
   padding-top 12px
   margin-bottom 12px
   border-bottom 1px dashed #CBCED3

   .ivu-form-item-label
     color #777
     font-size 14px
     padding 10px 0 10px

   .padding-left-label
    .ivu-form-item-label
      padding-left 10px

  .detail-payment-way
    width calc(100% - 100px) !important
</style>
<style lang='stylus' scoped>
  .sub-title
    font-size 14px
    font-family 'PingFangSC-Medium'
    font-weight 500
    color rgba(51,51,51,1)
    padding 17px 0 18px 0
    border-top 1px dashed rgba(203,206,211,1)
    .send-label
      display inline-block
      margin-right 20px
      vertical-align middle
    .ivu-radio-group-item
        margin-right 41px
</style>
