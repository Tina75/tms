<template>
  <div ref="$box" class="transport-page">
    <TabHeader :tabs="tabList" :type="tabType" @on-change="tabChanged"></TabHeader>

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
                transfer
                @on-change="resetEasySearch">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Input v-if="easySelectMode === 1"
               v-model="easySearchKeyword"
               :icon="easySearchKeyword ? 'ios-close-circle' : ''"
               :maxlength="20"
               placeholder="请输入运单号/提货单号/外转单号"
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
        <Input v-model="seniorSearchFields.billNo" :maxlength="20" placeholder="请输入运单号/提货单号/外转单号"  class="search-input-senior" />
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
        <Select v-model="seniorSearchFields.billType" transfer style="width:190px;" placeholder="请选择单据类型">
          <Option v-for="item in billTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>

      <div class="complex-query">
        <div>
          <DatePicker v-model="seniorSearchFields.dateRange" :options="timeOption" transfer type="daterange" split-panels placeholder="开始日期-结束日期" class="search-input-senior"></DatePicker>
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

    <!-- 表格 -->
    <div>
      <PageTable ref="$table"
                 :columns="tableColumns"
                 :show-filter="false"
                 :keywords="searchFields"
                 row-id="abnormalId"
                 url="/abnormal/list"
                 method="post"
                 list-field="list"
                 style="margin-top: 15px"
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
import SelectInputMixin from './mixin/selectInputMixin'

import TabHeader from './components/TabHeader'
import PageTable from '@/components/page-table'
import SelectInput from './components/SelectInput.vue'

import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
import { TAB_LIST, BUTTON_LIST, TABLE_COLUMNS, setTabList } from './constant/abnormal'

export default {
  name: 'AbnormalManager',
  components: { TabHeader, PageTable, SelectInput },
  mixins: [ BasePage, TransportBase, SelectInputMixin, TransportMixin ],
  metaInfo: { title: '异常管理' },
  data () {
    return {
      tabType: 'ABNORMAL',

      tabList: TAB_LIST, // 标签栏
      btnList: BUTTON_LIST(this), // 所有按钮组

      // 简易搜索类型
      selectList: [
        { value: 1, label: '单据号' },
        { value: 2, label: '承运商' },
        { value: 3, label: '车牌号' }
      ],

      // 单据类型
      billTypeList: [
        { value: 1, label: '提货单' },
        { value: 2, label: '外转单' },
        { value: 3, label: '运单' }
      ],

      // 高级搜索字段
      seniorSearchFields: {
        billNo: '', // 提货单号
        carrierName: '', // 承运商
        driverName: '', // 司机
        carNo: '', // 车牌号
        dateRange: ['', ''], // 日期范围
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        billType: '' // 单据类型 1 提货单 2 外转单 3 运单
      },

      // 表格操作栏
      tableActionColumn: {
        title: '操作',
        key: 'action',
        width: 80,
        extra: true,
        render: (h, p) => {
          return h('a', {
            on: {
              click: () => {
                // this.openAbnormalDialog(p.row.abnormalId)
              }
            }
          }, '处理')
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
        case '全部':
          this.triggerTableActionColumn(false)
          return
        case '未处理':
          this.triggerTableActionColumn(false)
          return 10
        case '已处理':
          this.triggerTableActionColumn(false)
          return 20
        default:
      }
    },

    // 单据类型code转name
    billTypeToName (code) {
      let name
      switch (code) {
        case 1:
          name = '提货单'
          break
        case 2:
          name = '外转单'
          break
        case 3:
          name = '运单'
          break
      }
      return name
    },

    // 查询标签页数量
    fetchTabCount () {
      Server({
        url: '/abnormal/tab/cnt',
        method: 'post'
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

    // 导出
    billExport () {
      let data = this.setFetchParams()
      data.pageNo = this.page.current
      data.pageSize = this.page.size
      delete data.order

      // if (this.tableSelection.length) {
      //   data.exportType = 1
      //   data.abnormalIds = this.tableSelection.map(item => item.abnormalId)
      // } else if (this.inSearching) data.exportType = 3
      // else data.exportType = 2

      data.abnormalIds = this.tableSelection.map(item => item.abnormalId)

      if (data.abnormalIds.length <= 0) {
        data.abnormalIds = null
      }

      Export({
        url: '/abnormal/export',
        method: 'post',
        data,
        fileName: '异常单明细'
      })
    },

    // 上报异常
    openAbnormalDialog (id) {
      const self = this
      self.openDialog({
        name: 'transport/dialog/abnormal',
        data: {
          id,
          type: 1 // 单据类型 1 提货单 2 外转单 3 运单
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
