<template>
  <div class="frequent-order-detail">
    <div class="header">
      <Button type="default" @click="deleteBtn">删除</Button>
      <Button type="primary" @click="createOrder">再来一单</Button>
    </div>
    <Form :label-width="85" label-position="left">
      <div class="title">
        <span>基本信息</span>
      </div>
      <Row :gutter="16">
        <Col span="8">
        <FormItem label="客户名称：">
          {{detail.consignerName}}
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="提货方式：">
          {{pickupMap[detail.pickup]}}
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="回单数量：">
          {{detail.receiptCount}}
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8">
        <FormItem label="对接业务员：">
          {{detail.salesmanName}}
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="代收货款：">
          {{detail.collectionMoney | toPoint}}
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="是否开票：">
          {{detail.isInvoice === 1 ? `是（${rate(detail.invoiceRate)}%）` : '否'}}
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="24">
        <FormItem label="备注：">
          {{detail.remark}}
        </FormItem>
        </Col>
      </Row>
      <div class="title">
        <span>收发货信息</span>
      </div>
      <Row :gutter="16">
        <Col span="12">
        <Card>
          <p slot="title" class="card-title">发货人</p>
          <FormItem label="联系人：">
            {{detail.consignerContact}}
          </FormItem>
          <FormItem label="联系方式：">
            {{detail.consignerPhone}}
          </FormItem>
          <FormItem label="发货地址：">
            {{detail.consignerHourseNumber}}
          </FormItem>
        </Card>
        </Col>
        <Col span="12">
        <Card>
          <p slot="title" class="card-title">收货人</p>
          <FormItem label="联系人：">
            {{detail.consigneeContact}}
          </FormItem>
          <FormItem label="联系方式：">
            {{detail.consigneePhone}}
          </FormItem>
          <FormItem label="发货地址：">
            {{detail.consigneeHourseNumber}}
          </FormItem>
        </Card>
        </Col>
      </Row>
      <div class="title">
        <span>货物明细</span>
      </div>
      <Table :columns="tableColumns" :data="detail.orderCargoList"></Table>
      <Row class="table-footer">
        <Col span="3">合计</Col>
        <Col span="3">{{ weightTotal }}</Col>
        <Col span="3">{{ volumeTotal }}</Col>
        <Col span="3">{{ cargoCostTotal }}</Col>
        <Col span="3">{{ quantityTotal }}</Col>
      </Row>
      <div class="title">
        <span>应收费用</span>
      </div>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="计费里程：">
          <span class="blod-font">{{detail.mileage / 1000}}公里</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="运输费用：">
          <span class="blod-font">{{detail.freightFee | toPoint}}元</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="提货费用：">
          <span class="blod-font">{{detail.pickupFee | toPoint}}元</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="装货费用：">
          <span class="blod-font">{{detail.loadFee | toPoint}}元</span>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="卸货费用：">
          <span class="blod-font">{{detail.unloadFee | toPoint}}元</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="保险费用：">
          <span class="blod-font">{{detail.insuranceFee | toPoint}}元</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="其他费用：">
          <span class="blod-font">{{detail.otherFee | toPoint}}元</span>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="费用合计：">
          <span class="blod-font">{{detail.totalFee | toPoint}}元</span>
        </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import Server from '@/libs/js/server'
import BasePage from '@/basic/BasePage'
import float from '@/libs/js/float'
import '@/libs/js/filter'
export default {
  name: 'frequent-order-detail',
  mixins: [ BasePage ],
  data () {
    return {
      detail: {
        orderCargoList: []
      },
      tableColumns: [
        {
          title: '货物名称',
          align: 'center',
          key: 'cargoName'
        },
        {
          title: '重量（吨）',
          align: 'center',
          key: 'unit',
          render: (h, p) => {
            return h('span', p.row.unit || '-')
          }
        },
        {
          title: '体积（方）',
          key: 'quantity',
          align: 'center',
          render: (h, p) => {
            return h('span', p.row.quantity || 0)
          }
        },
        {
          title: '货值（元）',
          key: 'cargoCost',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.cargoCost / 100 || 0)
          }
        },
        {
          title: '包装数量',
          key: 'volume',
          align: 'center',
          render: (h, p) => {
            return h('span', p.row.volume || 0)
          }
        },
        {
          title: '包装方式',
          key: 'volume',
          align: 'center',
          render: (h, p) => {
            return h('span', p.row.volume || 0)
          }
        },
        {
          title: '备注1',
          key: 'remark1',
          align: 'center',
          render: (h, p) => {
            return h('span', p.row.remark1 || '-')
          }
        },
        {
          title: '备注2',
          key: 'remark2',
          align: 'center',
          render: (h, p) => {
            return h('span', p.row.remark2 || '-')
          }
        }
      ]
    }
  },
  computed: {
    fqOrderId () {
      return this.$route.query.id
    },
    pickupMap () {
      return {
        1: '小车上门自提',
        2: '大车直送客户'
      }
    },
    orderTotal () {
      return this.detail.orderCargoList.length
    },
    // 总货值
    cargoCostTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        total += Number(item.cargoCost)
      })
      total /= 100
      return float.round(total) + '元'
    },
    // 总数量
    quantityTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        total += Number(item.quantity)
      })
      return total
    },
    // 总体积
    volumeTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        total += Number(item.volume)
      })
      return float.round(total, 4) + '方'
    },
    // 总重量
    weightTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        // 区分吨或公斤
        if (this.WeightOption === 1) {
          total += Number(item.weight)
        } else {
          total += Number(item.weightKg)
        }
      })
      return float.round(total, 3) + '吨'
    },
    // 总费用
    FeeTotal () {
      let total = 0
      total += this.detail.freightFee
      total += this.detail.loadFee
      total += this.detail.unloadFee
      total += this.detail.insuranceFee
      total += this.detail.otherFee
      return total
    }
  },
  methods: {
    initDetail () {
      Server({
        url: 'http://192.168.1.39:3000/mock/214/order/template/details',
        method: 'post',
        data: {
          templateId: this.fqOrderId
        }
      }).then((res) => {
        const data = res.data.data
        this.detail = Object.assign({}, data)
      })
    },
    deleteBtn () {
      this.$Toast.confirm({
        content: '确认需要删除此常发订单',
        onOk: () => {
          this.deleteItem(this.fqOrderId)
        }
      })
    },
    createOrder () {
      this.openTab({
        path: 'update',
        title: '创建订单',
        query: { id: this.fqOrderId }
      })
    },
    deleteItem (id) {
      Server({
        url: 'http://192.168.1.39:3000/mock/214/order/template/delete',
        method: 'post',
        data: {
          id
        }
      }).then((res) => {
        this.$Message.success('删除成功')
        this.closeTab()
      })
    },
    closeTab () {
      this.ema.fire('closeTab', this.$route)
    },
    rate (value) {
      return float.round(value * 100, 2)
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.$nextTick(() => {
      this.initDetail()
    })
    next()
  }
}
</script>
<style lang="stylus">
.frequent-order-detail
  .header
    text-align right
    button
      margin-left 15px
  .ivu-form-item
    margin-bottom 8px
  .ivu-card-head
    padding 0
    border-bottom none
  .card-title
    padding-left 16px
    font-size 14px
    color #333
    line-height 44px
    height 44px
    font-weight 500
    background #f8f8f9
    border-bottom 1px solid #e8eaec
  .title
    margin-top 20px
    span
      height 34px
      font-size 20px
      font-family 'PingFangSC-Semibold'
      font-weight 600
      color rgba(51,51,51,1)
      line-height 34px
      margin-left 18px
      vertical-align text-bottom
    &:before
      content ' '
      display inline-block
      width 5px
      height 25px
      background rgba(0,164,189,1)
      border-radius 3px
    &:after
      content ' '
      display block
      margin 15px 0
      border-bottom 1px dashed rgba(203,206,211,1)
  .ivu-table-tip
    overflow-y auto
  .table-footer
    text-align center
    line-height 44px
    border-left 1px solid #e8eaec
    border-right 1px solid #e8eaec
    border-bottom 1px solid #e8eaec
  .blod-font
    font-weight 500
    font-size 14px
    color #333
</style>
