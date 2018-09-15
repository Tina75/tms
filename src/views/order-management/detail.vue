<template>
  <div>
    <header class="detail-header">
      <ul>
        <li>单号：D2333333333</li>
        <li>客户订单号：D2333333333333</li>
        <li>运单号：D233333333333333 &nbsp;&nbsp;&nbsp;
          <Poptip placement="bottom" @on-popper-show="showPoptip" @on-popper-hide="hidePoptip">
            <a>{{ show ? '收起全部' : '展开全部' }}</a>
            <div slot="title" style="color:rgba(51,51,51,1);text-align: center;">全部运单号</div>
            <ul slot="content">
              <li v-for="(item, index) in waybillNums" :key="index" style="line-height: 25px;">
                <a href="" style="color: #3A7EDE;">{{item}}</a>
              </li>
            </ul>
          </Poptip>
        </li>
        <li>订单状态：<span style="font-weight: bold;">待提货</span></li>
      </ul>
    </header>
    <div style="text-align: right;margin: 28px;">
      <Button v-for="(btn, index) in btnGroup" :key="index" :type="btn.value === operateValue ? 'primary' : 'default'" @click="handleOperateClick(btn)">{{ btn.name }}</Button>
    </div>
    <section>
      <div>
        <div class="title">
          <span>客户信息</span>
        </div>
        <Row>
          <i-col span="7">
            <span>客户名称：</span>
            <span>南京太古可口可乐</span>
          </i-col>
          <i-col span="7">
            <span>要求发货时间：</span>
            <span>2018-08-20 上午08～09</span>
          </i-col>
          <i-col span="10">
            <span>要求发货时间：</span>
            <span>2018-08-20 上午08～09</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="7">
            <span>始发地：</span>
            <span>江苏省南京市</span>
          </i-col>
          <i-col span="7">
            <span>目的地：</span>
            <span>安徽省六安市</span>
          </i-col>
          <i-col span="7">
            <span>提货方式：</span>
            <span>上门提货</span>
          </i-col>
          <i-col span="3">
            <span>回单数：</span>
            <span>2</span>
          </i-col>
        </Row>
        <Row style="margin-top:25px">
          <i-col span="7">
            <span>发货联系人：</span>
            <span>古天乐</span>
          </i-col>
          <i-col span="7">
            <span>联系方式：</span>
            <span>13909877890</span>
          </i-col>
          <i-col span="10">
            <span>发货地址：</span>
            <span>江苏省南京市雨花台区花神大道101号</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="7">
            <span>发货联系人：</span>
            <span>张家辉</span>
          </i-col>
          <i-col span="7">
            <span>联系方式：</span>
            <span>13909877890</span>
          </i-col>
          <i-col span="10">
            <span>发货地址：</span>
            <span>安徽省六安市明珠广场101号</span>
          </i-col>
        </Row>
        <Row style="margin-top: 25px;">
          <i-col span="24">
            <span>备注：</span>
            <span>无</span>
          </i-col>
        </Row>
      </div>
      <div>
        <div class="title">
          <span>货物明细</span>
        </div>
        <Table :columns="tableColumns" :data="tableData"></Table>
        <div class="table-footer">
          <span style="padding-right: 5px;box-sizing:border-box">合计</span>
          <span>订单总数：{{ orderTotal }}</span>
          <span>总体积：{{ volumeTotal }}</span>
          <span>总重量：{{ weightTotal }}</span>
        </div>
      </div>
      <div>
        <div class="title">
          <span>应收费用</span>
        </div>
        <Row>
          <i-col span="4">
            <span>运输费：</span>
            <span>700元</span>
          </i-col>
          <i-col span="4">
            <span>装货费：</span>
            <span>200元</span>
          </i-col>
          <i-col span="4">
            <span>卸货费：</span>
            <span>0元</span>
          </i-col>
          <i-col span="4">
            <span>保险费：</span>
            <span>0元</span>
          </i-col>
          <i-col span="4">
            <span>其他：</span>
            <span>0元</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <span>费用合计：</span>
            <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:rgba(0,164,189,1);margin-right: 10px;">1150</span>元
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <span>结算方式：</span>
            <span>月结</span>
          </i-col>
        </Row>
      </div>
      <div class="order-log">
        <div class="title">
          <span>订单日志</span>
        </div>
        <div style="display: flex;justify-content: flex-start;height: 300px;">
          <div class="fold-icon" @click="showOrderLog">
            <span :class="showLog ? 'hide-log' : 'show-log'">《</span>
          </div>
          <Timeline :class="showLog ? 'show-timeline' : 'hide-timeline'" :style="{ 'height': showLog ? 41*orderLogCount + 'px' : '15px' }" style="margin-top: 7px;overflow: hidden;">
            <TimelineItem v-for="(item, index) in orderLog" :key="index">
              <i slot="dot"></i>
              <span style="margin-right: 60px;color: #777;">{{item.createTime}}</span>
              <span style="color: #333;">{{'【' + item.operatorName + '】' + item.description}}</span>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
export default {
  name: 'detail',

  components: {},
  mixins: [ BasePage ],
  metaInfo: { title: '订单详情' },
  data () {
    return {
      waybillNums: [
        'D201809870987755',
        'D201809870987756',
        'D201809870987757',
        'D201809870987758',
        'D201809870987759'
      ],
      show: false,
      btnGroup: [
        { name: '删除', value: 1 },
        { name: '打印', value: 2 },
        { name: '拆单', value: 3 },
        { name: '编辑', value: 4 }
      ],
      operateValue: 4,
      tableColumns: [
        {
          title: '货物名称',
          key: 'cargoName'
        },
        {
          title: '包装',
          key: 'cargoCost'
        },
        {
          title: '数量',
          key: 'quantity'
        },
        {
          title: '货值（元）',
          key: 'unit'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '备注1',
          key: 'remark'
        },
        {
          title: '备注2',
          key: 'remark'
        }
      ],
      tableData: [],
      currentStep: 0,
      orderLogCount: 0,
      showLog: false,
      orderLog: [
        { createTime: '2018-08 18 13:09:45', operatorName: '古天乐', description: '回单已回收' },
        { createTime: '2018-08 18 13:09:45', operatorName: '古天乐', description: '已送到达目的地' },
        { createTime: '2018-08 18 13:09:45', operatorName: '古天乐', description: '车辆发运' },
        { createTime: '2018-08 18 13:09:45', operatorName: '古天乐', description: '指派司机' },
        { createTime: '2018-08 18 13:09:45', operatorName: '古天乐', description: '送货调度' },
        { createTime: '2018-08 18 13:09:45', operatorName: '古天乐', description: '编辑订单' },
        { createTime: '2018-08 18 13:09:45', operatorName: '古天乐', description: '创建订单成功' }
      ]
    }
  },

  computed: {
    orderTotal () {
      return 10
    },
    volumeTotal () {
      return 10
    },
    weightTotal () {
      return 10
    }
  },

  mounted () {
    this.orderLogCount = this.orderLog.length
  },

  methods: {
    showPoptip (e) {
      this.show = true
    },
    hidePoptip (e) {
      this.show = false
    },
    handleOperateClick (btn) {
      this.operateValue = btn.value
    },
    showOrderLog () {
      this.showLog = !this.showLog
      console.log(this.showLog)
    }
  }
}
</script>
<style lang='stylus' scoped>
  .detail-header
    height 60px
    padding-left 24px
    line-height  60px
    background rgba(233,252,255,1)
    >ul>li
      display inline-block
      margin-right 100px
  .ivu-btn
    margin-left 15px
    width 80px
  .ivu-row
    font-size 13px
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
  .title
    margin-top 60px
    span
      height 34px
      font-size 24px
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
      margin 25px 0
      border-bottom 1px dashed rgba(203,206,211,1)
  .table-footer
    height 48px
    border 1px solid #dcdee2
    border-top none
    line-height 48px
    font-family 'PingFangSC-Regular'
    color rgba(51,51,51,1)
    span
      display inline-block
      min-width 111px
      text-align center
  .order-log
    .ivu-timeline-item
      i
        display inline-block
        width 12px
        height 12px
        background-color #C9CED9
        border-radius 50%
        vertical-align middle
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
      color #fff
      margin-top 2px
  .show-log
    transform rotate(-90deg) translate(-5px, 0)
    transition all 0.3s linear
  .hide-log
    transform rotate(90deg)
    transition all 0.3s linear
  .show-timeline
     transition height 0.3s linear
  .hide-timeline
     height 15px
     transition height 0.3s linear
</style>
<style lang='stylus'>
  .detail-header
    .ivu-poptip-body
      padding 5px 10px
    .ivu-poptip-popper
      top 118px !important
</style>
