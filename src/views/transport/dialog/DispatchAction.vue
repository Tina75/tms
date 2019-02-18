<template>
  <Modal v-model="show" :mask-closable="false" transfer class="transport-action" width="1032"  @on-visible-change="close">
    <p slot="header" style="text-align:center">
      派车 一单到底
    </p>
    <template v-if="type == 'pickUp'">
      <p class="title">提货信息</p>
      <div class="sub-title">
        <div class="send-label">派车方式：</div>
        <RadioGroup v-model="pickupSendWay">
          <Radio label="2">自送</Radio>
          <Radio label="1">外转</Radio>
        </RadioGroup>
      </div>
      <div>
        <send-carrier-info
          v-if="pickupSendWay === '1'"
          ref="pickupCarrierInfo"
          :carrier-info="pickupCarrierInfo"
          source-type="pickup"></send-carrier-info>
        <own-send-info v-else ref="pickupOwnSendInfo" :form="pickupOwnInfo"></own-send-info>
        <pickup-fee
          ref="pickupFee"
          :payment="pickupPayment"
          :settlement-type="settlementType"
          :settlement-pay-info="pickupSettlementPayInfo"
          :send-way="pickupSendWay"
          :pick-fee-orders="orderList"
          :fee-pass-allocation="allocationStrategy"></pickup-fee>
      </div>
    </template>
    <!-- 提货结束 -->
    <p class="title">送货信息</p>
    <div class="sub-title">
      <div class="send-label">派车方式：</div>
      <RadioGroup v-model="deliverySendWay">
        <Radio label="2">自送</Radio>
        <Radio label="1">外转</Radio>
      </RadioGroup>
    </div>
    <send-carrier-info
      v-if="deliverySendWay === '1'"
      ref="deliveryCarrierInfo"
      :carrier-info="deliveryCarrierInfo"
      source-type="sendCar"></send-carrier-info>
    <own-send-info v-else ref="deliveryOwnSendInfo" :form="deliveryOwnInfo"></own-send-info>
    <send-fee
      ref="sendFee"
      :payment="deliveryPayment"
      :settlement-type="settlementType"
      :settlement-pay-info="deliverySettlementPayInfo"
      :finance-rules-info="financeRulesInfo"
      :send-way="deliverySendWay"
      :send-fee-orders="orderList"
      :fee-pass-allocation="allocationStrategy">
    </send-fee>

    <div slot="footer" style="text-align: center;">
      <Button :loading="btnLoading" type="primary" @click="submit">确定</Button>
      <Button type="default" @click.native="close">取消</Button>
      <Button type="default" style="width: 35px; height: 35px;min-width: 0;padding: 0;vertical-align: top;" @click.native="toSetting">
        <FontIcon type="shezhi" size="20" color="#999"></FontIcon>
      </Button>
    </div>
  </Modal>
</template>

<script>
/**
 * 立即发运 一单到底
 */
import BaseDialog from '@/basic/BaseDialog'
import SendFee from '../components/SendFee'
import SendCarrierInfo from '../components/SendCarrierInfo'
import OwnSendInfo from '../components/ownSendInfo'
import PickupFee from '../components/PickupFee'
import { defaultOwnForm } from '@/components/own-car-form/mixin.js'
import FontIcon from '@/components/FontIcon'
import TMSURL from '@/libs/constant/url'
import { divideMileage } from '@/libs/js/config'
import { mapGetters, mapActions } from 'vuex'
const carrierInfo = {
  assignCarType: 1, // 派车类型，1：外转，2：自送
  carrierName: '',
  driverName: '',
  driverPhone: '',
  carNo: '',
  carType: '',
  carLength: '',
  remark: '',
  carrierWaybillNo: '' // 承运商运单号
}
export default {
  name: 'DispatchAction',
  components: { SendFee, SendCarrierInfo, OwnSendInfo, PickupFee, FontIcon },
  mixins: [ BaseDialog ],

  data () {
    return {
      show: true,
      loading: false,
      financeRulesInfo: {
        start: null,
        end: null,
        weight: null,
        volume: null,
        cargoInfos: null
      },
      pickupSendWay: '1',
      deliverySendWay: '1',

      // 外转赋值给子组件
      pickupCarrierInfo: {
        ...carrierInfo
      },
      deliveryCarrierInfo: {
        ...carrierInfo
      },
      // 自送赋值给子组件
      pickupOwnInfo: {
        assignCarType: 1, // 派车类型，1：外转，2：自送
        ...defaultOwnForm
      },
      deliveryOwnInfo: {
        assignCarType: 1, // 派车类型，1：外转，2：自送
        ...defaultOwnForm
      },
      pickupPayment: {
        freightFee: null,
        loadFee: null,
        unloadFee: null,
        insuranceFee: null,
        otherFee: null
      },
      deliveryPayment: {
        freightFee: null,
        loadFee: null,
        unloadFee: null,
        insuranceFee: null,
        otherFee: null,
        cashBack: null,
        tollFee: null, // 路桥费
        mileage: null, // 计费里程 v1.06 新增
        accommodation: null, // 住宿费 v1.08 新增
        infoFee: null // 信息费 v1.11 新增
      },
      settlementType: '1',

      pickupSettlementPayInfo: [],
      deliverySettlementPayInfo: [{ payType: 2, fuelCardAmount: '', cashAmount: '' }],

      btnLoading: false,
      orderList: [], // 订单list
      allocationStrategy: null // 编辑的时候需要带入的分摊策略，1、按订单数  2、按件数 3、按重量 4、按体积
    }
  },
  computed: {
    ...mapGetters([
      'DispatchSet'
    ])
  },
  created () {
    if (this.DispatchSet.paySettlementAdvanceOption === 1) { // 预付
      this.pickupSettlementPayInfo.push(
        { payType: 1, fuelCardAmount: '', cashAmount: '' }
      )
    }
    if (this.DispatchSet.paySettlementArriveOption === 1) { // 到付
      this.pickupSettlementPayInfo.push(
        { payType: 2, fuelCardAmount: '', cashAmount: '' }
      )
    }
    if (this.DispatchSet.paySettlementReceiptOption === 1) { // 回付
      this.pickupSettlementPayInfo.push(
        { payType: 3, fuelCardAmount: '', cashAmount: '' }
      )
    }
    if (this.DispatchSet.paySettlementTailOption === 1) { // 尾款
      this.pickupSettlementPayInfo.push(
        { payType: 4, fuelCardAmount: '', cashAmount: '' }
      )
    }
    // 受理开单 不请求
    for (let key in this.financeRulesInfo) {
      this.financeRulesInfo[key] = this.orderCreate[key]
    }
    this.deliveryPayment.mileage = divideMileage(this.orderCreate.distance)// 送货计费规则参数同步
  },
  methods: {
    ...mapActions([
      'checkDriverPhone'
    ]),

    submit () {
      this.doImmediately()
    },

    // 送货模块数据校验
    checkSendValidate () {
      const z = this
      let sendFeeComp = z.$refs.sendFee
      let carrierInfoComp = z.$refs.deliveryCarrierInfo
      let ownSendInfo = z.$refs.deliveryOwnSendInfo
      if (z.deliverySendWay === '1' && carrierInfoComp.checkCarrierInfo() && sendFeeComp.validate()) {
        return true
      }
      if (z.deliverySendWay === '2' && ownSendInfo.checkOwnSendInfo() && sendFeeComp.validate()) {
        return true
      }
      return false
    },

    // 提货模块数据校验
    checkPickValidate () {
      const z = this
      let pickFeeComp = z.$refs.pickupFee
      let carrierInfoComp = z.$refs.pickupCarrierInfo
      let ownSendInfo = z.$refs.pickupOwnSendInfo
      if (z.pickupSendWay === '1' && carrierInfoComp.checkCarrierInfo() && pickFeeComp.validate()) {
        return true
      }
      if (z.pickupSendWay === '2' && ownSendInfo.checkOwnSendInfo() && pickFeeComp.validate()) {
        return true
      }
      return false
    },
    pickupInfo () {
      let loadbill = {}
      if (this.pickupSendWay === '1') { // 外转
        loadbill = Object.assign({ assignCarType: this.pickupSendWay }, this.$refs.pickupFee.formatMoney(), this.$refs.pickupCarrierInfo.getCarrierInfo(), {
          settlementType: this.$refs.pickupFee.getSettlementType(),
          settlementPayInfo: this.$refs.pickupFee.getSettlementPayInfo()
        })
      } else if (this.pickupSendWay === '2') { // 自送
        loadbill = Object.assign({ assignCarType: this.pickupSendWay }, this.$refs.pickupFee.formatMoney(), this.$refs.pickupOwnSendInfo.getOwnSendInfo())
      }
      delete loadbill.mileage // 提货去掉里程数
      return loadbill
    },
    deliveryInfo () {
      const z = this
      let waybill = {}
      if (z.deliverySendWay === '1') { // 外转
        waybill = Object.assign({ assignCarType: z.deliverySendWay }, z.$refs.sendFee.formatMoney(), z.$refs.deliveryCarrierInfo.getCarrierInfo(), {
          settlementType: z.$refs.sendFee.getSettlementType(),
          settlementPayInfo: z.$refs.sendFee.getSettlementPayInfo()
        })
      } else if (z.deliverySendWay === '2') { // 自送
        waybill = Object.assign({ assignCarType: z.deliverySendWay }, z.$refs.sendFee.formatMoney(), z.$refs.deliveryOwnSendInfo.getOwnSendInfo())
        delete waybill.cashBack // 自送没有返现
      }
      return waybill
    },
    // 立即发运
    doImmediately () {
      if (this.type === 'pickUp') {
        if (!this.checkPickValidate()) return
        let loadbill = this.pickupInfo()

        if (!this.checkSendValidate()) return
        let waybill = this.deliveryInfo()

        this.complete({ waybill, loadbill })
        this.close()
      } else if (this.type === 'sendCar') {
        if (!this.checkSendValidate()) return
        let waybill = this.deliveryInfo()

        this.complete(waybill)
        this.close()
      }
    },

    // 跳转派车设置页面
    toSetting () {
      this.openTab({
        path: TMSURL.SETTING,
        title: '设置',
        query: {
          tab: 'dispatch'
        }
      })
      this.close()
    }
  }
}

</script>
<style lang='stylus'>
 .transport-action
  .ivu-modal-body
    padding 10px 40px 16px 30px
  .ivu-form
    .ivu-form-item-label
      font-size 14px
      font-family 'PingFangSC-Regular'
      color #777
</style>
<style lang='stylus' scoped>
.sub-title
    font-size 14px
    font-family 'PingFangSC-Medium'
    font-weight 500
    color rgba(51,51,51,1)
    padding 17px 0 18px 0
    .send-label
      display inline-block
      margin-right 20px
      vertical-align middle
    .ivu-radio-group-item
        margin-right 41px
</style>
