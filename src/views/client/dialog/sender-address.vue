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
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122">
        <FormItem label="发货地址：" prop="address">
          <AreaInput
            v-model="validate.address"
            :only-select="true"
            @city-select="latlongtChange"/>
          <Tooltip :max-width="200" content="详细地址只支持从下拉推荐地址中选择" style="right: -20px; position: absolute; top: 0px;"  transfer>
            <Icon class="vermiddle" type="ios-information-circle" size="16" color="#FFBB44"></Icon>
          </Tooltip>
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
import { consignerAddressAdd, consignerAddressUpdate, CODE } from '../client'
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
        address: [
          { required: true, message: '发货地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    cityCode () {
      const arr = cityUtil.getPathByCode(this.validate.city)
      return arr.length ? arr[1].code : ''
    }
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (!this.validate.city) {
            this.$Message.error('详细地址只支持从下拉推荐地址中选择')
            return false
          }
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
      this.validate.city = cityCode
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../client.styl"
</style>
