<template>
  <div class="order-record">
    <div class="order-record-title wigtFont">
      <span>
        2018-12-21 【修改人: {{data.creatorName}}】
      </span>
      <div class="detail-log-icon" @click="showDetail">
        <i :class="{'detail-log-show': !hideDetail}"></i>
      </div>
    </div>
    <div :class="{'change-list-hide': hideDetail}" class="change-list">
      <Row>
        <Col span="12">
        <div class="title">修改前运单信息:</div>
        <Row>
          <Col v-for="(item, index) in ORDER_ITEM" v-if="data.changeBefore[item.value] != undefined" :key="index" span="12" class="labelContent">
          <span class="label">{{item.name}}:</span>
          <span class="content">{{data.changeBefore[item.value]}}</span>
          </Col>
        </Row>
        </Col>
        <Col span="12">
        <div class="title">修改后运单信息:</div>
        <Row class="after">
          <Col v-for="(item, index) in ORDER_ITEM" v-if="data.changeAfter[item.value] != undefined" :key="index" span="12" class="labelContent">
          <span class="label">{{item.name}}:</span>
          <span class="content">{{data.changeAfter[item.value]}}</span>
          </Col>
        </Row>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
const ORDER_ITEM = [
  {
    name: '结算方式',
    value: 'settlementType'
  },
  {
    name: '计费里程',
    value: 'mileage'
  },
  {
    name: '运输费用',
    value: 'freightFee'
  },
  {
    name: '提货费用',
    value: 'pickupFee'
  },
  {
    name: '装货费用',
    value: 'loadFee'
  },
  {
    name: '卸货费用',
    value: 'unloadFee'
  },
  {
    name: '保险费用',
    value: 'insuranceFee'
  },
  {
    name: '其他费用',
    value: 'otherFee'
  },
  {
    name: '回单数量',
    value: 'receiptCount'
  },
  {
    name: '是否开票',
    value: 'isInvoice'
  },
  {
    name: '开票税率',
    value: 'invoiceRate'
  },
  {
    name: '备注',
    value: 'remark'
  },
  {
    name: '代收货款',
    value: 'collectionMoney'
  }
]
export default {
  name: 'order-record',
  filters: {
    timeFormatter (timestamp) {
      if (!timestamp) return '-'
      return new Date(timestamp).Format('yyyy-MM-dd hh:mm')
    },
    Money (fee) {
      if (!fee) return '-'
      return fee / 100
    }
  },
  mixins: [ BasePage ],
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    listLength: {
      type: Number,
      default: 0
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      ORDER_ITEM,
      hideDetail: this.index > 0,
      showImgFn: null
    }
  },
  computed: {
    orderMap () {
      const obj = {}
      this.ORDER_ITEM.forEach(el => {
        obj[el.value] = el.name
      })
      return obj
    }
  },
  methods: {
    showDetail () {
      this.hideDetail = !this.hideDetail
    }
  }
}
</script>
<style lang="stylus" scoped>
.order-record
  margin-bottom: 20px;
  border 1px solid #d4d5dc
  &-title
    padding 16px 20px 16px 20px
    border-bottom 1px solid #d4d5dc
    font-size 16px
    background #f8f8f8
    span
      line-height 30px
  .detail-log-icon
    float right
    display inline-block
    vertical-align middle
    margin 0 0 0 20px
    width 26px
    height 26px
    background rgba(0,164,189,1)
    border-radius 5px
    text-align center
    cursor pointer
    i
      display block
      width 16px
      height 16px
      margin 5px
      background url(../../../../assets/img-icon-expand.png) no-repeat
      background-size contain
    .detail-log-show
      transition all 0.3s linear
    .detail-log-show
      transform rotate(180deg)
      transition all 0.3s linear
  &-list
    font-size 14px
    line-height 20px
    padding 10px 20px
    color #666
    border-top 1px solid #d4d5dc
  .change-list-hide
    display none
  .wigtFont
    font-weight 600
    color #333
  .change-list
    padding 28px 17px 0 17px
    font-size 14px
    .info
      border-bottom 1px dashed #d4d5dc
      padding-bottom 20px
    .fee
      padding-top 20px
      padding-bottom 20px
    .title
      color #333
      font-weight 500
      margin-bottom 20px
    .labelContent
      margin-bottom 10px
      .label
        color #777
        display inline-block
        width 100px
      .after.content
        color #EC4E4E
    .labelContent.ivu-col-span-24
      overflow hidden
      .label
        float left
      .content
        float left
        width 80%
    .after
      .content
        color red
</style>
