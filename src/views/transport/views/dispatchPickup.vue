<template>
  <div ref="$dispatch" class="dispatch">
    <div class="dispatch-part">
      <div class="dispatch-part-title">可提货订单</div>
      <Table :columns="leftTableHeader" :data="leftTableData"
             :loading="leftTableLoading && !leftTableData.length"
             @on-expand="keepLeftExpandOnly"></Table>
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

        <Button type="primary" style="float: right;" @click="createFreight">新建提货单</Button>
      </div>
      <Table :columns="rightTableHeader" :data="rightTableData" :loading="rightTableLoading && !rightTableData.length"
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
                tableHeader: this.expandTableTypeOne,
                tableDataFunc: () => {
                  return p.row.loadbillOrderList
                }
              }
            })
          }
        },
        {
          title: '提货单号',
          key: 'loadbillNo',
          render: (h, p) => {
            return h('span', {
              style: {
                color: '#418DF9'
              }
            }, p.row.loadbillNo)
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
        name: 'transport/dialog/createPickup',
        data: {
          title: '新增提货单'
        },
        methods: {
          complete: () => {
            this.fetchRightTableData()
          }
        }
      })
    },

    fetchData () {
      this.fetchLeftTableData('10')
      this.fetchRightTableData()
    },
    // 查询右侧表格数据
    fetchRightTableData () {
      this.rightTableLoading = true
      Server({
        url: '/dispatch/loadbill/list',
        method: 'get'
      }).then(res => {
        this.rightTableData = this.dataFilter(res.data.data.loadbillList, '_expanded', item => {
          if (JSON.stringify(item) === JSON.stringify(this.rightExpandRow)) item._expanded = true
          return item
        })
        this.rightTableLoading = false
      }).catch(err => console.error(err))
    },
    // 查询左侧表格展开数据
    fetchLeftExpandData () {
      this.fetchLeftTableExpandData('10')
    },
    // 将左侧选中订单添加到右侧选中运单
    moveOrders2Pickup () {
      this.leftMoveToRight('/dispatch/add/order/to/loadbill', {
        loadbillId: this.rightSelectRow.row.loadbillId,
        orderIds: this.leftSelection
      })
    },
    // 从提货单移除
    removeOrdersFromPickup () {
      this.rightMoveToLeft('/dispatch/move/cargo/from/loadbill/list', {
        loadbillId: this.rightSelectRow.row.loadbillId,
        orderIds: this.rightSelection
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "./dispatch.styl"
</style>
