<template>
  <!-- 默认状态 -->
  <div v-if="inEditing === 'no'" class="transport-detail">
    <!-- 运单号及状态 -->
    <section :class="themeBarColor(status)" class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">提货单单号：{{ info.pickupNo }}</li>
        <li class="detail-header-list-item">提货单状态：
          <span :class="themeStatusColor(status)" style="font-weight: bold;">{{ status }}</span>
        </li>
      </ul>
    </section>
    <div class="detail-btn-group">
      <Button
        v-for="(item, key) in showButtons"
        :key="key"
        :type="key === (showButtons.length - 1) ? 'primary' : 'default'"
        class="detail-btn-item"
        @click="item.func">{{ item.name }}</Button>
    </div>
    <Tabs ref="tabs" :value="activeTab" :animated="false">
      <TabPane label="提货单详情" name="detail">
        <section class="detail-info">
          <!-- 提货单信息 -->
          <div>
            <div class="detail-part-title">
              <span>提货单信息</span>
            </div>
            <!-- 自送或外转 -->
            <div style="margin: 10px 0">
              <Row class="detail-field-group">
                <i-col span="8">
                  <span class="detail-field-title">派车方式：</span>
                  <span v-if="info.assignCarType">{{ info.assignCarType === 1 ? '外转' : '自送' }}</span>
                  <span v-else>-</span>
                </i-col>
              </Row>
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
                <!-- <i-col span="8">
                  <span class="detail-field-title">代收货款：</span>
                  <span v-if="info.collectionMoney">{{info.collectionMoney / 100}}元</span>
                  <span v-else>-</span>
                </i-col> -->
              </Row>
            </div>
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
            <Table :columns="tableColumns" :data="cargoGroupByOrderNo" :loading="loading" class="detail-field-table"></Table>
            <div class="table-footer">
              <span class="table-footer-title">总计</span>
              <span>总货值：{{ orderTotal.cargoCost }}元</span>
              <span>总数量：{{ orderTotal.quantity }}</span>
              <span>总体积：{{ orderTotal.volume }}方</span>
              <span>总重量：{{ WeightOption === 1 ? orderTotal.weight + '吨' : orderTotal.weightKg + '公斤' }}</span>
            </div>
          </div>

          <!-- 应付费用 -->
          <div>
            <div class="detail-part-title">
              <span>应付费用</span>
            </div>
            <ul v-if="info.assignCarType === 1" class="detail-field-group">
              <li v-if="DispatchSet.pickOutFreightFeeOption === 1">
                <span class="detail-field-title-sm">运输费：</span>
                <span v-if="payment.freightFee !== ''" class="detail-field-fee">{{ payment.freightFee }}元</span>
                <span v-else>-</span>
              </li>
              <li v-if="DispatchSet.pickOutLoadFeeOption === 1">
                <span class="detail-field-title-sm">装货费：</span>
                <span v-if="payment.loadFee !== ''" class="detail-field-fee">{{ payment.loadFee }}元</span>
                <span v-else>-</span>
              </li>
              <li v-if="DispatchSet.pickOutUnloadFeeOption === 1">
                <span class="detail-field-title-sm">卸货费：</span>
                <span v-if="payment.unloadFee !== ''" class="detail-field-fee">{{ payment.unloadFee }}元</span>
                <span v-else>-</span>
              </li>
              <li v-if="DispatchSet.pickOutInsuranceFeeOption === 1">
                <span class="detail-field-title-sm">保险费：</span>
                <span v-if="payment.insuranceFee !== ''" class="detail-field-fee">{{ payment.insuranceFee }}元</span>
                <span v-else>-</span>
              </li>
              <li v-if="DispatchSet.pickOutOtherFeeOption === 1">
                <span class="detail-field-title-sm">其他：</span>
                <span v-if="payment.otherFee !== ''" class="detail-field-fee">{{ payment.otherFee }}元</span>
                <span v-else>-</span>
              </li>
            </ul>
            <ul v-else class="detail-field-group">
              <li v-if="DispatchSet.pickSelfOilFeeOption === 1">
                <span class="detail-field-title-sm">油费：</span>
                <span v-if="payment.freightFee !== ''" class="detail-field-fee">{{ payment.freightFee }}元</span>
                <span v-else>-</span>
              </li>
              <li v-if="DispatchSet.pickSelfLoadFeeOption === 1">
                <span class="detail-field-title-sm">装货费：</span>
                <span v-if="payment.loadFee !== ''" class="detail-field-fee">{{ payment.loadFee }}元</span>
                <span v-else>-</span>
              </li>
              <li v-if="DispatchSet.pickSelfUnloadFeeOption === 1">
                <span class="detail-field-title-sm">卸货费：</span>
                <span v-if="payment.unloadFee !== ''" class="detail-field-fee">{{ payment.unloadFee }}元</span>
                <span v-else>-</span>
              </li>
              <li v-if="DispatchSet.pickSelfInsuranceFeeOption === 1">
                <span class="detail-field-title-sm">保险费：</span>
                <span v-if="payment.insuranceFee !== ''" class="detail-field-fee">{{ payment.insuranceFee }}元</span>
                <span v-else>-</span>
              </li>
              <li v-if="DispatchSet.pickSelfOtherFeeOption === 1">
                <span class="detail-field-title-sm">其他：</span>
                <span v-if="payment.otherFee !== ''" class="detail-field-fee">{{ payment.otherFee }}元</span>
                <span v-else>-</span>
              </li>
            </ul>
            <Row class="detail-field-group">
              <i-col span="24">
                <span class="detail-field-title-sm" style="vertical-align: unset;">费用合计：</span>
                <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ info.totalFee | toPoint }}</span>元
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

          <!-- 提货单日志 -->
          <div>
            <div class="detail-part-title">
              <span>提货单日志</span>
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
        <Exception ref="exception" :pickup-id="this.id" :cnt="exceptionCount" :bill-type="1"/>
      </TabPane>
    </Tabs>
  </div>

  <!-- 编辑状态 -->
  <div v-else class="transport-detail">
    <!-- 运单号及状态 -->
    <section :class="themeBarColor(status)" class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">运单号：{{ info.pickupNo }}</li>
        <li class="detail-header-list-item">订单状态：
          <span :class="themeStatusColor(status)" style="font-weight: bold;">{{ status }}</span>
        </li>
      </ul>
    </section>

    <div class="detail-btn-group"></div>

    <section class="detail-info">
      <!-- 提货单信息 -->
      <div>
        <div class="detail-part-title">
          <span>提货单信息</span>
        </div>

        <div class="sub-title">
          <div class="send-label">派车方式：</div>
          <RadioGroup v-model="sendWay">
            <Radio label="2">自送</Radio>
            <Radio label="1">外转</Radio>
            <!-- <Radio label="3">下发承运商</Radio> -->
          </RadioGroup>
        </div>
        <own-send-info v-if="sendWay === '2'" ref="ownSendInfo" :form="ownInfo" source="detail"></own-send-info>
        <send-carrier-info
          v-else
          ref="SendCarrierInfo"
          :carrier-info="carrierInfo"
          source="detail"
          source-type="pickup"></send-carrier-info>
      </div>

      <!-- 货物明细 -->
      <div>
        <div class="detail-part-title">
          <span>货物明细</span>
        </div>
        <Button class="detail-field-button" type="primary"
                @click="addOrder('pickup')">添加订单</Button>
        <Table :columns="tableColumns" :data="cargoGroupByOrderNo" :loading="loading"></Table>
        <div class="table-footer">
          <span class="table-footer-title">总计</span>
          <span>总货值：{{ orderTotal.cargoCost }}元</span>
          <span>总数量：{{ orderTotal.quantity }}</span>
          <span>总体积：{{ orderTotal.volume }}方</span>
          <span>总重量：{{ WeightOption === 1 ? orderTotal.weight + '吨' : orderTotal.weightKg + '公斤' }}</span>
        </div>
      </div>
      <!-- 应付费用 -->
      <div>
        <div class="detail-part-title">
          <span>应付费用</span>
        </div>
        <pickup-fee
          ref="pickupFee"
          :payment="payment"
          :settlement-type="settlementType"
          :settlement-pay-info="settlementPayInfo"
          :send-way="sendWay"
          :pick-fee-orders="orderList"
          :fee-pass-allocation="info.allocationStrategy"></pickup-fee>
      </div>
    </section>

    <section class="detail-edit-footer">
      <Button class="detail-edit-footer-btn" type="primary"
              @click="save">保存</Button>
      <Button class="detail-edit-footer-btn" type="default" @click="cancelEdit">取消</Button>
    </section>

  </div>
</template>

<script>
/**
 * 提货单详情与编辑
 */

import BasePage from '@/basic/BasePage'
import TransportBase from '../mixin/transportBase'
import DetailMixin from '../mixin/detailMixin'
import SelectInputMixin from '../mixin/selectInputMixin'
import SelectInput from '../components/SelectInput.vue'
import PayInfo from '../components/PayInfo'

import OwnSendInfo from '../components/ownSendInfo.vue'
import SendCarrierInfo from '../components/SendCarrierInfo'
import PickupFee from '../components/PickupFee'

import Server from '@/libs/js/server'
import TMSUrl from '@/libs/constant/url'
import _ from 'lodash'

import Exception from './exception.vue'
import { defaultOwnForm } from '@/components/own-car-form/mixin.js'
import allocationStrategy from '../constant/allocation.js'
import { mapGetters, mapActions } from 'vuex'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import CarPhoto from './components/car-photo.vue'
import { divideFee } from '@/libs/js/config'
export default {
  name: 'detailPickup',
  components: { SelectInput, PayInfo, Exception, PickupFee, OwnSendInfo, SendCarrierInfo, CarPhoto },
  mixins: [ BasePage, TransportBase, SelectInputMixin, DetailMixin, tableWeightColumnMixin ],
  metaInfo: { title: '提货单详情' },
  data () {
    return {
      pageName: 'pickup',
      status: '',
      // 信息
      info: {
        pickupNo: '',
        carrierName: '',
        carNo: '',
        carType: '',
        carLength: '',
        driverName: '',
        driverPhone: '',
        remark: '',
        totalFee: 0,
        collectionMoney: 0, // 代收货款
        assignCarType: 1, // 派车类型 1 外转 2 自送 V1.07新增
        assistantDriverName: '', // 副司机名称  V1.07新增
        assistantDriverPhone: '', // 副司机电话  V1.07新增
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
        remark: ''
      },
      // 自送赋值给子组件
      ownInfo: {
        status: '',
        assignCarType: 1, // 派车类型 1 外转 2 自送 V1.07新增
        ...defaultOwnForm
      },
      payment: {
        freightFee: null,
        loadFee: null,
        unloadFee: null,
        insuranceFee: null,
        otherFee: null
      },
      // 支付方式
      settlementType: '',
      settlementPayInfo: [
        { payType: 2, fuelCardAmount: '', cashAmount: '' }
      ],

      // 所有按钮组
      btnList: [
        {
          status: '待提货',
          btns: [{
            name: '删除',
            code: 120204,
            func: () => {
              this.billDelete()
            }
          }, {
            name: '提货',
            code: 120201,
            func: () => {
              this.loadBillSend()
            }
          }, {
            name: '编辑',
            code: 120206,
            func: () => {
              this.inEditing = 'edit'
            }
          }]
        },
        {
          status: '提货中',
          btns: [{
            name: '到货',
            code: 120203,
            func: () => {
              this.billArrived()
            }
          }, {
            name: '上报异常',
            code: 120210,
            func: () => {
              this.updateExcept({ id: this.id, type: 1 })
            }
          }]
        },
        {
          status: '已提货',
          btns: [{
            name: '上报异常',
            code: 120210,
            func: () => {
              this.updateExcept({ id: this.id, type: 1 })
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
          title: '货物名称',
          key: 'cargoName',
          minWidth: 180,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'cargoName')
          }
        },
        {
          title: '货物编号',
          key: 'cargoNo',
          width: 120,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'cargoNo')
          }
        },
        {
          title: '包装',
          key: 'unit',
          width: 120,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'unit')
          }
        },
        {
          title: '数量',
          key: 'quantity',
          width: 120,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'quantity', 0)
          }
        },
        {
          title: '货值(元)',
          key: 'cargoCost',
          width: 120,
          render: (h, p) => {
            return h('div', {},
              p.row.cargoList.map((cargo) => h('div', divideFee(cargo.cargoCost))))
            // return this.tableDataRender(h, p.row.cargoCost / 100)
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          width: 120,
          render: (h, p) => {
            return this.scopedSlotsRender(h, p, 'volume', 0)
          }
        },
        {
          title: '包装尺寸（毫米）',
          key: 'dimension',
          width: 180,
          render: (h, p) => {
            let text = ''
            if (p.row.dimension.length || p.row.dimension.width || p.row.dimension.height) {
              text = (p.row.dimension.length || '-') + ' x ' + (p.row.dimension.width || '-') + ' x ' + (p.row.dimension.height || '-')
            } else {
              text = '-'
            }
            return this.scopedSlotsRender(h, p, '', text)
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.consignerName)
          }
        },
        {
          title: '提货联系人',
          key: 'consignerContact',
          width: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.consignerContact)
          }
        },
        {
          title: '联系电话',
          key: 'consignerPhone',
          width: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.consignerPhone)
          }
        },
        {
          title: '提货地址',
          key: 'consignerAddress',
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.consignerAddress)
          }
        }
      ],
      sendWay: '1', // 派车类型 1 外转 2 自送  V1.07新增

      imageItems: [] // 需要展示的车况照片list
    }
  },
  computed: {
    ...mapGetters([
      'DispatchSet'
    ]),
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
          cargoNo,
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
          weightKg,
          cargoNo
        })
      })
      return Object.values(_cargoMapById)
    }
  },
  mounted () {
    // 判断显示吨列或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.tableColumns, this.columnWeight, 5)
    } else {
      this.triggerWeightColumn(this.tableColumns, this.columnWeightKg, 5)
    }
  },

  methods: {
    ...mapActions([
      'loadbillPickup',
      'checkDriverPhone'
    ]),
    // 将数据返回的标识映射为文字
    statusFilter (status) {
      switch (status) {
        case 1: return '待提货'
        case 2: return '提货中'
        case 3: return '已提货'
      }
    },
    // 将分摊策略返回的标识映射为文字
    getAllocationValToLabel (data) {
      let list = allocationStrategy.find(item => item.value === (data !== '' ? data : 1))
      return list.label
    },
    fetchData () {
      let vm = this
      this.loading = true
      Server({
        url: '/load/bill/details',
        method: 'post',
        data: { pickUpId: this.id }
      }).then(res => {
        const data = res.data.data

        this.imageItems = data.carInfo.map((item) => {
          return {
            src: this.$handleImgUrl(item),
            msrc: this.$handleImgUrl(item)
          }
        })

        for (let key in vm.info) {
          vm.info[key] = data.loadbill[key]
        }

        // 派车方式
        vm.sendWay = data.loadbill.assignCarType.toString()
        // 将承运商信息赋值给子组件
        if (vm.sendWay === '1') { // 外转
          for (let key in vm.carrierInfo) {
            vm.carrierInfo[key] = data.loadbill[key]
          }
          vm.ownInfo = {
            status: data.loadbill.status,
            assignCarType: data.loadbill.assignCarType, // 派车类型 1 外转 2 自送 V1.07新增
            ...defaultOwnForm
          }
        } else { // 自送
          for (let key in vm.ownInfo) {
            vm.ownInfo[key] = data.loadbill[key]
          }
          vm.carrierInfo = {
            carrierName: '',
            driverName: '',
            driverPhone: '',
            carNo: '',
            carType: '',
            carLength: '',
            remark: ''
          }
        }

        for (let key in vm.payment) {
          vm.payment[key] = vm.setMoneyUnit2Yuan(data.loadbill[key])
        }
        vm.detail = data.cargoList
        vm.logList = data.loadBillLogs
        this.orderList = data.orderList

        vm.status = vm.statusFilter(data.loadbill.status)
        vm.settlementType = data.loadbill.settlementType ? data.loadbill.settlementType.toString() : '1'
        // 格式化计费信息金额单位为元
        let temp = vm.settlementPayInfo.map((item, i) => {
          if (!data.loadbill.settlementPayInfo[i]) return item
          else {
            const temp = data.loadbill.settlementPayInfo[i]
            temp.fuelCardAmount = vm.setMoneyUnit2Yuan(temp.fuelCardAmount)
            temp.cashAmount = vm.setMoneyUnit2Yuan(temp.cashAmount)
            return Object.assign(item, temp)
          }
        })
        vm.settlementPayInfo = temp

        vm.setBtnsWithStatus()
        // 异常个数
        vm.exceptionCount = data.abnormalCnt
        if (vm.exceptionCount) {
          vm.$refs['exception'] && vm.$refs['exception'].initData()
        }
        vm.loading = false
      }).catch()
    },

    // 提货模块数据校验
    checkDetailValidate () {
      const z = this
      let pickFeeComp = z.$refs.pickupFee
      let carrierInfoComp = z.$refs.SendCarrierInfo
      let ownSendInfo = z.$refs.ownSendInfo
      if (z.sendWay === '1' && carrierInfoComp.checkCarrierInfo() && pickFeeComp.validate()) {
        return true
      }
      if (z.sendWay === '2' && ownSendInfo.checkOwnSendInfo() && pickFeeComp.validate()) {
        return true
      }
      return false
    },

    // 编辑后保存
    save () {
      const z = this
      if (!z.checkDetailValidate()) return
      let data = {
        loadbill: {
          pickUpId: z.id,
          assignCarType: z.sendWay,
          allocationStrategy: z.orderList.length > 1 ? z.$refs.pickupFee.getAllocationStrategy() : void 0 // 订单数大于1需要传分摊策略
        },
        cargoList: _.uniq(this.detail.map(item => item.orderId))
      }
      if (z.sendWay === '1') {
        data.loadbill = Object.assign(data.loadbill, z.$refs.pickupFee.formatMoney(), z.$refs.SendCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.pickupFee.getSettlementType(),
          settlementPayInfo: z.$refs.pickupFee.getSettlementPayInfo()
        })
        // 填了司机手机号需要走校验
        if (z.$refs.SendCarrierInfo.getCarrierInfo().driverPhone) {
          z.isPhoneUsed(z.$refs.SendCarrierInfo, data)
        } else {
          z.callPickupInterface(data)
        }
      } else if (z.sendWay === '2') { // 自送
        data.loadbill = Object.assign(data.loadbill, z.$refs.pickupFee.formatMoney(), z.$refs.ownSendInfo.getOwnSendInfo())
        // 填了司机手机号需要走校验
        if (z.$refs.ownSendInfo.getOwnSendInfo().driverPhone || z.$refs.ownSendInfo.getOwnSendInfo().assistantDriverPhone) {
          z.isPhoneUsed(z.$refs.ownSendInfo, data)
        } else {
          z.callPickupInterface(data)
        }
      }
    },

    // 调提货详情编辑接口
    callPickupInterface (data) {
      const z = this
      Server({
        url: '/load/bill/update',
        method: 'post',
        data: data
      }).then(res => {
        // this.fetchData()
        z.$Message.success('保存成功')
        z.cancelEdit()
      }).catch()
    },

    // 按钮操作
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
              url: '/load/bill/delete',
              method: 'delete',
              data: { pickUpIds: [ self.id ] }
            }).then(res => {
              self.$Message.success('删除成功')
              self.ema.fire('closeTab', self.$route)
            }).catch()
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
              url: '/load/bill/confirm/arrival',
              method: 'post',
              data: { pickUpIds: [ self.id ] }
            }).then(res => {
              self.$Message.success('操作成功')
              self.fetchData()
            }).catch()
          }
        }
      })
    },

    // 提货
    loadBillSend () {
      const self = this
      if (self.info.assignCarType === 1 && !self.info.carrierName) {
        this.$Message.warning('承运商未填写，不能提货')
        return
      }
      if (self.info.assignCarType === 2 && !self.info.carNo) {
        this.$Message.warning('自送车辆信息未填写，不能提货')
        return
      }
      if (self.detail.length <= 0) {
        this.$Message.warning('此提货单未加入订单，不能提货')
        return
      }
      Server({
        url: '/load/bill/check/order',
        method: 'post',
        data: { pickUpId: self.id }
      }).then(() => {
        self.openDialog({
          name: 'transport/dialog/confirm',
          data: {
            title: '提货',
            message: '提货后将不能修改提货单，是否提货？'
          },
          methods: {
            confirm () {
              self.loadbillPickup([ self.id ])
                .then(() => {
                  self.$Message.success('操作成功')
                  self.fetchData()
                })
            }
          }
        })
      })
    },

    themeBarColor (code) {
      let barClass
      switch (code) {
        case '待提货':
          barClass = 'i-bar-warning'
          break
        case '提货中':
          barClass = 'i-bar-info'
          break
        case '已提货':
          barClass = 'i-bar-success'
          break
      }
      return barClass
    },
    // 每种状态对应各自主题色
    themeStatusColor (code) {
      let statusClass
      switch (code) {
        case '待提货':
          statusClass = 'i-status-warning'
          break
        case '提货中':
          statusClass = 'i-status-info'
          break
        case '已提货':
          statusClass = 'i-status-success'
          break
      }
      return statusClass
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
          z.callPickupInterface(data)
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
            _this.callPickupInterface(data)
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
      this.$refs['tabs'] && this.$refs['tabs'].handleChange(0)
      this.inEditing = 'no'
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
  .detail-field-group
    li
      display inline-block
      width 20%
      padding 5px 0
      line-height 32px
</style>
