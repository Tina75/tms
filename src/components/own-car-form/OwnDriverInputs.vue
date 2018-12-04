<template>
  <Row>
    <Col span="12">
    <FormItem  label="主司机：" prop="driverName">
      <Row>
        <Col span="20">
        <DriverSelect v-model="form.driverName" :data="mainDrivers" @on-change="changeDriver" @on-click="switchAddView">
        </DriverSelect>
        </Col>
      </Row>
    </FormItem>
    </Col>
    <Col span="12">
    <FormItem label="副司机：" prop="assistantDriverName">
      <Row>
        <Col span="20">
        <DriverSelect v-model="form.assistantDriverName" :data="assitantDrivers" @on-change="changeAssitantDriver"  @on-click="switchAddView">
        </DriverSelect>
        </Col>
      </Row>
    </FormItem>
    </Col>
  </Row>
</template>

<script>
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
    console.log('this.form', this.form)
    return {
    }
  },
  computed: {
    ...mapGetters(['ownDrivers']),
    /**
     * 主副司机相互制约，
     * 选为主司机，副司机不能选改司机
     */
    mainDrivers () {
      if (this.form.assistantDriverName) {
        let filterName = this.form.assistantDriverName
        return this.ownDrivers.filter((user) => user.name !== filterName)
      }
      return this.ownDrivers
    },
    assitantDrivers () {
      if (this.form.driverName) {
        let filterName = this.form.driverName
        return this.ownDrivers.filter((user) => user.name !== filterName)
      }
      return this.ownDrivers
    }
  },
  mounted () {
    // 获取所有自有司机
    // this.getOwnDrivers()
  },
  methods: {
    ...mapActions(['getOwnDrivers']),
    getDriverByName (name) {
      return this.ownDrivers.find(driver => driver.name === name)
    },
    /**
     * 选择主司机后，主司机的手机号也变更
     */
    changeDriver (name) {
      if (name) {
        let driver = this.getDriverByName(name)
        if (driver) {
          this.form.driverPhone = driver.driverPhone
          this.form.driverId = driver.id
        }
      }
    },
    /**
     * 选择司机后，司机的手机号也变更
     */
    changeAssitantDriver (name) {
      if (name) {
        let driver = this.getDriverByName(name)
        if (driver) {
          this.form.assistantDriverPhone = driver.driverPhone
          this.form.assistantDriverId = driver.id
        }
      }
    },
    /**
     * 当车牌号变化的时候，同时修改主司机和副司机
     */
    updateDriversByCar (car) {
      if (car.driverName) {
        this.form.driverName = car.driverName
        // this.form.driverPhone = car.driverPhone
        this.changeDriver(car.driverName)
      } else {
        this.form.driverName = ''
        this.form.driverPhone = ''
        this.form.driverId = ''
      }
      if (car.assistantDriverName) {
        this.form.assistantDriverName = car.assistantDriverName
        this.changeAssitantDriver(car.assistantDriverName)
      } else {
        this.form.assistantDriverName = ''
        this.form.assistantDriverPhone = ''
        this.form.assistantDriverId = ''
      }
    },
    /**
     * 弹出窗
     */
    switchAddView () {
      this.$emit('on-create')
      this.popModal()
    },
    /**
     * 弹窗显示司机框，完成后回调
     */
    popModal () {
      const vm = this
      // 弹窗显示新增司机
      this.openDialog({
        name: 'dialogs/edit-driver',
        data: {},
        methods: {
          ok () {
            // 查询司机列表
            vm.getOwnDrivers()
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
