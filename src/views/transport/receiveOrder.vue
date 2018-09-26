<template>
  <div ref="$box">
    <TabHeader :tabs="tabList" type="PICKUP" @on-change="tabChanged"></TabHeader>

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

        <Input v-if="easySelectMode === 1"
               v-model="easySearchKeyword"
               :icon="easySearchKeyword ? 'ios-close-circle' : ''"
               :maxlength="20"
               placeholder="请输入提货单号"
               class="search-input"
               @on-click="resetEasySearch" />

        <SelectInput v-if="easySelectMode === 2"
                     v-model="easySearchKeyword"
                     :maxlength="20"
                     :remote="false"
                     :local-options="carriers"
                     placeholder="请输入承运商"
                     class="search-input"
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
        <Input v-model="seniorSearchFields.pickupNo" :maxlength="20" placeholder="请输入提货单号"  class="search-input-senior" />
        <SelectInput
          v-model="seniorSearchFields.carrierName"
          :maxlength="20"
          :remote="false"
          :local-options="carriers"
          placeholder="请输入承运商"
          class="search-input-senior"
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
               url="/load/bill/list"
               method="post"
               list-field="loadbillList"
               style="margin-top: 15px"
               @on-column-change="tableColumnsChanged"
               @on-selection-change="selectionChanged"
               @on-sort-change="tableSort"
               @on-load="dataOnload"></PageTable>

    <PrintPickup ref="$printer" :data="printData" />
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from './components/TabHeader'
import PageTable from '@/components/page-table'
import SelectInput from '@/components/SelectInput.vue'
import PrintPickup from './components/PrintPickup'
import TransportMixin from './transportMixin'
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'

export default {
  name: 'ReceiveManager',
  components: { TabHeader, PageTable, SelectInput, PrintPickup },
  mixins: [ BasePage, TransportMixin ],
  metaInfo: { title: '提货管理' },
  data () {
    return {
      // 标签栏
      tabList: [
        { name: '全部', count: '' },
        { name: '待提货', count: '' },
        { name: '提货中', count: '' },
        { name: '已提货', count: '' }
      ],

      // 所有按钮组
      btnList: [
        {
          tab: '全部',
          btns: [{
            name: '到货',
            code: 120203,
            func: () => {
              this.billArrived()
            }
          }, {
            name: '打印',
            code: 120202,
            func: () => {
              this.billPrint()
            }
          }, {
            name: '删除',
            code: 120204,
            func: () => {
              this.billDelete()
            }
          }, {
            name: '位置',
            code: 120205,
            func: () => {
              this.billLocation()
            }
          }, {
            name: '导出',
            code: 120207,
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '待提货',
          btns: [{
            name: '打印',
            code: 120202,
            func: () => {
              this.billPrint()
            }
          }, {
            name: '删除',
            code: 120202,
            func: () => {
              this.billDelete()
            }
          }, {
            name: '导出',
            code: 120207,
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '提货中',
          btns: [{
            name: '到货',
            code: 120203,
            func: () => {
              this.billArrived()
            }
          }, {
            name: '打印',
            code: 120202,
            func: () => {
              this.billPrint()
            }
          }, {
            name: '位置',
            code: 120205,
            func: () => {
              this.billLocation()
            }
          }, {
            name: '导出',
            code: 120207,
            func: () => {
              this.billExport()
            }
          }]
        },
        {
          tab: '已提货',
          btns: [{
            name: '导出',
            code: 120207,
            func: () => {
              this.billExport()
            }
          }]
        }
      ],

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
          width: 60,
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
            }
          }
        },
        {
          title: '提货单号',
          key: 'pickupNo',
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
                    path: '/transport/detail/detailPickup',
                    query: {
                      id: p.row.pickupNo,
                      qid: p.row.pickUpId
                    }
                  })
                }
              }
            }, p.row.pickupNo)
          }
        },
        {
          title: '承运商',
          key: 'carrierName',
          minWidth: 100
        },
        {
          title: '司机',
          key: 'driverName',
          minWidth: 100
        },
        {
          title: '车牌号',
          key: 'carNo',
          minWidth: 100
        },
        {
          title: '合计运费（元）',
          key: 'totalFee',
          minWidth: 120
        },
        {
          title: '体积（方）',
          key: 'volume',
          minWidth: 100
        },
        {
          title: '重量（吨）',
          key: 'weight',
          minWidth: 100
        },
        {
          title: '创建时间',
          key: 'createTimeLong',
          sortable: 'custom',
          minWidth: 160,
          render: (h, p) => {
            return h('span', this.dateFormatter(p.row.createTimeLong))
          }
        },
        {
          title: '制单人',
          key: 'createOperator',
          minWidth: 100
        },
        {
          title: '货值',
          key: 'cargoCost',
          minWidth: 100
        },
        {
          title: '结算方式',
          key: 'settlementType',
          minWidth: 100
        },
        {
          title: '司机手机号码',
          key: 'driverPhone',
          minWidth: 160
        },
        {
          title: '车型',
          key: 'carType',
          minWidth: 100
        },
        {
          title: '订单数',
          key: 'orderCnt',
          minWidth: 100
        }
      ],
      extraColumns: [
        {
          title: '提货单号',
          key: 'pickupNo',
          fixed: true,
          visible: true
        },
        {
          title: '承运商',
          key: 'carrierName',
          fixed: false,
          visible: true
        },
        {
          title: '司机',
          key: 'driverName',
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
          title: '合计运费（元）',
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
          title: '结算方式',
          key: 'settlementType',
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
        case '待提货':
          return 1
        case '提货中':
          return 2
        case '已提货':
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
        { name: '待提货', count: data.statusCntInfo.waitCnt || 0 },
        { name: '提货中', count: data.statusCntInfo.loadCnt || 0 },
        { name: '已提货', count: data.statusCntInfo.loadedCnt || 0 }
      ]
    },

    // 打印查询详情
    fetchDetail () {
      let promises = this.tableSelection.map(item => {
        return new Promise((resolve, reject) => {
          Server({
            url: '/load/bill/print',
            method: 'post',
            data: { pickUpId: item.pickUpId }
          }).then(res => {
            resolve(res.data.data)
          })
        })
      })
      return Promise.all(promises)
    },

    // 打印
    billPrint () {
      if (!this.checkTableSelection()) return
      this.fetchDetail()
        .then(data => {
          this.printData = data
          this.$refs.$printer.print()
        })
    },

    // 导出
    billExport () {
      let data = this.setFetchParams()
      delete data.order

      if (this.tableSelection.length) {
        data.exportType = 1
        data.pickUpIds = this.tableSelection.map(item => item.pickUpId)
      } else if (this.inSearching) data.exportType = 3
      else data.exportType = 2

      Export({
        url: '/load/bill/export',
        method: 'post',
        data
      }).then(res => {
        this.$Message.success('导出成功')
      }).catch(err => console.error(err))
    },

    // 位置
    billLocation () {
      if (!this.checkTableSelection()) return
      Server({
        url: '/load/bill/location',
        method: 'post',
        data: { pickUpIds: this.tableSelection.map(item => item.pickUpId) }
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
              data: { pickUpIds: this.tableSelection.map(item => item.pickUpId) }
            }).then(res => {
              this.$Message.success('删除成功')
              this.tableSelection = []
              this.fetchData()
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
              self.tableSelection = []
              self.fetchData()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 提货
    billPickup (id) {
      var self = this
      self.openDialog({
        name: 'transport/dialog/sendCar',
        data: {
          id,
          type: 'pickUp'
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
