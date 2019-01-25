<template>
  <div>
    <header :class="themeBarColor(receiptStatus)" class="detail-header">
      <ul>
        <li>订单号：{{detail.orderNo}}</li>
        <li>客户订单号：{{detail.customerOrderNo || '-' }}</li>
        <li>客户运单号：{{detail.customerWaybillNo || '-' }}</li>
        <li>运单号：{{detail.waybillNo || '-'}} &nbsp;&nbsp;&nbsp;
          <Poptip v-if="waybillNums.length > 0" placement="bottom" transfer @on-popper-show="showPoptip" @on-popper-hide="hidePoptip">
            <a>{{ show ? '收起全部' : '展开全部' }}</a>
            <div slot="title" style="color:rgba(51,51,51,1);text-align: center;">全部运单号</div>
            <ul slot="content">
              <li v-for="(item, index) in waybillNums" :key="index" style="line-height: 25px;cursor:pointer;" @click="handleWaybillNo(item)">
                <span style="color: #3A7EDE;">{{item}}</span>
              </li>
            </ul>
          </Poptip>
        </li>
        <li>回单状态：<span :class="themeStatusColor(receiptStatus)" style="font-weight: bold;">{{ statusToName(receiptStatus) }}</span></li>
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
    <section>
      <div>
        <div class="title" style="margin-top: 0">
          <span>回单信息</span>
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
          <i-col span="6">
            <span>到货时间：</span>
            <span v-if="detail.arriveTime">{{detail.arriveTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
            <span v-else>-</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="7">
            <span>始发地：</span>
            <span>{{detail.startName | empty}}</span>
          </i-col>
          <i-col span="7">
            <span>目的地：</span>
            <span>{{detail.endName | empty}}</span>
          </i-col>
          <i-col span="6">
            <span>提货方式：</span>
            <span v-if="detail.pickup">{{pickupToName(detail.pickup)}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span>回单数：</span>
            <span>{{detail.receiptCount}}</span>
          </i-col>
        </Row>
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
            <Row>
              <i-col span="3">
                <span style="color: #777;">发货地址：</span>
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
          <i-col span="10">
            <Row>
              <i-col span="3">
                <span style="color: #777;">收货地址：</span>
              </i-col>
              <i-col span="21" style="padding-left: 15px;">
                <p>{{detail.consigneeAddress}}</p>
                <p v-if="detail.consigneeHourseNumber" style="line-height: 1;">{{`${detail.consigneeHourseNumber}`}}</p>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="7">
            <span>回收人：</span>
            <span>{{detail.receiptOrder.recoveryName || '-'}}</span>
          </i-col>
          <i-col span="7">
            <span>接收人：</span>
            <span>{{detail.receiptOrder.returnName || '-'}}</span>
          </i-col>
        </Row>
        <Row style="margin-top: 18px;">
          <i-col span="24">
            <span>备注：</span>
            <span>{{detail.remark || '-'}}</span>
          </i-col>
        </Row>
      </div>
      <div>
        <div class="title" style="margin-top: 35px;">
          <span>承运商信息</span>
        </div>
        <Row v-for="(item, index) in detail.receiptOrder.carrierInfos" :key="index">
          <i-col span="7">
            <span>承运商：</span>
            <span v-if="item.carrierName">{{item.carrierName}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="7">
            <span>司机姓名：</span>
            <span v-if="item.driverName">{{item.driverName}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="6">
            <span>司机手机号：</span>
            <span v-if="item.driverPhone">{{item.driverPhone}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span>车牌号：</span>
            <span v-if="item.carNo">{{item.carNo}}</span>
            <span v-else>-</span>
          </i-col>
        </Row>
      </div>
      <div v-if="receiptUrl.length > 0">
        <div class="title">
          <span>回单照片</span>
        </div>
        <div style="width: 900px;margin-top: 31px;">
          <div
            v-for="(item, index) in receiptUrl"
            :key="index"
            :style="'cursor: pointer;display: inline-block;width: 160px;margin-right: 16px;height: 90px;background-image: url(' + $handleImgUrl(item) + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
            @click="handleView(index)">
          </div>
        </div>
      </div>
      <div class="order-log">
        <div class="title">
          <span>回单日志</span>
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
    <Modal v-model="visible" transfer title="查看图片">
      <img :src="curImg" style="width: 100%">
      <div slot="footer" style="text-align: center;"></div>
    </Modal>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import '@/libs/js/filter'
import openSwipe from '@/components/swipe/index'
import { RECEIPT_STATUS_CODE, RECEIPT_STATUS } from '@/libs/constant/receipt'
import { ORDER_STATUS_CODE } from '@/libs/constant/order'
import pickups from '@/libs/constant/pickup.js'
import { THEME_CLASS } from '@/libs/constant/themeClass.js'

export default {
  name: 'order-management-detail',
  mixins: [ BasePage ],
  metaInfo: { title: '回单详情' },
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
      receiptStatus: '',
      waybillNums: [],
      show: false,
      btnGroup: [],
      operateValue: 5,
      orderLogCount: 0,
      showLog: false,
      orderLog: [],
      imgViewFunc: null,
      receiptUrl: [] // 回单照片
    }
  },

  mounted () {
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
      if (btn.name === '回收' || btn.name === '返厂') {
        this.openReturnDialog(this.detail, btn.name)
      } else if (btn.name === '上传回单照片' || btn.name === '修改回单照片') {
        this.openUploadDialog(this.detail)
      }
    },
    // 回收或返厂 (单条操作)
    openReturnDialog (order, name) {
      const _this = this
      const data = {
        id: [order],
        name: name
      }
      this.openDialog({
        name: 'order/management/dialog/return',
        data: data,
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 打开上传和修改回单弹窗
    openUploadDialog (order) {
      const _this = this
      _this.openDialog({
        name: 'order/management/dialog/upload',
        data: {
          params: order,
          name: this.receiptUrl.length > 0 ? '修改' : '上传'
        },
        methods: {
          ok (node) {
            _this.getDetail()
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
      const z = this
      Server({
        url: '/order/getReceiptOrderDetail',
        method: 'get',
        data: {
          id: z.$route.query.orderId
        }
      }).then((res) => {
        z.detail = res.data.data
        z.receiptStatus = res.data.data.receiptOrder.receiptStatus
        z.receiptUrl = res.data.data.receiptOrder.receiptUrl
        // 过滤回单详情页操作按钮
        z.filterReceiptButton()
        z.orderLog = res.data.data.receiptOrderLogs // 回单日志
        z.orderLogCount = res.data.data.receiptOrderLogs.length // 回单日志数量
        let imageItems = []
        z.receiptUrl.map((item) => {
          imageItems.push({
            src: z.$handleImgUrl(item),
            msrc: z.$handleImgUrl(item)
          })
        })
        z.imgViewFunc = openSwipe(imageItems)
      })
    },
    // 状态改名称
    statusToName (code) {
      let status = RECEIPT_STATUS.find(item => item.value === code)
      if (status) {
        return status.label
      }
      return '-'
    },
    // 提货状态转名称
    pickupToName (code) {
      let pick = pickups.find(item => item.value === code)
      if (pick) {
        return pick.name
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
    // 回单详情按钮过滤   0待回收；1待返厂（已回收）；2已返厂
    filterReceiptButton () {
      const z = this
      if (z.detail.receiptOrder.receiptStatus === RECEIPT_STATUS_CODE.waiting_recovery && z.detail.status === ORDER_STATUS_CODE.arrive) {
        z.btnGroup = [
          { name: '回收', value: 1, code: 120501 }
        ]
        z.operateValue = 1
      } else if (z.detail.receiptOrder.receiptStatus === RECEIPT_STATUS_CODE.waiting_return_factory) {
        z.btnGroup = [
          { name: z.receiptUrl.length > 0 ? '修改回单照片' : '上传回单照片', value: 1, code: z.receiptUrl.length > 0 ? 120505 : 120504 },
          { name: '返厂', value: 2, code: 120502 }
        ]
        z.operateValue = 2
      } else if (z.detail.receiptOrder.receiptStatus === RECEIPT_STATUS_CODE.already_returned_factory) {
        z.btnGroup = [
          { name: z.receiptUrl.length > 0 ? '修改回单照片' : '上传回单照片', value: 1, code: z.receiptUrl.length > 0 ? 120505 : 120504 }
        ]
        z.operateValue = 1
      } else {
        z.btnGroup = []
      }
    },
    // 预览
    handleView (i) {
      this.imgViewFunc(i)
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
    }
  },
  /**
   * 不同订单号
   * 打开同一该页，数据不会根据querystring刷新问题
   */
  beforeRouteUpdate (to, from, next) {
    this.$nextTick(() => {
      this.getDetail()
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
