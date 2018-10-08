<template>
  <Modal v-model="visiable" :mask-closable="true" width="1100" @on-visible-change="close">
    <p slot="header" style="text-align:center">
      {{ type === 'sendCar' ? '派车' : '提货' }}
    </p>

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
            @on-select="handleSelectCarrier" />
        </i-col>
        <i-col span="7" offset="1">
          <span class="detail-field-title detail-field-required">司机：</span>
          <SelectInput
            v-model="info.driverName"
            :maxlength="5"
            :remote="false"
            :local-options="carrierDrivers"
            class="detail-info-input"
            @on-select="autoComplete" />
        </i-col>
        <i-col span="7" offset="1">
          <span class="detail-field-title">司机手机号：</span>
          <Input v-model="info.driverPhone"
                 :maxlength="11"
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
            class="detail-info-input"
            @on-select="autoComplete" />
        </i-col>
        <i-col span="7" offset="1">
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
          <a v-if="type === 'sendCar'" class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
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
            <Table  v-if="settlementType === '1'"
                    :columns="tablePayment"
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
import { CAR_TYPE, CAR_LENGTH } from '@/libs/constant/carInfo'
import { CAR } from '@/views/client/client'

export default {
  name: 'SendCar',
  components: { SelectInput, MoneyInput },
  mixins: [ BaseDialog ],
  data () {
    return {
      visiable: true,
      loading: false,
      carType: CAR_TYPE,
      carLength: CAR_LENGTH,
      carriers: [], // 承运商
      carrierDrivers: [], // 司机
      carrierCars: [], // 车辆
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
        otherFee: 0
      },
      settlementType: '1',
      settlementPayInfo: [],
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
                width: '70px'
              },
              on: {
                'on-blur': (money) => {
                  let temp = p.row
                  temp.cashAmount = money
                  this.settlementPayInfo.splice(p.index, 1, temp)
                  // this.checkTotalAmount()
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
                  // this.checkTotalAmount()
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
    }
  },
  created () {
    this.settlementPayInfo = this.type === 'sendCar' ? [
      { payType: 1, fuelCardAmount: 0, cashAmount: 0 },
      { payType: 2, fuelCardAmount: 0, cashAmount: 0 },
      { payType: 3, fuelCardAmount: 0, cashAmount: 0 }
    ] : [
      { payType: 2, fuelCardAmount: 0, cashAmount: 0 }
    ]
    this.fetchData()
    this.getCarriers()
  },
  methods: {
    getCarriers () {
      Server({
        url: '/carrier/listOrderByUpdateTimeDesc',
        method: 'get',
        data: { type: 1 }
      }).then(res => {
        this.carriers = res.data.data.carrierList.map(item => {
          return {
            name: item.carrierName,
            value: item.carrierName,
            payType: item.payType,
            carrierPhone: item.carrierPhone,
            id: item.carrierId
          }
        })
      })
    },

    getCarrierDrivers (carrierId) {
      Server({
        method: 'get',
        url: 'carrier/list/driver',
        params: {
          carrierId
        }
      }).then((res) => {
        this.carrierDrivers = res.data.data.driverList.map(item => {
          return {
            name: item.driverName,
            value: item.driverName,
            driverPhone: item.driverPhone,
            carType: item.carType,
            carLength: item.carLength,
            carNo: item.carNO
          }
        })
      })
    },

    getCarrierCars (carrierId) {
      Server({
        url: '/carrier/list/carOrderByUpdateTimeDesc',
        method: 'get',
        data: { carrierId }
      }).then(res => {
        this.carrierCars = res.data.data.carList.map(item => {
          return {
            name: item.carNO,
            value: item.carNO,
            id: item.carId,
            driverName: item.driverName,
            driverPhone: item.driverPhone,
            carType: item.carType,
            carLength: item.carLength
          }
        })
        if (this.carrierCars.length) {
          this.autoComplete(null, this.carrierCars[0])
          this.info.carNo = this.carrierCars[0].name
        } else {
          this.info.carNo = ''
          const keys = ['driverName', 'driverPhone', 'carType', 'carLength', 'carNo']
          keys.forEach(key => {
            this.info[key] = ''
          })
        }
      })
    },

    handleSelectCarrier (name, row) {
      this.getCarrierDrivers(row.id)
      this.getCarrierCars(row.id)
    },

    autoComplete (name, row) {
      const keys = ['driverName', 'driverPhone', 'carType', 'carLength', 'carNo']
      keys.forEach(key => {
        this.info[key] = row[key]
      })
    },

    showChargeRules () {
      const self = this
      this.openDialog({
        name: 'dialogs/financeRule',
        data: {
          partnerType: 2,
          ...self.financeRulesInfo
        },
        methods: {
          ok (charge) {
            self.payment.freightFee = charge || 0
          },
          cancel () {
            self.close()
          }
        }
      })
    },

    checkTotalAmount () {
      let total = 0
      this.settlementPayInfo.forEach(item => {
        total = total + Number(item.cashAmount) + Number(item.fuelCardAmount)
      })
      if (total !== Number(this.paymentTotal) && total !== 0) {
        this.$Message.error('结算总额应与费用合计相等')
        return false
      }
      return true
    },

    fetchData () {
      this.loading = true
      Server({
        url: this.type === 'sendCar' ? '/waybill/details' : '/load/bill/details',
        method: 'post',
        data: this.type === 'sendCar' ? { waybillId: this.id } : {
          pickUpId: this.id
        }
      }).then(res => {
        const data = res.data.data
        const billInfo = this.type === 'sendCar' ? data.waybill : data.loadbill

        for (let key in this.info) {
          this.info[key] = billInfo[key]
        }
        if (this.type === 'sendCar') {
          for (let key in this.financeRulesInfo) {
            this.financeRulesInfo[key] = billInfo[key]
          }
        }
        for (let key in this.payment) {
          this.payment[key] = this.setMoneyUnit2Yuan(billInfo[key])
        }

        this.settlementType = billInfo.settlementType ? billInfo.settlementType.toString() : '1'
        const settlementPayInfo = billInfo.settlementPayInfo
        let temp = this.settlementPayInfo.map((item, i) => {
          if (!settlementPayInfo[i]) return item
          else {
            const temp = settlementPayInfo[i]
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
      return money ? money / 100 : 0
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        temp[key] = Number(temp[key]) * 100
      }
      return temp
    },
    // 格式化计费方式金额单位为分
    formatPayInfo () {
      // if (this.settlementType !== '1') return
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
      if (!this.payment.freightFee) {
        this.$Message.error('请输入运输费')
        return false
      }
      if (this.settlementType === '1' && !this.checkTotalAmount()) return false
      return true
    },

    sendCar () {
      if (!this.validate()) return

      let data = {
        carrierName: this.info.carrierName,
        driverName: this.info.driverName,
        driverPhone: this.info.driverPhone ? this.info.driverPhone : void 0,
        carNo: this.info.carNo,
        carType: this.info.carType ? this.info.carType : void 0,
        carLength: this.info.carLength ? this.info.carLength : void 0,
        ...this.formatMoney(),
        settlementType: this.settlementType,
        settlementPayInfo: this.formatPayInfo()
      }
      let url
      if (this.type === 'sendCar') {
        data.waybillId = this.id
        url = '/waybill/assign/vehicle'
      } else {
        data.pickUpId = this.id
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

  .detail-field-title-sm
    width 75px
  .detail-payment-input
    width 100px
</style>
