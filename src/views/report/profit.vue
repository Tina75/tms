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
    <div class="table">
      <div class="title">
        <ul class="list">
          <li>方向</li>
          <li>来源</li>
          <li>费用明细</li>
          <li>本期发生额</li>
        </ul>
      </div>
      <div class="items">
        <div class="item">收入</div>
        <div class="item">上游运费收入</div>
        <div class="item" style="flex: 2">
          <div class="item-inner">
            <div>运输费</div>
            <div>{{res.orderFreightFee}}</div>
          </div>
          <div class="item-inner">
            <div>装货费</div>
            <div>{{res.orderLoadFee}}</div>
          </div>
          <div class="item-inner">
            <div>卸货费</div>
            <div>{{res.orderUnloadFee}}</div>
          </div>
          <div class="item-inner">
            <div>保险费</div>
            <div>{{res.orderInsuranceFee}}</div>
          </div>
          <div class="item-inner">
            <div>其他费用</div>
            <div>{{res.orderOtherFee}}</div>
          </div>
        </div>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%; ">
        <span>主营业务收入合计</span>
        <span class="num">{{res.orderTotalFee}}</span>
      </div>
      <div class="items" >
        <div class="item" style="height: 269px; line-height: 269px">支出</div>
        <div style="flex:1;">
          <div  style="height: 224px;line-height: 224px;border-right: 1px solid #c9ced9;border-bottom: 1px solid #c9ced9">
            承运商运费支出
          </div>
          <div  style="height: 45px;line-height: 45px;border-right: 1px solid #c9ced9;border-bottom: 1px solid #c9ced9;" >
            外转运费支出
          </div>
        </div>
        <div class="item" style="flex: 2">
          <div class="item-inner">
            <div>运输费</div>
            <div>{{res.carrierFreightFee}}</div>
          </div>
          <div class="item-inner">
            <div>装货费</div>
            <div>{{res.carrierLoadFee}}</div>
          </div>
          <div class="item-inner">
            <div>卸货费</div>
            <div>{{res.carrierUnloadFee}}</div>
          </div>
          <div class="item-inner">
            <div>保险费</div>
            <div>{{res.carrierInsuranceFee}}</div>
          </div>
          <div class="item-inner" style="border-bottom: none">
            <div>其他费用</div>
            <div>{{res.carrierOtherFee}}</div>
          </div>
          <div class="item-inner">
            <div>外转费</div>
            <div>{{res.transbillTransFee}}</div>
          </div>
        </div>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%">
        <span>主营业务支出合计</span>
        <span class="num">{{res.carrierTotalFee}}</span>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%">
        <span>利润</span>
        <span class="num">{{res.profits}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
export default {
  name: 'profit',
  components: {
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
      keywords: {
        startTime: '',
        endTime: '',
        type: 1
      },
      res: {
        orderFreightFee: '-',
        orderLoadFee: '-',
        orderUnloadFee: '-',
        orderOtherFee: '-',
        orderInsuranceFee: '-',
        orderTotalFee: '-',
        carrierFreightFee: '-',
        carrierLoadFee: '-',
        carrierUnloadFee: '-',
        carrierOtherFee: '-',
        carrierInsuranceFee: '-',
        carrierTotalFee: '-',
        transbillTransFee: '-',
        profits: '-'
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  methods: {
    search () {
      if (!this.keywords.startTime && !this.keywords.endTime) { // 搜索条件为空
        this.$Message.error('请先输入搜索条件')
        this.keywords = {
          type: 1
        }
      } else {
        Object.assign(this.keywords, { type: null })
      }
      Server({
        url: '/report/for/profits',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data: this.keywords
      }).then((res) => {
        if (res.data.code === 10000) {
          // Object.assign(this.res, res.data.data)
          this.res = res.data.data
          for (let key in this.res) {
            this.res[key] = this.res[key] === '' ? '-' : (this.res[key] / 100).toFixed(2)
          }
        }
      })
    },
    clearKeywords () {
      this.operateValue = ''
      this.times = ['', '']
      this.keywords = {
        startTime: '',
        endTime: '',
        type: 1
      }
      this.search()
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
    /* 点击button，对应时间 */
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
      if (!this.keywords.startTime && !this.keywords.endTime) {
        this.$Message.error('请先输入导出条件')
        return
      }
      Export({
        url: '/report/for/profits/export',
        method: 'post',
        data: Object.assign(this.keywords, { type: null }),
        fileName: '利润报表'
      })
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
  .table
    border 1px solid #C9CED9
    text-align center
    font-size 14px
    color #333
    .title
      height 45px
      line-height 45px
      background #F8F8F8
      border-bottom:1px solid #C9CED9
      &:last-child
        border-bottom none
      .list
        display flex
        li
          list-style none
          flex 1
          text-align center
      .num
        color #00A4BD
        margin-left 20px
        font-weight 500
    .items
      display flex
      .item
        flex 1
        height 224px
        line-height 224px
        border-right  1px solid #C9CED9
        border-bottom 1px solid #C9CED9
        &:last-child
          border-right none
        .item-inner
          display flex
          height 45px
          line-height 45px
          border-bottom   1px solid #C9CED9
          &:last-child
            border-bottom  none
          div
            flex 1
</style>
