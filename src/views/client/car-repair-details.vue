<template>
  <div class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">维修信息</span>
      </div>
      <div class="list-info">
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">车牌号：</span>
            {{infoData.carNo}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">维修类别：</span>
            {{infoData.repairType === 1 ? '维修' : null }}
            {{infoData.repairType === 2 ? '保养' : null }}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">送修日期：</span>
            {{formatDate(infoData.repairDate)}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">送修人：</span>
            {{infoData.repairPerson}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">送修公里数：</span>
            {{infoData.repairMile}}<span>公里</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">维修费用：</span>
            {{infoData.repairMoney}}<span>元</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">已支付费用：</span>
            {{infoData.payMoney}}<span>元</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">未支付费用：</span>
            {{infoData.waitPayMoney}}<span>元</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修单位：</span>
            {{infoData.repairUnit}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修原因：</span>
            {{infoData.repairReason}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修结果：</span>
            {{infoData.repairResult}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">备注：</span>
            {{infoData.remark}}
          </div>
          </Col>
        </Row><br/>
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">维修记录</span>
        </div>
        <div class="list-info">
          <div class="order-log">
            <div style="display: flex;justify-content: flex-start;min-height: 150px;margin-top: 25px;">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import { carrierQueryLog } from './client'
export default {
  name: 'car-details',
  components: {},
  mixins: [ BasePage ],
  props: {
  },
  data () {
    return {
      infoData: {},
      showLog: false,
      orderLogCount: 0,
      orderLog: [],
      id: '',
      carrierId: ''
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.infoData = this.$route.query.rowData
    this.id = this.$route.query.rowData.id
    this.carrierId = this.$route.query.carrierId
    this._carrierQueryLog()
  },
  methods: {
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    // 日志切换显示
    showOrderLog () {
      this.showLog = !this.showLog
    },
    _carrierQueryLog () {
      let data = {
        carrierId: this.carrierId,
        id: this.id,
        logType: 'repair'
      }
      carrierQueryLog(data).then(res => {
        this.orderLog = res.data.data.list
        this.orderLogCount = res.data.data.list.length
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "client.styl"
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
      background url(../../assets/img-icon-expand.png) no-repeat
      background-size contain
</style>
