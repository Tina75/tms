<!--发货方详情地址新增编辑-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      transfer
      label-position="left"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122" label-position="right">
        <FormItem label="收货联系人：" prop="contact">
          <Input v-model="validate.contact" :maxlength="15" placeholder="请输入"/>
        </FormItem>
        <FormItem label="联系电话：" prop="phone">
          <Input v-model="validate.phone" :maxlength="11" placeholder="请输入"/>
        </FormItem>
        <FormItem label="收货地址：" prop="address">
          <Row>
            <Col :span="23">
            <AreaInput
              v-model="validate.address"
              :only-select="true"
              @city-select="latlongtChange"/>
            </Col>
            <Col :span="1">
            <Tooltip :max-width="200" content="详细地址只支持从下拉推荐地址中选择" transfer>
              <Icon class="vermiddle" type="ios-information-circle" size="16" color="#FFBB44"></Icon>
            </Tooltip>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Input v-model="validate.consignerHourseNumber" :maxLength="50" placeholder="补充地址（楼号-门牌等）"></Input>
        </FormItem>
        <FormItem label="备注：" prop="remark">
          <Input v-model="validate.remark"  placeholder="请输入"/>
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
import { consignerConsigneeAdd, consignerConsigneeUpdate } from '../client'
import cityUtil from '@/libs/js/city'
import AreaInput from '@/components/AreaInput'
import CitySelect from '@/components/SelectInputForCity'
export default {
  name: 'sender-address',
  components: {
    AreaInput,
    CitySelect
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
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { type: 'string', message: '电话号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '收货地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    city () {
      const arr = cityUtil.getPathByCode(this.validate.cityCode)
      return arr.length ? arr[1].code : ''
    }
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (!this.validate.cityCode) {
            this.$Message.error('详细地址只支持从下拉推荐地址中选择')
            return false
          }
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
      this.validate.cityCode = cityCode
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../client.styl"
</style>
