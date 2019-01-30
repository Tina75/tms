<template>
  <div class="written-off-detail">
    <div class="case-info">
      <Row>
        <Col span="6">
        <p><label>核销单号：</label><span>{{$route.query.verifyNo}}</span></p>
        </Col>
        <Col span="8">
        <p><label>对账批次号：</label><span>{{writtenOffData.orderNo}}</span></p>
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
            <p>总运费：{{writtenOffData.totalFeeText}}</p>
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
            <p class="check-date">{{item.createTime|datetime}}</p>
            <div class="check-info">
              <Row>
                <Col span="3">
                <p>核销人：<span>{{item.operatorName}}</span></p>
                </Col>
                <Col span="3">
                <p>应付金额：<span>{{item.calcFee|toPoint}}</span></p>
                </Col>
                <Col span="3">
                <p>实付金额：<span>{{item.actualFee|toPoint}}</span></p>
                </Col>
                <Col span="3">
                <p>付款方式：<span>{{item.payTypeDesc}}</span></p>
                </Col>
                <Col v-if="item.payType !== 1" span="8">
                <p>{{accountMap[item.payType]}}<span>{{item.account}}</span></p>
                </Col>
                <Col v-if="item.payType === 2" span="4">
                <p>开户行：<span>{{item.bank}}</span></p>
                </Col>
              </Row>
              <Row>
                <Col span="24">
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
import Server from '@/libs/js/server'
import '@/libs/js/filter'
// import Vue from 'vue'
import { getFeeText } from '@/libs/js/config'

/**
 *金额格式化
 */
// Vue.filter('moneyFormat', function (value) {
//   return value ? (value / 100).toFixed(2) : '0'
// })

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
      orderNameMap: {
        1: '订单号',
        2: '运单号/提货单号',
        3: '外转单号'
      },
      accountMap: {
        2: '银行卡卡号：',
        3: '微信号：',
        4: '支付宝账号：',
        5: '油卡卡号：'
      },
      active: '1',
      writtenOffData: {
        orderNum: 0,
        orderNo: '',
        totalFeeText: 0,
        list: []
      },
      verifyInfoList: []
    }
  },
  computed: {
    writtenOffColumn () {
      return [
        {
          title: '订单号',
          width: 160,
          key: 'orderNo',
          renderHeader: (h) => {
            return h('span', {}, this.orderNameMap[this.$route.query.scene])
          },
          render: (h, params) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
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
  beforeRouteUpdate (to, from, next) {
    this.$nextTick(() => {
      this.getDetail()
    })
    next()
  },
  mounted () {
    // this.metaInfo.title = this.sceneMap[this.scene] + '对账'
    this.getDetail()
  },
  methods: {
    getDetail () {
      Server({
        url: '/finance/verify/detail',
        method: 'get',
        params: {
          verifyId: this.$route.query.verifyId
        }
      }).then(res => {
        this.writtenOffData.orderNum = res.data.data.orderNum
        this.writtenOffData.orderNo = res.data.data.orderNo
        this.writtenOffData.totalFeeText = getFeeText(res.data.data.totalFee)
        this.writtenOffData.list = res.data.data.orderList.map(item => {
          return Object.assign({}, item, {
            totalFeeText: getFeeText(item.totalFee),
            orderTimeText: new Date(item.orderTime).Format('yyyy-MM-dd hh:mm')
          })
        })
        this.verifyInfoList = res.data.data.verifyInfoList
      }).catch()
    },
    tabChanged (tab) {
    },
    toDetail (data) {
      switch (data.row.orderType) {
        case 1:
          this.openTab({
            path: '/order-management/order-detail',
            title: data.row.orderNo,
            query: {
              id: data.row.orderNo,
              orderId: data.row.orderId,
              from: 'order'
            }
          })
          break
        case 2:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailFreight',
            query: { id: data.row.orderId } // id 或 no 二选一
          })
          break
        case 3:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailPickup',
            query: { id: data.row.orderId }
          })
          break
        case 4:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailOuter',
            query: { id: data.row.orderId }
          })
          break
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .written-off-detail
    padding 10px 0
    .case-info
      background-color: #E5FFF3
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
          font-size: 12px
          font-weight: bold
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
