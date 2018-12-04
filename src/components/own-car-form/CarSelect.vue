<template>
  <Select ref="$select" :value="currentValue" placeholder="请选择" not-found-text="暂无此车，请新增车辆" @on-change="handleChange">
    <Option v-for="car in ownCars" :key="car.id" :value="car.value">{{car.name}}</Option>
    <Option key="extra" value="extra" class="select-car__option" disabled>
      <span class="select-car__text" @click.prevent="handleClick">
        <Icon type="ios-add" size="20" class="select-car__icon"></Icon>
        新增车辆
      </span>
    </Option>
  </Select>
</template>

<script>
/**
 * 司机选择框
 */
import { mapGetters, mapActions } from 'vuex'
import BaseComponent from '@/basic/BaseComponent'
export default {
  name: 'car-select',
  components: {
  },
  mixins: [BaseComponent],
  props: {
    value: String,
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
  mounted () {
    // this.getOwnCars()
  },
  methods: {
    ...mapActions(['getOwnCars']),
    handleClick (e) {
      this.$emit('on-create', e)
      this.$refs.$select.hideMenu()
      this.popModal()
    },
    handleChange (value) {
      if (value === 'extra') {
        // this.currentValue = ''
        // this.$emit('input', '')
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
        data: {},
        methods: {
          ok () {
            // 查看所有车辆
            vm.getOwnCars()
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
