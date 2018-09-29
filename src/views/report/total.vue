<template>
  <div>
    <div class="search">
      <div class="search-list">
        <ButtonGroup>
          <Button v-for="(item,index) in btnGroup" :key="index" :type="item.value===operateValue?'primary':'default'" @click="handleOperaterValue(item)">{{item.name}}</Button>
        </ButtonGroup>
        <DatePicker
          v-model="times"
          type="daterange"
          format="yyyy-MM-dd"
          placeholder="开始日期-结束日期"
          style="display: inline-block;width: 240px;height: 35px;margin-left: 20px"
          @on-change="handleTimeChange"
        >
        </DatePicker>
        <Tooltip max-width="200" content="营业额汇总报表：按照订单的下单日期提取数据；利润报表：按照订单、运单、提货单、外转单的下单日期提取数据。">
          <Icon type="ios-alert" style="font-size: 20px;color: #FFBB44;margin-left: 18px" />
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
      :columns="columns">
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
          key: 'consignerName'
        },
        {
          title: '订单数',
          key: 'orderNum'
        },
        {
          title: '运输费',
          key: 'freightFee'
        },
        {
          title: '装卸费',
          key: 'loadFee'
        },
        {
          title: '卸货费',
          key: 'unloadFee'
        },
        {
          title: '其他费用',
          key: 'otherFee'
        },
        {
          title: '费用合计',
          key: 'totalFee'
        }
      ]
    }
  },
  methods: {
    search () {
      this.keyword = {
        createTimeStart: this.keyword.startTime,
        createTimeEnd: this.keyword.endTime
      }
    },
    clearKeywords () {
      this.keyword = {
        createTimeStart: '',
        createTimeEnd: '',
        type: 1
      }
      this.times = ['', '']
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
    },
    date (value) {
      let start = ''
      let end = ''
      /* 当前时间时间戳 */
      let now = new Date(2018, 2, 10).getTime()
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
          start = this.formatDate(now).slice(0, 5) + startMonth + this.formatDate(now).slice(-3)
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
      Export({
        url: '/report/exportTurnoverSummary',
        method: 'post',
        data: this.keyword
      }).then(res => {
        this.$Message.success('导出成功')
      }).catch(err => console.error(err))
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
