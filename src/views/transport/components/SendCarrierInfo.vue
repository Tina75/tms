<template>
  <div>
    <Form ref="sendInfo" :label-width="82" :model="info" :rules="rules" class="transport-detail" label-position="left">
      <div :style="source === 'detail' && 'margin-bottom: 0;border-bottom: none;'" class="part">
        <Row class="detail-field-group">
          <i-col span="8">
            <FormItem label="承运商：" prop="carrierName">
              <SelectInput
                ref="carrierInput"
                v-model="info.carrierName"
                mode="carrier"
                style="width: 200px;"
                @on-select="selectCarrierHandler" />
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="司机：">
              <SelectInput
                :carrier-id="carrierId"
                v-model="info.driverName"
                mode="driver"
                style="width: 200px;"
                @on-select="autoComplete"
                @on-option-loaded="driverOptionLoaded" />
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="司机手机号：" prop="driverPhone" class="label-width">
              <Input
                v-model="info.driverPhone"
                :maxlength="11"
                style="width: 200px;"/>
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
                style="width: 200px;"
                @on-select="autoComplete" />
            </FormItem>
          </i-col>
          <i-col span="8">
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
    </Form>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from './SelectInput.vue'
import SelectInputMixin from '../mixin/selectInputMixin'
import TagNumberInput from '@/components/TagNumberInput'
// import Server from '@/libs/js/server'
import { CAR_TYPE, CAR_LENGTH } from '@/libs/constant/carInfo'
import $bus from '@/libs/js/eventBus.js'
import { CAR } from '@/views/client/client'

export default {
  name: 'SendCarComponent',
  components: { SelectInput, TagNumberInput },
  mixins: [ BaseDialog, SelectInputMixin ],
  props: {
    // 引用页面来源
    source: {
      type: String,
      default: 'dispatch' // detail: 详情页，dispatch：调度弹窗，action：提货或派车弹窗
    }
  },
  data () {
    return {
      carType: CAR_TYPE,
      carLength: CAR_LENGTH,

      info: {
        carrierName: '',
        driverName: '',
        driverPhone: '',
        carNo: '',
        carType: '',
        carLength: ''
      },
      rules: {
        carrierName: [
          { required: true, message: '请填写承运商', trigger: 'blur' },
          { required: true, message: '请填写承运商', trigger: 'change' }
        ],
        carNo: [
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    carrierName () {
      return this.info.carrierName
    }
  },

  watch: {
    carrierName (newVal, oldVal) {
      $bus.$emit('carrierNameChange', newVal)
    }
  },

  methods: {
    // 承运商info传参
    getCarrierInfo () {
      return this.info
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
      width 92px !important
</style>
<style lang='stylus' scoped>
</style>
