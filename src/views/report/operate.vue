<template>
  <div>
    <div class="search">
      <div class="search-col">
        <Row :gutter="24" class="row">
          <Col span="6">
          <div class="col">
            <SelectInput
              v-model="keywords.consignerName"
              :maxlength="20"
              :remote="false"
              :clearable="true"
              :local-options="clients"
              placeholder="请选择或输入客户名称"
              style="width: 100%"
              @on-focus.once="getClients"
            >
            </SelectInput>
          </div>
      </Col>
          <Col span="6">
          <div class="col">
            <Input v-model="keywords.orderNo" :maxlength="20"  placeholder="请输入订单号"/>
          </div>
      </Col>
          <Col span="6">
          <div class="col">
            <Input v-model="keywords.customerOrderNo" :maxlength="20" placeholder="请输入客户订单号"  />
          </div>
      </Col>
          <Col span="6">
          <div class="col">
            <Input :maxlength="20" v-model="keywords.waybillNo" placeholder="请输入运单号"  />
          </div>
      </Col>
        </Row>
        <Row :gutter="24">
          <Col span="6">
          <div class="col">
            <area-select v-model="keywords.start" style="width: 100%"></area-select>
          </div>
        </Col>
          <Col span="6">
          <div class="col">
            <area-select v-model="keywords.end" style="width: 100%"></area-select>
          </div>
        </Col>
          <Col span="6">
          <div class="col">
            <DatePicker
              v-model="times"
              type="daterange"
              format="yyyy-MM-dd"
              placeholder="开始日期-结束日期"
              style="width: 100%"
              @on-change="handleTimeChange"
            >
            </DatePicker>
          </div>
        </Col>
        </Row>
      </div>
      <div class="search-btn">
        <Button type="primary" @click="search">搜索</Button>
        <Button style="margin-left: 8px" @click="clearKeywords">清除条件</Button>
      </div>
    </div>
    <div style="margin: 18px 0 12px 0">
      <Button type="primary" @click="ProfitsExport">导出</Button>
    </div>
    <page-table
      ref="pageTable"
      :autoload="autoload"
      :url="url"
      :method="method"
      :keywords="keyword"
      :columns="columns"
      :extra-columns="extraColumns"
      :show-filter="true"
      @on-column-change="handleColumnChange">
    </page-table>
  </div>
</template>

<script>
import PageTable from '@/components/page-table'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from '@/components/SelectInput.vue'
import City from '@/libs/js/city'
import { mapGetters, mapActions } from 'vuex'
import Export from '@/libs/js/export'
export default {
  name: 'operate',
  components: {
    SelectInput,
    PageTable,
    AreaSelect
  },
  data () {
    return {
      url: '/report/for/operating',
      method: 'POST',
      autoload: false,
      keywords: {
        consignerName: '',
        orderNo: '',
        customerOrderNo: '',
        waybillNo: '',
        start: [],
        end: [],
        startTime: '',
        endTime: ''
      },
      keyword: {
        type: 1
      },
      times: ['', ''],
      /* 订单状态 */
      orderStatusMap: {
        10: '提货',
        20: '待调度',
        30: '在途 ',
        40: '已到货',
        50: '已回单'
      },
      /* 提货单状态 */
      loadbillStatusMap: {
        1: '待提货',
        2: '提货中',
        3: '已提货'
      },
      /* 运单状态  */
      waybillStatusMap: {
        1: '待派车',
        2: '待发运',
        3: '在途',
        4: '已到货'
      },
      /* 外转单状态  */
      transbillStatusMap: {
        1: '待发运',
        2: '在途',
        3: '到货'
      },
      /* 回单状态  */
      receiptStatusMap: {
        0: '待回收',
        1: '待返厂',
        2: '已返厂'
      },
      columns: [
        {
          title: '订单号',
          key: 'orderNo',
          ellipsis: true
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          ellipsis: true
        },
        {
          title: '运单号',
          key: 'waybillNo',
          ellipsis: true
        },
        {
          title: '客户名称',
          key: 'consignerName',
          ellipsis: true
        },
        {
          title: '始发地',
          key: 'start',
          ellipsis: true,
          render: (h, params) => {
            return h('span', City.codeToFullNameArr(params.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          ellipsis: true,
          render: (h, params) => {
            return h('span', City.codeToFullNameArr(params.row.end))
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          ellipsis: true
        },
        {
          title: '重量（吨）',
          key: 'weight',
          ellipsis: true
        },
        {
          title: '下单时间',
          key: 'orderCreateTime',
          ellipsis: true,
          render: (h, params) => {
            return h('span', new Date(params.row.orderCreateTime).Format('yyyy-MM-dd hh:mm'))
          }
        },
        {
          title: '合计运费',
          key: 'orderTotalFee',
          ellipsis: true
        },
        {
          title: '订单状态',
          key: 'orderStatus',
          ellipsis: true,
          render: (h, params) => {
            return h('span', this.orderStatusMap[params.row.orderStatus])
          }
        },
        {
          title: '提货单号',
          key: 'loadbillNo',
          ellipsis: true
        },
        {
          title: '提货单状态',
          key: 'loadbillStatus',
          ellipsis: true
        },
        {
          title: '提货总费用',
          key: 'loadbillTotalFee',
          ellipsis: true
        },
        {
          title: '提货承运商',
          key: 'loadbillCarrierName',
          ellipsis: true
        },
        {
          title: '提货单司机',
          key: 'loadbillDriver',
          ellipsis: true
        },
        {
          title: '提货单车牌号',
          key: 'loadbillCarNo',
          ellipsis: true
        },
        {
          title: '提货单车辆信息',
          key: 'loadbillCarInfo',
          ellipsis: true
        },
        {
          title: '运单状态',
          key: 'waybillStatus',
          ellipsis: true,
          render: (h, params) => {
            return h('span', this.waybillStatusMap[params.row.waybillStatus])
          }
        },
        {
          title: '送货总费用',
          key: 'waybillTotalFee',
          ellipsis: true
        },
        {
          title: '送货承运商',
          key: 'waybillCarrierName',
          ellipsis: true
        },
        {
          title: '运单司机',
          key: 'waybillDriver',
          ellipsis: true
        },
        {
          title: '运单车牌号',
          key: 'waybillCarNo',
          ellipsis: true
        },
        {
          title: '运单车辆信息',
          key: 'waybillCarInfo',
          ellipsis: true
        },
        {
          title: '外转单号',
          key: 'transbillNo',
          ellipsis: true
        },
        {
          title: '外转单状态',
          key: 'transbillStatus',
          ellipsis: true,
          render: (h, params) => {
            return h('span', this.transbillStatusMap[params.row.transbillStatus])
          }
        },
        {
          title: '外转方费用',
          key: 'transbillTotalFee',
          ellipsis: true
        },
        {
          title: '外转方',
          key: 'transfereeName',
          ellipsis: true
        },
        {
          title: '回单号',
          key: 'receiptNo',
          ellipsis: true
        },
        {
          title: '回单状态',
          key: 'receiptStatus',
          ellipsis: true
        }
      ],
      extraColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          fixed: false,
          visible: true
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          fixed: false,
          visible: true
        },
        {
          title: '客户名称',
          key: 'consignerName',
          fixed: false,
          visible: true
        },
        {
          title: '始发地',
          key: 'start',
          fixed: false,
          visible: true
        },
        {
          title: '目的地',
          key: 'end',
          fixed: false,
          visible: true
        },
        {
          title: '体积（方）',
          key: 'volume',
          fixed: false,
          visible: true
        },
        {
          title: '重量（吨）',
          key: 'weight',
          fixed: false,
          visible: true
        },
        {
          title: '合计运费',
          key: 'orderTotalFee',
          fixed: false,
          visible: false
        },
        {
          title: '下单时间',
          key: 'orderCreateTime',
          fixed: false,
          visible: true
        },
        {
          title: '订单状态',
          key: 'orderStatus',
          fixed: false,
          visible: false
        },
        {
          title: '提货单号',
          key: 'loadbillNo',
          fixed: false,
          visible: false
        },
        {
          title: '提货单状态',
          key: 'loadbillStatus',
          fixed: false,
          visible: false
        },
        {
          title: '提货总费用',
          key: 'loadbillTotalFee',
          fixed: false,
          visible: false
        },
        {
          title: '提货承运商',
          key: 'loadbillCarrierName',
          fixed: false,
          visible: false
        },
        {
          title: '提货单司机',
          key: 'loadbillDriver',
          fixed: false,
          visible: false
        },
        {
          title: '提货单车牌号',
          key: 'loadbillCarNo',
          fixed: false,
          visible: false
        },
        {
          title: '提货单车辆信息',
          key: 'loadbillCarInfo',
          fixed: false,
          visible: false
        },
        {
          title: '运单号',
          key: 'waybillNo',
          fixed: false,
          visible: true
        },
        {
          title: '运单状态',
          key: 'waybillStatus',
          fixed: false,
          visible: false
        },
        {
          title: '送货总费用',
          key: 'waybillTotalFee',
          fixed: false,
          visible: false
        },
        {
          title: '送货承运商',
          key: 'waybillCarrierName',
          fixed: false,
          visible: false
        },
        {
          title: '运单司机',
          key: 'waybillDriver',
          fixed: false,
          visible: false
        },
        {
          title: '运单车牌号',
          key: 'waybillCarNo',
          fixed: false,
          visible: false
        },
        {
          title: '运单车辆信息',
          key: 'waybillCarInfo',
          fixed: false,
          visible: false
        },
        {
          title: '外转单号',
          key: 'transbillNo',
          fixed: false,
          visible: false
        },
        {
          title: '外转单状态',
          key: 'transbillStatus',
          fixed: false,
          visible: false
        },
        {
          title: '外转方费用',
          key: 'transbillTotalFee',
          fixed: false,
          visible: false
        },
        {
          title: '外转方',
          key: 'transfereeName',
          fixed: false,
          visible: false
        },
        {
          title: '回单号',
          key: 'receiptNo',
          fixed: false,
          visible: false
        },
        {
          title: '回单状态',
          key: 'receiptStatus',
          fixed: false,
          visible: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'clients'
    ])
  },
  methods: {
    ...mapActions([
      'getClients'
    ]),
    search () {
      // 输入框都为空，type=1,搜索数据清空
      if (!this.isEmpty()) {
        this.keyword = {
          type: 1
        }
        return
      }
      this.keyword = {
        consignerName: this.keywords.consignerName || null,
        orderNo: this.keywords.orderNo || null,
        customerOrderNo: this.keywords.customerOrderNo || null,
        waybillNo: this.keywords.waybillNo || null,
        start: (this.keywords.start !== null && this.keywords.start.length) ? Number(this.keywords.start[this.keywords.start.length - 1]) : null,
        end: (this.keywords.end !== null && this.keywords.end.length) ? Number(this.keywords.end[this.keywords.end.length - 1]) : null,
        startTime: this.keywords.startTime || null,
        endTime: this.keywords.endTime || null
      }
    },
    // 判断搜索条件是不是都是空，为空则key = 1
    isEmpty () {
      /* flag返回false，则对象中值都是空 */
      let flag = false
      for (let key in this.keywords) {
        if (this.keywords[key] && this.keywords[key].length) {
          flag = true
        }
      }
      return flag
    },
    clearKeywords () {
      this.keywords = {
        consignerName: '',
        orderNo: '',
        customerOrderNo: '',
        waybillNo: '',
        start: [],
        end: [],
        startTime: '',
        endTime: ''
      }
      this.times = ['', '']
      this.keyword = {
        type: 1 // 不搜索
      }
    },
    // 导出
    ProfitsExport () {
      if (!this.isEmpty()) {
        this.$Message.error('请先输入导出条件')
        return
      }
      let data = {
        consignerName: this.keywords.consignerName || null,
        orderNo: this.keywords.orderNo || null,
        customerOrderNo: this.keywords.customerOrderNo || null,
        waybillNo: this.keywords.waybillNo || null,
        start: (this.keywords.start !== null && this.keywords.start.length) ? Number(this.keywords.start[this.keywords.start.length - 1]) : null,
        end: (this.keywords.end !== null && this.keywords.end.length) ? Number(this.keywords.end[this.keywords.end.length - 1]) : null,
        startTime: this.keywords.startTime || null,
        endTime: this.keywords.endTime || null
      }
      Export({
        url: '/report/for/operating/export',
        method: 'post',
        data
        // fileName: '运单明细'
      }).then(res => {
        this.$Message.success('导出成功')
      }).catch(err => console.error(err))
    },
    // 筛选列表显示字段
    handleColumnChange (val) {
      this.extraColumns = val
    },
    handleTimeChange (val) {
      this.keywords.startTime = val[0]
      this.keywords.endTime = val[1]
    }
  }
}
</script>

<style scoped lang="stylus">
  button
    width 86px
    height 35px
  .search
    display flex
    background #F9F9F9
    padding 13px
    .search-col
      flex 4
      .row
        margin-bottom 12px
    .search-btn
      flex 1
      text-align right
      margin-top 44px
</style>
