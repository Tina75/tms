<template>
  <div>
    <div class="sub-title" style="margin-bottom: 10px;">
      <div class="send-label">派车：</div>
      <RadioGroup v-model="sendWay">
        <Radio label="1">自送</Radio>
        <Radio label="2">外转</Radio>
        <Radio label="3">下发承运商</Radio>
      </RadioGroup>
    </div>
    <div v-if="sendWay === '2'">
      <send-carrier-info ref="SendCarrierInfo"></send-carrier-info>
      <pickup-fee ref="pickupFee"></pickup-fee>
    </div>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from './SelectInput.vue'
import SelectInputMixin from '../mixin/selectInputMixin'
import TagNumberInput from '@/components/TagNumberInput'
import PickupFee from './PickupFee'
import SendCarrierInfo from './SendCarrierInfo'
// import Server from '@/libs/js/server'

export default {
  name: 'PickUpComponent',
  components: { SelectInput, PickupFee, TagNumberInput, SendCarrierInfo },
  mixins: [ BaseDialog, SelectInputMixin ],

  data () {
    return {
      sendWay: '2'
    }
  },

  methods: {
    // 承运商info传参
    getCarrierInfo () {
      return this.$refs.SendCarrierInfo.getCarrierInfo()
    },
    // 格式化金额单位为分
    getformatMoney () {
      return this.$refs.pickupFee.formatMoney()
    },
    // 多段付传参
    getSettlementPayInfos () {
      return this.$refs.pickupFee.getSettlementPayInfo()
    },
    // 派车模块数据校验
    checkValidate () {
      if (this.getCheckCarrierInfo() && this.$refs.pickupFee.validate()) {
        return true
      }
      return false
    },
    // 承运商信息校验
    getCheckCarrierInfo () {
      return this.$refs.SendCarrierInfo.checkCarrierInfo()
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

   .label-width
    .ivu-form-item-label
      width 92px !important
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
