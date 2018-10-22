<template>
  <Table :columns="tableHeader"
         :data="data" :loading="tableLoading"
         :row-class-name="heightLightNewRow"
         class="expand-table"
         @on-selection-change="selectionChange">
  </Table>
</template>

<script>
export default {
  name: 'TableExpand',
  props: {
    // 表格家在状态
    tableLoading: {
      type: Boolean,
      default: false
    },
    // 表头
    tableHeader: {
      type: Array,
      required: true
    },

    // 以下属性二选一
    tableData: Array, // 表格数据
    tableDataFunc: Function // 获取表格数据的方法，需要返回数据内容
  },
  data () {
    return {
      data: []
    }
  },
  watch: {
    tableData () {
      this.data = this.tableData
    }
  },
  created () {
    if (this.tableData) this.data = this.tableData
    else this.data = this.tableDataFunc()
  },
  methods: {
    selectionChange (selection) {
      this.$emit('on-expand-select', selection.map(item => item.orderId))
    },

    heightLightNewRow (row) {
      if (row.isNew) return 'row-highlight'
      else return ''
    }
  }
}
</script>

<style lang="stylus">
  .ivu-table .row-highlight td
    background-color #ebf7ff !important

  .expand-table
    margin -20px -50px -20px -50px
    border-color transparent

    .ivu-table, .ivu-table th, .ivu-table td
      background #f8f8f9

    .ivu-table-row td
      border-color transparent
</style>
