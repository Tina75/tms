<template>
  <Modal v-model="visiable" :mask-closable="false" width="1000" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <div>
      <Title size="14" border="none">收款记录</Title>
      <Form v-for="(record, index) in receiptRecords" :key="index">
        <Row>
          <Col span="6">
          <FormItem label="核销时间：">
            {{record.createTime | datetime}}
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="核销人：">
            {{record.operateUserName}}
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="应收货款：">
            {{record.calcFee}}&nbsp;元
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="实收货款：">
            {{record.actualFee}}&nbsp;元
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <FormItem label="付款方式：">
            {{record.payTypeDesc}}
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem :label="verifyAccountType[2]">
            {{record.account}}
          </FormItem>
          </Col>
          <Col v-if="record.payType === 2" span="8">
          <FormItem label="开户行：">
            {{record.bankBranch}}
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="备注：">
            {{record.remark}}
          </FormItem>
          </Col>
        </Row>
      </Form>

      <Title size="14" border="none">付款记录</Title>
      <Form  v-for="(record, index) in paymentRecords" :key="index">
        <Row>
          <Col span="6">
          <FormItem label="核销时间：">
            {{record.createTime | datetime}}
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="核销人：">
            {{record.operateUserName}}
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="应付货款：">
            {{record.calcFee}}&nbsp;元
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="实付货款：">
            {{record.actualFee}}&nbsp;元
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <FormItem label="付款方式：">
            {{record.payTypeDesc}}
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem :label="verifyAccountType[2]">
            {{record.account}}
          </FormItem>
          </Col>
          <Col v-if="record.payType === 2" span="8">
          <FormItem label="开户行：">
            {{record.bankBranch}}
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="备注：">
            {{record.remark}}
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
/**
 * 代收货款-已付款记录详情
 */
import BaseDialog from '@/basic/BaseDialog'
import Title from '@/components/Title'
import { verifyPayType, verifyAccountType } from '../mixins/verifyMixin.js'
export default {
  name: 'cargo-fee-record',
  components: {
    BaseDialog,
    Title
  },
  mixins: [BaseDialog],
  data () {
    return {
      verifyPayType,
      verifyAccountType,
      receiptRecords: [],
      paymentRecords: []
    }
  },
  methods: {
    save () {
      this.$refs['info'].validate((valid) => {
        console.log(this.code)
        if (valid) {
          // Server({
          //   url: 'user/update',
          //   method: 'post',
          //   data: this.info
          // }).then(() => {
          this.ok()
          // this.close()
          // })
        }
      })
    }
  }
}
</script>

<style>

</style>
