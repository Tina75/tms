<template>
  <div class="order-detail">
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
    <Row>
      <Col span="8" offset="16">
      <Button>删除</Button>
      <Button>打印</Button>
      <Button>拆单</Button>
      <Button type="primary">编辑</Button>
      </Col>
    </Row>
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
    <Title>货物明细</Title>
    <Table :columns="goodsColumn"></Table>
    <Title>应收费用</Title>
    <Table :columns="feeColumn"></Table>
    <Title>订单日志</Title>
    <Timeline>
      <TimelineItem>
        <p class="time">1976年</p>
        <p class="content">Apple I 问世</p>
      </TimelineItem>
    </Timeline>
  </div>
</template>

<script>
import Title from '@/components/Title.vue'
export default {
  components: {
    Title
  },
  data () {
    return {
      goodsColumn: [
        {
          title: '货物名称',
          key: 'name'
        },
        {
          title: '包装',
          key: 'packageType'
        },
        {
          title: '数量',
          key: 'number'
        },
        {
          title: '货值(元)',
          key: 'value'
        },
        {
          title: '重量(吨)',
          key: 'weight'
        },
        {
          title: '体积(方)',
          key: 'volume'
        },
        {
          title: '备注1',
          key: 'remark1'
        },
        {
          title: '备注2',
          key: 'remark2'
        }
      ],
      feeColumn: [
        {
          title: '运输费',
          key: 'expressFee'
        },
        {
          title: '提货费',
          key: 'getFee'
        },
        {
          title: '装货费',
          key: 'setupFee'
        },
        {
          title: '卸货费',
          key: 'unsetupFee'
        },
        {
          title: '保险费',
          key: 'secureFee'
        },
        {
          title: '其他',
          key: 'other'
        },
        {
          title: '合计费用',
          key: 'total'
        },
        {
          title: '付款方式',
          key: 'payType'
        }
      ]
    }
  }
}
</script>

<style>

</style>
