<template>
  <Form ref="orderForm" :label-width="85" :model="orderForm" :rules="rules" style="position: relative;">
    <Spin v-if="loading" fix>
      <img src="../../../assets/loading.gif" width="24" height="24" alt="加载中">
    </Spin>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="客户名称:" prop="consignerName">
        <SelectInput
          v-model="orderForm.consignerName"
          :auto-focus="autoFocus"
          :maxlength="$fieldLength.company"
          :remote="false"
          :clearable="true"
          :local-options="clients"
          @on-focus.once="getClients"
          @on-select="handleSelectConsigner">
        </SelectInput>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.customerOrderNoOption == 1" span="6">
      <FormItem label="客户订单号:" prop="customerOrderNo">
        <Input v-model="orderForm.customerOrderNo" :maxlength="$fieldLength.orderNo" clearable></Input>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.customerWaybillNoOption == 1" span="6">
      <FormItem label="客户运单号:" prop="customerWaybillNo">
        <Input v-model="orderForm.customerWaybillNo" :maxlength="$fieldLength.billNo" clearable></Input>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.salesmanIdOption == 1" span="6">
      <FormItem label="对接业务员:" prop="salesmanId">
        <Select v-model="orderForm.salesmanId" transfer clearable placeholder="全部">
          <Option v-for="(opt, index) in salesmanList" :key="index" :value="opt.id">{{opt.name}}</Option>
        </Select>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col v-if="OrderSet.startCityOption == 1" span="6">
      <FormItem label="发货城市:" prop="start">
        <CitySelect v-model="orderForm.start" clearable></CitySelect>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.endCityOption == 1" span="6">
      <FormItem label="到货城市:" prop="end">
        <CitySelect v-model="orderForm.end" clearable></CitySelect>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.deliveryTimeOption == 1" span="6">
      <FormItem label="发货时间:">
        <Row>
          <Col span="13">
          <FormItem prop="deliveryTime">
            <DatePicker v-model="orderForm.deliveryTime" :options="startDateOptions" transfer style="width: 100%" format="yyyy-MM-dd" type="date" placeholder="请选择日期" @on-change="(date) => { dateChange('START_DATE', date)}"></DatePicker>
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
      <Col v-if="OrderSet.arriveTimeOption == 1" span="6">
      <FormItem label="到货时间:">
        <Row>
          <Col span="13">
          <FormItem prop="arriveTime">
            <DatePicker v-model="orderForm.arriveTime" :options="endDateOptions" transfer style="width: 100%" format="yyyy-MM-dd" type="date" placeholder="请选择日期"  @on-change="(date) => { dateChange('END_DATE', date)}"></DatePicker>
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
        <Input v-model="orderForm.consignerContact" :maxlength="$fieldLength.name" clearable></Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="联系号码:" prop="consignerPhone">
        <SelectInput v-model="orderForm.consignerPhone" :formatter="formatePhoneNum" :maxlength="phoneLength(orderForm.consignerPhone)" placeholder="请输入手机号或座机号" clearable></SelectInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="收货人:" prop="consigneeContact">
        <SelectInput v-model="orderForm.consigneeContact" :maxlength="$fieldLength.name" :local-options="consigneeContacts" :remote="false" clearable @on-select="handleSelectConsignee">
        </SelectInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="联系号码:" prop="consigneePhone">
        <SelectInput v-model="orderForm.consigneePhone" :formatter="formatePhoneNum" :local-options="consigneePhones" :maxlength="phoneLength(orderForm.consigneePhone)" :remote="false" placeholder="请输入手机号或座机号" clearable></SelectInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">
      <FormItem label="发货地址:" class="consig-address" prop="consignerAddress">
        <AreaInput
          v-model="orderForm.consignerAddress"
          :local-options="consignerAddresses"
          :show-icon="!!orderForm.consignerAddressLongitude && !!orderForm.consignerAddressLatitude"
          placeholder="详细地址（省市区+地址）"
          @city-select="({lat, lng, cityCode}) => citySelect(1, lat, lng, cityCode)"/>
      </FormItem>
      </Col>
      <Col span="3">
      <FormItem :label-width="0" prop="consignerHourseNumber">
        <Input v-model="orderForm.consignerHourseNumber" :maxlength="$fieldLength.extraAddress" placeholder="补充地址（楼号-门牌等）" clearable></Input>
      </FormItem>
      </Col>
      <Col span="1">
      <FormItem :label-width="0">
        <Tooltip :max-width="200" content="详细地址从下拉推荐地址中选择，可获取到经纬度，自动计算运输里程" transfer>
          <Icon class="vermiddle" type="ios-information-circle" size="16" color="#FFBB44"></Icon>
        </Tooltip>
      </FormItem>
      </Col>
      <Col span="8">
      <FormItem label="收货地址:" class="consig-address" prop="consigneeAddress">
        <AreaInput
          v-model="orderForm.consigneeAddress"
          :local-options="consigneeAddresses"
          :show-icon="!!orderForm.consigneeAddressLongitude && !!orderForm.consigneeAddressLatitude"
          placeholder="详细地址（省市区+地址）"
          @city-select="({lat, lng, cityCode}) => citySelect(2, lat, lng, cityCode)"/>
      </FormItem>
      </Col>
      <Col span="3">
      <FormItem :label-width="0" prop="consigneeHourseNumber">
        <Input v-model="orderForm.consigneeHourseNumber" :maxlength="$fieldLength.extraAddress" placeholder="补充地址（楼号-门牌等）" clearable></Input>
      </FormItem>
      </Col>
      <Col span="1">
      <FormItem :label-width="0">
        <Tooltip :max-width="200" content="详细地址从下拉推荐地址中选择，可获取到经纬度，自动计算运输里程" transfer>
          <Icon class="vermiddle" type="ios-information-circle" size="16" color="#FFBB44"></Icon>
        </Tooltip>
      </FormItem>
      </Col>
    </Row>
    <Row v-if="OrderSet.consigneeCompanyNameOption == 1" :gutter="16" >
      <Col span="12" offset="12">
      <!-- 收货人公司设置 -->
      <FormItem :maxlength="50" label="收货人单位：" prop="consigneeCompanyName">
        <Input v-model="orderForm.consigneeCompanyName" :maxlength="$fieldLength.extraAddress" clearable></Input>
      </FormItem>
      </Col>
    </Row>
    <Title>货物信息</Title>
    <CargoTable
      ref="cargoTable"
      :order-set="OrderSet"
      :cargoes="cargoes"
      :data-source="consignerCargoes"
      :on-append="appendCargo"
      :on-remove="removeCargo"
      :on-select="selectCargo">
    </CargoTable>

    <Title class="i-mb-15 i-mt-15">应收费用</Title>
    <Row :gutter="16" style="margin-bottom: 10px">
      <Col span="6">
      <FormItem label="结算方式:" prop="settlementType">
        <Row>
          <Col span="19">
          <Select ref="settlementSelector" v-model="orderForm.settlementType" transfer>
            <Option v-for="opt in settlements" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          </Select>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.mileageOption == 1" span="6">
      <FormItem label="计费里程:" prop="mileage">
        <Row>
          <Col span="19">
          <TagNumberInput :show-chinese="false" :min="0" v-model="orderForm.mileage" :precision="1" clearable>
          </TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">公里</Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.freightFeeOption == 1" span="6">
      <FormItem label="运输费用:" prop="freightFee">
        <Row>
          <Col span="19">
          <TagNumberInput :min="0" v-model="orderForm.freightFee" clearable></TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">
          <span style="vertical-align:middle">元</span>
          <span @click="showCounter">
            <FontIcon type="jisuanqi" size="20" color="#00a4bd" style="vertical-align:middle"></FontIcon>
          </span>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.pickupFeeOption == 1" span="6">
      <FormItem label="提货费用:" prop="pickupFee">
        <Row>
          <Col span="19">
          <TagNumberInput :min="0" v-model="orderForm.pickupFee" clearable></TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">元</Col>
        </Row>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col v-if="OrderSet.loadFeeOption == 1" span="6">
      <FormItem label="装货费用:" prop="loadFee">
        <Row>
          <Col span="19">
          <TagNumberInput :min="0" v-model="orderForm.loadFee" clearable></TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">元</Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.unloadFeeOption == 1" span="6">
      <FormItem label="卸货费用:" prop="unloadFee">
        <Row>
          <Col span="19">
          <TagNumberInput :min="0" v-model="orderForm.unloadFee" clearable></TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">元</Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.insuranceFeeOption == 1" span="6">
      <FormItem label="保险费用:" prop="insuranceFee">
        <Row>
          <Col span="19">
          <TagNumberInput :min="0" v-model="orderForm.insuranceFee" clearable></TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">元</Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.otherFeeOption == 1" span="6">
      <FormItem label="其他费用:" prop="otherFee">
        <Row>
          <Col span="19">
          <TagNumberInput :min="0" v-model="orderForm.otherFee" clearable></TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">元</Col>
        </Row>
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
      <Col v-if="OrderSet.pickupOption == 1" span="6">
      <FormItem :class="{'ivu-form-item-error': highLight}" label="提货方式:" prop="pickup">
        <Row>
          <Col span="19">
          <Select ref="pickupSelector" v-model="orderForm.pickup" :disabled="orderForm.disabledPickUp" transfer>
            <Option v-for="opt in pickups" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          </Select>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.receiptCountOption == 1" span="6">
      <FormItem label="回单数量:" prop="receiptCount">
        <Row>
          <Col span="19">
          <TagNumberInput :show-chinese="false" :min="0" v-model="orderForm.receiptCount" :precision="0" clearable>
          </TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">份</Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.isInvoiceOption == 1" span="6">
      <FormItem label="是否开票:" prop="isInvoice">
        <Row>
          <Col span="19">
          <Select v-model="orderForm.isInvoice" transfer>
            <Option v-for="opt in invoiceList" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          </Select>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem v-if="orderForm.isInvoice === 1 && OrderSet.isInvoiceOption == 1" label="开票税率:" prop="invoiceRate">
        <Row>
          <Col span="6">
          <TagNumberInput v-model="orderForm.invoiceRate" :show-chinese="false" :precision="2" :min="0" :max="100" clearable>
          </TagNumberInput>
          </Col>
          <Col span="18" class="order-create__input-unit">
          <span style="float: left">%</span>
          <span>({{ invoiceFee }}元)</span>
          </Col>
        </Row>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16" class="i-mt-15">
      <Col v-if="OrderSet.collectionMoneyOption == 1" span="6">
      <FormItem label="代收货款:" prop="collectionMoney">
        <Row>
          <Col span="19">
          <TagNumberInput :min="0" v-model="orderForm.collectionMoney" clearable></TagNumberInput>
          </Col>
          <Col span="5" class="order-create__input-unit">元</Col>
        </Row>
      </FormItem>
      </Col>
      <Col v-if="OrderSet.orderRemarkOption == 1" span="18">
      <FormItem label="备注:" prop="remark">
        <Input v-model="orderForm.remark" :maxlength="$fieldLength.remark" clearable></Input>
      </FormItem>
      </Col>
    </Row>
    <div class="van-center i-mt-20 i-mb-20">
      <span v-if="!orderId" style="float: left; vertical-align:middle;">
        <Checkbox v-model="isSaveOrderTemplate">保存为常发订单</Checkbox>
      </span>
      <Button v-if="hasPower(100101)" :loading="disabled" type="primary" @click="handleSubmit">保存</Button>
      <Button v-if="hasPower(100102)" :loading="disabled" class="i-ml-10" @click="print">保存并打印</Button>
      <Button v-if="hasPower(100103)" class="i-ml-10" @click="resetForm">清空</Button>
      <Button v-if="hasPower(100104) && !orderId" class="i-ml-10" @click="shipImmedite">立即发运</Button>
      <span v-if="hasPower(150300)" style="float: right; vertical-align:middle; width: 30px; height: 30px; background: #EFEFEF; border: 1px solid #ccc; border-radius: 4px" @click="setHandle">
        <FontIcon type="shezhi" size="20" color="#999999" style="cursor: pointer"></FontIcon>
      </span>
    </div>
    <OrderPrint ref="printer" :list="orderPrint" source="create">
    </OrderPrint>
  </Form>
</template>

<script>
import api from './libs/api'
import distance from '@/libs/js/distance'
import validator, { validatePhone } from '@/libs/js/validate'
import pickups from '@/libs/constant/pickup.js'
import settlements from '@/libs/constant/settlement.js'
import { invoiceList } from '@/libs/constant/orderCreate.js'
import { mapGetters, mapActions } from 'vuex'
import BasePage from '@/basic/BasePage'
import BaseComponent from '@/basic/BaseComponent'
import FontIcon from '@/components/FontIcon'
import Title from './components/Title.vue'
import SelectInput from '@/components/SelectInput.vue'
import TagNumberInput from '@/components/TagNumberInput'
import float from '@/libs/js/float'
import OrderPrint from '@/views/order/management/components/OrderPrint'
import Cargo from './libs/cargo'
import CargoTable from './components/CargoTable.vue'
import TimeInput from './components/TimeInput.vue'
import CitySelect from '@/components/SelectInputForCity'
import AreaInput from '@/components/AreaInput.vue'
import TMSURL from '@/libs/constant/url'
import { formatePhone } from '@/libs/js/formate'
import { roundFee, multiplyFeeOrNull, divideFeeOrNull, multiplyMileageOrNull, divideMileage } from '@/libs/js/config'
const rate = {
  set (value) {
    return value ? float.floor(value / 100, 4) : value
  },
  get (value) {
    return value ? float.round(value * 100, 2) : value === 0 ? value : null
  }
}
const transferFeeList = ['freightFee', 'pickupFee', 'loadFee', 'unloadFee', 'insuranceFee', 'otherFee', 'collectionMoney']
export default {
  name: 'order-create',
  metaInfo: {
    title: '手动开单'
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
      // const valids = value && stDate && edDate && edTime
      const start = stDate && value ? stDate.setHours(value.substr(0, 2), value.substr(3, 2)) : null
      const end = edDate && edTime ? edDate.setHours(edTime.substr(0, 2), edTime.substr(3, 2)) : null
      if (start && end && start > end) {
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
      const start = stDate && stTime ? stDate.setHours(stTime.substr(0, 2), stTime.substr(3, 2)) : null
      const end = edDate && value ? edDate.setHours(value.substr(0, 2), value.substr(3, 2)) : null
      if (start && end && start > end) {
        callback(new Error('到货时间需晚于发货时间'))
      } else {
        callback()
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
    const rate = (rule, value, callback) => {
      if ((value && validator.fee(value) && value <= 100) || !value) {
        callback()
      } else {
        callback(new Error('税率在0-100之间,小数2位'))
      }
    }
    return {
      settlements,
      pickups, // 提货方式
      invoiceList,
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
        customerWaybillNo: '',
        salesmanId: '',
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
        consignerHourseNumber: '',
        // 经度
        consignerAddressLongitude: '',
        // 纬度
        consignerAddressLatitude: '',
        consignerAddressMapType: 1,
        // 收货人
        consigneeContact: '',
        consigneePhone: '',
        consigneeAddress: '',
        consigneeHourseNumber: '',
        // 经纬度
        consigneeAddressLongitude: '',
        consigneeAddressLatitude: '',
        consigneeAddressMapType: 1,
        consigneeCompanyName: '',
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
        // 提货方式 未设置提货配置默认2：上门提货，2：直接送货
        pickup: null,
        // 回单数量
        receiptCount: 1,
        collectionMoney: null,
        isInvoice: 0,
        invoiceRate: null,
        // 备注
        remark: '',
        isSaveOrderTemplate: 0,
        status: '', // 编辑时 status = 20 pickUp = 1时 不可编辑
        chargeRule: null // （V1.11新增）计费规则区间
      },
      orderPrint: [],
      rules: {
        consignerName: [
          { required: true, message: '请输入客户名称' }
        ],
        start: [
          { required: false, message: '请输入始发城市' }
        ],
        end: [
          { required: false, message: '请输入目的城市' }
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
          { required: true, message: '请输入正确的手机号或座机号' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        consigneeContact: [
          { required: true, message: '请输入收货人名称' }
        ],
        consigneePhone: [
          { required: true, message: '请输入正确的手机号或座机号' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        consignerAddress: [
          { required: true, message: '请输入发货地址' }
        ],
        consignerHourseNumber: [
          { required: false, message: '请输入' }
        ],
        consigneeAddress: [
          { required: true, message: '请输入收货地址' }
        ],
        consigneeHourseNumber: [
          { required: false, message: '请输入' }
        ],
        settlementType: [
          { required: true, message: '请选择付款方式' }
        ],
        // 运输费
        freightFee: [
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
        invoiceRate: [
          { required: true, message: '请填写开票税率' },
          { validator: rate }
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
      },
      salesmanList: [],
      highLight: false,
      disabledPickUp: false
    }
  },
  computed: {
    ...mapGetters([
      'clients',
      'consignerAddresses',
      'consigneeContacts',
      'consigneePhones',
      'consigneeAddresses',
      'cargoes',
      'cargoOptions',
      'OrderSet'
    ]),
    totalFee () {
      const feeList = ['freightFee', 'pickupFee', 'loadFee', 'unloadFee', 'insuranceFee', 'otherFee']
      const orderForm = this.orderForm
      let totalFee = 0
      for (let fee of feeList) {
        if (orderForm[fee]) {
          totalFee = roundFee(totalFee + orderForm[fee])
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
    orderId () {
      return this.$route.query.id
    },
    createId () {
      return this.$route.query.createId
    },
    isSaveOrderTemplate: {
      set (value) {
        this.orderForm.isSaveOrderTemplate = value === true ? 1 : 0
      },
      get () {
        return this.orderForm.isSaveOrderTemplate === 1
      }
    },
    invoiceFee () {
      const res = this.totalFee && this.orderForm.invoiceRate ? roundFee(this.totalFee * this.orderForm.invoiceRate / 100) : 0
      return res
    }
  },
  created () {
    if (!this.orderId || !this.createId) {
      this.autoFocus = true
    } else {
      this.getClients()
    }
  },
  mounted () {
    const vm = this
    // 编辑订单
    if (this.orderId) {
      this.editDetail(this.orderId)
    }
    // 再来一单
    if (this.createId) {
      this.initCreateDetail(this.createId)
    }
    // focus到结算方式和提货方式等下拉框时要弹出下拉框
    ['pickupSelector', 'settlementSelector'].forEach((selector) => {
      if (vm.$refs[selector]) {
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
      }
    })
    this.initBusineList()
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
      'clearClients'
    ]),
    editDetail (orderId) {
      const vm = this
      vm.loading = true
      api.getOrderDetail(orderId)
        .then((orderDetail) => {
          vm.loading = false
          for (let key in vm.orderForm) {
            vm.orderForm[key] = orderDetail[key]
          }
          this.consignerCargoes = orderDetail.orderCargoList.map((item) => new Cargo(item, true))
          // 加上id
          vm.orderForm.id = orderDetail.id
          // 分转换元
          transferFeeList.forEach((fee) => {
            // vm.orderForm[fee] = vm.orderForm[fee] ? vm.orderForm[fee] / 100 : 0
            vm.orderForm[fee] = divideFeeOrNull(vm.orderForm[fee])
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
          // vm.orderForm.mileage = vm.orderForm.mileage ? vm.orderForm.mileage / 1000 : 0
          vm.orderForm.mileage = divideMileage(vm.orderForm.mileage)
          vm.orderForm.invoiceRate = rate.get(vm.orderForm.invoiceRate)
          vm.orderForm.disabledPickUp = !!(orderDetail.status === 20 && orderDetail.pickup === 1 && vm.orderId)
        })
        .catch((errorInfo) => {
          vm.loading = false
        })
    },
    initCreateDetail (createId) {
      const vm = this
      vm.loading = true
      api.getReCreateDeatil(createId).then(orderDetail => {
        vm.loading = false
        for (let key in vm.orderForm) {
          vm.orderForm[key] = orderDetail[key] || vm.orderForm[key]
        }
        this.consignerCargoes = orderDetail.orderCargoTemplateList.map((item) => new Cargo(item, true))
        // 分转换元
        transferFeeList.forEach((fee) => {
          // vm.orderForm[fee] = vm.orderForm[fee] ? vm.orderForm[fee] / 100 : 0
          vm.orderForm[fee] = divideFeeOrNull(vm.orderForm[fee])
        })
        vm.orderForm.deliveryTime = ''
        vm.orderForm.arriveTime = ''
        // 里程除以 1000
        vm.orderForm.mileage = divideMileage(vm.orderForm.mileage)
        // vm.orderForm.mileage = vm.orderForm.mileage ? vm.orderForm.mileage / 1000 : 0
        vm.orderForm.invoiceRate = rate.get(vm.orderForm.invoiceRate)
      })
    },
    initBusineList () {
      this.loading = true
      api.getBusineList().then(res => {
        this.loading = false
        this.salesmanList = res.data
      })
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
       */
      _this.$refs.orderForm.resetFields()
      // 设置编号，计费规则需要
      _this.getConsignerDetail(row.id).then((response) => {
        const { consigneeList: consignees, addressList: addresses, cargoList, ...consigner } = response.data
        // 设置发货人信息，发货联系人，手机，发货地址
        _this.orderForm.consignerName = response.data.name
        _this.orderForm.consignerContact = consigner.contact
        _this.orderForm.consignerPhone = consigner.phone
        if (addresses.length > 0) {
          _this.orderForm.consignerAddress = addresses[0].address
          _this.orderForm.start = addresses[0].cityCode
          _this.orderForm.consignerAddressLongitude = addresses[0].longitude
          _this.orderForm.consignerAddressLatitude = addresses[0].latitude
          _this.orderForm.consignerHourseNumber = addresses[0].consignerHourseNumber
        }
        if (consignees.length > 0) {
          // 设置收货人信息，收货人，手机，收货地址
          _this.orderForm.consigneeContact = consignees[0].contact
          _this.orderForm.consigneePhone = consignees[0].phone
          _this.orderForm.consigneeAddress = consignees[0].address
          _this.orderForm.end = consignees[0].cityCode
          _this.orderForm.consigneeAddressLongitude = consignees[0].longitude
          _this.orderForm.consigneeAddressLatitude = consignees[0].latitude
          _this.orderForm.consigneeHourseNumber = consignees[0].consignerHourseNumber
          _this.orderForm.consigneeCompanyName = consignees[0].consigneeCompanyName
        }
        // 计费里程
        _this.distanceCp()
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
            cargoList[0].weight = Number(cargoList[0].weight)
            cargoList[0].volume = Number(cargoList[0].volume)
            _this.consignerCargoes = [new Cargo(cargoList[0], true)]
          }
        }
        _this.orderForm.pickup = consigner.pickUp
        _this.orderForm.salesmanId = consigner.salesmanId
        _this.orderForm.isInvoice = consigner.isInvoice
        _this.orderForm.invoiceRate = rate.get(consigner.invoiceRate)
      })
    },
    /**
     * 选中收货人，联系号码一起设置
     */
    handleSelectConsignee (name, row) {
      this.orderForm.consigneePhone = row.phone
      this.orderForm.end = row.cityCode
      this.orderForm.consigneeAddress = row.address
      this.orderForm.consigneeAddressLatitude = row.latitude
      this.orderForm.consigneeAddressLongitude = row.longitude
      this.orderForm.consigneeHourseNumber = row.consignerHourseNumber
      this.orderForm.consigneeCompanyName = row.consigneeCompanyName
      // 计费里程
      this.distanceCp()
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
      this.openDialog({
        name: 'dialogs/financeRule',
        data: {
          start: vm.orderForm.start, // 始发城市
          end: vm.orderForm.end, // 目的城市
          partnerId: clientId, // 客户编号
          partnerName: vm.orderForm.consignerName, // 客户名
          partnerType: 1, // 计算规则分类：1-发货方，2-承运商，3-外转方
          cargoInfos: statics.cargoInfos,
          weight: statics.weight,
          volume: statics.volume,
          // distance: this.orderForm.mileage ? parseInt(this.orderForm.mileage * 1000) : 0,
          distance: multiplyMileageOrNull(this.orderForm.mileage),
          startPoint: { lat: this.orderForm.consignerAddressLatitude, lng: this.orderForm.consignerAddressLongitude },
          endPoint: { lat: this.orderForm.consigneeAddressLatitude, lng: this.orderForm.consigneeAddressLongitude },
          source: 'order' // 计费规则来自订单
        },
        methods: {
          ok (value, chargeRule) {
            vm.orderForm.freightFee = value || 0
            vm.orderForm.chargeRule = chargeRule
          }
        }
      })
    },
    // 提交表单
    handleSubmit (e) {
      return new Promise((resolve, reject) => {
        this.validPermit()
          .then(form => {
            return api.submitOrder(form)
          }).then(res => {
            this.refreshForm(e)
            resolve(res.data.data)
          }).catch(err => {
            this.disabled = false
            reject(err)
          })
      })
    },
    refreshForm (e) {
      const form = this.orderForm
      if (!form.id) {
        this.$Message.success('创建订单成功')
      } else {
        this.$Message.success('修改订单成功')
      }
      if (e && !form.id) {
        // 保存不打印，创建订单
        this.resetForm()
      }
      this.disabled = false
      if (e && form.id) {
        // 保存，不打印，修改页面
        this.closeTab()
      }
      // 重新获取客户列表
      this.getClients()
    },
    // 清空重置表单
    resetForm () {
      this.highLight = false
      this.orderForm.consignerAddressLongitude = ''
      this.orderForm.consignerAddressLatitude = ''
      this.orderForm.consigneeAddressLongitude = ''
      this.orderForm.consigneeAddressLatitude = ''
      this.orderForm.chargeRule = null // 重置计费规则命中区间
      this.isSaveOrderTemplate = false

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
      this.handleSubmit()
        .then(orderId => {
          return api.getPrintDetail([orderId])
        })
        .then(res => {
          this.orderPrint = res.data.data

          this.$refs.printer.print()
          if (!this.orderPrint.id) {
            // 创建订单页面
            this.resetForm()
          } else {
            this.closeTab()
          }
        }).catch(() => {
        })
    },
    dateChange (type, date) {
      const refs = type === 'START_DATE' ? 'stTimeInput' : type === 'END_DATE' ? 'edTimeInput' : ''
      if (date && refs) {
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
    citySelect (type, lat, lng, cityCode) {
      if (type === 1) {
        this.orderForm.consignerAddressLongitude = lng
        this.orderForm.consignerAddressLatitude = lat
        if (!this.orderForm.start) {
          this.orderForm.start = cityCode
        }
      } else if (type === 2) {
        this.orderForm.consigneeAddressLongitude = lng
        this.orderForm.consigneeAddressLatitude = lat
        if (!this.orderForm.end) {
          this.orderForm.end = cityCode
        }
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
      // { lng: 43.4907612, lat: 87.6334585 }
      // { lng: 43.4812632, lat: 87.5605997 }
      distance(p1, p2).then(res => {
        if (res) {
          const num = float.floor(res / 1000, 1)
          this.orderForm.mileage = Number(num)
        }
      }).catch(() => {
      })
    },
    // 立即发运
    shipImmedite (e = 'orderCreate') {
      const self = this
      const statics = this.$refs.cargoTable.statics
      this.validPermit()
        .then(form => {
          this.disabled = false
          if (form.pickup === 1) {
            // 小车上门 提货权限
            api.validPermit(form).then(({ permit }) => {
              if (permit) {
                this.openDialog({
                  name: 'transport/dialog/action',
                  data: {
                    type: 'pickUp',
                    actionOrigin: 'orderCreate',
                    orderCreate: {
                      distance: form.mileage,
                      weight: statics.weight,
                      volume: statics.volume,
                      cargoInfos: statics.cargoInfos,
                      start: form.start,
                      end: form.end
                    }
                  },
                  methods: {
                    complete (data) {
                      const param = {
                        createOrder: form,
                        createLoadbill: {},
                        loadbillPickup: data
                      }
                      api.immediShip(param).then(res => {
                        this.$Message.success('提货成功')
                        self.resetForm()
                        // 重新获取客户列表
                        self.getClients()
                      })
                    }
                  }
                })
              } else {
                this.openDialog({
                  name: 'order/create/components/OrderTip',
                  data: {
                    tipMsg: '提货管理'
                  }
                })
              }
            })
          } else if (form.pickup === 2) {
            // 大车直送 派车权限
            api.validPermit(form).then(({ permit }) => {
              if (permit) {
                this.openDialog({
                  name: 'transport/dialog/action',
                  data: {
                    type: 'sendCar',
                    actionOrigin: 'orderCreate',
                    orderCreate: {
                      distance: form.mileage,
                      weight: statics.weight,
                      volume: statics.volume,
                      cargoInfos: statics.cargoInfos,
                      start: form.start,
                      end: form.end
                    }
                  },
                  methods: {
                    complete (data) {
                      const param = {
                        createOrder: form,
                        createWaybill: {},
                        waybillAssignVehicle: data
                      }
                      param.waybillAssignVehicle.cashBack = param.waybillAssignVehicle.cashBack || null
                      api.immediShip(param).then(res => {
                        this.$Message.success('发运成功')
                        self.resetForm()
                        // 重新获取客户列表
                        self.getClients()
                      })
                    }
                  }
                })
              } else {
                this.openDialog({
                  name: 'order/create/components/OrderTip',
                  data: {
                    tipMsg: '送货管理'
                  }
                })
              }
            })
          }
        }).catch(() => {
        })
    },
    validateForm () {
      const vm = this
      vm.disabled = true
      vm.highLight = false
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
              return reject(new Error(findError.message))
            }
            // 始发城市，目的城市，到达时间等需要额外处理
            let form = Object.assign({}, orderForm, {
              arriveTime: !orderForm.arriveTime ? null : orderForm.arriveTime.Format('yyyy-MM-dd hh:mm'),
              deliveryTime: !orderForm.deliveryTime ? null : orderForm.deliveryTime.Format('yyyy-MM-dd hh:mm'),
              orderCargoList: orderCargoList.map(cargo => cargo.toJson()),
              // mileage: orderForm.mileage * 1000,
              mileage: multiplyMileageOrNull(orderForm.mileage),
              consignerPhone: orderForm.consignerPhone.replace(/\s/g, ''),
              consigneePhone: orderForm.consigneePhone.replace(/\s/g, ''),
              invoiceRate: orderForm.isInvoice === 1 ? rate.set(orderForm.invoiceRate) : null
            })
            // 转换成分单位
            transferFeeList.forEach((fee) => {
              // form[fee] = form[fee] ? float.round(form[fee] * 100) : 0
              form[fee] = multiplyFeeOrNull(form[fee])
            })
            // 没有业务员 置空
            const res = this.salesmanList.some(el => {
              return el.id === form.salesmanId
            })
            if (!res) form.salesmanId = ''
            // 未设置提货时 提货方式默认2
            if (this.OrderSet.pickupOption !== 1 && !form.pickup) {
              form.pickup = 2
            }
            resolve(form)
          } else {
            vm.disabled = false
            // 主动滚动到顶部
            // if (vm.orderForm.pickup) {
            //   vm.$parent.$el.scrollTop = 0
            // }
            vm.$Message.error('请填写必填信息')
            reject(new Error('请填写必填信息'))
          }
        })
      })
    },
    validPermit () {
      return new Promise((resolve, reject) => {
        this.validateForm().then(form => {
          return form.salesmanId ? api.validPermit(form, form.salesmanId) : { form, permit: true }
        }).then(({ form, permit }) => {
          if (!permit) {
            const errMsg = form.pickup === 1 ? '选择的业务员，没有提货调度或送货调度权限，不可上门提货'
              : form.pickup === 2 ? '选择的业务员，没有送货调度权限，不可直送客户' : '权限错误'
            this.$Message.error(errMsg)
            this.disabled = false
            this.highLight = true
            return reject(errMsg)
          }
          resolve(form)
        }).catch(err => {
          reject(err)
        })
      })
    },
    formatePhoneNum (temp) {
      return formatePhone(temp)
    },
    phoneLength (value) {
      return /^1/.test(value) ? 13 : this.$fieldLength.telephone
    },
    setHandle () {
      this.openTab({
        path: TMSURL.SETTING,
        title: '设置',
        query: {
          tab: 'order'
        }
      })
    },
    // 是否包含省市
    hasCity (val, cityName) {
      return val.indexOf(cityName) === 0 || val.indexOf('省') > -1 || val.indexOf('市') > -1
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.createId) {
        vm.initCreateDetail(vm.createId)
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.order-create
  &__input-unit
    text-align center
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
  color #999
</style>
