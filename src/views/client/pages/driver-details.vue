<template>
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
          <span>{{carTypeMap[driverList.carType]}}</span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">车长：</span>
          {{carLengthMap[driverList.carLength]}}
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">载重：</span>
          {{driverList.shippingWeight}}<span v-if="driverList.shippingWeight">吨</span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">净空：</span>
          {{driverList.shippingVolume}}<span v-if="driverList.shippingVolume">方</span>
        </div>
        </Col>
      </Row>
      <Row class="row">
        <Col span="6">
        <div>
          <span class="label">车辆品牌：</span>
          {{driverList.carBrand}}
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">结算方式：</span>
          {{payTypeMap[driverList.payType]}}
        </div>
        </Col>
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
        <Col v-for="img in imageItems" :key="img.count" span="5">
        <div :v-if="img.src">
          <div :style="'height: 90px;background-image: url(' + img.src + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(img.count)"></div>
          <p class="uploadLabel">{{img.title}}</p>
        </div>
        </Col>
      </Row>
    </div>
    <div class="title" style="margin-top: 40px;">
      <span class="icontTitle"></span>
      <span class="iconTitleP">备注</span>
    </div>
    <div class="list-info">
      <p>
        {{driverList.remark}}
      </p>
    </div>
    <Modal v-model="visible" transfer title="查看图片">
      <img :src="imagePath" style="width: 100%">
      <div slot="footer" style="text-align: center;"></div>
    </Modal>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import prepareOpenSwipe from '@/components/swipe/index'
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import { CODE, carrierDelete, carrierDetailsForDriver } from './client'
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
        shippingVolume: '',
        carBrand: '',
        travelPhoto: '',
        drivePhoto: '',
        regularLine: ''
      },
      line1: '',
      line2: '',
      payTypeMap: {
        1: '按单付',
        2: '月结',
        '': ''
      },
      imageItems: []
    }
  },
  mounted () {
    this._carrierDetailsForDriver()
    this.initData()
  },
  methods: {
    // 司机个人信息查询
    _carrierDetailsForDriver () {
      let vm = this
      let data = {
        carrierId: this.carrierId
      }
      carrierDetailsForDriver(data).then(res => {
        if (res.data.code === CODE) {
          this.driverList = res.data.data
          this.initData()
          this.openSwipe = prepareOpenSwipe(this.imageItems)
        }
      }).catch(() => {
        this.$Toast.warning({
          title: '提示',
          content: '承运商不存在，请刷新列表',
          onOk () {
            vm.ema.fire('closeTab', vm.$route)
          },
          onCancel () {
            vm.ema.fire('closeTab', vm.$route)
          }
        })
      })
    },
    // 初始化数据格式
    initData () {
      this.imageItems = []
      let count = 0
      for (const key in this.driverList) {
        if (key === 'travelPhoto' && this.driverList[key]) {
          this.imageItems.push({ title: '行驶证', src: this.driverList.travelPhoto, count: count })
          count++
        }
        if (key === 'drivePhoto' && this.driverList[key]) {
          this.imageItems.push({ title: '驾驶证', src: this.driverList.drivePhoto, count: count })
          count++
        }
      }
      let s1 = ''
      let n1 = ''
      let s2 = ''
      let n2 = ''
      if (this.driverList.regularLine && JSON.parse(this.driverList.regularLine).length === 1) {
        s1 = JSON.parse(this.driverList.regularLine)[0].sn === undefined ? '' : JSON.parse(this.driverList.regularLine)[0].sn
        n1 = JSON.parse(this.driverList.regularLine)[0].en === undefined ? '' : JSON.parse(this.driverList.regularLine)[0].en
      } else if (this.driverList.regularLine && JSON.parse(this.driverList.regularLine).length === 2) {
        s1 = JSON.parse(this.driverList.regularLine)[0].sn === undefined ? '' : JSON.parse(this.driverList.regularLine)[0].sn
        n1 = JSON.parse(this.driverList.regularLine)[0].en === undefined ? '' : JSON.parse(this.driverList.regularLine)[0].en
        s2 = JSON.parse(this.driverList.regularLine)[1].sn === undefined ? '' : JSON.parse(this.driverList.regularLine)[1].sn
        n2 = JSON.parse(this.driverList.regularLine)[1].en === undefined ? '' : JSON.parse(this.driverList.regularLine)[1].en
      }
      this.line1 = s1 + '—' + n1 === '—' ? '' : s1 + '—' + n1
      this.line2 = s2 + '—' + n2 === '—' ? '' : s2 + '—' + n2
    },
    handleView (index) {
      this.openSwipe(index)
      // this.visible = true
      // this.imagePath = imagePath
    },
    removeDriverData () {
      let _this = this
      this.openDialog({
        name: 'client/dialog/confirmDelete',
        data: {
        },
        methods: {
          ok () {
            carrierDelete({
              carrierId: _this.carrierId
            }).then(res => {
              if (res.data.code === CODE) {
                _this.$Message.success(res.data.msg)
                _this.ema.fire('closeTab', _this.$route)
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
      _this.openDialog({
        name: 'client/dialog/carrier',
        data: {
          title: '修改承运商',
          flag: 2, // 编辑
          id: _this.carrierId,
          validate: {
            type: {
              selectStatus: 1
            },
            driver: { // 1 个体司机
              driverName: _this.driverList.driverName,
              driverPhone: _this.driverList.driverPhone,
              carNO: _this.driverList.carNO,
              carType: _this.driverList.carType + '',
              carLength: _this.driverList.carLength + '',
              shippingWeight: _this.driverList.shippingWeight + '',
              shippingVolume: _this.driverList.shippingVolume + '',
              remark: _this.driverList.remark,
              payType: _this.driverList.payType + '',
              carBrand: _this.driverList.carBrand,
              travelPhoto: _this.driverList.travelPhoto,
              drivePhoto: _this.driverList.drivePhoto,
              regularLine: _this.driverList.regularLine
            }
          }
        },
        methods: {
          ok () {
            _this._carrierDetailsForDriver()
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="stylus">
  @import "client.styl"
</style>
