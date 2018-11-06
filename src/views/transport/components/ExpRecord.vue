<template>
  <div class="except-record">
    <div class="except-record-title">
      <span>
        上报信息 第一笔 【{{types === 10 ? '已处理' : types === 20 ? '未处理' : ''}}】
      </span>
      <span>记录号：{{no}}</span>
      <div class="except-record-btn-group">
        <Button type="default" style="margin: 0 10px" @click="clickHandle">处理</Button>
        <Button type="primary" @click="editBtn">编辑</Button>
        <div class="detail-log-icon" @click="showDetail">
          <i :class="{'detail-log-show': hideDetail}"></i>
        </div>
      </div>
    </div>
    <div class="except-record-list">
      <Row class="mgbt20">
        <i-col span="6">
          <label class="label-bar">异常环节：</label>
          <span>{{data.abnormalTimingDesc}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">异常类型：</label>
          <span>{{data.abnormalTypeDesc}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">上报时间：</label>
          <span>{{data.createTime}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">处理时间：</label>
          <span>{{data.disposeTime}}</span>
        </i-col>
      </Row>
      <div :class="{'except-record-list-hide': hideDetail}">
        <Row class="mgbt20">
          <i-col span="24">
            <label class="label-bar">异常描述：</label>
            <span>{{data.abnormalDesc}}</span>
          </i-col>
        </Row>
        <Row class="mgbt20">
          <i-col span="24">
            <label class="label-bar">图片：</label>
            <span v-for="(item, index) in data.fileUrls" :key="index" class="img-bar">
              <img :src="item" alt="">
            </span>
          </i-col>
        </Row>
        <Row class="mgbt20">
          <i-col span="12" style="display: flex">
            <label class="label-bar">修改前运费：</label>
            <div class="flex-bar">
              <Row>
                <i-col span="6">
                  <label>运输费：</label>
                  <span>{{data.beforeFeeInfo.freightFee}}元</span>
                </i-col>
                <i-col span="6">
                  <label>装货费：</label>
                  <span>{{data.beforeFeeInfo.loadFee}}元</span>
                </i-col>
                <i-col span="6">
                  <label>卸货费：</label>
                  <span>{{data.beforeFeeInfo.unloadFee}}元</span>
                </i-col>
                <i-col span="6">
                  <label>保险费：</label>
                  <span>{{data.beforeFeeInfo.insuranceFee}}元</span>
                </i-col>
                <i-col span="6">
                  <label>其&emsp;他：</label>
                  <span>{{data.beforeFeeInfo.otherFee}}元</span>
                </i-col>
              </Row>
              <Table
                :columns="columns"
                :data="data.beforeFeeInfo.abnormalPayInfos"></Table>
            </div>
          </i-col>
          <i-col span="12" style="display: flex">
            <label>修改后运费：</label>
            <div class="flex-bar">
              <Row>
                <i-col span="6">
                  <label>运输费：</label>
                  <span>{{data.afterFeeInfo.freightFee}}元</span>
                </i-col>
                <i-col span="6">
                  <label>装货费：</label>
                  <span>{{data.afterFeeInfo.loadFee}}元</span>
                </i-col>
                <i-col span="6">
                  <label>卸货费：</label>
                  <span>{{data.afterFeeInfo.unloadFee}}元</span>
                </i-col>
                <i-col span="6">
                  <label>保险费：</label>
                  <span>{{data.afterFeeInfo.insuranceFee}}元</span>
                </i-col>
                <i-col span="6">
                  <label>其&emsp;他：</label>
                  <span>{{data.afterFeeInfo.otherFee}}元</span>
                </i-col>
              </Row>
              <Table
                :columns="columns"
                :data="data.afterFeeInfo.abnormalPayInfos"></Table>
            </div>
          </i-col>
        </Row>
        <Row class="mgbt20">
          <i-col span="24">
            <label>处理备注：</label>
            <span>{{data.disposeDesc}}</span>
          </i-col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'except-record',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    types: {
      type: Number,
      default: 0
    },
    no: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hideDetail: false,
      columns: [
        {
          title: '付款方式',
          key: 'payType',
          render: (h, params) => {
            // 1 预付 2 到付 3 回付
            let txt = ''
            switch (params.row.payType) {
              case 1:
                txt = '预付'
                break
              case 2:
                txt = '到付'
                break
              case 3:
                txt = '回付'
                break
              default:
            }
            return h('div', txt)
          }
        },
        {
          title: '现金',
          key: 'cashAmount'
        },
        {
          title: '油卡',
          key: 'fuelCardAmount'
        }
      ],
      tableData: [
        {
          payType: '到付',
          cash: 18,
          oilCard: 0
        }
      ]
    }
  },
  methods: {
    // 处理对话框
    clickHandle (e) {
      console.log('处理对话框')
    },
    // 编辑对话框
    editBtn (e) {
      console.log('编辑对话框')
    },
    showDetail () {
      this.hideDetail = !this.hideDetail
    }
  }
}
</script>
<style lang="stylus" scoped>
.except-record
  margin-bottom 20px
  margin-left 1px
  border 1px solid #d4d5dc
  &-title
    padding 16px 20px 16px 20px
    font-size 16px
    color #333
    background #f8f8f8
    span
      line-height 30px
  &-btn-group
    float right
  .detail-log-icon
    display inline-block
    vertical-align middle
    margin 0 0 0 20px
  &-list
    font-size 14px
    line-height 20px
    padding 10px 20px
    border-top 1px solid #d4d5dc
    &-hide
      display none
  .img-bar
    display inline-block
    width 160px
    height 90px
    margin 0 10px
    overflow hidden
    vertical-align: top;
    img
      display block
      margin auto
      max-width 100%
      max-height 100%
  .label-bar
    display inline-block
    width 84px
  .flex-bar
    display inline-block
    flex 1
    .ivu-col
      margin-bottom  10px
  .mgbt20
    margin-top 10px
    margin-bottom  10px
</style>
