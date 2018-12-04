<template>
  <div>
    <Form ref="ownSendInfos" :label-width="82" :model="info" :rules="rules" label-position="left">
      <div :style="source === 'detail' && 'margin-bottom: 0;border-bottom: none;'">
        <OwnCarForm :form="info" class="detail-field-group"></OwnCarForm>
      </div>
    </Form>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from './SelectInput.vue'
import SelectInputMixin from '../mixin/selectInputMixin'
// import Server from '@/libs/js/server'
import { CAR_TYPE, CAR_LENGTH } from '@/libs/constant/carInfo'
import { CAR } from '@/views/client/client'
import OwnCarForm from '@/components/own-car-form'
export default {
  name: 'OwnSendInfoComponent',
  components: { SelectInput, OwnCarForm },
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
    margin-top 12px
    padding-bottom 24px
    margin-bottom 15px
    border-bottom 1px dashed #cbced3
</style>
