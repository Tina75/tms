<template>
  <Row :gutter="16">
    <Col span="10" offset="2">
    <FormItem :label-width="82"  label-position="left" label="主司机：" prop="driverName">
      <DriverSelect v-model="form.driverName" :data="mainDrivers" @on-click="switchAddView">
      </DriverSelect>
    </FormItem>
    </Col>
    <Col span="10" offset="2">
    <FormItem :label-width="82" label="副司机：" prop="assistantDriverName">
      <DriverSelect v-model="form.assistantDriverName" :data="assitantDrivers"  @on-click="switchAddView">
      </DriverSelect>
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
  watch: {
    'form.driverName': function (name) {
      if (name) {
        let driver = this.getDriverByName(name)
        if (driver) {
          this.form.driverPhone = driver.driverPhone
        }
      }
    },
    'form.assistantDriverName': function (name) {
      if (name) {
        let driver = this.getDriverByName(name)
        if (driver) {
          this.form.assistantDriverPhone = driver.driverPhone
        }
      }
    }
  },
  mounted () {
    // 获取所有自有司机
    this.getOwnDrivers()
  },
  methods: {
    ...mapActions(['getOwnDrivers']),
    getDriverByName (name) {
      return this.ownDrivers.find(driver => driver.name === name)
    },
    /**
     * 弹出窗
     */
    switchAddView () {
      this.$emit('on-create')
      this.popModal()
    },
    popModal () {
      // 弹窗显示新增司机
      this.openDialog({
        name: 'dialogs/messageTip',
        data: {},
        methods: {
          ok () {
            // 查询司机列表
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
