<template>
  <div class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">基础信息</span>
        <div class="btnItem">
          <Button class="btnSty" @click="removeDriverData">删除</Button>
          <Button type="primary" class="btnSty" @click="updateDriverData">修改</Button>
        </div>
      </div>
      <div class="list-info">
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">姓名：</span>
            {{infoData.driverName}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">车牌号：</span>
            {{infoData.carNO}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">合作方式：</span>
            {{infoData.driverType}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">手机号：</span>
            {{infoData.driverPhone}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">车型：</span>
            {{infoData.carType}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">车长：</span>
            {{infoData.carLength}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">载重：</span>
            {{infoData.shippingWeight}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">净空：</span>
            {{infoData.shippingVolume}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">购买日期：</span>
            {{formatDate(infoData.purchDate)}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">品牌：</span>
            {{infoData.carBrand}}
          </div>
          </Col>
        </Row>
      </div><br/>
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">常跑线路</span>
      </div>
      <div class="list-info">
        <div v-if="this.line1" class="lineSpanLabel">
          {{line1}}
        </div>
        <div v-if="this.line2" class="lineSpanLabel">
          {{line2}}
        </div>
      </div><br/>
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">证件照片</span>
      </div>
      <div class="list-info">
        <Row class="row">
          <Col span="5">
          <div v-if="infoData.travelPhoto">
            <img :src="infoData.travelPhoto" class="imageDiv"/>
            <p class="uploadLabel">行驶证</p>
          </div>
          </Col>
          <Col span="6">
          <div v-if="infoData.drivePhoto">
            <img :src="infoData.drivePhoto" class="imageDiv"/>
            <p class="uploadLabel">驾驶证</p>
          </div>
          </Col>
        </Row>
      </div>
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">维修记录</span>
      </div>
      <div class="list-info">
        <div class="order-log">
          <div style="display: flex;justify-content: flex-start;min-height: 150px;margin-top: 25px;">
            <div class="fold-icon" @click="showOperationLog">
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
</template>
<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1, DRIVER_TYPE } from '@/libs/constant/carInfo'
import { CODE, carrierQueryLog, carrierDeleteDriver } from './client'
export default {
  name: 'car-details',
  components: {},
  mixins: [ BasePage ],
  props: {
  },
  data () {
    return {
      infoData: {},
      infoDataInit: {},
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      line1: '',
      line2: '',
      showLog: false,
      orderLogCount: 0,
      orderLog: []
    }
  },
  mounted () {
    this.infoDataInit = Object.assign({}, this.$route.query.rowData)
    this.infoData = this.$route.query.rowData
    this._carrierQueryLog()
    this.infoData.driverType = (DRIVER_TYPE.find(e => e.id === this.infoData.driverType.toString())).name
    this.infoData.carType = this.carTypeMap[this.infoData.carType]
    this.infoData.carLength = this.carLengthMap[this.infoData.carLength]
    let s1 = ''
    let n1 = ''
    let s2 = ''
    let n2 = ''
    if (this.infoData.regularLine && JSON.parse(this.infoData.regularLine).length === 1) {
      s1 = JSON.parse(this.infoData.regularLine)[0].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].sn
      n1 = JSON.parse(this.infoData.regularLine)[0].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].en
    } else if (JSON.parse(this.infoData.regularLine).length === 2) {
      s1 = JSON.parse(this.infoData.regularLine)[0].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].sn
      n1 = JSON.parse(this.infoData.regularLine)[0].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].en
      s2 = JSON.parse(this.infoData.regularLine)[1].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[1].sn
      n2 = JSON.parse(this.infoData.regularLine)[1].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[1].en
    }
    this.line1 = s1 + '—' + n1 === '—' ? '' : s1 + '—' + n1
    this.line2 = s2 + '—' + n2 === '—' ? '' : s2 + '—' + n2
  },
  methods: {
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    // 日志切换显示
    showOperationLog () {
      this.showLog = !this.showLog
    },
    _carrierQueryLog () {
      let data = {
        carrierId: this.infoDataInit.carrierId,
        id: this.infoDataInit.id,
        logType: 'vehicle'
      }
      debugger
      carrierQueryLog(data).then(res => {
        this.orderLog = res.data.data.list
        this.orderLogCount = res.data.data.list.length
      })
    },
    removeDriverData () {
      let _this = this
      this.openDialog({
        name: 'client/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
            carrierDeleteDriver({
              carId: _this.infoData.carId
            }).then(res => {
              if (res.data.code === CODE) {
                _this.$Message.success(res.data.msg)
                this.ema.fire('closeTab', this.$route)
              } else {
                _this.$Message.error(res.data.msg)
              }
            })
          }
        }
      })
    },
    updateDriverData () {
      let _this = this
      this.openDialog({
        name: 'client/dialog/carrier-driver',
        data: {
          title: '修改车辆',
          flag: 2,
          carrierId: _this.infoDataInit.carrierId,
          validate: { ..._this.infoDataInit, purchDate: new Date(_this.infoDataInit.purchDate) }
        },
        methods: {
          ok () {
          }
        }
      })
      this.ema.fire('closeTab', this.$route)
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
