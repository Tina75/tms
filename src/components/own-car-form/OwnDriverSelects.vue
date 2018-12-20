<template>
  <Row>
    <Col span="12">
    <FormItem  label="主司机：" prop="driverName">
      <Row>
        <Col span="20">
        <DriverSelect
          ref="$mainDriver"
          v-model="form.driverName"
          :data="ownDrivers"
          :is-validate="isValidate"
          :filtered-validate="filteredValidate"
          :disabled="mainDisabled"
          :extra-options="extraOptions"
          @on-change="changeDriver"
          @on-click="switchAddView(1)">
        </DriverSelect>
        </Col>
      </Row>
    </FormItem>
    </Col>
    <Col span="12">
    <FormItem label="副司机：" prop="assistantDriverName">
      <Row>
        <Col span="20">
        <DriverSelect
          ref="$assistantDriver"
          v-model="form.assistantDriverName"
          :data="ownDrivers"
          :is-validate="isValidate"
          :filtered-validate="filteredValidate"
          :disabled="assistantDisabled"
          :extra-options="extraOptions"
          @on-change="changeAssitantDriver"
          @on-click="switchAddView(2)">
        </DriverSelect>
        </Col>
      </Row>
    </FormItem>
    </Col>
  </Row>
</template>

<script>
/**
 * 主副司机选择组件
 * 包含主副司机的选择下拉框组件，相互排斥选择
 * 主要使用：在相应的调度派车，改单等场景，还有新增自有车辆中
 *
 * * 特殊场景中的司机信息处理，比如：司机的信息被修改或删除
 */
import { mapGetters, mapActions } from 'vuex'
import DriverSelect from './DriverSelect.vue'
import mixin from './mixin.js'
import BaseComponent from '@/basic/BaseComponent'
export default {
  name: 'own-driver-inputs',
  components: {
    DriverSelect
  },
  mixins: [BaseComponent, mixin],
  data () {
    return {
      extraOptions: []
    }
  },
  computed: {
    ...mapGetters(['ownDrivers']),
    /**
     * 主副司机相互制约，
     * 选为主司机，副司机不能选改司机
     */
    mainDisabled () {
      if (this.form.assistantDriverName) {
        let filterName = this.form.assistantDriverName
        // let filterPhone = this.form.assistantDriverPhone
        return [filterName]
      }
      return []
    },
    assistantDisabled () {
      if (this.form.driverName) {
        let filterName = this.form.driverName
        // let filterPhone = this.form.driverPhone
        return [filterName]
      }
      return []
    }
  },
  /**
   * 部分司机删除或名称修改，需要额外补充追加在options里
   */
  beforeMount () {
    if (this.form.driverName) {
      this.appendExtraOptions(this.form.driverName, this.form.driverPhone)
    }
    if (this.form.assistantDriverName) {
      this.appendExtraOptions(this.form.assistantDriverName, this.form.assistantDriverPhone)
    }
  },
  methods: {
    ...mapActions(['getOwnDrivers']),
    appendExtraOptions (name, phone) {
      // let name = this.form.driverName
      let driver = this.getDriverByName(name)
      if (!driver) {
        /**
         *  todo 追加一个disabled 的option
         * 该用户可能已被删除,或名字修改
         */
        this.extraOptions.push({
          name,
          value: name,
          driverPhone: phone
        })
      }
    },
    getDriverByName (name) {
      return this.ownDrivers.find(driver => driver.name === name)
    },
    /**
     * 选择主司机后，主司机的手机号也变更
     * 1. 选择车牌号联动效果
     * 2. 新增的司机主动关联最新的司机信息
     * 3. 选择司机后，主动关联司机信息
     */
    changeDriver (name) {
      if (name) {
        let driver = this.getDriverByName(name)
        if (driver) {
          this.form.driverName = driver.name
          this.form.driverPhone = driver.driverPhone
          this.form.driverId = driver.id
        }
      } else {
        this.form.driverName = ''
        this.form.driverPhone = ''
        this.form.driverId = ''
      }
    },
    /**
     * 选择司机后，司机的手机号也变更
     */
    changeAssitantDriver (name) {
      if (name) {
        let driver = this.getDriverByName(name)
        if (driver) {
          this.form.assistantDriverName = driver.name
          this.form.assistantDriverPhone = driver.driverPhone
          this.form.assistantDriverId = driver.id
        }
      } else {
        this.form.assistantDriverName = ''
        this.form.assistantDriverPhone = ''
        this.form.assistantDriverId = ''
      }
    },
    /**
     * 当车牌号变化的时候，同时修改主司机和副司机
     */
    updateDriversByCar (car) {
      if (car.driverName) {
        // this.form.driverName = car.driverName
        // this.form.driverPhone = car.driverPhone
        this.changeDriver(car.driverName)
      } else {
        this.form.driverName = ''
        // this.form.driverPhone = ''
        // this.form.driverId = ''
      }
      if (car.assistantDriverName) {
        // this.form.assistantDriverName = car.assistantDriverName
        this.changeAssitantDriver(car.assistantDriverName)
      } else {
        this.form.assistantDriverName = ''
        // this.form.assistantDriverPhone = ''
        // this.form.assistantDriverId = ''
      }
    },
    /**
     * 弹出窗
     * @param {number} type 1主司机；2副司机
     */
    switchAddView (type) {
      this.$emit('on-create')
      this.popModal(type)
    },
    /**
     * 弹窗显示司机框，完成后回调
     */
    popModal (type) {
      const vm = this
      // 弹窗显示新增司机
      this.openDialog({
        name: 'dialogs/edit-driver',
        data: {
          title: '新增司机',
          flag: 1
        },
        methods: {
          ok () {
            // 查询司机列表
            vm.getOwnDrivers()
              .then((list) => {
                if (list.length > 0) {
                  let driver = list[0]
                  if (type === 1) {
                    vm.$nextTick(() => {
                      vm.changeDriver(driver.driverName)
                      vm.$refs.$mainDriver.clearQuery()
                    })
                  } else {
                    vm.$nextTick(() => {
                      vm.changeAssitantDriver(driver.driverName)
                      vm.$refs.$assistantDriver.clearQuery()
                    })
                  }
                }
              })
          }
        }
      })
    }

  }
}
</script>

<style lang="stylus" scope>
.select-label
  margin-left 82px
</style>
