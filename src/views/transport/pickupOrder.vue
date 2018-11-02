<template>
  <div ref="$box" class="transport-page">
    <TabHeader :tabs="tabList" :type="tabType" @on-change="tabChanged"></TabHeader>

    <template v-if="tabStatus">
      <div class="easy-search-box">

        <!-- 按钮组 -->
        <div class="custom-style">
          <Button v-for="(item, key) in showButtons" :key="key"
                  :type="key === 0 ? 'primary' : 'default'"
                  class="action-btn"
                  @click="item.func">{{ item.name }}</Button>
        </div>

        <!-- 简易搜索 -->
        <div v-if="isEasySearch" class="right custom-style">
          <Select v-model="easySelectMode"
                  style="width:120px; margin-right: 11px"
                  @on-change="resetEasySearch">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <Input v-if="easySelectMode === 1"
                 v-model="easySearchKeyword"
                 :icon="easySearchKeyword ? 'ios-close-circle' : ''"
                 :maxlength="20"
                 placeholder="请输入提货单号"
                 class="search-input"
                 @on-click="resetEasySearch" />

          <SelectInput v-if="easySelectMode === 2" v-model="easySearchKeyword"
                       mode="carrier"
                       placeholder="请输入承运商"
                       clearable
                       class="search-input"
                       @on-select="selectCarrierHandler"
                       @on-clear="resetEasySearch" />

          <SelectInput v-if="easySelectMode === 3" v-model="easySearchKeyword"
                       :carrier-id="carrierId"
                       mode="carNo"
                       placeholder="请输入车牌号"
                       clearable
                       class="search-input"
                       @on-clear="resetEasySearch" />

          <Button icon="ios-search" type="primary"
                  class="search-btn-easy"
                  @click="startSearch"></Button>

          <Button class="senior-search"
                  type="text" size="small"
                  @click="changeSearchType">高级搜索</Button>
        </div>
      </div>

      <!-- 高级搜索 -->
      <div v-if="!isEasySearch" class="operate-box custom-style">

        <div style="margin-bottom: 10px;">
          <Input v-model="seniorSearchFields.pickupNo" :maxlength="20" placeholder="请输入提货单号"  class="search-input-senior" />
          <SelectInput v-model="seniorSearchFields.carrierName"
                       mode="carrier"
                       placeholder="请输入承运商"
                       class="search-input-senior"
                       @on-select="selectCarrierHandler" />
          <SelectInput v-model="seniorSearchFields.driverName"
                       :carrier-id="carrierId"
                       mode="driver"
                       placeholder="请输入司机"
                       class="search-input-senior" />
          <SelectInput v-model="seniorSearchFields.carNo"
                       :carrier-id="carrierId"
                       mode="carNo"
                       placeholder="请输入车牌号"
                       class="search-input-senior" />
        </div>

        <div style="display: flex;justify-content: space-between;">
          <div>
            <DatePicker v-model="seniorSearchFields.dateRange" type="daterange" split-panels placeholder="开始日期-结束日期" class="search-input-senior"></DatePicker>
          </div>
          <div>
            <Button type="primary"
                    class="action-btn"
                    @click="startSearch">搜索</Button>
            <Button type="default"
                    class="action-btn"
                    @click="resetSeniorSearch()">清除条件</Button>
            <Button type="default"
                    style="margin-right: 0;"
                    class="action-btn"
                    @click="changeSearchType">简易搜索</Button>
          </div>
        </div>

      </div>
    </template>

    <OrderTabContent
      v-if="!tabStatus"
      :table-head-source="dispatchHeadType"
      source="pickup"
      tab-status="待提货"
      url="/load/bill/wait/pick/list"
      export-url="/load/bill/pick/up/export"
      @refresh-tab="fetchTabCount" />

    <!-- 表格 -->
    <div v-else>
      <PageTable ref="$table"
                 :columns="tableColumns"
                 :show-filter="true"
                 :keywords="searchFields"
                 :table-head-type="pickupHeadType"
                 row-id="pickUpId"
                 url="/load/bill/list"
                 method="post"
                 list-field="loadbillList"
                 style="margin-top: 15px"
                 @on-selection-change="selectionChanged"
                 @on-sort-change="tableSort"
                 @on-change="pageChange"
                 @on-page-size-change="pageSizeChange"
                 @on-load="dataOnload" />
    </div>

    <PrintPickup ref="$printer" :data="printData" />
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TransportBase from './mixin/transportBase'
import TransportMixin from './mixin/transportMixin'
import SelectInputMixin from './mixin/selectInputMixin'

import TabHeader from './components/TabHeader'
import PageTable from '@/components/page-table'
import SelectInput from './components/SelectInput.vue'
import PrintPickup from './components/PrintPickup'
import OrderTabContent from '@/views/order-management/components/TabContent'

import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
import { TAB_LIST, BUTTON_LIST, TABLE_COLUMNS, setTabList } from './constant/pickup'
import headType from '@/libs/constant/headtype'

export default {
  name: 'ReceiveManager',
  components: { TabHeader, PageTable, SelectInput, PrintPickup, OrderTabContent },
  mixins: [ BasePage, TransportBase, SelectInputMixin, TransportMixin ],
  metaInfo: { title: '提货管理' },
  data () {
    return {
      tabType: 'PICKUP',
      pickupHeadType: headType.PICKUP,
      dispatchHeadType: headType.WAIT_PICKUP,

      tabList: TAB_LIST, // 标签栏
      btnList: BUTTON_LIST(this), // 所有按钮组

      // 简易搜索类型
      selectList: [
        { value: 1, label: '提货单号' },
        { value: 2, label: '承运商' },
        { value: 3, label: '车牌号' }
      ],

      // 高级搜索字段
      seniorSearchFields: {
        pickupNo: '', // 提货单号
        carrierName: '', // 承运商
        driverName: '', // 司机
        carNo: '', // 车牌号
        dateRange: ['', ''], // 日期范围
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },

      // 表格操作栏
      tableActionColumn: {
        title: '操作',
        key: 'action',
        width: 80,
        fixed: 'left',
        extra: true,
        render: (h, p) => {
          if (p.row.status === 1 && this.hasPower(120201)) {
            return h('a', {
              on: {
                click: () => {
                  this.billPickup(p.row.pickUpId)
                }
              }
            }, '提货')
          } else if (p.row.status > 1) {
            return h('a', {
              on: {
                click: () => {
                  this.openAbnormalDialog(p.row.pickUpId)
                }
              }
            }, '上报异常')
          }
        }
      },

      tableColumns: TABLE_COLUMNS(this) // 表头
    }
  },

  methods: {
    // 设置标签状态
    setTabStatus (tab) {
      switch (tab) {
        // case '全部':
        //   this.triggerTableActionColumn(true)
        //   return
        case '待调度': return
        case '待提货':
          this.triggerTableActionColumn(true)
          return 1
        case '提货中':
          this.triggerTableActionColumn(true)
          return 2
        case '已提货':
          this.triggerTableActionColumn(true)
          return 3
        default:
      }
    },

    // 查询标签页数量
    fetchTabCount () {
      Server({
        url: '/load/bill/tab/cnt',
        method: 'get'
      }).then(res => {
        this.tabList = setTabList(res.data.data)
      })
    },

    // 数据查询
    dataOnload (res) {
      const data = res.data.data
      this.page.current = data.pageNo
      this.page.size = data.pageSize
      // this.$forceUpdate()
    },

    // 打印
    billPrint () {
      if (!this.checkTableSelection()) return
      Server({
        url: '/load/bill/batchPrint',
        method: 'post',
        data: { pickUpIds: this.tableSelection.map(item => item.pickUpId) }
      }).then(res => {
        this.printData = res.data.data
        this.$refs.$printer.print()
      })
    },

    // 导出
    billExport () {
      let data = this.setFetchParams()
      data.pageNo = this.page.current
      data.pageSize = this.page.size
      delete data.order

      if (this.tableSelection.length) {
        data.exportType = 1
        data.pickUpIds = this.tableSelection.map(item => item.pickUpId)
      } else if (this.inSearching) data.exportType = 3
      else data.exportType = 2

      Export({
        url: '/load/bill/export',
        method: 'post',
        data,
        fileName: '提货单明细'
      })
    },

    // 位置
    billLocation () {
      if (!this.checkTableSelection()) return
      let pickUpIds = this.tableSelection.map(item => item.pickUpId)
      let data = pickUpIds.length > 1 ? ({ pickUpIds }) : ({ pickUpId: pickUpIds[0] })
      Server({
        url: pickUpIds.length > 1 ? '/load/bill/location' : '/load/bill/single/location',
        method: 'post',
        data
      }).then(res => {
        let cars
        if (pickUpIds.length > 1) {
          if (!res.data.data.list.length) {
            this.$Message.warning('暂无车辆位置信息')
            return
          }
          cars = res.data.data.list
        } else {
          if (!res.data.data.points.length) {
            this.$Message.warning('暂无车辆位置信息')
            return
          }
          cars = [res.data.data]
        }
        this.openDialog({
          name: 'transport/dialog/map',
          data: {
            cars,
            multiple: pickUpIds.length !== 1
          },
          methods: {}
        })
      }).catch(err => console.error(err))
    },

    // 删除
    billDelete () {
      const self = this
      if (!this.checkTableSelection()) return
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '删除确认',
          message: '是否确认删除？'
        },
        methods: {
          confirm () {
            Server({
              url: '/load/bill/delete',
              method: 'delete',
              data: { pickUpIds: self.tableSelection.map(item => item.pickUpId) }
            }).then(res => {
              self.$Message.success('删除成功')
              self.clearSelectedAndFetch()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 到货
    billArrived () {
      const self = this
      if (!this.checkTableSelection()) return
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '到货确认',
          message: '是否确认到货？'
        },
        methods: {
          confirm () {
            Server({
              url: '/load/bill/confirm/arrival',
              method: 'post',
              data: { pickUpIds: self.tableSelection.map(item => item.pickUpId) }
            }).then(res => {
              self.$Message.success('操作成功')
              self.clearSelectedAndFetch()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 提货
    billPickup (id) {
      const self = this
      Server({
        url: '/load/bill/check/order',
        method: 'post',
        data: { pickUpId: id }
      }).then(() => {
        self.openDialog({
          name: 'transport/dialog/action',
          data: {
            id,
            type: 'pickUp'
          },
          methods: {
            complete () {
              self.clearSelectedAndFetch()
            }
          }
        })
      })
    },

    // 上报异常
    openAbnormalDialog (id) {
      const self = this
      self.openDialog({
        name: 'transport/dialog/abnormal',
        data: {
          id
        },
        methods: {
          complete () {
            self.clearSelectedAndFetch()
          }
        }
      })
    }
  }
}
</script>

<style lang='stylus'>
  @import './style/transport.styl'
</style>
