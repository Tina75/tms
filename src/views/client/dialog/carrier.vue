<template>
  <Modal
    v-model="visiable"
    :mask-closable="false"
    transfer
    label-position="left"
    class="modal"
    width="1020"
    @on-visible-change="close"
  >
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form :model="validate.type" :rules="ruleValidate.type" :label-width="122" label-position="left">
      <FormItem  label="承运商类型：" prop="selectStatus">
        <RadioGroup v-model="validate.type.selectStatus">
          <Radio :disabled="radioDisabled" label="1">
            <span>个体司机</span>
          </Radio>
          <Radio :disabled="radioDisabled" label="2" style="margin-left: 35px;">
            <span>运输公司</span>
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div class="list-info"></div>
    <!--个体司机-->
    <Form v-show="validate.type.selectStatus == 1" ref="validateDriver" :model="validate.driver" :rules="ruleValidate.driver" :label-width="90" label-position="right">
      <p class="modalTitle">基础信息</p>
      <Row>
        <Col :span="8">
        <FormItem label="司机姓名：" prop="driverName">
          <Input v-model="validate.driver.driverName" :maxlength="15" class="formInputSty" placeholder="必填"/>
        </FormItem>
        </Col>
        <Col :span="8">
        <FormItem label="手机号：" prop="driverPhone">
          <Input v-model="validate.driver.driverPhone" :maxlength="11" class="formInputSty" placeholder="必填"/>
        </FormItem>
        </Col>
        <Col :span="8">
        <FormItem label="车牌号：" prop="carNO">
          <SelectInput v-model="validate.driver.carNO" :maxlength="8" :parser="formatterCarNo" class="formInputSty" placeholder="必填"></SelectInput>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="8">
        <FormItem label="车型：">
          <SelectCustom v-model="validate.driver.carType" type="carType" class="formInputSty" placeholder="请选择" clearable></SelectCustom>
        </FormItem>
        </Col>
        <Col :span="8">
        <FormItem label="车长：">
          <SelectCustom v-model="validate.driver.carLength" type="carLength" class="formInputSty" placeholder="请选择" clearable></SelectCustom>
        </FormItem>
        </Col>
        <Col :span="8">
        <FormItem label="载重：" prop="shippingWeight">
          <Row>
            <Col span="20">
            <TagNumberInput :min="0" v-model="validate.driver.shippingWeight" :show-chinese="false" class="formInputSty" placeholder="请输入"></TagNumberInput>
              </Col>
            <Col span="2" offset="1">
            <span>吨</span>
              </Col>
          </Row>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="8">
        <FormItem label="净空：" prop="shippingVolume">
          <Row>
            <Col span="20">
            <TagNumberInput :min="0" v-model="validate.driver.shippingVolume" :show-chinese="false" class="formInputSty" placeholder="请输入"></TagNumberInput>
            </Col>
            <Col span="2" offset="1">
            <span>方</span>
            </Col>
          </Row>
        </FormItem>
        </Col>
        <Col :span="8">
        <FormItem label="车辆品牌：">
          <Input v-model="validate.driver.carBrand" :maxlength="20" class="formInputSty" placeholder="如：东风"></Input>
        </FormItem>
        </Col>
        <Col :span="8">
        <FormItem label="结算方式：">
          <Select v-model="validate.driver.payType" transfer class="formInputSty" clearable>
            <Option v-for="(item,key) in payTypeMap" :key="key" :value="key">{{item}}</Option>
          </Select>
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
        <up-load ref="upload1"></up-load>
        <p :upload-img="validate.driver.travelPhoto" class="uploadLabel">行驶证</p>
        </Col>
        <Col span="5">
        <up-load ref="upload2"></up-load>
        <p :upload-img="validate.driver.drivePhoto" class="uploadLabel">驾驶证</p>
        </Col>
      </Row><br/>
      <Row>
        <p class="modalTitle">备注</p>
        <Col :span="24">
        <Input
          v-model="validate.driver.remark"
          :autosize="{minRows: 2,maxRows: 5}"
          :maxlength="100"
          style="width:100%"
          type="textarea"
          placeholder="请输入"/>
        </Col>
      </Row>
    </Form>
    <!--运输公司-->
    <Form v-show="validate.type.selectStatus == 2" ref="validateCompany" :model="validate.company" :rules="ruleValidate.company" :label-width="120" label-position="right">
      <p class="modalTitle">基础信息</p>
      <Row>
        <Col span="8">
        <FormItem label="承运商名称：" prop="carrierName">
          <Input v-model="validate.company.carrierName" :maxlength="20" placeholder="请输入"/>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="负责人：" prop="carrierPrincipal">
          <Input v-model="validate.company.carrierPrincipal" :maxlength="15" placeholder="请输入"/>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="联系电话：" prop="carrierPhone">
          <Input v-model="validate.company.carrierPhone" :maxlength="11" placeholder="请输入"/>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
        <FormItem label="结算方式：">
          <Select v-model="validate.company.payType" transfer clearable>
            <Option v-for="(item,key) in payTypeMap" :key="key" :value="key">{{item}}</Option>
          </Select>
        </FormItem>
        </Col>
      </Row>
      <p class="modalTitle">备注</p>
      <Input
        v-model="validate.company.remark"
        :autosize="{minRows: 2,maxRows: 5}"
        :maxlength="100"
        style="width:100%"
        type="textarea"
        placeholder="请输入"/>
    </Form>
    <div v-if="validate.type.selectStatus == 1" slot="footer">
      <Button :loading="loading" type="primary" @click="save('validateDriver')">确定</Button>
      <Button style="margin-left: 8px" @click.native="close">取消</Button>
    </div>
    <div v-else slot="footer">
      <Button :loading="loading" type="primary" @click="save('validateCompany')">确定</Button>
      <Button style="margin-left: 8px" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { CAR_TYPE1, CAR_LENGTH } from '@/libs/constant/carInfo'
import { carrierAddForDriver, carrierAddForCompany, carrierForDriverUpdate, carrierForCompanyUpdate, formatterCarNo, CAR } from '../client'
import BaseDialog from '@/basic/BaseDialog'
import CitySelect from '@/components/SelectInputForCity'
import SelectInput from '@/components/SelectInput'
import UpLoad from '@/components/upLoad/index.vue'
import TagNumberInput from '@/components/TagNumberInput'
import SelectCustom from '@/components/SelectCustom'
import _ from 'lodash'
export default {
  name: 'carrier',
  components: { CitySelect, UpLoad, SelectInput, TagNumberInput, SelectCustom },
  mixins: [BaseDialog],
  data () {
    return {
      loading: false,
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      flag: 2,
      codeType: 1,
      address: [],
      address1: {},
      address2: {},
      flagAddress: true,
      radioDisabled: false,
      formatterCarNo: formatterCarNo, // 车牌号大写转换
      payTypeMap: {
        1: '按单付',
        2: '月结'
      },
      selectList: [
        {
          value: 1,
          label: '个体司机'
        },
        {
          value: 2,
          label: '运输公司'
        }
      ],
      id: '',
      validate: {
        type: {
          selectStatus: '1'
        },
        driver: { // 1 个体司机
          driverName: '',
          driverPhone: '',
          carNO: '',
          carType: '',
          carLength: '',
          shippingWeight: '',
          shippingVolume: '',
          remark: '',
          payType: '', // 付款方式 1：现付 2：到付 3：回单付 4：月结 5 预付+到付 6 预付+回付 7 到付+回付 8 三段付
          carBrand: '',
          travelPhoto: '',
          drivePhoto: '',
          regularLine: ''
        },
        company: {
          carrierName: '',
          carrierPrincipal: '',
          carrierPhone: '',
          payType: '', // 支付方式1：现付 2：到付 3：回单付 4：月结
          remark: ''
        }
      },
      ruleValidate: {
        type: {
          selectStatus: [
            { required: true }
          ]
        },
        driver: {
          driverName: [
            { required: true, message: '司机姓名不能为空', trigger: 'blur' }
          ],
          driverPhone: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
          ],
          carNO: [
            { required: true, message: '车牌号不能为空', trigger: 'blur' },
            { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
          ],
          shippingWeight: [
            { message: '小于等于六位整数,最多两位小数', pattern: /^[0-9]{0,6}(?:\.\d{1,2})?$/ }
          ],
          shippingVolume: [
            { message: '小于等于六位整数,最多一位小数', pattern: /^[0-9]{0,6}(?:\.\d{1})?$/ }
          ]
        },
        company: {
          carrierName: [
            { required: true, message: '承运商名称不能为空', trigger: 'blur' }
          ],
          carrierPrincipal: [
            { required: true, message: '负责人名称不能为空', trigger: 'blur' }
          ],
          carrierPhone: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' },
            { type: 'string', message: '联系电话格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
          ]
        }
      }
    }
  },
  mounted () {
    // 修改
    if (this.validate.type.selectStatus === 1) { // 个人司机
      this.radioDisabled = true
      this.validate.type.selectStatus = '1'
      this.getImageDate()
      if (this.validate.driver.regularLine && JSON.parse(this.validate.driver.regularLine).length > 0) {
        if (JSON.parse(this.validate.driver.regularLine).length === 1) {
          this.address1 = JSON.parse(this.validate.driver.regularLine)[0]
        } else {
          this.address1 = JSON.parse(this.validate.driver.regularLine)[0]
          this.address2 = JSON.parse(this.validate.driver.regularLine)[1]
        }
      }
    } else if (this.validate.type.selectStatus === 2) {
      this.radioDisabled = true
      this.validate.type.selectStatus = '2'
    }
  },
  methods: {
    // 图片传入赋值data
    setImageDate () {
      this.$refs.upload1.progress = 1
      this.$refs.upload2.progress = 1
      this.validate.driver.travelPhoto = this.$refs.upload1.uploadImg
      this.validate.driver.drivePhoto = this.$refs.upload2.uploadImg
    },
    getImageDate () {
      this.$refs.upload1.progress = 1
      this.$refs.upload2.progress = 1
      this.$refs.upload1.uploadImg = this.validate.driver.travelPhoto
      this.$refs.upload2.uploadImg = this.validate.driver.drivePhoto
    },
    initRequestParam () {
      return {
        carrierId: this.id,
        driverName: this.validate.driver.driverName,
        driverPhone: this.validate.driver.driverPhone,
        carNO: this.validate.driver.carNO,
        carType: this.validate.driver.carType,
        carLength: this.validate.driver.carLength,
        shippingWeight: this.validate.driver.shippingWeight,
        shippingVolume: this.validate.driver.shippingVolume,
        remark: this.validate.driver.remark,
        payType: this.validate.driver.payType,
        carBrand: this.validate.driver.carBrand,
        travelPhoto: this.validate.driver.travelPhoto,
        drivePhoto: this.validate.driver.drivePhoto,
        regularLine: JSON.stringify(this.address)
      }
    },
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.setImageDate()
          // 常用线路校验
          this.checkLine()
          if (!this.flagAddress) {
            return
          }
          if (this.flag === 1) { // 新增
            this.loading = true
            if (this.validate.type.selectStatus === '1') { // 司机
              this._carrierAddForDriver()
            } else {
              this._carrierAddForCompany()
            }
          } else { // 2-编辑
            this.loading = true
            if (this.validate.type.selectStatus === '1') { // 司机
              this._carrierForDriverUpdate()
            } else {
              this._carrierForCompanyUpdate()
            }
          }
        }
      })
    },
    _carrierAddForDriver () {
      let data = this.initRequestParam()
      carrierAddForDriver(data).then(res => {
        this.openTab({
          path: '/client/carrier-info',
          title: '承运商详情',
          query: { id: res.data.data, carrierType: 1 }
        })
        this.loading = false
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
    },
    _carrierAddForCompany () {
      let data = {
        carrierName: this.validate.company.carrierName,
        carrierPrincipal: this.validate.company.carrierPrincipal,
        carrierPhone: this.validate.company.carrierPhone,
        payType: this.validate.company.payType,
        remark: this.validate.company.remark
      }
      carrierAddForCompany(data).then(res => {
        this.openTab({
          path: '/client/carrier-info',
          title: '承运商详情',
          query: { id: res.data.data, carrierType: 2 }
        })
        this.loading = false
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
    },
    _carrierForDriverUpdate () {
      let data = this.initRequestParam()
      carrierForDriverUpdate(data).then(res => {
        this.loading = false
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
    },
    _carrierForCompanyUpdate () {
      let data = {
        carrierName: this.validate.company.carrierName,
        carrierPrincipal: this.validate.company.carrierPrincipal,
        carrierPhone: this.validate.company.carrierPhone,
        payType: this.validate.company.payType,
        remark: this.validate.company.remark,
        carrierId: this.id
      }
      carrierForCompanyUpdate(data).then(res => {
        this.loading = false
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
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
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../client.styl"
.ivu-input-wrapper,.ivu-select
  width: 86%
  margin-right 8px
.modalTitle
  font-size: 14px;
.list-info
  border-top 1px dashed #cbced3
  padding-top 20px
  margin-top -10px
.formInputSty
  width 190px
</style>
