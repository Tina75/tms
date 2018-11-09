<template>
  <div class="info">
    <div class="title">
      <span class="icontTitle"></span>
      <span class="iconTitleP">基础信息</span>
    </div>
    <div class="list-info">
      <Row class="row">
        <Col span="6">
        <div>
          <span class="label">承运商类型：</span>
          个体司机
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">司机姓名：</span>
          {{driverList.driverName}}
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">手机号：</span>
          {{driverList.driverPhone}}
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">车牌号：</span>
          {{driverList.carNO}}
        </div>
        </Col>
      </Row>
      <Row class="row">
        <Col span="6">
        <div>
          <span class="label">车型：</span>
          <span>{{carTypeMap[driverList.carType]}}{{carLengthMap[driverList.carLength]}}</span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">车长：</span>
          <span></span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">载重：</span>
          <span></span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">净空：</span>
          <span></span>
        </div>
        </Col>
      </Row>
      <Row class="row">
        <Col span="6">
        <div>
          <span class="label">品牌：</span>
          <span></span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">结算方式：</span>
          <span></span>
        </div>
        </Col>
        </Col>
      </Row>
      <Row class="row">
        <Col span="24">
        <div>
          <span class="label">备注：</span>
          {{driverList.remark}}
        </div>
        </Col>
        <Col span="8">
        <div>
          <span class="label">结算方式：</span>
          <span>{{payTypeMap[driverList.payType]}}</span>
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
        <div v-if="driverList.travelPhoto">
          <img :style="'height: 90px;background-image: url(' + driverList.travelPhoto + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(driverList.travelPhoto)"/>
          <p class="uploadLabel">行驶证</p>
        </div>
        </Col>
        <Col span="6">
        <div v-if="driverList.drivePhoto">
          <img :style="'height: 90px;background-image: url(' + driverList.drivePhoto + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(driverList.drivePhoto)"/>
          <p class="uploadLabel">驾驶证</p>
        </div>
        </Col>
        <Modal v-model="visible" title="查看图片">
          <img :src="imagePath" style="width: 100%">
          <div slot="footer" style="text-align: center;"></div>
        </Modal>
      </Row>
    </div>
    <div class="title" style="margin-top: 40px;">
      <span class="icontTitle"></span>
      <span class="iconTitleP">备注</span>
    </div>
    <div class="list-info">
      <p>sssssssssssssssssssssssssssssssssssssssss
      sssssssssssssssssssssssssssssssssssssssss
      sssssssssssssssssssssssssssssssssssssssss
      sssssssssssssssssssssssssssssssssssssssss
      </p>
    </div>
    <Modal v-model="visible" title="查看图片">
      <img :src="imagePath" style="width: 100%">
      <div slot="footer" style="text-align: center;"></div>
    </Modal>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import { CODE, carrierDetailsForDriver } from './client'
export default {
  name: 'driver-details',
  components: {},
  mixins: [ BasePage ],
  metaInfo: {
    title: '承运商详情'
  },
  data () {
    return {
      visible: false,
      imagePath: '',
      carrierId: this.$route.query.id,
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      driverList: {
        driverName: '',
        carNO: '',
        carType: '',
        driverPhone: '',
        payType: '',
        carLength: '',
        remark: '',
        shippingWeight: '',
        shippingVolume: ''
      },
      line1: '',
      line2: '',
      payTypeMap: {
        1: '按单付',
        2: '月结',
        '': ''
      }
    }
  },
  mounted () {
    this._carrierDetailsForDriver()
    // this.initData()
  },
  methods: {
    // 司机个人信息查询
    _carrierDetailsForDriver () {
      let data = {
        carrierId: this.carrierId
      }
      carrierDetailsForDriver(data).then(res => {
        if (res.data.code === CODE) {
          this.driverList = {
            driverName: res.data.data.driverName,
            carNO: res.data.data.carNO,
            carType: res.data.data.carType,
            driverPhone: res.data.data.driverPhone,
            payType: res.data.data.payType,
            carLength: res.data.data.carLength,
            remark: res.data.data.remark === '' ? '无' : res.data.data.remark,
            shippingWeight: res.data.data.shippingWeight,
            shippingVolume: res.data.data.shippingVolume
          }
        }
      })
    },
    // 初始化数据格式
    // initData () {
    //   this.repairFormat.carNO = this.infoData.carNO
    //   this.repairFormatInit = Object.assign({}, this.repairFormat)
    //   this.infoData.driverType = (DRIVER_TYPE.find(e => e.id === this.infoData.driverType.toString())).name
    //   this.infoData.carType = this.carTypeMap[this.infoData.carType]
    //   this.infoData.carLength = this.carLengthMap[this.infoData.carLength]
    //   let s1 = ''
    //   let n1 = ''
    //   let s2 = ''
    //   let n2 = ''
    //   if (this.infoData.regularLine && JSON.parse(this.infoData.regularLine).length === 1) {
    //     s1 = JSON.parse(this.infoData.regularLine)[0].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].sn
    //     n1 = JSON.parse(this.infoData.regularLine)[0].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].en
    //   } else if (JSON.parse(this.infoData.regularLine).length === 2) {
    //     s1 = JSON.parse(this.infoData.regularLine)[0].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].sn
    //     n1 = JSON.parse(this.infoData.regularLine)[0].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].en
    //     s2 = JSON.parse(this.infoData.regularLine)[1].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[1].sn
    //     n2 = JSON.parse(this.infoData.regularLine)[1].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[1].en
    //   }
    //   this.line1 = s1 + '—' + n1 === '—' ? '' : s1 + '—' + n1
    //   this.line2 = s2 + '—' + n2 === '—' ? '' : s2 + '—' + n2
    // },
    handleView (imagePath) {
      this.visible = true
      this.imagePath = imagePath
    }
  }
}
</script>
<style scoped lang="stylus">
  @import "client.styl"
</style>
