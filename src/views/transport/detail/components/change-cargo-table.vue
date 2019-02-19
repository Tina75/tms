<template>
  <div>
    <div class="table-group">
      <div class="ivu-table-wrapper" style="width: 400px;">
        <table cellspacing="0" cellpadding="0" boder="0" class="ivu-table ivu-table-default">
          <colgroup>
            <col width="140">
            <col width="120">
            <col width="140">
          </colgroup>
          <tbody class="ivu-table-tbody">
            <tr class="ivu-table-row">
              <th class="ivu-table-cell">订单号</th>
              <th class="ivu-table-cell">客户订单号</th>
              <th class="ivu-table-cell">始发地-目的地</th>
            </tr>
            <tr v-for="(item, index) in orderList" :key="index">
              <td  :rowspan="item.cargoLength">
                <span v-if="item.orderNo.length < 19" class="table-cell-offset">{{ item.orderNo }}</span>
                <Tooltip v-else :content="item.orderNo" transfer placement="bottom">
                  <span class="table-cell-offset">{{ formatterString(item.orderNo, 18) }}</span>
                </Tooltip>
              </td>
              <td  :rowspan="item.cargoLength">
                <span v-if="item.customerOrderNo.length < 15" class="table-cell-offset">{{ item.customerOrderNo }}</span>
                <Tooltip v-else :content="item.customerOrderNo" transfer placement="bottom">
                  <span class="table-cell-offset">{{ formatterString(item.customerOrderNo, 14) }}</span>
                </Tooltip>
              </td>
              <td  :rowspan="item.cargoLength">
                <span v-if="item.startToEnd < 10" class="table-cell-offset">{{ item.startToEnd }}</span>
                <Tooltip v-else :content="item.startToEnd" transfer placement="bottom">
                  <span class="table-cell-offset">{{ formatterString(item.startToEnd, 9) }}</span>
                </Tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Table :columns="tableColumns" :data="cloneCargoList" class="table-cargo"></Table>
    </div>
    <div class="table-footer">
      <span class="table-footer-title">总计</span>
      <span>总货值：{{ orderTotal.cargoCost }}元</span>
      <span>总数量：{{ orderTotal.quantity }}</span>
      <span>总体积：{{ orderTotal.volume }}方</span>
      <span>总重量：{{ WeightOption === 1 ? orderTotal.weight + '吨' : orderTotal.weightKg + '公斤' }}</span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { NumberPrecesion, divideFeeOrNull, multiplyFeeOrNull, roundFee, roundWeight, roundWeightKg, roundVolume, divideFee } from '@/libs/js/config'
import SelectPackageType from '@/components/SelectPackageType'
import TagNumberInput from '@/components/TagNumberInput'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import { mapGetters } from 'vuex'
import Server from '@/libs/js/server'

export default {
  name: 'changeCargoTable',
  components: {
    SelectPackageType,
    TagNumberInput
  },
  mixins: [tableWeightColumnMixin],
  props: {
    // 传入的货物列表
    initCargoList: {
      type: Array
    }
  },
  data () {
    return {
      orderList: [],
      cargoList: [],
      cloneCargoList: [], // 克隆一份货物信息数据
      tableColumns: [
        {
          title: '货物名称',
          key: 'cargoName',
          width: 110,
          renderHeader: (h, p) => {
            return h('div', [
              h('span', p.column.title),
              h('span', {
                style: {
                  color: '#ed4014',
                  marginLeft: '3px'
                }
              }, '*')
            ])
          },
          render: (h, p) => {
            return h('Input', {
              props: {
                value: this.cargoList[p.index].cargoName,
                maxlength: this.$fieldLength.cargoName,
                disabled: this.returnCheckStatus(p) !== 1,
                clearable: this.returnCheckStatus(p) === 1
              },
              on: {
                'on-change': (e) => {
                  this.cargoList[p.index].cargoName = e.target.value
                }
              }
            })
          }
        },
        {
          title: '货物编号',
          key: 'cargoNo',
          width: 110,
          render: (h, p) => {
            return h('Input', {
              props: {
                value: this.cargoList[p.index].cargoNo,
                maxlength: this.$fieldLength.cargoNo,
                disabled: this.returnCheckStatus(p) !== 1,
                clearable: this.returnCheckStatus(p) === 1
              },
              on: {
                'on-change': (e) => {
                  this.cargoList[p.index].cargoNo = e.target.value
                }
              }
            })
          }
        },
        {
          title: '包装方式',
          key: 'unit',
          width: 110,
          render: (h, p) => {
            return h(SelectPackageType, {
              props: {
                value: this.cargoList[p.index].unit,
                disabled: this.returnCheckStatus(p) !== 1,
                maxlength: 10
              },
              on: {
                'on-change': (val) => {
                  this.cargoList[p.index].unit = val
                }
              }
            })
          }
        },
        {
          title: '包装数量',
          key: 'quantity',
          width: 110,
          render: (h, p) => {
            const z = this
            return h(TagNumberInput, {
              props: {
                value: z.cargoList[p.index].quantity,
                min: 1,
                precision: 0,
                disabled: this.returnCheckStatus(p) !== 1
              },
              on: {
                'on-change': (val) => {
                  z.cargoList[p.index].quantity = val
                  // 有货物id记录的需要按货物数量百分比修改,且已经有值的字段不允许清空或修改为0
                  if (p.row.cargoId) {
                    // 获取数量修改后的百分比
                    let percent = val / p.row.quantity
                    // 货值同比
                    if (p.row.cargoCost) {
                      z.cargoList[p.index].cargoCost = roundFee(p.row.cargoCost * percent)
                    }
                    // 重量同比
                    if (p.row.weight) {
                      z.cargoList[p.index].weight = roundWeight(p.row.weight * percent)
                      z.cargoList[p.index].weightKg = roundWeightKg(p.row.weightKg * percent)
                    }
                    // 体积同比
                    if (p.row.volume) {
                      z.cargoList[p.index].volume = roundVolume(p.row.volume * percent)
                    }

                    // 已经有值的字段不允许清空或修改为0
                    if (!val && p.row.quantity) {
                      z.$Message.warning('已经有值的字段不允许清空或修改为0')
                      // 重置回之前的原始数据
                      z.$nextTick(() => {
                        z.cargoList[p.index].quantity = p.row.quantity
                        z.cargoList[p.index].cargoCost = p.row.cargoCost
                        z.cargoList[p.index].weight = p.row.weight
                        z.cargoList[p.index].weightKg = p.row.weightKg
                        z.cargoList[p.index].volume = p.row.volume
                      })
                    }
                  }
                }
              }
            })
          }
        },
        {
          title: '货值(元)',
          key: 'cargoCost',
          width: 110,
          render: (h, p) => {
            const z = this
            return h(TagNumberInput, {
              props: {
                value: divideFeeOrNull(z.cargoList[p.index].cargoCost),
                min: 0,
                precision: NumberPrecesion.fee,
                disabled: this.returnCheckStatus(p) !== 1
              },
              on: {
                'on-change': (val) => {
                  z.cargoList[p.index].cargoCost = multiplyFeeOrNull(val)
                  // 有货物id记录的且已经有值的字段不允许清空或修改为0
                  z.resetCargoKey(p, val, 'cargoCost')
                }
              }
            })
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          width: 110,
          render: (h, p) => {
            const z = this
            return h(TagNumberInput, {
              props: {
                value: z.cargoList[p.index].volume,
                min: 0,
                precision: NumberPrecesion.volume,
                disabled: this.returnCheckStatus(p) !== 1
              },
              on: {
                'on-change': (val) => {
                  z.cargoList[p.index].volume = val
                  // 有货物id记录的且已经有值的字段不允许清空或修改为0
                  z.resetCargoKey(p, val, 'volume')
                }
              }
            })
          }
        },
        {
          title: '包装尺寸（毫米）',
          key: 'dimension',
          width: 180,
          render: (h, p) => {
            return h('div', [
              h(TagNumberInput, {
                props: {
                  value: this.cargoList[p.index].dimension.length,
                  min: 0,
                  length: 7,
                  showChinese: false,
                  placeholder: '长',
                  precision: NumberPrecesion.dimension,
                  disabled: this.returnCheckStatus(p) !== 1
                },
                style: {
                  'width': '31%',
                  'margin': '0 1%'
                },
                on: {
                  'on-change': (val) => {
                    this.cargoList[p.index].dimension.length = val
                    this.dimensionLinkVolume(p)
                  }
                }
              }),
              h(TagNumberInput, {
                props: {
                  value: this.cargoList[p.index].dimension.width,
                  min: 0,
                  length: 7,
                  showChinese: false,
                  placeholder: '宽',
                  precision: NumberPrecesion.dimension,
                  disabled: this.returnCheckStatus(p) !== 1
                },
                style: {
                  'width': '31%',
                  'margin': '0 1%'
                },
                on: {
                  'on-change': (val) => {
                    this.cargoList[p.index].dimension.width = val
                    this.dimensionLinkVolume(p)
                  }
                }
              }),
              h(TagNumberInput, {
                props: {
                  value: this.cargoList[p.index].dimension.height,
                  min: 0,
                  length: 7,
                  showChinese: false,
                  placeholder: '高',
                  precision: NumberPrecesion.dimension,
                  disabled: this.returnCheckStatus(p) !== 1
                },
                style: {
                  'width': '31%',
                  'margin': '0 1%'
                },
                on: {
                  'on-change': (val) => {
                    this.cargoList[p.index].dimension.height = val
                    this.dimensionLinkVolume(p)
                  }
                }
              })
            ])
          }
        },
        {
          title: '备注1',
          key: 'remark1',
          width: 95,
          render: (h, p) => {
            return h('Input', {
              props: {
                value: this.cargoList[p.index].remark1,
                maxlength: this.$fieldLength.remark,
                disabled: this.returnCheckStatus(p) !== 1,
                clearable: this.returnCheckStatus(p) === 1
              },
              on: {
                'on-change': (e) => {
                  this.cargoList[p.index].remark1 = e.target.value
                }
              }
            })
          }
        },
        {
          title: '备注2',
          key: 'remark2',
          width: 95,
          render: (h, p) => {
            return h('Input', {
              props: {
                value: this.cargoList[p.index].remark2,
                maxlength: this.$fieldLength.remark,
                disabled: this.returnCheckStatus(p) !== 1,
                clearable: this.returnCheckStatus(p) === 1
              },
              on: {
                'on-change': (e) => {
                  this.cargoList[p.index].remark2 = e.target.value
                }
              }
            })
          }
        },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 94,
          render: (h, p) => {
            return h('a', [
              h('Icon', {
                props: {
                  type: 'ios-add-circle',
                  size: 24,
                  color: '#7ED321'
                },
                on: {
                  'click': () => {
                    // 校验是否可新增货物
                    if (this.returnCheckStatus(p) !== 1) {
                      this.$Message.warning(this.tips(this.returnCheckStatus(p)))
                      return
                    }
                    // 新增货物并同步cloneCargoList和cargoList
                    this.syncAddCargoList('cloneCargoList', p)
                    this.syncAddCargoList('cargoList', p)

                    this.mergeCell('cloneCargoList', 'orderList')
                  }
                }
              }),
              h('Icon', {
                props: {
                  type: 'ios-remove-circle',
                  size: 24,
                  color: '#EC4E4E'
                },
                on: {
                  'click': () => {
                    const z = this
                    // 校验是否可删除货物
                    if (this.returnCheckStatus(p) !== 1) {
                      this.$Message.warning(this.tips(this.returnCheckStatus(p)))
                      return
                    }
                    if (this.cloneCargoList.length <= 1) {
                      z.$Message.warning('运单里的货物不能全部删除，必须保留一行货物。')
                      return
                    }
                    z.$Toast.confirm({
                      title: '提示',
                      content: '是否删除此行货物',
                      okText: '是',
                      cancelText: '否',
                      onOk () {
                        // 删除货物并同步cloneCargoList和cargoList
                        z.syncRemoveCargoList('cloneCargoList', p.index)
                        z.syncRemoveCargoList('cargoList', p.index)

                        z.mergeCell('cloneCargoList', 'orderList')
                      }
                    })
                  }
                }
              })
            ])
          }
        }
      ],
      columnsWeight: {
        title: '重量（吨）',
        key: 'weight',
        width: 110,
        render: (h, p) => {
          const z = this
          return h(TagNumberInput, {
            props: {
              value: z.cargoList[p.index].weight,
              min: 0,
              precision: NumberPrecesion.weight,
              disabled: this.returnCheckStatus(p) !== 1
            },
            on: {
              'on-change': (val) => {
                z.cargoList[p.index].weight = val
                // 有货物id记录的且已经有值的字段不允许清空或修改为0
                z.resetCargoKey(p, val, 'weight')
                // 同步吨和公斤
                z.$nextTick(() => {
                  z.cargoList[p.index].weightKg = parseInt(roundWeightKg(z.cargoList[p.index].weight * 1000))
                })
              }
            }
          })
        }
      },
      columnsWeightKg: {
        title: '重量（公斤）',
        key: 'weightKg',
        width: 110,
        render: (h, p) => {
          const z = this
          return h(TagNumberInput, {
            props: {
              value: z.cargoList[p.index].weightKg,
              min: 0,
              precision: NumberPrecesion.weightKg,
              disabled: this.returnCheckStatus(p) !== 1
            },
            on: {
              'on-change': (val) => {
                z.cargoList[p.index].weightKg = val
                // 有货物id记录的且已经有值的字段不允许清空或修改为0
                z.resetCargoKey(p, val, 'weightKg')
                // 同步吨和公斤
                z.$nextTick(() => {
                  z.cargoList[p.index].weight = roundWeight(z.cargoList[p.index].weightKg / 1000)
                })
              }
            }
          })
        }
      },
      checkList: [] // 校验订单是否核销或生成对账单返回值
    }
  },
  computed: {
    ...mapGetters([
      'WeightOption' // 重量配置
    ]),
    // 货物总计
    orderTotal () {
      return this.cargoList.reduce((last, item) => {
        const cargoCost = divideFee(item.cargoCost ? item.cargoCost : 0)
        return {
          cargoCost: roundFee((last.cargoCost ? last.cargoCost : 0) + cargoCost),
          quantity: (last.quantity ? last.quantity : 0) + (item.quantity ? item.quantity : 0),
          weight: roundWeight((last.weight ? last.weight : 0) + (item.weight ? item.weight : 0)),
          weightKg: roundWeightKg((last.weightKg ? last.weightKg : 0) + (item.weightKg ? item.weightKg : 0)),
          volume: roundVolume((last.volume ? last.volume : 0) + (item.volume ? item.volume : 0))
        }
      }, {
        cargoCost: 0,
        quantity: 0,
        weight: 0,
        weightKg: 0,
        volume: 0
      })
    }
  },
  created () {
    // 动态添加吨或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.tableColumns, this.columnsWeight, 5)
    } else {
      this.triggerWeightColumn(this.tableColumns, this.columnsWeightKg, 5)
    }
  },
  mounted () {
    this.cargoList = this.initCargoList
    this.cloneCargoList = _.cloneDeep(this.cargoList)
    this.mergeCell('cloneCargoList', 'orderList')
    this.checkCanModify()
  },
  methods: {
    // 将字符串超出固定长度后替换成...
    formatterString (str, len) {
      return str.slice(0, len) + ' ...'
    },
    // 合并单元格需要
    mergeCell (orderCargoList, orderData) {
      // 将原来的tableExtend组件里的orderList置为空数组
      this[orderData] = []
      let obj = _.groupBy(this[orderCargoList], 'orderId')
      this[orderCargoList] = _.flattenDeep(Object.values(obj))
      for (let key in obj) {
        // 合并单元格需要
        if (obj[key].length > 1) {
          obj[key].push(obj[key][0])
        }
        obj[key] = obj[key].map((item, index) => {
          return {
            orderNo: index === 0 ? item.orderNo : '', // 订单号
            customerOrderNo: index === 0 ? (item.customerOrderNo || '-') : '', // 客户订单号
            startToEnd: index === 0 ? [item.startName, item.endName].join('-') : '', // 始发地-目的地
            cargoLength: index === 0 ? obj[key].length : 1
          }
        })
        this[orderData].push(...obj[key])
      }
    },
    // 新增货物后同步cloneCargoList和cargoList数据
    syncAddCargoList (list, p) {
      // 新增一行空货物
      let addCargo = _.groupBy(this[list], 'orderId')
      addCargo[p.row.orderId].push({
        orderId: p.row.orderId,
        orderNo: p.row.orderNo,
        customerOrderNo: p.row.customerOrderNo,
        startName: p.row.startName,
        endName: p.row.endName,
        cargoName: '',
        cargoNo: '',
        unit: '',
        quantity: '',
        cargoCost: '',
        weight: '',
        weightKg: '',
        volume: '',
        dimension: {
          height: '',
          length: '',
          width: ''
        },
        remark1: '',
        remark2: ''
      })
      this[list] = _.flattenDeep(Object.values(addCargo))
    },
    // 删除货物后同步cloneCargoList和cargoList数据
    syncRemoveCargoList (list, index) {
      this[list].splice(index, 1)
    },
    // 有货物id记录的且已经有值的字段不允许清空或修改为0
    resetCargoKey (p, val, key) {
      const z = this
      if (p.row.cargoId) {
        if (!val && p.row[key]) {
          z.$Message.warning('已经有值的字段不允许清空或修改为0')
          // 重置回之前的原始数据
          z.$nextTick(() => {
            z.cargoList[p.index][key] = p.row[key]
          })
        }
      }
    },
    // 修改包装尺寸后关联体积
    dimensionLinkVolume (p) {
      let _length = this.cargoList[p.index].dimension.length
      let _height = this.cargoList[p.index].dimension.height
      let _width = this.cargoList[p.index].dimension.width
      if (_length && _height && _width) {
        this.cargoList[p.index].volume = roundVolume(_length * _height * _width / (1000 * 1000 * 1000))
      }
    },
    // 校验订单是否核销或生成对账单v1.12
    checkCanModify () {
      const z = this
      let obj = _.groupBy(z.cargoList, 'orderId')
      let data = {
        orderIds: _.flattenDeep(Object.keys(obj))
      }
      Server({
        url: '/waybill/can/modify/order',
        method: 'post',
        data: data
      }).then(res => {
        this.checkList = res.data.data.checkList
      })
    },
    // 返回当前货物所在订单的核销状态
    returnCheckStatus (p) {
      let check = _.find(this.checkList, { orderId: p.row.orderId })
      return check.status
    },
    // 校验提示语
    tips (status) {
      let tip
      switch (status) {
        case 10:
          tip = '此订单已加入对账单，不能修改货物信息'
          break
        case 20:
          tip = '此订单已核销，不能修改货物信息'
          break
        case 40:
          tip = '此订单对应的提货单已核销，不能修改货物信息'
          break
        case 50:
          tip = '此订单对应的提货单已加入对账单，不能修改货物信息'
          break
      }
      return tip
    },
    // 抛出修改后的货物信息list
    getCargoList () {
      return this.cargoList
    }
  }
}
</script>
<style lang='stylus' scoped>
  .table-cell-offset
    position relative
    left 10px
  .table-group
    display flex
    display -ms-flexbox
    .table-cargo
      border-left none
      overflow auto
  .table-footer
    max-width 1635px
    height 48px
    border 1px solid #dcdee2
    border-top none
    line-height 48px
    font-weight: bolder

    &-title
      padding-left 18px
      font-weight normal

    span
      display inline-block
      margin-right 44px
</style>
