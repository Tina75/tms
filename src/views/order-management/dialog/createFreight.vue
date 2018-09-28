<template>
  <Modal v-model="visiable" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="始发地" prop="start">
        <AreaSelect v-model="form.start" :deep="true" style="width:200px" placeholder="请选择"/>
      </FormItem>
      <FormItem label="目的地" prop="end">
        <AreaSelect v-model="form.end" :deep="true" style="width:200px" placeholder="请选择"/>
      </FormItem>
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
    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="create">确定</Button>
      <Button  type="default"  @click.native="visiable = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from '@/components/SelectInput.vue'
import Server from '@/libs/js/server'
import { CAR } from '@/views/client/client'

const specialCity = ['110000', '120000', '710000', '810000', '820000']

export default {
  name: 'CreatedFreight',
  components: { AreaSelect, SelectInput },
  mixins: [ BaseDialog ],
  data () {
    const validateArea = (value) => {
      if (value.length === 1 && !specialCity.includes(value[0])) {
        return false
      }
      return true
    }
    const validateStart = (rule, value, callback) => {
      if (!validateArea(value)) {
        callback(new Error('请至少选择到市一级城市'))
      } else {
        callback()
      }
    }
    const validateEnd = (rule, value, callback) => {
      if (!validateArea(value)) {
        callback(new Error('请至少选择到市一级城市'))
      } else {
        callback()
      }
    }

    return {
      visiable: true,
      carriers: [],
      carrierCars: [],

      form: {
        start: [],
        end: [],
        carrierName: '',
        carNo: ''
      },
      rules: {
        start: [
          { required: true, type: 'array', message: '请选择始发地' },
          { validator: validateStart }
        ],
        end: [
          { required: true, type: 'array', message: '请选择目的地' },
          { validator: validateEnd }
        ],
        carNo: [
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
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
          // if (this.form.carNo && !this.$refs.$selectCar.validate()) {
          //   this.$Message.error('车牌号不正确')
          //   return
          // }
          Server({
            url: '/dispatch/add/waybill',
            method: 'post',
            data: {
              start: this.form.start[this.form.start.length - 1],
              end: this.form.end[this.form.end.length - 1],
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
