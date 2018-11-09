<template>
  <Modal v-model="visiable" :mask-closable="true" width="440" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">核销</p>
    <div class="write-off-form">
      <Form ref="writeOffForm" :model="writeOffForm" :rules="validate" :label-width="100">
        <FormItem v-if="settleTypeDesc" label="结算方式：">
          <p>{{settleTypeDesc}}</p>
        </FormItem>
        <FormItem :label="scene === 1 ? '应收金额：' : '应付金额：'">
          <p><span class="writeOffFormFee">{{needPay}}</span>元</p>
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
import verifyMixin from '../mixins/verifyMixin.js'
export default {
  name: 'writeOff',
  mixins: [BaseDialog, verifyMixin],
  data () {
    return {
      scene: 0,
      settleTypeDesc: '',
      isOil: false,
      needPay: 0
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
  .writeOffFormFee
    font-size 20px
    color #00A4BD
    font-weight 600
    margin-right 3px
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
