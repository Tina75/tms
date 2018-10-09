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
        <DatePicker v-model="orderForm.arriveTime" :time-picker-options="{steps: [1, 60, 60]}" format="yyyy-MM-dd HH:mm前" type="datetime" style="width:100%"></DatePicker>
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
        <Input v-model="orderForm.consignerPhone" :maxlength="11" type="mobile"></Input>
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
    <Table :columns="goodsColumn" :data="consignerCargoes" :disabled-hover="true" :highlight-row="false" stripe>
      <div slot="footer">
        <tr class="ivu-table-row">
          <td>
            <div class="ivu-table-cell">
              合计
            </div>
          </td>
          <td>
            <div class="ivu-table-cell">总重量：{{statics.weight}}吨</div>
          </td>
          <td>
            <div class="ivu-table-cell">总体积：{{statics.volume}}方</div>
          </td>
          <td>
            <div class="ivu-table-cell">总货值：{{statics.cargoCost}}元</div>
          </td>
          <td>
            <div class="ivu-table-cell">总数量：{{statics.quantity}}</div>
          </td>
        </tr>
      </div>
    </Table>
    <Title class="i-mb-15 i-mt-15">应收费用</Title>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="结算方式:" prop="settlementType">
        <Select v-model="orderForm.settlementType">
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
        <Select v-model="orderForm.pickup">
          <!-- <Option value="1">上门提货</Option>
          <Option value="2">直接送货</Option> -->
          <Option v-for="opt in pickups" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="回单数量:" prop="receiptCount">
        <InputNumber v-model="orderForm.receiptCount" :min="1" :parser="value => parseInt(value).toString()" class="order-create__input-w100">
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
import Title from './Title.vue'
import SelectInput from '@/components/SelectInput.vue'
import TagNumberInput from './TagNumberInput'
import { mapGetters, mapActions } from 'vuex'
import float from '@/libs/js/float'
import BaseComponent from '@/basic/BaseComponent'
import BasePage from '@/basic/BasePage'
import OrderPrint from './OrderPrint'
import AreaSelect, { getCodeFromList, specialCity } from '@/components/AreaSelect'
import FontIcon from '@/components/FontIcon'
import _ from 'lodash'
import settlements from '@/libs/constant/settlement.js'
import pickups from '@/libs/constant/pickup.js'
import Cargo from './libs/cargo'

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
    FontIcon
  },
  mixins: [BaseComponent, BasePage],
  data () {
    const _this = this
    const validateArriveTime = (rule, value, callback) => {
      if (_this.orderForm.deliveryTime && value && value.valueOf() <= _this.orderForm.deliveryTime.valueOf()) {
        callback(new Error('到货时间需晚于发货时间'))
      } else {
        callback()
      }
    }
    const setObject = (params, value) => {
      return { index: params.index, name: params.column.key, value }
    }
    const validatePhone = (rule, value, callback) => {
      if (/1[0-9]{10}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }

    const validateArea = (value) => {
      if (value.length === 1 && !specialCity.includes(value[0])) {
        return false
      }
      return true
    }
    const validateStart = (rule, value, callback) => {
      if (!validateArea(value)) {
        callback(new Error('请至少选择到市一级城市'))
      } else if (_this.orderForm.end.length > 0 && value.length > 0 && _.isEqual(_this.orderForm.end, value)) {
        callback(new Error('始发城市不能和目的城市相同'))
      } else {
        callback()
      }
    }
    const validateEnd = (rule, value, callback) => {
      if (!validateArea(value)) {
        callback(new Error('请至少选择到市一级城市'))
      } else if (_this.orderForm.start.length > 0 && value.length > 0 && _.isEqual(_this.orderForm.start, value)) {
        callback(new Error('目的城市不能和始发城市相同'))
      } else {
        callback()
      }
    }
    return {
      settlements,
      pickups, // 提货方式
      autoFocus: false, // 客户信息输入框自动焦点focus
      loading: false, // 查询订单详情加载状态
      disabled: false, // 保存按钮
      goodsColumn: [
        {
          title: ' ',
          key: 'index',
          width: 90,
          render: (h, params) => {
            return h('a', { props: { href: 'javascript:;' } }, [
              h('Icon', {
                props: {
                  type: 'ios-add-circle',
                  size: '24',
                  color: '#7ED321'
                },
                on: {
                  click: () => {
                    // 先同步本地，再添加新的
                    _this.syncStoreCargoes()
                    _this.appendCargo(params.index)
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'ios-remove-circle',
                  size: '24',
                  color: '#EC4E4E'
                },
                on: {
                  click: () => {
                    // 先删除状态数据
                    _this.updateLocalCargo(params, 'remove')
                    // 再把剩余的同步给vuex
                    _this.syncStoreCargoes()
                    _this.removeCargo(params.index)
                  }
                }
              })
            ])
          }
        },
        {
          title: '货物名称',
          key: 'cargoName',
          width: 170,
          renderHeader: (h, params) => {
            return h('span', [
              h('span', { class: 'van-c-red' }, '*'),
              h('span', params.column.title)
            ])
          },
          render (h, params) {
            return h(SelectInput, {
              props: {
                value: params.row[params.column.key] || '',
                remote: false,
                localOptions: _this.cargoOptions,
                transfer: true,
                maxlength: 10
              },
              on: {
                'on-blur': (value) => {
                  _this.updateLocalCargo(setObject(params, value))
                },
                'on-select': (name, cargoItem) => {
                  _this.selectCargo(params, cargoItem)
                }
              }
            })
          }
        },
        {
          title: '重量（吨）',
          key: 'weight',
          renderHeader: (h, params) => {
            return h('span', [
              h('span', { class: 'van-c-red' }, '*'),
              h('span', params.column.title),
              h('Tooltip', {
                attrs: {
                  id: 'order-create__weight-tooltip'
                },
                props: {
                  'max-width': '200',
                  content: '为了方便您计算价格，重量和体积必须填写一项',
                  placement: 'top-start',
                  transfer: true
                }
              }, [
                h('Icon', {
                  props: {
                    type: 'ios-information-circle',
                    size: '16',
                    color: '#FFBB44'
                  }
                })
              ])
            ])
          },
          render (h, params) {
            return h('InputNumber', {
              props: {
                value: params.row[params.column.key] || null,
                min: 0,
                parser: _this.handleParseFloat
              },
              on: {
                'on-change': (value) => {
                  // console.log('params.value', params.value)
                  // console.log('value', value)
                  if (params.value !== value) {
                    params.value = value
                    _this.updateLocalCargo(setObject(params, float.floor(params.value)))
                  }
                }
              }
            })
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          renderHeader (h, params) {
            return h('span', [
              h('span', { class: 'van-c-red' }, '*'),
              h('span', params.column.title)
            ])
          },
          render (h, params) {
            return h('InputNumber', {
              props: {
                value: params.row[params.column.key] || null,
                min: 0,
                parser: (value) => {
                  return float.floor(value, 1).toString()
                }
              },
              on: {
                'on-change': (value) => {
                  if (params.value !== value) {
                    params.value = value
                    _this.updateLocalCargo(setObject(params, float.floor(params.value, 1)))
                  }
                }
              }
            })
          }
        },
        {
          title: '货值（元）',
          key: 'cargoCost',
          render (h, params) {
            return h('InputNumber', {
              props: {
                value: params.row[params.column.key] || null,
                min: 0,
                parser: _this.handleParseFloat
              },
              on: {
                'on-change': (value) => {
                  if (params.value !== value) {
                    params.value = value
                    _this.updateLocalCargo(setObject(params, float.floor(params.value || 0)))
                  }
                }
              }
            })
          }
        },
        {
          title: '数量',
          key: 'quantity',
          render (h, params) {
            return h('InputNumber', {
              props: {
                value: params.row[params.column.key] || null,
                min: 1,
                parser: (value) => parseInt(value).toString()
              },
              on: {
                'on-focus': () => {
                  params.focus = true
                },
                'on-change': (value) => {
                  if (params.value !== value) {
                    params.value = value
                    if (!params.focus) {
                      _this.updateLocalCargo(setObject(params, parseInt(params.value || 1)))
                      _this.syncUpdateCargoProps(params)
                    }
                  }
                },
                'on-blur': () => {
                  params.focus = false
                  if (params.value) {
                    _this.updateLocalCargo(setObject(params, parseInt(params.value || 1)))
                    _this.syncUpdateCargoProps(params)
                  }
                }
              }
            })
          }
        },
        {
          title: '包装',
          key: 'unit',
          render (h, params) {
            return h('Input', {
              props: {
                value: params.row[params.column.key] || '',
                maxlength: 10
              },
              on: {
                'on-blur': (e) => {
                  _this.updateLocalCargo(setObject(params, e.target.value))
                }
              }
            })
          }
        },
        {
          title: '备注1',
          key: 'remark1',
          render (h, params) {
            return h('Input', {
              props: {
                value: params.row[params.column.key] || '',
                maxlength: 100
              },
              on: {
                'on-blur': (e) => {
                  _this.updateLocalCargo(setObject(params, e.target.value))
                }
              }
            })
          }
        },
        {
          title: '备注2',
          key: 'remark2',
          render (h, params) {
            return h('Input', {
              props: {
                value: params.row[params.column.key] || '',
                maxlength: 100
              },
              on: {
                'on-blur': (e) => {
                  _this.updateLocalCargo(setObject(params, e.target.value))
                }
              }
            })
          }
        }
      ],
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
        pickup: 1, // 默认上门提货，2：直接送货
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
          { validator: validateStart, trigger: 'change' }
        ],
        end: [
          { required: true, type: 'array', message: '请选择目的城市' },
          { validator: validateEnd }
        ],
        arriveTime: [
          { validator: validateArriveTime, trigger: 'blur' }
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
      tempCargoes: {},
      statics: {
        weight: 0,
        volume: 0,
        cargoCost: 0,
        quantity: 0
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
      'cargoOptions',
      'consignerCargoes',
      'sumRow'
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
  },
  destroyed () {
    this.resetForm()
    this.clearClients()
    this.clearOrderDetail()
  },
  methods: {
    ...mapActions([
      'getClients',
      'getConsignerDetail',
      'appendCargo',
      'removeCargo',
      'updateCargo',
      'fullUpdateCargo',
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
        this.syncStoreCargoes()
        this.fullUpdateCargo({ index: params.index, cargo })
      }
    },
    /**
     * 先将表格里的更改，存储在当前组件的临时数据里
     * 1. 添加操作时，需同步
     * 2. 删除操作时，需同步
     * 3. 最后保存时需要同步
     * @param item {object} 当前列的参数，包含索引，row， column
     * @param type {string} update|remove，更改或删除
     */
    updateLocalCargo (item, type = 'update') {
      const sumFields = ['weight', 'volume', 'cargoCost', 'quantity']
      // index, name, value
      if (type === 'update') {
        if (!this.tempCargoes[item.index]) {
          this.tempCargoes[item.index] = {}
        }
        if (sumFields.indexOf(item.name) !== -1) {
          if (this.tempCargoes[item.index][item.name] || this.tempCargoes[item.index][item.name] === 0) {
            this.statics[item.name] = float.round(this.statics[item.name] - (this.tempCargoes[item.index][item.name] || 0) + item.value)
          } else {
            this.statics[item.name] = float.round(this.statics[item.name] - (this.consignerCargoes[item.index][item.name] || 0) + item.value)
          }
        }
        this.tempCargoes[item.index][item.name] = item.value
      } else if (type === 'remove') {
        this.tempCargoes[item.index] = null
        delete this.tempCargoes[item.index]
      }
    },
    /**
     * 当选中已维护货物的时候，更改数量时，需要同时修改重量、体积和货值等参数
     * @param params {index:number, column: object, row: object}
     */
    syncUpdateCargoProps (params) {
      // 是否输入了货物名称
      let cargoName
      if (this.tempCargoes[params.index] && this.tempCargoes[params.index].cargoName) {
        cargoName = this.tempCargoes[params.index].cargoName
      } else if (this.consignerCargoes[params.index].cargoName) {
        cargoName = this.consignerCargoes[params.index].cargoName
      }
      // 查找货物名称，是否是已维护的货物信息
      if (cargoName) {
        const matchCargo = this.cargoes.find((cargo) => cargo.cargoName === cargoName)
        // 匹配成功
        if (matchCargo) {
          let syncCargo = new Cargo(matchCargo);
          ['weight', 'volume', 'cargoCost'].forEach((key) => {
            // this.updateLocalCargo({
            //   name: key,
            //   index: params.index,
            //   value: params.value * matchCargo[key]
            // })
            syncCargo[key] = params.value * syncCargo[key]
          })
          syncCargo.quantity = params.value
          this.syncStoreCargoes()
          this.fullUpdateCargo({ index: params.index, cargo: syncCargo })
        }
      }
    },
    // 同步当前的修改数据到vuex的store
    syncStoreCargoes () {
      for (let index in this.tempCargoes) {
        this.updateCargo({ index, cargo: this.tempCargoes[index] })
      }
      // 同步完，释放掉
      this.tempCargoes = {}
    },
    // 选择客户dropdown的数据
    handleSelectConsigner (name, row) {
      const _this = this
      _this.resetForm()
      _this.getConsignerDetail(row.id).then((response) => {
        const { consigneeList: consignees, addressList: addresses, ...consigner } = response.data
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
      if (vm.statics.weight <= 0 || vm.statics.volume <= 0) {
        this.$Message.warning('请先填写货物必要信息')
        return
      }
      this.openDialog({
        name: 'dialogs/financeRule.vue',
        data: {
          start: getCodeFromList(vm.orderForm.start), // 始发城市
          end: getCodeFromList(vm.orderForm.end), // 目的城市
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
    /**
     * 获取最后一位code码
     * 特殊地区，选择了北京市北京市，取首位code码
     */
    // getCityCode (codes) {
    //   return specialCity.includes(codes[0]) && codes.length === 2 ? codes[0] : codes[codes.length - 1]
    // },
    // 提交表单
    handleSubmit (e) {
      const vm = this
      vm.syncStoreCargoes()
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
            }
            // 始发地遇到北京市等特殊直辖市，需要只保留第一级code
            let start = getCodeFromList(orderForm.start)
            let end = getCodeFromList(orderForm.end)
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
                resolve()
              })
              .catch((er) => {
                vm.disabled = false
                reject(er)
              })
          } else {
            vm.disabled = false
            this.$Message.error('请填写必填信息')
            reject(new Error('请填写必填信息'))
          }
        })
      })
    },
    // 清空重置表单
    resetForm () {
      this.$refs.orderForm.resetFields()
      this.clearCargoes()
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
