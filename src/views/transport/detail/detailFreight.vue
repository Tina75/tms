<template>
  <!-- 默认状态 -->
  <div v-if="inEditing === 'no'" class="transport-detail">
    <!-- 运单号及状态 -->
    <section :class="themeBarColor(status)" class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">运单号：{{ info.waybillNo }}</li>
        <li class="detail-header-list-item">订单状态：
          <span :class="themeStatusColor(status)" style="font-weight: bold;">{{ status }}</span>
        </li>
      </ul>
    </section>
    <div class="detail-btn-group">
      <Button
        v-for="(item, key) in showButtons"
        :key="key" :type="key === (showButtons.length - 1) ? 'primary' : 'default'"
        class="detail-btn-item"
        @click="item.func">{{ item.name }}
      </Button>
    </div>
    <Tabs :value="activeTab" :animated="false">
      <TabPane  label="运单详情" name="detail">
        <section class="detail-info">
          <!-- 运单信息 -->
          <div>
            <div class="detail-part-title">
              <span>运单信息</span>
            </div>
            <Row class="detail-field-group">
              <i-col span="8">
                <span class="detail-field-title">始发地：</span>
                <span>{{ info.startName }}</span>
              </i-col>
              <i-col span="8">
                <span class="detail-field-title">目的地：</span>
                <span>{{ info.endName }}</span>
              </i-col>
              <i-col span="8">
                <span class="detail-field-title">派车方式：</span>
                <span v-if="info.assignCarType">{{ info.assignCarType === 1 ? '外转' : '自送' }}</span>
                <span v-else>-</span>
              </i-col>
            </Row>
            <!-- 自送或外转 -->
            <div style="margin: 10px 0">
              <Row class="detail-field-group">
                <i-col v-if="info.assignCarType === 1" span="8">
                  <span class="detail-field-title">承运商：</span>
                  <span v-if="info.carrierName">{{ info.carrierName }}</span>
                  <span v-else>-</span>
                </i-col>
                <i-col v-else span="8">
                  <span class="detail-field-title">车牌号：</span>
                  <span v-if="info.carNo">{{ info.carNo }}</span>
                  <span v-else>-</span>
                </i-col>
                <i-col span="8" >
                  <span class="detail-field-title">{{ info.assignCarType === 1 ? '司机：' : '主司机：' }}</span>
                  <span v-if="info.driverName">{{ (info.driverName || '') + ' ' + (info.driverPhone || '') }}</span>
                  <span v-else>-</span>
                </i-col>
                <i-col v-if="info.assignCarType === 2" span="8">
                  <span class="detail-field-title">副司机：</span>
                  <span v-if="info.assistantDriverName">{{ (info.assistantDriverName || '') + ' ' + (info.assistantDriverPhone || '') }}</span>
                  <span v-else>-</span>
                </i-col>
                <i-col v-if="info.assignCarType === 1" span="8">
                  <span class="detail-field-title">车型：</span>
                  <span v-if="info.carType">{{ info.carType|carTypeFormatter }} {{ info.carLength|carLengthFormatter }}</span>
                  <span v-else>-</span>
                </i-col>
              </Row>
              <Row class="detail-field-group">
                <i-col v-if="info.assignCarType === 1" span="8">
                  <span class="detail-field-title">车牌号：</span>
                  <span v-if="info.carNo">{{ info.carNo }}</span>
                  <span v-else>-</span>
                </i-col>
                <i-col v-else span="8">
                  <span class="detail-field-title">车型：</span>
                  <span v-if="info.carType">{{ info.carType|carTypeFormatter }} {{ info.carLength|carLengthFormatter }}</span>
                  <span v-else>-</span>
                </i-col>
                <i-col span="8">
                  <span class="detail-field-title">代收货款：</span>
                  <span v-if="info.collectionMoney">{{info.collectionMoney / 100}}元</span>
                  <span v-else>-</span>
                </i-col>
                <i-col v-if="info.assignCarType === 1" span="8">
                  <span class="detail-field-title">返现运费：</span>
                  <span v-if="info.cashBack">{{info.cashBack / 100}}元</span>
                  <span v-else>-</span>
                </i-col>
              </Row>
            </div>
            <Row class="detail-field-group">
              <i-col span="13">
                <span class="detail-field-title">备注：</span>
                <span>{{ info.remark || '无' }}</span>
              </i-col>
            </Row>
          </div>
          <!-- 承运订单 -->
          <div>
            <div class="detail-part-title">
              <span>承运订单</span>
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
          <!-- 费用明细 -->
          <div>
            <div class="detail-part-title">
              <span>费用明细</span>
            </div>
            <Row class="detail-field-group">
              <i-col span="6">
                <span class="detail-field-title-sm">计费里程：</span>
                <span class="detail-field-fee">{{ payment.mileage || 0 }}公里</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title-sm">{{ info.assignCarType === 1 ? '运输费：' : '油费：' }}</span>
                <span class="detail-field-fee">{{ payment.freightFee || 0 }}元</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title-sm">装货费：</span>
                <span class="detail-field-fee">{{ payment.loadFee || 0 }}元</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title-sm">卸货费：</span>
                <span class="detail-field-fee">{{ payment.unloadFee || 0 }}元</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title-sm">路桥费：</span>
                <span class="detail-field-fee">{{ payment.tollFee || 0 }}元</span>
              </i-col>
              <i-col span="6">
                <span class="detail-field-title-sm">保险费：</span>
                <span class="detail-field-fee">{{ payment.insuranceFee || 0 }}元</span>
              </i-col>
              <i-col span="6">
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
            <Row v-if="info.assignCarType === 1" class="detail-field-group">
              <i-col span="24">
                <span class="detail-field-title-sm">结算方式：</span>
                <div v-if="settlementType" class="detail-payment-way">
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
      <TabPane   :label="changelabel" :disabled="changeCount === 0" name="change">
        <change ref="change" :pickup-id="this.id" :cnt="changeCount" :bill-type="3"/>
      </TabPane>
      <TabPane  :label="expLabel" :disabled="exceptionCount == 0" name="exception">
        <Exception ref="exception" :pickup-id="this.id" :cnt="exceptionCount" :bill-type="3"/>
      </TabPane>
    </Tabs>

    <PrintFreight ref="$printer" :data="printData" />
  </div>

  <!-- 编辑和改单状态 -->
  <div v-else class="transport-detail">
    <!-- 运单号及状态 -->
    <section :class="themeBarColor(status)" class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">运单号：{{ info.waybillNo }}</li>
        <li class="detail-header-list-item">订单状态：
          <span :class="themeStatusColor(status)" style="font-weight: bold;">{{ status }}</span>
        </li>
      </ul>
    </section>

    <div class="detail-btn-group"></div>

    <section class="detail-info">
      <!-- 运单线路 -->
      <div>
        <div class="detail-part-title">
          <span>运单信息</span>
        </div>

        <Form ref="send" :model="info" :rules="rules" :label-width="82" label-position="left" class="part" style="border-bottom: none;">
          <Row class="detail-field-group">
            <i-col span="8">
              <FormItem label="始发地：" prop="start">
                <city-select v-model="info.start" style="width:200px"></city-select>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="目的地：" prop="end">
                <city-select v-model="info.end" style="width:200px"></city-select>
              </FormItem>
            </i-col>
          </Row>

          <div class="sub-title">
            <div class="send-label">派车方式：</div>
            <RadioGroup v-model="sendWay">
              <Radio label="2">自送</Radio>
              <Radio label="1">外转</Radio>
              <!-- <Radio label="3">下发承运商</Radio> -->
            </RadioGroup>
          </div>
          <own-send-info v-if="sendWay === '2'" ref="ownSendInfo" :form="info" source="detail"></own-send-info>
          <send-carrier-info
            v-else
            ref="SendCarrierInfo"
            :carrier-info="carrierInfo"
            source="detail"></send-carrier-info>

          <Row class="detail-field-group">
            <i-col span="24">
              <FormItem label="备注：" class="padding-left-label">
                <Input v-model="info.remark" :maxlength="100" class="detail-info-input" />
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <!-- 承运订单 -->
      <div>
        <div class="detail-part-title">
          <span>承运订单</span>
        </div>
        <Button v-if="status === '待发运'" class="detail-field-button" type="primary"
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
      <!-- 费用明细 -->
      <div>
        <div class="detail-part-title">
          <span>费用明细</span>
        </div>
        <send-fee
          ref="sendFee"
          :payment="payment"
          :settlement-type="settlementType"
          :settlement-pay-info="settlementPayInfo"
          :finance-rules-info="financeRulesInfo"
          :send-way="sendWay">
        </send-fee>
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
import TagNumberInput from '@/components/TagNumberInput'
// import validator from '@/libs/js/validate'
import CitySelect from '@/components/SelectInputForCity'
import SelectInput from '../components/SelectInput.vue'
import PayInfo from '../components/PayInfo'
import Exception from './exception.vue'
import change from './change.vue'
import PrintFreight from '../components/PrintFreight'

import OwnSendInfo from '../components/ownSendInfo.vue'
import SendCarrierInfo from '../components/SendCarrierInfo'
import SendFee from '../components/SendFee'

import Server from '@/libs/js/server'
import TMSUrl from '@/libs/constant/url'
import _ from 'lodash'
import { mapActions } from 'vuex'

export default {
  name: 'detailFeright',
  metaInfo: { title: '运单详情' },
  components: { TagNumberInput, MoneyInput, SelectInput, CitySelect, PrintFreight, PayInfo, Exception, change, OwnSendInfo, SendCarrierInfo, SendFee },
  mixins: [ BasePage, TransportBase, SelectInputMixin, DetailMixin ],

  data () {
    // 验证运费
    // const validateFreightFee = (rule, value, callback) => {
    //   if (value === '' && (_this.status === '在途' || '已到货')) {
    //     callback(new Error('费用不能为空'))
    //   }
    //   if ((value && validator.fee(value)) || !value) {
    //     callback()
    //   } else {
    //     callback(new Error('费用整数位最多输入9位,小数2位'))
    //   }
    // }
    return {
      pageName: 'feright',
      status: '',
      // 信息
      info: {
        status: void 0,
        waybillNo: '',
        start: void 0,
        end: void 0,
        startName: '',
        endName: '',
        carrierName: '',
        carNo: '',
        carType: '',
        carLength: '',
        driverName: '',
        driverPhone: '',
        remark: '',
        collectionMoney: 0, // 代收货款
        cashBack: 0, // 返现运费
        assignCarType: 1, // 派车类型 1 外转 2 自送 V1.07新增
        assistantDriverName: '', // 副司机名称  V1.07新增
        assistantDriverPhone: '' // 副司机电话  V1.07新增
      },
      // 外转赋值给子组件
      carrierInfo: {
        carrierName: '',
        driverName: '',
        driverPhone: '',
        carNo: '',
        carType: '',
        carLength: ''
      },
      // 自送赋值给子组件
      ownInfo: {},
      payment: {
        freightFee: null,
        loadFee: null,
        unloadFee: null,
        insuranceFee: null,
        otherFee: null,
        cashBack: null,
        tollFee: null, // 路桥费
        mileage: null // 计费里程 v1.06 新增
      },
      rules: {
        start: [
          { required: true, type: 'number', message: '请填写始发地', trigger: 'change' },
          { required: true, type: 'number', message: '请填写始发地', trigger: 'blur' }
        ],
        end: [
          { required: true, type: 'number', message: '请填写目的地', trigger: 'change' },
          { required: true, type: 'number', message: '请填写目的地', trigger: 'blur' }
        ]
      },
      // 支付方式
      settlementType: '',
      settlementPayInfo: [
        { payType: 1, fuelCardAmount: '', cashAmount: '', isCashDisabled: false, isCardDisabled: false },
        { payType: 2, fuelCardAmount: '', cashAmount: '', isCashDisabled: false, isCardDisabled: false },
        { payType: 3, fuelCardAmount: '', cashAmount: '', isCashDisabled: false, isCardDisabled: false }
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
          },
          {
            name: '派车',
            code: 120101,
            func: () => {
              this.billSendCar()
            }
          }, {
            name: '编辑',
            code: 120107,
            func: () => {
              this.inEditing = 'edit'
            }
          }]
        },
        {
          status: '待发运',
          btns: [{
            name: '打印',
            code: 120103,
            func: () => {
              this.billPrint()
            }
          }, {
            name: '删除',
            code: 120105,
            func: () => {
              this.billDelete()
            }
          }, {
            name: '上报异常',
            code: 120210,
            func: () => {
              this.updateExcept({ id: this.id, type: 3 })
            }
          }, {
            name: '编辑',
            code: 120107,
            func: () => {
              this.inEditing = 'edit'
            }
          }, {
            name: '发运',
            code: 120102,
            func: () => {
              this.billShipment()
            }
          }]
        },
        {
          status: '在途',
          btns: [{
            name: '查看车辆位置',
            code: 120106,
            func: () => {
              this.billLocation()
            }
          }, {
            name: '上报异常',
            code: 120210,
            func: () => {
              this.updateExcept({ id: this.id, type: 3 })
            }
          },
          {
            name: '改单',
            code: 120116,
            func: () => {
              this.inEditing = 'change'
              this.changeStr = JSON.stringify(_.cloneDeep(this.changeParams))
              this.changeState({ id: this.id, type: 3 })
            }
          }]
        },
        {
          status: '已到货',
          btns: [{
            name: '上报异常',
            code: 120210,
            func: () => {
              this.updateExcept({ id: this.id, type: 3 })
            }
          }, {
            name: '改单',
            code: 120116,
            func: () => {
              this.inEditing = 'change'
              this.changeStr = JSON.stringify(_.cloneDeep(this.changeParams))
              this.changeState({ id: this.id, type: 3 })
            }
          }]
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
          title: '客户单号',
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
            const start = p.row.startName
            const end = p.row.endName
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
      ],
      // 改单运费能否修改
      feeStatus: 0, // 0 可以修改运费 10 已对账 20 已核销 30 存在异常记录且修改了运费未处理 2 部分修改运费
      changeStr: '',
      printData: [], // 待打印数据
      sendWay: '1' // 派车类型 1 外转 2 自送  V1.07新增
    }
  },
  computed: {
    feeStatusTip () {
      if (this.feeStatus === 10) return '此单已对账，不允许修改'
      else if (this.feeStatus === 20) return '此单已核销，不允许修改'
      else if (this.feeStatus === 30) return '存在异常未处理，不能修改运单'
      else return ''
    },
    changeParams () {
      let settlementPayInfo = this.settlementPayInfo.map(item => {
        return {
          payType: item.payType,
          fuelCardAmount: typeof item.fuelCardAmount === 'number' ? item.fuelCardAmount * 100 : 0,
          cashAmount: typeof item.cashAmount === 'number' ? item.cashAmount * 100 : 0
        }
      })
      return {
        waybill: {
          waybillId: this.id,
          ...this.info,
          ...this.formatMoney(),
          settlementType: this.settlementType,
          settlementPayInfo: this.settlementType === '1' ? settlementPayInfo : void 0
        },
        cargoList: _.uniq(this.detail.map(item => item.orderId))
      }
    },
    financeRulesInfo () {
      return {
        start: this.info.start,
        end: this.info.end,
        weight: this.orderTotal.weight,
        volume: this.orderTotal.volume
      }
    }
  },
  methods: {
    ...mapActions([
      'getWaybillLocation',
      'waybillShipment',
      'getWaybillPrintData'
    ]),
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
        // 派车方式
        this.sendWay = data.waybill.assignCarType.toString()
        // 将承运商信息赋值给子组件
        if (this.sendWay === '1') { // 外转
          for (let key in this.carrierInfo) {
            this.carrierInfo[key] = data.waybill[key]
          }
        } else { // 自送
          for (let key in this.ownInfo) {
            this.ownInfo[key] = data.waybill[key]
          }
        }
        for (let key in this.payment) {
          this.payment[key] = this.setMoneyUnit2Yuan(data.waybill[key])
          if (key === 'mileage') {
            this.payment[key] = data.waybill[key] / 1000 || null
          }
        }
        this.detail = data.cargoList
        this.logList = data.operaterLog

        this.status = this.statusFilter(data.waybill.status)
        this.settlementType = data.waybill.settlementType ? data.waybill.settlementType.toString() : '1'
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

        // 异常个数
        this.exceptionCount = data.abnormalCnt
        if (this.exceptionCount) {
          this.$refs['exception'] && this.$refs['exception'].initData()
        }
        // 改单个数
        this.changeCount = data.modifyCnt || 0
        this.setBtnsWithStatus()
        this.loading = false
      }).catch(err => console.error(err))
    },
    // 编辑
    edit () {
      const z = this
      let data = {
        waybill: {
          waybillId: z.id,
          waybillNo: z.info.waybillNo,
          start: z.info.start,
          end: z.info.end,
          status: z.info.status,
          remark: z.info.remark,
          assignCarType: z.sendWay
        },
        cargoList: _.uniq(z.detail.map(item => item.orderId))
      }
      if (z.sendWay === '1') {
        data.waybill = Object.assign(data.waybill, z.$refs.sendFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.sendFee.getSettlementType(),
          settlementPayInfo: z.$refs.sendFee.getSettlementPayInfo()
        })
      } else if (z.sendWay === '2') { // 自送
        data.waybill = Object.assign(data.waybill, z.$refs.sendFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
        delete data.waybill.cashBack // 自送没有返现
      }
      console.log(data)
      Server({
        url: '/waybill/update',
        method: 'post',
        data: data
      }).then(res => {
        z.$Message.success('保存成功')
        z.cancelEdit()
      }).catch(err => console.error(err))
    },
    // 改单
    changeBill () {
      const z = this
      let data = {
        waybill: {
          waybillId: z.id,
          waybillNo: z.info.waybillNo,
          start: z.info.start,
          end: z.info.end,
          status: z.info.status,
          remark: z.info.remark,
          assignCarType: z.sendWay
        },
        cargoList: _.uniq(z.detail.map(item => item.orderId))
      }
      if (z.sendWay === '1') {
        data.waybill = Object.assign(data.waybill, z.$refs.sendFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.sendFee.getSettlementType(),
          settlementPayInfo: z.$refs.sendFee.getSettlementPayInfo()
        })
      } else if (z.sendWay === '2') { // 自送
        data.waybill = Object.assign(data.waybill, z.$refs.sendFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
        delete data.waybill.cashBack // 自送没有返现
      }
      console.log(data)
      if (JSON.stringify(data) === z.changeStr) {
        z.$Message.error('您并未做修改')
        return
      }
      Server({
        url: '/waybill/modify',
        method: 'post',
        data: data
      }).then(res => {
        z.$Message.success(res.data.msg)
        z.cancelEdit()
      }).catch(err => console.error(err))
    },

    // 保存编辑
    save () {
      const z = this
      // if (!_this.validate()) return
      z.$refs['send'].validate((valid) => {
        if (valid) {
          if (!z.checkDetailValidate()) return
          if (z.inEditing === 'edit') {
            z.edit()
          } else if (z.inEditing === 'change') {
            z.changeBill()
          } else {
            return false
          }
        }
      })
    },

    // 派车模块数据校验
    checkDetailValidate () {
      const z = this
      let sendFeeComp = z.$refs.sendFee
      let carrierInfoComp = z.$refs.SendCarrierInfo
      let ownSendInfo = z.$refs.ownSendInfo
      if (z.sendWay === '1' && carrierInfoComp.checkCarrierInfo() && sendFeeComp.validate()) {
        return true
      }
      if (z.sendWay === '2' && ownSendInfo.checkOwnSendInfo() && sendFeeComp.validate()) {
        return true
      }
      return false
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
    // 查看车辆位置
    billLocation () {
      this.getWaybillLocation([this.id])
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

          if (!res.points.length) {
            this.$Message.warning('暂无车辆位置信息')
            return
          }

          this.openDialog({
            name: 'transport/dialog/map',
            data: {
              cars: [res],
              multiple: false
            },
            methods: {}
          })
        }).catch(err => {
          console.error(err)
        })
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
    },
    // 发运
    billShipment () {
      const self = this
      if (!self.info.carrierName) {
        this.$Message.warning('承运商未填写，不能发运')
        return
      }
      if (self.detail.length <= 0) {
        this.$Message.warning('此运单未加入订单，不能发运')
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
            self.waybillShipment([ self.id ])
              .then(() => {
                self.$Message.success('操作成功')
                self.fetchData()
              })
          }
        }
      })
    },
    // 打印
    billPrint () {
      const self = this
      self.getWaybillPrintData([ self.id ])
        .then(res => {
          console.log(self.$refs.$printer)
          self.printData = res
          self.$refs.$printer.print()
        })
    },
    themeBarColor (code) {
      let barClass
      switch (code) {
        case '待派车':
          barClass = 'i-bar-warning'
          break
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
        case '待派车':
          statusClass = 'i-status-warning'
          break
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
    },
    // 对应运费改单状态
    changeState (data) {
      Server({
        url: '/waybill/check/update/fee',
        method: 'post',
        data: {
          billId: data.id,
          billType: data.type // 单据类型 1 提货单 2 外转单 3 运单
        }
      }).then(res => {
        let data = res.data.data
        this.feeStatus = data.status
        if (this.feeStatus === 0) { // 允许改单
          this.settlementPayInfo.map(item => {
            item.type = ''
            item.isCashDisabled = false
            item.isCardDisabled = false
          })
        }
        if (this.feeStatus === 2) { //  部分修改运费
          let statusDetail = data.statusDetail
          this.settlementPayInfo.map(item => {
            item.type = 'change'
            if (item.payType === 1 && statusDetail.prepaidCash === 1) {
              item.isCashDisabled = true
            }
            if (item.payType === 1 && statusDetail.prepaidFuel === 1) {
              item.isCardDisabled = true
            }
            if (item.payType === 2 && statusDetail.arrivePaidCash === 1) {
              item.isCashDisabled = true
            }
            if (item.payType === 2 && statusDetail.arrivePaidFuel === 1) {
              item.isCardDisabled = true
            }
            if (item.payType === 3 && statusDetail.receiptPaidCash === 1) {
              item.isCashDisabled = true
            }
            if (item.payType === 3 && statusDetail.receiptPaidFule === 1) {
              item.isCardDisabled = true
            }
          })
          console.log(this.settlementPayInfo)
        }
        if (this.feeStatus === 10 || this.feeStatus === 20 || this.feeStatus === 30) {
          this.settlementPayInfo.map(item => {
            item.type = 'change'
            item.isCashDisabled = true
            item.isCardDisabled = true
          })
        }
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang='stylus'>
  @import "../style/detail.styl"
</style>
<style lang='stylus' scoped>
  .sub-title
    font-size 14px
    color #777
    .send-label
      display inline-block
      margin-right 20px
      vertical-align middle
    .ivu-radio-group-item
      margin-right 41px
</style>
