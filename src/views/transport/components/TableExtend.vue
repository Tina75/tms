<template>
  <div class="ivu-table-wrapper table-extend-comp">
    <table cellspacing="0" cellpadding="0" boder="0" class="ivu-table ivu-table-default">
      <colgroup>
        <col :width="colWidth">
        <col v-if="hasCustomerOrderNo" :width="colWidth">
      </colgroup>
      <tbody class="ivu-table-tbody">
        <tr class="ivu-table-row">
          <th class="ivu-table-cell">订单号</th>
          <th v-if="hasCustomerOrderNo" class="ivu-table-cell">客户订单号</th>
        </tr>
        <tr v-for="(item, index) in orderList" :key="index">
          <td  :rowspan="item.cargoLength">
            <span v-if="item.orderNo.length < 20" style="position: relative;left: 26px;">{{ item.orderNo }}</span>
            <Tooltip v-else :content="item.orderNo" transfer placement="bottom">
              <span style="position: relative;left: 26px;">{{ formatterString(item.orderNo, 20) }}</span>
            </Tooltip>
          </td>
          <td  v-if="hasCustomerOrderNo" :rowspan="item.cargoLength">
            <span v-if="item.customerOrderNo.length < 15" style="position: relative;left: 26px;">{{ item.customerOrderNo }}</span>
            <Tooltip v-else :content="item.customerOrderNo" transfer placement="bottom">
              <span style="position: relative;left: 26px;">{{ formatterString(item.customerOrderNo, 14) }}</span>
            </Tooltip>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'TableExtend',
  props: {
    // 传入的需展示的值
    orderList: {
      type: Array
    },
    // 表格列宽
    colWidth: {
      type: [String, Number],
      default: 150
    },
    // 是否展示客户订单号
    hasCustomerOrderNo: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },

  methods: {
    // 将字符串超出固定长度后替换成...
    formatterString (str, len) {
      return str.slice(0, len) + ' ...'
    }
  }
}

</script>
<style lang='stylus' scoped>
.table-extend-comp
  .ivu-table:after
    top 40px
    height calc(100% - 40px)
</style>
