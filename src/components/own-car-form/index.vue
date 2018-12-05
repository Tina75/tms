<template>
  <div>
    <Row>
      <Col span="8">
      <FormItem label="车牌号：" prop="carNo">
        <Row>
          <Col span="20">
          <CarSelect v-model="form.carNo" :extra-options="extraOptions" @on-change="handleSelect">
          </CarSelect>
          </Col>
        </Row>
      </FormItem>
    </Col>
      <Col span="16">
      <OwnDriverInputs ref="driverInputs" :form="form" @on-create="switchAddView"></OwnDriverInputs>
    </Col>
    </Row>
    <Row>
      <Col span="8">
      <div class="own-car__label">
        <label v-show="form.carNo">车型：</label>
        <span>{{carTypeText}} &nbsp; {{carLengthText}}</span>
      </div>
      </Col>
      <Col span="8">
      <div class="own-car__label">
        <label v-show="form.driverName">主司机手机号：</label>
        <span>{{form.driverPhone}}</span>
      </div>
      </Col>
      <Col span="8">
      <div class="own-car__label">
        <label v-show="form.assistantDriverName">副司机手机号：</label>
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
      extraOptions: []
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
  beforeMount () {
    /**
     *  追加一个disabled 的option
     * 该车辆可能已被删除,或车牌修改
     */
    if (this.form.carNo) {
      let carNo = this.form.carNo
      let car = this.ownCars.find((item) => item.value === carNo)
      if (!car) {
        this.extraOptions.push({
          name: carNo,
          value: carNo,
          ...car
        })
      }
    }
  },
  methods: {
    ...mapActions(['getOwnCars']),
    /**
     * 选中车辆
     * @param {string} carNo 车牌号
     */
    handleSelect (value) {
      if (!value) {
        this.form.carType = ''
        this.form.carLength = ''
        this.$refs.driverInputs.updateDriversByCar({})
        return
      }
      let car = this.ownCars.find((item) => item.value === value)
      /**
       * 选中了车辆信息，就自动代入车辆相关的信息
       */
      if (car) {
        this.form.carType = car.carType
        this.form.carLength = car.carLength
        // 同时修改主司机和副司机
        this.$refs.driverInputs.updateDriversByCar(car)
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
    height 18px
    label
      color #666666
    span
      color #333333
  &__label-select
    margin-left 82px
</style>
