<template>
  <div>
    <header :class="themeBarColor(orderStatus)" class="detail-header">
      <ul>
        <li>订单号：{{detail.orderNo}}</li>
        <li>客户订单号：{{detail.customerOrderNo || '-' }}</li>
        <li>运单号：{{detail.waybillNo || '-'}} &nbsp;&nbsp;&nbsp;
        </li>
        <li>订单状态：<span :class="themeStatusColor(orderStatus)" style="font-weight: bold;">{{ statusToName(orderStatus)}}</span></li>
      </ul>
    </header>
    <div style="text-align: right;margin: 24px 0;min-height: 1px;">
      <Tooltip v-for="(btn, index) in btnGroup" v-if="hasPower(btn.code)" :key="index" :disabled="!btn.disabled" :content="btn.content" :offset="10" transfer placement="top">
        <Button
          v-if="hasPower(btn.code)"
          :disabled="btn.disabled"
          :type="btn.value === operateValue ? 'primary' : 'default'"
          @click="handleOperateClick(btn)">{{ btn.name }}</Button>
      </Tooltip>
    </div>
    <section>
      <div>
        <div class="title" style="margin-top: 0">
          <span>客户信息</span>
        </div>
        <Row>
          <i-col span="7">
            <span>客户名称：</span>
            <span>{{detail.shipperCompanyName}}</span>
          </i-col>
          <i-col span="7">
            <span>发货时间：</span>
            <span v-if="detail.deliveryTime">{{detail.deliveryTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="6">
            <span>到货时间：</span>
            <span v-if="detail.arriveTime">{{detail.arriveTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col  span="4">
            <span>代收货款：</span>
            <span>{{detail.collectionMoney | toPoint}}元</span>
          </i-col>
        </Row>
        <Row>
          <!--<i-col span="7">-->
          <!--<span>始发地：</span>-->
          <!--<span>{{detail.startName}}</span>-->
          <!--</i-col>-->
          <!--<i-col span="7">-->
          <!--<span>目的地：</span>-->
          <!--<span>{{detail.endName}}</span>-->
          <!--</i-col>-->
          <!--<i-col span="7">-->
          <!--<span>提货方式：</span>-->
          <!--<span v-if="detail.pickTypeDesc">{{detail.pickTypeDesc}}</span>-->
          <!--<span v-else>-</span>-->
          <!--</i-col>-->
          <i-col span="7">
            <span>回单数：</span>
            <span v-if="detail.receiptCount">{{detail.receiptCount}}</span>
            <span v-else>-</span>
          </i-col>
          <!--<i-col span="6">-->
          <!--<span>对接业务员：</span>-->
          <!--<span>{{detail.handlerUserName}}</span>-->
          <!--</i-col>-->
          <i-col span="4">
            <span>是否开票：</span>
            <span>{{detail.isInvoice === 1 ? `是（${rate(detail.invoiceRate)}%）` : '否'}}</span>
          </i-col>
        </Row>
        <!--<Row>-->
        <!--<i-col span="7">-->
        <!--<span>对接业务员：</span>-->
        <!--<span>{{detail.handlerUserName}}</span>-->
        <!--</i-col>-->
        <!--<i-col span="7">-->
        <!--<span>是否开票：</span>-->
        <!--<span>{{detail.isInvoice === 1 ? `是（${rate(detail.invoiceRate)}%）` : '否'}}</span>-->
        <!--</i-col>-->
        <!--</Row>-->
        <Row style="margin-top:18px">
          <i-col span="7">
            <span>发货联系人：</span>
            <span>{{detail.consignerContact}}</span>
          </i-col>
          <i-col span="7">
            <span>联系方式：</span>
            <span>{{detail.consignerPhone}}</span>
          </i-col>
          <i-col span="10">
            <span>发货地址：</span>
            <span>{{detail.consignerAddress}}</span>
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
          <i-col span="10">
            <span>收货地址：</span>
            <span>{{detail.consigneeAddress}}</span>
          </i-col>
        </Row>
        <Row style="margin-top: 18px;">
          <i-col span="24">
            <span>备注：</span>
            <span>{{detail.remark}}</span>
          </i-col>
        </Row>
      </div>
      <div class="cargo-details">
        <div class="title" style="margin-top: 35px;">
          <span>货物明细</span>
        </div>
        <Table :columns="tableColumns" :data="detail.cargoInfos" style="margin-top: 30px;"></Table>
        <div class="table-footer">
          <span style="padding-right: 5px;box-sizing:border-box;">合计</span>
          <!-- <span>订单总数：{{ orderTotal }}</span> -->
          <span>总货值：{{ cargoCostTotal }}</span>
          <span>总数量：{{ quantityTotal }}</span>
          <span>总重量：{{ weightTotal }}吨</span>
          <span>总体积：{{ volumeTotal }}方</span>
        </div>
      </div>
      <div>
        <div class="title">
          <span>应收费用</span>
        </div>
        <Row style="padding-top: 17px;">
          <i-col span="4">
            <span style="width: 72px;">计费里程：</span>
            <span v-if="detail.mileage" style="font-weight:bold;">{{detail.mileage | mileage}}公里</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span class="fee-style">运输费：</span>
            <span v-if="detail.freightFee" style="font-weight:bold;">{{detail.freightFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
          <!--<i-col span="4">-->
          <!--<span class="fee-style">提货费：</span>-->
          <!--<span v-if="detail.pickFee" style="font-weight:bold;">{{detail.pickFee | toPoint}}元</span>-->
          <!--<span v-else>-</span>-->
          <!--</i-col>-->
          <i-col span="4">
            <span class="fee-style">装货费：</span>
            <span v-if="detail.loadFee" style="font-weight:bold;">{{detail.loadFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span class="fee-style">卸货费：</span>
            <span v-if="detail.unloadFee" style="font-weight:bold;">{{detail.unloadFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
          <!--<i-col span="4">-->
          <!--<span class="fee-style">保险费：</span>-->
          <!--<span v-if="detail.insuranceFee" style="font-weight:bold;">{{detail.insuranceFee | toPoint}}元</span>-->
          <!--<span v-else>-</span>-->
          <!--</i-col>-->
          <i-col span="4">
            <span class="fee-style">其他：</span>
            <span v-if="detail.otherFee" style="font-weight:bold;">{{detail.otherFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <span style="width: 72px;">费用合计：</span>
            <span v-if="detail.totalFee" style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:rgba(0,164,189,1);margin-right: 10px;">{{detail.totalFee | toPoint}} 元</span>
            <span v-else>-</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <span style="width: 72px;">结算方式：</span>
            <span>{{detail.settlementTypeDesc}}</span>
          </i-col>
        </Row>
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
              <span style="margin-right: 60px;color: #777;font-size: 14px;">{{item.time | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
              <span style="color: #333;font-size: 14px;">{{'【' + item.name + '】' + item.desc}}</span>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    </section>
    <!--<OrderPrint ref="printer" :list="orderPrint"></OrderPrint>-->
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import '@/libs/js/filter'
import { getFeeText } from '@/libs/js/config'
import { renderVolume, renderWeight } from '../constant/util'
import float from '@/libs/js/float'
export default {
  name: 'upstreamDetail',

  components: {
    // OrderPrint
  },
  mixins: [ BasePage ],
  metaInfo: { title: '订单详情' },
  data () {
    return {
      shipperOrderId: this.$route.query.shipperOrderId,
      detail: {
        cargoInfos: [] // 初始化货物列表
      },
      curImg: '', // 当前图片src
      visible: false, // 图片预览模态框
      orderStatus: '',
      show: false,
      btnGroup: [],
      operateValue: 5,
      tableColumns: [
        {
          title: '货物名称',
          key: 'name',
          className: 'padding-left-45'
        },
        {
          title: '重量（吨）',
          key: 'weight',
          render: (h, p) => {
            // return h('span', p.row.weight ? p.row.weight : '-')
            return renderWeight(h, p.row['weight'])
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, p) => {
            // return h('span', p.row.volume ? p.row.volume : '-')
            return renderVolume(h, p.row['volume'])
          }
        },
        {
          title: '货值（元）',
          key: 'cost',
          render: (h, params) => {
            // return h('span', params.row.cost ? (params.row.cost / 100).toFixed(2) : '-')
            return h('div', {}, getFeeText(params.row.cost))
          }
        },
        {
          title: '数量',
          key: 'num'
        },
        {
          title: '包装',
          key: 'packageUnit'
        },
        {
          title: '备注1',
          key: 'remark1'
        },
        {
          title: '备注2',
          key: 'remark2'
        }
      ],
      tableData: [],
      currentStep: 0,
      orderLogCount: 0,
      showLog: true,
      orderLog: [],
      orderPrint: [],
      imgViewFunc: null
    }
  },

  computed: {
    // 订单总数
    orderTotal () {
      return this.detail.orderCargoList.length
    },
    // 总货值
    cargoCostTotal () {
      let total = 0
      this.detail.cargoInfos.map((item) => {
        total += Number(item.cost)
      })
      // return (total / 100).toFixed(2)
      return getFeeText(total)
    },
    // 总数量
    quantityTotal () {
      let total = 0
      this.detail.cargoInfos.map((item) => {
        total += Number(item.num)
      })
      return total
    },
    // 总体积
    volumeTotal () {
      let total = 0
      this.detail.cargoInfos.map((item) => {
        total += Number(item.volume)
      })
      return total
    },
    // 总重量
    weightTotal () {
      let total = 0
      this.detail.cargoInfos.map((item) => {
        total += Number(item.weight)
      })
      return total
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.$nextTick(() => {
      this.getDetail()
    })
    next()
  },

  created () {
    this.getDetail()
  },

  methods: {
    showPoptip (e) {
      this.show = true
    },
    hidePoptip (e) {
      this.show = false
    },
    // 各状态按钮操作
    handleOperateClick (btn) {
      // this.operateValue = btn.value
      if (btn.name === '接受') {
        this.accept()
      } else if (btn.name === '拒绝') {
        this.reject()
      }
    },
    // 接受
    accept () {
      let shipperOrderIds = []
      shipperOrderIds.push(this.shipperOrderId)
      Server({
        url: '/busconnector/shipper/accept',
        method: 'post',
        data: { shipperOrderIds }
      }).then(res => {
        this.$Message.success('接受成功')
        this.getDetail()
      })
    },
    // 拒绝
    reject () {
      const self = this
      self.openDialog({
        name: 'upstream/dialog/confirm',
        data: {
          title: '提示',
          message: '确认要拒绝选中的订单吗？拒绝后将无法恢复'
        },
        methods: {
          confirm () {
            let shipperOrderIds = []
            shipperOrderIds.push(self.shipperOrderId)
            Server({
              url: '/busconnector/shipper/reject',
              method: 'post',
              data: { shipperOrderIds }
            }).then(res => {
              self.$Message.success('拒绝完成')
              self.getDetail()
            })
          }
        }
      })
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
    // 日志切换显示
    showOrderLog () {
      this.showLog = !this.showLog
    },
    // 拉取table数据
    getDetail () {
      // 订单详情
      Server({
        url: '/busconnector/shipper/detail',
        method: 'get',
        data: {
          shipperOrderId: this.$route.query.shipperOrderId
        }
      }).then((res) => {
        this.detail = res.data.data
        this.orderStatus = res.data.data.status
        // 过滤订单详情页操作按钮
        this.filterOrderButton()
        this.orderLog = res.data.data.logs // 订单日志
        this.orderLogCount = res.data.data.logs.length // 订单日志数量
      })
    },
    // 状态改名称
    statusToName (code) {
      let name
      switch (code) {
        case 0:
          name = '待接收'
          break
        case 10:
          name = '待提货'
          break
        case 20:
          name = '待送货'
          break
        case 30:
          name = '在途'
          break
        case 40:
          name = '已到货'
          break
        case 50:
          name = '已回单'
          break
        case 99:
          name = '已拒绝'
          break
        case 100:
          name = '已删除'
          break
        default:
      }
      return name
    },
    // 提货状态转名称
    pickupToName (code) {
      let name
      switch (code) {
        case 1:
          name = '小车上门自提'
          break
        case 2:
          name = '大车直送客户'
          break
      }
      return name
    },
    // 结算方式转名称
    settlementToName (code) {
      let name
      switch (code) {
        case 1:
          name = '现付'
          break
        case 2:
          name = '到付'
          break
        case 3:
          name = '回付'
          break
        case 4:
          name = '月结'
          break
      }
      return name
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
       * status  0:待接收状态；10：待提货； 20：待送货调度； 30：在途； 40：已到货； 50：已回单；99已拒绝状态；100被删除到回收站
       * 0待接收状态 拒绝 接受按钮
       */
      let r = this.detail
      let renderBtn = []
      if (r.status === 0) { // 待调度状态
        // 接受按钮
        renderBtn.push(
          { name: '接受', value: 1, code: 110101 }
        )
        // 拒绝按钮
        renderBtn.push(
          { name: '拒绝', value: 2, code: 110102 }
        )
      }
      this.btnGroup = renderBtn
      if (this.btnGroup.length > 0) {
        this.operateValue = this.btnGroup[this.btnGroup.length - 1].value // 默认点亮最后一个按钮
      }
    },
    // 预览
    handleView (i) {
      // this.visible = true
      // this.curImg = this.detail.receiptOrder.receiptUrl[i]
      this.imgViewFunc(i)
    },
    // 每种状态对应各自主题色
    themeBarColor (code) {
      let barClass
      switch (code) {
        case 0:
          barClass = 'i-bar-warning'
          break
        case 10:
          barClass = 'i-bar-warning'
          break
        case 20:
          barClass = 'i-bar-warning'
          break
        case 30:
          barClass = 'i-bar-info'
          break
        case 40:
          barClass = 'i-bar-success'
          break
        case 50:
          barClass = 'i-bar-success'
          break
        case 99:
          barClass = 'i-bar-danger'
          break
        case 100:
          barClass = 'i-bar-danger'
          break
      }
      return barClass
    },
    // 每种状态对应各自主题色
    themeStatusColor (code) {
      let statusClass
      switch (code) {
        case 0:
          statusClass = 'i-status-warning'
          break
        case 10:
          statusClass = 'i-status-warning'
          break
        case 20:
          statusClass = 'i-status-warning'
          break
        case 30:
          statusClass = 'i-status-info'
          break
        case 40:
          statusClass = 'i-status-success'
          break
        case 50:
          statusClass = 'i-status-success'
          break
        case 99:
          statusClass = 'i-status-danger'
          break
        case 100:
          statusClass = 'i-status-danger'
          break
      }
      return statusClass
    },
    rate (value) {
      return float.floor(value * 100, 2)
    }
  }
}
</script>
<style lang='stylus' scoped>
  .detail-header
    height 60px
    padding-left 24px
    line-height  60px
    >ul>li
      font-size 13px
      font-family 'PingFangSC-Regular'
      font-weight 400
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
      display inline-block
      min-width 140px
      text-align center
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
</style>
