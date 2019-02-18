<template>
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
            <span class="label">姓名：</span>
            {{infoData.driverName}}
          </div>
            </Col>
          <Col span="6">
          <div>
            <span class="label">车牌号：</span>
            {{infoData.carNO || infoData.carNo }}
          </div>
            </Col>
          <Col span="6">
          <div>
            <span class="label">合作方式：</span>
            <span v-if="infoData.driverType === 1">合约</span>
            <span v-else-if="infoData.driverType === 2">临时</span>
            <span v-else-if="infoData.driverType === 3">自有</span>
            <span v-else-if="infoData.driverType === 4">挂靠</span>
            <span v-else>-</span>
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
            <span v-if="infoData.carType">{{infoData.carType}}</span>
            <span v-else>-</span>
          </div>
            </Col>
          <Col span="6">
          <div>
            <span class="label">车长：</span>
            <span v-if="infoData.carLength">{{infoData.carLength}}</span>
            <span v-else>-</span>
          </div>
            </Col>
          <Col span="6">
          <div>
            <span class="label">载重：</span>
            <span v-if="infoData.shippingWeight !== ''">{{infoData.shippingWeight}}吨</span>
            <span v-else>-</span>
          </div>
            </Col>
          <Col span="6">
          <div>
            <span class="label">净空：</span>
            <span v-if="infoData.shippingVolume !== ''">{{infoData.shippingVolume}}方</span>
            <span v-else>-</span>
          </div>
            </Col>
        </Row>
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">购买日期：</span>
            <span v-if="infoData.purchDate">{{formatDate(infoData.purchDate)}}</span>
            <span v-else>-</span>
          </div>
            </Col>
          <Col span="6">
          <div>
            <span class="label">车辆品牌：</span>
            <span v-if="infoData.carBrand">{{infoData.carBrand}}</span>
            <span v-else>-</span>
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
      <Row class="list-info">
        <div v-for="img in imageItems" :key="img.index" class="infoImage">
          <div :v-if="img">
            <div-image
              :src="img.src"
              @click.native="handleView(img.count)">
            </div-image>
            <p class="titleInput">{{ img.title }}</p>
          </div>
        </div>
      </Row>
      <div class="title" style="margin-top: 40px;">
        <span class="icontTitle"></span>
        <span class="iconTitleP">操作日志</span>
      </div>
      <div class="list-info">
        <record-list :search-data="searchLogData" methods-url="/carrier/carrierLog/list"></record-list>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import { CODE, carrierDeleteDriver, queryByIdCarrier, queryCarById } from './client'
import RecordList from '@/components/RecordList'
import prepareOpenSwipe from '@/components/swipe/index'
import DivImage from '@/components/DivImage.vue'
export default {
  name: 'car-details',
  components: { RecordList, prepareOpenSwipe, DivImage },
  mixins: [ BasePage ],
  props: {
  },
  data () {
    return {
      infoData: {},
      infoDataInit: {},
      line1: '',
      line2: '',
      carrierId: '',
      searchLogData: {},
      id: '',
      carId: '',
      showTableOne: true,
      imageItems: []
    }
  },
  created () {
    this.searchLogData.carrierId = this.$route.query.carrierId
    this.searchLogData.id = this.$route.query.rowDataId + ''
    this.searchLogData.logType = 'vehicle'
  },
  mounted () {
    this.queryById()
    // this.initData()
    // this.openSwipe = prepareOpenSwipe(this.imageItems)
  },
  methods: {
    // 日期格式化
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    queryById () {
      // 数据备份，防止在详情页面对数据进行二次编辑
      this.id = this.$route.query.rowDataId
      this.carrierId = this.$route.query.carrierId
      this.carId = this.$route.query.carId
      let vm = this
      queryCarById({ carId: vm.id }).then(res => {
        if (res.data.code === CODE) {
          this.infoDataInit = Object.assign({}, res.data.data)
          vm.infoData = res.data.data
          vm.initData()
          // 大图预览
          vm.openSwipe = prepareOpenSwipe(vm.imageItems)
        }
      }).catch(() => {
        this.$Toast.warning({
          title: '提示',
          content: '车辆信息不存在，请刷新列表',
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
      for (const key in this.infoData) {
        if (key === 'travelPhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '行驶证', src: this.infoData.travelPhoto, count: count })
          count++
        }
        if (key === 'drivePhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '驾驶证', src: this.infoData.drivePhoto, count: count })
          count++
        }
      }
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
          validate: { ..._this.infoDataInit, purchDate: new Date(_this.infoDataInit.purchDate), carNO: this.infoData.carNO || this.infoData.carNo }
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
