<template>
  <Modal v-model="visible" @on-cancel="visible=false">
    <div ref="htmlContent">
      <div v-for="(item, key) in data" ref="$part"
           :key="key"
           class="order-detail">
        <h3 class="van-center i-mb-20">{{item.waybill.companyName}}公司装车清单</h3>
        <table cellspacing="0" cellpadding="10" border="0" style="width:100%">
          <tbody>
            <tr>
              <td>承运商：{{item.waybill.carrierName}}</td>
              <td>始发地：{{item.waybill.start | cityFormatter}}</td>
              <td>目的地：{{item.waybill.end | cityFormatter}}</td>
            </tr>
            <tr>
              <td>车牌号：{{item.waybill.carNo}}</td>
              <td>司机：{{item.waybill.driverName}}</td>
              <td>手机号码：{{item.waybill.driverPhone}}</td>
            </tr>
            <tr>
              <td>车型：{{item.waybill.carType|carTypeFormatter}} {{item.waybill.carLength|carLengthFormatter}}</td>
              <td>回单数：{{item.waybill.backbillCnt}}</td>
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
              <td>{{cargo.unit}}</td>
              <td>{{cargo.quantity}}</td>
              <td>{{cargo.cargoCost / 100}}</td>
              <td>{{cargo.weight}}</td>
              <td>{{cargo.volume}}</td>
            </tr>
            <tr>
              <td colspan="6" class="table-footer">
                <span class="table-footer-item">运输费：{{item.waybill.freightFee / 100 || 0}} 元</span>
                <span class="table-footer-item">装货费：{{item.waybill.loadFee / 100 || 0}} 元</span>
                <span class="table-footer-item">卸货费：{{item.waybill.unloadFee / 100 || 0}} 元</span>
                <span class="table-footer-item">保险费：{{item.waybill.insuranceFee / 100 || 0}} 元</span>
                <span class="table-footer-item">其他：{{item.waybill.otherFee / 100 || 0}} 元</span>
                <span class="table-footer-item">合计运费: {{item.waybill.totalFee / 100 || 0}} 元</span>
                <span class="table-footer-item">结算方式：{{item.waybill.settlementType | payTypeFormatter}}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="remark-line">
          备注：{{item.waybill.remark || '无'}}
        </div>
        <table style="width:100%">
          <tbody>
            <tr>
              <td>托运人签字：</td>
              <td>司机签字：</td>
              <td>发车日期：</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
</template>

<script>
import TransportBase from '../transportBase'
import Printd from 'printd'

export default {
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

  mounted () {
    this.printer = new Printd()
  },
  methods: {
    print () {
      this.$nextTick(() => {
        this.printer.print(this.$refs.htmlContent, this.cssText)
      })
    }
  }
}
</script>

<style>

</style>
