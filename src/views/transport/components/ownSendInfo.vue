<template>
  <div>
    <Form ref="ownSendInfos" :label-width="82" :model="info" :rules="rules" label-position="left">
      <div :style="source === 'detail' && 'margin-bottom: 0;border-bottom: none;'" class="part">
        <Row class="detail-field-group">
          <i-col span="8">
            <FormItem label="车牌号：" prop="carNo">
              <SelectInput
                :carrier-id="carrierId"
                v-model="info.carNo"
                mode="carNo"
                style="width: 200px;"
                @on-select="autoComplete" />
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="主司机：" prop="driverName">
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
            <FormItem label="副司机：">
              <SelectInput
                :carrier-id="carrierId"
                v-model="info.assistantDriverName"
                mode="driver"
                style="width: 200px;"
                @on-select="autoComplete"
                @on-option-loaded="driverOptionLoaded" />
            </FormItem>
          </i-col>
        </Row>

        <Row class="own-send-info">
          <i-col span="8">
            <span class="own-send-info-label">车型：</span>
            <span>{{ info.carType|carTypeFormatter }} {{ info.carLength|carLengthFormatter }}</span>
          </i-col>
          <i-col span="8">
            <span class="own-send-info-label">主司机手机号：</span>
            <span>{{ info.driverPhone }}</span>
          </i-col>
          <i-col span="8">
            <span class="own-send-info-label" style="padding-left: 0;">副司机手机号：</span>
            <span>{{ info.assistantDriverPhone }}</span>
          </i-col>
        </Row>
      </div>
    </Form>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import TransportBase from '../mixin/transportBase'
import SelectInput from './SelectInput.vue'
import SelectInputMixin from '../mixin/selectInputMixin'
// import Server from '@/libs/js/server'
import { CAR_TYPE, CAR_LENGTH } from '@/libs/constant/carInfo'
import { CAR } from '@/views/client/client'

export default {
  name: 'OwnSendInfoComponent',
  components: { SelectInput },
  mixins: [ BaseDialog, SelectInputMixin, TransportBase ],
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
        driverName: '大胖', // 主司机姓名
        driverPhone: '13888888888', // 主司机电话
        assistantDriverName: '小胖', // 副司机姓名
        assistantDriverPhone: '13999999999', // 副司机电话
        carNo: '苏A28UQ1',
        carType: 2,
        carLength: 17
      },
      rules: {
        driverName: [
          { required: true, message: '请选择主司机', trigger: 'blur' },
          { required: true, message: '请选择主司机', trigger: 'change' }
        ],
        carNo: [
          { required: true, message: '请选择车牌号', trigger: 'blur' },
          { required: true, message: '请选择车牌号', trigger: 'change' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 承运商info传参
    getOwnSendInfo () {
      return this.info
    },
    // 承运商信息校验
    checkOwnSendInfo () {
      let check
      this.$refs.ownSendInfos.validate((valid) => {
        check = valid
      })
      return check
    }
  }
}

</script>
<style lang='stylus'>
</style>
<style lang='stylus' scoped>
  .detail-field-group
    >div
      padding 5px 0
      line-height 32px
  .own-send-info
    font-size 14px
    color #333
    margin-bottom 25px
    &-label
      width 82px
      padding-left 10px
      color #666
      padding-right 30px
</style>
