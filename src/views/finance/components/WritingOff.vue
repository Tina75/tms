<!--  -->
<template>
  <div class="writing-off">
    <div class="btns-box">
      <Button v-if="(hasePower(170102) && scene === 1) || (hasePower(170202) && scene === 2) || (hasePower(170302) && scene === 3)" type="primary" @click="createBill">生成对账单</Button>
    </div>
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
    <div class="list-box">
      <Row :gutter="20">
        <Col span="8">
        <Table :columns="companyColumn" :data="companyData" height="500" highlight-row @on-row-click="showOrderData"></Table>
        </Col>
        <Col span="16" class="order-list">
        <div v-if="!currentPartner.partnerName || !orderData.length" class="data-empty">
          <img src="../../../assets/img-empty.png" class="data-empty-img">
          <p>请点击左侧{{sceneMap[scene]}}列表查看{{orderNameMap[scene]}}哦～</p>
        </div>
        <Table v-else :columns="orderColumn" :data="orderData" height="500" @on-selection-change="setOrderIds"></Table>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import Server from '@/libs/js/server'

export default {
  name: 'writingOff',
  mixins: [ BaseComponent ],
  props: {
    scene: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
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
          width: 140,
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
          width: 50
        },
        {
          title: '操作',
          width: 60,
          key: 'action',
          render: (h, params) => {
            return (this.scene === 1 && this.hasePower(170101)) || (this.scene === 2 && this.hasePower(170201)) || (this.scene === 3 && this.hasePower(170301)) ? h('a', {
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
          width: 160,
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
        {
          title: '合计运费',
          key: 'totalFeeText'
        },
        {
          title: '结算方式',
          width: 110,
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
          width: 100,
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
<style lang='stylus'>
  .writing-off
    margin: 35px 0 15px
    /deep/ .ivu-btn
      width: 86px
    .btns-box
      margin-bottom: 20px
    .query-box
      padding: 20px 10px
      margin-bottom: 20px
      background-color: #f9f9f9
      /deep/ .ivu-form-item
        margin-bottom: 0
        width: 100%
    .order-list
      /deep/ .ivu-table-cell
        padding-left: 5px
        padding-right: 5px
    .data-empty
      display flex
      flex-direction column
      justify-content center
      align-items center
      height 500px
      border 1px solid #dcdee2
      .data-empty-img
        width 70px
        margin-bottom 12px
      p
        color #999999
        text-align center
</style>
