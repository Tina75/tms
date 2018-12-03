<template>
  <div>
    <Row :gutter="16">
      <Col span="7" offset="1">
      <FormItem :label-width="82" :rules="rule" label="车牌号：" prop="carNo" required>
        <CarSelect v-model="form.carNo" @on-change="handleSelect">
        </CarSelect>
      </FormItem>
    </Col>
      <Col span="16">
      <OwnDriverInputs :form="form" @on-create="switchAddView"></OwnDriverInputs>
    </Col>
    </Row>
    <Row :gutter="16">
      <Col span="6" offset="2">
      <div class="own-car__label">
        <label>车型：</label>
        <span>{{carTypeText}} &nbsp; {{carLengthText}}</span>
      </div>
      </Col>
      <Col span="7" offset="1">
      <div class="own-car__label">
        <label>主司机手机号：</label>
        <span>{{form.driverPhone}}</span>
      </div>
      </Col>
      <Col span="7" offset="1">
      <div class="own-car__label">
        <label>副司机手机号：</label>
        <span>{{form.assistantDriverPhone}}</span>
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
import CarSelect from './CarSelect.vue'
import { mapGetters, mapActions } from 'vuex'
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import mixin from './mixin.js'
export default {
  name: 'own-car-form',
  components: {
    CarSelect,
    OwnDriverInputs
  },
  mixins: [mixin],
  data () {
    return {
      rule: {
        required: true, message: '请选择车辆'
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
      if (this.form.carType) {
        str = CAR_TYPE1[this.form.carType]
      }
      return str
    },
    /**
     * 车长描述
     */
    carLengthText () {
      let str = ''
      if (this.form.carLength) {
        str = CAR_LENGTH1[this.form.carLength]
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
    handleSelect (value) {
      let car = this.ownCars.find((item) => item.value === value)
      /**
       * 选中了车辆信息，就自动代入车辆相关的信息
       */
      if (car) {
        this.form.carType = car.carType
        this.form.carLength = car.carLength
        if (car.driverName) {
          this.form.driverName = car.driverName
          this.form.driverPhone = car.driverPhone
        } else {
          this.form.driverName = ''
          this.form.driverPhone = ''
        }
        if (car.assistantDriverName) {
          this.form.assistantDriverName = car.assistantDriverName
          this.form.assistantDriverPhone = car.assistantDriverPhone
        } else {
          this.form.assistantDriverName = ''
          this.form.assistantDriverPhone = ''
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
  &__label-select
    margin-left 82px
</style>
