<template>
  <Modal v-model="visiable" :mask-closable="false" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="80" label-position="left" style="padding:0 20px;">
      <FormItem label="承运商：" prop="carrierName">
        <SelectInput v-model="form.carrierName"
                     mode="carrier"
                     placeholder="请选择"
                     @on-select="selectCarrierHandler" />
      </FormItem>
      <FormItem label="车辆：" prop="carNo">
        <SelectInput :carrier-id="carrierId"
                     v-model="form.carNo"
                     mode="carNo"
                     placeholder="请选择"
                     @on-select="autoComplete" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button  type="primary"  @click="create">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from '@/views/transport/components/SelectInput.vue'
import SelectInputMixin from '@/views/transport/components/selectInputMixin'
import Server from '@/libs/js/server'
import { CAR } from '@/views/client/client'

export default {
  name: 'CreatedPickup',
  components: { SelectInput },
  mixins: [ BaseDialog, SelectInputMixin ],
  data () {
    return {
      // select input data
      keyFields: 'form',
      linkageFields: ['carNo'],

      form: {
        carrierName: '',
        carNo: ''
      },
      rules: {
        carrierName: [
          { required: true, message: '请选择承运商' }
        ],
        carNo: [
          { required: true, message: '请填写车牌号' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR }
        ]
      }
    }
  },
  methods: {

    create () {
      this.$refs.$form.validate(valid => {
        if (valid) {
          Server({
            url: '/dispatch/add/loadbill',
            method: 'post',
            data: this.form
          }).then(res => {
            this.$Message.success('新建成功')
            this.close()
            this.complete()
          }).catch(err => console.error(err))
        }
      })
    }
  }
}
</script>
