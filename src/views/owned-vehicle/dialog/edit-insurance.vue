<!--保险-->
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
            <SelectInput v-model="validate.carNo" :maxlength="8" :parser="formatterCarNo" placeholder="必填"></SelectInput>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="保单号：" prop="carType">
            <SelectInput v-model="validate.carNo" :maxlength="8" :parser="formatterCarNo" placeholder="必填"></SelectInput>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="保险公司：" prop="carLength">
            <SelectInput v-model="validate.carNo" :maxlength="8" :parser="formatterCarNo" placeholder="必填"></SelectInput>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="购买日期：" prop="shippingWeight">
            <DatePicker v-model="validate.purchDate" transfer format="yyyy-MM-dd" type="date" placeholder="请选择日期">
            </DatePicker>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="生效日期：" prop="shippingVolume">
            <DatePicker v-model="validate.purchDate" transfer format="yyyy-MM-dd" type="date" placeholder="请选择日期">
            </DatePicker>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="失效日期：">
            <DatePicker v-model="validate.purchDate" transfer format="yyyy-MM-dd" type="date" placeholder="请选择日期">
            </DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="交强险金额：">
            <SelectInput v-model="validate.carNo" :maxlength="8" :parser="formatterCarNo" placeholder="请输入金额"></SelectInput>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="商业险金额：">
            <SelectInput v-model="validate.carNo" :maxlength="8" :parser="formatterCarNo" placeholder="请输入金额"></SelectInput>
          </FormItem>
          </Col>
        </Row>
        <p class="modalTitle">保单照片</p>
        <Row>
          <up-load ref="upLoads" :multiple="true" max-size="10"></up-load>
          <span class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过10MB</span>
        </Row>
        <p class="modalTitle">备注</p>
        <Input v-model="validate.remark" :maxlength="100" type="textarea" placeholder="请输入"></Input>
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
import { CAR, formatterCarNo } from '../pages/client'
import BaseDialog from '@/basic/BaseDialog'
import CitySelect from '@/components/SelectInputForCity'
import UpLoad from '@/components/upLoad/index.vue'
import SelectInput from '@/components/SelectInput'
import OwnDriverSelects from '@/components/own-car-form/OwnDriverSelects'
import Server from '@/libs/js/server'
import TagNumberInput from '@/components/TagNumberInput'
import SelectCustom from '@/components/SelectCustom'
export default {
  name: 'owned-editdriver',
  components: {
    CitySelect,
    UpLoad,
    SelectInput,
    OwnDriverSelects,
    TagNumberInput,
    SelectCustom
  },
  mixins: [BaseDialog],
  data () {
    return {
      loading: false,
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      validate: {
        driverId: '',
        driverName: '',
        assistantDriverName: '',
        assistantDriverId: '',
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
      },
      filteredValidate: []
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
        // 加入过滤验证，防止选择的时候disabled状态
        if (this.validate.driverId) {
          this.filteredValidate.push(this.validate.driverId)
        }
        if (this.validate.assistantDriverId) {
          this.filteredValidate.push(this.validate.assistantDriverId)
        }
      }
    },
    save (name) {
      this.flagAddress = true
      this.validate.travelPhoto = this.$refs.upload1.uploadImg
      this.validate.roadTransPhoto = this.$refs.upload2.uploadImg
      if (this.validate.purchDate) {
        this.validate.purchDate = new Date(this.validate.purchDate).Format('yyyy-MM-dd hh:mm:ss')
      }
      if (!this.flagAddress) {
        return
      }
      this.validate.regularLine = JSON.stringify(this.address)
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag !== 2) { // 新增
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
        vm.ok()
        vm.$Message.success(data.msg)
        vm.close()
      }).catch(() => {
        this.loading = false
      })
    },
    update () {
      let vm = this
      Server({
        url: '/ownerCar/updateCar',
        method: 'post',
        data: this.validate
      }).then(({ data }) => {
        vm.ok()
        vm.$Message.success(data.msg)
        vm.close()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../pages/client.styl"
>>>.ivu-form-item-content
  width 200px
.modalTitle
  font-size: 14px;
.imageTips
  color #999999
  font-size 13px
  line-height 60px
</style>
