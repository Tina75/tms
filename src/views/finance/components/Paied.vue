<template>
  <div class="paied">
    <CollectForm></CollectForm>
    <Row class="paied__operation">
      <Col span="12">
      <Button type="primary">导出</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <PageTable
        :autoload="false"
        :columns="orderColumns"
        :show-pagination="false"
      />
      </Col>
    </Row>
  </div>
</template>

<script>
/**
 * 代收货款-已付款
 */
import CollectForm from './CollectForm.vue'
import PageTable from '@/components/page-table/index'
export default {
  components: {
    CollectForm,
    PageTable
  },
  data () {
    return {
      senders: [
        {
          partnerName: '创世纪科技公司',
          totalFee: 200,
          paied: 100,
          orders: 12
        },
        {
          partnerName: '斑马科技有限公司',
          totalFee: 1200,
          paied: 1000,
          orders: 100
        }
      ],
      orderColumns: [
        {
          type: 'selection',
          width: 40
        },
        {
          title: '操作',
          width: 60,
          key: 'action',
          render: (h, params) => {
            return h('span', {}, '付款核销')
          }
        },
        {
          title: '订单号',
          width: 140,
          key: 'orderNo'
        },
        {
          title: '发货方名称'
        },
        {
          title: '始发地',
          key: 'departureName'
        },
        {
          title: '目的地',
          key: 'destinationName'
        },
        {
          title: '代收货款',
          key: 'fee'
        },
        {
          title: '承运商'
        },
        {
          title: '车牌号',
          key: 'truckNo'
        },
        {
          title: '订单状态'
        },
        {
          title: '收款时间'
        },
        {
          title: '付款时间'
        }
      ]
    }
  },
  methods: {
    /**
     * 选中发货方
     */
    handleClick (item) {
      console.log('item', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.paied
  &__operation
    border-bottom 1px solid #E4E7EC
    padding-bottom 9px
</style>
