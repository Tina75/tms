<template>
  <div>
    <Form ref="ownSendInfos" :label-width="82" :model="ownForm" :rules="rules" label-position="left">
      <div>
        <OwnCarForm :form="ownForm" :class="formClass"></OwnCarForm>
      </div>
    </Form>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInputMixin from '../mixin/selectInputMixin'
// import Server from '@/libs/js/server'
import { CAR } from '@/views/client/client'
import OwnCarForm from '@/components/own-car-form'
import { defaultOwnForm as defaultFormValue } from '@/components/own-car-form/mixin.js'

export default {
  name: 'OwnSendInfoComponent',
  components: { OwnCarForm },
  mixins: [ BaseDialog, SelectInputMixin ],
  props: {
    // 引用页面来源
    source: {
      type: String,
      default: 'dispatch' // detail: 详情页，dispatch：调度弹窗，action：提货或派车弹窗
    },
    form: {
      type: Object,
      default: () => ({ ...defaultFormValue })
    }
  },
  data () {
    /**
     * 派车类型为自有的时候，才会从props的form表单里读取值,否则就默认值
     */
    let ownForm = { ...defaultFormValue }
    if (this.form.assignCarType === 2) {
      Object.assign(ownForm, this.form)
    }
    return {
      ownForm
    }
  },
  computed: {
    rules () {
      /**
       * 提货单详情和运单详情编辑都是source=detail
       * 编辑的时候，
       * 1.如果是运单，状态在待发运（2）或更早的状态
       * 2.如果是提货单，在待提货（1）的状态
       * 车牌和司机是非填项；其他都是必填
       */
      if (this.source === 'detail' && this.form.status <= 2) {
        return {}
      }
      return {
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
    },
    /**
     * 详情页编辑，改单时不需要虚线
     */
    formClass () {
      return [
        'edit-field-group',
        { 'detail-none-border': this.source === 'detail' },
        { 'padding-left-label': this.source === 'detail' }
      ]
    }
  },

  methods: {
    // 承运商info传参
    getOwnSendInfo () {
      return this.ownForm
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
  .edit-field-group
    .ivu-form-item-label
      color #777
      font-size 14px
  .padding-left-label
    .ivu-form-item-label
      padding-left 10px
</style>
<style lang='stylus' scoped>
  .edit-field-group
    padding-top 17px
    padding-bottom 8px
    margin-bottom 15px
    border-bottom 1px dashed #cbced3
  .detail-none-border
    margin-bottom: 0
    border-bottom: none
</style>
