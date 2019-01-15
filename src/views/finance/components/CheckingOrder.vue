<!-- 对账单 -->
<template>
  <div class="checking-order">
    <div class="query-box">
      <Form :model="checkingOrderQuery" label-position="left" inline>
        <Row>
          <Col span="6" style="margin-right: 50px">
          <FormItem :label-width="65" :label="sceneMap[scene] + '：'">
            <Input v-model="checkingOrderQuery.name" :placeholder="`请输入${sceneMap[scene]}名称`"/>
          </FormItem>
          </Col>
          <Col span="8" style="margin-right: 20px">
          <FormItem :label-width="75" label="创建时间：">
            <DatePicker v-model="checkingOrderQuery.period" :options="dateOption" transfer type="daterange" format="yyyy-MM-dd" class="date-item" placeholder="开始时间-结束时间" />
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
      <Table :columns="orderColumn" :data="orderData.list" height="500" @on-sort-change="resort"></Table>
      <Page :current.sync="checkingOrderQuerySave.pageNo" :total="orderData.totalCount" :page-size="checkingOrderQuerySave.size"  size="small" show-elevator show-total show-sizer @on-change="getCheckList" @on-page-size-change="resetPageSize"/>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
// import float from '@/libs/js/float'
import { getFeeText, roundFee } from '@/libs/js/config'
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
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
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
            let renderHtml = []
            if ((this.scene === 1 && this.hasPower(170103)) || (this.scene === 2 && this.hasPower(170203)) || (this.scene === 3 && this.hasPower(170303))) {
              renderHtml.push(h('a', {
                on: {
                  click: () => {
                    this.writeOff(params)
                  }
                },
                style: {
                  marginRight: '10px'
                }
              }, '核销'))
            }
            if ((this.scene === 1 && this.hasPower(170104)) || (this.scene === 2 && this.hasPower(170204)) || (this.scene === 3 && this.hasPower(170304))) {
              renderHtml.push(h('a', {
                on: {
                  click: () => {
                    this.exportOrder(params)
                  }
                }
              }, '导出'))
            }
            return renderHtml
            // return [(this.scene === 1 && this.hasPower(170103)) || (this.scene === 2 && this.hasPower(170203)) || (this.scene === 3 && this.hasPower(170303)) ? h('a', {
            //   on: {
            //     click: () => {
            //       this.writeOff(params)
            //     }
            //   },
            //   style: {
            //     marginRight: '10px'
            //   }
            // }, '核销') : '', (this.scene === 1 && this.hasPower(170104)) || (this.scene === 2 && this.hasPower(170204)) || (this.scene === 3 && this.hasPower(170304)) ? h('a', {
            //   on: {
            //     click: () => {
            //       this.exportOrder(params)
            //     }
            //   }
            // }, '导出') : '']
          }
        },
        {
          title: '对账批次号',
          width: 160,
          key: 'reconcileNo',
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
      this.startQuery()
    },
    writeOffOk (data) {
      let _this = this
      this.openDialog({
        name: 'finance/dialogs/writeOff',
        data: {
          id: data.row.reconcileId,
          scene: this.scene,
          verifyType: 3,
          isOil: 0,
          needPay: roundFee(data.row.totalFeeText)
        },
        methods: {
          ok () {
            _this.getCheckList()
          }
        }
      })
    },
    writeOff (data) {
      Server({
        url: '/finance/verify/checkOrder',
        method: 'post',
        data: {
          id: data.row.reconcileId,
          verifyType: 3
        }
      }).then(res => {
        if (res.data.data === '') {
          this.writeOffOk(data)
        } else if (res.data.data && res.data.data.operateCode === 1) {
          // 存在异常
          this.$Toast.warning({
            title: '核销',
            content: '以下单据存在异常，无法核销',
            render: (h) => {
              const list = res.data.data.orderNos.length > 0 ? res.data.data.orderNos.map(item => {
                return h('p', item)
              }) : []
              return h('div', [
                ...list
              ])
            },
            okText: '确认',
            cancelText: '取消'
          })
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
      })
    },
    toDetail (data) {
      const _this = this
      this.openDialog({
        name: 'finance/dialogs/orderList',
        data: {
          id: data.row.reconcileId,
          reconcileNo: data.row.reconcileNo,
          dateRange: data.row.dateRange,
          partnerName: data.row.partnerName,
          scene: this.scene
        },
        methods: {
          ok () {
            _this.getCheckList()
          }
        }
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
          orderByCreateTime: this.checkingOrderQuerySave.sortDesc ? 2 : 1,
          startTime: this.checkingOrderQuerySave.period[0] ? this.checkingOrderQuerySave.period[0].getTime() : '',
          endTime: this.checkingOrderQuerySave.period[1] ? this.checkingOrderQuerySave.period[1].getTime() + 86400000 : '',
          pageNo: this.checkingOrderQuerySave.pageNo,
          pageSize: this.checkingOrderQuerySave.pageSize
        }
      }).then(res => {
        this.orderData.totalCount = res.data.data.reconcileList.totalCount
        this.orderData.list = res.data.data.reconcileList.map(item => {
          return Object.assign({}, item, {
            totalFeeText: getFeeText(item.totalFee)
          })
        })
      })
    },
    resetPageSize (size) {
      this.checkingOrderQuerySave.pageNo = 1
      this.checkingOrderQuerySave.pageSize = size
      this.getCheckList()
    }
  }
}
</script>
<style lang='stylus' scoped>
  .checking-order
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
        .date-item
          width: 100%
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
