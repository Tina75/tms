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
              {{infoData.driverId}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">副司机：</span>
              {{infoData.assistDriver}}
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
            <Col v-for="img in imageItems" :key="img.count" span="6">
            <div :v-if="img.src">
              <div :style="'height: 90px;background-image: url(' + img.src + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(img.count)"></div>
              <p class="uploadLabel">{{img.title}}</p>
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
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import RecordList from '@/components/RecordList'
import prepareOpenSwipe from '@/components/swipe/index'
import Server from '@/libs/js/server'
export default {
  name: 'car-details',
  components: { RecordList, prepareOpenSwipe },
  mixins: [ BasePage ],
  metaInfo: {
    title: '车辆详情'
  },
  data () {
    return {
      infoData: {},
      infoDataInit: {},
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      line1: '',
      line2: '',
      searchLogData: {},
      showTableOne: true,
      imageItems: []
    }
  },
  mounted () {
    // 数据备份，防止在详情页面对数据进行二次编辑
    this.infoDataInit = Object.assign({}, this.$route.query.rowData)
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
      let count = 0
      for (const key in this.infoData) {
        if (key === 'travelPhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '行驶证', src: this.infoData.travelPhoto, count: count })
          count++
        }
        if (key === 'roadTransPhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '道路运输证', src: this.infoData.roadTransPhoto, count: count })
          count++
        }
      }
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
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
            Server({
              url: '/ownerCar/deleteCar',
              method: 'get',
              data: { id: vm.infoData.id }
            }).then(({ data }) => {
              if (data.code === 10000) {
                vm.$Message.success('删除成功！')
                vm.ema.fire('closeTab', vm.$route)
              }
            })
          }
        }
      })
    },
    updateDriverData () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-car',
        data: {
          title: '修改车辆',
          flag: 2,
          validate: { ...vm.infoDataInit, purchDate: new Date(vm.infoDataInit.purchDate) }
        },
        methods: {
          ok () {
            Server({
              url: '/ownerCar/queryCarDetail',
              method: 'get',
              data: { carId: vm.infoData.id }
            }).then(({ data }) => {
              if (data.code === 10000) {
                vm.infoData = data.data
              }
            })
          }
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
