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
          <FormItem label="车牌号：" prop="carNO">
            <Row>
              <Col span="20">
              <SelectInput v-model="validate.carNO" :maxlength="8" :parser="formatterCarNo" placeholder="必填"></SelectInput>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="合作方式：" prop="driverType">
            <Row>
              <Col span="20">
              <Select v-model="validate.driverType" transfer class="minWidth">
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
          <FormItem label="司机姓名：" prop="driverName">
            <Row>
              <Col span="20">
              <Input v-model="validate.driverName" :maxlength="20" placeholder="必填"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="手机号：" prop="driverPhone">
            <Row>
              <Col span="20">
              <SelectInput v-model="validate.driverPhone" :maxlength="11" :remote="true" :remote-method="queryDriverByPhoneList" placeholder="必填" @on-select="slectDriverData"></SelectInput>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="车型：">
            <Row>
              <Col span="20">
              <SelectCarType v-model="validate.carType" placeholder="请选择" clearable></SelectCarType>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="车长：">
            <Row>
              <Col span="20">
              <SelectCarLength v-model="validate.carLength" placeholder="请选择" clearable></SelectCarLength>
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
              <TagNumberInput :min="0" :precision="$numberPrecesion.weight" v-model="validate.shippingWeight" :show-chinese="false" placeholder="请输入"></TagNumberInput>
              <!-- <Input :precision="$numberPrecesion.weight" v-model="validate.shippingWeight" :maxlength="9" placeholder="必填"></Input> -->
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
              <TagNumberInput :min="0" :precision="$numberPrecesion.volume" v-model="validate.shippingVolume" :show-chinese="false" placeholder="请输入"></TagNumberInput>
              <!-- <Input :min="0" :precision="$numberPrecesion.volume" v-model="validate.shippingVolume" :maxlength="9" placeholder="请输入"></Input> -->
              </Col>
              <Col span="2" offset="1">
              <span>方</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
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
        </Row>
        <Row>
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
          <up-load ref="upload2"></up-load>
          <p class="uploadLabel">驾驶证</p>
          </Col>
          <Col span="5">
          <up-load ref="upload1"></up-load>
          <p class="uploadLabel">行驶证</p>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="footerSty">
        <Button :loading="loading" type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { CAR_TYPE1, CAR_LENGTH, DRIVER_TYPE } from '@/libs/constant/carInfo'
import BaseDialog from '@/basic/BaseDialog'
import { carrierAddDriver, carrierUpdateDriver, carrierQueryDriverlist, formatterCarNo, CODE, CAR } from '../pages/client'
import CitySelect from '@/components/SelectInputForCity'
import UpLoad from '@/components/upLoad/index.vue'
import SelectInput from '@/components/SelectInput'
import SelectCarLength from '@/components/SelectCarLength'
import SelectCarType from '@/components/SelectCarType'
import TagNumberInput from '@/components/TagNumberInput'
import _ from 'lodash'
export default {
  name: 'carrier-driver',
  components: {
    CitySelect,
    UpLoad,
    SelectInput,
    SelectCarLength,
    SelectCarType,
    TagNumberInput
  },
  mixins: [BaseDialog],
  data () {
    return {
      loading: false,
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      carrierId: '', // 承运商id
      driverId: '', // 司机id
      carId: '',
      validate: {
        shippingWeight: null,
        shippingVolume: null
      },
      address: [],
      address1: {},
      address2: {},
      flagAddress: true,
      codeType: 1,
      selectList: DRIVER_TYPE,
      formatterCarNo: formatterCarNo, // 车牌号大写转换
      ruleValidate: {
        carNO: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        driverType: [
          { required: true, message: '合作方式不能为空', trigger: 'change' }
        ],
        driverName: [
          { required: true, message: '司机姓名不能为空', trigger: 'blur' }
        ],
        driverPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/ }
        ],
        shippingWeight: [
          { message: '小于等于六位整数,最多三位小数', pattern: /^[0-9]{0,6}(?:\.\d{1,3})?$/ }
        ],
        shippingVolume: [
          { message: '小于等于六位整数,最多六位小数', pattern: /^[0-9]{0,6}(?:\.\d{1,6})?$/ }
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
      if (this.title === '修改车辆') {
        this.validate.carrierId = this.carrierId
        this.validate.carId = this.carId
        this.validate.driverType = this.validate.driverType.toString()
        this.validate.carType = this.validate.carType.toString()
        this.validate.carLength = this.validate.carLength.toString()
        this.$refs.upload1.progress = 1
        this.$refs.upload2.progress = 1
        this.$refs.upload1.uploadImg = this.validate.travelPhoto
        this.$refs.upload2.uploadImg = this.validate.drivePhoto
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
      this.validate.carrierId = this.carrierId
      this.validate.carId = this.carId
      this.validate.travelPhoto = this.$refs.upload1.uploadImg
      this.validate.drivePhoto = this.$refs.upload2.uploadImg
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
          this.loading = true
          if (this.flag === 1) { // 新增
            this.add()
          } else { // 2-编辑
            this.update()
          }
        }
      })
    },
    add () {
      let data = this.validate
      carrierAddDriver(data).then(res => {
        this.$Message.success(res.data.msg)
        this.loading = false
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
    },
    update () {
      let data = this.validate
      carrierUpdateDriver(data).then(res => {
        this.loading = false
        this.$Message.success(res.data.msg)
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
    },
    // 输入手机号，选中某条信息自动填充以后司机信息（姓名，合作方式。。）
    slectDriverData (val, dirverInit) {
      this.validate.driverName = dirverInit.driverName
      this.validate.driverType = dirverInit.driverType.toString()
    },
    // 手机号输入联想
    queryDriverByPhoneList (driverPhone) {
      if (!driverPhone) {
        return Promise.resolve([])
      }
      return carrierQueryDriverlist({
        driverPhone,
        carrierId: this.carrierId
      }).then(res => {
        if (res.data.code === CODE) {
          return res.data.data.map(item => ({
            value: item.driverPhone,
            name: item.driverName + '/' + item.driverPhone,
            driverName: item.driverName,
            driverType: item.driverType
          }
          ))
        }
      }).catch((errorInfo) => {
        return Promise.reject(errorInfo)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../pages/client.styl"
.modalTitle
  font-size: 14px;
</style>
