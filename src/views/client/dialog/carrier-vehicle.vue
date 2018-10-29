<!--承运商详情----车辆新增编辑-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      width="1020"
      label-position="right"
      class="modalDialog"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="90">
        <Row>
          <Col span="8">
          <FormItem label="车牌号:" prop="carNO">
            <Row>
              <Col span="20">
              <Input v-model="validate.carNO" placeholder="必填"></Input>
                </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="维修类别:" prop="reqairType">
            <Row>
              <Col span="20">
              <Input v-model="validate.reqairType" placeholder="必填"></Input>
                </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="送修日期:" prop="repairDate">
            <Row>
              <Col span="20">
              <DatePicker v-model="validate.repairDate" type="date" placeholder="请选择日期（必选）"></DatePicker>
                </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="送修人:" prop="repairPerson">
            <Row>
              <Col span="20">
              <Input v-model="validate.repairPerson" placeholder="必填"></Input>
                </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="送修公里数:" prop="repairMile">
            <Row>
              <Col span="20">
              <Input v-model="validate.repairMile" placeholder="必填"></Input>
                </Col>
              <Col span="3" offset="1">
              <span>公里</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="维修费用:" prop="repairMoney">
            <Row>
              <Col span="20">
              <Input v-model="validate.repairMoney" placeholder="必填"></Input>
                </Col>
              <Col span="2" offset="1">
              <span>元</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="已支付费用:" prop="payMoney">
            <Row>
              <Col span="20">
              <Input v-model="validate.payMoney" placeholder="必填"></Input>
                </Col>
              <Col span="2" offset="1">
              <span>元</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="未支付费用:" prop="waitPayMoney">
            <Row>
              <Col span="20">
              <Input v-model="validate.waitPayMoney" placeholder="必填"></Input>
                </Col>
              <Col span="2" offset="1">
              <span>元</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23">
          <FormItem label="修理单位:">
            <Input v-model="validate.repairUnit" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23">
          <FormItem label="修理原因:">
            <Input v-model="validate.repairReason" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23">
          <FormItem label="修理结果:">
            <Input v-model="validate.repairResult" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23">
          <FormItem label="备注:">
            <Input v-model="validate.remark" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { CAR_TYPE1, CAR_LENGTH } from '@/libs/constant/carInfo'
import BaseDialog from '@/basic/BaseDialog'
import { carrierAddVehicle, carrierUpdateVehicle, listUnbindedDriver, CODE, CAR } from '../client'
export default {
  name: 'carrier-vehicle',
  mixins: [BaseDialog],
  data () {
    return {
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      carrierId: '', // 承运商id
      driverId: 0, // 司机id
      driverName: '', // 只有编辑需要的数据
      carId: '', // 车辆id
      unbindedDriver: [], // 承运商下尚未被绑定车辆的司机
      validate: {},
      ruleValidate: {
        carNO: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        reqairType: [
          { required: true, message: '维修类别不能为空', trigger: 'change' }
        ],
        repairDate: [
          { required: true, message: '送修日期不能为空', trigger: 'change' }
        ],
        repairPerson: [
          { required: true, message: '送修人不能为空', trigger: 'change' }
        ],
        repairMile: [
          { required: true, message: '送修公里数不能为空', trigger: 'change' }
        ],
        repairMoney: [
          { required: true, message: '维修费用不能为空', trigger: 'change' }
        ],
        payMoney: [
          { required: true, message: '已支付费用不能为空', trigger: 'change' }
        ],
        waitPayMoney: [
          { required: true, message: '未支付费用不能为空', trigger: 'change' }
        ]
        // shippingVolume: [
        //   { type: 'string', message: '必须为大于等于0的数字,最多一位小数', pattern: /^(0|([1-9]\d*))([.]\d?)?$/, trigger: 'blur' }
        // ]
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
        this.unbindedDriver.unshift({ driverId: '', driverName: '请选择' })
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
          this.close()
        }
      })
    },
    add () {
      let data = this.validate
      // {
      //   carNO: this.validate.carNO,
      //   carType: this.validate.carType,
      //   shippingWeight: this.validate.shippingWeight,
      //   carLength: this.validate.carLength,
      //   shippingVolume: this.validate.shippingVolume,
      //   driverId: this.driverId,
      //   carrierId: this.carrierId
      // }
      Object.assign(data, { driverId: this.driverId || '' })
      carrierAddVehicle(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = this.validate
      // {
      //   carNO: this.validate.carNO,
      //   carType: this.validate.carType,
      //   shippingWeight: this.validate.shippingWeight,
      //   carLength: this.validate.carLength,
      //   shippingVolume: this.validate.shippingVolume,
      //   driverId: this.driverId,
      //   carrierId: this.carrierId,
      //   carId: this.carId
      // }
      Object.assign(data, { driverId: this.driverId || '' })
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
  @import "../client.styl"
</style>
