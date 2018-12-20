<template>
  <ExtraSelect ref="$select" :transfer="true" :value="currentValue" placeholder="请选择" not-found-text="暂无此车，请新增车辆" filterable clearable @on-change="handleChange">
    <Option v-for="car in ownCars" :key="car.id" :value="car.value">{{car.name}}</Option>
    <Option v-for="(opt, index) in extraOptions" :key="'disabled-'+index" :label="opt.value" :value="opt.value" disabled>
      {{opt.name}}
    </Option>
    <Option key="extra" value="extra" class="select-car__option" disabled>
      <span class="select-car__text" @click.prevent="handleClick">
        <Icon type="ios-add" size="20" class="select-car__icon"></Icon>
        新增车辆
      </span>
    </Option>
  </ExtraSelect>
</template>

<script>
/**
 * 车辆选择框
 * 自有车辆的信息选择框
 * * 特殊场景中：车辆信息的修改
 */
import { mapGetters, mapActions } from 'vuex'
import ExtraSelect from './ExtraSelect.vue'
import BaseComponent from '@/basic/BaseComponent'
export default {
  name: 'car-select',
  components: {
    ExtraSelect
  },
  mixins: [BaseComponent],
  props: {
    value: String,
    extraOptions: {
      type: Array,
      default: () => []
    },
    onCreate: Function
  },
  data () {
    return {
      currentValue: this.value || ''
    }
  },
  computed: {
    ...mapGetters(['ownCars'])
  },
  watch: {
    value (newValue) {
      if (newValue !== this.currentValue) {
        this.currentValue = newValue
      }
    }
  },
  methods: {
    ...mapActions(['getOwnCars', 'getOwnDrivers']),
    handleClick (e) {
      this.$emit('on-create', e)
      this.$refs.$select.hideMenu()
      this.popModal()
    },
    handleChange (value) {
      if (value === 'extra') {
        return
      }
      this.currentValue = value
      this.$emit('input', value)
      this.$emit('on-change', value)
    },
    /**
     * 显示添加车辆窗口
     */
    popModal () {
      const vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-car',
        data: {
          flag: 1,
          title: '新增车辆'
        },
        methods: {
          ok () {
            // 查看所有车辆
            vm.getOwnCars()
              .then((cars) => {
                // 新增车辆后，主动设置当前的车辆值
                if (cars.length > 0) {
                  let car = cars[0]
                  vm.$nextTick(() => {
                    /**
                    * 在输入关键字的同时，点击新增后，理论上会代入值，但是query依然存在，导致下拉框无法显示已有的得bug
                    * 这里先清空query
                    */
                    vm.handleChange(car.carNo)
                    vm.$refs.$select.query = ''
                  })
                }
              })
            // 查询所有未绑定司机
            vm.getOwnDrivers()
          }
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.select-car
  &__option
    text-align center
    border-top 1px solid #f8f8f8
    padding 0
    cursor pointer
  &__text
    display block
    padding 7px 16px 5px
    color #00A4BD
    font-size 12px
  &__icon
    top: -1px;
    position: relative;
</style>
