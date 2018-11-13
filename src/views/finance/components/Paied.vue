<template>
  <div class="paied">
    <CollectForm scene="2" @on-search="handleSearch"></CollectForm>
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
        method="post"
        list-field="dataList"
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
 * 显示已经把代收货款付给发货方的订单
 */
import BaseComponent from '@/basic/BaseComponent'
import CollectForm from './CollectForm.vue'
import PageTable from '@/components/page-table/index'
import Export from '@/libs/js/export'
import TMSUrl from '@/libs/constant/url'
import Server from '@/libs/js/server'
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
                  this.showDetailRecord(params.row)
                }
              }
            }, '查看') : ''
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
          title: '发货方名称',
          key: 'partnerName',
          width: 180,
          tooltip: true
        },
        {
          title: '始发地',
          key: 'departureName',
          width: 180
        },
        {
          title: '目的地',
          key: 'destinationName',
          width: 180
        },
        {
          title: '代收货款',
          key: 'collectionFee',
          width: 100,
          render (h, params) {
            return h('span', {}, params.row['collectionFee'] ? (params.row['collectionFee'] / 100).toFixed(2) : 0)
          }
        },
        {
          title: '承运商',
          key: 'carrierName',
          width: 100
        },
        {
          title: '车牌号',
          key: 'truckNo',
          width: 100
        },
        {
          title: '订单状态',
          key: 'statusDesc',
          width: 100
        },
        {
          title: '收款时间',
          key: 'collectionTime',
          width: 150,
          render (h, params) {
            return h('span', {}, new Date(params.row['collectionTime']).Format('yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: '付款时间',
          key: 'paymentTime',
          width: 150,
          render (h, params) {
            return h('span', {}, new Date(params.row['paymentTime']).Format('yyyy-MM-dd hh:mm:ss'))
          }
        }
      ]
    }
  },
  methods: {
    toDetail (data) {
      this.openTab({
        path: TMSUrl.ORDER_DETAIL,
        title: data.orderNo,
        query: {
          id: data.orderNo,
          orderId: data.orderId,
          from: 'order'
        }
      })
    },
    /**
     * 查看收付款详情记录
     */
    showDetailRecord (data) {
      const vm = this
      Server({
        url: 'finance/collection/order/verify/detail',
        method: 'get',
        data: {
          id: data.id
        }
      }).then((res) => {
        vm.openDialog({
          name: 'finance/dialogs/cargoFeeRecord',
          data: {
            title: '收付款记录',
            receiptRecords: res.data.data.receiptRecords,
            paymentRecords: res.data.data.paymentRecords
          },
          methods: {
            ok () {

            }
          }
        })
      })
    },
    /**
     * 搜索
     */
    handleSearch (params) {
      this.keywords = {
        ...params
      }
      this.selected = []
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
      const data = { ids: this.selected.map(item => Number(item.id)) }
      Export({
        url: 'finance/collection/paid/export',
        method: 'post',
        data,
        fileName: '代收货款记录'
      })
      this.$refs.pageTable.clearSelected()
      this.selected = []
    }
  }
}
</script>

<style lang="stylus" scoped>
.paied
  min-height 385px
  &__operation
    border-bottom 1px solid #E4E7EC
    padding-bottom 9px
</style>
