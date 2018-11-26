<template>
  <div :class="{'no-bottom': index!==listLength-1}" class="except-record">
    <div :class="{'no-bottom': hideDetail}" class="except-record-title wigtFont">
      <span>
        {{data.createTime| timeFormatter}} 【修改人: {{data.operatorName}}】
      </span>
      <div class="except-record-btn-group">
        <div class="detail-log-icon" @click="showDetail">
          <i :class="{'detail-log-show': !hideDetail}"></i>
        </div>
      </div>
    </div>
    <div :class="{'except-record-list-hide': hideDetail}" class="change-list">
      <Row>
        <Col span="12">
        <div class="title">修改运单信息:</div>
        <Row>
          <Col v-for="item in infoList" :key="item.name" span="8" style="margin-bottom: 10px">
          <span class="label">{{item.name}}:</span>
          <span class="content">{{item.value}}</span>
          </Col>
        </Row>
        </Col>
        <Col span="12">
        <div class="title">修改运费:</div>
        <Row >
          <Col v-for="item in feeList" :key="item.name" span="8" style="margin-bottom: 10px">
          <span class="label">{{item.name}}:</span>
          <span class="content">{{item.value}}</span>
            </Col>
        </Row>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import TransportBase from '../mixin/transportBase'
import { getCarType, getCarLength } from '@/libs/constant/carInfo'

const moneyFormate = (fee) => {
  if (!fee) return '-'
  return fee / 100
}
const mileageFormate = (mileage) => {
  if (!mileage) return '-'
  return mileage / 1000
}
export default {
  name: 'except-record',
  filters: {
    timeFormatter (timestamp) {
      if (!timestamp) return '-'
      return new Date(timestamp).Format('yyyy-MM-dd hh:mm')
    },
    Money: moneyFormate,
    numFormat (num) {
      return num + 1
    }
  },
  mixins: [ BasePage, TransportBase ],
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    listLength: {
      type: Number,
      default: 0
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      hideDetail: this.listLength > 1,
      showImgFn: null,
      changeList: {
        'start': {
          'type': 'info', // info 运单信息
          'description': '始发地'
        },
        'end': {
          'type': 'info',
          'description': '目的地'
        },
        'carrierName': {
          'type': 'info',
          'description': '承运商'
        },
        'carNo': {
          'type': 'info',
          'description': '车牌号'
        },
        'carLength': {
          'type': 'info',
          'description': '车长',
          'ways': 4
        },
        'carType': {
          'type': 'info',
          'description': '车型',
          'ways': 5
        },
        'driverName': {
          'type': 'info',
          'description': '司机'
        },
        'remark': {
          'type': 'info',
          'description': '备注'
        },
        'driverPhone': {
          'type': 'info',
          'description': '司机手机号'
        },
        'settlementType': {
          'type': 'fee',
          'description': '结算方式',
          'ways': 3
        },
        'freightFee': {
          'type': 'fee',
          'description': '运输费用',
          'ways': 1
        },
        'loadFee': {
          'type': 'fee',
          'description': '装货费',
          'ways': 1
        },
        'unloadFee': {
          'type': 'fee',
          'description': '卸货费',
          'ways': 1
        },
        'otherFee': {
          'type': 'fee',
          'description': '其他费用',
          'ways': 1
        },
        'totalFee': {
          'type': 'fee',
          'description': '合计费用',
          'ways': 1
        },
        'insuranceFee': {
          'type': 'fee',
          'description': '保险费用',
          'ways': 1
        },
        'cashBack': {
          'type': 'fee',
          'description': '返现费用',
          'ways': 1
        },
        'tollFee': {
          'type': 'fee',
          'description': '路桥费',
          'ways': 1
        },
        'mileage': {
          'type': 'fee',
          'description': '公里数',
          'ways': 2
        },
        'prepaidCash': {
          'type': 'fee',
          'description': '预付现金',
          'ways': 1
        },
        'prepaidFuel': {
          'type': 'fee',
          'description': '预付油卡',
          'ways': 1
        },
        'arrivePaidCash': {
          'type': 'fee',
          'description': '到付现金',
          'ways': 1
        },
        'arrivePaidFuel': {
          'type': 'fee',
          'description': '到付油卡',
          'ways': 1
        },
        'receiptPaidCash': {
          'type': 'fee',
          'description': '回付现金',
          'ways': 1
        },
        'receiptPaidFule': {
          'type': 'fee',
          'description': '回付油卡',
          'ways': 1
        },
        'operatorName': {
          'type': 'base',
          'description': '修改人'
        },
        'createTime': {
          'type': 'base',
          'description': '修改时间'
        }
      }
    }
  },
  computed: {
    infoList () { // 修改运单信息
      let list = []
      for (let key in this.data) {
        if (this.changeList[key] && this.changeList[key].type === 'info') {
          list.push({ name: this.changeList[key].description, value: this.changeList[key].ways ? this.waysSwitch(this.changeList[key].ways, this.data[key]) : (this.data[key] ? this.data[key] : '-') })
        }
      }
      return list
    },
    feeList () { // 修改运费信息
      let list = []
      for (let key in this.data) {
        if (this.changeList[key] && this.changeList[key].type === 'fee') {
          list.push({ name: this.changeList[key].description, value: this.changeList[key].ways ? this.waysSwitch(this.changeList[key].ways, this.data[key]) : (this.data[key] ? this.data[key] : '-') })
        }
      }
      return list
    }
  },
  mounted () {
    console.log(this.data)
  },
  methods: {
    /* ways:
     1: 钱除以100
     * 2：公里数处以1000
     * 3：结算方式 1按单结 2月结
     * 4: 车长
     * 5：车型
     * */
    waysSwitch (num, value) {
      switch (num) {
        case 1:
          console.log(moneyFormate(value))
          return moneyFormate(value)
        case 2: return mileageFormate(value)
        case 3: if (value === 1) {
          return '按单结'
        } else {
          return '月结'
        }
        case 4: return getCarLength(value)
        case 5: return getCarType(value)
        default: return ''
      }
    },
    showDetail () {
      this.hideDetail = !this.hideDetail
    }
  }
}
</script>
<style lang="stylus" scoped>
.no-bottom
  border-bottom none!important
.except-record
  margin-left 1px
  border 1px solid #d4d5dc
  &-title
    padding 16px 20px 16px 20px
    border-bottom 1px solid #d4d5dc
    font-size 16px
    background #f8f8f8
    span
      line-height 30px
  &-btn-group
    float right
  .detail-log-icon
    display inline-block
    vertical-align middle
    margin 0 0 0 20px
  &-list
    font-size 14px
    line-height 20px
    padding 10px 20px
    color #666
    border-top 1px solid #d4d5dc
    &-hide
      display none
      .exception-distribution
        display: flex;
        display -ms-flexbox
        margin-bottom: 10px;
        margin-top: 10px
  .red-col
    color red!important
  .wigtFont
    font-weight 600
    color #333
  .colorGrey
    color #333
  .change-list
    padding 28px 17px
    font-size 14px
    .title
      color #333
      font-weight 500
      margin-bottom 20px
    .label
      display inline-block
      color #777
      width 80px
    .content
      color #EC4E4E
</style>
