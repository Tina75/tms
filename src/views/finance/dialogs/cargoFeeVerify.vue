<template>
  <Modal v-model="visiable" :mask-closable="true" width="440" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">核销</p>
    <div class="write-off-form">
      <Form ref="writeOffForm" :model="writeOffForm" :rules="validate" :label-width="100">
        <FormItem v-if="orderNum" label="订单数：">
          <p>{{orderNum}}</p>
        </FormItem>
        <FormItem :label="verifyType === 1 ? '应收货款：' : '应付货款：'">
          <p><span>{{needPay}}</span>元</p>
        </FormItem>
        <FormItem :label="verifyType === 1 ? '实收货款：' : '实付货款：'" prop="actualFee">
          <Input v-model="writeOffForm.actualFee" placeholder="请输入" />
        </FormItem>
        <FormItem label="付款方式：" prop="payType">
          <RadioGroup v-model="writeOffForm.payType">
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
      verifyType: 1,
      orderNum: 0,
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
          { pattern: /^(0|([1-9]\d{0,8}))([.]\d{1,2})?$/, message: '必须为不超过9位的正数，最多精确到两位小数', trigger: 'blur' }
        ],
        payType: { required: true, message: '请选择付款方式', trigger: 'change' },
        account: { type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' },
        bankBranch: { type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' },
        remark: { type: 'string', max: 100, message: '不能超过100个字', trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.writeOffForm.actualFee = this.needPay
  },
  methods: {
    save () {
      this.$refs['writeOffForm'].validate((valid) => {
        if (valid) {
          Server({
            url: '/finance/verify/commonVerify',
            method: 'post',
            data: {
              id: this.id,
              actualFee: parseFloat(this.writeOffForm.actualFee) * 100,
              payType: this.writeOffForm.payType,
              account: this.writeOffForm.account,
              bankBranch: this.writeOffForm.bankBranch,
              remark: this.writeOffForm.remark,
              verifyType: this.verifyType
            }
          }).then(res => {
            console.log(res)
            if (res.data.data === '') {
              this.ok()
              this.close()
            } else if (res.data.data && res.data.data.operateCode === 1) {
              // 存在异常
              console.log(res.data.data.orderNos)
              this.$Toast.warning({
                title: '核销',
                content: '以下单据存在异常，无法核销',
                render: (h) => {
                  const list = res.data.data.orderNos.length > 0 ? res.data.data.orderNos.map(item => {
                    return h('p', item)
                  }) : []
                  console.log(list)
                  return h('div', [
                    ...list
                  ])
                },
                okText: '确认',
                cancelText: '取消'
              })
            }
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
.write-off-form
  /deep/ textarea.ivu-input
    font-size: 12px
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
