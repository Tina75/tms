<!--承运商详情----车辆新增编辑-->
<template>
  <div>
    <Modal
      v-model="modal"
      :mask-closable="true"
      label-position="left"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122">
        <FormItem label="车牌号:" prop="carNO">
          <Input v-model="validate.carNO" :maxlength="15" placeholder="请输入"/>
        </FormItem>
        <FormItem label="车型:" prop="carType">
          <Select v-model="validate.carType" >
            <Option value="1">平板</Option>
            <Option value="2">高栏</Option>
            <Option value="3">厢车</Option>
            <Option value="4">自卸</Option>
            <Option value="5">冷藏</Option>
            <Option value="6">保温</Option>
            <Option value="7">高低板</Option>
            <Option value="8">面包车</Option>
            <Option value="9">爬梯车</Option>
            <Option value="10">飞翼车</Option>
          </Select>
        </FormItem>
        <FormItem label="车长" prop="carLength">
          <Select v-model="validate.carLength" >
            <Option value="1">1.8米</Option>
            <Option value="2">2.7米</Option>
            <Option value="3">3.8米</Option>
            <Option value="4">4.2米</Option>
            <Option value="5">5米</Option>
            <Option value="6">6.2米</Option>
            <Option value="7">6.8米</Option>
            <Option value="8">7.7米</Option>
            <Option value="9">8.2米</Option>
            <Option value="10">8.7米</Option>
            <Option value="11">9.6米</Option>
            <Option value="12">11.7米</Option>
            <Option value="13">12.5米</Option>
            <Option value="14">13米</Option>
            <Option value="15">15米</Option>
            <Option value="16">16米</Option>
            <Option value="17">17.5米</Option>
          </Select>
        </FormItem>
        <FormItem label="核定载重量:" prop="shippingWeight">
          <Input v-model="validate.shippingWeight"  placeholder="请输入"/>吨
        </FormItem>
        <FormItem label="车载容积:" prop="shippingVolume">
          <Input v-model="validate.shippingVolume"  placeholder="请输入"/>方
        </FormItem>
        <FormItem label="主司机:" >
          <Select v-model="driverId" >
            <Option v-for="(item,index) in unbindedDriver" :key="index"  :value= "item.driverId">{{item.driverName}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="modal = false"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import { carrierAddVehicle, carrierUpdateVehicle, listUnbindedDriver, CODE, CAR } from '../client'
export default {
  name: 'carrier-vehicle',
  mixins: [BaseDialog],
  data () {
    return {
      modal: true,
      carrierId: '', // 承运商id
      driverId: 0, // 司机id
      driverName: '', // 只有编辑需要的数据
      carId: '', // 车辆id
      unbindedDriver: [], // 承运商下尚未被绑定车辆的司机
      validate: {
        carNO: '',
        carType: 1,
        shippingWeight: '',
        carLength: 1,
        shippingVolume: ''
      },
      ruleValidate: {
        carNO: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        carType: [
          { required: true, message: '车型不能为空', trigger: 'change' }
        ],
        shippingWeight: [
          { required: true, message: '载重量不能为空', trigger: 'blur' },
          { type: 'string', message: '必须为大于0的数,且精确到两位小数', pattern: /^(\+)?\d+(\.\d{1,2})?$/, trigger: 'blur' }
        ],
        carLength: [
          { required: true, message: '车长不能为空', trigger: 'change' }
        ],
        shippingVolume: [
          { type: 'string', message: '必须为大于0的数,且精确到一位小数', pattern: /^(\+)?\d+(\.\d{1})?$/, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let data = {
      carrierId: this.carrierId,
      driverId: this.driverId
    }
    listUnbindedDriver(data).then(res => {
      if (res.data.code === CODE) {
        this.unbindedDriver = res.data.data
        this.unbindedDriver.unshift({driverId: '', driverName: '请选择'})
        // if (this.flag === 2) { // 编辑
        //   this.unbindedDriver.push({
        //     driverId: this.driverId,
        //     driverName: this.driverName
        //   })
        // }
      }
    })
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag === 1) { // 新增
            this.add()
          } else { // 2-编辑
            this.update()
          }
          this.modal = false
        }
      })
    },
    add () {
      let data = {
        carNO: this.validate.carNO,
        carType: this.validate.carType,
        shippingWeight: this.validate.shippingWeight,
        carLength: this.validate.carLength,
        shippingVolume: this.validate.shippingVolume,
        driverId: this.driverId,
        carrierId: this.carrierId
      }
      carrierAddVehicle(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = {
        carNO: this.validate.carNO,
        carType: this.validate.carType,
        shippingWeight: this.validate.shippingWeight,
        carLength: this.validate.carLength,
        shippingVolume: this.validate.shippingVolume,
        driverId: this.driverId,
        carrierId: this.carrierId,
        carId: this.carId
      }
      carrierUpdateVehicle(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .ivu-input-wrapper,.ivu-select
    width: 86%
    margin-right 8px
</style>
