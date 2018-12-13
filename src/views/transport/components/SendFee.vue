<template>
  <Form ref="sendFeeForm" :label-width="82" :model="payment" :rules="rules" class="transport-detail" label-position="right">
    <div class="part" style="padding-bottom: 5px;">
      <Row class="detail-field-group">
        <i-col v-if="source !== 'abnormal'" span="6">
          <FormItem label="计费里程：" prop="mileage">
            <TagNumberInput :show-chinese="false" :min="0" v-model="payment.mileage" :precision="1" class="detail-payment-input-send"></TagNumberInput>
            <span class="unit-yuan">公里</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem :label="sendWay === '1' ? '运输费：': '油费：'" prop="freightFee">
            <Tooltip :content="feeStatusTip" :disabled="!feeStatusTip? true: false">
              <TagNumberInput v-model="payment.freightFee" :disabled="isDisabled" class="detail-payment-input-send"></TagNumberInput>
            </Tooltip>
            <span class="unit-yuan">元</span>
            <a v-if="sendWay === '1' && source !== 'abnormal'" class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="装货费：" prop="loadFee">
            <Tooltip :content="feeStatusTip" :disabled="!feeStatusTip? true: false">
              <TagNumberInput v-model="payment.loadFee" :disabled="isDisabled" class="detail-payment-input-send"></TagNumberInput>
            </Tooltip>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="卸货费：" prop="unloadFee">
            <Tooltip :content="feeStatusTip" :disabled="!feeStatusTip? true: false">
              <TagNumberInput v-model="payment.unloadFee" :disabled="isDisabled" class="detail-payment-input-send"></TagNumberInput>
            </Tooltip>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col v-if="source === 'abnormal'" span="6">
          <FormItem label="路桥费：" prop="tollFee">
            <Tooltip :content="feeStatusTip" :disabled="!feeStatusTip? true: false">
              <TagNumberInput v-model="payment.tollFee" :disabled="isDisabled" class="detail-payment-input-send"></TagNumberInput>
            </Tooltip>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
      </Row>
      <Row class="detail-field-group">
        <i-col v-if="source !== 'abnormal'" span="6">
          <FormItem label="路桥费：" prop="tollFee">
            <Tooltip :content="feeStatusTip" :disabled="!feeStatusTip? true: false">
              <TagNumberInput v-model="payment.tollFee" :disabled="isDisabled" class="detail-payment-input-send"></TagNumberInput>
            </Tooltip>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col v-if="sendWay === '2'" span="6">
          <FormItem label="住宿费：" prop="accommodation">
            <Tooltip :content="feeStatusTip" :disabled="!feeStatusTip? true: false">
              <TagNumberInput v-model="payment.accommodation" :disabled="isDisabled" class="detail-payment-input-send"></TagNumberInput>
            </Tooltip>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="保险费：" prop="insuranceFee">
            <Tooltip :content="feeStatusTip" :disabled="!feeStatusTip? true: false">
              <TagNumberInput v-model="payment.insuranceFee" :disabled="isDisabled" class="detail-payment-input-send"></TagNumberInput>
            </Tooltip>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="其他：" prop="otherFee">
            <Tooltip :content="feeStatusTip" :disabled="!feeStatusTip? true: false">
              <TagNumberInput v-model="payment.otherFee" :disabled="isDisabled" class="detail-payment-input-send"></TagNumberInput>
            </Tooltip>
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
              <Radio :disabled="isDisabled" label="1">按单结</Radio>
              <Radio :disabled="isDisabled" label="2">月结</Radio>
            </RadioGroup>
            <PayInfo
              v-if="settlementTypeFee === '1'"
              ref="$payInfo"
              :fee-status-tip="feeStatusTip"
              :total="paymentTotal"
              :data="settlementPayInfo"
              class="detail-field-payinfo"
              mode="edit" />
          </div>
        </i-col>
      </Row>

      <Row class="detail-field-group" style="margin-top: 15px;margin-left: -2px;">
        <i-col v-if="sendFeeOrders.length > 1" span="8">
          <allocation-strategy ref="allocationStrategy" :allocation-orders="sendFeeOrders"></allocation-strategy>
        </i-col>
        <i-col span="8">
          <FormItem label="返现运费：" prop="cashBack" class="detail-form-label">
            <TagNumberInput v-model="payment.cashBack" class="detail-payment-input" style="width: 180px;"></TagNumberInput>
            <span class="unit-yuan">元</span>
            <Tooltip placement="right" transfer content="返现运费是指在实际运输过程中存在某一段运输没有执行，需要将提前支付的运费返还。" max-width="500">
              <Icon type="ios-alert" size="20" color="#FFBB44" style="margin-left: 14px;"/>
            </Tooltip>
          </FormItem>
        </i-col>
      </Row>
    </div>
    <!-- 自送 -->
    <div v-if="sendWay === '2' && source !== 'abnormal' && sendFeeOrders.length > 1">
      <Row class="detail-field-group" style="margin-left: -2px;">
        <i-col span="8">
          <allocation-strategy ref="allocationStrategy" :allocation-orders="sendFeeOrders"></allocation-strategy>
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
      <Row v-if="orderCnt > 1" class="detail-field-group row-margin">
        <i-col span="24">
          <span class="detail-field-title-sm" style="margin-left: 10px;">分摊策略：</span>
          <span>{{ getAllocationValToLabel(allocationType) }}</span>
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
import { mapGetters } from 'vuex'
import $bus from '@/libs/js/eventBus.js'
import AllocationStrategy from './AllocationStrategy.vue'
import allocationStrategy from '../constant/allocation.js'

export default {
  name: 'SendFeeComponent',
  components: { TagNumberInput, PayInfo, AllocationStrategy },
  mixins: [ BaseDialog ],
  props: {
    feeStatusTip: {
      type: [String],
      default: ''
    },
    mileage: {
      type: [String, Number]
    },
    // 计费规则传入start、end、weight、volume
    financeRulesInfo: {
      type: Object,
      default: () => {
        return {
          start: null,
          end: null,
          weight: null,
          volume: null
        }
      }
    },
    // 1 外转 2 自送 自送不显示多段付和返现
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
          otherFee: null,
          cashBack: null, // 返现运费
          tollFee: null, // 路桥费
          mileage: null, // 计费里程
          accommodation: null// 住宿费
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
        { payType: 1, fuelCardAmount: '', cashAmount: '' },
        { payType: 2, fuelCardAmount: '', cashAmount: '' },
        { payType: 3, fuelCardAmount: '', cashAmount: '' },
        { payType: 4, fuelCardAmount: '', cashAmount: '' }
      ]
    },
    // 页面来源
    source: {
      type: String,
      default: ''
    },
    // 是否禁用输入框
    isDisabled: {
      type: Boolean,
      default: false
    },
    // 异常payInfo长度
    abnormalLength: {
      type: [String, Number],
      default: 3
    },
    // 传入的订单list,需要校验数量、体积、重量
    sendFeeOrders: {
      type: Array
    },
    // 分摊类型 默认1 按订单数分摊
    allocationType: {
      type: Number,
      default: 1
    },
    // 订单数量，异常需要判断是否显示分摊费用
    orderCnt: {
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
    // 6位整数 1位小数
    const validateMile = (rule, value, callback) => {
      if ((value && validator.mileage(value)) || !value) {
        callback()
      } else {
        callback(new Error('距离整数位最多输入6位,小数1位'))
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
        ],
        // 返现费用
        cashBack: [
          { validator: validateFee }
        ],
        // 路桥费用
        tollFee: [
          { validator: validateFee }
        ],
        // 计费里程
        mileage: [
          { validator: validateMile }
        ],
        // 住宿费用
        accommodation: [
          { validator: validateFee }
        ]
      },
      settlementTypeFee: '1',
      // settlementPayInfo: [],
      carrierName: ''
    }
  },
  computed: {
    ...mapGetters([
      'carriers'
    ]),
    // 计算总费用
    paymentTotal () {
      let total
      total = Number(this.payment.freightFee) +
              Number(this.payment.loadFee) +
              Number(this.payment.unloadFee) +
              Number(this.payment.insuranceFee) +
              Number(this.payment.otherFee) +
              Number(this.payment.tollFee) +
              Number(this.payment.accommodation)
      return parseFloat(total.toFixed(2))
    }
  },
  watch: {
    settlementType (val) {
      this.settlementTypeFee = val
    }
  },
  created () {
    this.mileage && (this.payment.mileage = this.mileage)
    this.settlementTypeFee = this.settlementType
    // 获取SendCarrierInfo组件传入的carrierName
    $bus.$on('carrierNameChange', carrierName => {
      this.carrierName = carrierName
    })
  },
  methods: {
    // 将分摊策略返回的标识映射为文字
    getAllocationValToLabel (data) {
      let list = allocationStrategy.find(item => item.value === data)
      return list.label
    },
    // 计费规则
    showChargeRules () {
      const self = this
      console.log(this.financeRulesInfo, this.payment.mileage, this.carrierName)
      if (!self.financeRulesInfo.start) {
        self.$Message.error('请先输入始发地')
        return
      }
      if (!self.financeRulesInfo.end) {
        self.$Message.error('请先输入目的地')
        return
      }
      if (!self.carrierName) {
        self.$Message.error('请先选择或输入承运商')
        return
      }
      const carrierItem = self.carriers.find(c => c.name === self.carrierName)
      if (!carrierItem) {
        self.$Message.warning('您选择或输入的承运商没有维护的计费规则')
        return
      }
      let carrierId = carrierItem.id
      if (!carrierId) {
        self.$Message.warning('您选择或输入的承运商没有维护的计费规则')
        return
      }
      self.openDialog({
        name: 'dialogs/financeRule',
        data: {
          partnerId: carrierId,
          partnerType: 2,
          partnerName: self.carrierName,
          distance: self.payment.mileage ? self.payment.mileage * 1000 : 0,
          ...self.financeRulesInfo
        },
        methods: {
          // 确认收费规则时获取价格
          ok (charge) {
            self.payment.freightFee = charge || 0
          },
          // 前往设置时关闭当前对话框
          closeParentDialog () {
            self.source !== 'detail' && self.close()
          }
        }
      })
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        if (key === 'mileage') {
          temp[key] *= 1000
        } else {
          temp[key] *= 100
        }
      }
      temp.totalFee = this.paymentTotal * 100
      if (this.source === 'abnormal') { // 异常没有计费里程和返现
        delete temp.cashBack
        delete temp.mileage
      }
      if (this.sendWay === '1') { // 外转去掉住宿费
        delete temp.accommodation
      }
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
      this.$refs.sendFeeForm.validate((valid) => {
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
