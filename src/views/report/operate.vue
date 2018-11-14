<template>
  <div>
    <div class="search">
      <div class="search-col" >
        <div class="row-list" style="margin-bottom:12px">
          <div class="col relative">
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
          <div class="col">
            <Input v-model="keywords.orderNo" :maxlength="20"  placeholder="请输入订单号"/>
          </div>
          <div class="col">
            <Input v-model="keywords.customerOrderNo" :maxlength="20" placeholder="请输入客户订单号"  />
          </div>
          <div class="col">
            <Input :maxlength="20" v-model="keywords.waybillNo" placeholder="请输入运单号"  />
          </div>
        </div>
        <div class="row-list">
          <div class="col relative">
            <!--<area-select v-model="keywords.start" placeholder="请输入始发地" style="width: 100%"></area-select>-->
            <SelectInputForCity v-model="keywords.start" placeholder="请输入始发地" style="width: 100%"></SelectInputForCity>
          </div>
          <div class="col relative">
            <!--<area-select v-model="keywords.end" placeholder="请输入目的地" style="width: 100%"></area-select>-->
            <SelectInputForCity v-model="keywords.end" placeholder="请输入目的地" style="width: 100%"></SelectInputForCity>
          </div>
          <div class="col">
            <DatePicker
              v-model="times"
              :options="options"
              :start-date="perMonth"
              type="daterange"
              format="yyyy-MM-dd"
              placeholder="开始日期-结束日期"
              style="width: 100%"
              @on-change="handleTimeChange"
            >
            </DatePicker>
          </div>
          <div class="col">
          </div>
        </div>
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
      :show-filter="true"
      :table-head-type= "headType"
      width="100%"
      @on-load = "onLoad"
      @on-column-change="handleColumnChange">
    </page-table>
  </div>
</template>

<script>
import PageTable from '@/components/page-table'
import SelectInputForCity from '@/components/SelectInputForCity'
import SelectInput from '@/components/SelectInput.vue'
import City from '@/libs/js/city'
import { mapGetters, mapActions } from 'vuex'
import Export from '@/libs/js/export'
import { getPreMonth } from './getPerMonth'
import tableHeadType from '@/libs/constant/headtype.js'
export default {
  name: 'operate',
  components: {
    SelectInput,
    PageTable,
    SelectInputForCity
  },
  metaInfo: {
    title: '运营报表'
  },
  data () {
    return {
      url: '/report/for/operating',
      method: 'POST',
      autoload: false,
      headType: tableHeadType.BUSINESS,
      keywords: {
        consignerName: '',
        orderNo: '',
        customerOrderNo: '',
        waybillNo: '',
        start: null,
        end: null,
        startTime: '',
        endTime: ''
      },
      keyword: {
        type: 1
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      times: ['', ''],
      isExport: false,
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
          fixed: 'left',
          width: 150
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          width: 150
        },
        {
          title: '运单号',
          key: 'waybillNo',
          width: 150
        },
        {
          title: '客户名称',
          key: 'consignerName',
          width: 150
        },
        {
          title: '始发地',
          key: 'start',
          width: 250,
          render: (h, params) => {
            return h('span', City.codeToFullNameArr(params.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          width: 250,
          render: (h, params) => {
            return h('span', City.codeToFullNameArr(params.row.end))
          }
        },
        {
          title: '计费里程',
          key: 'mileage',
          width: 150,
          render: (h, params) => {
            return h('span', (params.row.mileage / 1000).toFixed(1))
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          width: 150
        },
        {
          title: '重量（吨）',
          key: 'weight',
          width: 150
        },
        {
          title: '下单时间',
          key: 'orderCreateTime',
          width: 250,
          render: (h, params) => {
            return h('span', new Date(params.row.orderCreateTime).Format('yyyy-MM-dd hh:mm'))
          }
        },
        {
          title: '合计运费',
          key: 'orderTotalFee',
          width: 150,
          render: (h, params) => {
            return h('span', (params.row.orderTotalFee / 100).toFixed(2))
          }
        },
        {
          title: '订单状态',
          key: 'orderStatus',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.orderStatus ? this.orderStatusMap[params.row.orderStatus] : '-')
          }
        },
        {
          title: '提货单号',
          key: 'loadbillNo',
          width: 150
        },
        {
          title: '提货单状态',
          key: 'loadbillStatus',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.loadbillStatus ? this.loadbillStatusMap[params.row.loadbillStatus] : '-')
          }
        },
        {
          title: '提货总费用',
          key: 'loadbillTotalFee',
          width: 150,
          render: (h, params) => {
            return h('span', (params.row.loadbillTotalFee / 100).toFixed(2))
          }
        },
        {
          title: '提货承运商',
          key: 'loadbillCarrierName',
          width: 150
        },
        {
          title: '提货单司机',
          key: 'loadbillDriver',
          width: 150
        },
        {
          title: '提货单车牌号',
          key: 'loadbillCarNo',
          width: 150
        },
        {
          title: '提货单车辆信息',
          key: 'loadbillCarInfo',
          width: 150
        },
        {
          title: '运单状态',
          key: 'waybillStatus',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.waybillStatus ? this.waybillStatusMap[params.row.waybillStatus] : '-')
          }
        },
        {
          title: '送货总费用',
          key: 'waybillTotalFee',
          width: 150,
          render: (h, params) => {
            return h('span', (params.row.waybillTotalFee / 100).toFixed(2))
          }
        },
        {
          title: '送货承运商',
          key: 'waybillCarrierName',
          width: 150
        },
        {
          title: '运单司机',
          key: 'waybillDriver',
          width: 150
        },
        {
          title: '运单车牌号',
          key: 'waybillCarNo',
          width: 150
        },
        {
          title: '运单车辆信息',
          key: 'waybillCarInfo',
          width: 150
        },
        {
          title: '外转单号',
          key: 'transbillNo',
          width: 150
        },
        {
          title: '外转单状态',
          key: 'transbillStatus',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.transbillStatus ? this.transbillStatusMap[params.row.transbillStatus] : '-')
          }
        },
        {
          title: '外转方费用',
          key: 'transbillTotalFee',
          width: 150,
          render: (h, params) => {
            return h('span', (params.row.transbillTotalFee / 100).toFixed(2))
          }
        },
        {
          title: '外转方',
          key: 'transfereeName',
          width: 150
        },
        {
          title: '回单号',
          key: 'receiptNo',
          width: 150
        },
        {
          title: '回单状态',
          key: 'receiptStatus',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.receiptStatus ? this.receiptStatusMap[params.row.receiptStatus] : '-')
          }
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
          title: '计费里程',
          key: 'mileage',
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
    perMonth () {
      return getPreMonth()
    },
    ...mapGetters([
      'clients'
    ])
  },
  mounted () {
    if (this.$route.query.tab) { // 首页跳转来的
      this.showSevenDate()
    }
  },
  methods: {
    ...mapActions([
      'getClients'
    ]),
    search () {
      // 输入框都为空，type=1,搜索数据清空
      if (!this.isEmpty()) {
        this.$Message.error('请先输入搜索条件')
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
        start: this.keywords.start,
        end: this.keywords.end,
        startTime: this.keywords.startTime || null,
        endTime: this.keywords.endTime || null
      }
    },
    // 判断搜索条件是不是都是空，为空则key = 1
    isEmpty () {
      /* flag返回false，则对象中值都是空 */
      let flag = false
      for (let key in this.keywords) {
        if (this.keywords[key]) {
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
        start: null,
        end: null,
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
      if (!this.isExport) {
        this.$Message.error('导出内容为空')
        return
      }
      let data = {
        consignerName: this.keywords.consignerName || null,
        orderNo: this.keywords.orderNo || null,
        customerOrderNo: this.keywords.customerOrderNo || null,
        waybillNo: this.keywords.waybillNo || null,
        start: this.keywords.start,
        end: this.keywords.end,
        startTime: this.keywords.startTime || null,
        endTime: this.keywords.endTime || null
      }
      Export({
        url: '/report/for/operating/export',
        method: 'post',
        data,
        fileName: '运单报表'
      })
    },
    // 筛选列表显示字段
    handleColumnChange (val) {
      this.extraColumns = val
    },
    handleTimeChange (val) {
      this.keywords.startTime = val[0]
      this.keywords.endTime = val[1]
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    showSevenDate () {
      let now = new Date().getTime()
      this.keywords.startTime = this.formatDate(now - 7 * 24 * 60 * 60 * 1000)
      this.keywords.endTime = this.formatDate(now)
      this.times = [this.keywords.startTime, this.keywords.endTime]
      this.keyword = {
        startTime: this.keywords.startTime,
        endTime: this.keywords.endTime
      }
    },
    onLoad (res) {
      if (res.data.data.list && res.data.data.list.length > 0) {
        this.isExport = true
      } else {
        this.isExport = false
      }
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
      .row-list
        display flex
        justify-content space-between
        .col
          flex 1
          margin-right 20px
          &:last-child
            margin-right 0
        .relative
          position relative
    .search-btn
      flex 1
      text-align right
      margin-top 44px
</style>
