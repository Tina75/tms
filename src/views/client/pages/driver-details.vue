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
          <span v-if="driverList.carType">{{carTypeMap[driverList.carType]}}</span>
          <span v-else>-</span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">车长：</span>
          <span v-if="driverList.carLength">{{carLengthMap[driverList.carLength]}}</span>
          <span v-else>-</span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">载重：</span>
          <span v-if="driverList.shippingWeight !== ''">{{driverList.shippingWeight}}吨</span>
          <span v-else>-</span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">净空：</span>

          <span v-if="driverList.shippingVolume !== ''">{{driverList.shippingVolume}}方</span>
          <span v-else>-</span>
        </div>
        </Col>
      </Row>
      <Row class="row">
        <Col span="6">
        <div>
          <span class="label">车辆品牌：</span>
          <span v-if="driverList.carBrand">{{driverList.carBrand}}</span>
          <span v-else>-</span>
        </div>
        </Col>
        <Col span="6">
        <div>
          <span class="label">结算方式：</span>
          <span>{{carrierPayTypeFindName(driverList.payType)}}</span>
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
          <div-image
            :src="img.src"
            class="imageDiv"
            @click.native="handleView(img.count)">
          </div-image>
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
import DivImage from '@/components/DivImage.vue'
import { carrierPayTypeFindName } from '../libs/carrierPayType.js'
export default {
  name: 'driver-details',
  components: { DivImage },
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
      // payTypeMap: carrierPayType,
      imageItems: []
    }
  },
  mounted () {
    this._carrierDetailsForDriver()
    this.initData()
  },
  methods: {
    carrierPayTypeFindName (val) {
      return carrierPayTypeFindName(val)
    },
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
            driver: { ..._this.driverList }
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
