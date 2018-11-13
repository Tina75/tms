<!--  -->
<template>
  <div class="written-off">
    <div class="query-box">
      <Form :model="writtenOffQuery" label-position="left" inline>
        <Row>
          <Col span="6" style="margin-right: 25px">
          <FormItem :label-width="65" :label="sceneMap[scene] + '：'">
            <Input v-model="writtenOffQuery.name" :placeholder="`请输入${sceneMap[scene]}名称`"/>
          </FormItem>
          </Col>
          <Col span="5" style="margin-right: 20px">
          <FormItem :label-width="75" label="核销时间：">
            <DatePicker v-model="writtenOffQuery.period" :options="dateOption" type="daterange" format="yyyy-MM-dd" placeholder="开始时间-结束时间" style="width: 100%" />
          </FormItem>
          </Col>
          <Col span="2" style="margin-right: 10px">
          <FormItem>
            <Select v-model="writtenOffQuery.orderType">
              <Option v-for="(value, key) in orderTypeMap[scene]" :key="key" :value="key">{{value}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="4" style="margin-right: 10px">
          <FormItem>
            <Input v-model="writtenOffQuery.orderNo" :placeholder="`请输入${orderTypeMap[scene][writtenOffQuery.orderType]}`"/>
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
      <Button v-if="(hasPower(170106) && scene === 1) || (hasPower(170206) && scene === 2) || (hasPower(170306) && scene === 3)" type="primary" @click="exportWrittenOff">导出</Button>
    </div>
    <div class="list-box">
      <Table :columns="orderColumn" :data="writtenOffData.list" :no-data-text="noDataText" height="500" @on-sort-change="resort" @on-selection-change="setOrderIds"></Table>
      <Page :current.sync="writtenOffQuerySave.pageNo" :total="writtenOffData.totalCount" :page-size="writtenOffQuerySave.pageSize"  size="small" show-elevator show-total show-sizer @on-change="getWrittenOffList" @on-page-size-change="resetPageSize"/>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'

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
      noDataText: '<span><i class="icon font_family icon-ico-nodata"></i>&nbsp;暂无数据~</span>',
      sceneMap: {
        1: '发货方',
        2: '承运商',
        3: '外转方'
      },
      orderNameMap: {
        1: '对账批次号/订单号',
        2: '对账批次号/运单号/提货单号',
        3: '对账批次号/外转单号'
      },
      orderTypeMap: {
        1: {
          1: '订单号',
          5: '对账批次号'
        },
        2: {
          2: '运单号',
          3: '提货单号',
          5: '对账批次号'
        },
        3: {
          4: '外转单号',
          5: '对账批次号'
        }
      },
      defaultOrderType: {
        1: '1',
        2: '2',
        3: '4'
      },
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      writtenOffQuery: {
        name: '',
        orderType: '',
        period: [],
        orderNo: ''
      },
      writtenOffQuerySave: {
        name: '',
        orderType: '1',
        period: [],
        orderNo: '',
        sortDesc: true,
        pageNo: 1,
        pageSize: 10
      },
      writtenOffData: {
        totalCount: 100,
        list: []
      },
      selectedIds: []
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
          width: 160,
          key: 'verifyNo',
          render: (h, params) => {
            return (this.scene === 1 && this.hasPower(170105)) || (this.scene === 2 && this.hasPower(170205)) || (this.scene === 3 && this.hasPower(170305)) ? h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.toDetail(params)
                }
              }
            }, params.row.verifyNo) : ''
          }
        },
        {
          title: this.orderNameMap[this.scene],
          width: 200,
          key: 'orderNo'
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
  watch: {
    scene () {
      this.writtenOffQuery.orderType = this.defaultOrderType[this.scene]
    }
  },
  mounted () {
    this.writtenOffQuery.orderType = this.defaultOrderType[this.scene]
    this.getWrittenOffList()
  },
  methods: {
    setOrderIds (data) {
      this.selectedIds = data.map(item => item.verifyId)
    },
    startQuery () {
      Object.assign(this.writtenOffQuerySave, this.writtenOffQuery)
      this.getWrittenOffList()
    },
    resetQuery () {
      this.writtenOffQuery.name = ''
      this.writtenOffQuery.orderType = this.defaultOrderType[this.scene]
      this.writtenOffQuery.period = []
      this.writtenOffQuery.orderNo = ''
      this.startQuery()
    },
    exportWrittenOff () {
      if (this.selectedIds.length > 0) {
        Export({
          url: '/finance/verify/export',
          method: 'post',
          data: {
            verifyIds: this.selectedIds,
            partnerType: this.scene
          },
          fileName: '核销单'
        }).then(res => {
        }).catch(err => console.error(err))
      } else {
        this.$Message.warning('请选择1条以上的数据')
      }
    },
    toDetail (data) {
      this.openTab({
        title: data.row.verifyNo,
        path: '/finance/writtenOffDetail',
        query: {
          verifyId: data.row.verifyId,
          verifyNo: data.row.verifyNo,
          dateRange: data.row.dateRange,
          partnerName: data.row.partnerName,
          scene: this.scene
        }
      })
    },
    resort () {
      this.writtenOffQuerySave.sortDesc = !this.writtenOffQuerySave.sortDesc
      this.writtenOffQuerySave.pageNo = 1
      this.getWrittenOffList()
    },
    getWrittenOffList () {
      Server({
        url: '/finance/verify/list',
        method: 'get',
        params: {
          partnerType: this.scene,
          partnerName: this.writtenOffQuerySave.name,
          orderByCreateTime: this.writtenOffQuerySave.sortDesc ? 2 : 1,
          startTime: this.writtenOffQuerySave.period[0] ? this.writtenOffQuerySave.period[0].getTime() : '',
          endTime: this.writtenOffQuerySave.period[1] ? this.writtenOffQuerySave.period[1].getTime() + 86400000 : '',
          orderType: this.writtenOffQuerySave.orderType,
          orderNo: this.writtenOffQuerySave.orderNo,
          pageNo: this.writtenOffQuerySave.pageNo,
          pageSize: this.writtenOffQuerySave.pageSize
        }
      }).then(res => {
        this.writtenOffData.totalCount = res.data.data.totalCount
        this.writtenOffData.list = res.data.data.dataList.map(item => {
          return Object.assign({}, item, {
            totalFeeText: (item.totalFee / 100).toFixed(2)
          })
        })
      }).catch(err => console.error(err))
    },
    resetPageSize (size) {
      this.writtenOffQuerySave.pageNo = 1
      this.writtenOffQuerySave.pageSize = size
      this.getWrittenOffList()
    }
  }
}
</script>
<style lang='stylus' scoped>
  .written-off
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
