<template>
  <div ref="$box">
    <TabHeader :tabs="tabList" :type="tabType" @on-change="tabChanged"></TabHeader>

    <div style="margin-top: 30px;display: flex;justify-content: space-between;">

      <!-- 按钮组 -->
      <div>
        <Button v-for="(item, key) in showButtons" :key="key"
                :type="key === 0 ? 'primary' : 'default'"
                @click="item.func">{{ item.name }}</Button>
      </div>

      <!-- 简易搜索 -->
      <div v-if="isEasySearch" class="right">
        <Select v-model="easySelectMode"
                style="width:120px; margin-right: 11px"
                @on-change="resetEasySearch">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <SelectInput v-if="easySelectMode === 1"
                     v-model="easySearchKeyword"
                     :maxlength="20"
                     :remote="false"
                     :local-options="transferees"
                     clearable
                     placeholder="请输入外转方名称"
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

        <Button icon="ios-search"
                class="search-btn-easy"
                @click="startSearch"></Button>

        <Button class="senior-search"
                type="text" size="small"
                @click="changeSearchType">高级搜索</Button>
      </div>
    </div>

    <!-- 高级搜索 -->
    <div v-if="!isEasySearch" class="operate-box">

      <div style="margin-bottom: 10px;">
        <SelectInput v-model="seniorSearchFields.consignerName"
                     :maxlength="20"
                     :remote="false"
                     :local-options="consigners"
                     placeholder="请输入客户名称"
                     class="search-input-senior" />

        <Input v-model="seniorSearchFields.orderNo" :maxlength="20" placeholder="请输入订单号" class="search-input-senior" />
        <Input v-model="seniorSearchFields.customerOrderNo" :maxlength="20" placeholder="请输入客户订单号" class="search-input-senior" />
        <Input v-model="seniorSearchFields.transNo" :maxlength="20" placeholder="请输入外转单号" class="search-input-senior" />

        <SelectInput v-model="seniorSearchFields.transfereeName"
                     :maxlength="20"
                     :remote="false"
                     :local-options="transferees"
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
    <PageTable ref="$table"
               :width="tableWidth"
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
               @on-page-size-change="pageSizeChange"
               @on-load="dataOnload"></PageTable>

  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TransportBase from './transportBase'
import TransportMixin from './transportMixin'

import TabHeader from './components/TabHeader'
import PageTable from '@/components/page-table'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from '@/components/SelectInput'

import Server from '@/libs/js/server'
import Export from '@/libs/js/export'

export default {
  name: 'OuterManager',
  components: { TabHeader, PageTable, AreaSelect, SelectInput },
  mixins: [ BasePage, TransportBase, TransportMixin ],
  metaInfo: { title: '外转单管理' },
  data () {
    return {
      tabType: 'OUTER',
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
            code: 120301,
            func: () => {
              this.billShipment()
            }
          }, {
            name: '到货',
            code: 120302,
            func: () => {
              this.billArrived()
            }
          }, {
            name: '删除',
            code: 120304,
            func: () => {
              this.billDelete()
            }
          }, {
            name: '导出',
            code: 120305,
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '待发运',
          btns: [{
            name: '发运',
            code: 120301,
            func: () => {
              this.billShipment()
            }
          }, {
            name: '删除',
            code: 120304,
            func: () => {
              this.billDelete()
            }
          }, {
            name: '导出',
            code: 120305,
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '在途',
          btns: [{
            name: '到货',
            code: 120302,
            func: () => {
              this.billArrived()
            }
          }, {
            name: '导出',
            code: 120305,
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '已到货',
          btns: [{
            name: '导出',
            code: 120305,
            func: () => {
              this.billExport()
            }
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
        startCodes: [], // 始发地codes
        endCodes: [], // 目的地codes
        start: '', // 始发地
        end: '', // 目的地
        dateRange: ['', ''], // 日期范围
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },

      tableColumns: [
        {
          type: 'selection',
          width: 50,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '操作',
          key: 'do',
          width: 100,
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
        {
          title: '外转单号',
          key: 'transNo',
          minWidth: 160,
          fixed: 'left',
          render: (h, p) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.openTab({
                    title: p.row.transNo,
                    path: '/transport/detail/detailOuter',
                    query: { id: p.row.transId }
                  })
                }
              }
            }, p.row.transNo)
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          minWidth: 160
        },
        {
          title: '外转方运单号',
          key: 'outTransNo',
          minWidth: 160,
          render: (h, p) => {
            return h('span', p.row.outTransNo ? p.row.outTransNo : '-')
          }
        },
        {
          title: '外转方名称',
          key: 'transfereeName',
          minWidth: 160
        },
        {
          title: '始发地',
          key: 'start',
          ellipsis: true,
          minWidth: 160,
          render: (h, p) => {
            return h('Tooltip', {
              props: {
                content: this.cityFormatter(p.row.start)
              }
            }, this.cityFormatter(p.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          ellipsis: true,
          minWidth: 160,
          render: (h, p) => {
            return h('Tooltip', {
              props: {
                content: this.cityFormatter(p.row.end)
              }
            }, this.cityFormatter(p.row.end))
          }
        },
        {
          title: '外转运费',
          key: 'transFee',
          minWidth: 120,
          render: (h, p) => {
            return h('span', p.row.cargoCost ? p.row.cargoCost / 100 : '-')
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.volume ? p.row.volume : '-')
          }
        },
        {
          title: '重量（吨）',
          key: 'weight',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.weight ? p.row.weight : '-')
          }
        },
        {
          title: '外转时间',
          key: 'createTimeLong',
          sortable: 'custom',
          minWidth: 160,
          render: (h, p) => {
            return h('span', this.timeFormatter(p.row.createTimeLong))
          }
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          minWidth: 160,
          render: (h, p) => {
            return h('span', p.row.customerOrderNo ? p.row.customerOrderNo : '-')
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 160,
          render: (h, p) => {
            return h('span', p.row.consignerName ? p.row.consignerName : '-')
          }
        },
        {
          title: '发货人',
          key: 'consignerContact',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.consignerContact ? p.row.consignerContact : '-')
          }
        },
        {
          title: '发货人手机号码',
          key: 'consignerPhone',
          minWidth: 140,
          render: (h, p) => {
            return h('span', p.row.consignerPhone ? p.row.consignerPhone : '-')
          }
        },
        {
          title: '收货人',
          key: 'consigneeContact',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.consigneeContact ? p.row.consigneeContact : '-')
          }
        },
        {
          title: '收货人手机号码',
          key: 'consigneePhone',
          minWidth: 140,
          render: (h, p) => {
            return h('span', p.row.consigneePhone ? p.row.consigneePhone : '-')
          }
        },
        {
          title: '货值',
          key: 'cargoCost',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.cargoCost ? p.row.cargoCost / 100 : p.row.cargoCost)
          }
        },
        {
          title: '结算方式',
          key: 'payType',
          minWidth: 100,
          render: (h, p) => {
            let type = '-'
            switch (p.row.payType) {
              case 1:
                type = '现付'
                break
              case 2:
                type = '到付'
                break
              case 3:
                type = '回单付'
                break
              case 4:
                type = '月结'
                break
              default: break
            }
            return h('span', type)
          }
        },
        {
          title: '要求装货时间',
          key: 'deliveryTimeLong',
          minWidth: 160,
          render: (h, p) => {
            return h('span', this.timeFormatter(p.row.deliveryTimeLong))
          }
        },
        {
          title: '期望到货时间',
          key: 'arriveTimeLong',
          minWidth: 160,
          render: (h, p) => {
            return h('span', this.timeFormatter(p.row.arriveTimeLong))
          }
        },
        {
          title: '回单数',
          key: 'receiptCount',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.receiptCount ? p.row.receiptCount : '-')
          }
        },
        {
          title: '制单人',
          key: 'createOperator',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.createOperator ? p.row.createOperator : '-')
          }
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
          title: '外转运费',
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
          key: 'customerOrderNo',
          fixed: false,
          visible: false
        },
        {
          title: '客户名称',
          key: 'consignerName',
          fixed: false,
          visible: false
        },
        {
          title: '发货人',
          key: 'consignerContact',
          fixed: false,
          visible: false
        },
        {
          title: '发货人手机号码',
          key: 'consignerPhone',
          fixed: false,
          visible: false
        },
        {
          title: '收货人',
          key: 'consigneeContact',
          fixed: false,
          visible: false
        },
        {
          title: '收货人手机号码',
          key: 'consigneePhone',
          fixed: false,
          visible: false
        },
        {
          title: '货值',
          key: 'cargoCost',
          fixed: false,
          visible: false
        },
        {
          title: '结算方式',
          key: 'payType',
          fixed: false,
          visible: false
        },
        {
          title: '要求装货时间',
          key: 'deliveryTimeLong',
          fixed: false,
          visible: false
        },
        {
          title: '期望到货时间',
          key: 'arriveTimeLong',
          fixed: false,
          visible: false
        },
        {
          title: '回单数',
          key: 'receiptCount',
          fixed: false,
          visible: false
        },
        {
          title: '制单人',
          key: 'createOperator',
          fixed: false,
          visible: false
        }
      ],

      transferees: [], // 外转方列表
      consigners: [] // 客户列表
    }
  },
  created () {
    this.getTransferee()
    this.getConsigners()
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
    dataOnload (res) {
      const data = res.data.data
      this.page.current = data.pageNo
      this.page.size = data.pageSize
      this.tabList = [
        { name: '全部', count: '' },
        { name: '待发运', count: data.statusCntInfo.waitCnt || 0 },
        { name: '在途', count: data.statusCntInfo.loadCnt || 0 },
        { name: '已到货', count: data.statusCntInfo.loadedCnt || 0 }
      ]
      this.$forceUpdate()
    },

    // 查询外转方
    getTransferee () {
      Server({
        url: '/transferee/listOrderbyUpdateTimeDesc',
        method: 'get',
        data: { type: 1 }
      }).then(res => {
        this.transferees = res.data.data.transfereeList.map(item => {
          return { name: item.name, value: item.name }
        })
      }).catch(err => console.error(err))
    },

    // 查询客户
    getConsigners () {
      Server({
        url: '/consigner/list',
        method: 'get'
      }).then(res => {
        this.consigners = res.data.data.list.map(item => {
          return { name: item.name, value: item.name }
        })
      }).catch(err => console.error(err))
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
              self.tableSelection = []
              self.$refs.$table.fetch()
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
              self.tableSelection = []
              self.$refs.$table.fetch()
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
              self.tableSelection = []
              self.$refs.$table.fetch()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 导出
    billExport () {
      let data = this.setFetchParams()
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

<style lang='stylus' scoped>
  @import './transport.styl'
</style>
