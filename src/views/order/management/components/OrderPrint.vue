<template>
  <Modal v-model="visible" transfer @on-cancel="visible=false">
    <div ref="htmlContent">
      <div v-for="(data, index) in list" :key="index" class="order-detail">
        <h3 class="order-title">
          <!-- <span :style="'display: inline-block;width: 69px;height: 40px;background-image: url(' + CompanyInfo.logoUrl + '?x-oss-process=image/resize,w_69);background-repeat: no-repeat;background-position: center;vertical-align: middle;margin-right: 10px;'"></span> -->
          <div
            v-if="CompanyInfo.logoUrl"
            :style="'width: 30px;height:30px;border-radius: 50%;margin-right: 10px;background-image: url(' + $handleImgUrl(CompanyInfo.logoUrl) + ');background-repeat: no-repeat;background-position: center;background-size: cover;'">
          </div>
          <!-- <div v-else class="logo-url">
            <FontIcon type="ico-comp" size="16" color="#C9CED9"></FontIcon>
          </div> -->
          <div>{{ CompanyInfo.name || CompanyInfo.shortName }}公司货物托运单</div>
        </h3>
        <ul class="order-sub-title">
          <li>托运时间：
            <span v-if="data.createTime">{{data.createTime | datetime('yyyy-MM-dd')}}</span>
            <span v-else>-</span>
          </li>
          <li>
            <div class="city-style">
              <div>发货城市：</div>
              <div>{{data.startName}}</div>
            </div>
          </li>
          <li>
            <div class="city-style">
              <div>收货城市：</div>
              <div>{{data.endName}}</div>
            </div>
          </li>
          <li>
            单号：
            <span v-if="data.orderNo">{{data.orderNo}}</span>
            <span v-else>-</span>
          </li>
        </ul>
        <div class="table-box">
          <table cellspacing="0" cellpadding="10" border="1" class="order-info">
            <tbody>
              <tr>
                <td rowspan="3" class="table-main">发货方</td>
                <td>
                  发货单位：{{data.consignerName}}
                </td>
              </tr>
              <tr>
                <td style="height: 60px;line-height: 1.5;">发货地址：{{data.consignerAddress + data.consignerHourseNumber}}</td>
              </tr>
              <tr>
                <td>
                  <span class="spacing-letter">发货人：</span>
                  <span>{{data.consignerContact + ' ' + data.consignerPhone}}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <table cellspacing="0" cellpadding="10" border="1" class="order-info">
            <tbody>
              <tr>
                <td rowspan="3" class="table-main">收货方</td>
                <td>
                  收货单位：{{data.consigneeCompanyName || '-'}}
                </td>
              </tr>
              <tr>
                <td style="height: 60px;line-height: 1.5;">收货地址：{{data.consigneeAddress + data.consigneeHourseNumber}}</td>
              </tr>
              <tr>
                <td>
                  <span class="spacing-letter">收货人：</span>
                  <span>{{data.consigneeContact + ' ' + data.consigneePhone}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <table cellspacing="0" cellpadding="5" border="1" class="cargo-info">
          <thead>
            <tr>
              <th>货物名称</th>
              <th>货物编号</th>
              <th>包装数量</th>
              <th v-if="WeightOption === 1">重量（吨）</th>
              <th v-else>重量（公斤）</th>
              <th>体积（方）</th>
              <th>货值（元）</th>
              <th>包装方式</th>
              <th>包装尺寸（毫米）</th>
              <th>备注1</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cargo, index) in data.orderCargoList" :key="index" class="table-content">
              <td>{{cargo.cargoName}}</td>
              <td>{{cargo.cargoNo || '-'}}</td>
              <td>{{getRenderNumberAttr(cargo.quantity)}}</td>
              <td v-if="WeightOption === 1">{{getRenderNumberAttr(cargo.weight)}}</td>
              <td v-else>{{getRenderNumberAttr(cargo.weightKg)}}</td>
              <td>{{getRenderNumberAttr(cargo.volume)}}</td>
              <td>{{cargo.cargoCost | fee}}</td>
              <td>{{cargo.unit || '-'}}</td>
              <td>{{renderDimension(cargo.dimension)}}</td>
              <td>{{cargo.remark1 || '-'}}</td>
            </tr>
            <tr class="table-row-total">
              <td>合计：</td>
              <td></td>
              <td>{{ quantityTotal(data.orderCargoList) }}</td>
              <td v-if="WeightOption === 1">{{ weightTotal(data.orderCargoList) }}</td>
              <td v-else>{{ weightTotal(data.orderCargoList) }}</td>
              <td>{{ volumeTotal(data.orderCargoList) }}</td>
              <td>{{ cargoCostTotal(data.orderCargoList) }}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table cellspacing="0" cellpadding="5" border="1" class="cargo-info">
          <thead>
            <tr>
              <th>里程（公里）</th>
              <th>运输费（元）</th>
              <th>提货费（元）</th>
              <th>装货费（元）</th>
              <th>卸货费（元）</th>
              <th>保险费（元）</th>
              <th>其他费用（元）</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-content">
              <td>{{ data.mileage | mileage }}</td>
              <td>
                <span>{{ data.freightFee | fee }}</span>
                <span v-if="data.chargeRule">{{ `(${data.chargeRule})` }}</span>
              </td>
              <td>{{ data.pickupFee  | fee }}</td>
              <td>{{ data.loadFee | fee }}</td>
              <td>{{ data.unloadFee | fee }}</td>
              <td>{{ data.insuranceFee | fee }}</td>
              <td>{{ data.otherFee | fee }}</td>
            </tr>
            <tr>
              <td colspan="7" class="total-fee">
                <span>费用合计：{{ data.totalFee | fee }}元</span>
                <span style="margin-left: 22px;">{{ getMoney2chinese(data.totalFee) }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="7">
                <div class="total-row-right">
                  <span>结算方式：{{ settlement(data) || '-' }}</span>
                  <span>是否开票：{{ data.isInvoice === 1 ? `是（${getMultiplyRate(data.invoiceRate)}%）` : '否'}}</span>
                  <span>代收货款：{{ data.collectionMoney | fee }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <table cellspacing="0" cellpadding="10" border="1" class="cargo-info">
          <tbody>
            <tr>
              <td>
                提货方式：{{ pickup(data) }}
              </td>
              <td>
                客户订单号：{{ data.customerOrderNo || '-' }}
              </td>
              <td>
                客户运单号：{{ data.customerWaybillNo || '-' }}
              </td>
            </tr>
            <tr>
              <td colspan="3">
                备注：{{ data.remark || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
        <table class="table-footer">
          <tbody>
            <tr>
              <td>制单员：{{ data.creatorName || '-' }}</td>
              <td>
                <span>托运人签字：</span>
                <span>承运人签字：</span>
              </td>
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
import { multiplyFee, getFeeText, multiplyRate, divideFee, renderNumberAttr, roundFee, roundVolume, roundWeight, roundWeightKg } from '@/libs/js/config'
import { money2chinese, zncn2znhant } from '@/libs/js/util'
import NP from 'number-precision'
import { mapGetters } from 'vuex'
export default {
  filters: {
    fee: getFeeText
  },
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
          page-break-after: always;
          -webkit-print-color-adjust: 'exact';
        }
        .order-title {
          font-size: 20px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: #333;
          letter-spacing: 2px;
          margin: 37px 0 42px 0;
          display: flex;
          display: -ms-flexbox;
          justify-content: center;
          -ms-flex-pack: center;
          align-items: center;
          -ms-flex-align: center;
        }
        .logo-url {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #EFEFEF;
          margin-right: 10px;
        }
        .order-sub-title {
          padding: 0;
          margin: 0;
          font-size: 12px;
          font-family: PingFangSC-Regular;
          color: #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #A7AFC1;
        }
        .order-sub-title > li {
          display: inline-block;
          list-style: none;
          width: 25%;
        }
        .table-box {
          display: flex;
          display: -ms-flexbox;
          justify-content: space-between;
          -ms-flex-pack: justify;
        }
        .city-style {
          display: flex;
          display: -ms-flexbox;
          align-items: flex-start;
          -ms-flex-align: flex-start;
        }
        .city-style >div:first-child {
          flex-shrink: 0;
        }
        .order-info {
          width: 49%;
          font-size: 12px;
          color: #333;
          border-collapse: collapse;
          border-color: #333;
        }
        .order-info .table-main {
          width: 12px;
          background-color: #C9CED9;
        }
        .spacing-letter {
          letter-spacing: 4px;
        }
        .cargo-info {
          margin-top: 10px;
          width: 100%;
          font-size: 12px;
          color: #333;
          border-collapse: collapse;
          border-color: #333;
        }
        th {
          background-color: #C9CED9;
        }
        .total-fee {
          font-size: 16px;
          font-family: PingFangSC-Medium;
          font-weight: bold;
          color: #333;
          line-height: 2;
        }
        .total-row-right {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          color: #333;
          line-height: 1.5;
        }
        .total-row-right span {
          display: inline-block;
          width: 33.3%;
        }
        .table-footer {
          margin-top: 20px;
          width: 100%;
          font-size: 12px;
          color: #333;
        }
        .table-footer td {
          width: 50%;
        }
        .table-footer td span {
          display: inline-block;
          width: 50%;
        }
        .table-content {
          text-align: center;
        }
        .table-row-total {
          font-size: 16px;
          font-family: PingFangSC-Medium;
          font-weight: bold;
          color: #333;
          text-align: center;
          line-height: 1.5;
        }
      `,
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'CompanyInfo',
      'WeightOption'
    ])
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
    },
    getFeeText (val) {
      return multiplyFee(val)
    },
    getMultiplyRate (val) {
      return multiplyRate(val)
    },
    renderDimension (dimension) {
      let text = ''
      if (dimension.length || dimension.width || dimension.height) {
        text = (dimension.length || '-') + ' x ' + (dimension.width || '-') + ' x ' + (dimension.height || '-')
      } else {
        text = '-'
      }
      return text
    },
    getMoney2chinese (val) {
      return zncn2znhant(money2chinese(divideFee(val)))
    },
    getRenderNumberAttr (val) {
      return renderNumberAttr(val)
    },
    // 总货值
    cargoCostTotal (orderCargoList) {
      let total = 0
      orderCargoList.map((item) => {
        // total += Number(item.cargoCost)
        total = NP.plus(total, Number(item.cargoCost))
      })
      total = divideFee(total)
      return roundFee(total)
    },
    // 总数量
    quantityTotal (orderCargoList) {
      let total = 0
      orderCargoList.map((item) => {
        // total += Number(item.quantity)
        total = NP.plus(total, Number(item.quantity))
      })
      return total
    },
    // 总体积
    volumeTotal (orderCargoList) {
      let total = 0
      orderCargoList.map((item) => {
        // total += Number(item.volume)
        total = NP.plus(total, Number(item.volume))
      })
      return roundVolume(total)
    },
    // 总重量
    weightTotal (orderCargoList) {
      let total = 0
      orderCargoList.map((item) => {
        // 区分吨或公斤
        if (this.WeightOption === 1) {
          // total += Number(item.weight)
          total = NP.plus(total, Number(item.weight))
          total = roundWeight(total)
        } else {
          // total += Number(item.weightKg)
          total = NP.plus(total, Number(item.weightKg))
          total = roundWeightKg(total)
        }
      })
      return total
    }
  }
}
</script>

<style lang='stylus'>

</style>
