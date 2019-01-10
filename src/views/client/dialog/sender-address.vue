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
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="90" style="margin-left: -10px">
        <FormItem label="发货地址：">
          <Row>
            <Col span="10">
            <FormItem prop="city">
              <CitySelect v-model="validate.city" clearable></CitySelect>
            </FormItem>
            </Col>
            <Col span="14" style="padding-left: 5px">
            <FormItem prop="address">
              <AreaInput
                v-model="validate.address"
                :city-code="validate.city"
                :filter-city="true"
                @city-select="latlongtChange"/>
            </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Input v-model="validate.consignerHourseNumber" :maxlength="50" placeholder="补充地址（楼号-门牌等）"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import { consignerAddressAdd, consignerAddressUpdate, CODE } from '../pages/client'
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
      consignerId: '', // 详情传过来的id
      id: '',
      validate: {
        city: '',
        address: '',
        longitude: '',
        latitude: '',
        mapType: 1,
        consignerHourseNumber: ''
      },
      ruleValidate: {
        city: [
          { required: false, message: '发货城市不能为空' }
        ],
        address: [
          { required: true, message: '发货地址不能为空', trigger: 'blur' }
        ]
      }
    }
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
        }
      })
    },
    add () {
      let data = {
        consignerId: this.consignerId,
        address: this.validate.address,
        longitude: this.validate.longitude,
        latitude: this.validate.latitude,
        mapType: this.validate.mapType,
        cityCode: this.validate.city,
        consignerHourseNumber: this.validate.consignerHourseNumber
      }
      consignerAddressAdd(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
          this.close()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = {
        id: this.id,
        address: this.validate.address,
        longitude: this.validate.longitude,
        latitude: this.validate.latitude,
        mapType: this.validate.mapType,
        cityCode: this.validate.city,
        consignerHourseNumber: this.validate.consignerHourseNumber
      }
      consignerAddressUpdate(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
          this.close()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    latlongtChange ({ lat, lng, cityCode }) {
      this.validate.longitude = lng
      this.validate.latitude = lat
      this.validate.mapType = 1
      // if (!this.validate.city) {
      //   this.validate.city = cityCode
      // }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../pages/client.styl"
</style>
