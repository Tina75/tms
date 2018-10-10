<template>
  <Modal v-model="visiable" :mask-closable="true" width="440" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">核销</p>
    <div class="write-off-form">
      <Form ref="writeOffForm" :model="writeOffForm" :rules="validate" :label-width="100">
        <FormItem v-if="settleTypeDesc" label="结算方式：">
          <p>{{settleTypeDesc}}</p>
        </FormItem>
        <FormItem :label="scene === 1 ? '应收金额：' : '应付金额：'">
          <p><span>{{needPay}}</span>元</p>
        </FormItem>
        <FormItem :label="scene === 1 ? '实收金额：' : '实付金额：'" prop="actualFee">
          <Input v-model="writeOffForm.actualFee" placeholder="请输入" />
        </FormItem>
        <FormItem label="付款方式：" prop="payType">
          <p v-if="isOil">油卡</p>
          <RadioGroup v-else v-model="writeOffForm.payType">
            <Radio v-for="(value, key) in payTypeMap" :key="key" :label="key">{{value}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="writeOffForm.payType !== '1'" :label="accountMap[writeOffForm.payType]" prop="account">
          <Input v-model="writeOffForm.account" placeholder="请输入" />
        </FormItem>
        <FormItem v-if="writeOffForm.payType === '2'" label="开户行：" prop="bankBranch">
          <Input v-model="writeOffForm.bankBranch" placeholder="请输入" />
        </FormItem>
        <FormItem label="备注：" prop="remark">
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
      scene: 0,
      settleTypeDesc: '',
      isOil: false,
      needPay: 0,
      payTypeMap: {
        1: '现金',
        2: '银行卡',
        3: '微信',
        4: '支付宝'
      },
      accountMap: {
        2: '银行卡卡号：',
        3: '微信号：',
        4: '支付宝账号：',
        5: '油卡卡号：'
      },
      writeOffForm: {
        actualFee: '',
        payType: '2',
        account: '',
        bankBranch: '',
        remark: ''
      },
      validate: {
        actualFee: [
          { required: true, message: '请填写金额', trigger: 'blur' },
          { pattern: /^[1-9]\d*(.\d{2})?$/, message: '必须为大于0的数，最多精确到两位小数', trigger: 'blur'}
        ],
        payType: { required: true, message: '请选择付款方式', trigger: 'change' },
        account: {type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur'},
        bankBranch: {type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur'},
        remark: {type: 'string', max: 100, message: '不能超过100个字', trigger: 'blur'}
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
  mounted () {
    if (this.isOil) {
      this.writeOffForm.payType = '5'
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
