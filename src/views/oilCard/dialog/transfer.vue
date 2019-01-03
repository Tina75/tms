<!--转账-->
<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="560" @on-visible-change="close">
    <p slot="header" class="modalTitle">{{ title }}</p>
    <Form ref="validate" :model="transfer" :rules="ruleValidate" :label-width="90" label-position="right">
      <FormItem  label="发卡机构：">
        <span>{{issuerToName(transfer.issuer)}}</span>
      </FormItem>
      <FormItem  label="类型：">
        <span>{{typeToName(transfer.type)}}</span>
      </FormItem>
      <FormItem  label="卡号：">
        <!--类型为主卡-->
        <span v-if = "transfer.type === 1">{{transfer.primaryCardNumber}}</span>
        <!--类型为副卡-->
        <span v-if = "transfer.type === 2">{{transfer.number}}</span>
      </FormItem>
      <FormItem  label="当前余额：">
        <span class="moneyFormSpan">{{transfer.amount | toPoint}}元</span>
      </FormItem>
      <!--类型为主卡-->
      <FormItem v-if="transfer.type===1" label="转入卡号：" prop="toCardId">
        <Select  v-model="transfer.toCardId" placeholder="请选择卡号">
          <Option v-for="(item,index) in SecondaryCardList"
                  :value="item.id"  :key="index" :disabled="item.status === 3">{{ item.number }}</Option>
        </Select>
      </FormItem>
      <!--类型为副卡-->
      <FormItem v-if = "transfer.type === 2" label="转入主卡：">
        <span >{{transfer.primaryCardNumber}}</span>
      </FormItem>
      <FormItem label="转出金额：" prop="changeAmount">
        <Row>
          <Col span="20">
          <TagNumberInput v-model="transfer.changeAmount"  :length="moneyLength" :precision="precision" placeholder="请输入金额"></TagNumberInput>
          </Col>
          <Col span="2" offset="1">
          <span>元</span>
          </Col>
        </Row>
      </FormItem>
      <FormItem  label="转账日期：" prop="operateDate">
        <DatePicker v-model="transfer.operateDate" :options="dateOption" transfer format="yyyy-MM-dd" placeholder="请输入转账日期" style="width: 100%"></DatePicker>
      </FormItem>
      <FormItem label="备注:">
        <Input :maxlength="100" v-model="transfer.remark" type="textarea" placeholder="请输入备注"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="footerSty">
      <Button :loading="loading" type="primary" @click="save()">确定</Button>
      <Button style="margin-left: 8px" @click="close()">取消</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
import TagNumberInput from '@/components/TagNumberInput'
import contantmixin from '../mixin/contantmixin'
import SelectInput from '@/components/SelectInput.vue'
import { CARDTYPELIST, ISSUERLIST } from '../constant/enum'
import float from '@/libs/js/float'
export default {
  name: 'transfer',
  components: {
    SelectInput,
    TagNumberInput
  },
  mixins: [BaseDialog, contantmixin],
  data () {
    return {
      cardTypeList: CARDTYPELIST,
      issuerList: ISSUERLIST,
      loading: false,
      precision: 2,
      moneyLength: 9,
      transfer: {
        id: '',
        number: '',
        amount: '',
        type: null,
        issuer: null,
        primaryCardNumber: '',
        remark: '',
        toCardId: null,
        changeAmount: null,
        operateDate: new Date().Format('yyyy-MM-dd'),
        primaryCardId: ''
      },
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      SecondaryCardList: [], // 主卡下关联的副卡
      ruleValidate: {
        toCardId: [{ required: true, message: '请选择主卡下面的副卡', trigger: 'change', type: 'number' }],
        changeAmount: [
          { required: true, message: '请输入转出金额', trigger: 'change', type: 'number' },
          { pattern: /^((0[.]\d{1,2})|(([1-9]\d{0,8})([.]\d{1,2})?))$/, type: 'string', message: '9位正数且最多两位小数', trigger: 'blur' }
        ],
        operateDate: { required: true, message: '请输入转账日期' }
      }
    }
  },
  mounted () {
    if (this.transfer.type === 1) {
      this.getSecondaryCardList()
    }
  },
  methods: {
    save () {
      this.$refs['validate'].validate((valid) => {
        if (valid) {
          this.loading = true
          Server({
            url: '/oilCard/transfer',
            method: 'post',
            data: {
              id: this.transfer.id || undefined,
              toCardId: (this.transfer.type === 1) ? this.transfer.toCardId : this.transfer.primaryCardId,
              changeAmount: typeof this.transfer.changeAmount === 'number' ? float.round(this.transfer.changeAmount * 100) : undefined,
              operateDate: this.transfer.operateDate ? this.transfer.operateDate.Format('yyyy-MM-dd') : undefined,
              remark: this.transfer.remark || undefined
            }
          }).then(res => {
            this.loading = false
            this.close()
            this.ok()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 获取主卡下关联的副卡
    getSecondaryCardList () {
      Server({
        url: '/oilCard/getSecondaryCardList',
        method: 'get',
        params: {
          id: this.transfer.id || null
        }
      }).then(res => {
        this.SecondaryCardList = res.data.data.list
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
  .modalTitle
    text-align center
    font-weight bold
    font-size 14px
  .radioSty
    margin-left 35px
  .moneyFormSpan
    font-size 14px
    color #00A4BD
    font-weight 500
</style>
