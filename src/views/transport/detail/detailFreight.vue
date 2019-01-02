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
                <i-col v-if="info.assignCarType === 1" span="8">
                  <span class="detail-field-title">承运商运单号：</span>
                  <span v-if="info.carrierWaybillNo">{{info.carrierWaybillNo}}</span>
                  <span v-else>-</span>
                </i-col>
                <i-col span="8">
                  <span class="detail-field-title">代收货款：</span>
                  <span v-if="info.collectionMoney">{{info.collectionMoney / 100}}元</span>
                  <span v-else>-</span>
                </i-col>
              </Row>
              <Row class="detail-field-group">
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
            <Table ref="cargoTable" :columns="tableColumns" :data="cargoGroupByOrderNo" :loading="loading" class="detail-field-table">
            </Table>
            <div class="table-footer">
              <span class="table-footer-title">总计</span>
              <span>总货值：{{ orderTotal.cargoCost }}元</span>
              <span>总数量：{{ orderTotal.quantity }}</span>
              <span>总体积：{{ orderTotal.volume }}方</span>
              <span>总重量：{{ WeightOption === 1 ? orderTotal.weight + '吨' : orderTotal.weightKg + '公斤' }}</span>
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
              <i-col v-if="info.assignCarType === 2" span="6">
                <span class="detail-field-title-sm">住宿费：</span>
                <span class="detail-field-fee">{{ payment.accommodation || 0 }}元</span>
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
                <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ info.totalFee / 100 }}</span>元
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
            <Row v-if="orderList.length > 1" class="detail-field-group">
              <i-col span="24">
                <span class="detail-field-title-sm">分摊策略：</span>
                <span>{{ getAllocationValToLabel(info.allocationStrategy) }}</span>
              </i-col>
            </Row>
          </div>

          <!-- 车况照片 -->
          <car-photo v-if="imageItems.length > 0" :image-list="imageItems"></car-photo>

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
  <div v-else ref="editPage" class="transport-detail">
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
        </Form>

        <div class="sub-title">
          <div class="send-label">派车方式：</div>
          <RadioGroup v-model="sendWay" @on-change="changeAssignCar">
            <Radio :disabled="radioDisabled" label="2">自送</Radio>
            <Radio :disabled="radioDisabled" label="1">外转</Radio>
            <!-- <Radio label="3">下发承运商</Radio> -->
          </RadioGroup>
        </div>
        <own-send-info v-if="sendWay === '2'" ref="ownSendInfo" :form="ownInfo" :source="source"></own-send-info>
        <send-carrier-info
          v-else
          ref="SendCarrierInfo"
          :carrier-info="carrierInfo"
          :source="source"></send-carrier-info>
      </div>
      <!-- 承运订单 -->
      <div>
        <div class="detail-part-title">
          <span>承运订单</span>
        </div>
        <Button v-if="status === '待发运'" class="detail-field-button" type="primary"
                @click="addOrder('freight')">添加订单</Button>
        <Table ref="cargoEditTable" :columns="tableColumns" :data="cargoGroupByOrderNo" :loading="loading"> </Table>
        <div class="table-footer">
          <span class="table-footer-title">总计</span>
          <span>总货值：{{ orderTotal.cargoCost }}元</span>
          <span>总数量：{{ orderTotal.quantity }}</span>
          <span>总体积：{{ orderTotal.volume }}方</span>
          <span>总重量：{{ WeightOption === 1 ? orderTotal.weight + '吨' : orderTotal.weightKg + '公斤' }}</span>
        </div>
      </div>
      <!-- 费用明细 -->
      <div>
        <div class="detail-part-title">
          <span>费用明细</span>
        </div>
        <send-fee
          ref="sendFee"
          :fee-status-tip="feeStatusTip"
          :is-disabled="feeStatusTip? true: false"
          :payment="payment"
          :settlement-type="settlementType"
          :settlement-pay-info="settlementPayInfo"
          :finance-rules-info="financeRulesInfo"
          :send-way="sendWay"
          :send-fee-orders="orderList"
          :fee-pass-allocation="info.allocationStrategy"
          source="detail">
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
import { defaultOwnForm } from '@/components/own-car-form/mixin.js'
import allocationStrategy from '../constant/allocation.js'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import CarPhoto from './components/car-photo.vue'

export default {
  name: 'detailFeright',
  metaInfo: { title: '运单详情' },
  components: { SelectInput, CitySelect, PrintFreight, PayInfo, Exception, change, OwnSendInfo, SendCarrierInfo, SendFee, CarPhoto },
  mixins: [ BasePage, TransportBase, SelectInputMixin, DetailMixin, tableWeightColumnMixin ],

  data () {
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
        totalFee: 0,
        collectionMoney: 0, // 代收货款
        cashBack: 0, // 返现运费
        assignCarType: 1, // 派车类型 1 外转 2 自送 V1.07新增
        assistantDriverName: '', // 副司机名称  V1.07新增
        assistantDriverPhone: '', // 副司机电话  V1.07新增
        carrierWaybillNo: '', // 承运商运单号 v1.08新增
        allocationStrategy: 1 // 分摊策略 默认按订单数分摊 v1.08新增
      },
      // 外转赋值给子组件
      carrierInfo: {
        carrierName: '',
        driverName: '',
        driverPhone: '',
        carNo: '',
        carType: '',
        carLength: '',
        remark: '',
        carrierWaybillNo: '' // 承运商运单号 v1.08新增z
      },
      // 自送赋值给子组件
      ownInfo: {
        status: '',
        assignCarType: 1,
        ...defaultOwnForm
      },
      payment: {
        freightFee: null,
        loadFee: null,
        unloadFee: null,
        insuranceFee: null,
        otherFee: null,
        cashBack: null,
        tollFee: null, // 路桥费
        mileage: null, // 计费里程 v1.06 新增
        accommodation: null // 住宿费 v1.08 新增
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
        { payType: 3, fuelCardAmount: '', cashAmount: '', isCashDisabled: false, isCardDisabled: false },
        { payType: 4, fuelCardAmount: '', cashAmount: '', isCashDisabled: false, isCardDisabled: false }
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
              this.source = 'change'
              this.inEditing = 'change'
              this.changeStr = this.changeParams
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
              this.source = 'change'
              this.inEditing = 'change'
              this.changeStr = this.changeParams
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
            return this.scopedSlotsRender(h, p, 'cargoName')
            // return this.tableDataRender(h, p.row.cargoName)
          }
        },
        {
          title: '包装',
          key: 'unit',
          width: 120,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'unit')
            // return this.tableDataRender(h, p.row.unit)
          }
        },
        {
          title: '数量',
          key: 'quantity',
          width: 120,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'quantity', 0)
            // return this.tableDataRender(h, p.row.quantity ? p.row.quantity : 0)
          }
        },
        {
          title: '货值(元)',
          key: 'cargoCost',
          width: 120,
          render: (h, p) => {
            return h('div', {},
              p.row.cargoList.map((cargo) => h('div', cargo.cargoCost / 100 || '0.00'))
            )
            // return this.tableDataRender(h, p.row.cargoCost / 100)
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          width: 120,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'volume', 0)
            //  return this.tableDataRender(h, p.row.volume ? p.row.volume : 0)
          }
        },
        {
          title: '备注1',
          key: 'remark1',
          minWidth: 140,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'remark1')
            // return this.tableDataRender(h, p.row.remark1)
          }
        },
        {
          title: '备注2',
          key: 'remark2',
          minWidth: 140,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'remark2')
            // return this.tableDataRender(h, p.row.remark2)
          }
        }
      ],
      // 改单运费能否修改
      feeStatus: 0, // 0 可以修改运费 10 已对账 20 已核销 30 存在异常记录且修改了运费未处理 2 部分修改运费
      changeStr: '',
      printData: [], // 待打印数据
      sendWay: '1', // 派车类型 1 外转 2 自送  V1.07新增
      radioDisabled: false, // 控制单选按钮禁用
      source: 'detail', // 详情页编辑传detail不校验承运商，改单需校验承运商，不传detail
      detail: [],
      imageItems: [] // 需要展示的车况照片list
    }
  },
  computed: {
    feeStatusTip () {
      if (this.feeStatus === 10) return '此单已对账，不允许修改'
      else if (this.feeStatus === 20) return '此单已核销，不允许修改'
      else if (this.feeStatus === 30) return '存在异常未处理，不允许修改'
      else return ''
    },
    changeParams () {
      const z = this
      let data = {
        waybill: {},
        cargoList: _.uniq(z.detail.map(item => item.orderId))
      }
      z.$nextTick(() => {
        if (z.sendWay === '1') {
          data.waybill = Object.assign(data.waybill, z.$refs.sendFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
            settlementType: z.$refs.sendFee.getSettlementType(),
            settlementPayInfo: z.$refs.sendFee.getSettlementPayInfo()
          })
        } else if (z.sendWay === '2') { // 自送
          data.waybill = Object.assign(data.waybill, z.$refs.sendFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
          delete data.waybill.cashBack // 自送没有返现
        }
        Object.assign(data.waybill, {
          waybillId: z.id,
          waybillNo: z.info.waybillNo,
          start: z.info.start,
          end: z.info.end,
          status: z.info.status,
          assignCarType: z.sendWay,
          allocationStrategy: z.orderList.length > 1 ? z.$refs.sendFee.getAllocationStrategy() : void 0
        })
      })
      return data
    },
    // 将货物信息按货物名称累加数量
    cargoInfos () {
      let arr = []
      let list = _.groupBy(this.detail, 'cargoName')
      _.forEach(list, (value, key) => {
        let quantity = _.sumBy(value, (i) => {
          return i.quantity
        })
        arr.push({
          key: key,
          value: quantity
        })
      })
      return arr
    },
    financeRulesInfo () {
      return {
        start: this.info.start,
        end: this.info.end,
        weight: this.orderTotal.weight,
        volume: this.orderTotal.volume,
        cargoInfos: this.cargoInfos
      }
    },
    /**
     * 以orderId分组货物信息，合并后的格式为：
     * cargo = {
     *  1: {
     *  orderNo: '',
     *  orderId: '',
     *  ...
     *  cargoList:[
     *    {cargoName:''},
     *    {cargoName:''}
     *  ]
     * },
     * 2:{
     * }
     * }
     */
    cargoGroupByOrderNo () {
      // 以orderNo分组后的货物明细数据
      let _cargoMapById = {}

      this.detail.forEach((cargo) => {
        // 单独提取货物的字段
        let {
          cargoCost,
          cargoName,
          packing,
          quantity,
          remark1,
          remark2,
          unit,
          volume,
          weight,
          weightKg,
          ...rest
        } = cargo
        if (!_cargoMapById[cargo.orderId]) {
          _cargoMapById[cargo.orderId] = rest
          _cargoMapById[cargo.orderId].cargoList = []
        }
        _cargoMapById[cargo.orderId].cargoList.push({
          cargoCost,
          cargoName,
          packing,
          quantity,
          remark1,
          remark2,
          unit,
          volume,
          weight,
          weightKg
        })
      })
      return Object.values(_cargoMapById)
    }
  },

  mounted () {
    // 判断显示吨列或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.tableColumns, this.columnWeight, 7)
    } else {
      this.triggerWeightColumn(this.tableColumns, this.columnWeightKg, 7)
    }
  },

  methods: {
    ...mapActions([
      'getWaybillLocation',
      'waybillShipment',
      'getWaybillPrintData',
      'checkDriverPhone'
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
    // 将分摊策略返回的标识映射为文字
    getAllocationValToLabel (data) {
      let list = allocationStrategy.find(item => item.value === (data !== '' ? data : 1))
      return list.label
    },
    fetchData () {
      this.loading = true
      return Server({
        url: '/waybill/details',
        method: 'post',
        data: {
          waybillId: this.id,
          waybillNo: this.no
        }
      }).then(res => {
        const data = res.data.data
        this.imageItems = data.carInfo.map((item) => {
          return {
            src: item,
            msrc: item
          }
        })
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
          this.ownInfo = {
            status: data.waybill.status,
            assignCarType: data.waybill.assignCarType,
            ...defaultOwnForm
          }
        } else { // 自送
          for (let key in this.ownInfo) {
            this.ownInfo[key] = data.waybill[key]
          }
          this.carrierInfo = {
            carrierName: '',
            driverName: '',
            driverPhone: '',
            carNo: '',
            carType: '',
            carLength: '',
            remark: '',
            carrierWaybillNo: '' // 承运商运单号
          }
        }
        for (let key in this.payment) {
          this.payment[key] = this.setMoneyUnit2Yuan(data.waybill[key])
          if (key === 'mileage') {
            this.payment[key] = data.waybill[key] / 1000 || null
          }
        }

        // 货物明细显示绑定的表格数据
        // this.cargoGroupByOrderNo = Object.values(_cargoMapById)
        this.detail = data.cargoList
        this.logList = data.operaterLog
        this.orderList = data.orderList

        // _cargoMapById = null

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
        if (this.changeCount) {
          this.$refs['change'] && this.$refs['change'].initData()
        }

        this.setBtnsWithStatus()
        this.loading = false
        return res
      }).catch((er) => {
        return Promise.reject(er)
      })
    },
    /**
     * 修改派车方式
     */
    changeAssignCar (type) {
      if (type === '2') {
        // 外转 切换 到 自送
        if (this.feeStatus !== 0) {
          if (this.feeStatus === 2) {
            this.$Message.warning('此单存在部分核销，不允许修改')
          } else {
            this.$Message.warning(this.feeStatusTip)
          }
          this.$nextTick(() => {
            this.sendWay = '1'
          })
        }
      } else {
        // 自送 切换 到 外转
        if (this.feeStatus !== 0) {
          this.$Message.warning(this.feeStatusTip)
          this.$nextTick(() => {
            this.sendWay = '2'
          })
        }
      }
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
          assignCarType: z.sendWay,
          allocationStrategy: z.orderList.length > 1 ? z.$refs.sendFee.getAllocationStrategy() : void 0
        },
        cargoList: _.uniq(z.detail.map(item => item.orderId))
      }
      if (z.sendWay === '1') {
        data.waybill = Object.assign(data.waybill, z.$refs.sendFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.sendFee.getSettlementType(),
          settlementPayInfo: z.$refs.sendFee.getSettlementPayInfo()
        })
        // 填了司机手机号需要走校验
        if (z.$refs.SendCarrierInfo.getCarrierInfo().driverPhone) {
          z.isPhoneUsed(z.$refs.SendCarrierInfo, data)
        } else {
          z.callSendInterface(data)
        }
      } else if (z.sendWay === '2') { // 自送
        data.waybill = Object.assign(data.waybill, z.$refs.sendFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
        delete data.waybill.cashBack // 自送没有返现
        // 填了司机手机号需要走校验
        if (z.$refs.ownSendInfo.getOwnSendInfo().driverPhone || z.$refs.ownSendInfo.getOwnSendInfo().assistantDriverPhone) {
          z.isPhoneUsed(z.$refs.ownSendInfo, data)
        } else {
          z.callSendInterface(data)
        }
      }
    },

    // 调送货详情编辑接口
    callSendInterface (data) {
      const z = this
      Server({
        url: '/waybill/update',
        method: 'post',
        data: data
      }).then(res => {
        z.$Message.success('保存成功')
        z.cancelEdit()
      }).catch()
    },

    // 改单
    changeBill () {
      const z = this
      let data = {
        waybill: {},
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
      Object.assign(data.waybill, {
        waybillId: z.id,
        waybillNo: z.info.waybillNo,
        start: z.info.start,
        end: z.info.end,
        status: z.info.status,
        assignCarType: z.sendWay,
        allocationStrategy: z.orderList.length > 1 ? z.$refs.sendFee.getAllocationStrategy() : void 0
      })
      if (JSON.stringify(data) === JSON.stringify(z.changeStr)) {
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
      }).catch()
    },

    // 保存编辑
    save () {
      const z = this
      // if (!_this.validate()) return
      z.$refs['send'].validate((valid) => {
        if (valid) {
          if (!z.checkDetailValidate()) return
          // if (z.inEditing === 'change') {
          //   z.$Message.warning('您有信息未填')
          //   return
          // }
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
        }).catch()
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
            }).catch()
          }
        }
      })
    },
    // 发运
    billShipment () {
      const self = this
      if (self.info.assignCarType === 1 && !self.info.carrierName) {
        this.$Message.warning('承运商未填写，不能发运')
        return
      }
      if (self.info.assignCarType === 2 && !self.info.carNo) {
        this.$Message.warning('自送车辆信息未填写，不能发运')
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
            if (item.payType === 4 && statusDetail.tailPaidCash === 1) {
              item.isCashDisabled = true
            }
            if (item.payType === 4 && statusDetail.tailPaidFule === 1) {
              item.isCardDisabled = true
            }
          })
        }
        if (this.feeStatus === 10 || this.feeStatus === 20 || this.feeStatus === 30) {
          this.settlementPayInfo.map(item => {
            item.type = 'change'
            item.isCashDisabled = true
            item.isCardDisabled = true
          })
        }
      }).catch()
    },
    // 校验主副司机手机号有没有被更改
    isPhoneUsed (comp, data) {
      const z = this
      let phoneList = []
      if (z.sendWay === '1') { // 外转
        comp.getCarrierInfo().driverPhone && phoneList.push(comp.getCarrierInfo().driverPhone)
      } else {
        comp.getOwnSendInfo().driverPhone && phoneList.push(comp.getOwnSendInfo().driverPhone)
        comp.getOwnSendInfo().assistantDriverPhone && phoneList.push(comp.getOwnSendInfo().assistantDriverPhone)
      }
      z.checkDriverPhone(phoneList).then((res) => {
        if (!_.every(res, { used: false })) { // 有变更过手机号
          let name = ''
          if (z.sendWay === '1') {
            if (_.every(res, { used: true })) {
              name = '司机'
            }
          } else {
            if (res.length > 1 && _.every(res, { used: true })) {
              name = '主司机和副司机'
            } else {
              let obj = _.find(res, { used: true })
              if (obj.phone === comp.getOwnSendInfo().driverPhone) {
                name = '主司机'
              }
              if (obj.phone === comp.getOwnSendInfo().assistantDriverPhone) {
                name = '副司机'
              }
            }
          }
          z.checkPhoneDialog(name, data)
        } else {
          z.callSendInterface(data)
        }
      })
    },
    // 打开司机手机号校验弹窗
    checkPhoneDialog (name, data) {
      const _this = this
      _this.openDialog({
        name: 'transport/dialog/checkDriverPhone',
        data: { name: name },
        methods: {
          ok (node) {
            _this.callSendInterface(data)
          }
        }
      })
    }
  },
  /**
   * 不同订单号
   * 打开同一该页，数据不会根据querystring刷新问题
   */
  beforeRouteUpdate (to, from, next) {
    this.$nextTick(() => {
      this.id = this.$route.query.id
      this.no = this.$route.query.no
      this.fetchData()
    })
    next()
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
    margin-bottom 10px
    .send-label
      display inline-block
      margin-right 20px
      vertical-align middle
    .ivu-radio-group-item
      margin-right 41px
</style>
