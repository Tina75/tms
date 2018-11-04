<!--  -->
<template>
  <div class="writing-off">
    <div class="query-box">
      <Form :model="writingOffQuery" label-position="left" inline>
        <Row>
          <Col span="6" style="margin-right: 50px">
          <FormItem :label-width="65" :label="sceneMap[scene] + '：'">
            <Input v-model="writingOffQuery.name" :placeholder="`请输入${sceneMap[scene]}名称`"/>
          </FormItem>
          </Col>
          <Col span="2" style="margin-right: 10px">
          <FormItem>
            <Select v-model="writingOffQuery.periodType">
              <Option v-for="(value, key) in periodTypeMap" v-if="key === '1' || key === '2' || (scene === 1 && key === '3')" :key="key" :value="key">{{value}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8" style="margin-right: 20px">
          <FormItem>
            <DatePicker v-model="writingOffQuery.period" :options="dateOption" type="daterange" format="yyyy-MM-dd" placeholder="开始时间-结束时间" style="width: 100%" />
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem>
            <Button type="primary" style="margin-right: 10px" @click="startQuery">搜索</Button>
            <Button type="default" @click="resetQuery">清除条件</Button>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="btns-box">
      <div>发货方对账列表</div>
      <Button v-if="(hasPower(170102) && scene === 1) || (hasPower(170202) && scene === 2) || (hasPower(170302) && scene === 3)" type="primary" @click="createBill">生成对账单</Button>
    </div>
    <div  :style="{height: height + 108 + 'px'}" class="list-box">
      <ul class="leftList">
        <li v-for="(item,index) in companyData" :class="{companyDataActive:companyDataActive === item.partnerName}" :key="index" class="list" @click="showOrderData(item)">
          <!--<Table :columns="companyColumn" :data="companyData" height="500" highlight-row @on-row-click="showOrderData"></Table>-->
          <div class="icon">
            <FontIcon slot="icon" type="ico-price" ></FontIcon>
          </div>
          <div class="content">
            <div v-if="item.partnerName.length<8" class="ruleName">{{item.partnerName}}</div>
            <Tooltip v-else :content="item.partnerName" max-width="200" class="ruleName" placement="top-start" style="display: list-item">
              <div >{{item.partnerName.slice(0,8)}}...</div>
            </Tooltip>
            <div class="tips">
              <span style="margin-right: 30px">应付 {{item.calcTotalFeeText}}</span>
              <span>已结 {{item.verifiedFeeText}}</span>
            </div>
          </div>
          <div class="num">
            {{item.orderNum}}单
          </div>
        </li>
      </ul>
      <div class="order-list">
        <div v-if="!currentPartner.partnerName || !orderData.length" class="data-empty">
          <img src="../../../assets/img-empty.png" class="data-empty-img">
          <p>请点击左侧{{sceneMap[scene]}}列表查看{{orderNameMap[scene]}}哦～</p>
        </div>
        <Table v-else :columns="orderColumn" :data="orderData"  @on-selection-change="setOrderIds"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import Server from '@/libs/js/server'
import FontIcon from '@/components/FontIcon'

export default {
  name: 'writingOff',
  components: {
    FontIcon
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
        period: []
      },
      writingOffQuerySave: {
        name: '',
        periodType: '1',
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
      currentPartner: {}
    }
  },
  computed: {
    companyColumn () {
      return [
        {
          title: this.sceneMap[this.scene] + '名称',
          // width: 140,
          key: 'partnerName'
        },
        {
          title: '总单数',
          key: 'orderNum'
        },
        {
          title: this.scene === 1 ? '应收总额' : '应付总额',
          key: 'calcTotalFeeText'
        },
        {
          title: '已结款',
          key: 'verifiedFeeText'
        }
      ]
    },
    orderColumn () {
      return [
        {
          type: 'selection',
          width: 20
        },
        {
          title: '操作',
          width: 40,
          key: 'action',
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
          width: 140,
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
          key: 'truckNo',
          width: 80
        } : {
          title: ' ',
          width: 1
        },
        {
          title: '合计运费',
          key: 'totalFeeText'
        },
        {
          title: '结算方式',
          width: 80,
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
          }
        },
        {
          title: '状态',
          width: 50,
          key: 'orderStatusDesc',
          filters: this.orderStatusMap[this.scene],
          filterMethod (value, row) {
            return row.orderStatusDesc === value
          }
        }
      ]
    }
  },
  mounted () {
    this.loadData()
    this.height = document.body.clientHeight - 50 - 15 * 2 - 20 * 2 + 15 - 65 - 72 - 50
  },
  methods: {
    setOrderIds (data) {
      this.selectedIds = data.map(item => item.id)
    },
    createBill () {
      const _this = this
      if (this.selectedIds.length > 1) {
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
      } else {
        this.$Message.warning('请选择2条以上的数据')
      }
    },
    startQuery () {
      this.orderData = []
      this.writingOffQuerySave = this.writingOffQuery
      this.loadData()
    },
    resetQuery () {
      this.writingOffQuery = {
        name: '',
        periodType: '1',
        period: []
      }
      this.startQuery()
    },
    writeOff (data) {
      const _this = this
      if (data.row.isMultiPay) {
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
        this.openDialog({
          name: 'finance/dialogs/writeOff',
          data: {
            id: data.row.id,
            verifyType: 1,
            isOil: 0,
            scene: this.scene,
            needPay: data.row.totalFeeText,
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
    toDetail (data) {
      switch (data.row.orderType) {
        case 1:
          this.openTab({
            path: '/order-management/detail',
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
        method: 'get',
        params: {
          partnerType: this.scene,
          partnerName: this.writingOffQuerySave.name,
          dayType: this.writingOffQuerySave.periodType,
          startTime: this.writingOffQuerySave.period[0] ? this.writingOffQuerySave.period[0].getTime() : '',
          endTime: this.writingOffQuerySave.period[1] ? this.writingOffQuerySave.period[1].getTime() + 86400000 : ''
        }
      }).then(res => {
        this.companyData = res.data.data.map(item => {
          return Object.assign({}, item, {
            calcTotalFeeText: (item.calcTotalFee / 100).toFixed(2),
            verifiedFeeText: (item.verifiedFee / 100).toFixed(2)
          })
        })
        if (this.currentPartner.partnerName && this.companyData.some(item => item.partnerName === this.currentPartner.partnerName)) {
          this.showOrderData(this.companyData.find(item => this.currentPartner.partnerName === item.partnerName))
        } else {
          this.orderData = []
        }
      }).catch(err => console.error(err))
    },
    showOrderData (data) {
      this.companyDataActive = data.partnerName
      this.currentPartner = data
      this.orderData = data.orderInfos.map(item => {
        return Object.assign({}, item, {
          totalFeeText: (item.totalFee / 100).toFixed(2),
          _disabled: !!item.isMultiPay
        })
      })
    }
  }
}
</script>
<style lang='stylus' scoped>
  .writing-off
    margin-top: 35px
    /deep/ .ivu-btn
      width: 86px
    .btns-box
      line-height 32px
      display flex
      justify-content space-between
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
    .list-box
      display flex
      border-top 1px solid #C9CED9
      margin 0 -15px
      margin-bottom -20px
      .leftList
        height 100%
        overflow-y auto
        flex 0 0 270px
        border-right 1px solid #E4E7EC
        .list
          list-style none
          height 60px
          line-height 60px
          display flex
          border-bottom 1px solid #E4E7EC
          &.companyDataActive
            background #E9FCFF
          &:hover
            background #E9FCFF
          .icon
            flex 0 0 60px
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
            flex 1
            font-size 12px
            .ruleName
              height 30px
              line-height 1
              padding-top 11px
              color #333
              font-weight bold
            .tips
              height 30px
              line-height 1
              padding-top 6px
              color #999
          .num
            flex 0 0 40px
            height 30px
            line-height 30px
            margin-right 5px
            color #666
            font-size 12px
      .order-list
        height 100%
        overflow-y auto
        flex 1
        padding 19px 20px 20px 9px
        /deep/ .ivu-table-cell
          padding-left: 5px
          padding-right: 5px
      .data-empty
        display flex
        flex-direction column
        justify-content center
        align-items center
        min-height 426px
        .data-empty-img
          width 70px
          margin-bottom 12px
        p
          color #999999
          text-align center
</style>
