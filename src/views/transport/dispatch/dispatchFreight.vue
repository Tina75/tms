<template>
  <div ref="$dispatch" class="dispatch">
    <div class="dispatch-part">
      <div class="dispatch-part-title">可调度订单</div>
      <Table :columns="leftTableHeader" :data="leftTableData"
             :loading="leftTableLoading && !leftTableData.length"
             @on-expand="keepLeftExpandOnly"></Table>
    </div>

    <div class="dispatch-actions">
      <div>
        <br><br>
        <Button :disabled="!leftSelection.length || !rightSelectRow" type="primary"
                icon="ios-arrow-forward"
                @click="moveOrders2Freight">加入</Button>
        <br><br>
        <Button :disabled="!rightSelection.length" type="primary"
                icon="ios-arrow-back"
                @click="removeOrdersFromFreight">移除</Button>
      </div>

    </div>

    <div class="dispatch-part">
      <div class="dispatch-part-title">
        未发运订单

        <Button type="primary" style="float: right;" @click="createFreight">新建运单</Button>
      </div>
      <div v-if="!rightTableData.length && !rightTableLoading" class="dispatch-empty">
        <img src="../../../assets/img-empty.png" class="dispatch-empty-img">
        <p>暂无未发运运单，赶快创建新的运单吧～</p>
      </div>
      <Table v-else
             :columns="rightTableHeader" :data="rightTableData" :loading="rightTableLoading && !rightTableData.length"
             highlight-row
             @on-expand="keepRightExpandOnly"
             @on-row-click="rightTableRowClick"></Table>
    </div>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BasePage from '@/basic/BasePage'
import dispatchMixin from './dispatchMixin'
import tableExpand from './tableExpand'

export default {
  name: 'DispatchFreight',
  mixins: [ BasePage, dispatchMixin ],
  data () {
    return {
      // 右侧表格表头
      rightTableHeader: [
        {
          type: 'expand',
          width: 30,
          render: (h, p) => {
            return h(tableExpand, {
              on: {
                'on-expand-select': (selection) => {
                  this.rightSelection = selection
                }
              },
              props: {
                tableHeader: this.expandTableTypeTwo,
                tableDataFunc: () => {
                  return p.row.waybillOrderList
                }
              }
            })
          }
        },
        {
          title: '运单号',
          key: 'waybillNo',
          render: (h, p) => {
            return h('span', {
              style: {
                color: '#418DF9'
              }
            }, p.row.waybillNo)
          }
        },
        {
          title: '始发地',
          key: 'start',
          ellipsis: true,
          render: (h, p) => {
            return h('span', this.cityFilter(p.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          ellipsis: true,
          render: (h, p) => {
            return h('span', this.cityFilter(p.row.end))
          }
        },
        {
          title: '车牌号',
          key: 'carNo'
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    createFreight () {
      this.openDialog({
        name: 'transport/dialog/createFreight',
        data: {
          title: '新增运单'
        },
        methods: {
          complete: () => {
            this.fetchRightTableData()
          }
        }
      })
    },

    fetchData () {
      this.fetchLeftTableData('20')
      this.fetchRightTableData()
    },
    // 查询右侧表格数据
    fetchRightTableData () {
      this.rightTableLoading = true
      Server({
        url: '/dispatch/waybill/list',
        method: 'get'
      }).then(res => {
        this.rightTableData = this.dataFilter(res.data.data.waybillList, ['_expanded', '_highlight'], item => {
          if (JSON.stringify(item) === JSON.stringify(this.rightExpandRow)) item._expanded = true
          return item
        })
        this.rightTableLoading = false
      }).catch(err => {
        this.rightTableLoading = false
        console.error(err)
      })
    },
    // 查询左侧表格展开数据
    fetchLeftExpandData () {
      this.fetchLeftTableExpandData('20')
    },
    // 将左侧选中订单添加到右侧选中运单
    moveOrders2Freight () {
      this.leftMoveToRight('/dispatch/add/order/to/waybill', {
        waybillId: this.rightSelectRow.row.waybillId,
        orderIds: this.leftSelection
      })
    },
    // 从运单移除
    removeOrdersFromFreight () {
      this.rightMoveToLeft('/dispatch/move/cargo/from/waybill/list', {
        waybillId: this.rightSelectRow.row.waybillId,
        orderIds: this.rightSelection
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "./dispatch.styl"
</style>
