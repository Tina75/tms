<template>
  <Form ref="sendInfo" :label-width="82" :model="info" :rules="rules" class="transport-detail" label-position="left">
    <div class="sub-title">派车：</div>
    <div class="part" style="padding-bottom: 10px;">
      <Row class="detail-field-group">
        <i-col span="8">
          <FormItem label="承运商：" prop="carrierName">
            <SelectInput
              ref="carrierInput"
              v-model="info.carrierName"
              mode="carrier"
              style="width: 220px;"
              @on-select="selectCarrierHandler" />
          </FormItem>
        </i-col>
        <i-col span="7" offset="1">
          <FormItem label="司机：">
            <SelectInput
              :carrier-id="carrierId"
              v-model="info.driverName"
              mode="driver"
              style="width: 180px;"
              @on-select="autoComplete"
              @on-option-loaded="driverOptionLoaded" />
          </FormItem>
        </i-col>
        <i-col span="7" offset="1">
          <FormItem label="司机手机号：" prop="driverPhone" class="label-width">
            <Input
              v-model="info.driverPhone"
              :maxlength="11"
              style="width: 180px;"/>
          </FormItem>
        </i-col>
      </Row>

      <Row class="detail-field-group">
        <i-col span="8">
          <FormItem label="车牌号：" prop="carNo" class="padding-left-label">
            <SelectInput
              :carrier-id="carrierId"
              v-model="info.carNo"
              mode="carNo"
              style="width: 180px;"
              @on-select="autoComplete" />
          </FormItem>
        </i-col>
        <i-col span="7" offset="1">
          <span class="detail-field-title" style="width: 82px;">车型：</span>
          <Select v-model="info.carType"
                  transfer
                  class="detail-info-input-half"
                  style="margin-right: 12px;">
            <Option v-for="item in carType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="info.carLength"
                  transfer
                  class="detail-info-input-half">
            <Option v-for="item in carLength" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
      </Row>
    </div>

    <div class="part" style="padding-bottom: 5px;">
      <Row class="detail-field-group">
        <i-col span="6">
          <FormItem label="计费里程：" prop="mileage" class="padding-left-label">
            <TagNumberInput :show-chinese="false" :min="0" v-model="info.mileage" :precision="1" class="detail-payment-input-send"></TagNumberInput>
            <span class="unit-yuan">公里</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="运输费：" prop="freightFee">
            <TagNumberInput v-model="info.freightFee" class="detail-payment-input-send"></TagNumberInput>
            <span class="unit-yuan">元</span>
            <a class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="装货费：" prop="loadFee">
            <TagNumberInput v-model="info.loadFee" class="detail-payment-input-send"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="卸货费：" prop="unloadFee">
            <TagNumberInput v-model="info.unloadFee" class="detail-payment-input-send"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="路桥费：" prop="tollFee" class="padding-left-label">
            <TagNumberInput v-model="info.tollFee" class="detail-payment-input-send"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="保险费：" prop="insuranceFee" class="padding-left-label">
            <TagNumberInput v-model="info.insuranceFee" class="detail-payment-input-send"></TagNumberInput>
            <span class="unit-yuan">元</span>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="其他：" prop="otherFee">
            <TagNumberInput v-model="info.otherFee" class="detail-payment-input-send"></TagNumberInput>
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

    <div class="part">
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

      <Row class="detail-field-group" style="margin-top: 15px;margin-left: 10px;">
        <i-col span="24">
          <FormItem label="返现运费：" prop="cashBack">
            <TagNumberInput v-model="info.cashBack" class="detail-payment-input" style="width: 180px;"></TagNumberInput>
            <span class="unit-yuan">元</span>
            <Tooltip placement="right" transfer content="返现运费是指在实际运输过程中存在某一段运输没有执行，需要将提前支付的运费返还。" max-width="500">
              <Icon type="ios-alert" size="20" color="#FFBB44" style="margin-left: 14px;"/>
            </Tooltip>
          </FormItem>
        </i-col>
      </Row>
    </div>
  </Form>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from './SelectInput.vue'
import SelectInputMixin from '../mixin/selectInputMixin'
import TagNumberInput from '@/components/TagNumberInput'
import validator from '@/libs/js/validate'
import PayInfo from './PayInfo'
// import Server from '@/libs/js/server'
import { CAR_TYPE, CAR_LENGTH } from '@/libs/constant/carInfo'
import { CAR } from '@/views/client/client'

export default {
  name: 'SendCarComponent',
  components: { SelectInput, PayInfo, TagNumberInput },
  mixins: [ BaseDialog, SelectInputMixin ],
  props: {
    orderList: {
      type: Array
    },
    mileage: {
      type: [Number, String],
      default: null
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
      carType: CAR_TYPE,
      carLength: CAR_LENGTH,

      info: {
        carrierName: '',
        driverName: '',
        driverPhone: '',
        carNo: '',
        carType: '',
        carLength: '',
        freightFee: null,
        loadFee: null,
        unloadFee: null,
        insuranceFee: null,
        otherFee: null,
        cashBack: null, // 返现运费
        tollFee: null, // 路桥费
        mileage: null // 计费里程
      },
      financeRulesInfo: {
        start: void 0,
        end: void 0,
        weight: void 0,
        volume: void 0
      },
      payment: {
        freightFee: 0,
        loadFee: 0,
        unloadFee: 0,
        insuranceFee: 0,
        otherFee: 0,
        cashBack: 0, // 返现运费
        tollFee: 0 // 路桥费
      },
      rules: {
        carrierName: [
          { required: true, message: '请填写承运商', trigger: 'blur' },
          { required: true, message: '请填写承运商', trigger: 'change' }
        ],
        carNo: [
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        // 运输费
        freightFee: [
          { required: true, type: 'number', message: '请输入运输费用' },
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
      total = Number(this.info.freightFee) +
              Number(this.info.loadFee) +
              Number(this.info.unloadFee) +
              Number(this.info.insuranceFee) +
              Number(this.info.otherFee) +
              Number(this.info.tollFee)
      return parseFloat(total.toFixed(2))
    }
  },
  created () {
    // 支付信息表格展示内容根据类型改变
    this.settlementPayInfo = [
      { payType: 1, fuelCardAmount: '', cashAmount: '' },
      { payType: 2, fuelCardAmount: '', cashAmount: '' },
      { payType: 3, fuelCardAmount: '', cashAmount: '' }
    ]
    this.info.mileage = this.mileage
  },
  methods: {
    // 计费规则
    showChargeRules () {
      const self = this
      if (!self.info.carrierName) {
        self.$Message.error('请先选择或输入承运商')
        return
      }
      const carrierItem = self.$refs.carrierInput.options.find(carrier => carrier.carrierName === self.info.carrierName)
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
          partnerName: self.info.carrierName,
          ...self.financeRulesInfo
        },
        methods: {
          // 确认收费规则时获取价格
          ok (charge) {
            self.payment.freightFee = charge || 0
          },
          // 前往设置时关闭当前对话框
          closeParentDialog () {
            self.close()
          }
        }
      })
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.info)
      temp.freightFee = temp.freightFee * 100 || null
      temp.loadFee = temp.loadFee * 100 || null
      temp.unloadFee = temp.unloadFee * 100 || null
      temp.insuranceFee = temp.insuranceFee * 100 || null
      temp.otherFee = temp.otherFee * 100 || null
      temp.tollFee = temp.tollFee * 100 || null
      temp.cashBack = temp.cashBack * 100 || null
      temp.mileage = temp.mileage * 1000 || null
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
      this.$refs.sendInfo.validate((valid) => {
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

   &:last-child
     border-style none
     padding-bottom 10px

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
  .part
    padding 10px 0 20px
    border-bottom none
</style>
