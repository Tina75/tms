<template>
  <Form ref="orderForm" :label-width="80" :model="orderForm" :rules="rules">
    <Spin v-if="loading" fix></Spin>
    <Row :gutter="16">
      <Col span="12">
      <FormItem label="客户:" prop="consignerName" required>
        <SelectInput
          v-model="orderForm.consignerName"
          :auto-focus="autoFocus"
          :maxlength="20"
          :remote="false"
          :local-options="clients"
          @on-focus.once="getClients"
          @on-select="handleSelectConsigner">
        </SelectInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="始发城市:" prop="start">
        <AreaSelect v-model="orderForm.start" :deep="true" placeholder=""></AreaSelect>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="目的城市:" prop="end">
        <AreaSelect v-model="orderForm.end" :deep="true" :adjustment="true" placeholder=""></AreaSelect>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="12">
      <FormItem label="客户订单号:" prop="customerOrderNo">
        <Input v-model="orderForm.customerOrderNo" :maxlength="30" type="text"></Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="发货时间:" prop="deliveryTime">
        <DatePicker v-model="orderForm.deliveryTime" :time-picker-options="{steps: [1, 60, 60]}" format="yyyy-MM-dd HH:mm前" type="datetime" style="width:100%"></DatePicker>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="到货时间:" prop="arriveTime">
        <DatePicker v-model="orderForm.arriveTime" :time-picker-options="{steps: [1, 60, 60]}" :options="endDateOptions" format="yyyy-MM-dd HH:mm前" type="datetime" style="width:100%"></DatePicker>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16" class="i-mb-15">
      <Col span="12"><Title>发货人</Title></Col>
      <Col span="12"><Title>收货人</Title></Col>
    </Row>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="发货人:" prop="consignerContact">
        <Input v-model="orderForm.consignerContact" :maxlength="15" type="text"></Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="手机号:" prop="consignerPhone">
        <Input v-model="orderForm.consignerPhone" :maxlength="11"></Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="收货人:" prop="consigneeContact">
        <SelectInput v-model="orderForm.consigneeContact" :maxlength="15" :local-options="consigneeContacts" :remote="false" @on-select="handleSelectConsignee">
        </SelectInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="手机号:" prop="consigneePhone">
        <SelectInput v-model="orderForm.consigneePhone" :maxlength="11" :local-options="consigneePhones" :remote="false"></SelectInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="12">
      <FormItem label="发货地址:" prop="consignerAddress">
        <SelectInput v-model="orderForm.consignerAddress" :maxlength="60" :local-options="consignerAddresses" :remote="false"></SelectInput>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="收货地址:" prop="consigneeAddress">
        <SelectInput v-model="orderForm.consigneeAddress" :maxlength="60" :local-options="consigneeAddresses" :remote="false"></SelectInput>
      </FormItem>
      </Col>
    </Row>
    <Title>货物信息</Title>
    <CargoTable
      :cargoes="cargoes"
      :data-source="consignerCargoes"
      :on-append="appendCargo"
      :on-remove="removeCargo"
      :on-select="selectCargo"
    >

    </CargoTable>

    <Title class="i-mb-15 i-mt-15">应收费用</Title>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="结算方式:" prop="settlementType">
        <Select ref="settlementSelector" v-model="orderForm.settlementType">
          <Option v-for="opt in settlements" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          <!-- <Option value="1">现付</Option>
          <Option value="2">到付</Option>
          <Option value="3">回付</Option>
          <Option value="4">月结</Option> -->
        </Select>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="运输费用:" prop="freightFee">
        <Row>
          <Col span="20">
          <TagNumberInput :min="0" v-model="orderForm.freightFee" :parser="handleParseFloat">
            <span slot="suffix" class="order-create__input-suffix">元</span>
          </TagNumberInput>
          </Col>
          <Col span="4">
          <span @click="showCounter">
            <FontIcon type="jisuanqi" size="20" color="#00a4bd" class="i-ml-5"></FontIcon>
          </span>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="装货费用:" prop="loadFee">
        <TagNumberInput :min="0" v-model="orderForm.loadFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="卸货费用:" prop="unloadFee">
        <TagNumberInput :min="0" v-model="orderForm.unloadFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="保险费用:" prop="insuranceFee">
        <TagNumberInput :min="0" v-model="orderForm.insuranceFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="其他费用:" prop="otherFee">
        <TagNumberInput :min="0" v-model="orderForm.otherFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="10">
      <FormItem label="费用合计:">
        <span class="order-create__font-total">{{totalFee}}</span>元
      </FormItem>
      </Col>
    </Row>
    <Title>其他</Title>
    <Row :gutter="16" class="i-mt-15">
      <Col span="6">
      <FormItem label="提货方式:" prop="pickup">
        <Select ref="pickupSelector" v-model="orderForm.pickup">
          <Option v-for="opt in pickups" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="回单数量:" prop="receiptCount">
        <InputNumber v-model="orderForm.receiptCount" :min="0" :parser="value => parseInt(value).toString()" class="order-create__input-w100">
        </InputNumber>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="备注:" prop="remark">
        <Input v-model="orderForm.remark" :maxlength="100" type="text">
          </Input>
      </FormItem>
      </Col>
    </Row>
    <div class="van-center">
      <Button v-if="hasPower(100101)" :disabled="disabled" type="primary" @click="handleSubmit">保存</Button>
      <Button v-if="hasPower(100102)" :disabled="disabled" class="i-ml-10" @click="print">保存并打印</Button>
      <Button v-if="hasPower(100103)" class="i-ml-10" @click="resetForm">清空</Button>
    </div>
    <OrderPrint ref="printer" :list="orderPrint">
    </OrderPrint>
  </Form>
</template>

<script>
import Title from './components/Title.vue'
import SelectInput from '@/components/SelectInput.vue'
import TagNumberInput from '@/components/TagNumberInput'
import { mapGetters, mapActions } from 'vuex'
import float from '@/libs/js/float'
import BaseComponent from '@/basic/BaseComponent'
import BasePage from '@/basic/BasePage'
import OrderPrint from './components/OrderPrint'
import AreaSelect from '@/components/AreaSelect'
import { getCityCode, resetCityValidator, FORM_VALIDATE_START, FORM_VALIDATE_END } from '@/libs/js/cityValidator'
import FontIcon from '@/components/FontIcon'
import _ from 'lodash'
import settlements from '@/libs/constant/settlement.js'
import pickups from '@/libs/constant/pickup.js'
import Cargo from './libs/cargo'
import CargoTable from './components/CargoTable.vue'

const transferFeeList = ['freightFee', 'loadFee', 'unloadFee', 'insuranceFee', 'otherFee']
export default {
  metaInfo: {
    title: '手动下单'
  },
  components: {
    Title,
    TagNumberInput,
    OrderPrint,
    AreaSelect,
    SelectInput,
    FontIcon,
    CargoTable
  },
  mixins: [BaseComponent, BasePage],
  data () {
    const _this = this
    /**
     * 发货时间校验
     */
    const validateDeliveryTime = (rule, value, callback) => {
      if (_this.orderForm.arriveTime && value) {
        // callback(new Error('发货时间需早于发货时间'))
        this.$refs.orderForm.validateField('arriveTime')
        callback()
      } else {
        callback()
      }
    }
    /**
     * 到货时间校验
     */
    const validateArriveTime = (rule, value, callback) => {
      if (_this.orderForm.deliveryTime && value && value.valueOf() <= _this.orderForm.deliveryTime.valueOf()) {
        callback(new Error('到货时间需晚于发货时间'))
      } else {
        callback()
      }
    }
    // const setObject = (params, value) => {
    //   return { index: params.index, name: params.column.key, value }
    // }
    const validatePhone = (rule, value, callback) => {
      if (/1[0-9]{10}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    return {
      settlements,
      pickups, // 提货方式
      autoFocus: false, // 客户信息输入框自动焦点focus
      loading: false, // 查询订单详情加载状态
      disabled: false, // 保存按钮
      orderForm: {
        // 客户，一般是公司名
        consignerName: '',
        // 始发城市
        start: [],
        // 目的城市
        end: [],
        // 客户订单号
        customerOrderNo: '',
        // 发货时间
        deliveryTime: '',
        // 到货时间
        arriveTime: '',
        // 发货联系人
        consignerContact: '',
        consignerPhone: '',
        // 发货地址
        consignerAddress: '',
        // 收货人
        consigneeContact: '',
        consigneePhone: '',
        consigneeAddress: '',
        // 货品信息
        orderCargoList: [],
        // 付款方式
        settlementType: 4, // 默认月结，1:现付，2：到付 ，3：回付 4月结
        // 运输费用
        freightFee: null,
        // 装货费
        loadFee: null,
        // 卸货费
        unloadFee: null,
        // 保险费用
        insuranceFee: null,
        // 其他费用
        otherFee: null,
        // 提货方式
        pickup: null, // 默认1：上门提货，2：直接送货
        // 回单数量
        receiptCount: 1,
        // 备注
        remark: ''
      },
      orderPrint: [],
      rules: {
        consignerName: [
          // { validator: validateConsignerName, trigger: 'blur' }
          { required: true, message: '请输入客户名称' }
        ],
        start: [
          { required: true, type: 'array', message: '请选择始发城市' },
          { validator: FORM_VALIDATE_START(_this, 'orderForm'), trigger: 'change' }
        ],
        end: [
          { required: true, type: 'array', message: '请选择目的城市' },
          { validator: FORM_VALIDATE_END }
        ],
        deliveryTime: [
          { validator: validateDeliveryTime }
        ],
        arriveTime: [
          { validator: validateArriveTime }
        ],
        consignerContact: [
          { required: true, message: '请输入发货人名称' }
        ],
        consignerPhone: [
          { required: true, message: '请输入发货人手机号' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        consignerAddress: [
          { required: true, message: '请输入发货地址' }
        ],
        consigneeContact: [
          { required: true, message: '请输入收货人名称' }
        ],
        consigneePhone: [
          { required: true, message: '请输入收货人手机号' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        consigneeAddress: [
          { required: true, message: '请输入收货地址' }
        ],
        settlementType: [
          { required: true, message: '请选择付款方式' }
        ],
        freightFee: [
          { required: true, type: 'number', message: '请输入运输费用' }
        ],
        pickup: [
          { required: true, message: '请输入提货方式' }
        ],
        receiptCount: [
          { required: true, type: 'number', message: '请输入回单数量' }
        ]

      },
      consignerCargoes: [new Cargo()],
      // tempCargoes: {},
      // statics: {
      //   weight: 0,
      //   volume: 0,
      //   cargoCost: 0,
      //   quantity: 0
      // },
      // 到达时间限制
      endDateOptions: {
        disabledDate (date) {
          return date && date.valueOf() < _this.orderForm.deliveryTime.valueOf()
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'clients',
      'orderDetail',
      'clients',
      'consignerContacts',
      'consignerPhones',
      'consignerAddresses',
      'consigneeContacts',
      'consigneePhones',
      'consigneeAddresses',
      'cargoes',
      'cargoOptions'
      //  'consignerCargoes',
      // 'sumRow'
    ]),

    totalFee () {
      const feeList = ['freightFee', 'loadFee', 'unloadFee', 'insuranceFee', 'otherFee']
      const orderForm = this.orderForm
      let totalFee = 0
      for (let fee of feeList) {
        if (orderForm[fee]) {
          totalFee = float.round(totalFee + parseFloat(orderForm[fee]))
        }
      }
      return totalFee
    }
  },
  watch: {
    consignerCargoes (newCargoes) {
      this.statics = Object.assign({}, this.sumRow)
    }
  },
  created () {
    if (!this.$route.query.id) {
      this.autoFocus = true
    }
  },
  mounted () {
    const vm = this
    this.statics = Object.assign({}, this.sumRow)
    const orderId = this.$route.query.id || undefined
    if (orderId) {
      vm.loading = true
      this.getOrderDetail(orderId)
        .then((orderDetail) => {
          vm.loading = false
          for (let key in vm.orderForm) {
            vm.orderForm[key] = orderDetail[key] || vm.orderForm[key]
          }
          this.consignerCargoes = orderDetail.orderCargoList.map((item) => new Cargo(item, true))
          // 加上id
          vm.orderForm.id = orderDetail.id
          // 分转换元
          transferFeeList.forEach((fee) => {
            vm.orderForm[fee] = vm.orderForm[fee] ? vm.orderForm[fee] / 100 : 0
          })
          // vm.orderForm.start = areas.getPathByCode(orderDetail.start).map((item) => item.code)
          // vm.orderForm.end = areas.getPathByCode(orderDetail.end).map((item) => item.code)
          if (vm.orderForm.deliveryTime) {
            vm.orderForm.deliveryTime = new Date(vm.orderForm.deliveryTime)
          }
          if (vm.orderForm.arriveTime) {
            vm.orderForm.arriveTime = new Date(vm.orderForm.arriveTime)
          }
        })
        .catch((errorInfo) => {
          vm.loading = false
        })
    }
    /**
     * focus到结算方式和提货方式等下拉框时要弹出下拉框
     */
    ['pickupSelector', 'settlementSelector'].forEach((selector) => {
      vm.$refs[selector].$refs.reference.onfocus = (e) => {
        vm.$refs[selector].toggleHeaderFocus(e)
        vm.$nextTick(() => {
          setTimeout(() => {
            if (!vm.$refs[selector].visible) {
              vm.$refs[selector].toggleMenu(e)
            }
          }, 200)
        })
      }
    })
  },
  beforeDestroy () {
    this.resetForm()
    this.clearClients()
    this.clearOrderDetail()
  },
  methods: {
    ...mapActions([
      'getClients',
      'getConsignerDetail',
      'clearCargoes',
      'clearOrderDetail',
      'clearClients',
      'getOrderDetail',
      'submitOrder'
    ]),
    // 保留2位小数
    handleParseFloat (value) {
      return float.floor(value).toString()
    },
    /**
     * 货物名称选择下拉项目时触发
     */
    selectCargo (params, cargoItem) {
      const cargo = this.cargoes.find(cg => cg.id === cargoItem.id)
      if (cargo) {
        // this.syncStoreCargoes()
        this.fullUpdateCargo({ index: params.index, cargo })
      }
    },
    /**
   * 添加一行货物信息
   * @param {*} store
   * @param {*} index
   */
    appendCargo (index) {
      this.consignerCargoes.splice(index + 1, -1, new Cargo())
    },
    /**
   * 删除一行
   * @param {*} store
   * @param {*} index
   */
    removeCargo (index) {
      if (this.consignerCargoes.length === 1) {
        return
      }
      this.consignerCargoes.splice(index, 1)
    },
    /**
     * 删除后增加
     */
    fullUpdateCargo (item) {
      this.consignerCargoes.splice(item.index, 1, new Cargo(item.cargo))
    },
    // 选择客户dropdown的数据
    handleSelectConsigner (name, row) {
      const _this = this
      _this.resetForm()
      _this.getConsignerDetail(row.id).then((response) => {
        const { consigneeList: consignees, addressList: addresses, cargoList, ...consigner } = response.data
        // 设置发货人信息，发货联系人，手机，发货地址
        _this.orderForm.consignerContact = consigner.contact
        _this.orderForm.consignerPhone = consigner.phone
        if (addresses.length > 0) {
          _this.orderForm.consignerAddress = addresses[0].address
        }
        if (consignees.length > 0) {
          // 设置收货人信息，收货人，手机，收货地址
          _this.orderForm.consigneeContact = consignees[0].contact
          _this.orderForm.consigneePhone = consignees[0].phone
          _this.orderForm.consigneeAddress = consignees[0].address
        }
        let settlementType = consigner.settlementType || consigner.payType
        if (settlementType) {
          _this.orderForm.settlementType = settlementType
        }
        if (cargoList.length > 0) {
          // 清空信息，防止信息追加到已维护的货物信息中去
          _this.tempCargoes = {}
          _this.consignerCargoes = [new Cargo(cargoList[0], true)]
        }
      })
    },
    /**
     * 选中收货人，手机号一起设置
     */
    handleSelectConsignee (name, row) {
      this.orderForm.consigneePhone = row.phone
    },
    // 显示计费规则
    showCounter () {
      const vm = this
      if (!vm.orderForm.consignerName) {
        this.$Message.warning('请先选择客户')
        return
      }
      /**
       * 重量和体积二选一，或者都填写，可以了
       */
      if (vm.statics.weight <= 0 && vm.statics.volume <= 0) {
        this.$Message.warning('请先填写货物必要信息')
        return
      }
      this.openDialog({
        name: 'dialogs/financeRule.vue',
        data: {
          start: getCityCode(vm.orderForm.start), // 始发城市
          end: getCityCode(vm.orderForm.end), // 目的城市
          partnerName: vm.orderForm.consignerName, // 客户名
          partnerType: 1, // 计算规则分类：1-发货方，2-承运商，3-外转方
          weight: vm.statics.weight,
          volume: vm.statics.volume
        },
        methods: {
          ok (value) {
            vm.orderForm.freightFee = value || 0
          }
        }
      })
    },
    handleSettle (e) {
      console.log('focus', e)
    },
    // 提交表单
    handleSubmit (e) {
      const vm = this
      vm.disabled = true
      return new Promise((resolve, reject) => {
        vm.$refs.orderForm.validate((valid) => {
          if (valid) {
            const orderCargoList = vm.consignerCargoes
            const orderForm = vm.orderForm
            let findError = null
            // 校验货物信息
            for (let index in orderCargoList) {
              let cargo = orderCargoList[index]
              let info = cargo.validate()
              if (!info.success) {
                findError = info.message
                break
              }
            }

            if (findError) {
              vm.$Message.error(findError)
              vm.disabled = false
              reject(new Error(findError.message))
              return
            }
            // 始发地遇到北京市等特殊直辖市，需要只保留第一级code
            let start = getCityCode(orderForm.start)
            let end = getCityCode(orderForm.end)
            // 始发城市，目的城市，到达时间等需要额外处理
            let form = Object.assign({}, orderForm, {
              start: start,
              end: end,
              arriveTime: !orderForm.arriveTime ? null : orderForm.arriveTime.Format('yyyy-MM-dd hh:mm'),
              deliveryTime: !orderForm.deliveryTime ? null : orderForm.deliveryTime.Format('yyyy-MM-dd hh:mm'),
              orderCargoList: orderCargoList.map(cargo => cargo.toJson())
            });

            ['start', 'end'].forEach(field => {
              form[field] = parseInt(form[field])
            })
            // 转换成分单位
            transferFeeList.forEach((fee) => {
              form[fee] = form[fee] ? form[fee] * 100 : 0
            })
            vm.submitOrder(form)
              .then((response) => {
                if (!form.id) {
                  this.$Message.success('创建订单成功')
                } else {
                  this.$Message.success('修改订单成功')
                }
                if (e && !form.id) {
                  // 保存不打印，创建订单
                  vm.resetForm()
                }
                vm.disabled = false
                if (e && form.id) {
                  // 保存，不打印，修改页面
                  vm.closeTab()
                }
                // 重新获取客户列表
                vm.getClients()
                resolve()
              })
              .catch((er) => {
                vm.disabled = false
                reject(er)
              })
          } else {
            vm.disabled = false
            // 主动滚动到顶部
            if (vm.orderForm.pickup) {
              vm.$parent.$el.scrollTop = 0
            }
            vm.$Message.error('请填写必填信息')
            reject(new Error('请填写必填信息'))
          }
        })
      })
    },
    // 清空重置表单
    resetForm () {
      this.$refs.orderForm.resetFields()
      this.clearCargoes()
      this.consignerCargoes = [new Cargo()]
      resetCityValidator()
    },
    // 修改订单完结束后，自动关闭页面
    closeTab () {
      this.ema.fire('closeTab', this.$route)
    },
    // 打印
    print () {
      const vm = this
      this.handleSubmit()
        .then(() => {
          let orderPrint = _.cloneDeep(vm.orderForm)
          orderPrint.orderCargoList = _.cloneDeep(vm.consignerCargoes)
          orderPrint.totalFee = vm.totalFee

          vm.orderPrint = [orderPrint]
          vm.$refs.printer.print()
          if (!orderPrint.id) {
            // 创建订单页面
            vm.resetForm()
          } else {
            vm.closeTab()
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.order-create
  &__input-suffix
    line-height 32px
  &__input-w100
    width 100%
  &__cell-no-padding
    padding-left 0
    padding-right 0
  &__font-total
    font-size 20px
    color #00A4BD
    font-weight bold
    padding-right 13px
</style>
