<template>
  <Modal v-model="visibale" :mask-closable="true" width="1036" @on-visible-change="close">
    <p slot="header" style="text-align:center">添加订单</p>

    <Table :columns="columns"
           :data="data"
           :loading="loading"></Table>

    <div slot="footer">
      <Button  type="primary"  @click="save">确定</Button>
      <Button  type="default"  @click.native="visibale = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'AddOrder',
  mixins: [ BaseDialog ],
  data () {
    return {
      visibale: true,
      loading: false,
      columns: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '订单号',
          key: 'orderNo'
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo'
        },
        {
          title: '客户名称',
          key: 'consignerName'
        },
        {
          title: '始发地',
          key: 'start'
        },
        {
          title: '目的地',
          key: 'end'
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        }
      ],
      data: []

    }
  },
  methods: {

  }
}

</script>
<style lang='stylus' scoped>
</style>
