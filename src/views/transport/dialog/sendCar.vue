<template>
  <Modal v-model="visiable" :mask-closable="true" width="1100" @on-visible-change="close">
    <p slot="header" style="text-align:center">派车</p>

    <div class="part">
      <Row class="detail-field-group">
        <i-col span="7">
          <span class="detail-field-title detail-field-required">承运商：</span>
          <SelectInput
            v-model="info.carrierName"
            :maxlength="20"
            :remote="false"
            :local-options="carriers"
            class="detail-info-input"
            @on-focus.once="getCarriers"
            @on-select="handleSelectCarrier" />
        </i-col>
        <i-col span="7" offset="1">
          <span class="detail-field-title detail-field-required">司机：</span>
          <SelectInput
            v-model="info.driverName"
            :maxlength="5"
            :remote="false"
            :local-options="carrierDrivers"
            class="detail-info-input" />
        </i-col>
        <i-col span="7" offset="1">
          <span class="detail-field-title">司机手机号：</span>
          <Input v-model="info.driverPhone"
                 class="detail-info-input"></Input>
        </i-col>
      </Row>

      <Row class="detail-field-group">
        <i-col span="7">
          <span class="detail-field-title detail-field-required">车牌号：</span>
          <SelectInput
            v-model="info.carNo"
            :maxlength="8"
            :remote="false"
            :local-options="carrierCars"
            class="detail-info-input" />
        </i-col>
        <i-col span="8" offset="1">
          <span class="detail-field-title">车型：</span>
          <Select v-model="info.carType"
                  class="detail-info-input-half"
                  style="margin-right: 12px;">
            <Option v-for="item in carType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="info.carLength"
                  class="detail-info-input-half">
            <Option v-for="item in carLength" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
      </Row>
    </div>

    <div class="part">
      <Row class="detail-field-group">
        <i-col span="5">
          <span class="detail-field-title-sm detail-field-required">运输费：</span>
          <MoneyInput v-model="payment.freightFee"
                      class="detail-payment-input" />
          <a class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
        </i-col>
        <i-col span="4">
          <span class="detail-field-title-sm">装货费：</span>
          <MoneyInput v-model="payment.loadFee"
                      class="detail-payment-input" />
        </i-col>
        <i-col span="4" offset="1">
          <span class="detail-field-title-sm">卸货费：</span>
          <MoneyInput v-model="payment.unloadFee"
                      class="detail-payment-input" />
        </i-col>
        <i-col span="4" offset="1">
          <span class="detail-field-title-sm">保险费：</span>
          <MoneyInput v-model="payment.insuranceFee"
                      class="detail-payment-input" />
        </i-col>
        <i-col span="4" offset="1">
          <span class="detail-field-title-sm">其他：</span>
          <MoneyInput v-model="payment.otherFee"
                      class="detail-payment-input" />
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
          <span class="detail-field-title-sm detail-field-required">结算方式：</span>
          <div class="detail-payment-way">
            <RadioGroup v-model="settlementType">
              <Radio label="1">按单结</Radio>
              <Radio label="2">月结</Radio>
            </RadioGroup>
            <Table  :columns="tablePayment"
                    :data="settlementPayInfo"
                    :loading="loading"
                    width="350"></Table>
          </div>
        </i-col>
      </Row>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="sendCar">确定</Button>
      <Button  type="default"  @click.native="visiable = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
import SelectInput from '@/components/SelectInput.vue'
import MoneyInput from '../components/moneyInput'
import CarConfigs from '../detail/carConfigs.json'
import { mapGetters, mapActions } from 'vuex'
import { CAR } from '@/views/client/client'

const carType = CarConfigs.carType
const carLength = CarConfigs.carLength

export default {
  name: 'SendCar',
  components: { SelectInput, MoneyInput },
  mixins: [ BaseDialog ],
  data () {
    return {
      visiable: true,
      loading: false,
      carType,
      carLength,
      info: {
        carrierName: '',
        driverName: '',
        driverPhone: '',
        carNo: '',
        carType: '',
        carLength: ''
      },
      payment: {
        freightFee: 0,
        loadFee: 0,
        unloadFee: 0,
        insuranceFee: 0,
        otherFee: 0
      },
      settlementType: '1',
      settlementPayInfo: [
        { payType: 1, fuelCardAmount: 0, cashAmount: 0 },
        { payType: 2, fuelCardAmount: 0, cashAmount: 0 },
        { payType: 3, fuelCardAmount: 0, cashAmount: 0 }
      ],
      // 支付方式表格
      tablePayment: [
        {
          title: '付款方式',
          key: 'payType',
          align: 'center',
          width: 100,
          render: (h, p) => {
            let type
            if (p.row.payType === 1) type = '预付'
            if (p.row.payType === 2) type = '到付'
            if (p.row.payType === 3) type = '回付'
            return h('span', {
              style: { fontWeight: 'bolder' }
            }, type)
          }
        },
        {
          title: '现金',
          key: 'cashAmount',
          render: (h, p) => {
            return h(MoneyInput, {
              props: {
                value: p.row.cashAmount,
                placeholder: '请输入',
                suffix: false
              },
              style: {
                width: '60px'
              },
              on: {
                'on-blur': (money) => {
                  let temp = p.row
                  temp.cashAmount = money
                  this.settlementPayInfo.splice(p.index, 1, temp)
                  this.checkTotalAmount()
                }
              }
            })
          }
        },
        {
          title: '油卡',
          key: 'fuelCardAmount',
          render: (h, p) => {
            return h(MoneyInput, {
              props: {
                value: p.row.fuelCardAmount,
                placeholder: '请输入',
                suffix: false
              },
              style: {
                width: '60px'
              },
              on: {
                'on-blur': (money) => {
                  let temp = p.row
                  temp.fuelCardAmount = money
                  this.settlementPayInfo.splice(p.index, 1, temp)
                  this.checkTotalAmount()
                }
              }
            })
          }
        }
      ]
    }
  },
  computed: {
    paymentTotal () {
      return (Number(this.payment.freightFee) +
      Number(this.payment.loadFee) +
      Number(this.payment.unloadFee) +
      Number(this.payment.insuranceFee) +
      Number(this.payment.otherFee)).toFixed(2)
    },
    ...mapGetters([
      'carriers',
      'carrierCars',
      'carrierDrivers'
    ])
  },
  created () {
    this.fetchData()
  },
  methods: {
    ...mapActions([
      'getCarriers'
    ]),
    handleSelectCarrier (name, row) {
      console.log(name, row)
      this.$store.dispatch('getCarrierCars', row.id)
      this.$store.dispatch('getCarrierDrivers', row.id)
    },

    showChargeRules () {
      const self = this
      self.openDialog({
        name: 'order/create/CounterDialog.vue',
        data: {
          value: 0
        },
        methods: {
          ok (charge) {
            self.payment.freightFee = charge || 0
          }
        }
      })
    },

    checkTotalAmount () {
      let total = 0
      this.settlementPayInfo.forEach(item => {
        total = total + Number(item.cashAmount) + Number(item.fuelCardAmount)
      })
      if (total > Number(this.paymentTotal)) {
        this.$Message.error('结算总额不能超过费用合计')
        return false
      }
      return true
    },

    fetchData () {
      this.loading = true
      Server({
        url: '/waybill/details',
        method: 'post',
        data: { waybillId: this.id }
      }).then(res => {
        const data = res.data.data

        for (let key in this.info) {
          this.info[key] = data.waybill[key]
        }
        for (let key in this.payment) {
          this.payment[key] = data.waybill[key]
        }

        this.settlementType = data.waybill.settlementType ? data.waybill.settlementType.toString() : '1'
        const settlementPayInfo = data.waybill.settlementPayInfo
        let temp = this.settlementPayInfo.map((item, i) => {
          if (!settlementPayInfo[i]) return item
          return Object.assign(item, settlementPayInfo[i])
        })
        this.settlementPayInfo = temp

        this.loading = false
      }).catch(err => console.error(err))
    },

    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        temp[key] = Number(temp[key]) * 100
      }
      return temp
    },
    formatPayInfo () {
      return this.settlementPayInfo.map(item => {
        return {
          payType: item.payType,
          fuelCardAmount: Number(item.fuelCardAmount) * 100,
          cashAmount: Number(item.cashAmount) * 100
        }
      })
    },

    validate () {
      if (!this.info.carrierName) {
        this.$Message.error('请输入承运商')
        return false
      }
      if (!this.info.driverName) {
        this.$Message.error('请输入司机')
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
      if (!this.payment.freightFee) {
        this.$Message.error('请输入运输费')
        return false
      }
      if (!this.checkTotalAmount) return false
      return true
    },

    sendCar () {
      if (!this.validate()) return

      Server({
        url: '/waybill/assign/vehicle',
        method: 'post',
        data: {
          waybillId: this.id,
          ...this.info,
          ...this.formatMoney(),
          settlementType: this.settlementType,
          settlementPayInfo: this.formatPayInfo()
        }
      }).then(res => {
        this.$Message.success('操作成功')
        this.complete()
        this.close()
      }).catch(err => console.error(err))
    }
  }
}

</script>
<style lang='stylus' scoped>
 @import "../detail/detail.styl"

 .part
   padding 10px 0 20px
   border-bottom 1px dashed #CBCED3

   &:last-child
     border-style none
     padding-bottom 10px

  .detail-payment-input
    width 80px
</style>
