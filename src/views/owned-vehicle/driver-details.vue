<template>
  <div>
    <!-- 车辆信息详情 -->
    <div v-if="showTableOne" class="info-detail">
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
              <span class="label">手机号：</span>
              {{infoData.driverPhone}}
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
            <div v-if="infoData.driverPhoto">
              <div :style="'height: 90px;background-image: url(' + infoData.driverPhoto + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(0)"></div>
              <p class="uploadLabel">行驶证</p>
            </div>
            </Col>
            <Col span="6">
            <div v-if="infoData.driverPhoto">
              <div :style="'height: 90px;background-image: url(' + infoData.driverPhoto + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(1)"></div>
              <p class="uploadLabel">驾驶证</p>
            </div>
            </Col>
          </Row>
        </div>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">备注</span>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col span="20">
            {{infoData.remark}}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import RecordList from '@/components/RecordList'
import prepareOpenSwipe from '@/components/swipe/index'
export default {
  name: 'car-details',
  components: { RecordList, prepareOpenSwipe },
  mixins: [ BasePage ],
  props: {
  },
  metaInfo: {
    title: '司机详情'
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
      visible: false,
      imagePath: ''
    }
  },
  computed: {
    imageItems () {
      return [
        {
          title: '行驶证',
          src: this.infoData.driverPhoto,
          msrc: this.infoData.driverPhoto
        },
        {
          title: '驾驶证',
          src: this.infoData.driverPhoto,
          msrc: this.infoData.driverPhoto
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
    debugger
    // 数据备份，防止在详情页面对数据进行二次编辑
    this.infoDataInit = Object.assign({}, this.$route.query.rowData)
    this.id = this.infoDataInit.id
    this.carrierId = this.infoDataInit.carrierId
    this.infoData = this.$route.query.rowData
    this.initDataLine()
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
    initDataLine () {
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
      this.openDialog({
        name: 'owned-vehicle/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
          }
        }
      })
    },
    updateDriverData () {
      this.openDialog({
        name: 'dialogs/edit-driver',
        data: {
          title: '修改司机',
          flag: 2, // 修改
          validate: { ...this.infoData, purchDate: new Date(this.infoData.purchDate) }
        },
        methods: {
          ok () {
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
