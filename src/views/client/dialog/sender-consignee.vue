<!--发货方详情地址新增编辑-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      transfer
      label-position="left"
      class="modal"
      width="800"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="100" label-position="right" style="margin-left: -10px">
        <FormItem label="收货联系人：" prop="contact">
          <Input v-model="validate.contact" :maxlength="$fieldLength.name" placeholder="请输入"/>
        </FormItem>
        <FormItem label="联系号码：" prop="phone">
          <!-- <Input v-model="validate.phone" :maxlength="11" placeholder="请输入手机号或座机号"/> -->
          <SelectInput v-model="validate.phone" :formatter="formatePhoneNum" :maxlength="phoneLength(validate.phone)" placeholder="请输入手机号或座机号，座机需加区号"></SelectInput>
        </FormItem>
        <FormItem label="收货地址：">
          <Row>
            <Col span="10">
            <FormItem prop="cityCode">
              <CitySelect v-model="validate.cityCode" clearable></CitySelect>
            </FormItem>
            </Col>
            <Col span="14" style="padding-left: 5px">
            <FormItem prop="address">
              <AreaInput
                v-model="validate.address"
                :city-code="validate.cityCode"
                :filter-city="true"
                @city-select="latlongtChange"/>
            </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Input v-model="validate.consignerHourseNumber" :maxlength="$fieldLength.extraAddress" placeholder="补充地址（楼号-门牌等）"></Input>
        </FormItem>
        <FormItem label="收货人单位：">
          <Input v-model="validate.consigneeCompanyName" :maxlength="$fieldLength.extraAddress" placeholder="请输入"/>
        </FormItem>
        <FormItem label="备注：" prop="remark">
          <Input v-model="validate.remark" :maxlength="$fieldLength.remark"  placeholder="请输入"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button :loading="loading" type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import { consignerConsigneeAdd, consignerConsigneeUpdate } from '../pages/client'
import AreaInput from '@/components/AreaInput'
import CitySelect from '@/components/SelectInputForCity'
import SelectInput from '@/components/SelectInput.vue'
import { validatePhone } from '@/libs/js/validate'
import { formatePhone } from '@/libs/js/formate'
export default {
  name: 'sender-address',
  components: {
    AreaInput,
    CitySelect,
    SelectInput
  },
  mixins: [BaseDialog],
  data () {
    return {
      loading: false,
      consignerId: '', // 详情传过来的id
      id: '',
      validate: {
        contact: '',
        phone: '',
        address: '',
        remark: '',
        longitude: '',
        latitude: '',
        mapType: 1,
        cityCode: '',
        consignerHourseNumber: ''
      },
      ruleValidate: {
        contact: [
          { required: true, message: '收货联系人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系号码不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        cityCode: [
          { required: false, message: '收货城市不能为空' }
        ],
        address: [
          { required: true, message: '收货地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    formatePhoneNum (temp) {
      return formatePhone(temp)
    },
    phoneLength (value) {
      return /^1/.test(value) ? 13 : this.$fieldLength.telephone
    },
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
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
      Object.assign(this.validate, { consignerId: this.consignerId })
      consignerConsigneeAdd(this.validate).then(res => {
        this.loading = false
        this.ok() // 刷新页面
      }).catch(() => {
        this.loading = false
      })
    },
    update () {
      Object.assign(this.validate, { id: this.id })
      consignerConsigneeUpdate(this.validate).then(res => {
        this.loading = false
        this.ok() // 刷新页面
      }).catch(() => {
        this.loading = false
      })
    },
    latlongtChange ({ lat, lng, cityCode }) {
      this.validate.longitude = lng
      this.validate.latitude = lat
      this.validate.mapType = 1
      // if (!this.validate.cityCode) {
      //   this.validate.cityCode = cityCode
      // }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../pages/client.styl"
</style>
