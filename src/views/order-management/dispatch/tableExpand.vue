<template>
  <Table :columns="tableHeader"
         :data="data" :loading="tableLoading"
         class="expand-table"
         @on-selection-change="selectionChange">
  </Table>
</template>

<script>
export default {
  name: 'TableExpand',
  props: {
    tableLoading: {
      type: Boolean,
      default: false
    },
    tableHeader: {
      type: Array,
      required: true
    },
    tableData: Array,
    tableDataFunc: Function
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
    }
  }
}
</script>

<style lang="stylus">
  .expand-table
    margin -20px -50px -20px -20px
    border-color transparent

    .ivu-table, .ivu-table th, .ivu-table td
      background #f8f8f9

    .ivu-table-row  td
      border-color transparent
</style>
