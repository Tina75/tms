<template>
  <!-- 默认状态 -->
  <div v-if="!inEditing" class="transport-detail">
    <!-- 运单号及状态 -->
    <section class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">运单号：{{ info.waybillNo }}</li>
        <li class="detail-header-list-item">订单状态：
          <span style="font-weight: bold;">{{ status }}</span>
        </li>
      </ul>
    </section>

    <div class="detail-btn-group">
      <Button v-for="(item, key) in showButtons"
              :key="key" :type="key === (showButtons.length - 1) ? 'primary' : 'default'"
              class="detail-btn-item"
              @click="item.func">{{ item.name }}</Button>
    </div>

    <section class="detail-info">
      <!-- 运单信息 -->
      <div>
        <div class="detail-part-title">
          <span>运单信息</span>
        </div>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title">始发地：</span>
            <span>{{ info.start | cityFormatter }}</span>
          </i-col>
          <i-col span="6" offset="1">
            <span class="detail-field-title">目的地：</span>
            <span>{{ info.end | cityFormatter }}</span>
          </i-col>
          <i-col span="10" offset="1">
            <span class="detail-field-title">承运商：</span>
            <span>{{ info.carrierName }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title">车牌号：</span>
            <span>{{ info.carNo }}</span>
          </i-col>
          <i-col span="6" offset="1">
            <span class="detail-field-title">车型：</span>
            <span>{{ info.carType|carTypeFormatter }} {{ info.carLength|carLengthFormatter }}</span>
          </i-col>
          <i-col span="10" offset="1">
            <span class="detail-field-title">司机：</span>
            <span>{{ (info.driverName || '') + ' ' + (info.driverPhone || '') }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
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
          <i-col span="4">
            <span class="detail-field-title-sm">运输费：</span>
            <span class="detail-field-fee">{{ payment.freightFee || 0 }}元</span>
          </i-col>
          <i-col span="4" offset="1">
            <span class="detail-field-title-sm">装货费：</span>
            <span class="detail-field-fee">{{ payment.loadFee || 0 }}元</span>
          </i-col>
          <i-col span="4" offset="1">
            <span class="detail-field-title-sm">卸货费：</span>
            <span class="detail-field-fee">{{ payment.unloadFee || 0 }}元</span>
          </i-col>
          <i-col span="4" offset="1">
            <span class="detail-field-title-sm">保险费：</span>
            <span class="detail-field-fee">{{ payment.insuranceFee || 0 }}元</span>
          </i-col>
          <i-col span="4" offset="1">
            <span class="detail-field-title-sm">其他：</span>
            <span class="detail-field-fee">{{ payment.otherFee || 0 }}元</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm" style="vertical-align: unset;">费用合计：</span>
            <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm">结算方式：</span>
            <div v-if="settlementType"
                 class="detail-payment-way">
              {{ settlementType === '1' ? '按单结' : '月结' }}

              <PayInfo
                v-if="settlementType === '1'"
                :loading="loading"
                :data="settlementPayInfo"
                class="detail-field-payinfo" />
            </div>
          </i-col>
        </Row>
      </div>
      <!-- 运单日志 -->
      <div>
        <div class="detail-part-title">
          <span>运单日志</span>
        </div>
        <div class="detail-log">

          <div class="detail-log-icon"
               @click="showLog = !showLog">
            <i :class="{'detail-log-show': showLog}"></i>
          </div>

          <Timeline :style="logListHeight"
                    class="detail-log-timeline">

            <TimelineItem v-for="(item, key) in logList"
                          :key="key" class="detail-log-timeline-item">
              <i slot="dot"></i>
              <span style="margin-right: 60px;color: #777;">{{item.createTimeLong | timeFormatter}}</span>
              <span style="color: #333;">{{'【' + item.operatorName + '】' + item.description}}</span>
            </TimelineItem>

          </Timeline>
        </div>
      </div>
    </section>
  </div>

  <!-- 编辑状态 -->
  <div v-else class="transport-detail">
    <!-- 运单号及状态 -->
    <section class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">运单号：{{ info.waybillNo }}</li>
        <li class="detail-header-list-item">订单状态：
          <span style="font-weight: bold;">{{ status }}</span>
        </li>
      </ul>
    </section>

    <div class="detail-btn-group"></div>

    <section class="detail-info">
      <!-- 运单信息 -->
      <div>
        <div class="detail-part-title">
          <span>运单信息</span>
        </div>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title detail-field-required">始发地：</span>
            <SelectInputForCity v-model="info.start"
                                class="detail-info-input" />
          </i-col>
          <i-col span="6" offset="1">
            <span class="detail-field-title detail-field-required">目的地：</span>
            <SelectInputForCity v-model="info.end"
                                class="detail-info-input" />
          </i-col>
          <i-col span="10" offset="1">
            <span class="detail-field-title">承运商：</span>
            <SelectInput v-model="info.carrierName"
                         class="detail-info-input"
                         mode="carrier"
                         @on-select="selectCarrierHandler" />
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title">车牌号：</span>
            <SelectInput :carrier-id="carrierId"
                         v-model="info.carNo"
                         class="detail-info-input"
                         mode="carNo"
                         @on-select="autoComplete" />
          </i-col>
          <i-col span="6" offset="1">
            <span class="detail-field-title">车型/车长：</span>
            <Select v-model="info.carType"
                    class="detail-info-input-half"
                    style="margin-right: 12px;">
              <Option v-for="item in carType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="info.carLength"
                    class="detail-info-input-half">
              <Option v-for="item in carLength" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </i-col>
          <i-col span="4" offset="1">
            <span class="detail-field-title">司机：</span>
            <SelectInput :carrier-id="carrierId"
                         v-model="info.driverName"
                         class="detail-info-input"
                         mode="driver"
                         @on-select="autoComplete"
                         @on-option-loaded="driverOptionLoaded" />
          </i-col>
          <i-col span="5" offset="1">
            <span class="detail-field-title">司机手机号：</span>
            <Input v-model="info.driverPhone"
                   :maxlength="11"
                   class="detail-info-input" />
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="13">
            <span class="detail-field-title">备注：</span>
            <Input v-model="info.remark"
                   :maxlength="100"
                   class="detail-info-input" />
          </i-col>
        </Row>
      </div>
      <!-- 货物明细 -->
      <div>
        <div class="detail-part-title">
          <span>货物明细</span>
        </div>
        <Button class="detail-field-button" type="primary"
                @click="addOrder('freight')">添加订单</Button>
        <Table :columns="tableColumns" :data="detail" :loading="loading"></Table>
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
            <span class="detail-field-title-sm">运输费：</span>
            <MoneyInput v-model="payment.freightFee"
                        class="detail-payment-input" />
            <a class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
          </i-col>
          <i-col span="4">
            <span class="detail-field-title-sm">装货费：</span>
            <MoneyInput v-model="payment.loadFee"
                        class="detail-payment-input" />
          </i-col>
          <i-col span="4">
            <span class="detail-field-title-sm">卸货费：</span>
            <MoneyInput v-model="payment.unloadFee"
                        class="detail-payment-input" />
          </i-col>
          <i-col span="4">
            <span class="detail-field-title-sm">保险费：</span>
            <MoneyInput v-model="payment.insuranceFee"
                        class="detail-payment-input" />
          </i-col>
          <i-col span="4">
            <span class="detail-field-title-sm">其他：</span>
            <MoneyInput v-model="payment.otherFee"
                        class="detail-payment-input" />
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm" style="vertical-align: unset;">费用合计：</span>
            <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm">结算方式：</span>
            <div class="detail-payment-way">
              <RadioGroup v-model="settlementType">
                <Radio label="1">按单结</Radio>
                <Radio label="2">月结</Radio>
              </RadioGroup>
              <PayInfo v-if="settlementType === '1'"
                       ref="$payInfo"
                       :loading="loading"
                       :total="paymentTotal"
                       :data="settlementPayInfo"
                       class="detail-field-payinfo"
                       mode="edit" />
            </div>
          </i-col>
        </Row>
      </div>
    </section>

    <section class="detail-edit-footer">
      <Button class="detail-edit-footer-btn" type="primary"
              @click="save">保存</Button>
      <Button class="detail-edit-footer-btn" type="default"
              @click="cancelEdit">取消</Button>
    </section>

  </div>
</template>

<script>

/**
 * 运单详情与编辑
 */

import BasePage from '@/basic/BasePage'
import TransportBase from '../mixin/transportBase'
import DetailMixin from '../mixin/detailMixin'
import SelectInputMixin from '../mixin/selectInputMixin'

import MoneyInput from '../components/MoneyInput'
import SelectInputForCity from '@/components/SelectInputForCity'
import SelectInput from '../components/SelectInput.vue'
import PayInfo from '../components/PayInfo'

import Server from '@/libs/js/server'
import TMSUrl from '@/libs/constant/url'
import _ from 'lodash'

export default {
  name: 'DetailFeright',
  metaInfo: { title: '运单详情' },
  components: { MoneyInput, SelectInput, SelectInputForCity, PayInfo },
  mixins: [ BasePage, TransportBase, SelectInputMixin, DetailMixin ],

  data () {
    return {
      pageName: 'feright',
      status: '',
      // 信息
      info: {
        waybillNo: '',
        start: void 0,
        end: void 0,
        carrierName: '',
        carNo: '',
        carType: '',
        carLength: '',
        driverName: '',
        driverPhone: '',
        remark: ''
      },

      // 支付方式
      settlementType: '',
      settlementPayInfo: [
        { payType: 1, fuelCardAmount: '', cashAmount: '' },
        { payType: 2, fuelCardAmount: '', cashAmount: '' },
        { payType: 3, fuelCardAmount: '', cashAmount: '' }
      ],

      // 所有按钮组
      btnList: [
        {
          status: '待派车',
          btns: [{
            name: '删除',
            code: 120105,
            func: () => {
              this.billDelete()
            }
          }, {
            name: '派车',
            code: 120101,
            func: () => {
              this.billSendCar()
            }
          }, {
            name: '编辑',
            code: 120107,
            func: () => {
              this.inEditing = true
            }
          }]
        },
        {
          status: '待发运',
          btns: []
        },
        {
          status: '在途',
          btns: [{
            name: '位置',
            code: 120106,
            func: () => {
              this.billLocation()
            }
          }]
        },
        {
          status: '已到货',
          btns: []
        }
      ],

      tableCanEdit: true,
      tableColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          width: 180,
          render: (h, p) => {
            return h('a', {
              style: { color: '#3A7EDE' },
              on: {
                click: () => {
                  this.openTab({
                    // title: p.row.orderNo,
                    path: TMSUrl.ORDER_DETAIL,
                    query: {
                      id: p.row.orderNo,
                      orderId: p.row.orderId,
                      from: 'order'
                    }
                  })
                }
              }
            }, p.row.orderNo)
          }
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          width: 180,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.customerOrderNo, true)
          }
        },
        {
          title: '始发地-目的地',
          key: 'start',
          width: 180,
          render: (h, p) => {
            const start = this.cityFormatter(p.row.start)
            const end = this.cityFormatter(p.row.end)
            return this.tableDataRender(h, start && end ? [start, end].join('-') : '')
          }
        },
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
        case 1: return '待派车'
        case 2: return '待发运'
        case 3: return '在途'
        case 4: return '已到货'
      }
    },

    fetchData () {
      this.loading = true
      Server({
        url: '/waybill/details',
        method: 'post',
        data: {
          waybillId: this.id,
          waybillNo: this.no
        }
      }).then(res => {
        const data = res.data.data

        this.id = data.waybill.waybillId
        for (let key in this.info) {
          this.info[key] = data.waybill[key]
        }
        for (let key in this.payment) {
          this.payment[key] = this.setMoneyUnit2Yuan(data.waybill[key])
        }
        this.detail = data.cargoList
        this.logList = data.operaterLog

        this.status = this.statusFilter(data.waybill.status)
        this.settlementType = data.waybill.settlementType ? data.waybill.settlementType.toString() : ''
        let temp = this.settlementPayInfo.map((item, i) => {
          if (!data.waybill.settlementPayInfo[i]) return item
          else {
            const temp = data.waybill.settlementPayInfo[i]
            temp.fuelCardAmount = this.setMoneyUnit2Yuan(temp.fuelCardAmount)
            temp.cashAmount = this.setMoneyUnit2Yuan(temp.cashAmount)
            return Object.assign(item, temp)
          }
        })
        this.settlementPayInfo = temp

        this.setBtnsWithStatus()
        this.loading = false
      }).catch(err => console.error(err))
    },

    // 保存编辑
    save () {
      if (!this.validate()) return

      Server({
        url: '/waybill/update',
        method: 'post',
        data: {
          waybill: {
            waybillId: this.id,
            ...this.info,
            ...this.formatMoney(),
            settlementType: this.settlementType,
            settlementPayInfo: this.settlementType === '1' ? this.$refs.$payInfo.getPayInfo() : void 0
          },
          cargoList: _.uniq(this.detail.map(item => item.orderId))
        }
      }).then(res => {
        this.$Message.success('保存成功')
        this.cancelEdit()
      }).catch(err => console.error(err))
    },

    // 计费规则
    showChargeRules () {
      const self = this
      if (!self.info.carrierName) {
        this.$Message.error('请先选择承运商')
        return
      }
      if (!self.detail.length) {
        this.$Message.error('请先添加订单')
        return
      }
      this.openDialog({
        name: 'dialogs/financeRule',
        data: {
          // 以下数据必传
          partnerType: 2, // 计费规则分类 - 发货方1 承运商2 外转方3
          partnerName: self.info.carrierName, // 名称
          weight: self.orderTotal.weight, // 货物重量
          volume: self.orderTotal.volume, // 货物体积
          start: self.info.start, // 始发地code
          end: self.info.end // 目的地code
        },
        methods: {
          // 确认计费规则后返回金额(元)
          ok (charge) {
            self.payment.freightFee = charge || 0
          }
          // 如果有两层对话框，在计费规则中点击去设置按钮后需要关闭第一层对话框
          // closeParentDialog () {
          // self.close()
          // }
        }
      })
    },

    // 按钮操作
    // 派车
    billSendCar () {
      const self = this
      Server({
        url: '/waybill/check/order',
        method: 'post',
        data: { waybillIds: [ self.id ] }
      }).then(() => {
        self.openDialog({
          name: 'transport/dialog/action',
          data: {
            id: self.id,
            type: 'sendCar'
          },
          methods: {
            complete () {
              self.fetchData()
            }
          }
        })
      })
    },
    // 位置
    billLocation () {
      Server({
        url: '/waybill/location',
        method: 'post',
        data: { waybillIds: [ this.id ] }
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
              data: { waybillIds: [ self.id ] }
            }).then(res => {
              self.$Message.success('删除成功')
              self.ema.fire('closeTab', self.$route)
            }).catch(err => console.error(err))
          }
        }
      })
    }
  }
}
</script>

<style lang='stylus'>
  @import "../style/detail.styl"
</style>
