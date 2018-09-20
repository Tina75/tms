<template>
  <Form ref="orderForm" :label-width="80" :model="orderForm" :rules="rules">
    <Spin v-if="loading" fix></Spin>
    <Row :gutter="16">
      <Col span="12">
      <FormItem label="客户" prop="consignerName" required>
        <SelectInput
          v-model="orderForm.consignerName"
          :auto-focus="true"
          :maxlength="20"
          :remote="false"
          :local-options="clients"
          @on-focus.once="getClients"
          @on-select="handleSelectConsigner">
        </SelectInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="始发城市" prop="start">
        <AreaSelect v-model="orderForm.start" :deep="true"></AreaSelect>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="目的城市" prop="end">
        <AreaSelect v-model="orderForm.end" :deep="true" :adjustment="true"></AreaSelect>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="12">
      <FormItem label="客户订单号" prop="customerOrderNo">
        <Input v-model="orderForm.customerOrderNo" :maxlength="30" type="text"></Input>
      </FormItem>
      </Col>
      <Col span="6" prop="deliveryTime">
      <FormItem label="发货时间">
        <DatePicker v-model="orderForm.deliveryTime" :time-picker-options="{steps: [1, 60, 60]}" format="yyyy-MM-dd HH:mm前" type="datetime" style="width:100%"></DatePicker>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="到货时间" prop="arriveTime">
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
      <FormItem label="发货人" prop="consignerContact">
        <Input v-model="orderForm.consignerContact" :maxlength="15" type="text"></Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="手机号" prop="consignerPhone">
        <Input v-model="orderForm.consignerPhone" :maxlength="11" type="mobile"></Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="收货人" prop="consigneeContact">
        <SelectInput v-model="orderForm.consigneeContact" :maxlength="15" :local-options="consigneeContacts" :remote="false">
        </SelectInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="手机号" prop="consigneePhone">
        <SelectInput v-model="orderForm.consigneePhone" :maxlength="11" :local-options="consigneePhones" :remote="false"></SelectInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="12">
      <FormItem label="发货地址" prop="consignerAddress">
        <SelectInput v-model="orderForm.consignerAddress" :maxlength="60" :local-options="consignerAddresses" :remote="false"></SelectInput>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="收货地址" prop="consigneeAddress">
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
            <div class="ivu-table-cell">总货值：{{statics.cargoCost}}</div>
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
      <FormItem label="结算方式" prop="settlementType">
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
      <FormItem label="运输费用" prop="freightFee">
        <Row>
          <Col span="18">
          <TagNumberInput :min="0" v-model="orderForm.freightFee" :parser="handleParseFloat">
            <span slot="suffix" class="order-create__input-suffix">元</span>
          </TagNumberInput>
          </Col>
          <Col span="6">
          <span @click="showCounter">
            <FontIcon type="jisuanqi" size="20" color="#00a4bd" class="i-ml-5"></FontIcon>
          </span>
          </Col>
        </Row>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="装货费用" prop="loadFee">
        <TagNumberInput :min="0" v-model="orderForm.loadFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="卸货费用" prop="unloadFee">
        <TagNumberInput :min="0" v-model="orderForm.unloadFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="保险费用" prop="insuranceFee">
        <TagNumberInput :min="0" v-model="orderForm.insuranceFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="其他费用" prop="otherFee">
        <TagNumberInput :min="0" v-model="orderForm.otherFee" :parser="handleParseFloat">
          <span slot="suffix" class="order-create__input-suffix">元</span>
        </TagNumberInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="10">
      <FormItem label="费用合计">
        <span class="order-create__font-total">{{totalFee}}</span>元
      </FormItem>
      </Col>
    </Row>
    <Title>其他</Title>
    <Row :gutter="16" class="i-mt-15">
      <Col span="6">
      <FormItem label="提货方式" prop="pickup">
        <Select v-model="orderForm.pickup">
          <!-- <Option value="1">上门提货</Option>
          <Option value="2">直接送货</Option> -->
          <Option v-for="opt in pickups" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="回单数量" prop="receiptCount">
        <InputNumber v-model="orderForm.receiptCount" :min="1" :parser="value => parseInt(value).toString()" class="order-create__input-w100">
        </InputNumber>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="备注" prop="remark">
        <Input v-model="orderForm.remark" :maxlength="100" type="text">
          </Input>
      </FormItem>
      </Col>
    </Row>
    <FormItem class="van-center">
      <Button type="primary" @click="handleSubmit">保存</Button>
      <Button class="i-ml-10" @click="print">保存并打印</Button>
      <Button class="i-ml-10" @click="resetForm">清空</Button>
    </FormItem>
    <OrderPrint ref="printer" :data.sync="orderPrint">
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
import AreaSelect from '@/components/AreaSelect'
import areas from '@/libs/js/City'
import FontIcon from '@/components/FontIcon'
import _ from 'lodash'
import settlements from './constant/settlement.js'
import pickups from './constant/pickup.js'

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
      if (_this.orderForm.deliveryTime && value && value.valueOf() < _this.orderForm.deliveryTime.valueOf()) {
        callback(new Error('到货时间需小于发货时间'))
      } else {
        callback()
      }
    }
    const setObject = (params, value) => {
      return { index: params.index, name: params.column.key, value }
    }
    const validatePhone = (rule, value, callback) => {
      if (/(13[0-9]|15[0-9]|166|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{8}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    return {
      settlements,
      pickups,
      loading: false,
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
          title: '重量(吨)',
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
                  if (params.value !== value) {
                    params.value = value
                  }
                },
                'on-blur': () => {
                  if ('value' in params) {
                    _this.updateLocalCargo(setObject(params, float.floor(params.value)))
                  }
                }
              }
            })
          }
        },
        {
          title: '体积(方)',
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
                  }
                },
                'on-blur': () => {
                  if ('value' in params) {
                    _this.updateLocalCargo(setObject(params, float.floor(params.value, 1)))
                  }
                }
              }
            })
          }
        },
        {
          title: '货值(元)',
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
                  }
                },
                'on-blur': () => {
                  if ('value' in params) {
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
                'on-change': (value) => {
                  params.value = value
                },
                'on-blur': () => {
                  if ('value' in params) {
                    _this.updateLocalCargo(setObject(params, parseInt(params.value || 1)))
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
        receiptCount: null,
        // 备注
        remark1: '',
        remark2: ''
      },
      orderPrint: {},
      rules: {
        consignerName: [
          // { validator: validateConsignerName, trigger: 'blur' }
          { required: true, message: '请输入客户名称' }
        ],
        start: [
          { required: true, type: 'array', message: '请选择始发城市' }
        ],
        end: [
          { required: true, type: 'array', message: '请选择目的城市' }
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
          // 分转换元
          transferFeeList.forEach((fee) => {
            vm.orderForm[fee] = vm.orderForm[fee] ? vm.orderForm[fee] / 100 : 0
          })
          vm.orderForm.start = areas.getPathByCode(orderDetail.start).map((item) => item.code)
          vm.orderForm.end = areas.getPathByCode(orderDetail.end).map((item) => item.code)
          if (vm.orderForm.deliveryTime) {
            vm.orderForm.deliveryTime = new Date(vm.orderForm.deliveryTime)
          }
          if (vm.orderForm.arriveTime) {
            vm.orderForm.arriveTime = new Date(vm.orderForm.arriveTime)
          }
        })
    }
  },
  destroyed () {
    this.resetForm()
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
          if (this.tempCargoes[item.index][item.name]) {
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
      })
    },
    // 显示计费规则
    showCounter () {
      const vm = this
      this.openDialog({
        name: 'order/create/CounterDialog.vue',
        data: {
          value: 0
        },
        methods: {
          ok (value) {
            vm.orderForm.freightFee = value || 0
          }
        }
      })
    },
    // 提交表单
    handleSubmit () {
      console.log('orderForm', this.orderForm)
      const vm = this
      this.syncStoreCargoes()
      this.$refs.orderForm.validate((valid) => {
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
            return
          }
          // 始发城市，目的城市，到达时间等需要额外处理
          let form = Object.assign({}, orderForm, {
            start: orderForm.start[orderForm.start.length - 1],
            end: orderForm.end[orderForm.end.length - 1],
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
              vm.resetForm()
              this.$Message.success('创建订单成功')
            })
        } else {
          this.$Message.error('请填写必填信息')
        }
      })
    },
    // 清空重置表单
    resetForm () {
      this.$refs.orderForm.resetFields()
      this.clearCargoes()
    },
    print () {
      this.syncStoreCargoes()
      this.orderPrint = _.cloneDeep(this.orderForm)
      this.orderPrint.orderCargoList = _.cloneDeep(this.consignerCargoes)
      this.orderPrint.totalFee = this.totalFee
      this.$refs.printer.print()

      this.handleSubmit()
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
