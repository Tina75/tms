<!--  -->
<template>
  <div class="written-off">
    <div class="btns-box">
      <Button type="primary" @click="exportWrittenOff">导出</Button>
    </div>
    <div class="query-box">
      <Form :model="writtenOffQuery" inline>
        <Row>
          <Col span="6">
          <FormItem :label-width="100" :label="sceneMap[scene]">
            <Input v-model="writtenOffQuery.name" :placeholder="`请输入${sceneMap[scene]}名称`"/>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="核销时间">
            <DatePicker v-model="writtenOffQuery.period"  type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="开始时间-结束时间" style="width: 180px" />
          </FormItem>
          </Col>
          <Col span="2">
          <FormItem>
            <Select v-model="writtenOffQuery.orderType" clearable>
              <Option v-for="(value, key) in orderTypeMap[scene]" :key="key" :value="key">{{value}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem>
            <Input v-model="writtenOffQuery.verifyNo" :placeholder="`请输入${orderTypeMap[scene][writtenOffQuery.orderType]}`"/>
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
      <Table :columns="orderColumn" :data="writtenOffData.list" height="500" @on-sort-change="resort"></Table>
      <Page :current.sync="writtenOffQuery.pageNo" :total="writtenOffData.totalCount" :page-size="writtenOffQuery.size"  size="small" show-elevator show-total show-sizer @on-change="getWrittenOffList"/>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'

export default {
  name: 'writtenOff',
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
      orderTypeMap: {
        1: {
          1: '订单号',
          4: '对账批次号'
        },
        2: {
          2: '运单号',
          3: '提货单号',
          4: '对账批次号'
        },
        3: {
          5: '外转单号',
          4: '对账批次号'
        }
      },
      writtenOffQuery: {
        name: '',
        orderType: '1',
        period: [],
        verifyNo: '',
        pageNo: 1,
        pageSize: 10
      },
      writtenOffData: {
        totalCount: 100,
        list: [
          {
            verifyNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            truckNumber: '赣B12345',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            verifyNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            truckNumber: '赣B12345',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            verifyNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            truckNumber: '赣B12345',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            verifyNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            truckNumber: '赣B12345',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            verifyNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            truckNumber: '赣B12345',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            verifyNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            totalFeeText: '1000',
            orderNum: '200',
            createTime: new Date().getTime()
          },
          {
            verifyNo: '7777777777777',
            dateRange: '2018-09-25到2018-09-28',
            partnerName: '秦天师',
            truckNumber: '赣B12345',
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
          type: 'selection',
          width: 50
        },
        {
          title: '核销单号',
          width: 140,
          key: 'verifyNo',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.toDetail(params)
                }
              }
            }, params.row.verifyNo)
          }
        },
        {
          title: this.sceneMap[this.scene] + '名称',
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
          title: '核销时间',
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
    exportWrittenOff (data) {},
    toDetail (data) {
      this.openTab({
        title: '对账单详情',
        path: '/finance/writtenOffDetail',
        query: {
          id: data.row.orderNo,
          orderId: data.row.id,
          verifyNo: data.row.verifyNo,
          dateRange: data.row.dateRange,
          partnerName: data.row.partnerName,
          scene: this.scene
        }
      })
    },
    resort () {},
    getWrittenOffList () {}
  }
}
</script>
<style lang='stylus'>
  .written-off
    margin: 35px 0 15px
    .btns-box
      margin-bottom: 20px
    .query-box
      padding: 20px 0
      margin-bottom: 20px
      background-color: #f9f9f9
      /deep/ .ivu-form-item
        margin-bottom: 0
      /deep/ .ivu-form-item-content
        display: grid
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
