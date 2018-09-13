<template>
  <Modal v-model="visiable" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="承运商" prop="carrierName">
        <Input v-model="form.carrierName" style="width:200px" placeholder="请选择"/>
      </FormItem>
      <FormItem label="车辆" prop="carNo">
        <Input v-model="form.carNo" style="width:200px" placeholder="请选择"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button  type="primary"  @click="create">确定</Button>
      <Button  type="default"  @click.native="visiable = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'

export default {
  name: 'CreatedFreight',
  mixins: [ BaseDialog ],
  data () {
    return {
      visiable: true,
      form: {
        carrierName: '',
        carNo: ''
      },
      rules: {
        carrierName: [
          { required: true, message: '承运商' }
        ],
        carNo: [
          { required: true, message: '车辆' }
        ]
      }
    }
  },
  methods: {
    create () {
      this.$refs.$form.validate(valid => {
        if (valid) {
          this.close()
          this.complete()
        }
      })
    }
  }
}
</script>
