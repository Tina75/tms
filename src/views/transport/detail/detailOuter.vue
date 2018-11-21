<template>
  <div class="transport-detail">
    <!-- 运单号及状态 -->
    <section :class="themeBarColor(status)" class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">订单号：{{ info.orderNo }}</li>
        <li class="detail-header-list-item">客户单号：{{ info.customerOrderNo || '-' }}</li>
        <li class="detail-header-list-item">外转单号：{{ info.transNo }}</li>
        <li class="detail-header-list-item">外转方运单号：{{ info.outTransNo || '-' }}</li>
        <li class="detail-header-list-item">外转单状态：
          <span :class="themeStatusColor(status)" style="font-weight: bold;">{{ status }}</span>
        </li>
      </ul>
    </section>
    <div class="detail-btn-group">
      <Button
        v-for="(item, key) in showButtons"
        :key="key" :type="key === (showButtons.length - 1) ? 'primary' : 'default'"
        class="detail-btn-item"
        @click="item.func">{{ item.name }}</Button>
    </div>

    <Tabs :value="activeTab">
      <TabPane label="外转单详情" name="detail">
        <section class="detail-info">
          <!-- 客户信息 -->
          <div>
            <div class="detail-part-title">
              <span>客户信息</span>
            </div>
            <Row class="detail-field-group">
              <i-col span="6">
                <span class="detail-field-title">客户名称：</span>
                <span>{{ info.consignerName }}</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title"
                      style="width: 120px;">发货时间：</span>
                <span>{{ info.deliveryTimeLong | timeFormatter }}</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title"
                      style="width: 120px;">到货时间：</span>
                <span>{{ info.arriveTimeLong | timeFormatter }}</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title">代收货款：</span>
                <span v-if="collectionMoney">{{collectionMoney / 100}}元</span>
                <span v-else>-</span>
              </i-col>
            </Row>
            <Row class="detail-field-group">
              <i-col span="6">
                <span class="detail-field-title">始发地：</span>
                <span>{{ info.startName }}</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title">目的地：</span>
                <span>{{ info.endName }}</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title">提货方式：</span>
                <span>{{ info.pickup ? '小车上门提货' : '大车直送客户' }}</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title">回单数：</span>
                <span>{{ info.receiptCount }}</span>
              </i-col>
            </Row>
            <Row class="detail-field-group" style="margin-top: 20px;">
              <i-col span="6">
                <span class="detail-field-title">发货联系人：</span>
                <span>{{ info.consignerContact }}</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title">联系方式：</span>
                <span>{{ info.consignerPhone }}</span>
              </i-col>
              <i-col span="12">
                <span class="detail-field-title">发货地址：</span>
                <span>{{ info.consignerAddress }}</span>
              </i-col>
            </Row>
            <Row class="detail-field-group">
              <i-col span="6">
                <span class="detail-field-title">收货联系人：</span>
                <span>{{ info.consigneeContact }}</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title">联系方式：</span>
                <span>{{ info.consigneePhone }}</span>
              </i-col>
              <i-col span="12">
                <span class="detail-field-title">收货地址：</span>
                <span>{{ info.consigneeAddress }}</span>
              </i-col>
            </Row>
            <Row class="detail-field-group" style="margin-top: 20px;">
              <i-col span="13">
                <span class="detail-field-title">备注：</span>
                <span>{{ info.remark || '无' }}</span>
              </i-col>
            </Row>
          </div>
          <!-- 货物明细 -->
          <div>
            <div class="detail-part-title">
              <span>货物明细</span>
            </div>
            <Table :columns="tableColumns" :data="detail" :loading="loading" class="detail-field-table"></Table>
            <div class="table-footer">
              <span class="table-footer-title">总计</span>
              <span>总货值：{{ orderTotal.cargoCost }}</span>
              <span>总数量：{{ orderTotal.quantity }}</span>
              <span>总体积：{{ orderTotal.volume }}</span>
              <span>总重量：{{ orderTotal.weight }}</span>
            </div>
          </div>
          <!-- 应付费用 -->
          <div>
            <div class="detail-part-title">
              <span>应付费用</span>
            </div>
            <Row class="detail-field-group">
              <i-col span="5">
                <span class="detail-field-title-sm">外转方：</span>
                <span class="detail-field-fee">{{ payment.transfereeName }}</span>
              </i-col>
              <i-col span="5">
                <span class="detail-field-title-sm">计费里程：</span>
                <span v-if="payment.mileage" class="detail-field-fee">{{ Math.floor(payment.mileage) / 1000 }}公里</span>
              </i-col>
              <i-col span="5" offset="2">
                <span class="detail-field-title-sm">外转费用：</span>
                <span class="detail-field-fee">{{ payment.transFee / 100 }}元</span>
              </i-col>
              <i-col span="5" offset="2">
                <span class="detail-field-title-sm">结算方式：</span>
                <span class="detail-field-fee">{{ payment.payType | payTypeFormatter(true) }}</span>
              </i-col>
            </Row>
          </div>
          <!-- 运单日志 -->
          <div>
            <div class="detail-part-title">
              <span>运单日志</span>
            </div>
            <div class="detail-log">
              <div class="detail-log-icon" @click="showLog = !showLog">
                <i :class="{'detail-log-show': showLog}"></i>
              </div>
              <Timeline :style="logListHeight" class="detail-log-timeline">
                <TimelineItem v-for="(item, key) in logList" :key="key" class="detail-log-timeline-item">
                  <i slot="dot"></i>
                  <span style="margin-right: 60px;color: #777;">{{item.createTimeLong | timeFormatter}}</span>
                  <span style="color: #333;">{{'【' + item.operatorName + '】' + item.description}}</span>
                </TimelineItem>
              </Timeline>
            </div>
          </div>
        </section>
      </TabPane>
      <TabPane :label="expLabel" :disabled="exceptionCount == 0" name="exception">
        <Exception ref="exception" :pickup-id="this.id" :cnt="exceptionCount" :bill-type="2"/>
      </TabPane>
    </Tabs>

  </div>
</template>

<script>

/**
 * 外转单详情
 */

import BasePage from '@/basic/BasePage'
import TransportBase from '../mixin/transportBase'
import DetailMixin from '../mixin/detailMixin'
import Server from '@/libs/js/server'
import Exception from './exception.vue'

export default {
  name: 'detailOuter',
  components: { Exception },
  mixins: [ BasePage, TransportBase, DetailMixin ],
  metaInfo: { title: '外转单详情' },
  data () {
    return {
      status: '',
      // 信息
      info: {
        orderNo: '',
        customerOrderNo: '',
        transNo: '',
        outTransNo: '',
        consignerName: '',
        deliveryTimeLong: '',
        arriveTimeLong: '',
        start: void 0,
        end: void 0,
        startName: '',
        endName: '',
        pickup: '',
        receiptCount: '',
        consignerContact: '',
        consignerPhone: '',
        consignerAddress: '',
        consigneeContact: '',
        consigneePhone: '',
        consigneeAddress: '',
        remark: ''
      },
      collectionMoney: 0,
      payment: {
        transfereeName: '',
        transFee: '',
        payType: '',
        mileage: ''
      },

      // 所有按钮组
      btnList: [
        {
          status: '待发运',
          btns: [{
            name: '删除',
            code: 120304,
            func: () => {
              this.billDelete()
            }
          }, {
            name: '发运',
            code: 120301,
            func: () => {
              this.billShipment()
            }
          }, {
            name: '编辑',
            code: 120303,
            func: () => {
              this.billEdit()
            }
          }, {
            name: '上报异常',
            code: 120210,
            func: () => {
              this.updateExcept({ id: this.id, type: 2 })
            }
          }]
        },
        {
          status: '在途',
          btns: [{
            name: '到货',
            code: 120302,
            func: () => {
              this.billArrived()
            }
          }, {
            name: '查看车辆位置',
            code: 120309,
            func: () => {
              this.billLocation()
            }
          }, {
            name: '上报异常',
            code: 120210,
            func: () => {
              this.updateExcept({ id: this.id, type: 2 })
            }
          }]
        },
        {
          status: '已到货',
          btns: [{
            name: '上报异常',
            code: 120210,
            func: () => {
              this.updateExcept({ id: this.id, type: 2 })
            }
          }]
        }
      ],

      tableCanEdit: false,
      tableColumns: [
        {
          title: '货物名称',
          key: 'cargoName',
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.cargoName)
          }
        },
        {
          title: '包装',
          key: 'unit',
          width: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.unit)
          }
        },
        {
          title: '数量',
          key: 'quantity',
          width: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.quantity)
          }
        },
        {
          title: '货值(元)',
          key: 'cargoCost',
          width: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.cargoCost === '' ? '' : p.row.cargoCost / 100)
          }
        },
        {
          title: '重量(吨)',
          key: 'weight',
          width: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.weight)
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          width: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.volume)
          }
        },
        {
          title: '备注1',
          key: 'remark1',
          minWidth: 140,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.remark1)
          }
        },
        {
          title: '备注2',
          key: 'remark2',
          minWidth: 140,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.remark2)
          }
        }
      ]
    }
  },

  methods: {
    // 将数据返回的标识映射为文字
    statusFilter (status) {
      switch (status) {
        case 1: return '待发运'
        case 2: return '在途'
        case 3: return '已到货'
      }
    },

    fetchData () {
      this.loading = true
      Server({
        url: '/outside/bill/detail',
        method: 'post',
        data: { transId: this.id }
      }).then(res => {
        const data = res.data.data
        this.collectionMoney = data.customerInfo.collectionMoney // 代收货款
        for (let key in this.info) {
          this.info[key] = data.customerInfo[key]
        }
        for (let key in this.payment) {
          this.payment[key] = data.customerInfo[key]
        }
        this.detail = data.cargoList
        this.logList = data.operaterLogs

        this.status = this.statusFilter(data.customerInfo.status)
        this.setBtnsWithStatus()
        this.exceptionCount = data.abnormalCnt
        if (this.exceptionCount) {
          this.$refs['exception'] && this.$refs['exception'].initData()
        }
        this.loading = false
      }).catch(err => console.error(err))
    },

    // 按钮操作
    // 删除
    billDelete (ids) {
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
              data: { transIds: [ self.id ] }
            }).then(res => {
              self.$Message.success('删除成功')
              self.ema.fire('closeTab', self.$route)
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 到货
    billArrived () {
      const self = this
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
              data: { transIds: [ self.id ] }
            }).then(res => {
              self.$Message.success('操作成功')
              self.fetchData()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 发运
    billShipment () {
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
              data: { transIds: [ self.id ] }
            }).then(res => {
              self.$Message.success('操作成功')
              self.fetchData()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 编辑
    billEdit () {
      const self = this
      self.openDialog({
        name: 'transport/dialog/editOuter',
        data: {
          id: this.id,
          financeRulesInfo: {
            start: this.info.start,
            end: this.info.end,
            weight: self.orderTotal.weight,
            volume: self.orderTotal.volume
          }
        },
        methods: {
          complete () {
            self.fetchData()
          }
        }
      })
    },
    // 位置
    billLocation () {
      let data = {}
      data.transId = this.id
      Server({
        url: '/outside/bill/single/location',
        method: 'post',
        data
      }).then(res => {
        let cars
        if (!res.data.data.points.length) {
          this.$Message.warning('暂无车辆位置信息')
          return
        }
        cars = [res.data.data]
        this.openDialog({
          name: 'transport/dialog/map',
          data: {
            cars,
            multiple: false
          },
          methods: {}
        })
      }).catch(err => console.error(err))
    },
    themeBarColor (code) {
      let barClass
      switch (code) {
        case '待发运':
          barClass = 'i-bar-warning'
          break
        case '在途':
          barClass = 'i-bar-info'
          break
        case '已到货':
          barClass = 'i-bar-success'
          break
      }
      return barClass
    },
    // 每种状态对应各自主题色
    themeStatusColor (code) {
      let statusClass
      switch (code) {
        case '待发运':
          statusClass = 'i-status-warning'
          break
        case '在途':
          statusClass = 'i-status-info'
          break
        case '已到货':
          statusClass = 'i-status-success'
          break
      }
      return statusClass
    }
  }
}
</script>

<style lang='stylus'>
  @import "../style/detail.styl"
</style>
