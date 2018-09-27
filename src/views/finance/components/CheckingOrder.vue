<!--  -->
<template>
  <div class="checking-order">
    <div class="query-box">
      <Form :model="checkingOrderQuery" inline>
        <Row>
          <Col span="6">
          <FormItem :label-width="100" :label="sceneMap[scene]">
            <Input v-model="checkingOrderQuery.name" :placeholder="`请输入${sceneMap[scene]}名称`"/>
          </FormItem>
          </Col>
          <Col span="2">
          <FormItem>
            <Select v-model="checkingOrderQuery.periodType" clearable>
              <Option v-for="(value, key) in periodTypeMap" :key="key" :value="key">{{value}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem>
            <DatePicker v-model="checkingOrderQuery.period"  type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="开始时间-结束时间" style="width: 300px" />
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
      <Table :columns="orderColumn" :data="orderData.list" height="500" @on-sort-change="resort"></Table>
      <Page :current.sync="checkingOrderQuery.pageNo" :total="orderData.totalCount" :page-size="checkingOrderQuery.size"  size="small" show-elevator show-total show-sizer @on-change="getCheckList"/>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'

export default {
  name: 'checkingOrder',
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
      periodTypeMap: {
        1: '下单时间',
        2: '到货日期',
        3: '回单日期'
      },
      checkingOrderQuery: {
        name: '',
        periodType: '1',
        period: [],
        pageNo: 1,
        pageSize: 10
      },
      orderData: {
        totalCount: 100,
        list: [
          {
            reconcileNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            reconcileNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            reconcileNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            reconcileNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            reconcileNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            reconcileNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            reconcileNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          }
        ]
      }
    }
  },
  computed: {
    orderColumn () {
      return [
        {
          title: '操作',
          width: 120,
          key: 'action',
          render: (h, params) => {
            return [h('a', {
              on: {
                click: () => {
                  this.writeOff(params)
                }
              },
              style: {
                marginRight: '10px'
              }
            }, '核销'), h('a', {
              on: {
                click: () => {
                  this.exportOrder(params)
                }
              }
            }, '导出')]
          }
        },
        {
          title: '对账批次号',
          width: 140,
          key: 'reconcileNo',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.toDetail(params)
                }
              }
            }, params.row.reconcileNo)
          }
        },
        {
          title: '日期范围',
          key: 'dateRange'
        },
        {
          title: this.sceneMap[this.scene],
          key: 'partnerName'
        },
        {
          title: '合计运费',
          key: 'totalFeeText'
        },
        {
          title: '单数',
          key: 'orderNum'
        },
        {
          title: '创建时间',
          width: 160,
          key: 'createTime',
          sortable: 'custom',
          render: (h, params) => {
            return h('span', {}, new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm'))
          }
        }
      ]
    }
  },
  mounted () {},
  methods: {
    startQuery () {},
    resetQuery () {},
    writeOff (data) {},
    exportOrder (data) {},
    toDetail (data) {
      this.openDialog({
        name: 'finance/dialogs/orderList',
        data: {
          id: data.row.id,
          reconcileNo: data.row.reconcileNo,
          dateRange: data.row.dateRange,
          partnerName: data.row.partnerName,
          scene: this.scene
        },
        methods: {}
      })
    },
    resort () {},
    getCheckList () {}
  }
}
</script>
<style lang='stylus'>
  .checking-order
    margin: 35px 0 15px
    .btns-box
      margin-bottom: 20px
    .query-box
      padding: 20px 0
      margin-bottom: 20px
      background-color: #f9f9f9
      /deep/ .ivu-form-item
        margin-bottom: 0
    .list-box
      text-align: right
      /deep/ .ivu-table-wrapper
        margin-bottom: 20px
      /deep/ .ivu-page-item-active
        background-color: #00a4bd
        border-radius: 5px
        a
          color: #ffffff
</style>
