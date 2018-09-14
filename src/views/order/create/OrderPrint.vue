<template>
  <Modal :visible="visible">
    <div ref="htmlContent" class="order-detail">
      <Alert>
        <Row>
          <Col span="5">
          单号：D20323290293
          </Col>
          <Col span="5">
          客户订单号：D1234334343
          </Col>
          <Col span="5">
          运单号：D34893849843
          </Col>
          <Col span="6">
          状态: 待提货
          </Col>
        </Row>
      </Alert>
      <Title>客户信息</Title>
      <Row>
        <Col span="6">客户名称：南京太古可口可乐</Col>
        <Col span="6">要求发货时间：2018-08-29 上午</Col>
        <Col span="12">期望到货时间：2018-09-01 下午</Col>
      </Row>
      <Row>
        <Col span="6">始发地：江苏省南京市</Col>
        <Col span="6">目的地：安徽省合肥市</Col>
        <Col span="6">提货方式：上门自提</Col>
        <Col span="6">回单数：2</Col>
      </Row>
      <Row>
        <Col span="6">发货联系人：古天乐</Col>
        <Col span="6">联系方式：1333333333</Col>
        <Col span="12">发货地址：江苏省南京市 </Col>
      </Row>
      <Row>
        <Col span="6">收货联系人：张家辉</Col>
        <Col span="6">联系方式：1555555555</Col>
        <Col span="12">收货地址：安徽省合肥市</Col>
      </Row>
      <Row>
        <Col span="18">备注：</Col>
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
