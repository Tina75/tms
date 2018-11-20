<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      label-position="left"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122">
        <FormItem label="发货地址:">
          <Row>
            <Col span="11">
            <FormItem prop="city">
              <CitySelect v-model="validate.city" clearable></CitySelect>
            </FormItem>
            </Col>
            <Col span="13" style="padding-left: 5px">
            <FormItem prop="address">
              <AreaInput
                v-model="validate.address"
                :disabled="true"
                :city-code="cityCode"
                @latlongt-change="latlongtChange"/>
            </FormItem>
            </Col>
          </Row>
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
        mapType: 1
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
      let data = {
        consignerId: this.consignerId,
        address: this.validate.address,
        longitude: this.validate.longitude,
        latitude: this.validate.latitude,
        mapType: this.validate.mapType,
        cityCode: this.validate.city
      }
      consignerAddressAdd(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
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
        cityCode: this.validate.city
      }
      consignerAddressUpdate(data).then(res => {
        console.log(res)
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    latlongtChange ({ lat, lng }) {
      this.validate.longitude = lng
      this.validate.latitude = lat
      this.validate.mapType = 1
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../client.styl"
</style>
