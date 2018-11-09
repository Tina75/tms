<template>
  <div class="paied">
    <CollectForm @on-search="handleSearch"></CollectForm>
    <Row class="paied__operation">
      <Col span="12">
      <Button type="primary" style="width:86px">导出</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <PageTable
        :keywords="keywords"
        :columns="orderColumns"
        url="/finance/collection/paid/query"
      />
      </Col>
    </Row>
  </div>
</template>

<script>
/**
 * 代收货款-已付款
 */
import BaseComponent from '@/basic/BaseComponent'
import CollectForm from './CollectForm.vue'
import PageTable from '@/components/page-table/index'
export default {
  components: {
    CollectForm,
    PageTable
  },
  mixins: [BaseComponent],
  data () {
    return {
      keywords: {
        partnerName: void 0,
        orderNo: void 0,
        startTime: void 0,
        endTime: void 0
      },
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
            return this.hasPower(170503) ? h('a', {
              on: {
                click: () => {
                  console.log('查看记录')
                }
              }
            }, '查看') : ''
          }
        },
        {
          title: '订单号',
          width: 140,
          key: 'orderNo'
        },
        {
          title: '发货方名称',
          key: 'partnerName'
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
          key: 'collectionFee'
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
          key: 'statusDesc'
        },
        {
          title: '收款时间',
          key: 'collectionTime'
        },
        {
          title: '付款时间',
          key: 'paymentTime'
        }
      ]
    }
  },
  methods: {
    handleSearch (params) {
      this.keywords = {
        ...params
      }
    },
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
