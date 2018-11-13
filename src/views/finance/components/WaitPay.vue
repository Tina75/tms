<template>
  <div class="wait-pay">
    <CollectForm  @on-search="handleSearch"></CollectForm>
    <ReconcileLayout
      :columns="orderColumns"
      :data-source="orderList"
      title="发货方代收款列表"
      empty-content="请点击左侧发货方列表查看待付货款列表哦～"
      @on-selection-change="handleSelectionChange"
    >
      <div slot="operation">
        <Button type="primary" @click="batchWriteOff">付款核销</Button>
      </div>
      <ListSender ref="senderList" :style="styles" list-key="partnerName" @on-click="handleClick">
        <ListSenderItem v-for="(item, name) in datas" :key="name" :item="item" :title="item.partnerName" :extra="item.orderNum" icon="ico-company">
          <p slot="supName">
            <span>
              总额 {{item.calcTotalFee}}
            </span>
            <span class="i-ml-20">
              已付 {{item.verifiedFee}}
            </span>
          </p>
        </ListSenderItem>
      </ListSender>
    </ReconcileLayout>
  </div>
</template>

<script>
/**
 * 代收货款-已收未付
 * 此tab下显示已经收回代收货款但是没有付给发货方的订单
 */
import BaseComponent from '@/basic/BaseComponent'
import CollectForm from './CollectForm.vue'
import ListSender from './list-sender/index.vue'
import ListSenderItem from './list-sender/SenderItem.vue'
import ReconcileLayout from './ReconcileLayout.vue'
import cargoFeeMixin from '../mixins/cargoFeeMixin.js'
import { renderFee } from '@/libs/js/util'
import { ORDER_STATUS } from '@/libs/constant/order'
export default {
  components: {
    CollectForm,
    ListSender,
    ListSenderItem,
    ReconcileLayout
  },
  mixins: [BaseComponent, cargoFeeMixin],
  data () {
    const statusText = ORDER_STATUS.map(status => {
      return {
        label: status.label,
        value: status.label
      }
    })
    return {
      selectedRows: [],
      verifyType: 2,
      commonStatus: 1,
      orderColumns: [
        {
          type: 'selection',
          width: 40
        },
        {
          title: '操作',
          width: 80,
          key: 'action',
          render: (h, params) => {
            return this.hasPower(170502) ? h('a', {
              on: {
                click: () => {
                  this.writeOff(params.row)
                }
              }
            }, '付款核销') : ''
          }
        },
        {
          title: '订单号',
          width: 150,
          key: 'orderNo',
          render: (h, params) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.toDetail(params.row)
                }
              }
            }, params.row.orderNo)
          }
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
            return renderFee(h, params.row['collectionFee'])
            // return h('span', {}, params.row['collectionFee'] / 100)
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
          key: 'orderStatusDesc',
          filters: statusText,
          filterMethod (value, row) {
            return row.orderStatusDesc === value
          }
        }
      ],
      styles: {
        height: 'auto'
      }
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>

</style>
