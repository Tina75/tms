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
                @on-change="resetEasySearch">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Input v-if="easySelectMode === 1"
               v-model="easySearchKeyword"
               :icon="easySearchKeyword ? 'ios-close-circle' : ''"
               placeholder="请输入运单号"
               class="search-input"
               @on-click="resetEasySearch" />

        <SelectInput v-if="easySelectMode === 2"
                     v-model="easySearchKeyword"
                     :maxlength="20"
                     :remote="false"
                     :local-options="carriers"
                     placeholder="请输入承运商"
                     class="search-input"
                     @on-focus.once="getCarriers"
                     @on-select="handleSelectCarrier" />

        <SelectInput v-if="easySelectMode === 3"
                     v-model="easySearchKeyword"
                     :maxlength="8"
                     :remote="false"
                     :local-options="carrierCars"
                     placeholder="请输入车牌号"
                     class="search-input" />

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
        <Input v-model="seniorSearchFields.waybillNo" placeholder="请输入运单号" class="search-input-senior" />
        <SelectInput
          v-model="seniorSearchFields.carrierName"
          :maxlength="20"
          :remote="false"
          :local-options="carriers"
          placeholder="请输入承运商"
          class="search-input-senior"
          @on-focus.once="getCarriers"
          @on-select="handleSelectCarrier" />
        <SelectInput
          v-model="seniorSearchFields.driverName"
          :maxlength="5"
          :remote="false"
          :local-options="carrierDrivers"
          placeholder="请输入司机"
          class="search-input-senior" />
        <SelectInput
          v-model="seniorSearchFields.carNo"
          :maxlength="8"
          :remote="false"
          :local-options="carrierCars"
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

    <!-- 表格 -->
    <PageTable :columns="tableColumns"
               :extra-columns="extraColumns"
               :data="tableData"
               :show-filter="true"
               :show-pagination="false"
               style="margin-top: 15px"
               @on-column-change="tableColumnsChanged"
               @on-selection-change="selectionChanged"
               @on-sort-change="tableSort"></PageTable>

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
import SelectInput from '@/components/SelectInput'
import TransportMixin from './transportMixin'
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'

export default {
  name: 'WaybillManager',
  components: { TabHeader, PageTable, AreaSelect, SelectInput },
  mixins: [ BasePage, TransportMixin ],
  metaInfo: { title: '运单管理' },
  data () {
    return {
      // 标签栏
      tabList: [
        { name: '全部', count: '' },
        { name: '待派车', count: '' },
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
            func: () => {
              this.billShipment()
            }
          }, {
            name: '打印',
            func: () => console.log(Math.random())
          }, {
            name: '到货',
            func: () => {
              this.billArrived()
            }
          }, {
            name: '删除',
            func: () => {
              this.billDelete()
            }
          }, {
            name: '位置',
            func: () => {
              this.billLocation()
            }
          }, {
            name: '导出',
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '待派车',
          btns: [{
            name: '删除',
            func: () => {
              this.billDelete()
            }
          }, {
            name: '导出',
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '待发运',
          btns: [{
            name: '发运',
            func: () => {
              this.billShipment()
            }
          }, {
            name: '打印',
            func: () => console.log(Math.random())
          }, {
            name: '导出',
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '在途',
          btns: [{
            name: '到货',
            func: () => {
              this.billArrived()
            }
          }, {
            name: '导出',
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '已到货',
          btns: [{
            name: '导出',
            func: () => {
              this.billExport()
            }
          }]
        }
      ],

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

      tableColumns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '操作',
          key: 'do',
          width: 60,
          extra: true,
          render: (h, p) => {
            if (p.row.status === 1) {
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
        {
          title: '运单号',
          key: 'waybillNo',
          width: 160,
          fixed: true,
          render: (h, p) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.openTab({
                    path: '/transport/detail/detailFreight',
                    query: {
                      id: p.row.waybillNo,
                      qid: p.row.waybillId
                    }
                  })
                }
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
          title: '承运商',
          key: 'carrierName'
        },
        {
          title: '车牌号',
          key: 'carNo'
        },
        {
          title: '合计运费（元）',
          key: 'totalFee'
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
          title: '创建时间',
          key: 'createTimeLong',
          sortable: 'custom',
          render: (h, p) => {
            return h('span', this.dateFormatter(p.row.createTimeLong))
          }
        },
        {
          title: '制单人',
          key: 'createOperator'
        },
        {
          title: '货值',
          key: 'cargoCost'
        },
        {
          title: '付款方式',
          key: 'settlementType'
        },
        {
          title: '司机',
          key: 'driverName'
        },
        {
          title: '司机手机号码',
          key: 'driverPhone'
        },
        {
          title: '车型',
          key: 'carType'
        },
        {
          title: '订单数',
          key: 'orderCnt'
        },
        {
          title: '回单数',
          key: 'backbillCnt'
        }
      ],
      extraColumns: [
        {
          title: '运单号',
          key: 'waybillNo',
          fixed: true,
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
          title: '承运商',
          key: 'carrierName',
          fixed: false,
          visible: true
        },
        {
          title: '车牌号',
          key: 'carNo',
          fixed: false,
          visible: true
        },
        {
          title: '合计运费',
          key: 'totalFee',
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
          title: '创建时间',
          key: 'createTimeLong',
          fixed: false,
          visible: true
        },
        {
          title: '制单人',
          key: 'createOperator',
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
          title: '付款方式',
          key: 'settlementType',
          fixed: false,
          visible: false
        },
        {
          title: '司机',
          key: 'driverName',
          fixed: false,
          visible: false
        },
        {
          title: '司机手机号码',
          key: 'driverPhone',
          fixed: false,
          visible: false
        },
        {
          title: '车型',
          key: 'carType',
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
        case '待派车':
          return 1
        case '待发运':
          return 2
        case '在途':
          return 3
        case '已到货':
          return 4
        default:
      }
    },

    // 数据查询
    fetchData () {
      Server({
        url: '/waybill/list',
        method: 'post',
        data: this.setFetchParams()
      }).then(res => {
        const data = res.data.data
        this.tableData = data.waybillList
        this.page.total = data.totalCount
        this.tabList = [
          { name: '全部', count: '' },
          { name: '待派车', count: data.statusCntInfo.waitAssignCarCnt || 0 },
          { name: '待发运', count: data.statusCntInfo.waitSendCarCnt || 0 },
          { name: '在途', count: data.statusCntInfo.inTransportCnt || 0 },
          { name: '已到货', count: data.statusCntInfo.arrivedCnt || 0 }
        ]
      }).catch(err => console.error(err))
    },

    // 删除
    billDelete () {
      if (!this.tableSelection.length) return
      Server({
        url: '/waybill/delete',
        method: 'delete',
        data: { waybillIds: this.tableSelection.map(item => item.waybillId) }
      }).then(res => {
        this.$Message.success('删除成功')
        this.tableSelection = []
        this.fetchData()
      }).catch(err => console.error(err))
    },

    // 位置
    billLocation () {
      if (!this.tableSelection.length) return
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
      if (!self.tableSelection.length) return
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
              self.tableSelection = []
              self.fetchData()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 发运
    billShipment () {
      const self = this
      if (!self.tableSelection.length) return
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
              self.tableSelection = []
              self.fetchData()
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
        data.waybillIds = this.tableSelection.map(item => item.waybillId)
      } else if (this.inSearching) data.exportType = 3
      else data.exportType = 2

      Export({
        url: '/waybill/export',
        method: 'post',
        data
      }).then(res => {
        this.$Message.success('导出成功')
      }).catch(err => console.error(err))
    },

    // 派车
    billSendCar (id) {
      var self = this
      self.openDialog({
        name: 'transport/dialog/sendCar',
        data: {
          id,
          type: 'sendCar'
        },
        methods: {
          complete () {
            self.fetchData()
          }
        }
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import './transport.styl'
</style>
