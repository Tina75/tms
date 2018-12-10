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
      <div v-if="infoListOld.length>0" :class="{'no-bottom':feeListOld.length===0}" class="info">
        <Row>
          <Col span="12">
          <div class="title">修改前运单信息:</div>
          <Row>
            <Col v-for="(item, index) in infoListOld" :key="index" :span="item.span" class="labelContent">
            <span class="label">{{item.name}}:</span>
            <span class="content">{{item.value}}</span>
              </Col>
          </Row>
          </Col>
          <Col span="12">
          <div class="title">修改后运单信息:</div>
          <Row >
            <Col v-for="(item, index) in infoListNew" :key="index" :span="item.span" class="labelContent">
            <span class="label">{{item.name}}:</span>
            <span class="content after">{{item.value}}</span>
              </Col>
          </Row>
          </Col>
        </Row>
      </div>
      <div v-if="feeListOld.length>0"  class="fee">
        <Row>
          <Col span="12">
          <div class="title">修改前运费:</div>
          <Row>
            <Col v-for="item in feeListOld"  :key="item.name" :span="item.span" class="labelContent">
            <span class="label">{{item.name}}:</span>
            <span class="content">{{item.value}}</span>
              </Col>
          </Row>
          <Row>
            <Col>
            <PayInfo
              v-if="settlementTypeOld.length>0"
              :data="settlementTypeOld"
              class="detail-field-payinfo" />
            </Col>
          </Row>
          </Col>
          <Col v-if="feeListNew.length>0" span="12">
          <div class="title">修改后运费:</div>
          <Row >
            <Col v-for="item in feeListNew" :key="item.name" :span="item.span" class="labelContent">
            <span class="label">{{item.name}}:</span>
            <span class="content after">{{item.value}}</span>
              </Col>
          </Row>
          <Row>
            <Col>
            <PayInfo
              v-if="settlementTypeNew.length>0"
              :data="settlementTypeNew"
              class="detail-field-payinfo payinfoAfter" />
              </Col>
          </Row>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import TransportBase from '../mixin/transportBase'
import PayInfo from '../components/PayInfo'
import { getCarType, getCarLength } from '@/libs/constant/carInfo'
import _ from 'lodash'

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
  components: { PayInfo },
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
        'startName': {
          'type': 'info', // info 运单信息
          'description': '始发地',
          'order': 10,
          'span': 24
        },
        'endName': {
          'type': 'info',
          'description': '目的地',
          'order': 20,
          'span': 24
        },
        'carrierName': {
          'type': 'info',
          'description': '承运商',
          'order': 30,
          'span': 24
        },
        'assignCarType': {
          'type': 'info',
          'description': '派车类型',
          'ways': 6,
          'order': 31,
          'span': 12
        },
        'carNo': {
          'type': 'info',
          'description': '车牌号',
          'order': 40,
          'span': 12
        },
        'carLength': {
          'type': 'info',
          'description': '车长',
          'ways': 4,
          'order': 50,
          'span': 12
        },
        'carType': {
          'type': 'info',
          'description': '车型',
          'ways': 5,
          'order': 60,
          'span': 12
        },
        'driverName': {
          'type': 'info',
          'description': '司机',
          'order': 70,
          'span': 12
        },
        'driverPhone': {
          'type': 'info',
          'description': '司机手机号',
          'order': 80,
          'span': 12
        },
        'assistantDriverName': {
          'type': 'info',
          'description': '副司机',
          'order': 81,
          'span': 12
        },
        'assistantDriverPhone': {
          'type': 'info',
          'description': '司机手机号',
          'order': 82,
          'span': 12
        },
        'freightFee': {
          'type': 'fee',
          'description': '运输费用',
          'ways': 1,
          'order': 90,
          'span': 12
        },
        'loadFee': {
          'type': 'fee',
          'description': '装货费',
          'ways': 1,
          'order': 100,
          'span': 12
        },
        'unloadFee': {
          'type': 'fee',
          'description': '卸货费',
          'ways': 1,
          'order': 110,
          'span': 12
        },
        'otherFee': {
          'type': 'fee',
          'description': '其他费用',
          'ways': 1,
          'order': 120,
          'span': 12
        },
        'totalFee': {
          'type': 'fee',
          'description': '合计费用',
          'ways': 1,
          'order': 130,
          'span': 12
        },
        'insuranceFee': {
          'type': 'fee',
          'description': '保险费用',
          'ways': 1,
          'order': 140,
          'span': 12
        },
        // 'cashBack': {
        //   'type': 'fee',
        //   'description': '返现费用',
        //   'ways': 1
        // },
        'tollFee': {
          'type': 'fee',
          'description': '路桥费',
          'ways': 1,
          'order': 150,
          'span': 12
        },
        'mileage': {
          'type': 'fee',
          'description': '公里数',
          'ways': 2,
          'order': 160,
          'span': 12
        },
        'remark': {
          'type': 'info',
          'description': '备注',
          'order': 170,
          'span': 24
        },
        'settlementType': {
          'type': 'fee',
          'description': '结算方式',
          'ways': 3,
          'order': 180,
          'span': 24
        },
        'operatorName': {
          'type': 'base',
          'description': '修改人'
        },
        'createTime': {
          'type': 'base',
          'description': '修改时间'
        },
        'prepaidCash': {
          'type': 'fee',
          'description': '预付现金',
          'settlementType': 1
        },
        'prepaidFuel': {
          'type': 'fee',
          'description': '预付油卡',
          'settlementType': 1
        },
        'arrivePaidCash': {
          'type': 'fee',
          'description': '到付现金',
          'settlementType': 1
        },
        'arrivePaidFuel': {
          'type': 'fee',
          'description': '到付油卡',
          'settlementType': 1
        },
        'receiptPaidCash': {
          'type': 'fee',
          'description': '回付现金',
          'settlementType': 1
        },
        'receiptPaidFule': {
          'type': 'fee',
          'description': '回付油卡',
          'settlementType': 1
        },
        'tailPaidCash': {
          'type': 'fee',
          'description': '尾付现金',
          'settlementType': 1
        },
        'tailPaidFule': {
          'type': 'fee',
          'description': '尾付油卡',
          'settlementType': 1
        }
      },
      settlementPayInfo: [
        { payType: 1, fuelCardAmount: '', cashAmount: '' },
        { payType: 2, fuelCardAmount: '', cashAmount: '' },
        { payType: 3, fuelCardAmount: '', cashAmount: '' },
        { payType: 4, fuelCardAmount: '', cashAmount: '' }
      ]
    }
  },
  computed: {
    infoListOld () {
      // let list = []
      // let data = this.data.old
      // for (let key in data) {
      //   if (this.changeList[key] && this.changeList[key].type === 'info') {
      //     list.push({ name: this.changeList[key].description, value: this.changeList[key].ways ? this.waysSwitch(this.changeList[key].ways, data[key]) : (data[key] ? data[key] : '-') })
      //   }
      // }
      let list = this.filterFieldsByAssignCarType(this.changeList, this.data.old.assignCarType || 1)
      return this.getList(this.data.old, 'info', list)
    },
    infoListNew () {
      // let list = []
      // let data = this.data.new
      // for (let key in data) {
      //   if (this.changeList[key] && this.changeList[key].type === 'info') {
      //     list.push({ name: this.changeList[key].description, value: this.changeList[key].ways ? this.waysSwitch(this.changeList[key].ways, data[key]) : (data[key] ? data[key] : '-') })
      //   }
      // }
      let list = this.filterFieldsByAssignCarType(this.changeList, this.data.new.assignCarType || 1)
      return this.getList(this.data.new, 'info', list)
    },
    feeListOld () {
      // let list = []
      // let data = this.data.old
      // for (let key in data) {
      //   if (this.changeList[key] && this.changeList[key].type === 'fee') {
      //     list.push({ name: this.changeList[key].description, value: this.changeList[key].ways ? this.waysSwitch(this.changeList[key].ways, data[key]) : (data[key] ? data[key] : '-') })
      //   }
      // }
      let list = this.filterFieldsByAssignCarType(this.changeList, this.data.old.assignCarType || 1)
      return this.getList(this.data.old, 'fee', list)
    },
    feeListNew () {
      // let list = []
      // let data = this.data.new
      // for (let key in data) {
      //   if (this.changeList[key] && this.changeList[key].type === 'fee') {
      //     list.push({ name: this.changeList[key].description, value: this.changeList[key].ways ? this.waysSwitch(this.changeList[key].ways, data[key]) : (data[key] ? data[key] : '-') })
      //   }
      // }
      let list = this.filterFieldsByAssignCarType(this.changeList, this.data.new.assignCarType || 1)
      return this.getList(this.data.new, 'fee', list)
    },
    settlementTypeOld () {
      return this.getSettlementType(this.data.old)
    },
    settlementTypeNew () {
      return this.getSettlementType(this.data.new)
    }
  },
  mounted () {
    // console.log(this.data)
  },
  methods: {
    /**
     * 派车类型忽略相关字段
     * 1. 外转保留原承运商，司机，司机手机号
     * 2. 自送，删除承运商，添加主副司机，手机号,删除结算方式的比对
     */
    filterFieldsByAssignCarType (list, type) {
      let newChange = _.cloneDeep(this.changeList, [])
      if (type === 1) {
        // 外转，剔除副司机信息
        // newChange = _.omit(this.changeList, ['assistantDriverName', 'assistantDriverPhone'])
        newChange.driverName.description = '司机'
        newChange.freightFee.description = '运输费用'
      } else if (type === 2) {
        // newChange = _.omit(this.changeList, ['carrierName'])
        newChange.driverName.description = '主司机'
        newChange.freightFee.description = '油费'
        // newChange.assignCarType.span = 24
      }
      return newChange
    },
    /* ways:
     1: 钱除以100
     * 2：公里数处以1000
     * 3：结算方式 1按单结 2月结
     * 4: 车长
     * 5：车型
     * 6: 派车类型，1外转；2自送
     * */
    waysSwitch (num, value) {
      switch (num) {
        case 1:
          return moneyFormate(value)
        case 2: return mileageFormate(value)
        case 3: if (value === 1) {
          return '按单结'
        } else {
          return '月结'
        }
        case 4: return getCarLength(value)
        case 5: return getCarType(value)
        case 6: return value === 2 ? '自送' : '外转'
        default: return ''
      }
    },
    showDetail () {
      this.hideDetail = !this.hideDetail
    },
    /**
     * @param {object} obj 变动的对象数据
     * @param {string} type info 或fee区分
     * @param {object} changelist 根据派车类型的不同，产生不同的改单清单数据
     */
    getList (obj, type, changeList) {
      let list = []

      for (let key in obj) {
        if (changeList[key] && changeList[key].type === type && changeList[key].settlementType !== 1) {
          list.push({
            name: changeList[key].description,
            order: changeList[key].order,
            span: changeList[key].span,
            value: changeList[key].ways ? this.waysSwitch(changeList[key].ways, obj[key]) : (obj[key] ? obj[key] : '-') })
        }
      }
      list = _.sortBy(list, (item) => { return item.order })
      changeList = null
      return list
    },
    getSettlementType (obj) {
      let list = []
      if (obj.assignCarType === 2) {
        return list
      }
      for (let i = 0, item = this.settlementPayInfo; i < item.length; i++) {
        let mid = {}
        for (let key in obj) {
          if (this.changeList[key] && obj.settlementType === 1 && this.changeList[key].settlementType === 1) {
            if (i === 0 && (key === 'prepaidCash' || key === 'prepaidFuel')) {
              mid = {
                payType: item[i].payType,
                fuelCardAmount: typeof obj.prepaidFuel === 'number' ? obj.prepaidFuel / 100 : 0,
                cashAmount: typeof obj.prepaidCash === 'number' ? obj.prepaidCash / 100 : 0
              }
            }
            if (i === 1 && (key === 'arrivePaidCash' || key === 'arrivePaidFuel')) {
              mid = {
                payType: item[i].payType,
                fuelCardAmount: typeof obj.arrivePaidFuel === 'number' ? obj.arrivePaidFuel / 100 : 0,
                cashAmount: typeof obj.arrivePaidCash === 'number' ? obj.arrivePaidCash / 100 : 0
              }
            }
            if (i === 2 && (key === 'receiptPaidCash' || key === 'receiptPaidFule')) {
              mid = {
                payType: item[i].payType,
                fuelCardAmount: typeof obj.receiptPaidFule === 'number' ? obj.receiptPaidFule / 100 : 0,
                cashAmount: typeof obj.receiptPaidCash === 'number' ? obj.receiptPaidCash / 100 : 0
              }
            }
            if (i === 3 && (key === 'tailPaidCash' || key === 'tailPaidFule')) {
              mid = {
                payType: item[i].payType,
                fuelCardAmount: typeof obj.tailPaidFule === 'number' ? obj.tailPaidFule / 100 : 0,
                cashAmount: typeof obj.tailPaidCash === 'number' ? obj.tailPaidCash / 100 : 0
              }
            }
          }
        }
        if (JSON.stringify(mid) !== '{}') {
          list.push(mid)
        }
      }
      return list
    }
  }
}
</script>
<style lang="stylus" scoped>
.payinfoAfter
  /deep/ tr
    td:not(:first-child)
      span
        color red
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
    padding 28px 17px 0 17px
    font-size 14px
    .info
      border-bottom 1px dashed #d4d5dc
      padding-bottom 20px
    .fee
      padding-top 20px
      padding-bottom 20px
    .title
      color #333
      font-weight 500
      margin-bottom 20px
    .labelContent
      margin-bottom 10px
      .label
        color #777
        display inline-block
        width 80px
      .after.content
        color #EC4E4E
    .labelContent.ivu-col-span-24
      overflow hidden
      .label
        float left
      .content
        float left
        width 80%
</style>
