<template>
  <Modal :visible="visible">
    <div ref="htmlContent" class="order-detail">
      <Title>客户信息</Title>
      <Row>
        <Col span="6">客户名称：{{data.consignerName}}</Col>
        <Col span="6">要求发货时间： {{data.deliveryTime}}上午</Col>
        <Col span="12">期望到货时间：{{data.arriveTime}} 下午</Col>
      </Row>
      <Row>
        <Col span="6">始发地：{{data.start}}</Col>
        <Col span="6">目的地：{{data.end}}</Col>
        <Col span="6">提货方式：{{data.pickup}}</Col>
        <Col span="6">回单数：{{data.receiptCount}}</Col>
      </Row>
      <Row>
        <Col span="6">发货联系人：{{data.consignerContact}}</Col>
        <Col span="6">联系方式：{{data.consignerPhone}}</Col>
        <Col span="12">发货地址：{{data.consignerAddress}} </Col>
      </Row>
      <Row>
        <Col span="6">收货联系人：{{data.consigneeContact}}</Col>
        <Col span="6">联系方式：{{data.consigneePhone}}</Col>
        <Col span="12">收货地址：{{data.consigneeAddress}}</Col>
      </Row>
      <Row>
        <Col span="18">备注：{{data.remark}}</Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
import Printd from 'printd'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      cssText: `
        .order-detail {
          text-align: center;
          margin: 10px 0;
        }
      `,
      visible: false
    }
  },
  mounted () {
    this.printer = new Printd()
  },
  methods: {
    print () {
      this.visible = true
      this.printer.print(this.$refs.htmlContent, this.cssText)
    }
  }
}
</script>

<style>

</style>
