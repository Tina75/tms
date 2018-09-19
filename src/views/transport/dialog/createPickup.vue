<template>
  <Modal v-model="visiable" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="承运商" prop="carrierName">
        <SelectCarrier v-model="form.carrierName"
                       placeholder="请选择"
                       style="width:200px"
                       @on-change="carrierChange" />
      </FormItem>
      <FormItem label="车辆" prop="carNo">
        <selectCar ref="$selectCar"
                   v-model="form.carNo"
                   :carrier-id="carrierId"
                   placeholder="请选择"
                   style="width:200px" />
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
import SelectCarrier from '../components/selectCarrier'
import selectCar from '../components/selectCar'
import Server from '@/libs/js/server'

export default {
  name: 'CreatedPickup',
  components: { SelectCarrier, selectCar },
  mixins: [ BaseDialog ],
  data () {
    return {
      visiable: true,
      carrierId: '',
      form: {
        carrierName: '',
        carNo: ''
      },
      rules: {
        carrierName: [
          { required: true, message: '请选择承运商' }
        ],
        carNo: [
          { required: true, message: '请选择车辆' }
        ]
      }
    }
  },
  methods: {
    create () {
      this.$refs.$form.validate(valid => {
        if (valid) {
          if (!this.$refs.$selectCar.validate()) {
            this.$Message.error('车牌号不正确')
            return
          }
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
