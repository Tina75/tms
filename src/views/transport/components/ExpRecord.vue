<template>
  <div class="except-record">
    <div class="except-record-title wigtFont">
      <span>
        上报信息 第{{index | numFormat}}笔 【{{data.status == 10 ? '未处理' : data.status == 20 ? '已处理' : ''}}】
      </span>
      <span>记录号：{{data.recordNo}}</span>
      <div class="except-record-btn-group">
        <template v-if="data.status == 10">
          <Button type="default" style="margin: 0 10px" @click="clickHandle">处理</Button>
          <Button type="primary" @click="editBtn">编辑</Button>
        </template>
        <div class="detail-log-icon" @click="showDetail">
          <i :class="{'detail-log-show': !hideDetail}"></i>
        </div>
      </div>
    </div>
    <div class="except-record-list">
      <Row class="mgbt20">
        <i-col span="6">
          <label class="label-bar">异常环节：</label>
          <span class="colorGrey">{{data.abnormalTimingDesc}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">异常类型：</label>
          <span class="colorGrey">{{data.abnormalTypeDesc}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">上报时间：</label>
          <span class="colorGrey">{{data.createTime | timeFormatter}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">处理时间：</label>
          <span class="colorGrey">{{data.disposeTime | timeFormatter}}</span>
        </i-col>
      </Row>
      <div :class="{'except-record-list-hide': hideDetail}" class="except-record-list-show">
        <div style="display: flex; margin-bottom: 10px; margin-top: 10px">
          <label class="label-bar">异常描述：</label>
          <span class="flexBox colorGrey">{{data.abnormalDesc}}</span>
        </div>
        <div style="display: flex; margin-bottom: 10px; margin-top: 10px">
          <label class="label-bar">图片：</label>
          <div class="flexBox">
            <span v-for="(item, index) in data.fileUrls"
                  :key="index" :style="`background-image: url(${item}) `"
                  style="background-position: center; background-size: 100%; background-repeat: no-repeat;"
                  class="img-bar" @click="showImg(item)">
            </span>
          </div>
        </div>
        <Row class="mgbt20">
          <i-col span="12" style="display: flex">
            <label class="label-bar wigtFont">修改前运费：</label>
            <div class="flex-bar">
              <Row v-if="billType != 2">
                <i-col span="8">
                  <label class="feeLabel">运输费：</label>
                  <span class="colorGrey">{{data.beforeFeeInfo.freightFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">装货费：</label>
                  <span class="colorGrey">{{data.beforeFeeInfo.loadFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">卸货费：</label>
                  <span class="colorGrey">{{data.beforeFeeInfo.unloadFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">保险费：</label>
                  <span class="colorGrey">{{data.beforeFeeInfo.insuranceFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">其他：</label>
                  <span class="colorGrey">{{data.beforeFeeInfo.otherFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">费用合计：</label>
                  <span class="colorGrey">{{data.beforeFeeInfo.totalFee | Money}}元</span>
                </i-col>
              </Row>
              <Row v-else>
                <label>外转运费：</label>
                <span class="colorGrey">{{data.beforeFeeInfo.freightFee | Money}}元</span>
              </Row>
              <Table
                v-if="billType != 2"
                :data="data.beforeFeeInfo.abnormalPayInfos"
                :columns="columns"
                width="350"></Table>
            </div>
          </i-col>
          <i-col span="12" style="display: flex">
            <label class="label-bar wigtFont">修改后运费：</label>
            <div class="flex-bar">
              <Row v-if="billType != 2">
                <i-col span="8">
                  <label class="feeLabel">运输费：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.freightFee, data.afterFeeInfo.freightFee)}" class="colorGrey">{{data.afterFeeInfo.freightFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">装货费：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.loadFee, data.afterFeeInfo.loadFee)}" class="colorGrey">{{data.afterFeeInfo.loadFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">卸货费：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.unloadFee, data.afterFeeInfo.unloadFee)}" class="colorGrey">{{data.afterFeeInfo.unloadFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">保险费：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.insuranceFee, data.afterFeeInfo.insuranceFee)}" class="colorGrey">{{data.afterFeeInfo.insuranceFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">其他：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.otherFee, data.afterFeeInfo.otherFee)}" class="colorGrey">{{data.afterFeeInfo.otherFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label class="feeLabel">费用合计：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.totalFee, data.afterFeeInfo.totalFee)}" class="colorGrey">{{data.afterFeeInfo.totalFee | Money}}</span>元
                </i-col>
              </Row>
              <Row v-else>
                <label>外转运费：</label>
                <span :class="{'red-col': compareFee(data.beforeFeeInfo.freightFee, data.afterFeeInfo.freightFee)}" class="colorGrey">{{data.afterFeeInfo.freightFee | Money}}元</span>
              </Row>
              <Table
                v-if="billType != 2"
                :data="data.afterFeeInfo.abnormalPayInfos"
                :columns="columnsAfter"
                width="350"></Table>
            </div>
          </i-col>
        </Row>
        <div class="mgbt20" style="display: flex">
          <label class="label-bar">处理备注：</label>
          <span class="flexBox colorGrey">{{data.disposeDesc}}</span>
        </div>
      </div>
    </div>
    <Modal v-model="visible" title="查看图片">
      <img :src="curImg" style="width: 100%">
      <div slot="footer" style="text-align: center;"></div>
    </Modal>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import TransportBase from '../mixin/transportBase'
const moneyFormate = (fee) => {
  if (!fee) return 0
  return fee / 100
}
export default {
  name: 'except-record',
  filters: {
    timeFormatter (timestamp) {
      if (!timestamp) return '-'
      return new Date(timestamp).Format('yyyy-MM-dd hh:mm')
    },
    Money: moneyFormate,
    numFormat (num) {
      return num + 1
    }
  },
  mixins: [ BasePage, TransportBase ],
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    listLength: {
      type: Number,
      default: 0
    },
    // 单据类型 1 提货单 2 外转单 3 运单
    billType: {
      type: Number
    },
    pickupId: {
      type: Number
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      hideDetail: this.listLength > 1,
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
          key: 'cashAmount',
          render: (h, params) => h('span', moneyFormate(params.row.cashAmount))
        },
        {
          title: '油卡',
          key: 'fuelCardAmount',
          render: (h, params) => h('span', moneyFormate(params.row.fuelCardAmount))
        }
      ],
      columnsAfter: [
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
          key: 'cashAmount',
          render: (h, params) => {
            const bfArr = this.data.beforeFeeInfo.abnormalPayInfos
            const bfFee = bfArr[params.index] && bfArr[params.index].cashAmount
            return h('span', {
              domProps: {
                innerHTML: moneyFormate(params.row.cashAmount)
              },
              style: {
                color: moneyFormate(bfFee) !== moneyFormate(params.row.cashAmount) ? 'red' : ''
              }
            })
          }
        },
        {
          title: '油卡',
          key: 'fuelCardAmount',
          render: (h, params) => {
            const bfArr = this.data.beforeFeeInfo.abnormalPayInfos
            const bfFee = bfArr[params.index] && bfArr[params.index].fuelCardAmount
            return h('span', {
              domProps: {
                innerHTML: moneyFormate(params.row.fuelCardAmount)
              },
              style: {
                color: moneyFormate(bfFee) !== moneyFormate(params.row.fuelCardAmount) ? 'red' : ''
              }
            })
          }
        }
      ],
      visible: false,
      curImg: ''
    }
  },
  methods: {
    // 处理对话框
    clickHandle (e) {
      const self = this
      this.openDialog({
        name: 'transport/dialog/errorDetail',
        data: {
          id: this.data.recordId
        },
        methods: {
          complete () {
            self.$parent.initData()
          }
        }
      })
    },
    // 编辑对话框
    editBtn (e) {
      const self = this
      this.openDialog({
        name: 'transport/dialog/abnormal',
        data: {
          recordId: this.data.recordId,
          type: this.billType,
          id: this.pickupId
        },
        methods: {
          complete () {
            self.$parent.initData()
          }
        }
      })
    },
    showDetail () {
      this.hideDetail = !this.hideDetail
    },
    compareFee (b, a) {
      return moneyFormate(b) !== moneyFormate(a)
    },
    showImg (src) {
      this.visible = true
      this.curImg = src
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
    color #666
    border-top 1px solid #d4d5dc
    &-hide
      display none
      .mgbt20
        margin-bottom 35px
  .img-bar
    display inline-block
    width 160px
    height 90px
    margin 0 5px 5px 0
    overflow hidden
    vertical-align: top;
    cursor pointer
    img
      display block
      // margin auto
      width 100%
      height 100%
  .label-bar
    display inline-block
    width 90px
  .flex-bar
    display inline-block
    flex 1
    .ivu-col
      margin-bottom  10px
  .mgbt20
    margin-top 10px
    margin-bottom  10px
  .red-col
    color red!important
  .flexBox
    display inline-block
    flex 1
  .wigtFont
    font-weight 600
    color #333
  &-list-show
    .mgbt20
      margin-top 35px
  .colorGrey
    color #333
  .feeLabel
    display inline-block
    width 70px
</style>
