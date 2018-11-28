<template>
  <Modal v-model="visible" transfer @on-cancel="visible=false">
    <div ref="htmlContent">
      <div v-for="(data, index) in list" :key="index" class="order-detail">
        <h3 class="van-center i-mb-20">{{data.consignerName}}公司托运单</h3>
        <table class="order-info" cellspacing="0" cellpadding="10" border="0" style="width:100%">
          <colgroup>
            <col width="160" />
            <col width="240" />
            <col width="240" />
          </colgroup>
          <tbody>
            <tr>
              <td>客户：{{data.consignerName}}</td>
              <td v-if="source === 'order'">始发地：{{data.startName}}</td>
              <td v-else>始发地：{{ cityFormatter(data.start) }}</td>
              <td v-if="source === 'order'">目的地：{{data.endName}}</td>
              <td v-else>始发地：{{ cityFormatter(data.end) }}</td>
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
              <td>回单数：{{data.receiptCount}}</td>
              <td>提货方式：{{pickup(data)}}</td>
              <td v-if="source === 'order'">代收货款：{{data.collectionMoney ? data.collectionMoney / 100 + '元' : '-'}}</td>
              <td v-else>代收货款：{{data.collectionMoney ? data.collectionMoney + '元' : '-'}}</td>
            </tr>
            <tr>
              <td>业务员：{{data.salesmanName}}</td>
              <td>是否开票：{{data.isInvoice == 0 ? `否` : `是`}}</td>
              <td v-if="data.isInvoice">开票税率：{{data.invoiceRate}}%</td>
            </tr>
          </tbody>
        </table>

        <table cellspacing="0" cellpadding="5" border="1" class="i-mt-20 i-mb-20" style="width:100%">
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
            <tr v-for="(cargo, index) in data.orderCargoList" :key="index" class="table-content">
              <td>{{cargo.cargoName}}</td>
              <td>{{cargo.unit}}</td>
              <td>{{cargo.quantity || 0}}</td>
              <td v-if="source === 'order'">{{cargo.cargoCost / 100}}</td>
              <td v-else>{{cargo.cargoCost / 1}}</td>
              <td>{{cargo.weight || 0}}</td>
              <td>{{cargo.volume || 0}}</td>
            </tr>
            <tr>
              <td v-if="source === 'order'" colspan="6" class="table-footer">
                <span class="table-footer-item">运输费：{{ data.freightFee ?  data.freightFee / 100 + '元' : '-' }}</span>
                <span class="table-footer-item">提货费：{{ data.pickupFee ? data.pickupFee / 100 + '元' : '-' }}</span>
                <span class="table-footer-item">装货费：{{ data.loadFee ? data.loadFee / 100 + '元' : '-' }}</span>
                <span class="table-footer-item">卸货费：{{ data.unloadFee ? data.unloadFee / 100 + '元' : '-' }}</span>
                <span class="table-footer-item">保险费：{{ data.insuranceFee ? data.insuranceFee / 100 + '元' : '-' }}</span>
                <span class="table-footer-item">其他运费：{{ data.otherFee ? data.otherFee / 100 + '元' : '-' }}</span>
                <span class="table-footer-item">合计运费: {{ data.totalFee ? data.totalFee / 100 + '元' : '-' }}</span>
                <span class="table-footer-item">结算方式：{{settlement(data) || '-'}}</span>
              </td>
              <td v-else colspan="6" class="table-footer">
                <span class="table-footer-item">运输费：{{ data.freightFee ?  data.freightFee + '元' : '-' }}</span>
                <span class="table-footer-item">提货费：{{ data.pickupFee ? data.pickupFee + '元' : '-' }}</span>
                <span class="table-footer-item">装货费：{{ data.loadFee ? data.loadFee + '元' : '-' }}</span>
                <span class="table-footer-item">卸货费：{{ data.unloadFee ? data.unloadFee + '元' : '-' }}</span>
                <span class="table-footer-item">保险费：{{ data.insuranceFee ? data.insuranceFee + '元' : '-' }}</span>
                <span class="table-footer-item">其他运费：{{ data.otherFee ? data.otherFee + '元' : '-' }}</span>
                <span class="table-footer-item">合计运费: {{ data.totalFee ? data.totalFee + '元' : '-' }}</span>
                <span class="table-footer-item">结算方式：{{settlement(data) || '-'}}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="remark-line">
          备注：{{data.remark || '无'}}
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
import City from '@/libs/js/city'
import settlements from '@/libs/constant/settlement.js'
import pickups from '@/libs/constant/pickup.js'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    source: {
      type: String,
      default: 'order'
    }
  },
  data () {
    return {
      cssText: `
        .order-detail {
          text-align: center;
          padding-top: 20px;
          page-break-after: always;
        }
        .order-info td {
          vertical-align: top;
        }
        .i-mt-20 {
          margin-top: 20px;
        }
        .i-mb-20 {
          margin-bottom: 20px
        }
        .remark-line {
          text-align: left;
          padding: 10px 0 20px;
          margin: 10px 0 15px;
          border-bottom: 1px dashed #ccc;
        }
        .table-content {
          text-align: center;
        }
        .table-footer {
          padding: 10px 20px;
          line-height: 1.5;
        }
        .table-footer-item {
          display: inline-block;
          margin-right: 50px
        }
      `,
      visible: false
    }
  },
  mounted () {
    this.printer = new Printd()
  },
  methods: {
    // 格式化城市
    cityFormatter (code) {
      if (!code) return ''
      return Array.from(new Set(City.codeToFullNameArr(code, 3))).join('')
    },
    pickup (data) {
      let pick = pickups.find(item => item.value === data.pickup)
      if (pick) {
        return pick.name
      }
      return '-'
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
