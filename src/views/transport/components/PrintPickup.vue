<template>
  <Modal v-model="visible" transfer @on-cancel="visible=false">
    <div ref="htmlContent">
      <div v-for="(item, key) in data" ref="$part"
           :key="key"
           class="order-detail">
        <h3 class="van-center i-mb-20">{{item.loadbill.companyName}}公司装车清单</h3>
        <table cellspacing="0" cellpadding="10" border="0" style="width:100%">
          <tbody>
            <tr>
              <td>承运商：{{item.loadbill.carrierName || '-'}}</td>
              <td>车牌号：{{item.loadbill.carNo || '-'}}</td>
              <td v-if="item.loadbill.carType || item.loadbill.carLength">车型：{{item.loadbill.carType|carTypeFormatter}} {{item.loadbill.carLength|carLengthFormatter}}</td>
              <td v-else>车型：-</td>
            </tr>
            <tr>
              <td v-if="item.loadbill.assignCarType === 1">司机：{{item.loadbill.driverName || '-'}}</td>
              <td v-if="item.loadbill.assignCarType === 1">手机号码：{{item.loadbill.driverPhone || '-'}}</td>
              <td v-if="item.loadbill.assignCarType === 2">主司机：{{getDriver(item.loadbill)}}</td>
              <td v-if="item.loadbill.assignCarType === 2">副司机：{{getAssistantDriver(item.loadbill)}}</td>
              <td >回单数：{{item.loadbill.backbillCnt}}</td>
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
            <tr v-for="(cargo, key) in item.cargoList" :key="key"
                class="table-content">
              <td>{{cargo.cargoName}}</td>
              <td>{{cargo.unit || '-'}}</td>
              <td>{{getRenderNumberAttr(cargo.quantity)}}</td>
              <td>{{cargo.cargoCost | fee}}</td>
              <td v-if="WeightOption === 1">{{getRenderNumberAttr(cargo.weight)}}</td>
              <td v-else>{{getRenderNumberAttr(cargo.weightKg)}}</td>
              <td>{{getRenderNumberAttr(cargo.volume)}}</td>
            </tr>
            <tr>
              <td colspan="6" class="table-footer">
                <span class="table-footer-item">{{item.loadbill.assignCarType === 1 ? '运输费':'油费'}}：{{item.loadbill.freightFee | toPoint('元')}}</span>
                <span class="table-footer-item">装货费：{{item.loadbill.loadFee | toPoint('元')}}</span>
                <span class="table-footer-item">卸货费：{{item.loadbill.unloadFee | toPoint('元')}}</span>
                <span class="table-footer-item">保险费：{{item.loadbill.insuranceFee | toPoint('元')}}</span>
                <span class="table-footer-item">其他费用：{{item.loadbill.otherFee | toPoint('元')}}</span>
                <span class="table-footer-item">合计运费: {{item.loadbill.totalFee | toPoint('元')}}</span>
                <span class="table-footer-item">结算方式：{{settlement(item.loadbill.settlementType) || '-'}}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="remark-line">
          备注：{{item.loadbill.remark || '-'}}
        </div>
        <table style="width:100%">
          <tbody>
            <tr>
              <td>托运人签字：</td>
              <td>司机签字：</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
</template>

<script>
import TransportBase from '../mixin/transportBase'
import Printd from 'printd'
import { mapGetters } from 'vuex'
import settlements from '@/libs/constant/settlement.js'
import { getFeeText, renderNumberAttr } from '@/libs/js/config'
export default {
  filters: {
    fee: getFeeText
  },
  mixins: [ TransportBase ],
  props: {
    data: {
      type: Array,
      default: () => []
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
  computed: {
    ...mapGetters([
      'WeightOption'
    ])
  },
  mounted () {
    this.printer = new Printd()
  },
  methods: {
    getDriver (item) {
      if (item.driverName) {
        return `${item.driverName}  ${item.driverPhone}`
      }
      return '-'
    },
    getAssistantDriver (item) {
      if (item.assistantDriverName) {
        return `${item.assistantDriverName}  ${item.assistantDriverPhone}`
      }
      return '-'
    },
    print () {
      this.$nextTick(() => {
        this.printer.print(this.$refs.htmlContent, this.cssText)
      })
    },
    getFeeText (val) {
      return getFeeText(val)
    },
    getRenderNumberAttr (val) {
      return renderNumberAttr(val)
    },
    settlement (data) {
      let type = settlements.find(item => item.value === data.settlementType)
      if (type) {
        return type.name
      }
      return settlements[0].name
    }
  }
}
</script>

<style>

</style>
