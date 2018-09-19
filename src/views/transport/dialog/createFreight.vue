<template>
  <Modal v-model="visiable" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="始发地" prop="start">
        <AreaSelect v-model="form.start" style="width:200px" placeholder="请选择"/>
      </FormItem>
      <FormItem label="目的地" prop="end">
        <AreaSelect v-model="form.end" style="width:200px" placeholder="请选择"/>
      </FormItem>
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
    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="create">确定</Button>
      <Button  type="default"  @click.native="visiable = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import AreaSelect from '@/components/AreaSelect'
import SelectCarrier from '../components/selectCarrier'
import selectCar from '../components/selectCar'
import Server from '@/libs/js/server'

export default {
  name: 'CreatedFreight',
  components: { AreaSelect, SelectCarrier, selectCar },
  mixins: [ BaseDialog ],
  data () {
    return {
      visiable: true,
      carrierId: '',
      form: {
        start: '',
        end: '',
        carrierName: '',
        carNo: ''
      },
      rules: {
        start: [
          { required: true, message: '请选择始发地' }
        ],
        end: [
          { required: true, message: '请选择目的地' }
        ]
      }
    }
  },
  methods: {
    create () {
      this.$refs.$form.validate(valid => {
        if (valid) {
          if (this.form.carNo && !this.$refs.$selectCar.validate()) {
            this.$Message.error('车牌号不正确')
            return
          }
          Server({
            url: '/dispatch/add/waybill',
            method: 'post',
            data: {
              start: this.form.start[this.form.start.length - 1],
              end: this.form.end[this.form.end.length - 1],
              carrierName: this.form.carrierName,
              carNo: this.form.carNo
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
