<template>
  <div>
    <TabHeader ref="$tab" :tabs="tabList" :type="tabType" @on-change="tabChanged"></TabHeader>
    <div class="search">
      <div class="search-list">
        <ButtonGroup>
          <Button v-for="(item,index) in btnGroup" :key="index" :type="item.value===operateValue?'primary':'default'" @click="handleOperaterValue(item)">{{item.name}}</Button>
        </ButtonGroup>
        <DatePicker
          v-model="times"
          :options="options"
          :start-date="perMonth"
          transfer
          type="daterange"
          format="yyyy-MM-dd"
          placeholder="开始日期-结束日期"
          style="display: inline-block;width: 240px;margin-left: 20px"
          @on-change="handleTimeChange"
        >
        </DatePicker>
        <Tooltip max-width="200" style="margin-left: 18px" transfer content="利润报表：按照订单、运单、提货单的下单日期提取数据。">
          <Icon type="ios-alert" style="font-size: 20px;color: #FFBB44;" />
        </Tooltip>
        <!--客户利润 单票利润-->
        <SelectInput
          v-if="tabStatus===2 || tabStatus===4"
          v-model="keywords.consignerName"
          :maxlength="20"
          :remote="false"
          :clearable="true"
          :local-options="clients"
          class="inputItem"
          placeholder="请选择或输入客户名称"
          @on-focus.once="getClients"
        >
        </SelectInput>
        <!--整车利润-->
        <Input v-if="tabStatus===3" v-model="keywords.waybillNo" :maxlength="20" class="inputItem"  placeholder="请输入运单号"/>
        <Input v-if="tabStatus===3" v-model="keywords.carNo" :maxlength="15" class="inputItem"  placeholder="请输入车牌号"/>
        <!--单票利润-->
        <Input v-if="tabStatus===4" v-model="keywords.customerOrderNo" :maxlength="20" class="inputItem"  placeholder="请输入客户订单号"/>
      </div>
      <div class="search-btn">
        <Input v-if="tabStatus===4" v-model="keywords.orderNo" :maxlength="20" class="inputItem"  placeholder="请输入订单号" style="margin-left: 0"/>
        <span style="float: right">
          <Button type="primary" @click="search(true)">生成报表</Button>
          <Button style="margin-left: 8px" @click="clearKeywords">清除条件</Button>
        </span>
      </div>
    </div>
    <div style="margin: 18px 0 12px 0">
      <Button type="primary" @click="ProfitsExport">导出</Button>
    </div>
    <!--公司利润-->
    <template v-if="tabStatus===1">
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
          <Col span="24"  style="text-align: right">主营业务收入合计<span class="money">{{res.orderTotalFee}}</span></Col>
        </Row>
        <Row type="flex" justify="start"  class="big-height-2 border-top-none">
          <Col span="6">支出</Col>
          <Col span="6">
          <Row class="middle-height border-top-none border-right-none">
            <Col>承运商运费支出</Col>
          </Row>
          <Row class="middle-height-3 border-top-none border-bottom-none border-right-none">
            <Col>自有车运费支出</Col>
          </Row>
          <Row class="small-height border-right-none border-bottom-none">
            <Col>开票税费</Col>
          </Row>
          </Col>
          <Col span="12" >
          <!-- 承运商运费支出 -->
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
          <!-- 自有车运费支出 -->
          <Row type="flex" justify="start" class="small-height border-top-none border-right-none" >
            <Col span="12">油费</Col>
            <Col span="12" class="num">{{res.myFuelFee}}</Col>
          </Row>
          <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
            <Col span="12">路桥费</Col>
            <Col span="12" class="num">{{res.myTollFee}}</Col>
          </Row>
          <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
            <Col span="12">装货费</Col>
            <Col span="12" class="num">{{res.myLoadFee}}</Col>
          </Row>
          <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
            <Col span="12">卸货费</Col>
            <Col span="12" class="num">{{res.myUnloadFee}}</Col>
          </Row>
          <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
            <Col span="12">保险费</Col>
            <Col span="12" class="num">{{res.myInsuranceFee}}</Col>
          </Row>
          <Row type="flex" justify="start" class="small-height border-top-none border-right-none">
            <Col span="12">住宿费</Col>
            <Col span="12" class="num">{{res.myAccommodation}}</Col>
          </Row>
          <Row type="flex" justify="start" class="small-height border-top-none border-right-none border-bottom-none">
            <Col span="12">其他费用</Col>
            <Col span="12" class="num">{{res.myOtherFee}}</Col>
          </Row>
          <!-- 开票税费 -->
          <Row type="flex" justify="start" class="small-height  border-bottom-none border-right-none">
            <Col span="12">开票税费</Col>
            <Col span="12" class="num">{{res.orderInvoiceFee}}</Col>
          </Row>
          </Col>
        </Row>
        <Row type="flex" justify="start" class="small-height bg border-top-none">
          <Col span="24"  style="text-align: right">主营业务支出合计<span class="money">{{res.carrierTotalFee}}</span></Col>
        </Row>
        <Row type="flex" justify="start" class="small-height bg border-top-none">
          <Col span="24"  style="text-align: right">利润<span class="money">{{res.profits}}</span></Col>
        </Row>
      </div>
    </template>
    <!--发货方利润、整车利润、单票利润-->
    <template v-else>
      <PageTable ref="$table"
                 :key="tabStatus"
                 :columns="tableColumns[tabStatus]"
                 :show-filter="true"
                 :keywords="searchFields"
                 :table-head-type="headType"
                 :url="url[tabStatus]"
                 :autoload="autoload"
                 method="post"
                 @on-load = "onLoad"
      />
    </template>
  </div>
</template>

<script>
import TabHeader from '../components/TabHeader'
import * as profit from '../constant/profit'
import { mapGetters, mapActions } from 'vuex'
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
import PageTable from '@/components/page-table'
import SelectInput from '@/components/SelectInput.vue'
import { getPreMonth } from '../mixins/getPerMonth'
import tableHeadType from '@/libs/constant/headtype.js'
import { getFeeText } from '@/libs/js/config'
export default {
  name: 'report-profit',
  components: {
    TabHeader,
    PageTable,
    SelectInput
  },
  metaInfo: {
    title: '利润报表'
  },
  data: function () {
    return {
      autoload: false,
      tabType: 'PROFIT',
      tabList: profit.TAB_LIST,
      export_url: profit.EXPORT_URL,
      export_title: profit.EXPORT_TITLE,
      tableColumns: profit.TABLECOLUMNS,
      url: profit.URL,
      tabStatus: 1, // 当前标签页
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
        consignerName: '',
        waybillNo: '',
        carNo: '',
        customerOrderNo: '',
        orderNo: ''
      },
      res: profit.res,
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      searchFields: {}
    }
  },
  computed: {
    ...mapGetters([
      'clients'
    ]),
    headType () {
      switch (this.tabStatus) {
        case 2:
          return tableHeadType.CUSTOMER_PROFIT
        case 3:
          return tableHeadType.CAR_PROFIT
        case 4:
          return tableHeadType.SINGLEVOTE_PROFIT
        default:
          return ''
      }
    },
    perMonth () {
      return getPreMonth()
    }
  },
  methods: {
    ...mapActions([
      'getClients'
    ]),
    // 判断对象中字段是否有值 有值 - true
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
    loadDate (data) {
      // 公司利润
      Server({
        url: '/report/for/profits',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data: data
      }).then((res) => {
        if (res.data.code === 10000) {
          this.res = res.data.data
          this.onLoad(res.data.data)
          for (let key in this.res) {
            // this.res[key] = this.res[key] === '' ? '-' : (this.res[key] / 100).toFixed(2)
            this.res[key] = getFeeText(this.res[key])
          }
        }
      })
    },
    search (type) {
      // 1、搜索条件为空，作提示
      if (!this.isEmpty(this.keywords)) {
        if (type) {
          this.$Message.error('请先输入搜索条件')
        }
      }
      switch (this.tabStatus) {
        case 1:
          this.searchFields = {
            startTime: this.keywords.startTime || undefined,
            endTime: this.keywords.endTime || undefined
          }
          this.loadDate(this.searchFields)
          break
        case 2:
          this.searchFields = {
            startTime: this.keywords.startTime || undefined,
            endTime: this.keywords.endTime || undefined,
            consignerName: this.keywords.consignerName || undefined
          }
          break
        case 3:
          this.searchFields = {
            startTime: this.keywords.startTime || undefined,
            endTime: this.keywords.endTime || undefined,
            waybillNo: this.keywords.waybillNo || undefined,
            carNo: this.keywords.carNo || undefined
          }
          break
        case 4:
          this.searchFields = {
            startTime: this.keywords.startTime || undefined,
            endTime: this.keywords.endTime || undefined,
            consignerName: this.keywords.consignerName || undefined,
            customerOrderNo: this.keywords.customerOrderNo || undefined,
            orderNo: this.keywords.orderNo || undefined
          }
          break
      }
    },
    // 清空时间
    clearTimes () {
      this.times = ['', '']
      this.keywords.startTime = ''
      this.keywords.endTime = ''
      // this.search(false)
    },
    clearKeywords () {
      this.operateValue = ''
      this.times = ['', '']
      this.keywords = {
        startTime: '',
        endTime: '',
        consignerName: '',
        waybillNo: '',
        carNo: '',
        customerOrderNo: '',
        orderNo: ''
      }
      this.search(false)
    },
    handleOperaterValue (btn) {
      this.operateValue = btn.value
      // 对应时间改变
      this.date(btn.value)
    },
    handleTimeChange (val) {
      this.keywords.startTime = val[0] ? (val[0] + ' 00:00:00') : ''
      this.keywords.endTime = val[1] ? (val[1] + ' 23:59:59') : ''
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
          start = this.formatDate(now - 6 * 24 * 60 * 60 * 1000)
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
          if (month > 6) {
            start = year + '-0' + (month - 5) + '-01'
          } else {
            start = (year - 1) + '-0' + (12 + parseInt(month) - 5) + '-01'
          }
          break
      }
      this.times = [start, end]
      this.keywords.startTime = start + ' 00:00:00'
      this.keywords.endTime = end + ' 23:59:59'
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
        url: this.export_url[this.tabStatus],
        method: 'post',
        data: this.searchFields,
        fileName: this.export_title[this.tabStatus]
      })
    },
    // 判断是否可以导出
    onLoad (res) {
      if (this.tabStatus === 1) {
        this.isExport = false
        for (let key in res) {
          if (res[key]) {
            this.isExport = true
            break
          }
        }
      } else {
        if (res.data.data.list && res.data.data.list.length > 0) {
          this.isExport = true
        } else {
          this.isExport = false
        }
      }
    },
    // tab切换
    tabChanged (tab) {
      // 设置当前tab状态
      this.tabStatus = this.setTabStatus(tab)
      // 改为不可下载状态
      this.isExport = false
      // 清空搜索条件
      this.operateValue = ''
      this.times = ['', '']
      this.keywords = {
        startTime: '',
        endTime: '',
        consignerName: '',
        waybillNo: '',
        carNo: '',
        customerOrderNo: '',
        orderNo: ''
      }
      if (this.tabStatus === 1) { // 公司利润报表需要清空数据
        this.res = profit.res
      }
    },
    // 设置标签状态
    setTabStatus (tab) {
      switch (tab) {
        case '公司利润':
          return 1
        case '客户利润':
          return 2
        case '整车利润':
          return 3
        case '单票利润':
          return 4
        default:
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
    margin-top 30px
    /*display flex*/
    /*display -ms-flexbox*/
    /*justify-content space-between*/
    /*-ms-flex-pack justify*/
    background #F9F9F9
    padding 13px
    .inputItem
      width 17%
      display inline-block
      margin-left 30px
    .search-list
      button
        width 80px
    .search-btn
      overflow hidden
      margin-top 15px
      button
        height 32px
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
      padding-right 11.5%
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
    .middle-height-2
      height 270px
      line-height 270px
      border 1px solid #C9CED9
    .middle-height-3
      height 315px
      line-height 315px
      border 1px solid #C9CED9
    .small-height
      border 1px solid #C9CED9
      height 45px
      line-height 45px
    .big-height
      border 1px solid #C9CED9
      height 314px
      line-height 314px
    .big-height-2
      border 1px solid #C9CED9
      height 630px
      line-height 630px
</style>
