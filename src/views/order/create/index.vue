<template>
  <Form ref="orderForm" :label-width="80" :model="orderForm" :rules="rules">
    <Spin v-if="loading" fix>
      <img src="../../../assets/loading.gif" width="24" height="24" alt="加载中">
    </Spin>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="客户名称:" prop="consignerName">
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
      <FormItem label="客户单号:" prop="customerOrderNo">
        <Input v-model="orderForm.customerOrderNo" :maxlength="30" type="text"></Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="发货时间:">
        <Row>
          <Col span="13">
          <FormItem prop="deliveryTime">
            <DatePicker v-model="orderForm.deliveryTime" :options="startDateOptions" style="width: 100%" format="yyyy-MM-dd" type="date" placeholder="请选择日期" @on-change="(date) => { dateChange('START_DATE', date)}"></DatePicker>
          </FormItem>
          </Col>
          <Col span="11" style="padding-left: 5px">
          <FormItem prop="deliveryTimes">
            <TimeInput ref="stTimeInput" v-model="orderForm.deliveryTimes" :options="startTimeOptions" :time-date="formateDate(orderForm.deliveryTime)" type="START_DATE"/>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="到货时间:">
        <Row>
          <Col span="13">
          <FormItem prop="arriveTime">
            <DatePicker v-model="orderForm.arriveTime" :options="endDateOptions" style="width: 100%" format="yyyy-MM-dd" type="date" placeholder="请选择日期"  @on-change="(date) => { dateChange('END_DATE', date)}"></DatePicker>
          </FormItem>
          </Col>
          <Col span="11" style="padding-left: 5px">
          <FormItem prop="arriveTimes">
            <TimeInput ref="edTimeInput" v-model="orderForm.arriveTimes" :options="endTimeOptions" :time-date="formateDate(orderForm.arriveTime)" type="END_DATE"/>
          </FormItem>
          </Col>
        </Row>
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
      <FormItem label="发货地址:" class="consig-address">
        <Row>
          <Col span="11">
          <FormItem prop="start">
            <CitySelect ref="start" v-model="orderForm.start" :code-type="4" clearable></CitySelect>
          </FormItem>
          </Col>
          <Col span="13" style="padding-left: 5px">
          <FormItem prop="consignerAddress">
            <AreaInput
              v-model="orderForm.consignerAddress"
              :city-code="startCityCode"
              :local-options="consignerAddresses"
              :disabled="true"
              :filter-city="true"
              @latlongt-change="({lat, lng}) => latlongtChange(1, lat, lng)"/>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="收货地址:" class="consig-address">
        <Row>
          <Col span="11">
          <FormItem prop="end">
            <CitySelect ref="end" v-model="orderForm.end" :code-type="4" clearable></CitySelect>
          </FormItem>
          </Col>
          <Col span="13" style="padding-left: 5px">
          <FormItem prop="consigneeAddress">
            <AreaInput
              v-model="orderForm.consigneeAddress"
              :city-code="endCityCode"
              :local-options="consigneeAddresses"
              :disabled="true"
              :filter-city="true"
              @latlongt-change="({lat, lng}) => latlongtChange(2, lat, lng)"/>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      </Col>
    </Row>
    <Title>货物信息</Title>
    <CargoTable
      ref="cargoTable"
      :cargoes="cargoes"
      :data-source="consignerCargoes"
      :on-append="appendCargo"
      :on-remove="removeCargo"
      :on-select="selectCargo">
    </CargoTable>

    <Title class="i-mb-15 i-mt-15">应收费用</Title>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="结算方式:" prop="settlementType">
        <Select ref="settlementSelector" v-model="orderForm.settlementType">
          <Option v-for="opt in settlements" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="计费里程:" prop="mileage">
        <TagNumberInput :min="0" v-model="orderForm.mileage" :parser="handleParseFloats">
          <span slot="suffix" class="order-create__input-suffix">公里</span>
        </TagNumberInput>
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
        <p class="foramte-num">{{formateNum(orderForm.freightFee)}}</p>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="提货费用:" prop="pickupFee">
        <TagNumberInput :min="0" v-model="orderForm.pickupFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
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
        <Row>
          <Col span="20">
          <InputNumber v-model="orderForm.receiptCount" :min="0" :parser="value => value ?  parseInt(value).toString() : value" class="order-create__input-w100">
          </InputNumber>
          </Col>
          <Col span="4" style="text-align: center">
          <span>份</span>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="代收货款:" prop="collectionMoney">
        <TagNumberInput :min="0" v-model="orderForm.collectionMoney" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
      <FormItem label="备注:" prop="remark">
        <Input v-model="orderForm.remark" :maxlength="100" type="text">
          </Input>
      </FormItem>
      </Col>
    </Row>
    <div class="van-center i-mt-20 i-mb-20">
      <Button v-if="hasPower(100101)" :disabled="disabled" type="primary" @click="handleSubmit">保存</Button>
      <Button v-if="hasPower(100102)" :disabled="disabled" class="i-ml-10" @click="print">保存并打印</Button>
      <Button v-if="hasPower(100103)" class="i-ml-10" @click="resetForm">清空</Button>
    </div>
    <OrderPrint ref="printer" :list="orderPrint">
    </OrderPrint>
  </Form>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import Title from './components/Title.vue'
import SelectInput from '@/components/SelectInput.vue'
import TagNumberInput from '@/components/TagNumberInput'
import float from '@/libs/js/float'
import BaseComponent from '@/basic/BaseComponent'
import BasePage from '@/basic/BasePage'
import OrderPrint from './components/OrderPrint'
import FontIcon from '@/components/FontIcon'
import settlements from '@/libs/constant/settlement.js'
import pickups from '@/libs/constant/pickup.js'
import Cargo from './libs/cargo'
import CargoTable from './components/CargoTable.vue'
import TimeInput from './components/TimeInput.vue'
import validator from '@/libs/js/validate'
import cityUtil from '@/libs/js/city'
import CitySelect from '@/components/SelectInputForCity'
import AreaInput from '@/components/AreaInput.vue'
import distance from '@/libs/js/distance'
import { money2chinese } from '@/libs/js/util'

const transferFeeList = ['freightFee', 'pickupFee', 'loadFee', 'unloadFee', 'insuranceFee', 'otherFee', 'collectionMoney']
export default {
  metaInfo: {
    title: '手动下单'
  },
  components: {
    Title,
    TagNumberInput,
    OrderPrint,
    SelectInput,
    FontIcon,
    CargoTable,
    TimeInput,
    CitySelect,
    AreaInput
  },
  mixins: [BaseComponent, BasePage],
  data () {
    const _this = this
    // 发货时间校验
    const validateStart = (rule, value, callback) => {
      const stDate = _this.orderForm.deliveryTime
      const edDate = _this.orderForm.arriveTime
      const edTime = _this.orderForm.arriveTimes
      const valids = value && stDate && edDate && edTime
      if (valids && stDate.setHours(value.substr(0, 2), value.substr(3, 2)) > edDate.setHours(edTime.substr(0, 2), edTime.substr(3, 2))) {
        callback(new Error('发货时间需早于发货时间'))
      } else {
        callback()
      }
    }
    // 到货时间校验
    const validateEnd = (rule, value, callback) => {
      const stDate = _this.orderForm.deliveryTime
      const stTime = _this.orderForm.deliveryTimes
      const edDate = _this.orderForm.arriveTime
      const valids = value && stDate && edDate && stTime
      if (valids && stDate.setHours(stTime.substr(0, 2), stTime.substr(3, 2)) > edDate.setHours(value.substr(0, 2), value.substr(3, 2))) {
        callback(new Error('到货时间需晚于发货时间'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (validator.phone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    // 9位整数 2位小数
    const validateFee = (rule, value, callback) => {
      if ((value && validator.fee(value)) || !value) {
        callback()
      } else {
        callback(new Error('费用整数位最多输入9位,小数2位'))
      }
    }
    // 6位整数 1位小数
    const validateMile = (rule, value, callback) => {
      if ((value && validator.mileage(value)) || !value) {
        callback()
      } else {
        callback(new Error('距离整数位最多输入6位,小数1位'))
      }
    }
    // 代收付款
    // const validateCollectFee = (rule, value, callback) => {
    //   if ((value && validator.fee(value)) || !value === null || value === '') {
    //     callback()
    //   } else {
    //     callback(new Error('费用整数位最多输入9位且大于0'))
    //   }
    // }
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
        start: null,
        // 目的城市
        end: null,
        // 客户订单号
        customerOrderNo: '',
        // 发货时间
        deliveryTime: '',
        deliveryTimes: '',
        // 到货时间
        arriveTime: '',
        arriveTimes: '',
        // 发货联系人
        consignerContact: '',
        consignerPhone: '',
        // 发货地址
        consignerAddress: '',
        // 经度
        consignerAddressLongitude: '',
        // 纬度
        consignerAddressLatitude: '',
        consignerAddressMapType: 1,
        // 收货人
        consigneeContact: '',
        consigneePhone: '',
        consigneeAddress: '',
        // 经纬度
        consigneeAddressLongitude: '',
        consigneeAddressLatitude: '',
        consigneeAddressMapType: 1,
        // 货品信息
        orderCargoList: [],
        // 付款方式
        settlementType: 4, // 默认月结，1:现付，2：到付 ，3：回付 4月结
        // 计算里程
        mileage: null,
        // 运输费用
        freightFee: null,
        // 提货费
        pickupFee: null,
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
        collectionMoney: null,
        // 备注
        remark: ''
      },
      orderPrint: [],
      rules: {
        consignerName: [
          { required: true, message: '请输入客户名称' }
        ],
        start: [
          { required: true, message: '请输入始发城市' }
        ],
        end: [
          { required: true, message: '请输入目的城市' }
        ],
        deliveryTimes: [
          { validator: validateStart, trigger: 'change' }
        ],
        arriveTimes: [
          { validator: validateEnd, trigger: 'change' }
        ],
        consignerContact: [
          { required: true, message: '请输入发货人名称' }
        ],
        consignerPhone: [
          { required: true, message: '请输入发货人手机号' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        consigneeContact: [
          { required: true, message: '请输入收货人名称' }
        ],
        consigneePhone: [
          { required: true, message: '请输入收货人手机号' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        consignerAddress: [
          { required: true, message: '请输入详细地址' }
        ],
        consigneeAddress: [
          { required: true, message: '请输入详细地址' }
        ],
        settlementType: [
          { required: true, message: '请选择付款方式' }
        ],
        // 运输费
        freightFee: [
          { required: true, type: 'number', message: '请输入运输费用' },
          { validator: validateFee }
        ],
        // 提货费
        pickupFee: [
          { validator: validateFee }
        ],
        // 装货费用
        loadFee: [
          { validator: validateFee }
        ],
        // 卸货费用
        unloadFee: [
          { validator: validateFee }
        ],
        // 保险费用
        insuranceFee: [
          { validator: validateFee }
        ],
        // 其他费用
        otherFee: [
          { validator: validateFee }
        ],
        pickup: [
          { required: true, message: '请输入提货方式' }
        ],
        receiptCount: [
          { required: true, type: 'number', message: '请输入回单数量' }
        ],
        // 代收货款
        collectionMoney: [
          { validator: validateFee }
        ],
        // 计费里程
        mileage: [
          { validator: validateMile }
        ]
      },
      consignerCargoes: [new Cargo()],
      startDateOptions: {
        disabledDate (date) {
          return date && date > new Date(_this.orderForm.arriveTime)
        }
      },
      // 到达时间限制
      endDateOptions: {
        disabledDate (date) {
          return date && date < new Date(_this.orderForm.deliveryTime)
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'orderDetail',
      'clients',
      'consignerAddresses',
      'consigneeContacts',
      'consigneePhones',
      'consigneeAddresses',
      'cargoes',
      'cargoOptions'
    ]),
    totalFee () {
      const feeList = ['freightFee', 'pickupFee', 'loadFee', 'unloadFee', 'insuranceFee', 'otherFee']
      const orderForm = this.orderForm
      let totalFee = 0
      for (let fee of feeList) {
        if (orderForm[fee]) {
          totalFee = float.round(totalFee + parseFloat(orderForm[fee]))
        }
      }
      return totalFee
    },
    startTimeOptions () {
      const stdt = this.formateDate(this.orderForm.deliveryTime)
      const eddt = this.formateDate(this.orderForm.arriveTime)
      return stdt === eddt ? this.orderForm.arriveTimes : ''
    },
    endTimeOptions () {
      const stdt = this.formateDate(this.orderForm.deliveryTime)
      const eddt = this.formateDate(this.orderForm.arriveTime)
      return stdt === eddt ? this.orderForm.deliveryTimes : ''
    },
    startCityCode () {
      const arr = cityUtil.getPathByCode(this.orderForm.start)
      return arr.length ? arr[1].code : ''
    },
    endCityCode () {
      const arr = cityUtil.getPathByCode(this.orderForm.end)
      return arr.length ? arr[1].code : ''
    }
  },
  created () {
    if (!this.$route.query.id) {
      this.autoFocus = true
    }
  },
  mounted () {
    const vm = this
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
          // vm.orderForm.collectionMoney = vm.orderForm.collectionMoney ? vm.orderForm.collectionMoney / 100 : null
          if (vm.orderForm.deliveryTime) {
            const deliveryTime = new Date(vm.orderForm.deliveryTime)
            vm.orderForm.deliveryTime = deliveryTime
            vm.orderForm.deliveryTimes = `${deliveryTime.getHours() > 9 ? deliveryTime.getHours() : '0' + deliveryTime.getHours()}:${deliveryTime.getMinutes() > 9 ? deliveryTime.getMinutes() : '0' + deliveryTime.getMinutes()}`
          }
          if (vm.orderForm.arriveTime) {
            const arriveTime = new Date(vm.orderForm.arriveTime)
            vm.orderForm.arriveTime = arriveTime
            vm.orderForm.arriveTimes = `${arriveTime.getHours() > 9 ? arriveTime.getHours() : '0' + arriveTime.getHours()}:${arriveTime.getMinutes() > 9 ? arriveTime.getMinutes() : '0' + arriveTime.getMinutes()}`
          }
          // 里程除以 1000
          vm.orderForm.mileage = vm.orderForm.mileage ? vm.orderForm.mileage / 1000 : 0
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
  },
  methods: {
    ...mapActions([
      'getClients',
      'getConsignerDetail',
      'clearCargoes',
      'clearClients',
      'getOrderDetail',
      'submitOrder'
    ]),
    // 保留2位小数
    handleParseFloat (value) {
      return float.floor(value).toString()
    },
    // 保留1位小数
    handleParseFloats (value) {
      return float.floor(value, 1).toString()
    },
    // 货物名称选择下拉项目时触发
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
      /**
       * 重置表单，除货物信息以外
       * 1. 切换客户
       * 2. 用户手动先输入
       *
       */
      _this.$refs.orderForm.resetFields()
      // 设置编号，计费规则需要
      _this.getConsignerDetail(row.id).then((response) => {
        const { consigneeList: consignees, addressList: addresses, cargoList, ...consigner } = response.data
        // 设置发货人信息，发货联系人，手机，发货地址
        _this.orderForm.consignerContact = consigner.contact
        _this.orderForm.consignerPhone = consigner.phone
        if (addresses.length > 0) {
          _this.orderForm.consignerAddress = addresses[0].address
          _this.orderForm.consignerAddressLongitude = addresses[0].longitude
          _this.orderForm.consignerAddressLatitude = addresses[0].latitude
          _this.orderForm.start = addresses[0].cityCode
          _this.orderForm.consignerAddressLatitude = addresses[0].latitude
          _this.orderForm.consignerAddressLongitude = addresses[0].longitude
        }
        if (consignees.length > 0) {
          // 设置收货人信息，收货人，手机，收货地址
          _this.orderForm.consigneeContact = consignees[0].contact
          _this.orderForm.consigneePhone = consignees[0].phone
          _this.orderForm.consigneeAddress = consignees[0].address
          _this.orderForm.consigneeAddressLongitude = consignees[0].longitude
          _this.orderForm.consigneeAddressLatitude = consignees[0].latitude
          _this.orderForm.end = consignees[0].cityCode
          _this.orderForm.consigneeAddressLatitude = consignees[0].latitude
          _this.orderForm.consigneeAddressLongitude = consignees[0].longitude
        }
        let settlementType = consigner.settlementType || consigner.payType
        if (settlementType) {
          _this.orderForm.settlementType = settlementType
        }
        /**
         * 1. 货物信息如果之前已经有数据了，就不清空
         * 2. 如果之前是空的就赋值
         */
        if (cargoList.length > 0) {
          // 如果在货物信息中已经有数据了，就不覆盖了；如果没有货物信息，就默认添加已维护的货物
          const confignerCargoValid = _this.consignerCargoes[0].validate()
          if (!confignerCargoValid.success) {
            _this.consignerCargoes = [new Cargo(cargoList[0], true)]
          }
        }
      })
    },
    /**
     * 选中收货人，手机号一起设置
     */
    handleSelectConsignee (name, row) {
      this.orderForm.consigneePhone = row.phone
      this.orderForm.end = row.cityCode
      this.orderForm.consigneeAddress = row.address
      this.orderForm.consigneeAddressLatitude = row.latitude
      this.orderForm.consigneeAddressLongitude = row.longitude
    },
    // 显示计费规则
    showCounter () {
      const vm = this
      if (!vm.orderForm.consignerName) {
        this.$Message.warning('请先选择客户')
        return
      }

      if (!vm.orderForm.start) {
        this.$Message.warning('请先选择始发城市')
        return
      }
      if (!vm.orderForm.end) {
        this.$Message.warning('请先选择目的城市')
        return
      }

      const clientItem = this.clients.find(client => client.value === vm.orderForm.consignerName)
      if (!clientItem) {
        this.$Message.warning('您选择的客户没有维护的计费规则')
        return
      }
      let clientId = clientItem.id
      if (!clientId) {
        this.$Message.warning('您选择的客户没有维护的计费规则')
        return
      }
      const statics = vm.$refs.cargoTable.statics
      /**
       * 重量和体积二选一，或者都填写，可以了
       */
      if (statics.weight <= 0 && statics.volume <= 0) {
        this.$Message.warning('请先填写货物必要信息')
        return
      }
      this.openDialog({
        name: 'dialogs/financeRule.vue',
        data: {
          start: vm.orderForm.start, // 始发城市
          end: vm.orderForm.end, // 目的城市
          partnerId: clientId, // 客户编号
          partnerName: vm.orderForm.consignerName, // 客户名
          partnerType: 1, // 计算规则分类：1-发货方，2-承运商，3-外转方
          weight: statics.weight,
          volume: statics.volume,
          startPoint: { lat: this.orderForm.consignerAddressLatitude, lng: this.orderForm.consignerAddressLongitude },
          endPoint: { lat: this.orderForm.consigneeAddressLatitude, lng: this.orderForm.consigneeAddressLongitude }
        },
        methods: {
          ok (value) {
            vm.orderForm.freightFee = value || 0
          }
        }
      })
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
            // let start = getCityCode(orderForm.start)
            // let end = getCityCode(orderForm.end)
            // 始发城市，目的城市，到达时间等需要额外处理
            let form = Object.assign({}, orderForm, {
              // start: start,
              // end: end,
              arriveTime: !orderForm.arriveTime ? null : orderForm.arriveTime.Format('yyyy-MM-dd hh:mm'),
              deliveryTime: !orderForm.deliveryTime ? null : orderForm.deliveryTime.Format('yyyy-MM-dd hh:mm'),
              orderCargoList: orderCargoList.map(cargo => cargo.toJson()),
              mileage: orderForm.mileage * 1000
            });

            ['start', 'end'].forEach(field => {
              form[field] = parseInt(form[field])
              // 保存本地记录
              vm.$refs['start'].saveCity(form[field])
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
    },
    dateChange (type, date) {
      const refs = type === 'START_DATE' ? 'stTimeInput' : type === 'END_DATE' ? 'edTimeInput' : ''
      if (date && refs) {
        // this.$root.$emit(type, 'show')
        this.$refs[refs].changeShow(type)
        this.$refs[refs].focus()
      }
    },
    formateDate (date) {
      if (!(typeof date === 'object' && date instanceof Date)) {
        return ''
      }
      const dates = new Date(date)
      const y = dates.getFullYear()
      const m = this.getTwoNum(dates.getMonth() + 1)
      const d = this.getTwoNum(dates.getDate())
      return `${y}-${m}-${d}`
    },
    getTwoNum (d) {
      return d > 9 ? d : 0 + d
    },
    latlongtChange (type, lat, lng) {
      if (type === 1) {
        this.orderForm.consignerAddressLongitude = lng
        this.orderForm.consignerAddressLatitude = lat
      } else if (type === 2) {
        this.orderForm.consigneeAddressLongitude = lng
        this.orderForm.consigneeAddressLatitude = lat
      }
      this.distanceCp()
    },
    distanceCp () {
      const p1 = {
        lng: this.orderForm.consignerAddressLongitude,
        lat: this.orderForm.consignerAddressLatitude
      }
      const p2 = {
        lng: this.orderForm.consigneeAddressLongitude,
        lat: this.orderForm.consigneeAddressLatitude
      }
      if (p1.lng && p1.lat && p2.lng && p2.lat) {
        this.cpmtDistance(p1, p2)
      }
    },
    // 距离计算
    cpmtDistance (p1, p2) {
      // { lng: 118.795264, lat: 32.027003 }
      distance(p1, p2).then(res => {
        const num = float.floor(res / 1000, 1)
        this.orderForm.mileage = Number(num)
      })
    },
    formateNum (value) {
      if (value && value > 9999.99) {
        return money2chinese(value)
      }
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
<style lang="stylus">
.consig-address
  .ivu-form-item-label:before
    content '*'
    display inline-block
    margin-right 4px
    line-height 1
    font-family SimSun
    font-size 12px
    color #ed4014
.foramte-num
  font-size 12px
  line-height 14px
</style>
