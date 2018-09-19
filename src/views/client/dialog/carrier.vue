<template>
  <Modal
    v-model="modal"
    :mask-closable="true"
    label-position="left"
    @on-visible-change="close"
  >
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form :model="validate.type" :rules="ruleValidate.type" :label-width="122">
      <FormItem  label="类型:" prop="selectStatus">
        <Select v-model="validate.type.selectStatus" :disabled="flag===2">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
    <!--个体司机-->
    <Form v-show="validate.type.selectStatus == 1" ref="validateDriver" :model="validate.driver" :rules="ruleValidate.driver" :label-width="122">
      <FormItem label="司机姓名:" prop="driverName">
        <Input v-model="validate.driver.driverName" :maxlength="15" placeholder="请输入"/>
      </FormItem>
      <FormItem label="手机号码" prop="driverPhone">
        <Input v-model="validate.driver.driverPhone" placeholder="请输入"/>
      </FormItem>
      <FormItem label="车牌号" prop="carNO">
        <Input v-model="validate.driver.carNO" placeholder="请输入"/>
      </FormItem>
      <FormItem label="车型:" prop="carType">
        <Select v-model="validate.driver.carType" >
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
        <Select v-model="validate.driver.carLength" >
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
      <FormItem label="核定载重量" prop="shippingWeight">
        <Input v-model="validate.driver.shippingWeight" placeholder="请输入"/>吨
      </FormItem>
      <FormItem label="车载容积" prop="shippingVolume">
        <Input v-model="validate.driver.shippingVolume" placeholder="请输入"/>方
      </FormItem>
      <FormItem label="结算方式:" >
        <Select v-model="validate.driver.payType" clearable>
          <!--<Option value="">请选择</Option>-->
          <!--<Option value="1">现付</Option>-->
          <!--<Option value="2">到付</Option>-->
          <Option value="3">回单付</Option>
          <Option value="4">月结</Option>
          <!--<Option value="5">预付+到付</Option>-->
          <!--<Option value="6">预付+回付</Option>-->
          <!--<Option value="7">到付+回付</Option>-->
          <!--<Option value="8">三段付</Option>-->
        </Select>
      </FormItem>
      <FormItem label="备注:" >
        <Input v-model="validate.driver.remark" :autosize="{minRows: 2,maxRows: 5}" :maxlength="100" type="textarea"  placeholder="请输入"/>
      </FormItem>
    </Form>
    <!--运输公司-->
    <Form v-show="validate.type.selectStatus == 2" ref="validateCompany" :model="validate.company" :rules="ruleValidate.company" :label-width="122">
      <FormItem label="承运商名称:" prop="carrierName">
        <Input v-model="validate.company.carrierName" :maxlength="20" placeholder="请输入"/>
      </FormItem>
      <FormItem label="负责人" prop="carrierPrincipal">
        <Input v-model="validate.company.carrierPrincipal" :maxlength="15" placeholder="请输入"/>
      </FormItem>
      <FormItem label="联系电话" prop="carrierPhone">
        <Input v-model="validate.company.carrierPhone" placeholder="请输入"/>
      </FormItem>
      <FormItem label="结算方式:">
        <Select v-model="validate.company.payType" clearable>
          <!--<Option value="">请选择</Option>-->
          <!--<Option value="1">现付</Option>-->
          <!--<Option value="2">到付</Option>-->
          <Option value="3">回单付</Option>
          <Option value="4">月结</Option>
        </Select>
      </FormItem>
      <FormItem label="备注:" >
        <Input v-model="validate.company.remark" :autosize="{minRows: 2,maxRows: 5}" :maxlength="100" type="textarea"  placeholder="请输入"/>
      </FormItem>
    </Form>
    <div v-if="validate.type.selectStatus == 1" slot="footer">
      <Button type="primary" @click="save('validateDriver')">确定</Button>
      <Button style="margin-left: 8px" @click.native="modal = false">取消</Button>
    </div>
    <div v-else slot="footer">
      <Button type="primary" @click="save('validateCompany')">确定</Button>
      <Button style="margin-left: 8px" @click.native="modal = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { carrierAddForDriver, carrierAddForCompany, carrierForDriverUpdate, carrierForCompanyUpdate, CODE, CAR } from '../client'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'carrier',
  mixins: [BaseDialog],
  data () {
    return {
      flag: 2,
      modal: true,
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
          selectStatus: 1
        },
        driver: { // 1 个体司机
          driverName: '',
          driverPhone: '',
          carNO: '',
          carType: 1,
          carLength: 1,
          shippingWeight: '',
          shippingVolume: '',
          remark: '',
          payType: '' // 付款方式 1：现付 2：到付 3：回单付 4：月结 5 预付+到付 6 预付+回付 7 到付+回付 8 三段付
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
            { required: true, message: '司机名称不能为空', trigger: 'blur' }
          ],
          driverPhone: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
          ],
          carNO: [
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
            { required: true, message: '载重量不能为空', trigger: 'blur' },
            { type: 'string', message: '必须为大于0的数,且精确到两位小数', pattern: /^(\+)?\d+(\.\d{1,2})?$/, trigger: 'blur' }
          ],
          shippingVolume: [
            { type: 'string', message: '必须为大于0的数,且精确到一位小数', pattern: /^(\+)?\d+(\.\d{1})?$/, trigger: 'blur' }
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
            { required: true, message: '承运商名称不能为空', trigger: 'blur' },
            { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
          ]
        }
      }
    }
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag === 1) { // 新增
            if (this.validate.type.selectStatus === 1) { // 司机
              this._carrierAddForDriver()
            } else {
              this._carrierAddForCompany()
            }
          } else { // 2-编辑
            if (this.validate.type.selectStatus === 1) { // 司机
              this._carrierForDriverUpdate()
            } else {
              this._carrierForCompanyUpdate()
            }
          }
          this.modal = false
        }
      })
    },
    _carrierAddForDriver () {
      let data = {
        driverName: this.validate.driver.driverName,
        driverPhone: this.validate.driver.driverPhone,
        carNO: this.validate.driver.carNO,
        carType: this.validate.driver.carType,
        carLength: this.validate.driver.carLength,
        shippingWeight: Math.floor(this.validate.driver.shippingWeight * 100) / 100,
        shippingVolume: Math.floor(this.validate.driver.shippingVolume * 10) / 10,
        remark: this.validate.driver.remark,
        payType: this.validate.driver.payType
      }
      carrierAddForDriver(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
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
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    _carrierForDriverUpdate () {
      let data = {
        driverName: this.validate.driver.driverName,
        driverPhone: this.validate.driver.driverPhone,
        carNO: this.validate.driver.carNO,
        carType: this.validate.driver.carType,
        carLength: this.validate.driver.carLength,
        shippingWeight: Math.floor(this.validate.driver.shippingWeight * 100) / 100,
        shippingVolume: Math.floor(this.validate.driver.shippingVolume * 10) / 10,
        remark: this.validate.driver.remark,
        payType: this.validate.driver.payType,
        carrierId: this.id
      }
      carrierForDriverUpdate(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
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
