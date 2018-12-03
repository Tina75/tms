<template>
  <div>
    <!-- 车辆信息详情 -->
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
              <span class="label">车牌号：</span>
              {{infoData.carNO}}
            </div>
            </Col>
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
              {{infoData.shippingWeight}}<span>吨</span>
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">净空：</span>
              {{infoData.shippingVolume}}<span>方</span>
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">车辆品牌：</span>
              {{infoData.carBrand}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">主司机：</span>
              {{formatDate(infoData.purchDate)}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">副司机：</span>
              {{formatDate(infoData.purchDate)}}
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
          </Row>
        </div>
        <div class="title" style="margin-top: 40px;">
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
        </div>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">证件照片</span>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col span="5">
            <div v-if="infoData.travelPhoto">
              <div :style="'height: 90px;background-image: url(' + infoData.travelPhoto + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(0)"></div>
              <p class="uploadLabel">行驶证</p>
            </div>
            </Col>
            <Col span="6">
            <div v-if="infoData.drivePhoto">
              <div :style="'height: 90px;background-image: url(' + infoData.drivePhoto + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(1)"></div>
              <p class="uploadLabel">道路运输证</p>
            </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1, DRIVER_TYPE } from '@/libs/constant/carInfo'
import { CODE, carrierDeleteDriver, queryByIdCarrier } from './client'
import RecordList from '@/components/RecordList'
import prepareOpenSwipe from '@/components/swipe/index'
export default {
  name: 'car-details',
  components: { RecordList, prepareOpenSwipe },
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
      carrierId: '',
      searchLogData: {},
      id: '',
      carId: '',
      showTableOne: true
    }
  },
  computed: {
    imageItems () {
      return [
        {
          title: '行驶证',
          src: this.infoData.travelPhoto,
          msrc: this.infoData.travelPhoto
        },
        {
          title: '驾驶证',
          src: this.infoData.drivePhoto,
          msrc: this.infoData.drivePhoto
        }
      ]
    }
  },
  created () {
    this.searchLogData.carrierId = this.$route.query.rowData.carrierId
    this.searchLogData.id = this.$route.query.rowData.id
    this.searchLogData.logType = 'vehicle'
  },
  mounted () {
    // 数据备份，防止在详情页面对数据进行二次编辑
    this.infoDataInit = Object.assign({}, this.$route.query.rowData)
    this.id = this.infoDataInit.id
    this.carrierId = this.infoDataInit.carrierId
    this.carId = this.infoDataInit.carId
    this.infoData = this.$route.query.rowData
    this.initData()
    this.openSwipe = prepareOpenSwipe(this.imageItems)
  },
  methods: {
    // 日期格式化
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    // 初始化数据格式
    initData () {
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
    removeDriverData () {
      let _this = this
      this.openDialog({
        name: 'client/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
            carrierDeleteDriver({
              carId: _this.carId
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
          carrierId: _this.carrierId,
          carId: _this.carId,
          validate: { ..._this.infoDataInit, purchDate: new Date(_this.infoDataInit.purchDate) }
        },
        methods: {
          ok () {
            _this.queryByIdCar()
          }
        }
      })
    },
    // 修改完进行数据更新
    queryByIdCar () {
      let _this = this
      queryByIdCarrier({
        id: _this.id,
        carrierId: _this.carrierId,
        type: 'vehicle'
      }).then(res => {
        if (res.data.code === CODE) {
          _this.infoData = res.data.data
          _this.infoDataInit = Object.assign({}, _this.infoData)
          _this.initData()
        } else {
          _this.$Message.error(res.data.msg)
        }
      })
    },
    handleView (index) {
      this.openSwipe(index)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "client.styl"
>>>.ivu-tabs-nav
  font-size: 16px
.tab-head
  margin -15px
  padding 7px 15px
  border-bottom 15px solid #f5f7f9
  /deep/ .ivu-tabs-bar
    border-bottom none
    margin-bottom 1px
    .ivu-tabs-ink-bar
      bottom 2px
</style>
