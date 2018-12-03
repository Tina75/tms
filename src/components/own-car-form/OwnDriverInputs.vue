<template>
  <Row :gutter="16">
    <Col span="12">
    <FormItem label="主司机：" prop="driverName">
      <DriverSelect v-model="driverForm.driverName" @on-click="switchAddView">
        <Option v-for="(opt, index) in mainDrivers" :key="index" :value="opt.value">
          {{opt.name}}
        </Option>
      </DriverSelect>
    </FormItem>
    </Col>
    <Col span="12">
    <FormItem label="副司机：" prop="assistantDriverName">
      <DriverSelect v-model="driverForm.assistantDriverName" @on-click="switchAddView">
        <Option v-for="(opt, index) in assitantDrivers" :key="index" :value="opt.value">
          {{opt.name}}
        </Option>
      </DriverSelect>
    </FormItem>
    </Col>
  </Row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DriverSelect from './DriverSelect.vue'
import mixin, { ViewMode } from './mixin.js'
import BaseComponent from '@/basic/BaseComponent'
export default {
  name: 'own-driver-inputs',
  components: {
    DriverSelect
  },
  mixins: [BaseComponent, mixin],
  data () {
    return {
      formName: 'driverForm',
      driverForm: {
        driverName: '', // 主司机姓名
        driverPhone: '', // 主司机手机号
        assistantDriverName: '', // 副司机姓名
        assistantDriverPhone: '' // 副司机手机号

      }
    }
  },
  computed: {
    ...mapGetters(['ownDrivers']),
    /**
     * 主副司机相互制约，
     * 选为主司机，副司机不能选改司机
     */
    mainDrivers () {
      if (this.driverForm.assistantDriverName) {
        let filterName = this.driverform.assistantDriverName
        return this.ownDrivers.filter((user) => user.driverName !== filterName)
      }
      return this.ownDrivers
    },
    assitantDrivers () {
      if (this.driverForm.driverName) {
        let filterName = this.driverform.driverName
        return this.ownDrivers.filter((user) => user.driverName !== filterName)
      }
      return this.ownDrivers
    }
  },
  mounted () {
    // 获取所有自有司机
    this.getOwnDrivers()
  },
  methods: {
    ...mapActions(['getOwnDrivers']),
    switchAddView () {
      this.$emit('on-create')
      if (this.viewMode === ViewMode.MODAL) {
        this.popModal()
      }
      // if (this.viewMode === ViewMode.SLIDER) {
      //   this.sliderView()
      // }
    },
    sliderView () {
      // 滑动视图新增司机,提货，派车等场景，在已弹窗里采用的切换视图方式
      if (this.$parent.$options.name === 'own-car-form') {
        let switchComponent = this.$parent.$parent
        if (switchComponent) {

        }
      }
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

<style>

</style>
