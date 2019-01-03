<!--油卡充值-->
<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="560" @on-visible-change="close">
    <p slot="header" class="modalTitle">{{ title }}</p>
    <Form ref="validate" :model="recharge" :rules="ruleValidate" :label-width="90" label-position="right">
      <FormItem  label="发卡机构：">
        <span>{{issuerToName(recharge.issuer)}}</span>
      </FormItem>
      <FormItem  label="类型：">
        <span>{{typeToName(recharge.type)}}</span>
      </FormItem>
      <FormItem  label="卡主号：">
        <span>{{recharge.primaryCardNumber}}</span>
      </FormItem>
      <FormItem  label="当前余额：">
        <span class="moneyFormSpan">{{recharge.amount | toPoint}}元</span>
      </FormItem>
      <FormItem label="充值金额：" prop="changeAmount">
        <Row>
          <Col span="20">
          <TagNumberInput v-model="recharge.changeAmount"   :length="moneyLength" :precision="precision" placeholder="请输入金额"></TagNumberInput>
          </Col>
          <Col span="2" offset="1">
          <span>元</span>
          </Col>
        </Row>
      </FormItem>
      <FormItem  label="充值日期：" prop="operateDate">
        <DatePicker v-model="recharge.operateDate" :options="dateOption" transfer format="yyyy-MM-dd" placeholder="请输入充值日期" style="width: 100%"></DatePicker>
      </FormItem>
      <FormItem label="备注:">
        <Input :maxlength="100" v-model="recharge.remark" type="textarea" placeholder="请输入"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="footerSty">
      <Button :loading="loading" type="primary" @click="save()">确定</Button>
      <Button style="margin-left: 8px" @click="close()">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
import TagNumberInput from '@/components/TagNumberInput'
import contantmixin from '../mixin/contantmixin'
import SelectInput from '@/components/SelectInput.vue'
import { CARDTYPELIST, ISSUERLIST } from '../constant/enum'
import float from '@/libs/js/float'
export default {
  name: 'recover',
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
      recharge: {
        id: '',
        number: '',
        amount: '',
        type: null,
        issuer: null,
        truckNo: '',
        driverName: '',
        changeAmount: null,
        operateDate: new Date().Format('yyyy-MM-dd'),
        remark: ''
      },
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      ruleValidate: {
        truckNo: { required: true, message: '请输入加油车辆', type: 'string', trigger: 'change' },
        driverName: { required: true, message: '请输入加油人', type: 'string', trigger: 'change' },
        changeAmount: [
          { required: true, message: '请输入充值金额', type: 'number', trigger: 'change' },
          { pattern: /^((0[.]\d{1,2})|(([1-9]\d{0,8})([.]\d{1,2})?))$/, type: 'string', message: '9位正数且最多两位小数', trigger: 'blur' }
        ],
        operateDate: { required: true, message: '请输入充值日期' }
      }
    }
  },
  methods: {
    save () {
      this.$refs['validate'].validate((valid) => {
        if (valid) {
          this.loading = true
          Server({
            url: '/oilCard/recharge',
            method: 'post',
            data: {
              id: this.recharge.id || undefined,
              changeAmount: typeof this.recharge.changeAmount === 'number' ? float.round(this.recharge.changeAmount * 100) : undefined,
              operateDate: this.recharge.operateDate ? this.recharge.operateDate.Format('yyyy-MM-dd') : undefined,
              remark: this.recharge.remark || undefined
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
