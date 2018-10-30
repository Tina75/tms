<template>
  <div class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">基础信息</span>
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
        <Row class="row">
          <Col span="6">
          <div class="lineSpanLabel">
            {{line1}}
          </div>
          </Col>
          <Col span="6">
          <div class="lineSpanLabel">
            {{line2}}
          </div>
          </Col>
        </Row>
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
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1, DRIVER_TYPE } from '@/libs/constant/carInfo'
export default {
  name: 'car-details',
  components: {},
  mixins: [ BasePage ],
  props: {
  },
  data () {
    return {
      infoData: {},
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      line1: '',
      line2: ''
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.infoData = this.$route.query.rowData
    this.infoData.driverType = (DRIVER_TYPE.find(e => e.id === this.infoData.driverType.toString())).name
    this.infoData.carType = this.carTypeMap[this.infoData.carType]
    this.infoData.carLength = this.carLengthMap[this.infoData.carLength]
    if (this.infoData.regularLine) {
      this.line1 = JSON.parse(this.infoData.regularLine)[0].sn + '—' + JSON.parse(this.infoData.regularLine)[0].en
      this.line2 = JSON.parse(this.infoData.regularLine)[1].sn + '—' + JSON.parse(this.infoData.regularLine)[1].en
    }
  },
  methods: {
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "client.styl"
</style>
