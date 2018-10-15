<template>
  <Modal v-model="show" :mask-closable="false" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="80" style="padding:0 20px;">
      <FormItem label="始发地：" prop="start">
        <AreaSelect v-model="form.start" :deep="true" placeholder="请选择"/>
      </FormItem>
      <FormItem label="目的地：" prop="end">
        <AreaSelect v-model="form.end" :deep="true" placeholder="请选择"/>
      </FormItem>
      <FormItem label="承运商：" prop="carrierName">
        <SelectInput v-model="form.carrierName"
                     mode="carrier"
                     placeholder="请选择"
                     @on-select="selectCarrierHandler" />
      </FormItem>
      <FormItem label="车牌号：" prop="carNo">
        <SelectInput :carrier-id="carrierId"
                     v-model="form.carNo"
                     mode="carNo"
                     placeholder="请选择"
                     @on-select="autoComplete" />
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="create">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from '@/views/transport/components/SelectInput.vue'
import SelectInputMixin from '@/views/transport/components/selectInputMixin'
import Server from '@/libs/js/server'
import { CAR } from '@/views/client/client'
import { FORM_VALIDATE_START, FORM_VALIDATE_END, getCityCode, resetCityValidator } from '@/libs/constant/cityValidator'

export default {
  name: 'CreatedFreight',
  components: { AreaSelect, SelectInput },
  mixins: [ BaseDialog, SelectInputMixin ],
  data () {
    const vm = this
    return {
      show: true,

      // select input data
      keyFields: 'form',
      linkageFields: ['carNo'],

      form: {
        start: [],
        end: [],
        carrierName: '',
        carNo: ''
      },
      rules: {
        start: [
          { required: true, type: 'array', message: '请选择始发地', trigger: 'blur' },
          { validator: FORM_VALIDATE_START(vm, '$form'), trigger: 'change' }
        ],
        end: [
          { required: true, type: 'array', message: '请选择目的地', trigger: 'blur' },
          { validator: FORM_VALIDATE_END, trigger: 'change' }
        ],
        carNo: [
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ]
      }
    }
  },
  created () { resetCityValidator() },
  methods: {
    create () {
      this.$refs.$form.validate(valid => {
        if (valid) {
          Server({
            url: '/dispatch/add/waybill',
            method: 'post',
            data: {
              start: getCityCode(this.form.start),
              end: getCityCode(this.form.end),
              carrierName: this.form.carrierName,
              carNo: this.form.carNo ? this.form.carNo : void 0
            }
          }).then(res => {
            this.$Message.success('新建成功')
            this.close()
            this.complete()
          }).catch(err => console.error(err))
        }
      })
    },

    carrierChange (val) {
      this.carrierId = val.value
    }
  }
}
</script>
