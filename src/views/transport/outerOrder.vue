<template>
  <div ref="$box" class="transport-page">
    <TabHeader :tabs="tabList" :type="tabType" @on-change="tabChanged"></TabHeader>

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

        <SelectInput v-if="easySelectMode === 1"
                     v-model="easySearchKeyword"
                     mode="transferee"
                     placeholder="请输入外转方名称"
                     clearable
                     class="search-input"
                     @on-clear="resetEasySearch" />

        <Input v-if="easySelectMode === 2"
               v-model="easySearchKeyword"
               :icon="easySearchKeyword ? 'ios-close-circle' : ''"
               :maxlength="20"
               placeholder="请输入订单号"
               class="search-input"
               @on-click="resetEasySearch" />

        <Input v-if="easySelectMode === 3"
               v-model="easySearchKeyword"
               :icon="easySearchKeyword ? 'ios-close-circle' : ''"
               :maxlength="20"
               placeholder="请输入外转单号"
               class="search-input"
               @on-click="resetEasySearch" />

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
        <SelectInput v-model="seniorSearchFields.consignerName"
                     mode="consigner"
                     placeholder="请输入客户名称"
                     class="search-input-senior" />

        <Input v-model="seniorSearchFields.orderNo" :maxlength="20" placeholder="请输入订单号" class="search-input-senior" />
        <Input v-model="seniorSearchFields.customerOrderNo" :maxlength="20" placeholder="请输入客户订单号" class="search-input-senior" />
        <Input v-model="seniorSearchFields.transNo" :maxlength="20" placeholder="请输入外转单号" class="search-input-senior" />

        <SelectInput v-model="seniorSearchFields.transfereeName"
                     mode="transferee"
                     placeholder="请输入外转方名称"
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

    <!-- 表格 -->
    <div>
      <PageTable ref="$table"
                 :columns="tableColumns"
                 :extra-columns="extraColumns"
                 :show-filter="true"
                 :keywords="searchFields"
                 row-id="transId"
                 url="/outside/bill/list"
                 method="post"
                 list-field="list"
                 style="margin-top: 15px"
                 @on-column-change="tableColumnsChanged"
                 @on-selection-change="selectionChanged"
                 @on-sort-change="tableSort"
                 @on-change="pageChange"
                 @on-page-size-change="pageSizeChange"
                 @on-load="dataOnload" />
    </div>

  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TransportBase from './mixin/transportBase'
import TransportMixin from './mixin/transportMixin'

import TabHeader from './components/TabHeader'
import PageTable from '@/components/page-table'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from './components/SelectInput.vue'

import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
import { TAB_LIST, BUTTON_LIST, TABLE_COLUMNS, EXTRA_COLUMNS, setTabList } from './constant/outer'

export default {
  name: 'OuterManager',
  components: { TabHeader, PageTable, AreaSelect, SelectInput },
  mixins: [ BasePage, TransportBase, TransportMixin ],
  metaInfo: { title: '外转单管理' },
  data () {
    return {
      tabType: 'OUTER',
      tabList: TAB_LIST, // 标签栏
      btnList: BUTTON_LIST(this), // 所有按钮组

      // 简易搜索类型
      selectList: [
        { value: 1, label: '外转方名称' },
        { value: 2, label: '订单号' },
        { value: 3, label: '外转单号' }
      ],

      // 高级搜索字段
      seniorSearchFields: {
        consignerName: '', // 客户名称
        orderNo: '', // 订单号
        customerOrderNo: '', // 客户订单号
        transNo: '', // 外转单号
        transfereeName: '', // 外转方名称
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
        width: 120,
        fixed: 'left',
        extra: true,
        render: (h, p) => {
          if (p.row.status === 1 && this.hasPower(120301)) {
            return h('a', {
              on: {
                click: () => {
                  this.billShipment([p.row.transId])
                }
              }
            }, '发运')
          } else if (p.row.status === 2 && this.hasPower(120302)) {
            return h('a', {
              on: {
                click: () => {
                  this.billArrived([p.row.transId])
                }
              }
            }, '到货')
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
        case '全部':
          this.triggerTableActionColumn(true)
          return
        case '待发运':
          this.triggerTableActionColumn(true)
          return 1
        case '在途':
          this.triggerTableActionColumn(true)
          return 2
        case '已到货':
          this.triggerTableActionColumn(false)
          return 3
        default:
      }
    },

    // 表格数据查询完成回调
    dataOnload (res) {
      const data = res.data.data
      this.page.current = data.pageNo
      this.page.size = data.pageSize
      this.tabList = setTabList(data)
    },

    // 删除
    billDelete (ids) {
      let transIds
      if (ids && ids.length) transIds = ids
      else if (this.tableSelection.length) transIds = this.tableSelection.map(item => item.transId)
      else {
        this.$Message.error('请先选择后再操作')
        return
      }

      const self = this
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '删除确认',
          message: '是否确认删除？'
        },
        methods: {
          confirm () {
            Server({
              url: '/outside/bill/delete',
              method: 'delete',
              data: { transIds }
            }).then(res => {
              self.$Message.success('删除成功')
              self.clearSelectedAndFetch()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 到货
    billArrived (ids) {
      const self = this
      let transIds
      if (ids && ids.length) transIds = ids
      else if (this.tableSelection.length) transIds = this.tableSelection.map(item => item.transId)
      else {
        this.$Message.error('请先选择后再操作')
        return
      }
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '到货确认',
          message: '是否确认到货？'
        },
        methods: {
          confirm () {
            Server({
              url: '/outside/bill/confirm/arrival',
              method: 'post',
              data: { transIds }
            }).then(res => {
              self.$Message.success('操作成功')
              self.clearSelectedAndFetch()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 发运
    billShipment (ids) {
      let transIds
      if (ids && ids.length) transIds = ids
      else if (this.tableSelection.length) transIds = this.tableSelection.map(item => item.transId)
      else {
        this.$Message.error('请先选择后再操作')
        return
      }

      const self = this
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '发运',
          message: '是否发运？发运以后将不能再修改外转单信息'
        },
        methods: {
          confirm () {
            Server({
              url: '/outside/bill/send',
              method: 'post',
              data: { transIds }
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
        data.transIds = this.tableSelection.map(item => item.transId)
      } else if (this.inSearching) data.exportType = 3
      else data.exportType = 2

      Export({
        url: '/outside/bill/export',
        method: 'post',
        data,
        fileName: '外转单明细'
      })
    }
  }
}
</script>

<style lang='stylus'>
  @import './style/transport.styl'
</style>
