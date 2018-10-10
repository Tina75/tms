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
          <Col span="8">
          <FormItem label="创建时间" style="width: 100%">
            <DatePicker v-model="checkingOrderQuery.period"  type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="开始时间-结束时间" style="width: 200px" />
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
      <Page :current.sync="checkingOrderQuerySave.pageNo" :total="orderData.totalCount" :page-size="checkingOrderQuerySave.size"  size="small" show-elevator show-total show-sizer @on-change="getCheckList" @on-page-size-change="resetPageSize"/>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'

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
        period: []
      },
      checkingOrderQuerySave: {
        name: '',
        period: [],
        sortDesc: true,
        pageNo: 1,
        pageSize: 10
      },
      orderData: {
        totalCount: 0,
        list: []
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
  mounted () {
    this.getCheckList()
  },
  methods: {
    startQuery () {
      Object.assign(this.checkingOrderQuerySave, this.checkingOrderQuery)
      this.getCheckList()
    },
    resetQuery () {
      this.checkingOrderQuery = {
        name: '',
        periodType: '1',
        period: []
      }
    },
    writeOff (data) {
      let _this = this
      this.openDialog({
        name: 'finance/dialogs/writeOff',
        data: {
          id: data.row.reconcileId,
          scene: this.scene,
          verifyType: 3,
          isOil: 0,
          needPay: data.row.totalFeeText
        },
        methods: {
          ok () {
            _this.loadData()
          }
        }
      })
    },
    exportOrder (data) {
      Export({
        url: '/finance/reconcile/export',
        method: 'GET',
        params: {
          reconcileId: data.row.reconcileId
        },
        fileName: '对账单'
      }).then(res => {
        this.$Message.success('导出成功')
      }).catch(err => console.error(err))
    },
    toDetail (data) {
      this.openDialog({
        name: 'finance/dialogs/orderList',
        data: {
          id: data.row.reconcileId,
          reconcileNo: data.row.reconcileNo,
          dateRange: data.row.dateRange,
          partnerName: data.row.partnerName,
          scene: this.scene
        },
        methods: {}
      })
    },
    resort () {
      this.checkingOrderQuerySave.sortDesc = !this.checkingOrderQuerySave.sortDesc
      this.checkingOrderQuerySave.pageNo = 1
      this.getCheckList()
    },
    getCheckList () {
      Server({
        url: '/finance/reconcile/list',
        method: 'get',
        params: {
          partnerType: this.scene,
          partnerName: this.checkingOrderQuerySave.name,
          orderByCreateTime: this.checkingOrderQuerySave.sortDesc ? 1 : 2,
          startTime: this.checkingOrderQuerySave.period[0] ? this.checkingOrderQuerySave.period[0].getTime() : '',
          endTime: this.checkingOrderQuerySave.period[1] ? this.checkingOrderQuerySave.period[1].getTime() : '',
          pageNo: this.checkingOrderQuerySave.pageNo,
          pageSize: this.checkingOrderQuerySave.pageSize
        }
      }).then(res => {
        this.orderData.totalCount = res.data.data.reconcileList.totalCount
        this.orderData.list = res.data.data.reconcileList.map(item => {
          return Object.assign({}, item, {
            totalFeeText: (item.totalFee / 100).toFixed(2)
          })
        })
      }).catch(err => console.error(err))
    },
    resetPageSize (size) {
      this.checkingOrderQuerySave.pageNo = 1
      this.checkingOrderQuerySave.pageSize = size
      this.getCheckList()
    }
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
</style>
