<template>
  <Row>
    <Col span="10">
    <Table :columns="leftTableHeader" :data="leftTableData"></Table>
    </Col>

    <Col span="4">
    2
    </Col>

    <Col span="10">
    3
    </Col>
  </Row>
</template>

<script>
import dispatchMixin from './dispatchMixin'

export default {
  name: 'DispatchFreight',
  mixins: [ dispatchMixin ],
  data () {
    return {

      rightTableHeader: []
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>
  .ivu-table-wrapper .ivu-table-cell
    display block
</style>
