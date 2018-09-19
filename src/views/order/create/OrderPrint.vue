<template>
  <Modal v-model="visible" @on-cancel="visible=false">
    <div ref="htmlContent" class="order-detail">
      <h3 class="van-center i-mb-10">订单明细</h3>
      <table cellspacing="0" cellpadding="10" border="0" style="width:100%">
        <tbody>
          <tr>
            <td colspan="2">客户名称：{{data.consignerName}}</td>
          </tr>
          <tr>
            <td>要求发货时间： {{data.deliveryTime | datetime}}前</td>
            <td>期望到货时间：{{data.arriveTime | datetime}}前</td>
          </tr>
          <tr>
            <td>始发城市：{{startCity}}</td>
            <td>目的城市：{{endCity}}</td>
          </tr>
          <tr>
            <td>发货联系人：{{data.consignerContact}}</td>
            <td>联系方式：{{data.consignerPhone}}</td>
          </tr>
          <tr>
            <td colspan="2">发货地址：{{data.consignerAddress}}</td>
          </tr>
          <tr>
            <td>收货联系人：{{data.consigneeContact}}</td>
            <td>联系方式：{{data.consigneePhone}}</td>
          </tr>
          <tr>
            <td colspan="2">收货地址：{{data.consigneeAddress}}</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0" cellpadding="5" border="1" class="i-mt-10 i-mb-10" style="width:100%">
        <thead>
          <tr>
            <th>货物名称</th>
            <th>重量（吨）</th>
            <th>体积（方）</th>
            <th>货值（元）</th>
            <th>数量</th>
            <th>包装</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cargo, index) in data.orderCargoList" :key="index">
            <td>{{cargo.cargoName}}</td>
            <td>{{cargo.weight}}</td>
            <td>{{cargo.volume}}</td>
            <td>{{cargo.cargoCost}}</td>
            <td>{{cargo.quantity}}</td>
            <td>{{cargo.unit}}</td>
            <td>{{cargo.remark}}</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0" cellpadding="10" border="0" style="width:100%">
        <tbody>
          <tr>
            <td>结算方式：{{settlement}}</td>
            <td>运输费用：{{data.freightFee}}</td>
          </tr>
          <tr>
            <td>提货方式：{{pickup}}</td>
            <td>回单数：{{data.receiptCount}}</td>
          </tr>
          <tr>
            <td colspan="2">备注：{{data.remark}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Modal>
</template>

<script>
import Printd from 'printd'
import areas from '@/libs/js/City'
import settlements from './constant/settlement.js'
import pickups from './constant/pickup.js'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
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
      `,
      visible: false
    }
  },
  computed: {
    startCity () {
      return this.data.start ? areas.getPathByCode(this.data.start[this.data.start.length - 1]).map(item => item.name).join('') : ''
    },
    endCity () {
      return this.data.end ? areas.getPathByCode(this.data.end[this.data.end.length - 1]).map(item => item.name).join('') : ''
    },
    pickup () {
      let pick = pickups.find(item => item.value === this.data.pickup)
      if (pick) {
        return pick.name
      }
      return pickups[0].name
    },
    settlement () {
      let type = settlements.find(item => item.value === this.data.settlementType)
      if (type) {
        return type.name
      }
      return settlements[0].name
    }
  },
  mounted () {
    this.printer = new Printd()
  },
  methods: {
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
