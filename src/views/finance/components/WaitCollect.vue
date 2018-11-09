<template>
  <div class="wait-collect">
    <CollectForm @on-search="handleSearch"></CollectForm>
    <ReconcileLayout :columns="orderColumns" :data-source="orderList" title="发货方代收款列表" empty-content="请点击左侧发货方列表查看代收货款列表哦～">
      <div slot="operation">
        <Button type="primary" @click="batchWriteOff">收款核销</Button>
      </div>
      <ListSender ref="senderList" :style="styles" list-key="partnerName" @on-click="handleClick">
        <ListSenderItem v-for="(item, name) in datas" :key="name" :item="item" :title="item.partnerName" :extra="item.orderNum" icon="ico-company">
          <p slot="supName">
            <span>
              总额 {{item.calcTotalFee / 100 }}
            </span>
            <span class="i-ml-20">
              已收 {{item.verifiedFee / 100}}
            </span>
          </p>
        </ListSenderItem>
      </ListSender>
    </ReconcileLayout>
  </div>
</template>

<script>
/**
 * 代收货款-未收
 * 此Tab下显示的是所有【已发运】，但是还未收到代收货款的订单。按照发货方进行汇总。
 */
import BaseComponent from '@/basic/BaseComponent'
import CollectForm from './CollectForm.vue'
import ReconcileLayout from './ReconcileLayout.vue'
import ListSender from './list-sender/index.vue'
import ListSenderItem from './list-sender/SenderItem.vue'
import cargoFeeMixin from '../mixins/cargoFeeMixin.js'
export default {
  components: {
    CollectForm,
    ListSender,
    ListSenderItem,
    ReconcileLayout
  },
  mixins: [BaseComponent, cargoFeeMixin],
  data () {
    return {
      commonStatus: 0, // 0-未收 1-已收未付 2-已付
      verifyType: 1, // 1-代收货款已收未付，2-代收货款已付款，3-返现运费'
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
            return this.hasPower(170501) ? h('a', {
              on: {
                click: () => {
                  this.writeOff(params.row)
                }
              }
            }, '收款核销') : ''
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
          key: 'collectionFee',
          render (h, params) {
            return h('span', {}, params.row['collectionFee'] / 100)
          }
        },
        {
          title: '承运商',
          key: 'carrierName'
        },
        {
          title: '车牌号',
          key: 'truckNo'
        },
        {
          title: '订单状态',
          key: 'orderStatusDesc'
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>

</style>
