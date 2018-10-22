<template>
  <div ref="$dispatch" class="dispatch">
    <div class="dispatch-part-fix">
      <div class="dispatch-part-title">可提货订单</div>
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
                @click="moveOrders2Pickup">加入</Button>
        <br><br>
        <Button :disabled="!rightSelection.length" type="primary"
                icon="ios-arrow-back"
                @click="removeOrdersFromPickup">移除</Button>
      </div>

    </div>

    <div class="dispatch-part">
      <div class="dispatch-part-title">
        未提货提货单

        <Button type="primary" style="float: right;" @click="createPickup">新建提货单</Button>
      </div>
      <div v-if="!rightTableData.length && !rightTableLoading" class="dispatch-empty">
        <img src="../../../assets/img-empty.png" class="dispatch-empty-img">
        <p>暂无未提货提货单，赶快创建新的提货单吧～</p>
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
                tableHeader: this.expandTableTypeOne,
                tableData: this.rightTableExpandData
              }
            })
          }
        },
        {
          title: '提货单号',
          key: 'loadbillNo',
          width: 180,
          // fixed: 'left',
          render: (h, p) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: (e) => {
                  this.openTab({
                    title: p.row.loadbillNo,
                    path: '/transport/detail/detailPickup',
                    query: { id: p.row.loadbillId }
                  })
                  e.stopPropagation()
                }
              }
            }, p.row.loadbillNo)
          }
        },
        {
          title: '车牌号',
          key: 'carNo',
          minWidth: 100,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.carNo)
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          minWidth: 100,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.volume)
          }
        },
        {
          title: '重量(吨)',
          key: 'weight',
          minWidth: 100,
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
    // 新增提货单
    createPickup () {
      this.openDialog({
        name: 'transport/dialog/createPickup',
        data: {
          title: '新增提货单'
        },
        methods: {
          complete: () => {
            this.fetchRightTableData('loadbillId')
          }
        }
      })
    },

    // 查询数据
    fetchData () {
      this.fetchLeftTableData('10')
      this.fetchRightTableData('loadbillId')
    },

    // 查询右侧表格数据
    fetchRightTableData (id) {
      this.rightTableLoading = true
      Server({
        url: '/dispatch/loadbill/list',
        method: 'get'
      }).then(res => {
        this.rightTableData = this.dataFilter(res.data.data.loadbillList, ['_expanded', '_highlight'], item => {
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
      this.fetchLeftTableExpandData('10')
    },
    fetchRightExpandData () {
      this.rightTableExpandLoading = true
      Server({
        url: '/dispatch/loadbill/order/list',
        method: 'get',
        data: {
          loadbillId: this.rightExpandRow.loadbillId
        }
      }).then(res => {
        this.rightTableExpandData = this.heightLightNewRow(res.data.data.loadbillOrderList)
        this.rightTableExpandLoading = false
      }).catch(err => {
        this.rightTableExpandLoading = false
        this.rightTableExpandData = []
        console.error(err)
      })
    },

    // 将左侧选中订单添加到右侧选中运单
    moveOrders2Pickup () {
      this.leftMoveToRight('/dispatch/add/order/to/loadbill', {
        pickUpId: this.rightSelectRow.row.loadbillId,
        orderIds: this.leftSelection
      })
    },

    // 从提货单移除
    removeOrdersFromPickup () {
      this.rightMoveToLeft('/dispatch/move/cargo/from/loadbill/list', {
        pickUpId: this.rightSelectRow.row.loadbillId,
        orderIds: this.rightSelection
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "./dispatch.styl"
</style>
