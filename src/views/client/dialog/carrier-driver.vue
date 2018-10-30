<!--承运商详情----司机新增编辑-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      width="1020"
      label-position="left"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="90">
        <p class="modalTitle">基础信息</p>
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
          <FormItem label="合作方式:" prop="driverType">
            <Row>
              <Col span="20">
              <Select v-model="validate.driverType" class="minWidth">
                <Option
                  v-for="item in selectList"
                  :value="item.id"
                  :key="item.id">
                  {{ item.name }}
                </Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="司机姓名:" prop="driverName">
            <Row>
              <Col span="20">
              <Input v-model="validate.driverName" placeholder="必填"></Input>
                </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="手机号:" prop="driverPhone">
            <Row>
              <Col span="20">
              <Input v-model="validate.driverPhone" placeholder="必填"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="车型:" prop="carType">
            <Row>
              <Col span="20">
              <Select v-model="validate.carType" >
                <Option v-for="(item, key) in carTypeMap" :key="key" :value="key">{{item}}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="车长:" prop="carLength">
            <Row>
              <Col span="20">
              <Select v-model="validate.carLength" >
                <Option v-for="(item, key) in carLengthMap" :key="key" :value="''+item.value">{{item.label}}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="载重:" prop="shippingWeight">
            <Row>
              <Col span="20">
              <Input v-model="validate.shippingWeight" placeholder="必填"></Input>
              </Col>
              <Col span="2" offset="1">
              <span>吨</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="净空:">
            <Row>
              <Col span="20">
              <Input v-model="validate.shippingVolume"></Input>
              </Col>
              <Col span="2" offset="1">
              <span>吨</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="购买日期:">
            <Row>
              <Col span="20">
              <DatePicker v-model="validate.purchDate" format="yyyy-MM-dd" type="date" placeholder="请选择日期">
              </DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="车辆品牌:">
            <Row>
              <Col span="20">
              <Input v-model="validate.carBrand" placeholder="如：东风"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <p class="modalTitle">常跑线路</p>
        <div class="lineDiv">
          <Row>
            <Col span="8">
            <FormItem label="出发地1:">
              <CitySelect ref="start" :code-type="codeType" v-model="address1.s" clearable></CitySelect>
            </FormItem>
            </Col>
            <Col span="8" style="margin-left: 25px;">
            <FormItem label="目的地1:">
              <CitySelect ref="start" :code-type="codeType" v-model="address1.e" clearable></CitySelect>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
            <FormItem label="出发地2:">
              <CitySelect ref="start" :code-type="codeType" v-model="address2.s" clearable></CitySelect>
            </FormItem>
            </Col>
            <Col span="8" style="margin-left: 25px;">
            <FormItem label="目的地2:">
              <CitySelect ref="start" :code-type="codeType" v-model="address2.e" clearable></CitySelect>
            </FormItem>
            </Col>
          </Row>
        </div>
        <p class="modalTitle">证件照</p>
        <Row>
          <Col span="5">
          <up-load ref="upload1"></up-load>
          <p class="uploadLabel">行驶证</p>
          </Col>
          <Col span="5">
          <up-load ref="upload2"></up-load>
          <p class="uploadLabel">驾驶证</p>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="footerSty">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { CAR_TYPE1, CAR_LENGTH, DRIVER_TYPE } from '@/libs/constant/carInfo'
import BaseDialog from '@/basic/BaseDialog'
import { carrierAddDriver, carrierUpdateDriver, CODE, CAR } from '../client'
import CitySelect from '@/components/SelectInputForCity'
import UpLoad from '@/components/upLoad/'
export default {
  name: 'carrier-driver',
  components: {
    CitySelect,
    UpLoad
  },
  mixins: [BaseDialog],
  data () {
    return {
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      carrierId: '', // 承运商id
      driverId: '', // 司机id
      validate: {},
      address: [],
      address1: {},
      address2: {},
      codeType: 1,
      selectList: DRIVER_TYPE,
      ruleValidate: {
        carNO: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        driverType: [
          { required: true, message: '合作方式不能为空', trigger: 'blur' }
        ],
        driverName: [
          { required: true, message: '司机姓名不能为空', trigger: 'blur' }
        ],
        driverPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
        ],
        carType: [
          { required: true, message: '车型不能为空', trigger: 'blur' }
        ],
        carLength: [
          { required: true, message: '车长不能为空', trigger: 'blur' }
        ],
        shippingWeight: [
          { required: true, message: '载重不能为空' },
          { message: '必须为大于等于0的数字,最多两位小数', pattern: /^(0|([1-9]\d*))([.]\d{1,2})?$/ }
        ]
      }
    }
  },
  mounted () {
    if (this.title === '修改车辆') {
      this.validate.carrierId = this.carrierId
      this.validate.driverType = this.validate.driverType.toString()
      this.validate.carType = this.validate.carType.toString()
      this.validate.carLength = this.validate.carLength.toString()
      if (this.validate.regularLine) {
        this.address1 = JSON.parse(this.validate.regularLine)[0]
        this.address2 = JSON.parse(this.validate.regularLine)[1]
      }
    }
  },
  methods: {
    save (name) {
      this.validate.carrierId = this.carrierId
      this.validate.travelPhoto = this.$refs.upload1.uploadImg
      this.validate.drivePhoto = this.$refs.upload2.uploadImg
      if (this.address1.s !== null || this.address1.n !== null) {
        this.address.push(this.address1)
      }
      if (this.address2.s !== null || this.address2.n !== null) {
        this.address.push(this.address2)
      }
      this.validate.regularLine = JSON.stringify(this.address)
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
      carrierAddDriver(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = this.validate
      carrierUpdateDriver(data).then(res => {
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
