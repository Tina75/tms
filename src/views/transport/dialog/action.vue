<template>
  <Modal v-model="show" :mask-closable="false" transfer class="transport-detail" width="1100"  @on-visible-change="close">
    <p slot="header" style="text-align:center">
      {{ type === 'sendCar' ? '派车' : '提货' }}
    </p>

    <div class="part">
      <Row class="detail-field-group">
        <i-col span="7">
          <span class="detail-field-title detail-field-required">承运商：</span>
          <SelectInput ref="carrierInput" v-model="info.carrierName"
                       class="detail-info-input"
                       mode="carrier"
                       @on-select="selectCarrierHandler" />
        </i-col>
        <i-col span="7" offset="1">
          <span class="detail-field-title detail-field-required">司机：</span>
          <SelectInput :carrier-id="carrierId"
                       v-model="info.driverName"
                       class="detail-info-input"
                       mode="driver"
                       @on-select="autoComplete"
                       @on-option-loaded="driverOptionLoaded" />
        </i-col>
        <i-col span="7" offset="1">
          <span class="detail-field-title">司机手机号：</span>
          <Input v-model="info.driverPhone"
                 :maxlength="11"
                 class="detail-info-input" />
        </i-col>
      </Row>

      <Row class="detail-field-group">
        <i-col span="7">
          <span class="detail-field-title detail-field-required">车牌号：</span>
          <SelectInput :carrier-id="carrierId"
                       v-model="info.carNo"
                       class="detail-info-input"
                       mode="carNo"
                       @on-select="autoComplete" />
        </i-col>
        <i-col span="7" offset="1">
          <span class="detail-field-title" style="padding-left: 10px;">车型：</span>
          <Select v-model="info.carType"
                  transfer
                  class="detail-info-input-half"
                  style="margin-right: 12px;">
            <Option v-for="item in carType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="info.carLength"
                  transfer
                  class="detail-info-input-half">
            <Option v-for="item in carLength" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
      </Row>
    </div>

    <Form ref="payment" :label-width="72" :model="payment" :rules="rules" label-position="left">
      <div v-if="type === 'sendCar'" class="part">
        <Row class="detail-field-group">
          <i-col span="6">
            <FormItem label="运输费：" prop="freightFee">
              <TagNumberInput v-model="payment.freightFee" class="detail-payment-input-send"></TagNumberInput>
              <span class="unit-yuan">元</span>
              <a v-if="type === 'sendCar'" class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem label="装货费：" prop="loadFee">
              <TagNumberInput v-model="payment.loadFee" class="detail-payment-input-send"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem label="卸货费：" prop="unloadFee">
              <TagNumberInput v-model="payment.unloadFee" class="detail-payment-input-send"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem label="路桥费：" prop="tollFee">
              <TagNumberInput v-model="payment.tollFee" class="detail-payment-input-send"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="6">
            <FormItem label="保险费：" prop="insuranceFee" class="insurance-fee">
              <TagNumberInput v-model="payment.insuranceFee" class="detail-payment-input-send"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem label="其他费用：" prop="otherFee">
              <TagNumberInput v-model="payment.otherFee" class="detail-payment-input-send"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm" style="vertical-align: unset;margin-left: 10px;">费用合计：</span>
            <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
          </i-col>
        </Row>
      </div>
      <div v-else class="part">
        <Row class="detail-field-group">
          <i-col span="5">
            <FormItem label="运输费：" prop="freightFee">
              <TagNumberInput v-model="payment.freightFee" class="detail-payment-input"></TagNumberInput>
              <span class="unit-yuan">元</span>
              <a v-if="type === 'sendCar'" class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem label="装货费：" prop="loadFee">
              <TagNumberInput v-model="payment.loadFee" class="detail-payment-input"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
          <i-col span="4" offset="1">
            <FormItem label="卸货费：" prop="unloadFee">
              <TagNumberInput v-model="payment.unloadFee" class="detail-payment-input"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
          <i-col span="4" offset="1">
            <FormItem label="保险费：" prop="insuranceFee">
              <TagNumberInput v-model="payment.insuranceFee" class="detail-payment-input"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
          <i-col span="4" offset="1">
            <FormItem label="其他费用：" prop="otherFee">
              <TagNumberInput v-model="payment.otherFee" class="detail-payment-input"></TagNumberInput>
              <span class="unit-yuan">元</span>
            </FormItem>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm" style="vertical-align: unset;">费用合计：</span>
            <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
          </i-col>
        </Row>
      </div>

      <div class="part">
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title detail-field-required">结算方式：</span>
            <div class="detail-payment-way">
              <RadioGroup v-model="settlementType">
                <Radio label="1">按单结</Radio>
                <Radio label="2">月结</Radio>
              </RadioGroup>
              <PayInfo
                v-if="settlementType === '1'"
                ref="$payInfo"
                :loading="loading"
                :total="paymentTotal"
                :data="settlementPayInfo"
                class="detail-field-payinfo"
                mode="edit" />
            </div>
          </i-col>
        </Row>

        <Row v-if="type === 'sendCar'" class="detail-field-group" style="margin-top: 15px;margin-left: 10px;">
          <i-col span="24">
            <FormItem label="返现运费：" prop="cashBack">
              <!-- <span class="detail-field-title" style="padding-left: 10px;">返现运费：</span>
              <MoneyInput v-model="cashBack"
                          class="detail-payment-input"
                          style="width: 180px;"/> -->
              <TagNumberInput v-model="payment.cashBack" class="detail-payment-input" style="width: 180px;"></TagNumberInput>
              <span class="unit-yuan">元</span>
              <Tooltip placement="right" transfer content="返现运费是指在实际运输过程中存在某一段运输没有执行，需要将提前支付的运费返还。" max-width="500">
                <Icon type="ios-alert" size="20" color="#FFBB44" style="margin-left: 14px;"/>
              </Tooltip>
            </FormItem>
          </i-col>
        </Row>
      </div>
    </Form>

    <div slot="footer" style="text-align: center;">
      <Button type="primary" @click="submit">确定</Button>
      <Button type="default" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from '../components/SelectInput.vue'
import SelectInputMixin from '../mixin/selectInputMixin'
import MoneyInput from '../components/MoneyInput'
import TagNumberInput from '@/components/TagNumberInput'
import validator from '@/libs/js/validate'
import PayInfo from '../components/PayInfo'
import Server from '@/libs/js/server'
import { CAR_TYPE, CAR_LENGTH } from '@/libs/constant/carInfo'
import { CAR } from '@/views/client/client'

export default {
  name: 'SendCar',
  components: { SelectInput, MoneyInput, PayInfo, TagNumberInput },
  mixins: [ BaseDialog, SelectInputMixin ],
  data () {
    // 9位整数 2位小数
    const validateFee = (rule, value, callback) => {
      if ((value && validator.fee(value)) || !value) {
        callback()
      } else {
        callback(new Error('费用整数位最多输入9位,小数2位'))
      }
    }
    return {
      show: true,
      loading: false,
      carType: CAR_TYPE,
      carLength: CAR_LENGTH,

      info: {
        carrierName: '',
        driverName: '',
        driverPhone: '',
        carNo: '',
        carType: '',
        carLength: ''
      },
      financeRulesInfo: {
        start: void 0,
        end: void 0,
        weight: void 0,
        volume: void 0
      },
      payment: {
        freightFee: 0,
        loadFee: 0,
        unloadFee: 0,
        insuranceFee: 0,
        otherFee: 0,
        cashBack: 0, // 返现运费
        tollFee: 0 // 路桥费
      },
      rules: {
        // 运输费
        freightFee: [
          { required: true, type: 'number', message: '请输入运输费用' },
          { validator: validateFee }
        ],
        // 装货费用
        loadFee: [
          { validator: validateFee }
        ],
        // 卸货费用
        unloadFee: [
          { validator: validateFee }
        ],
        // 保险费用
        insuranceFee: [
          { validator: validateFee }
        ],
        // 其他费用
        otherFee: [
          { validator: validateFee }
        ],
        // 返现费用
        cashBack: [
          { validator: validateFee }
        ],
        // 路桥费用
        tollFee: [
          { validator: validateFee }
        ]
      },
      settlementType: '1',
      settlementPayInfo: []
    }
  },
  computed: {
    // 计算总费用
    paymentTotal () {
      let total
      total = Number(this.payment.freightFee) +
              Number(this.payment.loadFee) +
              Number(this.payment.unloadFee) +
              Number(this.payment.insuranceFee) +
              Number(this.payment.otherFee)
      if (this.type === 'sendCar') total += Number(this.payment.tollFee)
      return parseFloat(total.toFixed(2))
    }
  },
  created () {
    // 支付信息表格展示内容根据类型改变
    this.settlementPayInfo = this.type === 'sendCar' ? [
      { payType: 1, fuelCardAmount: '', cashAmount: '' },
      { payType: 2, fuelCardAmount: '', cashAmount: '' },
      { payType: 3, fuelCardAmount: '', cashAmount: '' }
    ] : [
      { payType: 2, fuelCardAmount: '', cashAmount: '' }
    ]
    // 受理开单 不请求
    if (this.actionOrigin !== 'orderCreate') {
      this.fetchData()
    } else {
      for (let key in this.payment) {
        this.payment[key] = this.setMoneyUnit2Yuan(this.payment[key])
      }
      if (this.type === 'pickUp') {
        delete this.payment.cashBack // 提货去掉返现运费
        delete this.payment.tollFee // 提货去掉路桥费
      } else {
        this.financeRulesInfo = this.orderCreate // 送货计费规则参数同步
      }
    }
  },
  methods: {
    // 计费规则
    showChargeRules () {
      const self = this
      if (!self.info.carrierName) {
        this.$Message.error('请先选择或输入承运商')
        return
      }
      const carrierItem = this.$refs.carrierInput.options.find(carrier => carrier.carrierName === self.info.carrierName)
      if (!carrierItem) {
        this.$Message.warning('您选择或输入的承运商没有维护的计费规则')
        return
      }
      let carrierId = carrierItem.id
      if (!carrierId) {
        this.$Message.warning('您选择或输入的承运商没有维护的计费规则')
        return
      }
      this.openDialog({
        name: 'dialogs/financeRule',
        data: {
          partnerId: carrierId,
          partnerType: 2,
          partnerName: self.info.carrierName,
          ...self.financeRulesInfo
        },
        methods: {
          // 确认收费规则时获取价格
          ok (charge) {
            self.payment.freightFee = charge || 0
          },
          // 前往设置时关闭当前对话框
          closeParentDialog () {
            self.close()
          }
        }
      })
    },

    // 查询数据
    fetchData () {
      this.loading = true
      Server({
        url: this.type === 'sendCar' ? '/waybill/details' : '/load/bill/details',
        method: 'post',
        data: { [this.type === 'sendCar' ? 'waybillId' : 'pickUpId']: this.id }
      }).then(res => {
        const data = res.data.data
        const billInfo = this.type === 'sendCar' ? data.waybill : data.loadbill

        for (let key in this.info) {
          this.info[key] = billInfo[key] ? billInfo[key] : ''
        }
        if (this.type === 'sendCar') {
          for (let key in this.financeRulesInfo) {
            this.financeRulesInfo[key] = billInfo[key]
          }
        }
        for (let key in this.payment) {
          this.payment[key] = this.setMoneyUnit2Yuan(billInfo[key])
        }

        if (this.type === 'pickUp') {
          delete this.payment.cashBack // 提货去掉返现运费
          delete this.payment.tollFee // 提货去掉路桥费
        }

        this.settlementType = billInfo.settlementType ? billInfo.settlementType.toString() : '1'
        // 将收费信息中的金额单位转为元
        let temp = this.settlementPayInfo.map((item, i) => {
          if (!billInfo.settlementPayInfo[i]) return item
          else {
            const temp = billInfo.settlementPayInfo[i]
            temp.fuelCardAmount = this.setMoneyUnit2Yuan(temp.fuelCardAmount)
            temp.cashAmount = this.setMoneyUnit2Yuan(temp.cashAmount)
            return Object.assign(item, temp)
          }
        })
        this.settlementPayInfo = temp

        this.loading = false
      }).catch(err => console.error(err))
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      // return typeof money === 'number' ? money / 100 : null
      return (typeof money === 'number' && money !== 0) ? money / 100 : null
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        if (typeof temp[key] === 'number') temp[key] = temp[key] * 100
      }
      return temp
    },

    // 提交前数据校验
    validate () {
      if (!this.info.carrierName) {
        this.$Message.error('请输入承运商')
        return false
      }
      if (!this.info.driverName) {
        this.$Message.error('请输入司机')
        return false
      }
      if (this.info.driverPhone && !(/^1\d{10}$/.test(this.info.driverPhone))) {
        this.$Message.error('司机手机号格式不正确')
        return false
      }
      if (!this.info.carNo) {
        this.$Message.error('请输入车牌号')
        return false
      }
      if (!CAR.test(this.info.carNo)) {
        this.$Message.error('请输入正确的车牌号')
        return false
      }
      if (this.settlementType === '1' && !this.$refs.$payInfo.validate()) return false
      return true
    },

    submit () {
      if (!this.validate()) return

      this.$refs.payment.validate((valid) => {
        if (valid) {
          let data = {
            carrierName: this.info.carrierName,
            driverName: this.info.driverName,
            driverPhone: this.info.driverPhone ? this.info.driverPhone : void 0,
            carNo: this.info.carNo,
            carType: this.info.carType ? this.info.carType : void 0,
            carLength: this.info.carLength ? this.info.carLength : void 0,
            ...this.formatMoney(),
            settlementType: this.settlementType,
            settlementPayInfo: this.settlementType === '1' ? this.$refs.$payInfo.getPayInfo() : void 0
          }
          if (this.actionOrigin !== 'orderCreate') {
            let url
            if (this.type === 'sendCar') {
              data.waybillId = this.id || ''
              url = '/waybill/assign/vehicle'
            } else {
              data.pickUpId = this.id || ''
              url = '/load/bill/pick/up'
            }
            Server({
              url,
              method: 'post',
              data
            }).then(res => {
              this.$Message.success('操作成功')
              this.complete()
              this.close()
            }).catch(err => console.error(err))
          } else {
            this.complete(data)
            this.close()
          }
        }
      })
    }
  }
}

</script>
<style lang='stylus'>
 @import "../style/detail.styl"

 .part
   padding 10px 0 20px
   border-bottom 1px dashed #CBCED3

   &:last-child
     border-style none
     padding-bottom 10px

   .ivu-form-item-label
     color #777
     font-size 14px
     padding 10px 0

   .insurance-fee
    .ivu-form-item-label
      padding-left 10px

  .detail-payment-way
    width calc(100% - 100px) !important
</style>
