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
        <Button style="margin-left: 8px">清除条件</Button>
      </div>
    </div>
    <div style="margin: 18px 0 12px 0">
      <Button type="primary">导出</Button>
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
            <div>{{orderFreightFee}}</div>
          </div>
          <div class="item-inner">
            <div>装货费</div>
            <div>{{orderLoadFee}}</div>
          </div>
          <div class="item-inner">
            <div>卸货费</div>
            <div>{{orderUnloadFee}}</div>
          </div>
          <div class="item-inner">
            <div>保险费</div>
            <div>{{orderInsuranceFee}}</div>
          </div>
          <div class="item-inner">
            <div>其他费用</div>
            <div>{{orderOtherFee}}</div>
          </div>
        </div>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%; ">
        <span>主营业务收入合计</span>
        <span class="num">{{orderTotalFee}}</span>
      </div>
      <div class="items">
        <div class="item">支出</div>
        <div class="item">承运商运费支出</div>
        <div class="item" style="flex: 2">
          <div class="item-inner">
            <div>运输费</div>
            <div>{{carrierFreightFee}}</div>
          </div>
          <div class="item-inner">
            <div>装货费</div>
            <div>{{carrierLoadFee}}</div>
          </div>
          <div class="item-inner">
            <div>卸货费</div>
            <div>{{carrierUnloadFee}}</div>
          </div>
          <div class="item-inner">
            <div>保险费</div>
            <div>{{carrierInsuranceFee}}</div>
          </div>
          <div class="item-inner">
            <div>其他费用</div>
            <div>{{carrierOtherFee}}</div>
          </div>
        </div>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%">
        <span>主营业务支出合计</span>
        <span class="num">{{carrierTotalFee}}</span>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%">
        <span>利润</span>
        <span class="num">{{transbillTransFee}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
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
      orderFreightFee: '',
      orderLoadFee: '',
      orderUnloadFee: '',
      orderOtherFee: '',
      orderInsuranceFee: '',
      orderTotalFee: '',
      carrierFreightFee: '',
      carrierLoadFee: '',
      carrierUnloadFee: '',
      carrierOtherFee: '',
      carrierInsuranceFee: '',
      carrierTotalFee: '',
      transbillTransFee: ''
    }
  },
  methods: {
    search () {
      Object.assign(this.keywords, {key: null})
      Server({
        url: '/report/for/profits',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data: this.keywords
      }).then((res) => {
        console.log(res)
      })
    },
    handleOperaterValue (btn) {
      this.operateValue = btn.value
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
