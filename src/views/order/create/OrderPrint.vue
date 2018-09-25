<template>
  <Modal v-model="visible" @on-cancel="visible=false">
    <div ref="htmlContent" class="order-detail">
      <h3 class="van-center i-mb-10">{{data.consignerName}}公司托运单</h3>
      <table cellspacing="0" cellpadding="10" border="0" style="width:100%">
        <tbody>
          <tr>
            <td>客户：{{data.consignerName}}</td>
            <td>始发地：{{startCity}}</td>
            <td>目的地：{{endCity}}</td>
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
            <td>提货方式：{{pickup}}</td>
            <td>回单数：{{data.receiptCount}}</td>
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
              装货费：{{data.loadFee || 0}} 元 &nbsp;&nbsp;
              卸货费：{{data.unloadFee || 0}} 元 &nbsp;&nbsp;
              保险费：{{data.insuranceFee || 0}} 元 &nbsp;&nbsp;
              其他：{{data.otherFee || 0}} 元 &nbsp;&nbsp;
              合计运费: {{data.totalFee || 0}} 元 &nbsp;&nbsp;
              结算方式：{{settlement || 0}}
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
