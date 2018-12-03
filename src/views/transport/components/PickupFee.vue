<template>
  <Form ref="pickUpFeeForm" :label-width="62" :model="payment" :rules="rules" class="transport-detail" label-position="left">
    <div class="part" style="padding-bottom: 5px;">
      <Row class="detail-field-group">
        <i-col span="5">
          <FormItem :label="sendWay === '1' ? '运输费：': '油费：'" prop="freightFee" class="fee-fix">
            <TagNumberInput v-model="payment.freightFee" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="装货费：" prop="loadFee" class="fee-fix">
            <TagNumberInput v-model="payment.loadFee" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="卸货费：" prop="unloadFee" class="fee-fix">
            <TagNumberInput v-model="payment.unloadFee" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="保险费：" prop="insuranceFee" class="fee-fix">
            <TagNumberInput v-model="payment.insuranceFee" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="4">
          <FormItem label="其他：" prop="otherFee" class="other-fee-fix">
            <TagNumberInput v-model="payment.otherFee" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
      </Row>
      <Row class="detail-field-group">
        <i-col span="24">
          <span class="detail-field-title-sm" style="vertical-align: unset;margin-left: 10px;">费用合计：</span>
          <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
        </i-col>
      </Row>
    </div>

    <div v-if="sendWay === '1'" class="part">
      <Row class="detail-field-group">
        <i-col span="24">
          <span class="detail-field-title detail-field-required" style="width: 92px;">结算方式：</span>
          <div class="detail-payment-way">
            <RadioGroup v-model="settlementType">
              <Radio label="1">按单结</Radio>
              <Radio label="2">月结</Radio>
            </RadioGroup>
            <PayInfo
              v-if="settlementType === '1'"
              ref="$payInfo"
              :total="paymentTotal"
              :data="settlementPayInfo"
              class="detail-field-payinfo"
              mode="edit" />
          </div>
        </i-col>
      </Row>
    </div>
  </Form>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import TagNumberInput from '@/components/TagNumberInput'
import validator from '@/libs/js/validate'
import PayInfo from './PayInfo'

export default {
  name: 'PickupFeeComponent',
  components: { TagNumberInput, PayInfo },
  mixins: [ BaseDialog ],
  props: {
    //  1 外转 2 自送 自送不显示多段付
    sendWay: {
      type: String,
      default: '1'
    }
  },
  data () {
    // 9位整数 2位小数
    const validateFee = (rule, value, callback) => {
      if ((value && validator.fee(value)) || !value) {
        callback()
      } else {
        callback(new Error('费用整数位最多输入9位,小数2位'))
      }
    }
    return {
      payment: {
        freightFee: null,
        loadFee: null,
        unloadFee: null,
        insuranceFee: null,
        otherFee: null
      },
      rules: {
        // 运输费
        freightFee: [
          // { required: true, type: 'number', message: '请输入运输费用' },
          { validator: validateFee }
        ],
        // 装货费用
        loadFee: [
          { validator: validateFee }
        ],
        // 卸货费用
        unloadFee: [
          { validator: validateFee }
        ],
        // 保险费用
        insuranceFee: [
          { validator: validateFee }
        ],
        // 其他费用
        otherFee: [
          { validator: validateFee }
        ]
      },
      settlementType: '1',
      settlementPayInfo: []
    }
  },
  computed: {
    // 计算总费用
    paymentTotal () {
      let total
      total = Number(this.payment.freightFee) +
              Number(this.payment.loadFee) +
              Number(this.payment.unloadFee) +
              Number(this.payment.insuranceFee) +
              Number(this.payment.otherFee)
      return parseFloat(total.toFixed(2))
    }
  },
  created () {
    // 支付信息表格展示内容根据类型改变
    this.settlementPayInfo = [
      { payType: 2, fuelCardAmount: '', cashAmount: '' }
    ]
  },
  methods: {
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      temp.freightFee = temp.freightFee * 100 || null
      temp.loadFee = temp.loadFee * 100 || null
      temp.unloadFee = temp.unloadFee * 100 || null
      temp.insuranceFee = temp.insuranceFee * 100 || null
      temp.otherFee = temp.otherFee * 100 || null
      return temp
    },
    // payInfo组件数据校验
    payInfoValid () {
      // console.log(this.$refs.$payInfo, this.$refs.$payInfo.validate())
      if (this.settlementType === '1' && !this.$refs.$payInfo.validate()) return false
      return true
    },
    getSettlementPayInfo () {
      return this.settlementType === '1' ? this.$refs.$payInfo.getPayInfo() : void 0
    },
    // 派车模块数据校验
    validate () {
      if (!this.payInfoValid()) return
      let check
      this.$refs.pickUpFeeForm.validate((valid) => {
        check = valid
      })
      return check
    }
  }
}

</script>
<style lang='stylus'>
 @import "../style/detail.styl"

 .part

   .ivu-form-item-label
     color #777
     font-size 14px
     padding 10px 0 10px

   .padding-left-label
    .ivu-form-item-label
      padding-left 10px

   .fee-fix
    .ivu-form-item-label
      padding-left 10px
      width 72px !important
    .ivu-form-item-content
      margin-left 72px !important

   .other-fee-fix
    .ivu-form-item-label
      width 52px !important
    .ivu-form-item-content
      margin-left 52px !important

   .label-width
    .ivu-form-item-label
      width 92px !important
  .detail-payment-way
    width calc(100% - 100px) !important
</style>
<style lang='stylus' scoped>
  .part
    padding 10px 0 20px
    border-bottom none
</style>
