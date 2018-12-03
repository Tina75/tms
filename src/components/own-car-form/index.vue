<template>
  <div>
    <Row :gutter="16">
      <Col span="8">
      <FormItem label="车牌号：" prop="carNo" required>
        <Select v-model="carForm.carNo" placeholder="请选择" @on-change="handleSelect">
          <Option v-for="car in ownCars" :key="car.id" :value="car.carNo">{{car.carNo}}</Option>
        </Select>
      </FormItem>
    </Col>
      <Col span="16">
      <OwnDriverInputs :form="carForm" :view-mode="viewMode" @on-add="switchAddView"></OwnDriverInputs>
    </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">
      <div class="own-car__label">
        <label>车型：</label>
        <span>{{carTypeText}} &nbsp; {{carLengthText}}</span>
      </div>
      </Col>
      <Col span="8">
      <div class="own-car__label">
        <label>主司机手机号：</label>
        <span>{{carForm.driverName}}</span>
      </div>
      </Col>
      <Col span="8">
      <div class="own-car__label">
        <label>副司机手机号：</label>
        <span>{{carForm.assistantDriverName}}</span>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
/**
 * 自有车派车车号司机输入框集合
 * 包含：车牌号，主司机，副司机
 * 司机可以新增
 */
import OwnDriverInputs from './OwnDriverInputs.vue'
import { mapGetters, mapActions } from 'vuex'
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import mixin from './mixin.js'
export default {
  name: 'own-car-form',
  components: {
    OwnDriverInputs
  },
  mixins: [mixin],
  data () {
    return {
      formName: 'carForm',
      carForm: {
        carNo: '', // 车牌号
        carType: '', // 车型
        carLength: '', // 车长
        driverName: '', // 主司机姓名
        driverPhone: '', // 主司机手机号
        assistantDriverName: '', // 副司机姓名
        assistantDriverPhone: '' // 副司机手机号

      }
    }
  },
  computed: {
    ...mapGetters(['ownCars']),
    /**
     * 车型描述
     */
    carTypeText () {
      let str = ''
      if (this.carForm.carType) {
        str = CAR_TYPE1[this.carForm.carType]
      }
      return str
    },
    /**
     * 车长描述
     */
    carLengthText () {
      let str = ''
      if (this.carForm.carLength) {
        str = CAR_LENGTH1[this.carForm.carLength]
      }
      return str
    }
  },
  methods: {
    ...mapActions(['getOwnCars']),
    /**
     * 选中车辆
     * @param {string} carNo 车牌号
     */
    handleSelect (carNo) {
      let car = this.ownCars.find((item) => item.carNo === carNo)
      /**
       * 选中了车辆信息，就自动代入车辆相关的信息
       */
      if (car) {
        this.carForm.carType = car.carType
        this.carForm.carLength = car.carLength
        if (car.driverName) {
          this.carForm.driverName = car.driverName
          this.carForm.driverPhone = car.driverPhone
        } else {
          this.carForm.driverName = ''
          this.carForm.driverPhone = ''
        }
        if (this.car.assistantDriverName) {
          this.carForm.assistantDriverName = car.assistantDriverName
          this.carForm.assistantDriverPhone = car.assistantDriverPhone
        } else {
          this.carForm.assistantDriverName = ''
          this.carForm.assistantDriverPhone = ''
        }
      }
    },
    // 弹窗显示新增司机
    switchAddView () {
      this.$emit('on-create')
    }
  }
}
</script>

<style lang="stylus" scoped>
.own-car
  &__label
    label
      color #666666
    span
      color #333333
</style>
