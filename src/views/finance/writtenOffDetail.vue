<template>
  <div class="written-off-detail">
    <div class="case-info">
      <Row>
        <Col span="6">
        <p><label>对账批次号：</label><span>{{$route.query.verifyNo}}</span></p>
        </Col>
        <Col span="8">
        <p><label>日期范围：</label><span>{{$route.query.dateRange}}</span></p>
        </Col>
        <Col span="6">
        <p><label>{{sceneMap[$route.query.scene]}}：</label><span>{{$route.query.partnerName}}</span></p>
        </Col>
      </Row>
    </div>
    <div class="data-block">
      <p class="block-title">{{dataNameMap[$route.query.scene]}}明细</p>
      <div class="block-body">
        <Table :columns="writtenOffColumn" :data="writtenOffData.list"></Table>
        <div class="total-data">
          <Row>
            <Col span="3">
            <p>总计</p>
            </Col>
            <Col span="3">
            <p>总单数：{{writtenOffData.orderNum}}</p>
            </Col>
            <Col span="3">
            <p>总运费：{{writtenOffData.totalFee}}</p>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div class="data-block">
      <p class="block-title">核销明细</p>
      <div class="block-body">
        <Timeline>
          <TimelineItem v-for="(item, index) in verifyInfoList" :key="index">
            <i slot="dot" class="time-line-dot"></i>
            <p class="check-date">{{item.operateTime}}</p>
            <div class="check-info">
              <Row>
                <Col span="3">
                <p>核销人：<span>{{item.operatorName}}</span></p>
                </Col>
                <Col span="3">
                <p>应付金额：<span>{{item.calcFee}}</span></p>
                </Col>
                <Col span="3">
                <p>实付金额：<span>{{item.actualFee}}</span></p>
                </Col>
                <Col span="3">
                <p>付款方式：<span>{{item.payTypeDesc}}</span></p>
                </Col>
                <Col span="8">
                <p>付款银行卡号：<span>{{item.account}}</span></p>
                </Col>
                <Col span="4">
                <p>开户行：<span>{{item.bank}}</span></p>
                </Col>
              </Row>
              <Row>
                <Col span="6">
                <p>备注：<span>{{item.remark}}</span></p>
                </Col>
              </Row>
            </div>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'writtenOffDetail',
  metaInfo: {
    title: ''
  },
  mixins: [ BasePage ],
  data () {
    return {
      sceneMap: {
        1: '发货方',
        2: '承运商',
        3: '外转方'
      },
      dataNameMap: {
        1: '订单',
        2: '单据',
        3: '外转单'
      },
      active: '1',
      writtenOffData: {
        orderNum: 100,
        totalFee: 1000.87,
        list: [
          {
            orderId: '7777777777777',
            orderNo: '7777777777777',
            departureName: '南京市秦淮区',
            destinationName: '南京市玄武区',
            totalFeeText: '1000',
            settleTypeDesc: '月结',
            orderStatusDesc: '已回单',
            orderTimeText: new Date().getTime()
          },
          {
            orderId: '7777777777777',
            orderNo: '7777777777777',
            departureName: '南京市秦淮区',
            destinationName: '南京市玄武区',
            totalFeeText: '1000',
            settleTypeDesc: '月结',
            orderStatusDesc: '已回单',
            orderTimeText: new Date().getTime()
          },
          {
            orderId: '7777777777777',
            orderNo: '7777777777777',
            departureName: '南京市秦淮区',
            destinationName: '南京市玄武区',
            totalFeeText: '1000',
            settleTypeDesc: '月结',
            orderStatusDesc: '已回单',
            orderTimeText: new Date().getTime()
          },
          {
            orderId: '7777777777777',
            orderNo: '7777777777777',
            departureName: '南京市秦淮区',
            destinationName: '南京市玄武区',
            totalFeeText: '1000',
            settleTypeDesc: '月结',
            orderStatusDesc: '已回单',
            orderTimeText: new Date().getTime()
          }
        ]
      },
      verifyInfoList: [
        {
          operateTime: '2018-09-27 15:35',
          operatorName: '秦天师',
          calcFee: 10000,
          actualFee: 10000,
          payTypeDesc: '回单付',
          account: '110110110110110',
          bank: '天地银行',
          remark: '太上感应篇'
        },
        {
          operateTime: '2018-09-27 15:35',
          operatorName: '秦天师',
          calcFee: 10000,
          actualFee: 10000,
          payTypeDesc: '回单付',
          account: '110110110110110',
          bank: '天地银行',
          remark: '太上感应篇'
        },
        {
          operateTime: '2018-09-27 15:35',
          operatorName: '秦天师',
          calcFee: 10000,
          actualFee: 10000,
          payTypeDesc: '回单付',
          account: '110110110110110',
          bank: '天地银行',
          remark: '太上感应篇'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([]),
    writtenOffColumn () {
      return [
        {
          title: '订单号',
          key: 'orderNo',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.toDetail(params)
                }
              }
            }, params.row.orderNo)
          }
        },
        {
          title: '始发地',
          key: 'departureName'
        },
        {
          title: '目的地',
          key: 'destinationName'
        },
        {
          title: '合计运费',
          key: 'totalFeeText'
        },
        {
          title: '结算方式',
          key: 'settleTypeDesc'
        },
        {
          title: '订单状态',
          key: 'orderStatusDesc'
        },
        {
          title: '核销时间',
          width: 160,
          key: 'orderTimeText'
        }
      ]
    }
  },
  mounted () {
    // this.metaInfo.title = this.$route.query.title
  },
  methods: {
    ...mapActions([]),
    tabChanged (tab) {
      console.log(tab)
    },
    toDetail () {}
  }
}
</script>
<style lang="stylus" scoped>
  .written-off-detail
    padding 10px 0
    .case-info
      background-color: #E9FCFF
      padding: 20px
      font-size: 14px
      color: #333333
    .data-block
      margin-top: 30px
      .block-title
        height: 45px
        padding-bottom: 15px
        margin-bottom: 30px
        border-bottom: 1px dashed #CBCED3
        line-height: 30px
        font-size: 20px
        color: #333333
        &:before
          content: ''
          display: inline-block
          vertical-align: middle
          height: 20px
          width: 4px
          border-radius: 2px
          background-color: #00A4BD
          margin-right: 15px
          margin-top: -3px
      .block-body
        .total-data
          padding: 15px 18px
          border-style: solid
          border-color: #dcdee2
          border-width: 0 1px 1px 1px
          color: #333333
          font-weight: 12px
        .time-line-dot
          width: 13px
          height: 13px
          border-radius: 50%
          border: 1px solid transparent
          position: absolute
          background-color: #C9CED9
          top: -3px
          left: 13px
        .ivu-timeline-item
          p
            color: #777777
            font-size: 14px
            line-height: 20px
            margin-bottom: 10px
            &.check-date
              margin-bottom: 20px
            span
              color: #333333
          .check-info
            padding-bottom: 20px
            border-bottom: 1px solid #E5E7ED
          &:last-child
            .check-info
              border-bottom: none
</style>
