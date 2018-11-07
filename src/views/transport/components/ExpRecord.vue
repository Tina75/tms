<template>
  <div class="except-record">
    <div class="except-record-title">
      <span>
        上报信息 第一笔 【{{data.status == 10 ? '未处理' : data.status == 20 ? '已处理' : ''}}】
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
          <span>{{data.abnormalTimingDesc}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">异常类型：</label>
          <span>{{data.abnormalTypeDesc}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">上报时间：</label>
          <span>{{data.createTime | timeFormatter}}</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">处理时间：</label>
          <span>{{data.disposeTime | timeFormatter}}</span>
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
                <i-col span="8">
                  <label>运输费：</label>
                  <span>{{data.beforeFeeInfo.freightFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label>装货费：</label>
                  <span>{{data.beforeFeeInfo.loadFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label>卸货费：</label>
                  <span>{{data.beforeFeeInfo.unloadFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label>保险费：</label>
                  <span>{{data.beforeFeeInfo.insuranceFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label>其&emsp;他：</label>
                  <span>{{data.beforeFeeInfo.otherFee | Money}}元</span>
                </i-col>
                <i-col span="8">
                  <label>费用合计：</label>
                  <span>{{data.beforeFeeInfo.totalFee | Money}}元</span>
                </i-col>
              </Row>
              <Table
                :columns="columns"
                :data="data.beforeFeeInfo.abnormalPayInfos"></Table>
            </div>
          </i-col>
          <i-col span="12" style="display: flex">
            <label class="label-bar">修改后运费：</label>
            <div class="flex-bar">
              <Row>
                <i-col span="8">
                  <label>运输费：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.freightFee, data.afterFeeInfo.freightFee)}">{{data.afterFeeInfo.freightFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label>装货费：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.loadFee, data.afterFeeInfo.loadFee)}">{{data.afterFeeInfo.loadFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label>卸货费：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.unloadFee, data.afterFeeInfo.unloadFee)}">{{data.afterFeeInfo.unloadFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label>保险费：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.insuranceFee, data.afterFeeInfo.insuranceFee)}">{{data.afterFeeInfo.insuranceFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label>其&emsp;他：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.otherFee, data.afterFeeInfo.otherFee)}">{{data.afterFeeInfo.otherFee | Money}}</span>元
                </i-col>
                <i-col span="8">
                  <label>费用合计：</label>
                  <span :class="{'red-col': compareFee(data.beforeFeeInfo.totalFee, data.afterFeeInfo.totalFee)}">{{data.afterFeeInfo.totalFee | Money}}</span>元
                </i-col>
              </Row>
              <Table
                :columns="columnsAfter"
                :data="data.afterFeeInfo.abnormalPayInfos"></Table>
            </div>
          </i-col>
        </Row>
        <Row class="mgbt20">
          <i-col span="24">
            <label class="label-bar">处理备注：</label>
            <span>{{data.disposeDesc}}</span>
          </i-col>
        </Row>
      </div>
    </div>
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
    Money: moneyFormate
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
            // console.log('异常详情'+ bfFee && bfFee !== params.row.cashAmount)
            return h('span', {
              domProps: {
                innerHTML: moneyFormate(params.row.cashAmount)
              },
              style: {
                color: bfFee && bfFee !== params.row.cashAmount ? 'red' : ''
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
                color: bfFee && bfFee !== params.row.fuelCardAmount ? 'red' : ''
              }
            })
          }
        }
      ]
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
            self.hideDetail = true
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
            self.hideDetail = true
            self.$parent.initData()
          }
        }
      })
    },
    showDetail () {
      this.hideDetail = !this.hideDetail
    },
    compareFee (b, a) {
      return b !== a
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
    margin 0 10px 0 0
    overflow hidden
    vertical-align: top;
    img
      display block
      // margin auto
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
  .red-col
    color red
</style>
