<template>
  <Modal v-model="visiable" :mask-closable="true" transfer width="900" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">对账单明细</p>
    <div class="order-list">
      <Row>
        <Col span="7">
        <p><label>对账批次号：</label><span>{{reconcileNo}}</span></p>
        </Col>
        <Col span="7">
        <p><label>对账日期：</label><span>{{dateRange}}</span></p>
        </Col>
        <Col span="10">
        <p><label>{{sceneMap[scene]}}：</label><span>{{partnerName}}</span></p>
        </Col>
      </Row>
      <Row>
        <Col span="5">
        <p><label>总单据数量：</label><span>{{orderData.orderNum}}</span></p>
        </Col>
        <Col span="5">
        <p><label>运费总额：</label><span>{{orderData.totalFeeText}}</span></p>
        </Col>
      </Row>
      <div class="list-box">
        <Table :columns="orderColumn" :data="orderData.list" height="500"></Table>
        <Page :current.sync="listQuery.pageNo" :total="orderData.orderNum" :page-size="listQuery.pageSize"  size="small" show-elevator show-total show-sizer @on-change="getOrderList"  @on-page-size-change="resetPageSize"/>
      </div>
    </div>
    <div slot="footer" style="text-align:center">
      <Button type="primary" @click="close">确定</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'

export default {
  name: 'orderList',
  mixins: [BaseDialog],
  data () {
    return {
      sceneMap: {
        1: '发货方',
        2: '承运商',
        3: '外转方'
      },
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      orderData: {
        orderNum: 0,
        totalFee: 0,
        list: []
      }
    }
  },
  computed: {
    orderColumn () {
      return [
        {
          title: '操作',
          width: 60,
          key: 'action',
          render: (h, params) => {
            return this.orderData.list.length > 2 ? h('a', {
              on: {
                click: () => {
                  this.removeOrder(params)
                }
              }
            }, '移除') : ''
          }
        },
        {
          title: '订单号',
          width: 160,
          key: 'orderNo'
          // render: (h, params) => {
          //   return h('a', {
          //     style: {
          //       color: '#418DF9'
          //     },
          //     on: {
          //       click: () => {
          //         this.toDetail(params)
          //       }
          //     }
          //   }, params.row.orderNo)
          // }
        },
        {
          title: '始发地',
          key: 'departureName'
        },
        {
          title: '目的地',
          key: 'destinationName'
        },
        this.scene === 2 ? {
          title: '车牌号',
          key: 'truckNo'
        } : {
          title: ' ',
          width: 1
        },
        {
          title: '合计运费',
          key: 'totalFeeText'
        },
        {
          title: '结算方式',
          key: 'settleTypeDesc'
        },
        {
          title: '订单状态',
          key: 'orderStatusDesc'
        },
        {
          title: '下单时间',
          width: 160,
          key: 'orderTimeText'
        }
      ]
    }
  },
  mounted () {
    this.getOrderList()
  },
  methods: {
    removeOrder (data) {
      const _this = this
      this.$Modal.confirm({
        title: '提示',
        content: '确认从对账单中删除该条订单吗？',
        okText: '确认',
        cancelText: '取消',
        async onOk () {
          Server({
            url: '/finance/reconcile/removeSub',
            method: 'post',
            data: {
              subOrderId: data.row.id
            }
          }).then(res => {
            _this.getOrderList()
            _this.ok()
          }).catch()
        }
      })
    },
    getOrderList () {
      Server({
        url: '/finance/reconcile/detail',
        method: 'get',
        params: {
          reconcileId: this.id,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize
        }
      }).then(res => {
        this.orderData.orderNum = res.data.data.orderNum
        this.orderData.totalFeeText = (res.data.data.totalFee / 100).toFixed(2)
        this.orderData.list = res.data.data.subOrderInfos.map(item => {
          return Object.assign({}, item, {
            totalFeeText: (item.totalFee / 100).toFixed(2),
            orderTimeText: new Date(item.orderTime).Format('yyyy-MM-dd hh:mm')
          })
        })
      }).catch()
    },
    toDetail (data) {
      switch (data.row.orderType) {
        case 1:
          this.openTab({
            path: '/order/management/detail',
            title: data.row.orderNo,
            query: {
              id: data.row.orderNo,
              orderId: data.row.orderId,
              from: 'order'
            }
          })
          break
        case 2:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailFreight',
            query: { id: data.row.orderId } // id 或 no 二选一
          })
          break
        case 3:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailPickup',
            query: { id: data.row.orderId }
          })
          break
        case 4:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailOuter',
            query: { id: data.row.orderId }
          })
          break
      }
    },
    resetPageSize (size) {
      this.listQuery.pageNo = 1
      this.listQuery.pageSize = size
      this.getOrderList()
    }
  }
}

</script>
<style lang='stylus' scoped>
  .order-list
    p
      line-height: 28px
      margin-top: 10px
      margin-bottom: 10px
    label
      display: inline-block
      color: #777777
      vertical-align: middle
    span
      display: inline-block
      color: #333333
      vertical-align: middle
    .list-box
      text-align: right
      /deep/ .ivu-table-wrapper
        margin-bottom: 20px
      /deep/ .ivu-page-item-active
        background-color: #00a4bd
        border-radius: 5px
        a
          color: #ffffff
</style>
