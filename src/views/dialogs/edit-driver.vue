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
          <Col :span="8">
          <FormItem label="司机姓名：" prop="driverName">
            <Input v-model="validate.driverName" :maxlength="20" placeholder="必填"></Input>
          </FormItem>
          </Col>
          <Col :span="8" class="rightFormItem">
          <FormItem label="手机号：" prop="driverPhone">
            <SelectInput v-model="validate.driverPhone" :maxlength="11" :remote="true" placeholder="必填"></SelectInput>
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
          <p class="uploadLabel">驾驶证</p>
          </Col>
          <Col span="5">
          <up-load ref="upload2"></up-load>
          <p class="uploadLabelID">身份证正面</p>
          </Col>
          <Col span="5">
          <up-load ref="upload3"></up-load>
          <p class="uploadLabelID">身份证反面</p>
          </Col>
        </Row>
        <p class="modalTitle">备注</p>
        <Input v-model="validate.remark" :maxlength="100" type="textarea" placeholder="请输入"></Input>
      </Form>
      <div slot="footer" class="footerSty">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import CitySelect from '@/components/SelectInputForCity'
import UpLoad from '@/components/upLoad/index.vue'
import SelectInput from '@/components/SelectInput'
import _ from 'lodash'
import Server from '@/libs/js/server'
export default {
  name: 'owned-driver',
  components: {
    CitySelect,
    UpLoad,
    SelectInput
  },
  mixins: [BaseDialog],
  data () {
    return {
      validate: {},
      address: [],
      address1: {},
      address2: {},
      flagAddress: true,
      codeType: 1,
      ruleValidate: {
        driverName: [
          { required: true, message: '司机姓名不能为空', trigger: 'blur' }
        ],
        driverPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/ }
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
      debugger
      if (this.flag === 2) {
        this.validate.carLength = this.validate.carLength.toString()
        this.$refs.upload1.progress = 1
        this.$refs.upload2.progress = 1
        this.$refs.upload3.progress = 1
        this.$refs.upload1.uploadImg = this.validate.travelPhoto
        this.$refs.upload2.uploadImg = this.validate.identityFront
        this.$refs.upload3.uploadImg = this.validate.identityBack
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
      this.validate.identityFront = this.$refs.upload2.uploadImg
      this.validate.identityBack = this.$refs.upload3.uploadImg
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
        url: 'ownerCar/addDriver',
        method: 'post',
        data: vm.validate
      }).then(({ data }) => {
        if (data.code === 10000) {
          vm.$Message.success(data.msg)
          vm.close()
        }
      })
    },
    update () {
      Server({
        url: 'ownerCar/updateDriver',
        method: 'post',
        data: this.validate
      }).then(({ data }) => {
        if (data.code === 10000) {
          this.$Message.success(data.msg)
          this.close()
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../owned-vehicle/client.styl"
</style>
