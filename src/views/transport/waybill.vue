<template>
  <div ref="$box" class="transport-page">
    <TabHeader ref="$tab" :tabs="tabList" :type="tabType" @on-change="tabChanged"></TabHeader>

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
                  transfer
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

        <div class="complex-query">
          <div>
            <SelectInputForCity v-model="seniorSearchFields.start" placeholder="请输入始发地" class="search-input-senior" />
            <SelectInputForCity v-model="seniorSearchFields.end" placeholder="请输入目的地" class="search-input-senior" />
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
    </template>

    <OrderTabContent
      v-if="!tabStatus"
      :table-head-source="dispatchHeadType"
      source="waybill"
      tab-status="待送货"
      is-visiable
      url="/load/bill/wait/pick/list"
      export-url="/load/bill/pick/up/export"
      @refresh-tab="fetchTabCount" />

    <!-- 表格 -->
    <div v-else>
      <PageTable ref="$table"
                 :columns="tableColumns"
                 :show-filter="true"
                 :keywords="searchFields"
                 :table-head-type="waybillHeadType"
                 row-id="waybillId"
                 url="/waybill/list"
                 method="post"
                 list-field="waybillList"
                 style="margin-top: 15px"
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
import SelectInputForCity from '@/components/SelectInputForCity'
import SelectInput from './components/SelectInput.vue'
import PrintFreight from './components/PrintFreight'
import OrderTabContent from '@/views/order-management/components/TabContent'

import Export from '@/libs/js/export'
import { BUTTON_LIST, TABLE_COLUMNS } from './constant/waybill'
import headType from '@/libs/constant/headtype'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'order-transport',
  components: { TabHeader, PageTable, SelectInputForCity, SelectInput, PrintFreight, OrderTabContent },
  mixins: [ BasePage, TransportBase, SelectInputMixin, TransportMixin ],
  metaInfo: { title: '送货管理' },
  data () {
    return {
      tabType: 'WAYBILL',

      waybillHeadType: headType.WAYBILL,
      dispatchHeadType: headType.WAIT_WAYBILL,

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
        start: void 0, // 始发地
        end: void 0, // 目的地
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
          let record = p.row
          if (record.status === 2 && this.hasPower(120101) && ((record.carrierName === '' && record.assignCarType === 1) || (record.carNo === '' && record.assignCarType === 2))) {
            return h('a', {
              on: {
                click: () => {
                  this.billSendCar(p.row.waybillId)
                }
              }
            }, '派车')
          } else if (p.row.status > 1 && this.hasPower(120113)) {
            // return h('a', {
            //   on: {
            //     click: () => {
            //       this.openAbnormalDialog(p.row.waybillId)
            //     }
            //   }
            // }, '上报异常')
          }
        }
      },

      tableColumns: TABLE_COLUMNS(this) // 表头
    }
  },

  computed: {
    ...mapGetters({
      tabList: 'waybillTabCount'
    })
  },

  methods: {
    ...mapActions([
      'getWaybillPrintData',
      'deleteWaybills',
      'getWaybillLocation',
      'waybillSendCarCheck',
      'waybillShipment',
      'waybillArrival',
      'getwaybillTabCount'
    ]),

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
          this.triggerTableActionColumn(true)
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
      this.getwaybillTabCount()
    },

    // 表格数据查询完成回调
    dataOnload (res) {
      const data = res.data.data
      this.page.current = data.pageNo
      this.page.size = data.pageSize
    },

    // 打印
    billPrint () {
      if (!this.checkTableSelection()) return
      this.getWaybillPrintData(this.tableSelection.map(item => item.waybillId))
        .then(res => {
          this.printData = res
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
            self.deleteWaybills(self.tableSelection.map(item => item.waybillId))
              .then(() => {
                self.$Message.success('删除成功')
                self.clearSelectedAndFetch()
              })
          }
        }
      })
    },

    // 位置
    billLocation () {
      if (!this.checkTableSelection()) return
      let waybillIds = this.tableSelection.map(item => item.waybillId)
      this.getWaybillLocation(waybillIds)
        .then(res => {
          if (res.limitTip) {
            this.$Toast.warning({
              title: '提示',
              showIcon: false,
              // content: res.limitTip,
              okText: '我知道了',
              render (h) {
                return h('p', {
                  style: {
                    textAlign: 'left',
                    marginLeft: '-20px'
                  }
                }, res.limitTip)
              }
            })
            return
          }
          let cars
          if (waybillIds.length > 1) {
            if (!res.list.length) {
              this.$Message.warning('暂无车辆位置信息')
              return
            }
            cars = res.list
          } else {
            if (!res.points.length) {
              this.$Message.warning('暂无车辆位置信息')
              return
            }
            cars = [res]
          }
          this.openDialog({
            name: 'transport/dialog/map',
            data: {
              cars,
              multiple: waybillIds.length !== 1
            },
            methods: {}
          })
        })
    },

    // 到货
    billArrived () {
      const self = this
      if (!this.checkTableSelection()) return
      let tableSelection = _.cloneDeep(this.tableSelection)
      let cashBackList = _.remove(tableSelection, (i) => {
        return i.cashBack > 0
      })
      console.log(cashBackList)
      if (this.tableSelection.length > 1 && cashBackList.length > 0) {
        self.openDialog({
          name: 'transport/dialog/cashBackWarn',
          data: {
            title: '操作提醒',
            cashBack: cashBackList,
            message: '以下单据存在返现运费，需要单独操作。',
            type: 'waybill'
          },
          methods: {
            confirm () {}
          }
        })
        return
      }
      if (self.tableSelection[0].cashBack > 0) {
        self.openDialog({
          name: 'transport/dialog/cashBack',
          data: {
            url: '/waybill/confirm/arrival',
            type: 'waybill',
            title: '到货确认',
            cashBack: self.tableSelection[0].cashBack / 100,
            waybillIds: [self.tableSelection[0].waybillId]
          },
          methods: {
            confirm () {
              self.$Message.success('操作成功')
              self.clearSelectedAndFetch()
            }
          }
        })
      } else {
        self.openDialog({
          name: 'transport/dialog/confirm',
          data: {
            title: '到货确认',
            message: '是否确认到货？'
          },
          methods: {
            confirm () {
              self.waybillArrival(self.tableSelection.map(item => item.waybillId))
                .then(() => {
                  self.$Message.success('操作成功')
                  self.clearSelectedAndFetch()
                })
            }
          }
        })
      }
    },

    // 发运
    billShipment () {
      const self = this
      if (!self.checkTableSelection()) return
      let tableSelection = _.cloneDeep(self.tableSelection)
      // 运单发运前判断运单有无填写承运商
      let carrierNameList = _.remove(tableSelection, (i) => {
        return (i.carrierName === '' && i.assignCarType === 1) || (i.carNo === '' && i.assignCarType === 2)
      })
      console.log(carrierNameList)
      if (carrierNameList.length > 0) {
        if (self.tableSelection.length > 1) {
          self.openDialog({
            name: 'transport/dialog/cashBackWarn',
            data: {
              title: '操作提醒',
              cashBack: carrierNameList,
              message: '以下单据未派车或信息不全，不能发运。',
              type: 'waybill'
            },
            methods: {
              confirm () {}
            }
          })
        } else {
          // this.$Message.warning('单据未派车，不能发运')
          if (carrierNameList[0].assignCarType === 1 && !carrierNameList[0].carrierName) {
            self.$Message.warning('承运商未填写，不能发运')
          }
          if (carrierNameList[0].assignCarType === 2 && !carrierNameList[0].carNo) {
            self.$Message.warning('自送车辆信息未填写，不能发运')
          }
        }
        return
      }
      // 运单发运前判断运单有无订单
      let cargoList = _.remove(tableSelection, (i) => {
        return i.orderCnt === 0
      })
      console.log(cargoList)
      if (cargoList.length > 0) {
        if (self.tableSelection.length > 1) {
          self.openDialog({
            name: 'transport/dialog/cashBackWarn',
            data: {
              title: '操作提醒',
              cashBack: cargoList,
              message: '以下单据没有加入订单，不能发运。',
              type: 'waybill'
            },
            methods: {
              confirm () {}
            }
          })
        } else {
          self.$Message.warning('此运单里没有加入订单，不能发运')
        }
        return
      }
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '发运',
          message: '是否发运？'
        },
        methods: {
          confirm () {
            self.waybillShipment(self.tableSelection.map(item => item.waybillId))
              .then(() => {
                self.$Message.success('操作成功')
                self.clearSelectedAndFetch()
              })
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
      self.waybillSendCarCheck([id]).then(() => {
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
    },

    // 上报异常
    openAbnormalDialog (id) {
      const self = this
      self.openDialog({
        name: 'transport/dialog/abnormal',
        data: {
          id,
          type: 3 // 单据类型 1 提货单 2 外转单 3 运单
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
