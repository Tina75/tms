<template>
  <div ref="$box" class="transport-page">
    <TabHeader ref="$tab" :tabs="tabList" :type="tabType" @on-change="tabChanged"></TabHeader>

    <template v-if="tabStatus">
      <div class="easy-search-box">

        <!-- 按钮组 -->
        <div class="custom-style">
          <Button v-for="(item, key) in showButtons" :key="key"
                  :type="key === 0 ? 'primary' : 'default'"
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
                 placeholder="请输入运单号"
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
          <Input v-model="seniorSearchFields.waybillNo" :maxlength="20"  placeholder="请输入运单号" class="search-input-senior" />
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
            <AreaSelect v-model="seniorSearchFields.startCodes" placeholder="请输入始发地" class="search-input-senior" />
            <AreaSelect v-model="seniorSearchFields.endCodes" placeholder="请输入目的地" class="search-input-senior" />
            <DatePicker v-model="seniorSearchFields.dateRange" type="daterange" split-panels placeholder="开始日期-结束日期" class="search-input-senior"></DatePicker>
          </div>
          <div>
            <Button type="primary"
                    @click="startSearch">搜索</Button>
            <Button type="default"
                    @click="resetSeniorSearch()">清除条件</Button>
            <Button type="default"
                    style="margin-right: 0;"
                    @click="changeSearchType">简易搜索</Button>
          </div>
        </div>

      </div>
    </template>

    <OrderTabContent
      v-if="!tabStatus"
      source="transport"
      tab-status="待送货"
      url="/load/bill/wait/pick/list"
      export-url="/load/bill/pick/up/export"
      @refresh-tab="fetchTabCount" />

    <!-- 表格 -->
    <div v-else>
      <PageTable ref="$table"
                 :columns="tableColumns"
                 :extra-columns="extraColumns"
                 :show-filter="true"
                 :keywords="searchFields"
                 row-id="waybillId"
                 url="/waybill/list"
                 method="post"
                 list-field="waybillList"
                 style="margin-top: 15px"
                 @on-column-change="tableColumnsChanged"
                 @on-selection-change="selectionChanged"
                 @on-sort-change="tableSort"
                 @on-change="pageChange"
                 @on-page-size-change="pageSizeChange"
                 @on-load="dataOnload" />
    </div>

    <PrintFreight ref="$printer" :data="printData" />
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TransportBase from './mixin/transportBase'
import TransportMixin from './mixin/transportMixin'
import SelectInputMixin from './mixin/selectInputMixin'

import TabHeader from './components/TabHeader'
import PageTable from '@/components/page-table'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from './components/SelectInput.vue'
import PrintFreight from './components/PrintFreight'
import OrderTabContent from '@/views/order-management/components/TabContent'

import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
import { TAB_LIST, BUTTON_LIST, TABLE_COLUMNS, EXTRA_COLUMNS, setTabList } from './constant/waybill'

export default {
  name: 'WaybillManager',
  components: { TabHeader, PageTable, AreaSelect, SelectInput, PrintFreight, OrderTabContent },
  mixins: [ BasePage, TransportBase, SelectInputMixin, TransportMixin ],
  metaInfo: { title: '运单管理' },
  data () {
    return {
      tabType: 'WAYBILL',

      tabList: TAB_LIST, // 标签栏
      btnList: BUTTON_LIST(this), // 所有按钮组

      // 简易搜索类型
      selectList: [
        { value: 1, label: '运单号' },
        { value: 2, label: '承运商' },
        { value: 3, label: '车牌号' }
      ],

      // 高级搜索字段
      seniorSearchFields: {
        waybillNo: '', // 运单号
        carrierName: '', // 承运商
        driverName: '', // 司机
        carNo: '', // 车牌号
        startCodes: [], // 始发地codes
        endCodes: [], // 目的地codes
        start: '', // 始发地
        end: '', // 目的地
        dateRange: ['', ''], // 日期范围
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },

      // 表格操作栏
      tableActionColumn: {
        title: '操作',
        key: 'action',
        width: 60,
        fixed: 'left',
        extra: true,
        render: (h, p) => {
          if (p.row.status === 1 && this.hasPower(120101)) {
            return h('a', {
              on: {
                click: () => {
                  this.billSendCar(p.row.waybillId)
                }
              }
            }, '派车')
          }
        }
      },

      tableColumns: TABLE_COLUMNS(this), // 表头
      extraColumns: EXTRA_COLUMNS // 表头筛选
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
        case '待派车':
          this.triggerTableActionColumn(true)
          return 1
        case '待发运':
          this.triggerTableActionColumn(false)
          return 2
        case '在途':
          this.triggerTableActionColumn(false)
          return 3
        case '已到货':
          this.triggerTableActionColumn(false)
          return 4
        default:
      }
    },

    // 查询标签页数量
    fetchTabCount () {
      Server({
        url: '/waybill/tab/cnt',
        method: 'get'
      }).then(res => {
        this.tabList = setTabList(res.data.data)
      })
    },

    // 表格数据查询完成回调
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
        url: '/waybill/batchPrint',
        method: 'post',
        data: { waybillIds: this.tableSelection.map(item => item.waybillId) }
      }).then(res => {
        this.printData = res.data.data
        this.$refs.$printer.print()
      })
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
              url: '/waybill/delete',
              method: 'delete',
              data: { waybillIds: self.tableSelection.map(item => item.waybillId) }
            }).then(res => {
              self.$Message.success('删除成功')
              self.clearSelectedAndFetch()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 位置
    billLocation () {
      if (!this.checkTableSelection()) return
      Server({
        url: '/waybill/location',
        method: 'post',
        data: { waybillIds: this.tableSelection.map(item => item.waybillId) }
      }).then(res => {
        const points = res.data.data.list
        if (!points.length) {
          this.$Message.warning('暂无位置')
          return
        }
        this.openDialog({
          name: 'transport/dialog/map',
          data: { points },
          methods: {}
        })
      }).catch(err => console.error(err))
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
              url: '/waybill/confirm/arrival',
              method: 'post',
              data: { waybillIds: self.tableSelection.map(item => item.waybillId) }
            }).then(res => {
              self.$Message.success('操作成功')
              self.clearSelectedAndFetch()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 发运
    billShipment () {
      const self = this
      if (!this.checkTableSelection()) return
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '发运',
          message: '是否发运？发运以后将不能再修改运单信息'
        },
        methods: {
          confirm () {
            Server({
              url: '/waybill/shipment',
              method: 'post',
              data: { waybillIds: self.tableSelection.map(item => item.waybillId) }
            }).then(res => {
              self.$Message.success('操作成功')
              self.clearSelectedAndFetch()
            }).catch(err => console.error(err))
          }
        }
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
        data.waybillIds = this.tableSelection.map(item => item.waybillId)
      } else if (this.inSearching) data.exportType = 3
      else data.exportType = 2

      Export({
        url: '/waybill/export',
        method: 'post',
        data,
        fileName: '运单明细'
      })
    },

    // 派车
    billSendCar (id) {
      const self = this
      Server({
        url: '/waybill/check/order',
        method: 'post',
        data: { waybillIds: [id] }
      }).then(() => {
        self.openDialog({
          name: 'transport/dialog/action',
          data: {
            id,
            type: 'sendCar'
          },
          methods: {
            complete () {
              self.clearSelectedAndFetch()
            }
          }
        })
      })
    }
  }
}
</script>

<style lang='stylus'>
  @import './style/transport.styl'
</style>
