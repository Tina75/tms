<template>
  <div class="paied">
    <CollectForm @on-search="handleSearch"></CollectForm>
    <Row class="paied__operation">
      <Col span="12">
      <Button v-if="hasPower(170504)" type="primary" style="width:86px" @click="handleExport">导出</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <PageTable
        ref="pageTable"
        :keywords="keywords"
        :columns="orderColumns"
        url="/finance/collection/paid/query"
        @on-selection-change="handleSelectionChange"
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
import Export from '@/libs/js/export'
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
      selected: [],
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
    handleSelectionChange (selected) {
      this.selected = selected
    },
    /**
     * 导出
     * 选择一单或多单，点击导出按钮，可以导出核销单
     */
    handleExport () {
      if (this.selected.length === 0) {
        this.$Message.warning('请选择需要导出的已付货款记录')
        return
      }
      const data = { id: this.selected.map(item => item.id) }
      Export({
        url: 'order/exportReceiptOrder',
        method: 'post',
        data,
        fileName: '回单明细'
      })
      this.$refs.pageTable.clearSelected()
      this.selected = []
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
