<template>
  <div class="ivu-table-wrapper table-extend-comp">
    <table cellspacing="0" cellpadding="0" boder="0" class="ivu-table ivu-table-default">
      <colgroup>
        <col :width="colWidth">
        <col :width="colWidth">
      </colgroup>
      <tbody class="ivu-table-tbody">
        <tr class="ivu-table-row">
          <th class="ivu-table-cell">订单号</th>
          <th class="ivu-table-cell">客户订单号</th>
        </tr>
        <tr v-for="(item, index) in orderList" :key="index">
          <td  :rowspan="item.cargoLength">
            <span style="position: relative;left: 26px;">{{ item.orderNo }}</span>
          </td>
          <td  :rowspan="item.cargoLength">
            <span style="position: relative;left: 26px;">{{ item.customerOrderNo }}</span>
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
      default: 160
    }
  },
  data () {
    return {
    }
  },

  methods: {
  }
}

</script>
<style lang='stylus' scoped>
.table-extend-comp
  .ivu-table:after
    top 40px
    height calc(100% - 40px)
</style>
