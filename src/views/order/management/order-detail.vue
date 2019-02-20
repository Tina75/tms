<template>
  <!-- TODO: 运输过程tab -->
  <div class="order-detail">
    <header :class="themeBarColor(orderStatus)" class="detail-header">
      <ul>
        <li>订单号：{{detail.orderNo}}</li>
        <li>客户订单号：{{detail.customerOrderNo || '-' }}</li>
        <li>客户运单号：{{detail.customerWaybillNo || '-' }}</li>
        <!-- <li>运单号：{{detail.waybillNo || '-'}} &nbsp;&nbsp;&nbsp;
          <Poptip v-if="waybillNums.length > 0" placement="bottom" transfer @on-popper-show="showPoptip" @on-popper-hide="hidePoptip">
            <a>{{ show ? '收起全部' : '展开全部' }}</a>
            <div slot="title" style="color:rgba(51,51,51,1);text-align: center;">全部运单号</div>
            <ul slot="content">
              <li v-for="(item, index) in waybillNums" :key="index" style="line-height: 25px;cursor:pointer;" @click="handleWaybillNo(item)">
                <span style="color: #3A7EDE;">{{item}}</span>
              </li>
            </ul>
          </Poptip>
        </li> -->
        <li>订单状态：<span :class="themeStatusColor(orderStatus)" style="font-weight: bold;">{{ statusToName(orderStatus) }}</span></li>
      </ul>
    </header>
    <div style="text-align: right;margin: 24px 0;min-height: 1px;">
      <Tooltip v-for="(btn, index) in btnGroup" v-if="hasPower(btn.code)" :key="index" :disabled="!btn.disabled" :content="btn.content" :offset="10" transfer placement="top">
        <Button
          v-if="hasPower(btn.code)"
          :disabled="btn.disabled"
          :type="btn.value === operateValue ? 'primary' : 'default'"
          :style="(btn.name === '上传回单照片' || btn.name === '修改回单照片') && 'width: 102px;'"
          @click="handleOperateClick(btn)">{{ btn.name }}</Button>
      </Tooltip>
    </div>
    <Tabs :value="activeTab" :animated="false">
      <TabPane label="订单详情" name="detail">
        <section>
          <div>
            <div class="title" style="margin-top: 0">
              <span>客户信息</span>
            </div>
            <Row>
              <i-col span="7">
                <span>客户名称：</span>
                <span>{{detail.consignerName}}</span>
              </i-col>
              <i-col span="7">
                <span>发货时间：</span>
                <span v-if="detail.deliveryTime">{{detail.deliveryTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
                <span v-else>-</span>
              </i-col>
              <i-col span="10">
                <span>到货时间：</span>
                <span v-if="detail.arriveTime">{{detail.arriveTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
                <span v-else>-</span>
              </i-col>
            </Row>
            <Row>
              <!-- <i-col span="7">
                <span>始发地：</span>
                <span>{{detail.startName | empty}}</span>
              </i-col>
              <i-col span="7">
                <span>目的地：</span>
                <span>{{detail.endName | empty}}</span>
              </i-col> -->
              <i-col span="7">
                <span>提货方式：</span>
                <span v-if="detail.pickup">{{pickupToName(detail.pickup)}}</span>
                <span v-else>-</span>
              </i-col>
              <i-col span="7">
                <span>代收货款：</span>
                <span v-if="detail.collectionMoney !== ''">{{ getDivideFee(detail.collectionMoney) }}元</span>
                <span v-else>-</span>
              </i-col>
              <i-col span="10">
                <span>回单数：</span>
                <span>{{detail.receiptCount}}</span>
              </i-col>
            </Row>
            <Row>
              <i-col span="7">
                <span>对接业务员：</span>
                <span v-if="detail.salesmanName">{{detail.salesmanName}}</span>
                <span v-else>-</span>
              </i-col>
              <i-col span="7">
                <span>是否开票：</span>
                <span>{{detail.isInvoice === 1 ? `是（${rate(detail.invoiceRate)}%，${detail.parentId ? getInvoiceAmount(detail.allocationInvoiceAmount) : getInvoiceAmount(detail.invoiceAmount)}元）` : '否'}}</span>
              </i-col>
              <!-- <i-col v-if="!detail.parentId" span="7">
                <span>开票税额：</span>
                <span>{{ detail.invoiceAmount | toPoint('元') }}</span>
              </i-col>
              <i-col v-else span="7">
                <span>开票税额：</span>
                <span>{{ detail.allocationInvoiceAmount | toPoint('元') }}</span>
              </i-col> -->
            </Row>
            <!-- <Row style="margin-top:18px">
              <i-col span="7">
                <span>发货联系人：</span>
                <span>{{detail.consignerContact}}</span>
              </i-col>
              <i-col span="7">
                <span>联系号码：</span>
                <span>{{detail.consignerPhone}}</span>
              </i-col>
              <i-col span="10" style="color: #333;">
                <Row>
                  <i-col span="3">
                    <span style="color: #777">发货地址：</span>
                  </i-col>
                  <i-col span="21" style="padding-left: 15px;">
                    <p>{{detail.consignerAddress}}</p>
                    <p v-if="detail.consignerHourseNumber" style="line-height: 1;margin-bottom: 15px;">{{`${detail.consignerHourseNumber}`}}</p>
                  </i-col>
                </Row>
              </i-col>
            </Row>
            <Row>
              <i-col span="7">
                <span>收货联系人：</span>
                <span>{{detail.consigneeContact}}</span>
              </i-col>
              <i-col span="7">
                <span>联系方式：</span>
                <span>{{detail.consigneePhone}}</span>
              </i-col>
              <i-col span="10" style="color: #333;">
                <Row>
                  <i-col span="3">
                    <span style="color: #777">收货地址：</span>
                  </i-col>
                  <i-col span="21" style="padding-left: 15px;">
                    <p>{{detail.consigneeAddress}}</p>
                    <p v-if="detail.consigneeHourseNumber" style="line-height: 1;">{{`${detail.consigneeHourseNumber}`}}</p>
                  </i-col>
                </Row>
              </i-col>
            </Row>
            <Row>
              <i-col>
                <span>收货人单位：</span>
                <span v-if="detail.consigneeCompanyName">{{detail.consigneeCompanyName}}</span>
                <span v-else>-</span>
              </i-col>
            </Row> -->
            <Row style="margin-top: 18px;">
              <i-col span="24">
                <span>备注：</span>
                <span v-if="detail.remark">{{detail.remark}}</span>
                <span v-else>-</span>
              </i-col>
            </Row>
          </div>
          <div>
            <div class="title">
              <span>收发货信息</span>
            </div>
            <Form :label-width="97" label-position="left" style="margin-top: 30px;">
              <Row :gutter="16">
                <Col span="12">
                <Card>
                  <p slot="title" class="card-title">发货人</p>
                  <FormItem label="联系人：">
                    {{detail.consignerContact}}
                  </FormItem>
                  <FormItem label="联系号码：">
                    {{detail.consignerPhone}}
                  </FormItem>
                  <FormItem label="发货地址：">
                    {{detail.consignerAddress + detail.consignerHourseNumber}}
                  </FormItem>
                  <FormItem label="收货人单位：" style="visibility: hidden"></FormItem>
                </Card>
                </Col>
                <Col span="12">
                <Card>
                  <p slot="title" class="card-title">收货人</p>
                  <FormItem label="联系人：">
                    {{detail.consigneeContact}}
                  </FormItem>
                  <FormItem label="联系方式：">
                    {{detail.consigneePhone}}
                  </FormItem>
                  <FormItem label="收货地址：">
                    {{detail.consigneeAddress + detail.consigneeHourseNumber}}
                  </FormItem>
                  <FormItem label="收货人单位：">
                    {{detail.consigneeCompanyName | empty}}
                  </FormItem>
                </Card>
                </Col>
              </Row>
            </Form>
          </div>
          <div class="cargo-details">
            <div class="title" style="margin-top: 35px;">
              <span>货物明细</span>
            </div>
            <Table :columns="tableColumns" :data="detail.orderCargoList" style="margin-top: 30px;"></Table>
            <div class="table-footer">
              <span>合计</span>
              <span></span>
              <span>{{ cargoCostTotal }}</span>
              <span>{{ volumeTotal }}</span>
              <span>{{ weightTotal }}</span>
              <span>{{ quantityTotal }}</span>
            </div>
          </div>
          <div>
            <div class="title">
              <span>应收费用</span>
            </div>
            <Row style="padding-top: 17px;">
              <i-col span="4">
                <span style="width: 72px;">计费里程：</span>
                <span style="font-weight:bold;">{{ detail.mileage | mileage('公里')}}</span>
              </i-col>
              <i-col span="4">
                <span class="fee-style">运输费：</span>
                <span style="font-weight:bold;">{{detail.freightFee | toPoint('元')}}</span>
                <span v-if="detail.chargeRule">（{{ detail.chargeRule }}）</span>
              </i-col>
              <i-col span="4">
                <span class="fee-style">提货费：</span>
                <span style="font-weight:bold;">{{detail.pickupFee | toPoint('元')}}</span>
              </i-col>
              <i-col span="4">
                <span class="fee-style">装货费：</span>
                <span style="font-weight:bold;">{{detail.loadFee | toPoint('元')}}</span>
              </i-col>
              <i-col span="4">
                <span class="fee-style">卸货费：</span>
                <span style="font-weight:bold;">{{detail.unloadFee | toPoint('元')}}</span>
              </i-col>
              <i-col span="4">
                <span class="fee-style">保险费：</span>
                <span style="font-weight:bold;">{{detail.insuranceFee | toPoint('元')}}</span>
              </i-col>
              <i-col span="4">
                <span style="width: 72px;">其他费用：</span>
                <span style="font-weight:bold;">{{detail.otherFee | toPoint('元')}}</span>
              </i-col>
            </Row>
            <Row>
              <i-col span="24">
                <span style="width: 72px;">费用合计：</span>
                <span v-if="!detail.parentId" style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:rgba(0,164,189,1);margin-right: 10px;">{{detail.totalFee | toPoint('元')}}</span>
                <span v-else style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:rgba(0,164,189,1);margin-right: 10px;">{{detail.allocationFee | toPoint('元')}}</span>
                <span>（{{settlementToName(detail.settlementType)}}）</span>
                <span :style="'background: ' + (detail.verifyStatus ? '#00C185' : '#FE4F2B')" class="verify-status">{{ detail.verifyStatus ? '已核销' : '待核销' }}</span>
              </i-col>
            </Row>
            <!-- <Row>
              <i-col span="24">
                <span style="width: 72px;">结算方式：</span>
                <span>{{settlementToName(detail.settlementType)}}</span>
              </i-col>
            </Row> -->
          </div>
          <div class="order-log">
            <div class="title">
              <span>订单日志</span>
            </div>
            <div class="log-list">
              <div class="fold-icon" @click="showOrderLog">
                <span :class="showLog ? 'hide-log' : 'show-log'"></span>
              </div>
              <Timeline :class="showLog ? 'show-timeline' : 'hide-timeline'" :style="{ 'height': showLog ? 44*orderLogCount + 'px' : '15px' }" style="margin-top: 7px;overflow: hidden;">
                <TimelineItem v-for="(item, index) in orderLog" :key="index">
                  <i slot="dot"></i>
                  <span style="margin-right: 60px;color: #777;font-size: 14px;">{{item.createTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
                  <span style="color: #333;font-size: 14px;">{{'【' + item.operatorName + '】' + item.description}}</span>
                </TimelineItem>
              </Timeline>
            </div>
          </div>
        </section>
      </TabPane>
      <TabPane :label="cngLabel" :disabled="changeOrderCnt == 0" name="change">
        <OrderChange ref="orderChange"/>
      </TabPane>
      <TabPane label="运输过程" name="process">
      </TabPane>
    </Tabs>
    <OrderPrint ref="printer" :list="orderPrint"></OrderPrint>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import '@/libs/js/filter'
import OrderPrint from './components/OrderPrint'
import _ from 'lodash'
// import float from '@/libs/js/float'
import { mapGetters } from 'vuex'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import OrderChange from './components/OrderChange'
import { roundFee, divideFee, roundVolume, roundWeight, roundWeightKg, multiplyRate, getFeeText } from '@/libs/js/config'
import * as CargoInfo from '@/libs/constant/cargoInfoTable'
import NP from 'number-precision'
import { ORDER_STATUS_CODE, ORDER_STATUS } from '@/libs/constant/order'
import { THEME_CLASS } from '@/libs/constant/themeClass.js'
import pickups from '@/libs/constant/pickup.js'
import settlements from '@/libs/constant/settlement.js'
export default {
  name: 'order-management-detail',

  components: {
    OrderPrint,
    OrderChange
  },
  mixins: [ BasePage, tableWeightColumnMixin ],
  metaInfo: { title: '订单详情' },
  data () {
    return {
      detail: {
        orderCargoList: [], // 初始化货物列表
        receiptOrder: {
          carrierInfos: [] // 初始化承运商列表
        }
      },
      curImg: '', // 当前图片src
      visible: false, // 图片预览模态框
      from: this.$route.query.from,
      source: this.$route.query.source, // 页面来源
      orderStatus: '',
      waybillNums: [],
      show: false,
      btnGroup: [],
      operateValue: 5,
      tableColumns: [
        CargoInfo.cargoName,
        CargoInfo.cargoNo,
        CargoInfo.cargoCost,
        CargoInfo.volume,
        CargoInfo.quantity,
        CargoInfo.unit,
        CargoInfo.dimension,
        CargoInfo.remark1,
        CargoInfo.remark2
      ],
      orderLogCount: 0,
      showLog: false,
      orderLog: [],
      orderPrint: [],
      columnWeight: CargoInfo.weight,
      columnWeightKg: CargoInfo.weightKg,
      activeTab: 'detail',
      changeOrderCnt: 0,
      cngLabel: (h) => {
        return h('div', [
          h('span', {
            domProps: {
              innerHTML: `改单记录  ${this.changeOrderCnt}`
            }
          })
        ])
      }
    }
  },

  computed: {
    ...mapGetters([
      'WeightOption' // 重量配置 1 吨  2 公斤
    ]),
    // 订单总数
    orderTotal () {
      return this.detail.orderCargoList.length
    },
    // 总货值
    cargoCostTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        // total += Number(item.cargoCost)
        total = NP.plus(total, Number(item.cargoCost))
      })
      total = this.getDivideFee(total)
      return roundFee(total) + '元'
    },
    // 总数量
    quantityTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        // total += Number(item.quantity)
        total = NP.plus(total, Number(item.quantity))
      })
      return total
    },
    // 总体积
    volumeTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        // total += Number(item.volume)
        total = NP.plus(total, Number(item.volume))
      })
      return roundVolume(total) + '方'
    },
    // 总重量
    weightTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        // 区分吨或公斤
        if (this.WeightOption === 1) {
          // total += Number(item.weight)
          total = NP.plus(total, Number(item.weight))
        } else {
          // total += Number(item.weightKg)
          total = NP.plus(total, Number(item.weightKg))
        }
      })
      if (this.WeightOption === 1) {
        return roundWeight(total) + '吨'
      } else {
        return roundWeightKg(total) + '公斤'
      }
    },
    // 总费用
    FeeTotal () {
      let total = 0
      total = NP.plus(
        this.detail.freightFee,
        this.detail.loadFee,
        this.detail.unloadFee,
        this.detail.insuranceFee,
        this.detail.otherFee
      )
      // total += this.detail.freightFee
      // total += this.detail.loadFee
      // total += this.detail.unloadFee
      // total += this.detail.insuranceFee
      // total += this.detail.otherFee
      return total
    }
  },

  mounted () {
    this.getDetail()
    this.getDetailChange()
    // 动态添加吨或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.tableColumns, this.columnWeight, 4)
    } else {
      this.triggerWeightColumn(this.tableColumns, this.columnWeightKg, 4)
    }
  },

  methods: {
    getDivideFee (val) {
      return divideFee(val)
    },
    getDetailChange () {
      Server({
        url: '/order/getOrderChangeRecordNum',
        method: 'post',
        data: {
          id: this.$route.query.orderId
        }
      }).then((res) => {
        this.changeOrderCnt = res.data.data.num
      })
    },
    showPoptip (e) {
      this.show = true
    },
    hidePoptip (e) {
      this.show = false
    },
    // 各状态按钮操作
    handleOperateClick (btn) {
      // this.operateValue = btn.value
      if (btn.name === '拆单') {
        this.openSeparateDialog(this.detail)
      } else if (btn.name === '外转') {
        this.openOuterDialog(this.detail)
      } else if (btn.name === '还原' || btn.name === '删除') {
        this.openResOrDelDialog(this.detail, btn.name)
      } else if (btn.name === '编辑') { // 编辑
        this.openTab({
          title: '编辑' + this.detail.orderNo,
          path: '/order/update',
          query: {
            id: this.detail.id
          }
        })
      } else if (btn.name === '打印') {
        this.print(this.detail)
      } else if (btn.name === '恢复') {
        this.openRecoveryDialog(this.detail)
      } else if (btn.name === '彻底删除') {
        this.completelyDeleteDialog(this.detail)
      } else if (btn.name === '分享') {
        this.openShareDialog(this.detail)
      } else if (btn.name === '修改订单') {
        this.openModifyDialog(this.detail)
      }
    },
    // 外转
    openOuterDialog (order) {
      const _this = this
      this.openDialog({
        name: 'order/management/dialog/outer',
        data: { detail: order },
        methods: {
          ok (node) {
            _this.getDetail()
            _this.ema.fire('closeTab', _this.$route) // 关闭tab页
          }
        }
      })
    },
    // 拆单
    openSeparateDialog (order) {
      const _this = this
      this.openDialog({
        name: 'order/management/dialog/separate',
        data: { id: order.id, orderNo: order.orderNo },
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 还原或删除 (单条操作)
    openResOrDelDialog (order, name) {
      const _this = this
      const data = {
        id: [order],
        name: name
      }
      this.openDialog({
        name: 'order/management/dialog/restoreOrDelete',
        data: data,
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 打印
    print (order) {
      Server({
        url: 'order/getOrderAndDetailList',
        method: 'post',
        data: {
          orderIds: [order.id]
        }
      }).then((res) => {
        this.orderPrint = _.cloneDeep(res.data.data)
        this.$refs.printer.print()
      })
    },
    // 恢复
    openRecoveryDialog (order) {
      const _this = this
      _this.openDialog({
        name: 'order/management/dialog/recovery',
        data: { id: [order] },
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 彻底删除
    completelyDeleteDialog (order) {
      const _this = this
      _this.openDialog({
        name: 'order/management/dialog/completelyDelete',
        data: { id: [order] },
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 分享
    openShareDialog (order) {
      const _this = this
      _this.openDialog({
        name: 'order/management/dialog/share',
        data: {
          id: [order],
          suffix: ''
        },
        methods: {
          ok (node) {}
        }
      })
    },
    // 修改订单
    openModifyDialog (order) {
      const _this = this
      _this.openDialog({
        name: 'order/management/dialog/edit',
        data: {
          id: order.id
        },
        methods: {
          ok () {
            _this.getDetail()
            _this.getDetailChange()
            _this.$refs['orderChange'].initData()
          }
        }
      })
    },
    // 日志切换显示
    showOrderLog () {
      this.showLog = !this.showLog
    },
    // 拉取table数据
    getDetail () {
      Server({
        url: 'order/detail',
        method: 'get',
        data: {
          id: this.$route.query.orderId
        }
      }).then((res) => {
        this.detail = res.data.data
        this.orderStatus = res.data.data.status
        // 过滤订单详情页操作按钮
        this.filterOrderButton()
        this.orderLog = res.data.data.orderLogs // 订单日志
        this.orderLogCount = res.data.data.orderLogs.length // 订单日志数量
        this.waybillNums = res.data.data.waybillNoList // 运单子单
      })
    },
    // 状态改名称
    statusToName (code) {
      let status = ORDER_STATUS.find(item => item.value === code)
      if (status) {
        return status.label
      }
      return '-'
    },
    // 提货状态转名称
    pickupToName (data) {
      let pick = pickups.find(item => item.value === data)
      if (pick) {
        return pick.name
      }
      return '-'
    },
    // 结算方式转名称
    settlementToName (data) {
      let type = settlements.find(item => item.value === data)
      if (type) {
        return type.name
      }
      return '-'
    },
    // 点击展开的运单子单
    handleWaybillNo (no) {
      this.openTab({
        title: no,
        path: '/transport/detail/detailFreight',
        query: {
          no: no
        }
      })
    },
    // 订单详情按钮过滤
    filterOrderButton () {
      /**
       * status  10：待提货 20：待调度 30：在途 40：已到货 50：已回单
       * parentId    父单：('' && 被拆单: disassembleStatus=1)， 子单：不为''
       * disassembleStatus   是否被拆单：1是;0否（只对父单有效，子单被拆单也为0）
       * transStatus   是否被外转：1是，0否
       * dispatchStatus 是否被调度：1是，0否
       * pickupStatus  是否被提货：1是；0否
       * pickup   提货方式 1上门提货、2直接送货 （开单时选择上门提货  初始状态为待提货（10），开单时选择直接送货，初始状态为待调度（20））
       *
       *
       * 展示按钮：拆单、外转、还原、删除、编辑（详情页独有）
       * 1、待提货状态下：（status: 10）
       *    拆单： 无拆单按钮            //【（未外转：transStatus=0） && （不是父单{原单或者子单}：disassembleStatus !== 1）】显示
       *    外转：（v1.06删除外转）【（未外转：transStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''） && （未被提货：pickupStatus=0）】显示
       *    还原： 无还原按钮            //【（是父单：parentId=''） && （被拆单：disassembleStatus=1） && （未被提货：pickupStatus=0）】显示
       *    删除： 无删除按钮            //
       *          订单列表里显示：【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （被拆单后的父单：disassembleStatus=1）】
       *          订单详情里显示：【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （不是子单：parentId=''）】
       *    编辑：【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）】（只在详情显示）
       * 2、待调度状态下：（status: 20）
       *    拆单：【（未外转：transStatus=0） && （不是父单{原单或者子单}：disassembleStatus !== 1）&& （未被调度：dispatchStatus=0）】显示
       *    外转：（v1.06删除外转）【（未外转：transStatus=0） && （不是上门提货：pickup !== 1） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）/ 备注：v1.05版本 子单可以外转 / && （未被调度：dispatchStatus=0）】显示
       *    还原：【（是父单：parentId=''） && （被拆单：disassembleStatus=1） && （未被调度：dispatchStatus=0）】显示
       *    删除：
       *          订单列表里显示：【（不是上门提货：pickup !== 1） && （未外转：transStatus=0） && （未被调度：dispatchStatus=0） && （被拆单后的父单：disassembleStatus=1）】
       *          订单详情里显示：【（不是上门提货：pickup !== 1） && （未外转：transStatus=0） && （未被调度：dispatchStatus=0） && （不是子单：parentId=''）】
       *    编辑：【（不是上门提货：pickup !== 1） && （未外转：transStatus=0） && （未被调度：dispatchStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）】（只在详情显示）
       */
      let r = this.detail
      let renderBtn = []
      if (r.status === ORDER_STATUS_CODE.receipt && !r.disassembleStatus) { // 已回单未拆单展示删除按钮
        renderBtn.push(
          { name: '删除', value: 1, code: 100302 }
        )
      }
      // 子单不展示分享按钮
      if (!r.parentId) {
        renderBtn.push({ name: '分享', value: 9, code: 100307 })
      }
      if (r.status === ORDER_STATUS_CODE.pickup) { // 待提货状态
        // 删除按钮
        if (r.transStatus === 0 && r.pickupStatus === 0 && r.parentId === '') {
          renderBtn.push(
            { name: '删除', value: 1, code: 100302 }
          )
        }
        // 打印
        this.checkPrintCode(renderBtn)
        // 拆单按钮
        // if (r.transStatus === 0 && r.disassembleStatus !== 1) {
        //   renderBtn.push(
        //     { name: '拆单', value: 2, code: 110103 }
        //   )
        // }
        // 外转按钮
        // if (r.transStatus === 0 && r.disassembleStatus === 0 && r.parentId === '' && r.pickupStatus === 0) {
        //   renderBtn.push(
        //     { name: '外转', value: 3, code: 120209 }
        //   )
        // }
        // 还原按钮
        // if (r.parentId === '' && r.disassembleStatus === 1 && r.pickupStatus === 0) {
        //   renderBtn.push(
        //     { name: '还原', value: 4, code: 110105 }
        //   )
        // }
        // 编辑按钮
        if (r.transStatus === 0 && r.pickupStatus === 0 && r.disassembleStatus === 0 && r.parentId === '') {
          renderBtn.push(
            { name: '编辑', value: 5, code: 100301 }
          )
        } else {
          // 子单没有修改订单
          if (!r.parentId) {
            renderBtn.push(
              { name: '修改订单', value: 7, code: 100308 }
            )
          }
        }
      }
      if (r.status === ORDER_STATUS_CODE.dispatch) { // 待调度状态
        // 打印
        this.checkPrintCode(renderBtn)
        // 删除按钮
        if (r.transStatus === 0 && r.dispatchStatus === 0 && r.parentId === '') {
          renderBtn.push(
            { name: '删除', value: 1, code: 100302 }
          )
        }
        // 拆单按钮
        if (r.transStatus === 0 && r.disassembleStatus !== 1 && r.dispatchStatus === 0) {
          if (r.collectionMoney > 0) {
            renderBtn.push(
              { name: '拆单', value: 3, code: 120110, disabled: true, content: '有代收货款的订单不允许拆单' }
            )
          } else {
            if (!r.volume && !r.weight && !r.quantity) {
              renderBtn.push(
                { name: '拆单', value: 3, code: 120110, disabled: true, content: '包装数量或体积或重量未填，无法拆单' }
              )
            } else {
              renderBtn.push(
                { name: '拆单', value: 3, code: 120110 }
              )
            }
          }
        }
        // 外转按钮
        // if (r.transStatus === 0 && r.disassembleStatus === 0 && r.dispatchStatus === 0) {
        //   renderBtn.push(
        //     { name: '外转', value: 4, code: 120111 }
        //   )
        // }
        // 还原按钮
        if (r.parentId === '' && r.disassembleStatus === 1 && r.dispatchStatus === 0) {
          renderBtn.push(
            { name: '还原', value: 5, code: 120112 }
          )
        }
        // 编辑按钮
        if (r.transStatus === 0 && r.dispatchStatus === 0 && r.disassembleStatus === 0 && r.parentId === '') {
          renderBtn.push(
            { name: '编辑', value: 6, code: 100301 }
          )
        } else {
          // 子单没有修改订单
          if (!r.parentId) {
            renderBtn.push(
              { name: '修改订单', value: 7, code: 100308 }
            )
          }
        }
      }
      if (r.status === ORDER_STATUS_CODE.recycle) { // 回收站状态
        if (!(r.historyStatus === 50 || (r.historyStatus === 20 && r.pickupStatus === 1))) {
          renderBtn.push(
            { name: '恢复', value: 1, code: 100305 }
          )
        }
        renderBtn.push(
          { name: '彻底删除', value: 2, code: 100306 }
        )
      }
      if (r.status !== ORDER_STATUS_CODE.pickup && r.status !== ORDER_STATUS_CODE.dispatch && r.status !== ORDER_STATUS_CODE.recycle) {
        renderBtn.push(
          { name: '修改订单', value: 7, code: 100308 }
        )
      }
      this.btnGroup = renderBtn
      if (this.btnGroup.length > 0 && r.status !== ORDER_STATUS_CODE.recycle) {
        this.operateValue = this.btnGroup[this.btnGroup.length - 1].value // 默认点亮最后一个按钮
      }
    },
    checkPrintCode (btns) {
      if (this.source) {
        if (this.source === 'order') {
          btns.push(
            { name: '打印', value: 2, code: 100303 }
          )
        } else if (this.source === 'waybill') {
          btns.push(
            { name: '打印', value: 2, code: 120103 }
          )
        } else if (this.source === 'pickup') {
          btns.push(
            { name: '打印', value: 2, code: 120202 }
          )
        }
      }
    },
    // 每种状态对应各自主题色
    themeBarColor (code) {
      let theme = THEME_CLASS.find(item => item.code === code)
      if (theme) {
        return theme.barClass
      }
      return ''
    },
    // 每种状态对应各自主题色
    themeStatusColor (code) {
      let theme = THEME_CLASS.find(item => item.code === code)
      if (theme) {
        return theme.statusClass
      }
      return ''
    },
    rate (value) {
      return multiplyRate(value)
    },
    getInvoiceAmount (amount) {
      return getFeeText(amount)
    }
  },
  /**
   * 不同订单号
   * 打开同一该页，数据不会根据querystring刷新问题
   */
  beforeRouteUpdate (to, from, next) {
    this.$nextTick(() => {
      this.getDetail()
      this.getDetailChange()
      this.$refs['orderChange'].initData()
    })
    next()
  }
}
</script>
<style lang='stylus' scoped>
  .detail-header
    min-height 60px
    padding-left 24px
    line-height  60px
    >ul>li
      font-size 16px
      font-family 'PingFangSC-Regular'
      font-weight bold
      color #333
      display inline-block
      margin-right 100px
  .ivu-btn
    margin-left 15px
    width 80px
    height 32px
  .ivu-btn-default
    background #F9F9F9
  .ivu-row
    font-size 14px
    font-family 'PingFangSC-Regular'
    line-height 3
    .ivu-col
      span
        &:first-child
          color #777
          display inline-block
          width 100px
        &:last-child
          color #333
  .fee-style
    width 60px !important
  .title
    margin-top 52px
    span
      height 34px
      font-size 20px
      font-family 'PingFangSC-Semibold'
      font-weight 600
      color rgba(51,51,51,1)
      line-height 34px
      margin-left 18px
      vertical-align text-bottom
    &:before
      content ' '
      display inline-block
      width 5px
      height 25px
      background rgba(0,164,189,1)
      border-radius 3px
    &:after
      content ' '
      display block
      margin 15px 0
      border-bottom 1px dashed rgba(203,206,211,1)
  .table-footer
    height 48px
    border 1px solid #dcdee2
    border-top none
    line-height 48px
    font-family 'PingFangSC-Medium'
    font-weight bold
    color #2c3e50
    span
      padding-left 10px
      width 10%
      display inline-block
  .order-log
    .ivu-timeline-item
      i
        display inline-block
        width 12px
        height 12px
        background-color #C9CED9
        border-radius 50%
        vertical-align text-bottom
      &:first-child
        i
          background-color #00A4BD
  .fold-icon
    width 26px
    height 26px
    background rgba(0,164,189,1)
    border-radius 5px
    margin 0 60px 0 30px
    text-align center
    cursor pointer
    span
      display block
      width 16px
      height 16px
      margin 5px
      background url(../../../assets/img-icon-expand.png) no-repeat
      background-size contain
  .show-log
    transition all 0.3s linear
  .hide-log
    transform rotate(180deg)
    transition all 0.3s linear
  .show-timeline
     transition height 0.3s linear
  .hide-timeline
     height 15px
     transition height 0.3s linear
  .receipt-image
    width 160px
    height 90px
    margin-right 16px
  .card-title
    padding-left 16px
    font-size 14px
    color #333
    line-height 44px
    height 44px
    font-weight 500
    background #f8f8f9
    font-family 'PingFangSC-Medium'
    border-bottom 1px solid #e8eaec
</style>
<style lang='stylus'>
  .detail-header
    .ivu-poptip-body
      padding 5px 10px
    .ivu-poptip-popper
      top 118px !important
  .cargo-details .padding-left-45
    padding-left 45px !important
  .log-list
    display: flex;
    display -ms-flexbox;
    justify-content: flex-start;
    -ms-flex-pack: start;
    min-height: 150px;
    margin-top: 25px;
  .order-detail
    .ivu-tabs-nav .ivu-tabs-tab
      font-size 22px
      font-weight 600
    .ivu-tabs-bar
      margin-bottom 26px
  .verify-status
    border-radius 2px
    color #fff !important
    text-align center
    margin-right 5px
    font-size 12px
    padding 0 5px
</style>
<style lang="stylus">
.ivu-card
  font-size 14px
  .ivu-form-item
    margin-bottom 8px
  .ivu-card-head
    padding 0
    border-bottom none
  .ivu-form-item-label
    color #777
    font-size 14px
  .ivu-form-item-content
    color #333
    font-size 14px
.ivu-tooltip-inner-with-width
  word-break break-all
</style>
