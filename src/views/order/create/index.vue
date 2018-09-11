<template>
  <Form ref="orderForm" :label-width="80" :model="orderForm" :rules="rules">
    <Row :gutter="16">
      <Col span="12">
      <FormItem label="客户" prop="consignerName" required>
        <SelectInput
          v-model="orderForm.consignerName"
          :maxlength="20"
          :remote="true"
          :remote-method="fetchClients"
          @on-select="handleSelectConsigner">
        </SelectInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="始发城市" prop="start">
        <Cascader v-model="orderForm.start" :data="areaData" :render-format="formatArea" filterable></Cascader>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="目的城市" prop="end">
        <Cascader v-model="orderForm.end" :data="areaData" :render-format="formatArea" filterable></Cascader>
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
        <DatePicker v-model="orderForm.deliveryTime" :time-picker-options="{steps: [1, 60]}" format="yyyy-MM-dd HH:mm" type="datetime"></DatePicker>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="到货时间" prop="arriveTime">
        <DatePicker v-model="orderForm.arriveTime" :time-picker-options="{steps: [1, 60]}" format="yyyy-MM-dd HH:mm" type="datetime"></DatePicker>
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
        <Input v-model="orderForm.consignerPhone" type="text"></Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="收货人" prop="consigneeName">
        <SelectInput v-model="orderForm.consigneeName" :maxlength="15" :local-options="consigneeContacts" :remote="false">
        </SelectInput>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="手机号" prop="consigneePhone">
        <SelectInput v-model="orderForm.consigneePhone" :local-options="consigneePhones" :remote="false"></SelectInput>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="12">
      <FormItem label="发货地址" prop="consignerAddress">
        <SelectInput v-model="orderForm.consignerAddress" :maxlength="200" :local-options="consignerAddresses" :remote="false"></SelectInput>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="收货地址" prop="consigneeAddress">
        <SelectInput v-model="orderForm.consigneeAddress" :maxlength="200" :local-options="consigneeAddresses" :remote="false"></SelectInput>
      </FormItem>
      </Col>
    </Row>
    <Title>货物信息</Title>
    <Table :columns="goodsColumn" :data="cargoes" :disabled-hover="true" :highlight-row="false" stripe>
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
      <FormItem label="付款方式" prop="payType">
        <Select v-model="orderForm.payType">
          <Option>预付</Option>
          <Option>到付</Option>
          <Option>回付</Option>
          <Option>月结</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="运输费用" prop="freightFee">
        <Input v-model="orderForm.freightFee" type="number">
        <span slot="suffix" class="order-create__input-suffix">元</span>
        </Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="装货费用" prop="loadFee">
        <Input v-model="orderForm.loadFee" type="number">
        <span slot="suffix" class="order-create__input-suffix">元</span>
          </Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="卸货费用" prop="unloadFee">
        <Input v-model="orderForm.unloadFee" type="number">
        <span slot="suffix" class="order-create__input-suffix">元</span>
          </Input>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="6">
      <FormItem label="保险费用" prop="insuranceFee">
        <Input v-model="orderForm.insuranceFee" type="number">
        <span slot="suffix" class="order-create__input-suffix">元</span>
          </Input>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="其他费用" prop="otherFee">
        <Input v-model="orderForm.otherFee" type="number">
        <span slot="suffix" class="order-create__input-suffix">元</span>
          </Input>
      </FormItem>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="10">
      <FormItem label="费用合计">
        1232.23元
      </FormItem>
      </Col>
    </Row>
    <Title>其他</Title>
    <Row :gutter="16" class="i-mt-15">
      <Col span="6">
      <FormItem label="提货方式" prop="pickup">
        <Select v-model="orderForm.pickup">
          <Option>上门送货</Option>
          <Option>直接送货</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6">
      <FormItem label="回单数量" prop="receiptCount">
        <InputNumber v-model="orderForm.receiptCount" :min="1" class="order-create__input-w100">
        </InputNumber>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="备注" prop="remark">
        <Input v-model="orderForm.remark" :maxlength="60" type="text">
          </Input>
      </FormItem>
      </Col>
    </Row>
    <FormItem class="van-center">
      <Button @click="resetForm">清空</Button>
      <Button class="i-ml-10">保存并打印</Button>
      <Button class="i-ml-10" type="primary" @click="handleSubmit">保存</Button>
    </FormItem>
  </Form>
</template>

<script>
import Title from './Title.vue'
import SelectInput from './SelectInput.vue'
import { mapGetters, mapActions } from 'vuex'
import float from '@/libs/js/float'
import area from '@/libs/js/area'
import BaseComponent from '@/basic/BaseComponent'
export default {
  components: {
    Title,
    SelectInput
  },
  mixin: [BaseComponent],
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
    return {
      goodsColumn: [
        {
          title: ' ',
          key: 'index',
          render: (h, params) => {
            // if (params.row.key === 'sum') {
            //   return h('span', params.row.title)
            // }
            return h('a', { props: { href: 'javascript:;' } }, [
              h('Icon', {
                props: {
                  type: 'ios-add-circle',
                  size: '24',
                  color: '#7ED321'
                },
                on: {
                  click: () => {
                    console.log('add', params.index)
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
                    console.log('remove', params.index)
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
          render (h, params) {
            // if (params.row.key === 'sum') {
            //   return h('span', '')
            // }
            return h('Input', {
              props: {
                value: params.row[params.column.key] || ''
              },
              on: {
                'on-blur': (e) => {
                  // setValue(params, e.target.value)
                  // _this.updateCargo({index: params.index, name: params.column.key, value: e.target.value})
                  _this.updateLocalCargo(setObject(params, e.target.value))
                  // _this.updateCargo({index: params.index, cargo: {[params.column.key]: e.target.value}})
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
              h('span', params.column.title),
              h('Tooltip', {
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
            // if (params.row.key === 'sum') {
            //   return h('span', params.row.weight)
            // }
            return h('InputNumber', {
              props: {
                value: params.row[params.column.key] || null,
                min: 0
              },
              on: {
                'on-change': (value) => {
                  if (params.value !== value) {
                    params.value = value
                  }
                },
                'on-blur': () => {
                  if ('value' in params) {
                    // setValue(params, float.floor(params.value))
                    // setValue({index: params.index, name: params.column.key, value: float.floor(params.value)})
                    // _this.updateCargo({index: params.index, name: params.column.key, value: float.floor(params.value)})
                    _this.updateLocalCargo(setObject(params, float.floor(params.value)))
                    // _this.updateCargo({index: params.index, cargo: {[params.column.key]: float.floor(params.value)}})
                  }
                }
              }
            })
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          render (h, params) {
            // if (params.row.key === 'sum') {
            //   return h('span', params.row.volume)
            // }
            return h('InputNumber', {
              props: {
                value: params.row[params.column.key] || null,
                min: 0
              },
              on: {
                'on-change': (value) => {
                  if (params.value !== value) {
                    params.value = value
                  }
                },
                'on-blur': () => {
                  if ('value' in params) {
                    // setValue({index: params.index, name: params.column.key, value: float.floor(params.value, 1)})
                    _this.updateLocalCargo(setObject(params, float.floor(params.value, 1)))
                    // _this.updateCargo({index: params.index, cargo: {[params.column.key]: float.floor(params.value, 1)}})
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
            // if (params.row.key === 'sum') {
            //   return h('span', params.row.cargoCost)
            // }
            return h('InputNumber', {
              props: {
                value: params.row[params.column.key] || null,
                min: 0
              },
              on: {
                'on-change': (value) => {
                  if (params.value !== value) {
                    params.value = value
                  }
                },
                'on-blur': () => {
                  if ('value' in params) {
                    // setValue({index: params.index, name: params.column.key, value: parseInt(params.value || 0)})
                    _this.updateLocalCargo(setObject(params, parseInt(params.value || 0)))
                    // _this.updateCargo({index: params.index, cargo: {[params.column.key]: parseInt(params.value || 0)}})
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
            // if (params.row.key === 'sum') {
            //   return h('span', params.row.quantity)
            // }
            return h('InputNumber', {
              props: {
                value: params.row[params.column.key] || null,
                min: 1
              },
              on: {
                'on-change': (value) => {
                  params.value = value
                },
                'on-blur': () => {
                  if ('value' in params) {
                    // setValue({index: params.index, name: params.column.key, value: parseInt(params.value || 1)})
                    _this.updateLocalCargo(setObject(params, parseInt(params.value || 1)))
                    // _this.updateCargo({index: params.index, cargo: {[params.column.key]: parseInt(params.value || 1)}})
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
            // if (params.row.key === 'sum') {
            //   return h('span', '')
            // }
            return h('Input', {
              props: {
                value: params.row[params.column.key] || '',
                maxlength: 10
              },
              on: {
                'on-blur': (e) => {
                  // setValue({index: params.index, name: params.column.key, value: e.target.value})
                  _this.updateLocalCargo(setObject(params, e.target.value))
                  // _this.updateCargo({index: params.index, cargo: {[params.column.key]: e.target.value}})
                  // _this.updateCargo({index: params.index, name: params.column.key, value: e.target.value})
                }
              }
            })
          }
        },
        {
          title: '备注',
          key: 'remark',
          render (h, params) {
            // if (params.row.key === 'sum') {
            //   return h('span', '')
            // }
            return h('Input', {
              props: {
                value: params.row[params.column.key] || '',
                maxlength: 100
              },
              on: {
                'on-blur': (e) => {
                  // setValue({index: params.index, name: params.column.key, value: e.target.value})
                  _this.updateLocalCargo(setObject(params, e.target.value))
                  // _this.updateCargo({index: params.index, cargo: {[params.column.key]: e.target.value}})
                  // _this.updateCargo({index: params.index, name: params.column.key, value: e.target.value})
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
        consigneeName: '',
        consigneePhone: '',
        consigneeAddress: '',
        // 货品信息
        cargoList: [],
        // 付款方式
        payType: '',
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
        pickup: '',
        // 回单数量
        receiptCount: null,
        // 备注
        remark: ''
      },
      rules: {
        consignerName: [
          // { validator: validateConsignerName, trigger: 'blur' }
          { required: true, message: '请输入客户名称' }
        ],
        start: [
          { required: true, message: '请选择始发城市' }
        ],
        end: [
          { required: true, message: '请选择目的城市' }
        ],
        arriveTime: [
          { validator: validateArriveTime, trigger: 'blur' }
        ],
        consignerContact: [
          { required: true, message: '请输入发货人名称' }
        ],
        consignerPhone: [
          { required: true, message: '请输入发货人手机号' }
        ],
        consignerAddress: [
          { required: true, message: '请输入发货地址' }
        ],
        consigneeName: [
          { required: true, message: '请输入收货人名称' }
        ],
        consigneePhone: [
          { required: true, message: '请输入收货人手机号' }
        ],
        consigneeAddress: [
          { required: true, message: '请输入收货地址' }
        ],
        payType: [
          { required: true, message: '请选择付款方式' }
        ],
        freightFee: [
          { required: true, message: '请输入运输费用' }
        ],
        pickup: [
          { required: true, message: '请输入提货方式' }
        ],
        receiptCount: [
          { required: true, message: '请输入回单数量' }
        ]

      },
      consignerLoading: false,
      tempCargoes: {},
      areaData: area,
      statics: {
        weight: 0,
        volume: 0,
        cargoCost: 0,
        quantity: 0
      }
      // cargoes: [new Cargo()]
      // consigners: []
    }
  },
  computed: {
    ...mapGetters([
      'clients',
      'consignerContacts',
      'consignerPhones',
      'consignerAddresses',
      'consigneeContacts',
      'consigneePhones',
      'consigneeAddresses',
      'cargoes',
      'sumRow'
    ])
  },
  watch: {
    cargoes (newCargoes) {
      this.statics = Object.assign({}, this.sumRow)
    }
  },
  mounted () {
    this.statics = Object.assign({}, this.sumRow)
  },
  destroyed () {
    this.clearCargoes()
  },
  methods: {
    ...mapActions(['getClients', 'getConsignerDetail', 'appendCargo', 'removeCargo', 'updateCargo', 'clearCargoes']),
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
          this.tempCargoes[item.index] = {[item.name]: item.value}
          if (sumFields.indexOf(item.name) !== -1) {
            this.statics[item.name] = float.round(this.statics[item.name] - (this.cargoes[item.index][item.name] || 0) + item.value)
          }
        } else {
          if (sumFields.indexOf(item.name) !== -1) {
            this.statics[item.name] = float.round(this.statics[item.name] - (this.tempCargoes[item.index][item.name] || 0) + item.value)
          }
          this.tempCargoes[item.index][item.name] = item.value
        }
      } else if (type === 'remove') {
        this.tempCargoes[item.index] = null
        delete this.tempCargoes[item.index]
      }
    },
    // 同步当前的修改数据到vuex的store
    syncStoreCargoes () {
      for (let index in this.tempCargoes) {
        this.updateCargo({index, cargo: this.tempCargoes[index]})
      }
      // 同步完，释放掉
      this.tempCargoes = {}
    },
    // 选择客户dropdown的数据
    handleSelectConsigner (name, row) {
      const _this = this
      _this.getConsignerDetail(row.id).then((response) => {
        const { consigner, consigneeList: consignees, addressList: addresses } = response.data
        // 设置发货人信息，发货联系人，手机，发货地址
        _this.orderForm.consignerContact = consigner.contact
        _this.orderForm.consignerPhone = consigner.phone
        _this.orderForm.consignerAddress = addresses[0].address
        // 设置收货人信息，收货人，手机，收货地址
        _this.orderForm.consigneeName = consignees[0].contact
        _this.orderForm.consigneePhone = consignees[0].phone
        _this.orderForm.consigneeAddress = consignees[0].address
      })
    },
    handleSubmit () {
      console.log('orderForm', this.orderForm)
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          // TODO:s提交表单
        } else {
          this.$Message.error('valid', valid)
        }
      })
    },
    // 清空重置表单
    resetForm () {
      this.$refs.orderForm.resetFields()
    },
    fetchClients (query) {
      return this.getClients(query).then((reponse) => {
        return reponse
      })
    },
    formatArea (labels, selectedData) {
      return Object.values(labels).join('')
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
</style>
