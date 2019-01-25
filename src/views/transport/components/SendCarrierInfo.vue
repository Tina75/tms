<template>
  <div>
    <Form ref="sendInfo" :label-width="82" :model="carrierInfo" :rules="rules" class="transport-detail" label-position="right">
      <div :style="source === 'detail' || source === 'change' ? 'margin-bottom: 0;border-bottom: none;' : ''" class="part">
        <Row class="detail-field-group">
          <i-col span="8">
            <FormItem :prop="source !== 'detail' ? 'carrierName' : ''" :class="{'padding-left-label': source === 'detail'}" label="承运商：">
              <SelectInput
                ref="carrierInput"
                v-model="carrierInfo.carrierName"
                mode="carrier"
                style="width: 200px;"
                @on-select="selectCarrierHandler" />
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem prop="driverName" label="司机：">
              <SelectInput
                :carrier-id="carrierId"
                v-model="carrierInfo.driverName"
                mode="driver"
                style="width: 200px;"
                @on-select="autoComplete"
                @on-option-loaded="driverOptionLoaded" />
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="司机手机号：" prop="driverPhone" class="label-width">
              <Input
                v-model="carrierInfo.driverPhone"
                :maxlength="11"
                style="width: 200px;"/>
            </FormItem>
          </i-col>
        </Row>

        <Row class="detail-field-group">
          <i-col span="8">
            <FormItem class="padding-left-label" prop="carNo" label="车牌号：">
              <SelectInput
                :carrier-id="carrierId"
                v-model="carrierInfo.carNo"
                mode="carNo"
                style="width: 200px;"
                @on-select="autoComplete" />
            </FormItem>
          </i-col>
          <i-col span="8">
            <span class="detail-field-title" style="width: 82px;text-align: right;">车型：</span>
            <SelectCarType v-model="carrierInfo.carType" placement="bottom-start" class="detail-info-input-half" style="margin-right: 12px;"></SelectCarType>
            <SelectCarLength v-model="carrierInfo.carLength" placement="bottom-end" class="detail-info-input-half"></SelectCarLength>
            <!-- <Select v-model="carrierInfo.carType"
                    transfer
                    class="detail-info-input-half"
                    style="margin-right: 12px;">
              <Option v-for="item in carType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="carrierInfo.carLength"
                    transfer
                    class="detail-info-input-half">
              <Option v-for="item in carLength" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> -->
          </i-col>
          <i-col v-if="sourceType === 'sendCar'" span="8">
            <FormItem label="承运商运单号：" class="label-width">
              <Input v-model="carrierInfo.carrierWaybillNo" :maxlength="20" style="width: 200px;"/>
            </FormItem>
          </i-col>
        </Row>

        <Row>
          <i-col span="24" style="padding: 5px 0;">
            <FormItem label="备注：" class="padding-left-label">
              <Input v-model="carrierInfo.remark" :maxlength="100" class="detail-info-input" />
            </FormItem>
          </i-col>
        </Row>
      </div>
    </Form>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from './SelectInput.vue'
import SelectInputMixin from '../mixin/selectInputMixin'
import TagNumberInput from '@/components/TagNumberInput'
import SelectCarLength from '@/components/SelectCarLength'
import SelectCarType from '@/components/SelectCarType'
// import Server from '@/libs/js/server'
// import { CAR_TYPE, CAR_LENGTH } from '@/libs/constant/carInfo'
import $bus from '@/libs/js/eventBus.js'
import { CAR } from '@/views/client/pages/client'

export default {
  name: 'SendCarComponent',
  components: { SelectInput, TagNumberInput, SelectCarLength, SelectCarType },
  mixins: [ BaseDialog, SelectInputMixin ],
  props: {
    // 引用页面来源
    source: {
      type: String,
      default: 'dispatch' // detail: 详情页，dispatch：调度弹窗，action：提货或派车弹窗, change: 改单
    },
    // 引用模块  sendCar：送货   pickup：提货
    sourceType: {
      type: String,
      default: 'sendCar'
    },
    carrierInfo: {
      type: Object,
      default: () => {
        return {
          carrierName: '',
          driverName: '',
          driverPhone: '',
          carNo: '',
          carType: '',
          carLength: '',
          remark: '', // 备注
          carrierWaybillNo: '' // 承运商运单号
        }
      }
    }
  },
  data () {
    return {
      // carType: CAR_TYPE,
      // carLength: CAR_LENGTH,

      // 运单校验规则
      rules: {
        carrierName: [
          { required: true, message: '请填写承运商', trigger: 'blur' },
          { required: true, message: '请填写承运商', trigger: 'change' }
        ],
        carNo: [
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        driverName: [],
        driverPhone: [
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/ }
        ]
      },
      // 提货单校验规则
      pickupRules: {
        carrierName: [
          { required: true, message: '请填写承运商', trigger: 'blur' },
          { required: true, message: '请填写承运商', trigger: 'change' }
        ],
        carNo: [
          { required: true, message: '请填写车牌号', trigger: 'blur' },
          { required: true, message: '请填写车牌号', trigger: 'change' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        driverName: [
          { required: true, message: '请填写司机姓名', trigger: 'blur' },
          { required: true, message: '请填写司机姓名', trigger: 'change' }
        ],
        driverPhone: [
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/ }
        ]
      }
    }
  },

  // computed: {
  //   carrierName () {
  //     return this.carrierInfo.carrierName
  //   }
  // },

  watch: {
    // carrierName (newVal, oldVal) {
    //   console.log(newVal)
    //   $bus.$emit('carrierNameChange', newVal)
    // },
    carrierInfo: {
      handler (newVal, oldVal) {
        $bus.$emit('carrierInfoChange', newVal)
      },
      deep: true
    }
  },

  created () {
    this.$nextTick(() => {
      $bus.$emit('carrierInfoChange', this.carrierInfo)
    })
    if (this.sourceType !== 'sendCar') {
      delete this.carrierInfo.carrierWaybillNo // 送货调度、派车、详情、编辑、改单有承运商订单号字段，其他没有
    }
  },

  methods: {
    // 承运商info传参
    getCarrierInfo () {
      return this.carrierInfo
    },
    // 承运商信息校验
    checkCarrierInfo () {
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
      width 108px !important
    .ivu-form-item-content
      margin-left 108px !important
</style>
<style lang='stylus' scoped>
</style>
