<template>
  <div>
    <div class="search">
      <div class="search-col" >
        <div class="row-list" style="margin-bottom:12px">
          <div class="col">
            <Input
              v-model="keywords.driverName"
              :maxlength="15"
              placeholder="请输入司机名称"
            >
            </Input>
          </div>
          <div class="col">
            <Input v-model="keywords.driverPhone" :maxlength="11"  placeholder="请输入司机号码"/>
          </div>
          <div class="col relative">
            <SelectInputForCity v-model="keywords.start" placeholder="请输入发货城市" style="width: 100%"></SelectInputForCity>
          </div>
          <div class="col relative">
            <SelectInputForCity v-model="keywords.end" placeholder="请输入收货城市" style="width: 100%"></SelectInputForCity>
          </div>
        </div>
        <div class="row-list">
          <div class="col">
            <Input v-model="keywords.carNo" :maxlength="15"  placeholder="请输入车牌号"/>
          </div>
          <div class="col">
            <Select v-model="keywords.billType" clearable placeholder="请选择业务类型" @on-change="billTypeChange">
              <Option value="1">提货</Option>
              <Option value="3">送货</Option>
            </Select>
          </div>
          <div class="col points">
            <Select v-model="keywords.statusList" multiple placeholder="请选择状态">
              <Option v-for="item in statusMap" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="col">
            <DatePicker
              v-model="times"
              :options="options"
              :start-date="perMonth"
              transfer
              type="daterange"
              format="yyyy-MM-dd"
              placeholder="请选择发车时间"
              style="width: 100%"
              @on-change="handleTimeChange"
            >
            </DatePicker>
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
      :url="url"
      :method="method"
      :keywords="keyword"
      :columns="columns"
      :show-filter="true"
      :table-head-type= "headType"
      width="100%"
      @on-load = "onLoad"
    >
    </page-table>
  </div>
</template>

<script>
import PageTable from '@/components/page-table'
import SelectInputForCity from '@/components/SelectInputForCity'
import SelectInput from '@/components/SelectInput.vue'
// import City from '@/libs/js/city'
// import { mapGetters, mapActions } from 'vuex'
import Export from '@/libs/js/export'
import { getPreMonth } from './getPerMonth'
import tableHeadType from '@/libs/constant/headtype.js'
export default {
  name: 'driver',
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
      url: '/report/out/driver',
      method: 'POST',
      headType: tableHeadType.OWNER_DRIVER,
      keywords: {
        start: '',
        end: '',
        driverName: '',
        driverPhone: '',
        billType: '',
        startTime: '',
        endTime: '',
        carNo: '',
        statusList: []
      },
      keyword: {},
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      times: ['', ''],
      isExport: false,
      /* 业务类型 1 提货 3 送货 */
      billTypeMap: {
        1: '提货',
        3: '送货'
      },
      carriersId: null,
      columns: [
        {
          title: '司机姓名',
          key: 'driverName',
          width: 150
        },
        {
          title: '手机号码',
          key: 'driverPhone',
          width: 150
        },
        {
          title: '车牌号',
          key: 'carNo',
          width: 150
        },
        {
          title: '单据号',
          key: 'billNo',
          width: 200
        },
        {
          title: '状态',
          key: 'statusDesc',
          width: 150
        },
        {
          title: '业务类型',
          key: 'billType',
          width: 150,
          render: (h, params) => {
            return h('span', this.billTypeMap[params.row.billType])
          }
        },
        {
          title: '发车时间',
          width: 150,
          key: 'shipmentTime',
          render: (h, params) => {
            return h('span', params.row.shipmentTime ? new Date(params.row.shipmentTime).Format('yyyy-MM-dd hh:mm') : '-')
          }
        },
        {
          title: '到达时间',
          width: 150,
          key: 'arriveTime',
          render: (h, params) => {
            return h('span', params.row.arriveTime ? new Date(params.row.arriveTime).Format('yyyy-MM-dd hh:mm') : '-')
          }
        },
        {
          title: '发货城市',
          key: 'startName',
          width: 250
        },
        {
          title: '收货城市',
          key: 'endName',
          width: 250
        },
        {
          title: '里程（公里）',
          key: 'mileage',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.mileage !== '' ? (params.row.mileage / 1000).toFixed(1) : '-')
          }
        },
        {
          title: '油费',
          width: 150,
          key: 'freightFee',
          render: (h, params) => {
            // return h('span', params.row.freightFee !== '' ? (params.row.freightFee / 100).toFixed(2) : '-')
            return h('span', typeof params.row.freightFee === 'number' ? (params.row.freightFee / 100).toFixed(2) : '0.00')
          }
        },
        {
          title: '住宿费',
          width: 150,
          key: 'accommodation',
          render: (h, params) => {
            // return h('span', params.row.accommodation !== '' ? (params.row.accommodation / 100).toFixed(2) : '-')
            return h('span', typeof params.row.accommodation === 'number' ? (params.row.accommodation / 100).toFixed(2) : '0.00')
          }
        },
        {
          title: '其他费用',
          width: 150,
          key: 'otherFee',
          render: (h, params) => {
            // return h('span', params.row.otherFee !== '' ? (params.row.otherFee / 100).toFixed(2) : '-')
            return h('span', typeof params.row.otherFee === 'number' ? (params.row.otherFee / 100).toFixed(2) : '0.00')
          }
        },
        {
          title: '体积（方）',
          width: 150,
          key: 'volume'
        },
        {
          title: '重量（吨）',
          key: 'weight',
          width: 150
        },
        {
          title: '重量（公斤）',
          key: 'weightKg',
          width: 150
        },
        {
          title: '件数',
          key: 'cargoCnt',
          width: 150
          // render: (h, params) => {
          //   return h('span', params.row.cargoCnt !== '' ? params.row.cargoCnt : '-')
          // }
        }
      ]
    }
  },
  computed: {
    perMonth () {
      return getPreMonth()
    },
    statusMap () {
      if (this.keywords.billType === '1') {
        return [
          { label: '待提货', value: 1 },
          { label: '提货中', value: 2 },
          { label: '已提货', value: 3 }
        ]
      } else if (this.keywords.billType === '3') {
        return [
          { label: '待发运', value: 4 },
          { label: '在途', value: 5 },
          { label: '已到货', value: 6 }
        ]
      } else {
        return [
          { label: '待提货', value: 1 },
          { label: '提货中', value: 2 },
          { label: '已提货', value: 3 },
          { label: '待发运', value: 4 },
          { label: '在途', value: 5 },
          { label: '已到货', value: 6 }
        ]
      }
    }
  },
  // mounted () {
  //   if (this.$route.query.tab) { // 首页跳转来的
  //     this.showSevenDate()
  //   }
  // },
  methods: {
    search () {
      this.keyword = this.queryParams()
    },
    queryParams () {
      let obj = {}
      for (let key in this.keywords) {
        this.keywords[key] ? (obj[key] = this.keywords[key]) : (obj[key] = undefined)
      }
      return obj
    },
    clearKeywords () {
      this.keywords = {
        start: '',
        end: '',
        driverName: '',
        driverPhone: '',
        billType: '',
        startTime: '',
        endTime: '',
        carNo: '',
        statusList: []
      }
      this.times = ['', '']
    },
    // 业务类型改变 状态值清空
    billTypeChange () {
      this.keywords.statusList = []
    },
    // 导出
    ProfitsExport () {
      if (!this.isExport) {
        this.$Message.error('导出内容为空')
        return
      }
      let data = this.queryParams()
      Export({
        url: '/report/out/driver/export',
        method: 'post',
        data,
        fileName: '自有司机出车统计报表'
      })
    },
    handleTimeChange (val) {
      this.keywords.startTime = val[0] ? (val[0] + ' 00:00:00') : ''
      this.keywords.endTime = val[1] ? (val[1] + ' 23:59:59') : ''
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
    display -ms-flexbox
    background #F9F9F9
    padding 13px
    .search-col
      flex 4
      -ms-flex 4
      .row-list
        display flex
        display -ms-flexbox
        justify-content space-between
        -ms-flex-pack justify
        .col
          flex 1
          -ms-flex 1
          margin-right 20px
          &:last-child
            margin-right 0
        .points
          /deep/
            .ivu-select-multiple .ivu-select-selection
              height 32px
              display -webkit-box
              -webkit-box-orient vertical
              -webkit-line-clamp 1
              overflow hidden
        .relative
          position relative
    .search-btn
      flex 1
      -ms-flex 1
      text-align right
      margin-top 42px
</style>
