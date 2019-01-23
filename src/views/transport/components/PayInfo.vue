<template>
  <div>
    <Table :columns="columns" :data="tableData" :loading="loading" class="payment-info-table" width="350"></Table>
    <div v-if="mode === 'edit' && payInfoTotal !== total" class="more-tips">
      <div v-if="payInfoTotal < total">剩余未填金额<span>{{ more }}</span>元</div>
      <div v-else>输入金额超出合计费<span style="color: #EE2017;">{{ more }}</span>元</div>
    </div>
  </div>
</template>

<script>
import MoneyInput from './MoneyInput'
import float from '@/libs/js/float'
import NP from 'number-precision'
import { roundFee, multiplyFeeOrNull } from '@/libs/js/config'
export default {
  name: 'PayInfo',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: [ Number, String ],
      default: 0
    },
    mode: {
      type: String,
      default: 'watch',
      validator: (val) => ['watch', 'edit'].indexOf(val) > -1
    },
    feeStatusTip: { // 改单提示语
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableData: Object.assign([], this.data),
      tableDataBack: Object.assign([], this.data),
      columns: [
        {
          title: '付款方式',
          key: 'payType',
          align: 'center',
          width: 100,
          render: (h, p) => {
            let type
            if (p.row.payType === 1) type = '预付'
            if (p.row.payType === 2) type = '到付'
            if (p.row.payType === 3) type = '回付'
            if (p.row.payType === 4) type = '尾款'
            return h('span', { style: { fontWeight: 'bolder' } }, type)
          }
        },
        {
          title: '现金',
          key: 'cashAmount',
          render: (h, p) => {
            // 编辑 - 不能编辑 且 需要提示语
            if (this.mode === 'edit' && p.row.isCashDisabled && p.row.type === 'change') {
              let str = this.getTips(p)
              return h('Tooltip', {
                props: {
                  placeholder: 'bottom',
                  transfer: false
                }
              }, [h('span', {}, p.row.cashAmount !== '' ? p.row.cashAmount : '-'), h('div', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal'
                }
              }, str)])
            }
            // 展示表格 可以显示 0
            if (this.mode === 'watch' || (this.mode === 'edit' && p.row.isCashDisabled)) return h('span', p.row.cashAmount !== '' ? p.row.cashAmount : '-')
            // 编辑状态
            return h(MoneyInput, {
              props: {
                value: p.row.cashAmount,
                placeholder: '请输入',
                suffix: false
              },
              style: { width: '70px' },
              on: {
                'on-blur': (money) => {
                  let temp = p.row
                  temp.cashAmount = money
                  this.tableDataBack.splice(p.index, 1, temp)
                }
              }
            })
          }
        },
        {
          title: '油卡',
          key: 'fuelCardAmount',
          render: (h, p) => {
            if (this.mode === 'edit' && p.row.isCardDisabled && p.row.type === 'change') {
              let str = this.getTips(p)
              return h('Tooltip', {
                props: {
                  placeholder: 'bottom',
                  transfer: false
                }
              }, [h('span', {}, p.row.fuelCardAmount !== '' ? p.row.fuelCardAmount : '-'), h('div', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal'
                }
              }, str)])
            }
            if (this.mode === 'watch' || (this.mode === 'edit' && p.row.isCardDisabled)) return h('span', p.row.fuelCardAmount !== '' ? p.row.fuelCardAmount : '-')

            return h(MoneyInput, {
              props: {
                value: p.row.fuelCardAmount,
                placeholder: '请输入',
                suffix: false
              },
              style: {
                width: '70px'
              },
              on: {
                'on-blur': (money) => {
                  let temp = p.row
                  temp.fuelCardAmount = money
                  this.tableDataBack.splice(p.index, 1, temp)
                }
              }
            })
          }
        }
      ],
      more: 0 // 剩余或多出得金额
    }
  },
  computed: {
    // payInfo 组件输入费用总计
    payInfoTotal () {
      let total = 0
      this.tableDataBack.forEach(item => {
        total = roundFee(NP.plus(total, roundFee(Number(item.cashAmount) + Number(item.fuelCardAmount))))
      })
      return total
    }
  },
  watch: {
    data (value) {
      this.tableData = Object.assign([], value)
      this.tableDataBack = Object.assign([], value)
    },
    payInfoTotal () {
      this.more = Math.abs(roundFee(NP.minus(Number(this.total), Number(this.payInfoTotal)))) // 取绝对值，确保为正数
    },
    total () {
      this.more = Math.abs(roundFee(NP.minus(Number(this.total), Number(this.payInfoTotal)))) // 取绝对值，确保为正数
    }
  },
  mounted () {
    this.more = Math.abs(roundFee(NP.minus(Number(this.total), Number(this.payInfoTotal)))) // 取绝对值，确保为正数
  },
  methods: {
    getPayInfo () {
      return this.tableDataBack.map(item => {
        return {
          payType: item.payType,
          fuelCardAmount: multiplyFeeOrNull(item.fuelCardAmount),
          cashAmount: multiplyFeeOrNull(item.cashAmount)
        }
      })
    },
    getPayInfo_change () {
      return this.tableDataBack.map(item => {
        return {
          payType: item.payType,
          fuelCardAmount: typeof item.fuelCardAmount === 'number' ? float.round(item.fuelCardAmount * 100) : 0,
          cashAmount: typeof item.cashAmount === 'number' ? float.round(item.cashAmount * 100) : 0
        }
      })
    },
    validate () {
      if (this.payInfoTotal !== Number(this.total)) {
        this.$Message.error('结算总额应与费用合计相等')
        return false
      }
      return true
    },
    getTips (p) {
      let str = ''
      if (!this.feeStatusTip) {
        if (p.row.payType === 1) str = '预付' + p.column.title
        if (p.row.payType === 2) str = '到付' + p.column.title
        if (p.row.payType === 3) str = '回付' + p.column.title
        if (p.row.payType === 4) str = '尾款' + p.column.title
        str += '已核销,不能修改'
      } else {
        str = this.feeStatusTip
      }
      return str
    }
  }
}
</script>

<style lang="stylus" scoped>
.payment-info-table
>>> .ivu-table
      .ivu-table-cell
        overflow inherit
.more-tips
  font-size 12px
  font-family 'PingFangSC-Regular'
  color #333
  margin 5px 0 0 23px
  span
    margin 0 5px 0 20px
    font-family 'PingFangSC-Medium'
    font-weight 500
    color #00A4BD
</style>
