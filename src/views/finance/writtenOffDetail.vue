<template>
  <div class="written-off-detail">
    <div class="case-info">
      <Row>
        <Col span="6">
        <p><label>对账批次号：</label><span>{{verifyNo}}</span></p>
        </Col>
        <Col span="8">
        <p><label>日期范围：</label><span>{{dateRange}}</span></p>
        </Col>
        <Col span="6">
        <p><label>{{sceneMap[scene]}}：</label><span>{{partnerName}}</span></p>
        </Col>
      </Row>
    </div>
    <div class="data-block">
      <p class="block-title">{{data[scene]}}明细</p>
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
        reconcileList: [
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
      }
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
    margin -15px
    padding 7px 15px
    border-bottom 15px solid #f5f7f9
    /deep/ .ivu-tabs-bar
      border-bottom none
      margin-bottom 1px
      .ivu-tabs-ink-bar
        bottom 2px
</style>
