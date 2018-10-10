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
            <Input v-model="writtenOffQuery.orderNo" :placeholder="`请输入${orderTypeMap[scene][writtenOffQuery.orderType]}`"/>
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
      <Table :columns="orderColumn" :data="writtenOffData.list" height="500" @on-sort-change="resort" @on-selection-change="setOrderIds"></Table>
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
      defaultOrderType: {
        1: '1',
        2: '2',
        3: '5'
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
    writtenOffQuery () {
      return {
        name: '',
        orderType: this.defaultOrderType[this.scene],
        period: [],
        orderNo: ''
      }
    },
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
  mounted () {
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
      this.writtenOffQuery = {
        name: '',
        orderType: '1',
        period: [],
        orderNo: ''
      }
    },
    exportWrittenOff () {
      if (this.selectedIds.length > 0) {
        Export({
          url: '/finance/verify/export',
          method: 'post',
          data: {
            verifyIds: this.selectedIds.join(','),
            partnerType: this.scene
          },
          fileName: '核销单'
        }).then(res => {
          this.$Message.success('导出成功')
        }).catch(err => console.error(err))
      } else {
        this.$Message.warning('请选择1条以上的数据')
      }
    },
    toDetail (data) {
      this.openTab({
        title: '核销单详情',
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
          orderByCreateTime: this.writtenOffQuerySave.sortDesc ? 1 : 2,
          startTime: this.writtenOffQuerySave.period[0] ? this.writtenOffQuerySave.period[0].getTime() : '',
          endTime: this.writtenOffQuerySave.period[1] ? this.writtenOffQuerySave.period[1].getTime() : '',
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
</style>
