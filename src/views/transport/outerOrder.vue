<template>
  <div>
    <TabHeader :tabs="tabList" @tabChange="tabChanged"></TabHeader>

    <div style="margin-top: 30px;display: flex;justify-content: space-between;">

      <!-- 按钮组 -->
      <div>
        <Button v-for="(item, key) in currentBtns" :key="key"
                :type="key === 0 ? 'primary' : 'default'"
                @click="item.func">{{ item.name }}</Button>
      </div>

      <!-- 简易搜索 -->
      <div v-if="isEasySearch" class="right">
        <Select v-model="easySelectMode"
                style="width:120px; margin-right: 11px"
                @0n-change="resetEasySearch">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Input v-if="easySelectMode === 1"
               v-model="easySearchKeyword"
               :icon="easySearchKeyword ? 'ios-close-circle' : ''"
               placeholder="请输入外转方名称"
               class="search-input"
               @on-click="resetEasySearch" />

        <Input v-if="easySelectMode === 2"
               v-model="easySearchKeyword"
               :icon="easySearchKeyword ? 'ios-close-circle' : ''"
               placeholder="请输入订单号"
               class="search-input"
               @on-click="resetEasySearch" />

        <Input v-if="easySelectMode === 3"
               v-model="easySearchKeyword"
               :icon="easySearchKeyword ? 'ios-close-circle' : ''"
               placeholder="请输入外转单号"
               class="search-input"
               @on-click="resetEasySearch" />

        <Button icon="ios-search"
                style="width: 40px; margin-left: -2px;" @click="startSearch"></Button>

        <Button class="senior-search"
                type="text" size="small"
                @click="changeSearchType">高级搜索</Button>
      </div>
    </div>

    <!-- 高级搜索 -->
    <div v-if="!isEasySearch" class="operate-box">

      <div style="margin-bottom: 10px;">
        <Input v-model="seniorSearchFields.consignerName" placeholder="请输入客户名称" class="search-input-senior" />
        <Input v-model="seniorSearchFields.orderNo" placeholder="请输入订单号" class="search-input-senior" />
        <Input v-model="seniorSearchFields.customerOrderNo" placeholder="请输入客户订单号" class="search-input-senior" />
        <Input v-model="seniorSearchFields.transNo" placeholder="请输入外转单号" class="search-input-senior" />
        <Input v-model="seniorSearchFields.transfereeName" placeholder="请输入外转方名称" class="search-input-senior" />
      </div>

      <div style="display: flex;justify-content: space-between;">
        <div>
          <AreaSelect v-model="seniorSearchFields.start" placeholder="请输入始发地" class="search-input-senior" />
          <AreaSelect v-model="seniorSearchFields.end" placeholder="请输入目的地" class="search-input-senior" />
          <DatePicker type="daterange" split-panels placeholder="开始日期-结束日期" class="search-input-senior"></DatePicker>
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
    <PageTable :columns="tableColumns"
               :extra-columns="extraColumns"
               :data="tableData"
               :show-filter="true"
               :show-pagination="false"
               style="margin-top: 15px"
               @on-column-change="tableColumnsChanged"
               @on-selection-change="selectionChanged"></PageTable>

    <Page :total="page.total"
          :current="page.current"
          :page-size="page.size"
          :page-size-opts="[10,20,50]"
          class="table-pagination"
          size="small"
          show-sizer
          show-elevator
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"></Page>

  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from '@/components/TabHeader'
import PageTable from '@/components/page-table'
import AreaSelect from '@/components/AreaSelect'
import TransportMixin from './transportMixin'
import Server from '@/libs/js/server'

export default {
  name: 'OuterManager',
  components: { TabHeader, PageTable, AreaSelect },
  mixins: [ BasePage, TransportMixin ],
  metaInfo: { title: '外转单管理' },
  data () {
    return {
      // 标签栏
      tabList: [
        { name: '全部', count: '' },
        { name: '待发运', count: '' },
        { name: '在途', count: '' },
        { name: '已到货', count: '' }
      ],

      // 所有按钮组
      btnList: [
        {
          tab: '全部',
          btns: [{
            name: '发运',
            func: () => console.log(Math.random())
          }, {
            name: '到货',
            func: () => console.log(Math.random())
          }, {
            name: '删除',
            func: () => console.log(Math.random())
          }, {
            name: '导出',
            func: () => console.log(Math.random())
          }]
        },
        {
          tab: '待发运',
          btns: [{
            name: '发运',
            func: () => console.log(Math.random())
          }, {
            name: '删除',
            func: () => console.log(Math.random())
          }, {
            name: '导出',
            func: () => console.log(Math.random())
          }]
        },
        {
          tab: '在途',
          btns: [{
            name: '到货',
            func: () => console.log(Math.random())
          }, {
            name: '导出',
            func: () => console.log(Math.random())
          }]
        },
        {
          tab: '已到货',
          btns: [{
            name: '导出',
            func: () => console.log(Math.random())
          }]
        }
      ],

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
        start: '', // 始发地
        end: '', // 目的地
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },

      tableColumns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '操作',
          key: 'do',
          width: 100,
          extra: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  click: () => {

                  }
                },
                style: {
                  marginRight: '10px'
                }
              }, '发运'),
              h('a', {
                on: {
                  click: () => {

                  }
                }
              }, '删除')
            ])
          }
        },
        {
          title: '外转单号',
          key: 'transNo',
          width: 160,
          fixed: true,
          visible: true,
          render: (h, p) => {
            return h('a', {
              style: {
                color: '#418DF9'
              }
            }, p.row.transNo)
          }
        },
        {
          title: '订单号',
          key: 'orderNo'
        },
        {
          title: '外转方运单号',
          key: 'outTransNo'
        },
        {
          title: '外转方名称',
          key: 'transfereeName'
        },
        {
          title: '始发地',
          key: 'start'
        },
        {
          title: '目的地',
          key: 'end'
        },
        {
          title: '外转运费（元）',
          key: 'transFee'
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        },
        {
          title: '外转时间',
          key: 'createTimeLong'
        }
      ],

      extraColumns: [
        {
          title: '外转单号',
          key: 'transNo',
          fixed: true,
          visible: true
        },
        {
          title: '订单号',
          key: 'orderNo',
          fixed: false,
          visible: true
        },
        {
          title: '外转方运单号',
          key: 'outTransNo',
          fixed: false,
          visible: true
        },
        {
          title: '外转方名称',
          key: 'transfereeName',
          fixed: false,
          visible: true
        },
        {
          title: '始发地',
          key: 'start',
          fixed: false,
          visible: true
        },
        {
          title: '目的地',
          key: 'end',
          fixed: false,
          visible: true
        },
        {
          title: '外转运费（元）',
          key: 'transFee',
          fixed: false,
          visible: true
        },
        {
          title: '体积（方）',
          key: 'volume',
          fixed: false,
          visible: true
        },
        {
          title: '重量（吨）',
          key: 'weight',
          fixed: false,
          visible: true
        },
        {
          title: '外转时间',
          key: 'createTimeLong',
          fixed: false,
          visible: true
        },
        {
          title: '客户订单号',
          key: 'x1',
          fixed: false,
          visible: false
        },
        {
          title: '客户名称',
          key: 'x2',
          fixed: false,
          visible: false
        },
        {
          title: '发货人',
          key: 'x3',
          fixed: false,
          visible: false
        },
        {
          title: '发货人手机号码',
          key: 'x4',
          fixed: false,
          visible: false
        },
        {
          title: '收货人',
          key: 'x5',
          fixed: false,
          visible: false
        },
        {
          title: '收货人手机号码',
          key: 'x6',
          fixed: false,
          visible: false
        },
        {
          title: '货值',
          key: 'x7',
          fixed: false,
          visible: false
        },
        {
          title: '付款方式',
          key: 'settlementType',
          fixed: false,
          visible: false
        },
        {
          title: '要求装货时间',
          key: 'x8',
          fixed: false,
          visible: false
        },
        {
          title: '期望到货时间',
          key: 'x9',
          fixed: false,
          visible: false
        },
        {
          title: '订单数',
          key: 'orderCnt',
          fixed: false,
          visible: false
        },
        {
          title: '回单数',
          key: 'backbillCnt',
          fixed: false,
          visible: false
        }
      ]
    }
  },

  methods: {
    // 设置标签状态
    setTabStatus (tab) {
      switch (tab) {
        case '全部':
          return
        case '待发运':
          return 1
        case '在途':
          return 2
        case '已到货':
          return 3
        default:
      }
    },

    // 数据查询
    fetchData () {
      Server({
        url: '/outside/bill/list',
        method: 'post',
        data: this.setFetchParams()
      }).then(res => {
        const data = res.data.data
        this.tableData = data.list
        this.page.total = data.totalCount
        this.tabList = [
          { name: '全部', count: '' },
          { name: '待发运', count: data.statusCntInfo.waitLoadCnt },
          { name: '在途', count: data.statusCntInfo.loaddingCnt },
          { name: '已到货', count: data.statusCntInfo.loadedCnt }
        ]
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import './transport.styl'
</style>
