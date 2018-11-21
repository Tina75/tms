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
          :start-date="perMonth"
          type="daterange"
          format="yyyy-MM-dd"
          placeholder="开始日期-结束日期"
          style="display: inline-block;width: 240px;margin-left: 20px"
          @on-clear = "clearKeywords"
          @on-change="handleTimeChange"
        >
        </DatePicker>
        <Tooltip max-width="200" style="margin-left: 18px" content="利润报表：按照订单、运单、提货单、外转单的下单日期提取数据。">
          <Icon type="ios-alert" style="font-size: 20px;color: #FFBB44;" />
        </Tooltip>
      </div>
      <div class="search-btn">
        <Button type="primary" @click="search(true)">生成报表</Button>
        <Button style="margin-left: 8px" @click="clearKeywords">清除条件</Button>
      </div>
    </div>
    <div style="margin: 18px 0 12px 0">
      <Button type="primary" @click="ProfitsExport">导出</Button>
    </div>
    <div class="table">
      <Row type="flex" justify="start" class="small-height bg" style="font-size: 12px">
        <Col span="6">方向</Col>
        <Col span="6">来源</Col>
        <Col span="6">费用明细</Col>
        <Col span="6">本期发生额</Col>
      </Row>
      <Row type="flex" justify="start" class="big-height" style="border-top: 0">
        <Col span="6">收入</Col>
        <Col span="6">
        <Row class="middle-height border-top-none border-right-none">
          <Col>上游运费收入</Col>
        </Row>
        <Row class="small-height border-top-none border-right-none border-bottom-none">
          <Col>返现运费收入</Col>
        </Row>
        </Col>
        <Col span="12" >
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none" >
          <Col span="12">运输费</Col>
          <Col span="12" class="num">{{res.orderFreightFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none" >
          <Col span="12">提货费</Col>
          <Col span="12" class="num">{{res.orderPickupFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
          <Col span="12">装货费</Col>
          <Col span="12" class="num">{{res.orderLoadFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
          <Col span="12">卸货费</Col>
          <Col span="12" class="num">{{res.orderUnloadFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
          <Col span="12">保险费</Col>
          <Col span="12" class="num">{{res.orderInsuranceFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none">
          <Col span="12">其他费用</Col>
          <Col span="12" class="num">{{res.orderOtherFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-bottom-none border-right-none">
          <Col span="12">返现运费</Col>
          <Col span="12" class="num">{{res.orderCashBack}}</Col>
        </Row>
        </Col>
      </Row>
      <Row type="flex" justify="start" class="small-height bg border-top-none">
        <Col span="6" offset="18" style="text-align: right">主营业务收入合计<span class="money">{{res.orderTotalFee}}</span></Col>
      </Row>
      <Row type="flex" justify="start" class="big-height" style="border-top: 0">
        <Col span="6">支出</Col>
        <Col span="6">
        <Row class="middle-height border-top-none border-right-none">
          <Col>承运商运费支出</Col>
        </Row>
        <Row class="small-height border-top-none border-right-none border-bottom-none">
          <Col>外转运费支出</Col>
        </Row>
        </Col>
        <Col span="12" >
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none" >
          <Col span="12">运输费</Col>
          <Col span="12" class="num">{{res.carrierFreightFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
          <Col span="12">装货费</Col>
          <Col span="12" class="num">{{res.carrierLoadFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
          <Col span="12">卸货费</Col>
          <Col span="12" class="num">{{res.carrierUnloadFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
          <Col span="12">保险费</Col>
          <Col span="12" class="num">{{res.carrierInsuranceFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
          <Col span="12">路桥费</Col>
          <Col span="12" class="num">{{res.carrierTollFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
          <Col span="12">其他费用</Col>
          <Col span="12" class="num">{{res.carrierOtherFee}}</Col>
        </Row>
        <Row type="flex" justify="start" class="small-height border-top-none border-bottom-none border-right-none">
          <Col span="12">外转费</Col>
          <Col span="12" class="num">{{res.transbillTransFee}}</Col>
        </Row>
        </Col>
      </Row>
      <Row type="flex" justify="start" class="small-height bg border-top-none">
        <Col span="6" offset="18" style="text-align: right">主营业务支出合计<span class="money">{{res.carrierTotalFee}}</span></Col>
      </Row>
      <Row type="flex" justify="start" class="small-height bg border-top-none">
        <Col span="6" offset="18" style="text-align: right">利润<span class="money">{{res.profits}}</span></Col>
      </Row>
    </div>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
import { getPreMonth } from './getPerMonth'
export default {
  name: 'profit',
  components: {
  },
  metaInfo: {
    title: '利润报表'
  },
  data: function () {
    return {
      btnGroup: [
        { name: '近七天', value: 1 },
        { name: '本月', value: 2 },
        { name: '本季度', value: 3 },
        { name: '半年', value: 4 }
      ],
      isExport: false,
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
        orderPickupFee: '-',
        orderInsuranceFee: '-',
        orderTotalFee: '-',
        carrierFreightFee: '-',
        carrierLoadFee: '-',
        carrierUnloadFee: '-',
        carrierOtherFee: '-',
        carrierInsuranceFee: '-',
        carrierTotalFee: '-',
        transbillTransFee: '-',
        profits: '-',
        carrierTollFee: '-',
        orderCashBack: '-'
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  computed: {
    perMonth () {
      return getPreMonth()
    }
  },
  methods: {
    search (type) {
      if (!this.keywords.startTime && !this.keywords.endTime) { // 搜索条件为空
        if (type) {
          this.$Message.error('请先输入搜索条件')
        }
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
          this.res = res.data.data
          this.onLoad(res.data.data)
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
      this.search(false)
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
      if (!this.isExport) {
        this.$Message.error('导出内容为空')
        return
      }
      Export({
        url: '/report/for/profits/export',
        method: 'post',
        data: Object.assign(this.keywords, { type: null }),
        fileName: '利润报表'
      })
    },
    onLoad (res) {
      this.isExport = false
      for (let key in res) {
        if (res[key]) {
          this.isExport = true
          break
        }
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
    justify-content space-between
    background #F9F9F9
    padding 13px
    .search-list
      button
        width 80px
  .table
    text-align center
    font-size 11px
    color #333
    .num
      text-align right
      padding-right 23%
    .money
      color #00A4BD
      margin-left 5%
      text-align right
      padding-right 46%
    .border-bottom-none
      border-bottom none!important
    .border-top-none
      border-top none!important
    .border-right-none
      border-right none!important
    .bg
      background:rgba(248,248,248,1)
      font-weight bold
    .middle-height
      height 270px
      line-height 314px
      border 1px solid #C9CED9
    .small-height
      border 1px solid #C9CED9
      height 45px
      line-height 45px
    .big-height
      border 1px solid #C9CED9
      height 314px
      line-height 314px
</style>
