<template>
  <Modal v-model="show" :mask-closable="false" class="transport-detail" width="1000"  @on-visible-change="close">
    <p slot="header" style="text-align:center">
      上报异常
    </p>

    <div>
      <Row class="abnormal-header">
        <i-col span="7">
          运单号：Y20180808000002
        </i-col>
        <i-col span="8">
          承运商：南京通服海底捞
        </i-col>
        <i-col span="9">
          车牌号：苏A9087F
        </i-col>
      </Row>
    </div>

    <div class="part">
      <Row class="detail-field-group" style="margin-bottom: 10px">
        <i-col span="7">
          <span class="detail-field-title-sm detail-field-required">异常环节：</span>
          <Select v-model="abnormalTiming" style="width:160px">
            <Option v-for="item in abnormalTimings['3']" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
        <i-col span="7">
          <span class="detail-field-title-sm detail-field-required">异常类型：</span>
          <Select v-model="abnormalTypeCode" style="width:160px">
            <Option v-for="item in abnormalTypeCodes['2']" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
        <i-col span="10">
          <span class="detail-field-title-sm detail-field-required" style="width: 120px;">是否修改运费：</span>
          <RadioGroup v-model="isChangeFee">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </i-col>
      </Row>

      <div class="detail-field-group row-fee">
        <div>
          <span class="detail-field-title-sm detail-field-required">运输费：</span>
          <MoneyInput v-model="payment.freightFee" class="detail-payment-input" />
          <a class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
        </div>
        <div>
          <span class="detail-field-title-sm" style="width: 70px;">装货费：</span>
          <MoneyInput v-model="payment.loadFee" class="detail-payment-input" />
        </div>
        <div>
          <span class="detail-field-title-sm" style="width: 70px;">卸货费：</span>
          <MoneyInput v-model="payment.unloadFee" class="detail-payment-input" />
        </div>
        <div>
          <span class="detail-field-title-sm" style="width: 70px;">保险费：</span>
          <MoneyInput v-model="payment.insuranceFee" class="detail-payment-input" />
        </div>
        <div>
          <span class="detail-field-title-sm">其他费用：</span>
          <MoneyInput v-model="payment.otherFee" class="detail-payment-input" />
        </div>
      </div>

      <Row class="detail-field-group" style="margin-bottom: 10px">
        <i-col span="24">
          <span class="detail-field-title-sm" style="vertical-align: unset;">费用合计：</span>
          <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
        </i-col>
      </Row>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button type="primary" @click="submit">确定</Button>
      <Button type="default" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import MoneyInput from '../components/MoneyInput'
import Server from '@/libs/js/server'
import { ABNORMAL_TIMINGS, ABNORMAL_TYPE_CODES } from '../constant/abnormal.js'

export default {
  name: 'SendCar',
  components: { MoneyInput },
  mixins: [ BaseDialog ],
  data () {
    return {
      show: true,
      loading: false,
      payment: {
        freightFee: 0,
        loadFee: 0,
        unloadFee: 0,
        insuranceFee: 0,
        otherFee: 0
      },
      settlementType: '1',
      settlementPayInfo: [],
      details: {}, // 详情信息
      abnormalTiming: '', // 异常环节编码
      abnormalTimings: ABNORMAL_TIMINGS,
      abnormalTypeCode: '', // 异常类型编码
      abnormalTypeCodes: ABNORMAL_TYPE_CODES,
      isChangeFee: true // 是否修改运费
    }
  },
  computed: {
    // 计算总费用
    paymentTotal () {
      return (Number(this.payment.freightFee) +
      Number(this.payment.loadFee) +
      Number(this.payment.unloadFee) +
      Number(this.payment.insuranceFee) +
      Number(this.payment.otherFee)).toFixed(2)
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 计费规则
    showChargeRules () {
      const self = this
      if (!self.info.carrierName) {
        this.$Message.error('请先选择承运商')
        return
      }
      this.openDialog({
        name: 'dialogs/financeRule',
        data: {
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
        url: '/waybill/details',
        method: 'post',
        data: { waybillId: this.id }
      }).then(res => {
        this.details = res.data.data
        const billInfo = this.details.waybill

        for (let key in this.payment) {
          this.payment[key] = this.setMoneyUnit2Yuan(billInfo[key])
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

    // 提交
    submit () {
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      return typeof money === 'number' ? money / 100 : null
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        if (typeof temp[key] === 'number') temp[key] = temp[key] * 100
      }
      return temp
    }
  }
}

</script>
<style lang='stylus'>
 @import "../style/detail.styl"

  .part
    padding 37px 0 20px 12px
    border-bottom 1px dashed #CBCED3

    &:last-child
      border-style none
      padding-bottom 10px

    .detail-payment-way
      width calc(100% - 100px) !important
    .row-fee
      display flex
      justify-content space-between
      align-items center
      margin-bottom 10px
  .abnormal-header
      font-size 14px
      font-family 'PingFangSC-Regular'
      font-weight 400
      color rgba(47,50,62,1)
      line-height 20px
      padding 13px 20px 40px
      border-bottom 1px dashed #ddd
</style>
