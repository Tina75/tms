<!--  -->
<template>
  <div class="writing-off">
    <div class="query-box">
      <Form :model="writingOffQuery" label-position="left" inline>
        <Row>
          <Col :span="scene === 2 ? 6:5" style="margin-right: 40px">
          <FormItem :label-width="60" :label="sceneMap[scene] + '：'">
            <Input v-model="writingOffQuery.name" :placeholder="`请输入${sceneMap[scene]}名称`" :maxlength="20"/>
          </FormItem>
          </Col>
          <Col :span="scene === 2 ? 6:5" style="margin-right: 40px">
          <FormItem :label-width="65" :label="orderNoMap[scene] + '：'">
            <Input v-model="writingOffQuery.orderNo" :placeholder="`${orderNoPlaceholder[scene]}`" :maxlength="20"/>
          </FormItem>
          </Col>
          <Col span="2" style="margin-right: 10px">
          <FormItem>
            <Select v-model="writingOffQuery.periodType" transfer>
              <Option v-for="(value, key) in periodTypeMap" v-if="key === '1' || key === '2' || (scene === 1 && key === '3')" :key="key" :value="key">{{value}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col :span="scene === 2 ? 6:4" style="margin-right: 40px">
          <FormItem>
            <DatePicker v-model="writingOffQuery.period" :options="dateOption" transfer type="daterange" format="yyyy-MM-dd" placeholder="开始时间-结束时间" style="width: 100%" />
          </FormItem>
          </Col>
          <Col  v-if="scene !== 2" span="5">
          <FormItem>
            <Button type="primary" style="margin-right: 10px" @click="startQuery">搜索</Button>
            <Button type="default" @click="resetQuery">清除条件</Button>
          </FormItem>
          </Col>
        </Row>
        <Row v-if="scene === 2" class="mediaClass">
          <Col span="6" style="margin-right: 40px">
          <FormItem :label-width="60" label="车牌号：">
            <Input v-model="writingOffQuery.truckNo" :maxlength="15" placeholder="请输入车牌号"/>
          </FormItem>
          </Col>
          <Col  span="5">
          <FormItem>
            <Button type="primary" style="margin-right: 10px" @click="startQuery">搜索</Button>
            <Button type="default" @click="resetQuery">清除条件</Button>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div  v-if="companyData.length>0" :style="{height: height - 20 +'px'}" class="list-box">
      <ul class="leftList">
        <li v-for="(item,index) in companyData" :class="{companyDataActive:companyDataActive === item.id}" :key="index" class="list" @click="showOrderData(item)">
          <div class="icon">
            <FontIcon slot="icon" :type="iconType" ></FontIcon>
          </div>
          <div class="content">
            <div v-if="item.partnerName.length<12" class="ruleName">{{item.partnerName}}</div>
            <div v-else class="ruleName">{{item.partnerName.slice(0,12)}}...</div>
            <div class="tips">
              <span style="margin-right: 10px">{{payType}} {{item.calcTotalFeeText}}</span>
              <span>已结 {{item.verifiedFeeText}}</span>
            </div>
          </div>
          <div class="num">
            {{item.orderNum}}单
          </div>
        </li>
      </ul>
      <div class="order-list">
        <DataEmpty v-if="!currentPartner.partnerName || !orderData.length">
          {{emptyContent}}
        </DataEmpty>
        <div v-else>
          <div class="title">
            <div class="text">
              <p class="desc_title">{{orderData[0].title}}</p>
              <p class="desc_money">
                <span style="margin-right: 30px">{{payType}} {{orderData[0].calcTotalFeeText}}</span>
                <span>已结 {{orderData[0].verifiedFeeText}}</span>
              </p>
            </div>
            <Button v-if="(hasPower(170102) && scene === 1) || (hasPower(170202) && scene === 2) || (hasPower(170302) && scene === 3)" class="btn" type="primary" @click="createBill">生成对账单</Button>
            <Tooltip v-if="scene === 2" content="按单结的运单才可以批量核销" class="btn" style="margin-right: 11px">
              <Button  @click="batchCheckOrder">批量核销</Button>
            </Tooltip>
          </div>
          <Table :columns="orderColumn" :data="orderData" class="tableList"  @on-selection-change="setOrderIds"></Table>
        </div>
      </div>
    </div>
    <div v-if="companyData.length===0" class="dataNone">
      <DataEmpty v-if="!currentPartner.partnerName || !orderData.length">
        暂无数据
      </DataEmpty>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import Server from '@/libs/js/server'
import FontIcon from '@/components/FontIcon'
import DataEmpty from '@/components/DataEmpty'
import float from '@/libs/js/float'
import _ from 'lodash'
import payTypeDialog from '../dialogs/payTypeDialog'
import { payTypeMap } from '../constant/numList'
export default {
  name: 'writingOff',
  components: {
    FontIcon,
    DataEmpty,
    payTypeDialog
  },
  mixins: [ BaseComponent ],
  props: {
    scene: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      height: 0,
      companyDataActive: -1,
      sceneMap: {
        1: '发货方',
        2: '承运商',
        3: '外转方'
      },
      orderNoMap: {
        1: '订单号',
        2: '单据号',
        3: '单据号'
      },
      orderNoPlaceholder: {
        1: '请输入订单号',
        2: '请输入运单/提货单号',
        3: '请输外转单号/订单号'
      },
      orderNameMap: {
        1: '订单',
        2: '运单/提货单',
        3: '外转单'
      },
      orderStatusMap: {
        1: [{
          label: '在途',
          value: '在途'
        }, {
          label: '已到货',
          value: '已到货'
        }, {
          label: '已回单',
          value: '已回单'
        }],
        2: [{
          label: '在途',
          value: '在途'
        }, {
          label: '已到货',
          value: '已到货'
        }, {
          label: '已提货',
          value: '已提货'
        }],
        3: [{
          label: '在途',
          value: '在途'
        }, {
          label: '已到货',
          value: '已到货'
        }]
      },
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      writingOffQuery: {
        name: '',
        periodType: '1',
        orderNo: '',
        truckNo: '',
        period: []
      },
      writingOffQuerySave: {
        name: '',
        periodType: '1',
        orderNo: '',
        truckNo: '',
        period: []
      },
      periodTypeMap: {
        1: '下单时间',
        2: '到货日期',
        3: '回单日期'
      },
      companyData: [],
      orderData: [],
      selectedIds: [],
      currentPartner: {},
      selectedList: [], // 表格选中项
      payTypeMap: payTypeMap
    }
  },
  computed: {
    emptyContent () {
      return `请点击左侧${this.sceneMap[this.scene]}列表查看${this.orderNameMap[this.scene]}哦～`
    },
    /**
     * 图标类型
     * 1: 外转方
     * 2： 承运商
     * 3：外转方
     */
    iconType () {
      if (this.scene === 2) {
        return 'ico-cys'
      } else if (this.scene === 3) {
        return 'ico-wz'
      }
      return 'ico-company'
    },
    orderColumn () {
      return [
        {
          type: 'selection',
          width: 20
        },
        {
          title: '操作',
          key: 'action',
          width: 40,
          render: (h, params) => {
            return (this.scene === 1 && this.hasPower(170101)) || (this.scene === 2 && this.hasPower(170201)) || (this.scene === 3 && this.hasPower(170301)) ? h('a', {
              on: {
                click: () => {
                  this.writeOff(params)
                }
              }
            }, '核销') : ''
          }
        },
        {
          title: this.orderNameMap[this.scene] + '号',
          key: 'orderNo',
          render: (h, params) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.toDetail(params)
                }
              }
            }, params.row.orderNo)
          }
        },
        this.scene === 2 ? {
          title: '承运商运单号',
          key: 'carrierWaybillNo'
        } : {
          title: ' ',
          width: 1
        },
        {
          title: '始发地',
          key: 'departureName'
        },
        {
          title: '目的地',
          key: 'destinationName'
        },
        this.scene === 2 ? {
          title: '车牌号',
          width: 80,
          key: 'truckNo'
        } : {
          title: ' ',
          width: 1
        },
        {
          title: '合计运费',
          width: 75,
          key: 'totalFeeText'
        },
        {
          title: '结算方式',
          // width: 80,
          key: 'settleTypeDesc',
          filters: this.scene === 2 ? [
            {
              label: '按单结算',
              value: '按单结算'
            },
            {
              label: '月结',
              value: '月结'
            }] : [
            {
              label: '预付',
              value: '预付'
            },
            {
              label: '到付',
              value: '到付'
            },
            {
              label: '回单付',
              value: '回单付'
            },
            {
              label: '月结',
              value: '月结'
            }
          ],
          filterMethod (value, row) {
            return row.settleTypeDesc === value
          },
          render: (h, p) => {
            if (this.scene === 2 && typeof p.row.listMultiPay !== 'string') {
              return h('div', [
                h('span', p.row.settleTypeDesc + '  ' + p.row.unPayCount + '单未核'),
                h(payTypeDialog, { props: { list: p.row.listMultiPay }, style: { display: 'inline-block', marginLeft: '5px' } })
              ])
            } else {
              return h('div', p.row.settleTypeDesc)
            }
          }
        },
        {
          title: '状态',
          width: 60,
          key: 'orderStatusDesc',
          filters: this.orderStatusMap[this.scene],
          filterMethod (value, row) {
            return row.orderStatusDesc === value
          }
        }
      ]
    },
    payType () {
      switch (this.scene) {
        case 1: return '应收'
        case 2: return '应付'
        default: return ''
      }
    }
  },
  mounted () {
    this.loadData()
    this.height = document.body.clientHeight - 50 - 15 * 2 - 20 * 2 + 15 - 65 - 72 - 50
  },
  methods: {
    setOrderIds (data) {
      this.selectedIds = data.map(item => item.id)
      this.selectedList = data
    },
    createBillOk () {
      const _this = this
      this.openDialog({
        name: 'finance/dialogs/createCheck',
        data: {
          idList: this.selectedIds,
          partnerName: this.currentPartner.partnerName,
          orderNum: this.currentPartner.orderNum,
          dayType: this.writingOffQuerySave.periodType,
          startTime: this.writingOffQuerySave.startTime || '',
          endTime: this.writingOffQuerySave.endTime || '',
          partnerType: this.scene
        },
        methods: {
          ok () {
            this.$Message.success('创建成功')
            _this.loadData()
          }
        }
      })
    },
    createBill () {
      if (this.selectedIds.length > 1) {
        // 统计多段付单子
        let monthList = []
        // 统计非多段付单子
        let notMulList = []
        this.selectedList.map(item => {
          if (item.isMultiPay === 1) {
            monthList.push(item.orderNo)
          } else if (item.isMultiPay === 0) {
            notMulList.push(item.id)
          }
        })
        let errList = []
        if (monthList.length > 0) { // 存在多段付
          errList.push({
            title: '以下单据是多段付，不能生成对账单',
            arr: monthList
          })
        }
        if (notMulList.length === 0) { // 都是多段付，不用判断异常，直接弹窗提示存在多段付单子
          this.errDialog(errList)
          return
        }
        Server({
          url: '/finance/reconcile/checkReconcile',
          method: 'post',
          data: {
            idList: notMulList,
            partnerType: this.scene,
            partnerName: this.currentPartner.partnerName
          }
        }).then(res => {
          if (res.data.data && res.data.data.operateCode === 1) {
            // 存在异常
            errList.push({
              title: '以下单据存在异常，无法生成对账单',
              arr: res.data.data.orderNos
            })
          }
          if (errList.length === 0) { // 不存在异常且不存在月结单，可以批量核销
            this.createBillOk()
          } else {
            this.errDialog(errList)
          }
        })
      } else {
        this.$Message.warning('请选择2条以上的数据')
      }
    },
    startQuery () {
      this.orderData = []
      this.writingOffQuerySave = _.cloneDeep(this.writingOffQuery)
      this.loadData()
    },
    resetQuery () {
      this.writingOffQuery = {
        name: '',
        periodType: '1',
        orderNo: '',
        truckNo: '',
        period: []
      }
      this.startQuery()
    },
    writeOffOk (data) {
      const _this = this
      if (data.row.isMultiPay) {
        // 多段付
        this.openDialog({
          name: 'finance/dialogs/stepPay',
          data: {
            id: data.row.id,
            scene: this.scene,
            needPay: data.row.totalFeeText,
            settleTypeDesc: data.row.settleTypeDesc
          },
          methods: {
            ok () {
              _this.loadData()
            }
          }
        })
      } else {
        // 单笔核销
        this.openDialog({
          name: 'finance/dialogs/writeOff',
          data: {
            id: data.row.id,
            verifyType: 1,
            isOil: 0,
            scene: this.scene,
            needPay: float.round(data.row.totalFeeText),
            settleTypeDesc: data.row.settleTypeDesc
          },
          methods: {
            ok () {
              this.$Message.success('核销成功')
              _this.loadData()
            }
          }
        })
      }
    },
    writeOff (data) {
      Server({
        url: '/finance/verify/checkOrder',
        method: 'post',
        data: {
          id: data.row.id,
          verifyType: 1
        }
      }).then(res => {
        if (res.data.data === '') {
          this.writeOffOk(data)
        } else if (res.data.data && res.data.data.operateCode === 1) {
          // 存在异常
          this.$Message.error('此单存在异常不能核销')
        }
      })
    },
    toDetail (data) {
      switch (data.row.orderType) {
        case 1:
          this.openTab({
            path: '/order/management/detail',
            title: data.row.orderNo,
            query: {
              id: data.row.orderNo,
              orderId: data.row.orderId,
              from: 'order'
            }
          })
          break
        case 2:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailFreight',
            query: { id: data.row.orderId } // id 或 no 二选一
          })
          break
        case 3:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailPickup',
            query: { id: data.row.orderId }
          })
          break
        case 4:
          this.openTab({
            title: data.row.orderNo,
            path: '/transport/detail/detailOuter',
            query: { id: data.row.orderId }
          })
          break
      }
    },
    loadData () {
      Server({
        url: '/finance/getUnverify',
        method: 'post',
        data: {
          partnerType: this.scene,
          partnerName: this.writingOffQuerySave.name,
          dayType: this.writingOffQuerySave.periodType,
          orderNo: this.writingOffQuerySave.orderNo,
          truckNo: this.writingOffQuerySave.truckNo,
          startTime: this.writingOffQuerySave.period[0] ? this.writingOffQuerySave.period[0].getTime() : '',
          endTime: this.writingOffQuerySave.period[1] ? this.writingOffQuerySave.period[1].getTime() + 86400000 : ''
        }
      }).then(res => {
        this.companyData = res.data.data.map((item, index) => {
          return Object.assign({}, item, {
            calcTotalFeeText: (item.calcTotalFee / 100).toFixed(2),
            verifiedFeeText: (item.verifiedFee / 100).toFixed(2),
            id: item.partnerName + index
          })
        })
        if (this.currentPartner.partnerName && this.companyData.some(item => item.id === this.currentPartner.id)) {
          this.showOrderData(this.companyData.find(item => this.currentPartner.partnerName === item.partnerName))
        } else {
          this.orderData = []
        }
      })
    },
    showOrderData (data) {
      this.companyDataActive = data.id
      this.currentPartner = data
      this.orderData = data.orderInfos.map(item => {
        let count = 0
        if (item.listMultiPay) { // 按单结算才有
          item.listMultiPay.map(paylist => {
            if (paylist.verifyStatus === 0) {
              count++
            }
          })
        }
        return Object.assign({}, item, {
          unPayCount: count, // 未核销笔数
          carrierWaybillNo: item.carrierWaybillNo ? item.carrierWaybillNo : '-',
          departureName: item.departureName ? item.departureName : '-',
          destinationName: item.destinationName ? item.destinationName : '-',
          orderNo: item.orderNo ? item.orderNo : '-',
          truckNo: item.truckNo ? item.truckNo : '-',
          totalFeeText: item.totalFee !== '' ? (item.totalFee / 100).toFixed(2) : '-',
          settleTypeDesc: item.settleTypeDesc ? item.settleTypeDesc : '-',
          orderStatusDesc: item.orderStatusDesc ? item.orderStatusDesc : '-',
          // _disabled: !!item.isMultiPay,
          title: data.partnerName,
          calcTotalFeeText: data.calcTotalFeeText,
          verifiedFeeText: data.verifiedFeeText
        })
      })
    },
    // 批量核销异常弹框
    errDialog (errList) {
      this.openDialog({
        name: 'finance/dialogs/errorDiolog',
        data: {
          title: '操作提示',
          errList: errList
        },
        methods: {
          ok () {
            console.log('ok!')
          }
        }
      })
    },
    // 批量校验单子是否可以核销
    batchCheckOrder () {
      if (this.selectedIds.length > 1) {
        // 首先统计月结单子
        let monthList = []
        // 按单结单
        let checkList = []
        this.selectedList.map(item => {
          if (item.settleType === 4) {
            monthList.push(item.orderNo)
          } else if (item.settleType === 50) { // 按单结
            if (item.listMultiPay) {
              item.listMultiPay.map(list => {
                if (list.verifyStatus === 0) checkList.push(list.id)
              })
            }
          }
        })
        let errList = []
        if (monthList.length > 0) { // 存在月结单
          errList.push({
            title: '以下单据是月结，不能批量核销',
            arr: monthList
          })
        }
        if (checkList.length === 0) { // 按单结单子没有，不用判断异常，直接弹窗提示存在月结单
          if (errList.length > 0) this.errDialog(errList)
          return
        }
        Server({
          url: '/finance/verify/batchCheckOrder',
          method: 'post',
          data: {
            ids: checkList,
            verifyType: 2
          }
        }).then(res => {
          if (res.data.data && res.data.data.operateCode === 1) { // 存在异常
            errList.push({
              title: '以下单据因为存在异常，不能批量核销',
              arr: res.data.data.orderNos
            })
          }
          if (errList.length === 0) { // 不存在异常且不存在月结单，可以批量核销
            this.batchVerifyOrder()
          } else {
            this.errDialog(errList)
          }
        })
      } else {
        this.$Message.warning('请选择2条以上的数据')
      }
    },
    // 批量可以核销
    batchVerifyOrder () {
      this.openDialog({
        name: 'finance/dialogs/bulkVerifyDialog',
        data: {
          title: '批量核销',
          list: this.batchData()
        },
        methods: {
          freshSheet () {
            // 刷新
            this.loadData()
          }
        }
      })
    },
    // 批量核销凑数据
    batchData () {
      let arr = []
      for (let key in this.payTypeMap) {
        let obj = {
          label: this.payTypeMap[key],
          payType: parseInt(key),
          count: 0,
          money: 0,
          value: ''
        }
        this.selectedList.map(item => {
          item.listMultiPay.map(list => {
            if (list.verifyStatus === 0 && obj.payType === list.payType) {
              obj.count++
              obj.money += list.amount
              obj.value += list.id + ','
            }
          })
        })
        arr.push(obj)
      }
      return arr
    }
  }
}
</script>
<style lang='stylus' scoped>
  .tableList /deep/ .ivu-checkbox-inner
    left 1px
  .writing-off
    margin-top: 35px
    /deep/ .ivu-btn
      width: 86px
    .btns-box
      line-height 32px
      display flex
      display -ms-flexbox
      justify-content space-between
      -ms-flex-pack justify
      padding 9px 0
      div
        color #333
        font-weight 500
        font-size 14px
    .query-box
      padding: 20px 10px
      margin-bottom: 20px
      background-color: #f9f9f9
      /deep/ .ivu-form-item
        margin-bottom: 0
        width: 100%
      .mediaClass
        margin-top 22px
    .list-box
      display flex
      display -ms-flexbox
      margin 0 -15px
      margin-bottom -20px
      border-top 1px solid #E4E7EC
      .leftList
        height 100%
        overflow-y hidden
        width 270px
        flex 0 0 270px
        -ms-flex 0 0 270px
        border-right 1px solid #E4E7EC
        &:hover
          height 100%
          overflow-y auto
        .list
          position relative
          list-style none
          height 60px
          line-height 60px
          display flex
          display -ms-flexbox
          border-bottom 1px solid #E4E7EC
          &.companyDataActive
            background #E9FCFF
          &:hover
            background #E9FCFF
          .icon
            flex 0 0 60px
            -ms-flex 0 0 60px
            text-align center
            position relative
            &:after
              position absolute
              bottom -1px
              content ''
              display block
              height 1px
              width 15px
              border-top  1px solid #fff
            i
              display inline-block
              width 30px
              height 30px
              background #f9f9f9
              border-radius 50%
              line-height 30px
              &:after
                border none
          .content
            /*flex 1*/
            /*-ms-flex 1*/
            font-size 12px
            .ruleName
              height 30px
              line-height 1
              padding-top 11px
              color #333
              font-weight bold
            .tips
              width 200px
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              height 30px
              line-height 1
              padding-top 6px
              color #999
          .num
            /*flex 0 0 35px*/
            /*-ms-flex 0 0 35px*/
            position absolute
            top 5px
            right 10px
            height 30px
            line-height 30px
            color #666
            font-size 12px
      .order-list
        height 100%
        overflow-y auto
        flex 1
        -ms-flex 1
        padding 19px 20px 20px 9px
        /deep/ .ivu-table-cell
          padding-left: 5px
          padding-right: 5px
        /*&:hover*/
          /*height 100%*/
          /*overflow-y auto*/
        .title
          padding-bottom 10px
          margin-bottom 20px
          overflow hidden
          border-bottom 1px solid #e4e7ec
          .text
            float left
            .desc_title
              line-height: 22px
              font-size: 14px
              color: #333
              font-weight: 500
            .desc_money
              line-height: 22px
              font-size: 12px
              color: #999
          .btn
            float right
      .data-empty
        .data-empty-img
          display: block
          width 70px
          height: auto
          margin 100px auto 12px
        p
          color #999999
          text-align center
</style>
