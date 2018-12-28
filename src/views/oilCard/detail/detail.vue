<template>
  <div>
    <div style="text-align: right;margin: 24px 0;min-height: 1px;">
      <!--<Tooltip v-for="(btn, index) in btnGroup" v-if="hasPower(btn.code)" :key="index" :disabled="!btn.disabled" :content="btn.content" :offset="10" transfer placement="top">-->
      <Button
        v-for="(btn, index) in btnGroup"
        v-if="hasPower(btn.code)"
        :key="index"
        :type="index === btnGroup.length-1 ? 'primary' : 'default'"
        @click="btn.func(rowParams)">{{ btn.name }}</Button>
        <!--</Tooltip>-->
    </div>
    <section>
      <div>
        <div class="title" style="margin-top: 0">
          <span>基本信息</span>
        </div>
        <Row>
          <i-col span="6">
            <span>发卡机构：</span>
            <span>{{issuerToName(detail.issuer)}}</span>
          </i-col>
          <i-col span="6">
            <span>类型：</span>
            <span>{{typeToName(detail.type)}}</span>
          </i-col>
          <i-col span="6">
            <span>卡号：</span>
            <!--主卡 主卡号-->
            <span v-if="detail.type === 1">{{cardFormat(detail.primaryCardNumber)}}</span>
            <!--副卡 副卡号-->
            <span v-else>{{cardFormat(detail.number)}}</span>
          </i-col>
          <i-col span="6">
            <span>主卡号：</span>
            <!--不管是主卡还是副卡，都显示主卡号-->
            <span>{{cardFormat(detail.primaryCardNumber)}}</span>
          </i-col>
        </Row>
        <Row>
          <i-col  span="6">
            <span>余额：</span>
            <span>{{detail.amount | toPoint}}</span>
          </i-col>
          <i-col span="6">
            <span>持卡人：</span>
            <span>{{detail.driverName || '-'}} </span>
          </i-col>
          <i-col span="6">
            <span>绑定车辆：</span>
            <span>{{detail.truckNo  || '-'}}</span>
          </i-col>
          <i-col span="6">
            <span>所属承运商：</span>
            <span>{{detail.carrierName  || '-'}}</span>
          </i-col>
        </Row>
        <Row style="margin-top: 18px;">
          <i-col span="24">
            <span>备注：</span>
            <span>{{detail.remark  || '-'}}</span>
          </i-col>
        </Row>
      </div>
      <div class="order-log">
        <div class="title">
          <span>操作日志</span>
        </div>
        <div class="log-list">
          <div class="fold-icon" @click="showOrderLog">
            <span :class="showLog ? 'hide-log' : 'show-log'"></span>
          </div>
          <Timeline :class="showLog ? 'show-timeline' : 'hide-timeline'" :style="{ 'height': showLog ? 44*orderLogCount + 'px' : '15px' }" style="margin-top: 7px;overflow: hidden;">
            <TimelineItem v-for="(item, index) in orderLog" :key="index">
              <i slot="dot"></i>
              <span style="margin-right: 60px;color: #777;font-size: 14px;">{{item.operateTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
              <span style="color: #333;font-size: 14px;">{{'【' + item.operator + '】' + item.operation}}</span>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { oilTableBtn } from '../constant/oil'
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import operateBtnMixin from '../mixin/operateBtnMixin'
import contantmixin from '../mixin/contantmixin'
import '@/libs/js/filter'
export default {
  name: 'detail',

  components: {
    // OrderPrint
  },
  mixins: [ BasePage, operateBtnMixin, contantmixin ],
  metaInfo: { title: '订单详情' },
  data () {
    return {
      shipperOrderId: this.$route.query.shipperOrderId,
      detail: {},
      orderStatus: '',
      show: false,
      btnGroup: oilTableBtn(this),
      operateValue: 5,
      tableData: [],
      showLog: true,
      orderLog: [],
      orderPrint: [],
      orderLogCount: 0
    }
  },
  computed: {
    rowParams () {
      return {
        row: this.detail
      }
    }
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
    // 日志切换显示
    showOrderLog () {
      this.showLog = !this.showLog
    },
    // 拉取table数据
    getDetail () {
      // 订单详情
      Server({
        url: '/oilCard/detail',
        method: 'get',
        data: {
          id: this.$route.query.shipperOrderId
        }
      }).then((res) => {
        this.detail = res.data.data
        // 过滤订单详情页操作按钮
        // this.filterOrderButton()
        this.orderLog = res.data.data.operateLogList // 订单日志
        this.orderLogCount = res.data.data.operateLogList.length // 订单日志数量
      })
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
