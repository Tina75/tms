<!--油卡加油-->
<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="560" @on-visible-change="close">
    <p slot="header" class="modalTitle">{{ title }}</p>
    <Form ref="validate" :model="refuel" :rules="ruleValidate" :label-width="90" label-position="right">
      <FormItem  label="发卡机构：">
        <span>{{issuerToName(refuel.issuer)}}</span>
      </FormItem>
      <FormItem  label="类型：">
        <span>{{typeToName(refuel.type)}}</span>
      </FormItem>
      <FormItem  label="卡号：">
        <span>{{refuel.number}}</span>
      </FormItem>
      <FormItem  label="当前余额：">
        <span class="moneyFormSpan">{{refuel.amount | toPoint}}元</span>
      </FormItem>
      <FormItem  label="加油车辆：" prop="truckNo">
        <SelectInput
          v-model="refuel.truckNo"
          :maxlength="10"
          :remote="false"
          :clearable="true"
          :local-options="ownCars"
          placeholder="请选择车辆"
          style="width: 100%"
          @on-focus="getOwnCars"
        >
        </SelectInput>
      </FormItem>
      <FormItem  label="加油人：" prop="driverName">
        <SelectInput
          v-model="refuel.driverName"
          :maxlength="10"
          :remote="false"
          :clearable="true"
          :local-options="ownDrivers"
          placeholder="请选择或输入司机名称"
          style="width: 100%"
          @on-focus="getOwnDrivers"
        >
        </SelectInput>
      </FormItem>
      <FormItem label="加油金额：" prop="changeAmount">
        <Row>
          <Col span="20">
          <TagNumberInput v-model="refuel.changeAmount" :show-chinese="false" :length="moneyLength" :precision="precision" placeholder="请输入金额"></TagNumberInput>
          </Col>
          <Col span="2" offset="1">
          <span>元</span>
          </Col>
        </Row>
      </FormItem>
      <FormItem  label="加油日期：">
        <DatePicker v-model="refuel.opearteDate" :options="dateOption" transfer format="yyyy-MM-dd" placeholder="请输入加油日期" style="width: 100%"></DatePicker>
      </FormItem>
      <FormItem label="备注:">
        <Input :maxlength="100" v-model="refuel.remark" type="textarea" placeholder="请输入"></Input>
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
import { mapGetters, mapActions } from 'vuex'
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
      refuel: {
        id: '',
        number: '',
        amount: '',
        type: null,
        issuer: null,
        truckNo: '',
        driverName: '',
        changeAmount: null,
        operateDate: '',
        remark: ''
      },
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      ruleValidate: {
        truckNo: { required: true, message: '请输入加油车辆', trigger: 'blur' },
        driverName: { required: true, message: '请输入加油人', trigger: 'blur' },
        changeAmount: { required: true, message: '请输入加油金额', trigger: 'blur' }
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
  computed: {
    ...mapGetters([
      'ownCars',
      'ownDrivers'
    ])
  },
  mounted () {
    console.log(this.refuel)
  },
  methods: {
    ...mapActions([
      'getOwnCars',
      'getOwnDrivers'
    ]),
    save () {
      this.$refs['validate'].validate((valid) => {
        if (valid) {
          this.loading = true
          Server({
            url: '/oilCard/refuel',
            method: 'post',
            data: {
              id: this.refuel.id || '',
              truckNo: this.refuel.type || '',
              driverName: this.refuel.driverName || '',
              changeAmount: this.refuel.changeAmount || '',
              operateDate: this.refuel.operateDate || '',
              remark: this.refuel.remark || ''
            }
          }).then(res => {
            this.loading = false
            this.close()
            this.ok()
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
