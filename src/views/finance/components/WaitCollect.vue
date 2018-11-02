<template>
  <div class="wait-collect">
    <CollectForm></CollectForm>
    <Row class="wait-collect__operation">
      <Col span="12">
      <span class="wait-collect__view-title">发货方代收款列表</span>
      </Col>
      <Col span="12 van-right">
      <Button type="primary">收款核销</Button>
      </Col>
    </Row>
    <Row type="flex">
      <Col span="6" class="wait-collect__flex-left">
      <ListSender list-key="partnerName" @on-click="handleClick">
        <ListSenderItem v-for="(item, index) in senders" :key="index" :item="item" :title="item.partnerName" :extra="item.orders" icon="ico-company">
          <p slot="supName">
            <span>
              总额 {{item.totalFee}}
            </span>
            <span class="i-ml-20">
              已收 {{item.paied}}
            </span>
          </p>
        </ListSenderItem>
      </ListSender>
      </Col>
      <Col span="18" class="wait-collect__flex-right">
      <div class="i-mt-20">
        <PageTable
          :autoload="false"
          :columns="orderColumns"
          :show-pagination="false"
        />
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import CollectForm from './CollectForm.vue'
import ListSender from './list-sender/index.vue'
import ListSenderItem from './list-sender/SenderItem.vue'
import PageTable from '@/components/page-table/index'
export default {
  components: {
    CollectForm,
    ListSender,
    ListSenderItem,
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
            return h('span', {}, '收款核销')
          }
        },
        {
          title: '订单号',
          width: 140,
          key: 'orderNo'
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
          title: '车牌号',
          key: 'truckNo'
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
.wait-collect
  &__operation
    border-bottom 1px solid #E4E7EC
    padding-bottom 9px
  &__flex-left
    flex 0 0 275px
    border-right 1px solid #E4E7EC
    &:after
      content ''
      width 1px
      border-right 1px solid #E4E7EC
      position absolute
  &__flex-right
    flex 1
    padding-left 10px
  &__view-title
    font-size 14px
    color #333
</style>
