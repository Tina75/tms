<template>
  <div>
    <div class="search">
      <div class="search-list">
        <ButtonGroup>
          <Button v-for="(item,index) in btnGroup" :key="index" :type="item.value===operateValue?'primary':'default'" @click="handleOperaterValue(item)">{{item.name}}</Button>
        </ButtonGroup>
        <DatePicker
          v-model="times"
          :options="options"
          type="daterange"
          format="yyyy-MM-dd"
          placeholder="开始日期-结束日期"
          style="display: inline-block;width: 240px;height: 35px;margin-left: 20px"
          @on-clear = "clearKeywords"
          @on-change="handleTimeChange"
        >
        </DatePicker>
        <Tooltip max-width="200" style="margin-left: 18px" content="营业额汇总报表：按照订单的下单日期提取数据；利润报表：按照订单、运单、提货单、外转单的下单日期提取数据。">
          <Icon type="ios-alert" style="font-size: 20px;color: #FFBB44;" />
        </Tooltip>
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
      :url="url"
      :autoload="autoload"
      :method="method"
      :keywords="keyword"
      :columns="columns"
      @on-load = "onLoad">
    </page-table>
  </div>
</template>

<script>
import PageTable from '@/components/page-table'
import Export from '@/libs/js/export'
export default {
  name: 'total',
  components: {
    PageTable
  },
  metaInfo: {
    title: '营业额汇总表'
  },
  data: function () {
    return {
      btnGroup: [
        { name: '近七天', value: 1 },
        { name: '本月', value: 2 },
        { name: '本季度', value: 3 },
        { name: '半年', value: 4 }
      ],
      operateValue: '',
      times: ['', ''],
      url: '/report/getTurnoverSummary',
      method: 'POST',
      autoload: false,
      isExport: false,
      keywords: {
        startTime: '',
        endTime: ''
      },
      keyword: {
        type: 1
      },
      columns: [
        {
          title: '客户名称',
          key: 'consignerName',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '订单数',
          key: 'orderNum',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '保险费',
          key: 'insuranceFee',
          render: (h, params) => {
            return h('span', (params.row.insuranceFee / 100).toFixed(2))
          }
        },
        {
          title: '运输费',
          key: 'freightFee',
          render: (h, params) => {
            return h('span', (params.row.freightFee / 100).toFixed(2))
          }
        },
        {
          title: '装卸费',
          key: 'loadFee',
          render: (h, params) => {
            return h('span', (params.row.loadFee / 100).toFixed(2))
          }
        },
        {
          title: '卸货费',
          key: 'unloadFee',
          render: (h, params) => {
            return h('span', (params.row.unloadFee / 100).toFixed(2))
          }
        },
        {
          title: '其他费用',
          key: 'otherFee',
          render: (h, params) => {
            return h('span', (params.row.otherFee / 100).toFixed(2))
          }
        },
        {
          title: '费用合计',
          key: 'totalFee',
          render: (h, params) => {
            return h('span', (params.row.totalFee / 100).toFixed(2))
          }
        }
      ],
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  mounted () {
    if (this.$route.query.tab) { // 首页跳转来的
      this.showSevenDate()
    }
  },
  methods: {
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
        createTimeStart: this.keywords.startTime,
        createTimeEnd: this.keywords.endTime
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
      this.keyword = {
        type: 1
      }
      this.times = ['', '']
      this.keywords = {
        startTime: '',
        endTime: ''
      }
      this.operateValue = ''
    },
    handleOperaterValue (btn) {
      this.operateValue = btn.value
      // 对应时间改变
      this.date(btn.value)
    },
    handleTimeChange (val) {
      this.keywords.startTime = val[0]
      this.keywords.endTime = val[1]
      // 去掉蓝显
      this.operateValue = ''
    },
    date (value) {
      let start = ''
      let end = ''
      /* 当前时间时间戳 */
      let now = new Date().getTime()
      /* 当前时间 yyyy - mm -dd */
      end = this.formatDate(now)
      /* 当前月份 */
      let month = this.formatDate(now).slice(5, 7)
      switch (value) {
        case 1:
          start = this.formatDate(now - 7 * 24 * 60 * 60 * 1000)
          break
        case 2:
          start = this.formatDate(now).slice(0, -2) + '01'
          break
        case 3:
          let startMonth = ''
          if (month < 4) {
            startMonth = '01'
          }
          if (month > 3 && month < 7) {
            startMonth = '04'
          }
          if (month > 6 && month < 10) {
            startMonth = '07'
          }
          if (month > 9) {
            startMonth = '10'
          }
          start = this.formatDate(now).slice(0, 5) + startMonth + '-01'
          break
        case 4:
          /* 当前年份 */
          let year = this.formatDate(now).slice(0, 4)
          console.log(year)
          if (month > 6) {
            start = year + '-0' + (month - 6) + this.formatDate(now).slice(-3)
          } else {
            start = (year - 1) + '-0' + (12 + parseInt(month) - 6) + this.formatDate(now).slice(-3)
          }
          break
      }
      this.times = [start, end]
      this.keywords.startTime = start
      this.keywords.endTime = end
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    // 导出
    ProfitsExport () {
      if (!this.isExport) {
        this.$Message.error('导出内容为空')
        return
      }
      let data = {
        createTimeStart: this.keywords.startTime,
        createTimeEnd: this.keywords.endTime
      }
      Export({
        url: '/report/exportTurnoverSummary',
        method: 'post',
        data: data,
        fileName: '营业额汇总报表'
      })
    },
    onLoad (res) {
      if (res.data.data.list && res.data.data.list.length > 0) {
        this.isExport = true
      } else {
        this.isExport = false
      }
    },
    // 默认展示近七天数据
    showSevenDate () {
      this.operateValue = 1
      this.date(this.operateValue)
      this.search()
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
    justify-content space-between
    background #F9F9F9
    padding 13px
    .search-list
      button
        width 80px
</style>
