<template>
  <Modal v-model="visiable" :mask-closable="true" width="440" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">核销</p>
    <div class="write-off-form">
      <Form ref="writeOffForm" :model="writeOffForm" :rules="validate" :label-width="100">
        <FormItem v-if="settleTypeDesc" label="结算方式：">
          <p>{{settleTypeDesc}}</p>
        </FormItem>
        <FormItem label="应收金额：">
          <p><span>{{needPay}}</span>元</p>
        </FormItem>
        <FormItem label="实收金额：" prop="actualFee">
          <Input v-model="writeOffForm.actualFee" placeholder="请输入" />
        </FormItem>
        <FormItem label="付款方式：" prop="payType">
          <p v-if="isOil">油卡</p>
          <RadioGroup v-else v-model="writeOffForm.payType">
            <Radio label="1">现金</Radio>
            <Radio label="2">银行卡</Radio>
            <Radio label="3">微信</Radio>
            <Radio label="4">支付宝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="收款账号：">
          <Input v-model="writeOffForm.account" placeholder="请输入" />
        </FormItem>
        <FormItem label="开户行：">
          <Input v-model="writeOffForm.bankBranch" placeholder="请输入" />
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="writeOffForm.remark" type="textarea" placeholder="请输入" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer" style="text-align:center">
      <Button type="primary" @click="save">确定</Button>
      <Button type="default" @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'

export default {
  name: 'writeOff',
  mixins: [BaseDialog],
  data () {
    return {
      settleTypeDesc: '',
      isOil: false,
      needPay: 0,
      writeOffForm: {
        actualFee: '',
        payType: '',
        account: '',
        bankBranch: '',
        remark: ''
      },
      validate: {
        actualFee: { required: true, message: '请填写实付金额', trigger: 'blur' },
        payType: { required: true, message: '请选择付款方式', trigger: 'change' }
      }
    }
  },
  watch: {
    isOil (val) {
      if (val) {
        this.writeOffForm.payType = '5'
      }
    }
  },
  methods: {
    save () {
      this.$refs['writeOffForm'].validate((valid) => {
        if (valid) {
          Server({
            url: '/finance/verify/verifyOrder',
            method: 'post',
            data: {
              id: this.id,
              actualFee: parseInt(this.writeOffForm.actualFee) * 100,
              payType: this.writeOffForm.payType,
              account: this.writeOffForm.account,
              bankBranch: this.writeOffForm.bankBranch,
              remark: this.writeOffForm.remark,
              verifyType: this.verifyType
            }
          }).then(res => {
            this.ok()
            this.close()
          }).catch(err => console.error(err))
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog-title
  font-size 14px
.dialog-content
  font-size:12px;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:17px;
  background:rgba(249,249,249,1);
  border-radius:8px;
  margin-top 15px
  padding 10px
  li
    margin-left 15px
    line-height 2
.dialog-footer
  text-align center
  margin-top 30px
  color rgba(153,153,153,1);
  a
    font-size 20px
    font-weight 500
    .icon-ico-call
      font-size 22px
</style>
