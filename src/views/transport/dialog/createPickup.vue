<template>
  <Modal v-model="visiable" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="承运商" prop="carrierName">
        <SelectInput
          v-model="form.carrierName"
          :maxlength="20"
          :remote="false"
          :local-options="carriers"
          placeholder="请选择"
          style="width:200px"
          @on-select="handleSelectCarrier" />
      </FormItem>
      <FormItem label="车辆" prop="carNo">
        <SelectInput
          v-model="form.carNo"
          :maxlength="8"
          :remote="false"
          :local-options="carrierCars"
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
import SelectInput from '@/components/SelectInput.vue'
import Server from '@/libs/js/server'
import { mapGetters, mapActions } from 'vuex'
import { CAR } from '@/views/client/client'

export default {
  name: 'CreatedPickup',
  components: { SelectInput },
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
          { required: true, message: '请选择承运商' }
        ],
        carNo: [
          { required: true, message: '请填写车牌号', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'carriers',
      'carrierCars',
      'carrierDrivers'
    ])
  },
  created () {
    this.getCarriers()
  },
  methods: {
    ...mapActions([
      'getCarriers'
    ]),
    handleSelectCarrier (name, row) {
      console.log(name, row)
      this.$store.dispatch('getCarrierCars', row.id)
      this.$store.dispatch('getCarrierDrivers', row.id)
    },

    create () {
      this.$refs.$form.validate(valid => {
        if (valid) {
          // if (!this.$refs.$selectCar.validate()) {
          //   this.$Message.error('车牌号不正确')
          //   return
          // }
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
