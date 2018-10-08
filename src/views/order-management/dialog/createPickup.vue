<template>
  <Modal v-model="visiable" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="70" label-position="left" style="padding:0 20px;">
      <FormItem label="承运商：" prop="carrierName">
        <SelectInput
          v-model="form.carrierName"
          :maxlength="20"
          :remote="false"
          :local-options="carriers"
          placeholder="请选择"
          @on-select="handleSelectCarrier" />
      </FormItem>
      <FormItem label="车辆：" prop="carNo">
        <SelectInput
          v-model="form.carNo"
          :maxlength="8"
          :remote="false"
          :local-options="carrierCars"
          placeholder="请选择" />
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
import { CAR } from '@/views/client/client'

export default {
  name: 'CreatedPickup',
  components: { SelectInput },
  mixins: [ BaseDialog ],
  data () {
    return {
      visiable: true,
      carriers: [],
      carrierCars: [],

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
  created () {
    this.getCarriers()
  },
  methods: {
    getCarriers () {
      Server({
        url: '/carrier/listOrderByUpdateTimeDesc',
        method: 'get',
        data: { type: 1 }
      }).then(res => {
        this.carriers = res.data.data.carrierList.map(item => {
          return {
            name: item.carrierName,
            value: item.carrierName,
            id: item.carrierId,
            carNo: item.carNO
          }
        })
      })
    },

    getCarrierCars (carrierId) {
      Server({
        url: '/carrier/list/carOrderByUpdateTimeDesc',
        method: 'get',
        data: { carrierId }
      }).then(res => {
        this.carrierCars = res.data.data.carList.map(item => {
          return {
            name: item.carNO,
            value: item.carNO
          }
        })
        if (this.carrierCars.length) this.form.carNo = this.carrierCars[0].name
        else this.form.carNo = ''
      })
    },

    handleSelectCarrier (name, row) {
      this.getCarrierCars(row.id)
      this.$store.dispatch('getCarrierDrivers', row.id)
    },

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
