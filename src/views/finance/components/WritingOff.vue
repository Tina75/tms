<!--  -->
<template>
  <div class="writing-off">
    <div class="btns-box">
      <Button type="primary" @click="createBill">生成对账单</Button>
    </div>
    <div class="query-box">
      <Form :model="writingOffQuery" inline>
        <Row>
          <Col span="6">
          <FormItem :label-width="100" :label="sceneMap[scene]">
            <Input v-model="writingOffQuery.name" :placeholder="`请输入${sceneMap[scene]}名称`"/>
          </FormItem>
          </Col>
          <Col span="2">
          <FormItem>
            <Select v-model="writingOffQuery.periodType" clearable>
              <Option v-for="(value, key) in periodTypeMap" :key="key" :value="key">{{value}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem>
            <DatePicker v-model="writingOffQuery.period"  type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="开始时间-结束时间" style="width: 300px" />
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem>
            <Row>
              <Col span="12">
              <Button type="primary" @click="startQuery">搜索</Button>
              </Col>
              <Col span="12">
              <Button type="default" @click="resetQuery">清除条件</Button>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="list-box">
      <Row :gutter="20">
        <Col span="8">
        <Table :columns="companyColumn" :data="companyData" height="500"></Table>
        </Col>
        <Col span="16">
        <Table :columns="orderColumn" :data="orderData" height="500"></Table>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'

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
      writingOffQuery: {
        name: '',
        periodType: '1',
        period: []
      },
      periodTypeMap: {
        1: '下单时间',
        2: '到货日期',
        3: '回单日期'
      },
      companyData: [
        {
          partnerName: '秦天师',
          orderNum: 18,
          calcTotalFeeText: '1822',
          verifiedFeeText: '1000'
        },
        {
          partnerName: '秦天师',
          orderNum: 18,
          calcTotalFeeText: '1822',
          verifiedFeeText: '1000'
        },
        {
          partnerName: '秦天师',
          orderNum: 18,
          calcTotalFeeText: '1822',
          verifiedFeeText: '1000'
        },
        {
          partnerName: '秦天师',
          orderNum: 18,
          calcTotalFeeText: '1822',
          verifiedFeeText: '1000'
        },
        {
          partnerName: '秦天师',
          orderNum: 18,
          calcTotalFeeText: '1822',
          verifiedFeeText: '1000'
        }
      ],
      orderData: [
        {
          displayNo: '7777777777777',
          departureName: '江苏省南京市',
          destinationName: '广东省广州市',
          totalFeeText: '1000',
          settleTypeDesc: '预付',
          statusDesc: '已到货',
          isMultiPay: 1,
          _disabled: true
        },
        {
          displayNo: '7777777777777',
          departureName: '江苏省南京市',
          destinationName: '广东省广州市',
          totalFeeText: '1000',
          settleTypeDesc: '预付',
          statusDesc: '已到货'
        },
        {
          displayNo: '7777777777777',
          departureName: '江苏省南京市',
          destinationName: '广东省广州市',
          totalFeeText: '1000',
          settleTypeDesc: '预付',
          statusDesc: '已到货'
        },
        {
          displayNo: '7777777777777',
          departureName: '江苏省南京市',
          destinationName: '广东省广州市',
          totalFeeText: '1000',
          settleTypeDesc: '预付',
          statusDesc: '已到货'
        },
        {
          displayNo: '7777777777777',
          departureName: '江苏省南京市',
          destinationName: '广东省广州市',
          totalFeeText: '1000',
          settleTypeDesc: '预付',
          statusDesc: '已到货'
        }
      ]
    }
  },
  computed: {
    companyColumn () {
      return [
        {
          title: this.sceneMap[this.scene] + '名称',
          width: 100,
          key: 'partnerName'
        },
        {
          title: '总单数',
          key: 'orderNum'
        },
        {
          title: '应收总额',
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
            return h('a', {
              on: {
                click: () => {
                  this.writeOff(params)
                }
              }
            }, '核销')
          }
        },
        {
          title: this.orderNameMap[this.scene] + '号',
          width: 140,
          key: 'displayNo',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.toDetail(params)
                }
              }
            }, params.row.displayNo)
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
          filters: this.sence === 2 ? [
            {
              label: '按单结算',
              value: '按单结算'
            },
            {
              label: '按月结算',
              value: '按月结算'
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
          title: this.orderNameMap[this.scene] + '状态',
          width: 160,
          key: 'statusDesc',
          filters: this.orderStatusMap[this.scene],
          filterMethod (value, row) {
            return row.statusDesc === value
          }
        }
      ]
    }
  },
  mounted () {},
  methods: {
    createBill () {
      this.openDialog({
        name: 'finance/dialogs/createCheck',
        data: {
          partnerName: '南京晕哒哒喽可口可乐公司',
          orderNum: '11',
          dateRange: '2018-09-01 至 2018-09-12'
        },
        methods: {}
      })
    },
    startQuery () {},
    resetQuery () {},
    writeOff (data) {
      const _this = this
      if (data.row.isMultiPay) {
        this.openDialog({
          name: 'finance/dialogs/stepPay',
          data: {
            id: data.row.id
          },
          methods: {}
        })
      } else {
        this.openDialog({
          name: 'finance/dialogs/writeOff',
          data: {
            id: data.row.id,
            verifyType: 1,
            isOil: 0,
            needPay: data.row.totalFeeText,
            settleTypeDesc: data.row.settleTypeDesc
          },
          methods: {
            ok () {
              _this.loadData()
            }
          }
        })
      }
    },
    toDetail (data) {},
    loadData () {}
  }
}
</script>
<style lang='stylus'>
  .writing-off
    margin: 35px 0 15px
    .btns-box
      margin-bottom: 20px
    .query-box
      padding: 20px 0
      margin-bottom: 20px
      background-color: #f9f9f9
      /deep/ .ivu-form-item
        margin-bottom: 0
</style>
