<template>
  <Modal v-model="visiable" :mask-closable="false" width="1000" class="cargo-verify-record-dialog" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <div>
      <Title size="14" border="none">收款记录</Title>
      <Form v-for="record in receiptRecords" :key="record.id">
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
            {{transferFee(record.calcFee)}}&nbsp;元
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="实收货款：">
            {{transferFee(record.actualFee)}}&nbsp;元
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <FormItem label="付款方式：">
            {{record.payTypeDesc}}
          </FormItem>
          </Col>
          <Col v-if="record.payType !== 1" span="8">
          <FormItem :label="verifyAccountType[record.payType]">
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

      <Title v-if="isPayment" size="14" border="none">付款记录</Title>
      <Form v-for="record in paymentRecords"   v-if="isPayment" :key="record.id">
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
            {{transferFee(record.calcFee)}}&nbsp;元
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="实付货款：">
            {{transferFee(record.actualFee)}}&nbsp;元
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <FormItem label="付款方式：">
            {{record.payTypeDesc}}
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem  v-if="record.payType !== 1" :label="verifyAccountType[record.payType]">
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
  computed: {
    isPayment () {
      return this.paymentRecords.length > 0
    }
  },
  methods: {
    transferFee (value) {
      if (value) {
        return value / 100
      }
      return value || 0
    },
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

<style lang="stylus">
.cargo-verify-record-dialog
  font-size 14px
  .ivu-form-item-label
    color #777
    font-size 14px
  .ivu-form-item-content
    font-size 14px
</style>
