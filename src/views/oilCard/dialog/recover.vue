<!--回收-->
<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="560" @on-visible-change="close">
    <p slot="header" class="modalTitle">{{ title }}</p>
    <Form ref="validate" :model="recover" :rules="ruleValidate" :label-width="90" label-position="right">
      <FormItem  label="发卡机构：">
        <span>{{issuerToName(recover.issuer)}}</span>
      </FormItem>
      <FormItem  label="类型：">
        <span>{{typeToName(recover.type)}}</span>
      </FormItem>
      <FormItem  label="卡号：">
        <span>{{recover.number}}</span>
      </FormItem>
      <FormItem  label="当前余额：">
        <span class="moneyFormSpan">{{recover.amount | toPoint}}元</span>
      </FormItem>
      <FormItem label="实际金额：" prop="actrualAmount">
        <Row>
          <Col span="20">
          <TagNumberInput v-model="recover.actrualAmount" :length="moneyLength" :show-chinese="false" :precision="precision" placeholder="请输入金额"></TagNumberInput>
          </Col>
          <Col span="2" offset="1">
          <span>元</span>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="退押金：" >
        <Row>
          <Col span="20">
          <TagNumberInput v-model="recover.returnDeposit" :show-chinese="false" :length="moneyLength" :precision="precision" placeholder="请输入金额"></TagNumberInput>
          </Col>
          <Col span="2" offset="1">
          <span>元</span>
          </Col>
        </Row>
      </FormItem>
      <FormItem  label="回收日期：">
        <DatePicker v-model="recover.opearteDate" :options="dateOption" transfer format="yyyy-MM-dd" placeholder="请输入回收日期" style="width: 100%"></DatePicker>
      </FormItem>
      <FormItem label="备注:">
        <Input :maxlength="100" v-model="recover.remark" type="textarea" placeholder="请输入"></Input>
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
      recover: {
        id: '',
        number: '',
        amount: '',
        type: null,
        issuer: null,
        actrualAmount: null,
        returnDeposit: null,
        opearteDate: new Date().Format('yyyy-MM-dd'),
        remark: ''
      },
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      ruleValidate: {
        actrualAmount: [{ required: true, message: '请输入实际金额', trigger: 'change', type: 'number' }]
        // driverName: { required: true, message: '请选择司机', trigger: 'change' },
        // carrierName: { required: true, message: '请输入承运商', trigger: 'change' },
        // driverPhone: [
        //   { required: true, message: '请输入手机号码', trigger: 'blur' },
        //   { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/ }
        // ],
        // truckNo: { type: 'string', message: '车牌号格式错误', pattern: CAR }
      }
    }
  },
  mounted () {
  },
  methods: {
    save () {
      this.$refs['validate'].validate((valid) => {
        if (valid) {
          this.loading = true
          Server({
            url: '/oilCard/recover',
            method: 'post',
            data: {
              id: this.recover.id || undefined,
              actrualAmount: float.round(this.recover.actrualAmount * 100) || undefined,
              returnDeposit: float.round(this.recover.returnDeposit * 100) || undefined,
              opearteDate: this.recover.opearteDate ? this.recover.opearteDate.Format('yyyy-MM-dd') : undefined,
              remark: this.recover.remark || undefined
            }
          }).then(res => {
            this.loading = false
            this.close()
            this.ok()
          }).catch(err => {
            this.loading = false
            console.log(err)
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
