<template>
  <div>
    <!-- 车辆信息详情 -->
    <div class="info-detail">
      <div class="info">
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">基础信息</span>
          <div class="btnItem">
            <Button v-if="hasPower(190103)" class="btnSty" @click="removeDriverData">删除</Button>
            <Button v-if="hasPower(190102)" type="primary" class="btnSty" @click="updateDriverData">修改</Button>
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
        <Row class="list-info">
          <div v-for="img in imageItems" :key="img.index" class="infoImage">
            <div :v-if="img">
              <div
                :style="'height: 90px;background-image: url(' + img.src + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
                class="fileImage"
                @click="handleView(img.count)">
              </div>
              <p v-show="!isEdit" class="titleInput">{{ img.title }}</p>
            </div>
          </div>
        </Row>
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
import { deleteDriverById, queryDriverById } from './client'
export default {
  name: 'driver-details',
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
      line1: '',
      line2: '',
      imageItems: []
    }
  },
  mounted () {
    this.infoData = this.$route.query.rowData
    this.queryById()
  },
  methods: {
    queryById () {
      let vm = this
      queryDriverById({ driverId: vm.infoData.id }).then(res => {
        vm.infoData = res.data.data
        vm.initData()
        // 大图预览
        vm.openSwipe = prepareOpenSwipe(vm.imageItems)
      }).catch(() => {
        this.$Toast.warning({
          title: '提示',
          content: '司机信息不存在，请刷新列表',
          onOk () {
            vm.ema.fire('closeTab', vm.$route)
          },
          onCancel () {
            vm.ema.fire('closeTab', vm.$route)
          }
        })
      })
    },
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
      this.imageItems = []
      for (const key in this.infoData) {
        if (key === 'driverPhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '驾驶证', src: this.infoData.driverPhoto, count: count })
          count++
        }
        if (key === 'identityFront' && this.infoData[key]) {
          this.imageItems.push({ title: '身份证正面', src: this.infoData.identityFront, count: count })
          count++
        }
        if (key === 'identityBack' && this.infoData[key]) {
          this.imageItems.push({ title: '身份证反面', src: this.infoData.identityBack, count: count })
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
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
            deleteDriverById({ id: vm.infoData.id }).then(res => {
              vm.$Message.success('删除成功！')
              vm.ema.fire('closeTab', vm.$route)
            })
          }
        }
      })
    },
    updateDriverData () {
      let vm = this
      this.openDialog({
        name: 'dialogs/edit-driver',
        data: {
          title: '修改司机',
          flag: 2, // 修改
          validate: vm.infoData
        },
        methods: {
          ok () {
            vm.queryById()
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
.info-detail
  margin-top: 30px
.btnItem
  margin-top: -30px
</style>
