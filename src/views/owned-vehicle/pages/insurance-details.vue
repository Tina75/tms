<template>
  <div>
    <!-- 车辆保险详情 -->
    <div class="info-detail">
      <div class="info">
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">基础信息</span>
          <div class="btnItem">
            <Button v-if="hasPower(190403)" class="btnSty" @click="removeDriverData">删除</Button>
            <Button v-if="hasPower(190402)" type="primary" class="btnSty" @click="updateDriverData">修改</Button>
          </div>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">车牌号：</span>
              {{infoData.carNo}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">保单号：</span>
              {{infoData.invoiceNo}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">保险公司：</span>
              {{infoData.insuranceCompanyName}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">购买日期:</span>
              {{infoData.buyDate | date}}
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">生效日期：</span>
              {{infoData.effectDate | date}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">失效日期：</span>
              {{infoData.expireDate | date}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">交强险金额：</span>
              {{divideFee(infoData.trafficFee)}}<span>元</span>
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">商业险金额:</span>
              {{divideFee(infoData.businessFee)}}<span>元</span>
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">总金额：</span>
              {{divideFee(infoData.totalFee)}}<span>元</span>
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="20">
            <div>
              <span class="label">备注:</span>
              {{infoData.remark}}
            </div>
            </Col>
          </Row>
        </div>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">保单照片</span>
        </div>
        <Row class="list-info">
          <!-- <Row class="row">
            <Col v-for="img in imageItems" :key="img.index" span="5">
            <div :v-if="img">
              <div :style="'height: 90px;background-image: url(' + img.src + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(img.count)"></div>
            </div>
            </Col>
          </Row> -->
          <div v-for="img in imageItems" :key="img.index" class="infoImage">
            <div :v-if="img">
              <div
                :style="'height: 90px;background-image: url(' + img.src + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
                class="fileImage"
                @click="handleView(img.count)">
              </div>
            </div>
          </div>
        </Row>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">操作记录</span>
        </div>
        <div class="list-info">
          <record-list v-if="dataLog.length" :data-log="dataLog"></record-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import RecordList from '@/components/RecordList'
import prepareOpenSwipe from '@/components/swipe/index'
import { mapActions } from 'vuex'
import { divideFee } from '@/libs/js/config'
export default {
  name: 'insurance-details',
  components: { RecordList, prepareOpenSwipe },
  mixins: [ BasePage ],
  props: {
  },
  metaInfo: {
    title: '车辆保险详情'
  },
  data () {
    return {
      infoData: {},
      imageItems: [],
      dataLog: []
    }
  },
  mounted () {
    this.infoData = this.$route.query.rowData
    this.queryById()
  },
  methods: {
    ...mapActions(['insuranceQueryById', 'insuranceDeleteById']),
    divideFee (fee) {
      return divideFee(fee)
    },
    queryById () {
      let vm = this
      this.insuranceQueryById({ id: vm.infoData.id }).then(res => {
        vm.infoData = res.data.data.info
        vm.dataLog = res.data.data.logs
        vm.initData()
        // 大图预览
        vm.openSwipe = prepareOpenSwipe(vm.imageItems)
      }).catch(() => {
        this.$Toast.warning({
          title: '提示',
          content: '信息不存在，请刷新列表',
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
      this.imageItems = []
      let count = 0
      for (const item of this.infoData.picUrls) {
        this.imageItems.push({ src: item, count: count })
        count++
      }
    },
    removeDriverData () {
      let vm = this
      this.$Toast.confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk () {
          vm.insuranceDeleteById({ id: vm.infoData.id }).then(() => {
            vm.$Message.success('删除成功！')
            vm.ema.fire('closeTab', vm.$route)
          })
        }
      })
    },
    updateDriverData () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-insurance',
        data: {
          title: '修改保险',
          flag: 4, // 修改
          validate: {
            ...vm.infoData,
            buyDate: new Date(vm.infoData.buyDate),
            effectDate: new Date(vm.infoData.effectDate),
            expireDate: new Date(vm.infoData.expireDate)
          }
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
</style>
