<template>
  <Form ref="pickUpFeeForm" :label-width="62" :model="payment" :rules="rules" class="transport-detail" label-position="left">
    <div class="part" style="padding-bottom: 5px;">
      <Row class="detail-field-group">
        <i-col span="5">
          <FormItem :label="sendWay === '1' ? '运输费：': '油费：'" prop="freightFee" class="fee-fix">
            <TagNumberInput v-model="payment.freightFee" :disabled="isDisabled" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="装货费：" prop="loadFee" class="fee-fix">
            <TagNumberInput v-model="payment.loadFee" :disabled="isDisabled" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="卸货费：" prop="unloadFee" class="fee-fix">
            <TagNumberInput v-model="payment.unloadFee" :disabled="isDisabled" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="保险费：" prop="insuranceFee" class="fee-fix">
            <TagNumberInput v-model="payment.insuranceFee" :disabled="isDisabled" class="detail-payment-input"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="4">
          <FormItem label="其他：" prop="otherFee" class="other-fee-fix">
            <TagNumberInput v-model="payment.otherFee" :disabled="isDisabled" class="detail-payment-input"></TagNumberInput>
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
    <!-- 外转 -->
    <div v-if="sendWay === '1' && source !== 'abnormal'">
      <Row class="detail-field-group">
        <i-col span="24">
          <span class="detail-field-title detail-field-required" style="width: 92px;">结算方式：</span>
          <div class="detail-payment-way">
            <RadioGroup v-model="settlementTypeFee">
              <Radio label="1">按单结</Radio>
              <Radio label="2">月结</Radio>
            </RadioGroup>
            <PayInfo
              v-if="settlementTypeFee === '1'"
              ref="$payInfo"
              :total="paymentTotal"
              :data="settlementPayInfo"
              class="detail-field-payinfo"
              mode="edit" />
          </div>
        </i-col>
      </Row>

      <Row v-if="pickFeeOrders.length > 1" class="detail-field-group" style="margin-top: 15px;margin-left: 10px;">
        <i-col span="24">
          <allocation-strategy ref="allocationStrategy" :allocation-orders="pickFeeOrders"></allocation-strategy>
        </i-col>
      </Row>
    </div>

    <!-- 自送 -->
    <div v-if="sendWay === '2' && source !== 'abnormal' && pickFeeOrders.length > 1">
      <Row class="detail-field-group" style="margin-left: 10px;">
        <i-col span="8">
          <allocation-strategy ref="allocationStrategy" :allocation-orders="pickFeeOrders"></allocation-strategy>
        </i-col>
      </Row>
    </div>

    <div v-if="source === 'abnormal'">
      <Row v-if="abnormalLength > 0" class="detail-field-group">
        <i-col span="24">
          <PayInfo
            ref="$payInfo"
            :total="paymentTotal"
            :data="settlementPayInfo"
            class="detail-field-payinfo"
            style="margin: 0 0 0 82px;"
            mode="edit" />
        </i-col>
      </Row>
      <Row class="detail-field-group row-margin">
        <i-col span="24">
          <span class="detail-field-title-sm" style="margin-left: 10px;">分摊策略：</span>
          <span style="margin-right: 10px;">{{ getAllocationValToLabel(allocationType) }}</span>
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
import AllocationStrategy from './AllocationStrategy.vue'
import allocationStrategy from '../constant/allocation.js'

export default {
  name: 'PickupFeeComponent',
  components: { TagNumberInput, PayInfo, AllocationStrategy },
  mixins: [ BaseDialog ],
  props: {
    //  1 外转 2 自送 自送不显示多段付
    sendWay: {
      type: String,
      default: '1'
    },
    // 费用
    payment: {
      type: Object,
      default: () => {
        return {
          freightFee: null,
          loadFee: null,
          unloadFee: null,
          insuranceFee: null,
          otherFee: null
        }
      }
    },
    // 多段付类型
    settlementType: {
      type: String,
      default: '1'
    },
    // 多段付信息
    settlementPayInfo: {
      type: Array,
      default: () => [
        { payType: 2, fuelCardAmount: '', cashAmount: '' }
      ]
    },
    // 页面来源
    source: {
      type: String
    },
    // 是否禁用输入框
    isDisabled: {
      type: Boolean,
      default: false
    },
    // 异常payInfo长度
    abnormalLength: {
      type: [String, Number],
      default: 1
    },
    // 传入的订单list,需要校验数量、体积、重量
    pickFeeOrders: {
      type: Array
    },
    // 分摊类型 默认1 按订单数分摊
    allocationType: {
      type: Number,
      default: 1
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
      settlementTypeFee: '1'
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
  watch: {
    settlementType (val) {
      this.settlementTypeFee = val
    }
  },
  created () {
    this.settlementTypeFee = this.settlementType
  },
  methods: {
    // 将分摊策略返回的标识映射为文字
    getAllocationValToLabel (data) {
      let list = allocationStrategy.find(item => item.value === data)
      return list.label
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        temp[key] *= 100
      }
      temp.totalFee = this.paymentTotal * 100
      return temp
    },
    // 获取分摊策略
    getAllocationStrategy () {
      return this.$refs.allocationStrategy.getAllocation()
    },
    // payInfo组件数据校验
    payInfoValid () {
      // console.log(this.$refs.$payInfo, this.$refs.$payInfo.validate())
      if (this.settlementTypeFee === '1' && !this.$refs.$payInfo.validate()) return false
      return true
    },
    getSettlementType () {
      return this.settlementTypeFee
    },
    getSettlementPayInfo () {
      return this.settlementTypeFee === '1' ? this.$refs.$payInfo.getPayInfo() : void 0
    },
    // 派车模块数据校验
    validate () {
      if (this.sendWay === '1' && this.abnormalLength > 0 && !this.payInfoValid()) return
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

  .detail-payment-way
    width calc(100% - 100px) !important
</style>
<style lang='stylus' scoped>
  .part
    padding 10px 0 20px
    border-bottom none
  .row-margin
    margin 20px 0 35px 0
</style>
