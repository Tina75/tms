<template>
  <div class="frequent-order-detail">
    <div class="header">
      <Button v-if="hasPower(100402)" type="default" @click="deleteBtn">删除</Button>
      <Button v-if="hasPower(100401)" type="primary" @click="createOrder">再来一单</Button>
    </div>
    <Form :label-width="97" label-position="left">
      <div class="title">
        <span>基本信息</span>
      </div>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="客户名称：">
          {{detail.consignerName | empty}}
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="发货城市：">
          {{detail.startName | empty}}
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="到货城市：">
          {{detail.endName | empty}}
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="提货方式：">
          {{pickupMap[detail.pickup]}}
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="回单数量：">
          {{detail.receiptCount}}
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="对接业务员：">
          {{detail.salesmanName | empty}}
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="代收货款：">
          {{detail.collectionMoney | toPoint('元') }}
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="是否开票：">
          {{detail.isInvoice === 1 ? `是（${rate(detail.invoiceRate)}%）` : '否'}}
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="24">
        <FormItem label="备注：">
          {{detail.remark | empty}}
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
            {{detail.consignerAddress + detail.consignerHourseNumber}}
          </FormItem>
          <FormItem label="收货人单位：" style="visibility: hidden"></FormItem>
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
          <FormItem label="收货地址：">
            {{detail.consigneeAddress + detail.consigneeHourseNumber}}
          </FormItem>
          <FormItem label="收货人单位：">
            {{detail.consigneeCompanyName | empty}}
          </FormItem>
        </Card>
        </Col>
      </Row>
      <div class="title">
        <span>货物明细</span>
      </div>
      <Table :columns="tableColumns" :data="detail.orderCargoTemplateList"></Table>
      <div class="table-footer blod-font">
        <span>合计</span>
        <span></span>
        <span>{{ weightTotal }}</span>
        <span>{{ volumeTotal }}</span>
        <span>{{ cargoCostTotal }}</span>
        <span>{{ quantityTotal }}</span>
      </div>
      <div class="title">
        <span>应收费用</span>
      </div>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="计费里程：">
          <span class="blod-font">{{detail.mileage | mileage('公里')}}</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="运输费用：">
          <span class="blod-font">{{detail.freightFee | toPoint('元') }}</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="提货费用：">
          <span class="blod-font">{{detail.pickupFee | toPoint('元') }}</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="装货费用：">
          <span class="blod-font">{{detail.loadFee | toPoint('元') }}</span>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="卸货费用：">
          <span class="blod-font">{{detail.unloadFee | toPoint('元') }}</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="保险费用：">
          <span class="blod-font">{{detail.insuranceFee | toPoint('元') }}</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="其他费用：">
          <span class="blod-font">{{detail.otherFee | toPoint('元') }}</span>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="12">
        <FormItem label="费用合计：">
          <span class="blod-font totalFee">{{detail.totalFee | toPoint('元') }}</span>
          <span class="blod-font">  （{{settleMap[detail.settlementType]}}）</span>
        </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import '@/libs/js/filter'
import Server from '@/libs/js/server'
import BasePage from '@/basic/BasePage'
import float from '@/libs/js/float'
import settlement from '@/libs/constant/settlement.js'
import { divideFee, NumberPrecesion, divideMileage } from '@/libs/js/config'
import * as CargoInfo from '@/libs/constant/cargoInfoTable'
export default {
  name: 'frequent-order-detail',
  filters: {
    mile: divideMileage
  },
  mixins: [ BasePage ],
  data () {
    return {
      settlement,
      detail: {
        orderCargoTemplateList: []
      },
      tableColumns: [
        CargoInfo.cargoName,
        CargoInfo.cargoNo,
        CargoInfo.weight,
        CargoInfo.volume,
        CargoInfo.cargoCost,
        CargoInfo.quantity,
        CargoInfo.unit,
        CargoInfo.dimension,
        CargoInfo.remark1,
        CargoInfo.remark2
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
    settleMap () {
      const obj = {}
      this.settlement.map(el => {
        obj[el.value] = el.name
      })
      return obj
    },
    // 总货值
    cargoCostTotal () {
      let total = 0
      this.detail.orderCargoTemplateList.map((item) => {
        total += Number(item.cargoCost)
      })
      return divideFee(total) + '元'
    },
    // 总数量
    quantityTotal () {
      let total = 0
      this.detail.orderCargoTemplateList.map((item) => {
        total += Number(item.quantity)
      })
      return total
    },
    // 总体积
    volumeTotal () {
      let total = 0
      this.detail.orderCargoTemplateList.map((item) => {
        total += Number(item.volume)
      })
      return float.round(total, NumberPrecesion.volume) + '方'
    },
    // 总重量
    weightTotal () {
      let total = 0
      this.detail.orderCargoTemplateList.map((item) => {
        total += Number(item.weight)
      })
      return float.round(total, NumberPrecesion.weight) + '吨'
    }
  },
  mounted () {
    this.initDetail()
  },
  methods: {
    initDetail () {
      Server({
        url: 'ordertemplate/detail',
        method: 'post',
        data: {
          id: this.fqOrderId
        }
      }).then((res) => {
        const data = res.data.data
        this.detail = data
        // this.detail = Object.assign(this.detail, data)
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
        path: 'create',
        title: '再来一单',
        query: { createId: this.fqOrderId }
      })
    },
    deleteItem (id) {
      Server({
        url: 'ordertemplate/delete',
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
    line-height 44px
    border-left 1px solid #e8eaec
    border-right 1px solid #e8eaec
    border-bottom 1px solid #e8eaec
    span
      padding-left 10px
      width 10%
      display inline-block
  .blod-font
    font-weight 600
    font-size 14px
    color #333
  .totalFee
    color #00A4BD
    font-size 18px
</style>
<style lang="stylus">
.ivu-tooltip-inner-with-width
  word-break break-all
.frequent-order-detail
  .ivu-form-item-label
  .ivu-form-item-content
    font-size 14px
</style>
