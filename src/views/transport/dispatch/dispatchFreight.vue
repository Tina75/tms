<template>
  <div ref="$dispatch" class="dispatch">
    <div class="dispatch-part-fix">
      <div class="dispatch-part-title">可调度订单</div>
      <Table :width="500" :columns="leftTableHeader"
             :data="leftTableData" :loading="leftTableLoading && !leftTableData.length"
             highlight-row
             @on-row-click="leftTableRowClick"></Table>
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
        未发运运单

        <Button type="primary" style="float: right;" @click="createFreight">新建运单</Button>
      </div>
      <div v-if="!rightTableData.length && !rightTableLoading" class="dispatch-empty">
        <img src="../../../assets/img-empty.png" class="dispatch-empty-img">
        <p>暂无未发运运单，赶快创建新的运单吧～</p>
      </div>
      <div v-else>
        <Table
          :columns="rightTableHeader" :data="rightTableData" :loading="rightTableLoading && !rightTableData.length"
          highlight-row
          @on-expand="keepRightExpandOnly"
          @on-row-click="rightTableRowClick"></Table>
      </div>

    </div>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BasePage from '@/basic/BasePage'
import dispatchMixin from '../mixin/dispatchMixin'
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
          // fixed: 'left',
          render: (h, p) => {
            return h(tableExpand, {
              on: {
                'on-expand-select': (selection) => {
                  this.rightSelection = selection
                }
              },
              props: {
                // width: this.tableWidth - 20,
                tableLoading: this.rightTableExpandLoading,
                tableHeader: this.expandTableTypeTwo,
                tableData: this.rightTableExpandData
              }
            })
          }
        },
        {
          title: '运单号',
          key: 'waybillNo',
          // fixed: 'left',
          width: 180,
          render: (h, p) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: (e) => {
                  this.openTab({
                    title: p.row.waybillNo,
                    path: '/transport/detail/detailFreight',
                    query: { id: p.row.waybillId }
                  })
                  e.stopPropagation()
                }
              }
            }, p.row.waybillNo)
          }
        },
        {
          title: '始发地',
          key: 'start',
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.end))
          }
        },
        {
          title: '车牌号',
          key: 'carNo',
          width: 100,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.carNo)
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          width: 100,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.volume)
          }
        },
        {
          title: '重量(吨)',
          key: 'weight',
          width: 100,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.weight)
          }
        }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 新增运单
    createFreight () {
      this.openDialog({
        name: 'transport/dialog/createFreight',
        data: {
          title: '新增运单'
        },
        methods: {
          complete: () => {
            this.fetchRightTableData('waybillId')
          }
        }
      })
    },

    // 查询数据
    fetchData () {
      this.fetchLeftTableData('20')
      this.fetchRightTableData('waybillId')
    },

    // 查询右侧表格数据
    fetchRightTableData (id) {
      this.rightTableLoading = true
      Server({
        url: '/dispatch/waybill/list',
        method: 'get'
      }).then(res => {
        this.rightTableData = this.dataFilter(res.data.data.waybillList, ['_expanded', '_highlight'], item => {
          if (this.rightExpandRow && item[id] === this.rightExpandRow[id]) {
            item._expanded = true
            this.fetchRightExpandData()
          }
          return item
        })
        this.rightTableLoading = false
      }).catch(err => {
        this.rightTableLoading = false
        this.rightTableData = []
        console.error(err)
      })
    },

    // 查询表格展开项数据
    fetchLeftExpandData () {
      this.fetchLeftTableExpandData('20')
    },
    fetchRightExpandData () {
      this.rightTableExpandLoading = true
      Server({
        url: '/dispatch/waybill/order/list',
        method: 'get',
        data: {
          waybillId: this.rightExpandRow.waybillId
        }
      }).then(res => {
        this.rightTableExpandData = this.heightLightNewRow(res.data.data.waybillOrderList)
        this.rightTableExpandLoading = false
      }).catch(err => {
        this.rightTableExpandLoading = false
        this.rightTableExpandData = []
        console.error(err)
      })
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
  @import "../style/dispatch.styl"
</style>
