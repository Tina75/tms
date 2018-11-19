<template>
  <Table :columns="columns"
         :data="tableData"
         :loading="loading"
         width="350"></Table>
</template>

<script>
import MoneyInput from './MoneyInput'

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
            return h('span', { style: { fontWeight: 'bolder' } }, type)
          }
        },
        {
          title: '现金',
          key: 'cashAmount',
          render: (h, p) => {
            if (this.mode === 'watch' || (this.mode === 'edit' && p.row.isCashDisabled)) return h('span', p.row.cashAmount || 0)

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
            if (this.mode === 'watch' || (this.mode === 'edit' && p.row.isCardDisabled)) return h('span', p.row.fuelCardAmount || 0)

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
      ]
    }
  },
  watch: {
    data (value) {
      this.tableData = Object.assign([], value)
      this.tableDataBack = Object.assign([], value)
    }
  },
  methods: {
    getPayInfo () {
      return this.tableDataBack.map(item => {
        return {
          payType: item.payType,
          fuelCardAmount: typeof item.fuelCardAmount === 'number' ? item.fuelCardAmount * 100 : void 0,
          cashAmount: typeof item.cashAmount === 'number' ? item.cashAmount * 100 : void 0
        }
      })
    },

    validate () {
      let total = 0
      this.tableDataBack.forEach(item => {
        total = total + Number(item.cashAmount) + Number(item.fuelCardAmount)
      })
      if (total !== Number(this.total) && total !== 0) {
        this.$Message.error('结算总额应与费用合计相等')
        return false
      }
      return true
    }
  }
}
</script>
