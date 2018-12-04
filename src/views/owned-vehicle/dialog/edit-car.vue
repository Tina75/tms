<!--承运商详情----司机新增编辑-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      transfer
      width="1020"
      label-position="left"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center;font-weight: bold;">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="90" label-position="right">
        <p class="modalTitle">基础信息</p>
        <Row>
          <Col span="8">
          <FormItem label="车牌号：" prop="carNo">
            <Row>
              <Col span="20">
              <SelectInput v-model="validate.carNo" :maxlength="8" :parser="formatterCarNo" placeholder="必填"></SelectInput>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="车型：" prop="carType">
            <Row>
              <Col span="20">
              <Select v-model="validate.carType" transfer >
                <Option v-for="(item, key) in carTypeMap" :key="key" :value="key">{{item}}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="车长：" prop="carLength">
            <Row>
              <Col span="20">
              <Select v-model="validate.carLength" transfer >
                <Option v-for="(item, key) in carLengthMap" :key="key" :value="''+item.value">{{item.label}}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="载重：" prop="shippingWeight">
            <Row>
              <Col span="20">
              <Input v-model="validate.shippingWeight" :maxlength="9" placeholder="必填"></Input>
              </Col>
              <Col span="2" offset="1">
              <span>吨</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="净空：" prop="shippingVolume">
            <Row>
              <Col span="20">
              <Input v-model="validate.shippingVolume" :maxlength="9" placeholder="请输入"></Input>
              </Col>
              <Col span="2" offset="1">
              <span>方</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="车辆品牌：">
            <Row>
              <Col span="20">
              <Input v-model="validate.carBrand" :maxlength="20" placeholder="如：东风"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="购买日期：">
            <Row>
              <Col span="20">
              <DatePicker v-model="validate.purchDate" transfer format="yyyy-MM-dd" type="date" placeholder="请选择日期">
              </DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="16">
          <driver-Inputs></driver-Inputs>
          </Col>
        </Row>
        <p class="modalTitle">常跑线路</p>
        <div class="lineDiv">
          <Row>
            <Col span="8">
            <FormItem label="出发地1：">
              <CitySelect ref="start" :code-type="codeType" v-model="address1.s" clearable></CitySelect>
            </FormItem>
            </Col>
            <Col span="8" style="margin-left: 25px;">
            <FormItem label="目的地1：">
              <CitySelect ref="start" :code-type="codeType" v-model="address1.e" clearable></CitySelect>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
            <FormItem label="出发地2：">
              <CitySelect ref="start" :code-type="codeType" v-model="address2.s" clearable></CitySelect>
            </FormItem>
            </Col>
            <Col span="8" style="margin-left: 25px;">
            <FormItem label="目的地2：">
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
          <p class="uploadLabelID">道路运输证</p>
          </Col>
        </Row>
        <p class="modalTitle">备注</p>
        <Input v-model="validate.remark" :maxlength="100" type="textarea" placeholder="请输入"></Input>
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
import { CAR, formatterCarNo } from '../client'
import BaseDialog from '@/basic/BaseDialog'
import CitySelect from '@/components/SelectInputForCity'
import UpLoad from '@/components/upLoad/index.vue'
import SelectInput from '@/components/SelectInput'
import DriverInputs from '@/components/own-car-form/OwnDriverInputs'
import _ from 'lodash'
import Server from '@/libs/js/server'
export default {
  name: 'carrier-driver',
  components: {
    CitySelect,
    UpLoad,
    SelectInput,
    DriverInputs
  },
  mixins: [BaseDialog],
  data () {
    return {
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      validate: {},
      address: [],
      address1: {},
      address2: {},
      flagAddress: true,
      codeType: 1,
      selectList: DRIVER_TYPE,
      formatterCarNo: formatterCarNo, // 车牌号大写转换
      ruleValidate: {
        carNo: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        carType: [
          { required: true, message: '车型不能为空', trigger: 'change' }
        ],
        carLength: [
          { required: true, message: '车长不能为空', trigger: 'change' }
        ],
        shippingWeight: [
          { message: '小于等于六位整数,最多两位小数', pattern: /^[0-9]{0,6}(?:\.\d{1,2})?$/ }
        ],
        shippingVolume: [
          { message: '小于等于六位整数,最多一位小数', pattern: /^[0-9]{0,6}(?:\.\d{1})?$/ }
        ]
      }
    }
  },
  mounted () {
    this.configData()
  },
  methods: {
    // 修改页面初始值更改
    configData () {
      if (this.flag === 2) {
        this.validate.purchDate = this.validate.purchDate
        this.validate.carType = this.validate.carType.toString()
        this.validate.carLength = this.validate.carLength.toString()
        this.$refs.upload1.progress = 1
        this.$refs.upload2.progress = 1
        this.$refs.upload1.uploadImg = this.validate.travelPhoto
        this.$refs.upload2.uploadImg = this.validate.roadTransPhoto
        this.validate.carBrand = this.validate.carBrand
        if (this.validate.regularLine && JSON.parse(this.validate.regularLine).length > 0) {
          if (JSON.parse(this.validate.regularLine).length === 1) {
            this.address1 = JSON.parse(this.validate.regularLine)[0]
          } else {
            this.address1 = JSON.parse(this.validate.regularLine)[0]
            this.address2 = JSON.parse(this.validate.regularLine)[1]
          }
        }
      }
    },
    // 格式常跑路线信息
    checkLine () {
      this.address = []
      this.flagAddress = true
      // 线路统一
      if (!_.isNil(this.address1) && (!_.isNil(this.address1.s) && !_.isNil(this.address1.e))) {
        this.address.push(this.address1)
      } else if (_.isNil(this.address1.s) && _.isNil(this.address1.e)) {
      } else {
        this.$Message.error('请完善常跑线路1信息')
        this.flagAddress = false
      }
      if (!_.isNil(this.address2) && (!_.isNil(this.address2.s) && !_.isNil(this.address2.e))) {
        this.address.push(this.address2)
      } else if (_.isNil(this.address2.s) && _.isNil(this.address2.e)) {
      } else {
        this.$Message.error('请完善常跑线路2信息')
        this.flagAddress = false
      }
    },
    save (name) {
      this.flagAddress = true
      this.validate.travelPhoto = this.$refs.upload1.uploadImg
      this.validate.roadTransPhoto = this.$refs.upload2.uploadImg
      if (this.validate.purchDate) {
        this.validate.purchDate = new Date(this.validate.purchDate).Format('yyyy-MM-dd hh:mm:ss')
      }
      this.checkLine()
      if (!this.flagAddress) {
        return
      }
      this.validate.regularLine = JSON.stringify(this.address)
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag === 1) { // 新增
            this.add()
          } else { // 2-编辑
            this.update()
          }
        }
      })
    },
    add () {
      let vm = this
      Server({
        url: '/ownerCar/addCar',
        method: 'post',
        data: this.validate
      }).then(({ data }) => {
        if (data.code === 10000) {
          vm.ok()
          vm.$Message.success(data.msg)
          vm.close()
        }
      })
    },
    update () {
      let vm = this
      Server({
        url: '/ownerCar/updateCar',
        method: 'post',
        data: this.validate
      }).then(({ data }) => {
        if (data.code === 10000) {
          vm.ok()
          vm.$Message.success(data.msg)
          vm.close()
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../client.styl"
.modalTitle
  font-size: 14px;
</style>
