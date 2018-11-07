<template>
  <div class="wait-pay">
    <CollectForm></CollectForm>
    <Row class="wait-pay__operation">
      <Col span="12">
      <span class="wait-pay__view-title">发货方代付款列表</span>
      </Col>
      <Col span="12 van-right">
      <Button type="primary">付款核销</Button>
      </Col>
    </Row>
    <Row type="flex">
      <Col span="6" class="wait-pay__flex-left">
      <ListSender ref="senderList" :style="styles" list-key="partnerName" @on-click="handleClick">
        <ListSenderItem v-for="(item, index) in senders" :key="index" :item="item" :title="item.partnerName" :extra="item.orders" icon="ico-company">
          <p slot="supName">
            <span>
              总额 {{item.totalFee}}
            </span>
            <span class="i-ml-20">
              已付 {{item.paied}}
            </span>
          </p>
        </ListSenderItem>
      </ListSender>
      <div class="wait-pay__flex-divider"></div>
      </Col>
      <Col span="17" class="wait-pay__flex-right">
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
/**
 * 代收货款-已收未付
 */
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
            return h('span', {}, '付款核销')
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
        }
      ],
      styles: {
        height: 'auto'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let height = this.$parent.$parent.$el.parentNode.clientHeight - this.$refs.senderList.$el.getBoundingClientRect().top + this.$parent.$parent.$el.getBoundingClientRect().top
      this.styles = {
        height: (height) + 'px'
      }
    })
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
.wait-pay
  &__operation
    border-bottom 1px solid #E4E7EC
    padding-bottom 9px
  &__flex-divider
    position absolute
  &__flex-left
    flex 0 0 275px
    border-right 1px solid #E4E7EC
  &__flex-right
    flex 1
    padding-left 10px
  &__view-title
    font-size 14px
    color #333
</style>
