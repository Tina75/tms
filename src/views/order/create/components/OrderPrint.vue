<template>
  <Modal v-model="visible" transfer @on-cancel="visible=false">
    <div ref="htmlContent" class="order-detail">
      <div v-for="(data, index) in list" :key="index">
        <h3 class="van-center i-mb-10">{{data.consignerName}}公司托运单</h3>
        <table cellspacing="0" cellpadding="10" border="0" style="width:100%">
          <colgroup>
            <col width="160" />
            <col width="240" />
            <col width="240" />
          </colgroup>
          <tbody>
            <tr>
              <td>客户名称：{{data.consignerName}}</td>
              <td>始发地：{{getCity(data.start)}}</td>
              <td>目的地：{{getCity(data.end)}}</td>
            </tr>
            <tr>
              <td>发货人：{{data.consignerContact}}</td>
              <td>手机号：{{data.consignerPhone}}</td>
              <td>发货地址：{{data.consignerAddress}}</td>
            </tr>
            <tr>
              <td>收货人：{{data.consigneeContact}}</td>
              <td>手机号：{{data.consigneePhone}}</td>
              <td>收货地址：{{data.consigneeAddress}}</td>
            </tr>
            <tr>
              <td>提货方式：{{pickup(data)}}</td>
              <td>回单数：{{data.receiptCount}}</td>
              <td>代收货款：{{data.collectionMoney || 0}}元</td>
            </tr>
          </tbody>
        </table>

        <table cellspacing="0" cellpadding="5" border="1" class="i-mt-10 i-mb-10" style="width:100%">
          <thead>
            <tr>
              <th>货物名称</th>
              <th>包装单位</th>
              <th>数量</th>
              <th>货值（元）</th>
              <th>重量（吨）</th>
              <th>体积（方）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cargo, index) in data.orderCargoList" :key="index">
              <td>{{cargo.cargoName}}</td>
              <td>{{cargo.unit}}</td>
              <td>{{cargo.quantity}}</td>
              <td>{{cargo.cargoCost}}</td>
              <td>{{cargo.weight}}</td>
              <td>{{cargo.volume}}</td>
            </tr>
            <tr>
              <td colspan="6">
                运输费：{{data.freightFee || 0}} 元 &nbsp;&nbsp;
                提货费：{{data.pickupFee || 0}} 元 &nbsp;&nbsp;
                装货费：{{data.loadFee || 0}} 元 &nbsp;&nbsp;
                卸货费：{{data.unloadFee || 0}} 元 &nbsp;&nbsp;
                保险费：{{data.insuranceFee || 0}} 元 &nbsp;&nbsp;
                其他费用：{{data.otherFee || 0}} 元 &nbsp;&nbsp;
                合计运费: {{data.totalFee || 0}} 元
                结算方式：{{settlement(data) || 0}}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="remark-line">
          备注：{{data.remark}}
        </div>
        <table style="width:100%">
          <tbody>
            <tr>
              <td>托运人签字：</td>
              <td>司机签字：</td>
              <td>收货人签字：</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
</template>

<script>
import Printd from 'printd'
import areas from '@/libs/js/city'
import settlements from '@/libs/constant/settlement.js'
import pickups from '@/libs/constant/pickup.js'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      cssText: `
        .order-detail {
          text-align: center;
          margin: 10px 0;
        }
        .i-mt-10 {
          margin-top: 10px;
        }
        .i-mb-10 {
          margin-bottom: 10px
        }
        .remark-line {
          text-align: left;
          padding: 10px 0 20px;
          margin: 10px 0 15px;
          border-bottom: 1px dashed #ccc;
        }
      `,
      visible: false
    }
  },
  mounted () {
    this.printer = new Printd()
  },
  methods: {
    getCity (code) {
      const res = areas.getNameByCode(code) ? areas.getNameByCode(code) : ''
      return res
    },
    pickup (data) {
      let pick = pickups.find(item => item.value === data.pickup)
      if (pick) {
        return pick.name
      }
      return pickups[0].name
    },
    settlement (data) {
      let type = settlements.find(item => item.value === data.settlementType)
      if (type) {
        return type.name
      }
      return settlements[0].name
    },
    print () {
      // this.visible = true
      this.$nextTick(() => {
        this.printer.print(this.$refs.htmlContent, this.cssText)
      })
    }
  }
}
</script>

<style>

</style>
