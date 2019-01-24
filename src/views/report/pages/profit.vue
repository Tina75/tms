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
      <table class="table-list"  cellpadding="0" cellspacing="0" style="width: 100%;text-align: center">
        <tr class="total">
          <td>方向</td>
          <td>来源</td>
          <td>费用明细</td>
          <td>本期发生额</td>
        </tr>
        <tr>
          <td rowspan="8">收入</td>
          <td rowspan="6">上游运费收入</td>
          <td>运输费</td>
          <td class="money"><div>{{res.orderFreightFee}}</div></td>
        </tr>
        <tr>
          <td>提货费</td>
          <td class="money"><div>{{res.orderPickupFee}}</div></td>
        </tr>
        <tr>
          <td>装货费</td>
          <td class="money"><div>{{res.orderLoadFee}}</div></td>
        </tr>
        <tr>
          <td>卸货费</td>
          <td class="money"><div>{{res.orderUnloadFee}}</div></td>
        </tr>
        <tr>
          <td>保险费</td>
          <td class="money"><div>{{res.orderInsuranceFee}}</div></td>
        </tr>
        <tr>
          <td>其他费用</td>
          <td class="money"><div>{{res.orderOtherFee}}</div></td>
        </tr>
        <tr>
          <td>返现运费收入</td>
          <td>返现运费</td>
          <td class="money"><div>{{res.orderCashBack}}</div></td>
        </tr>
        <tr>
          <td>信息费收入</td>
          <td>信息费</td>
          <td class="money"><div>{{res.infoFee}}</div></td>
        </tr>
        <tr class="total">
          <td></td>
          <td></td>
          <td>主营业务收入合计</td>
          <td class="money totalMoney"><div>{{res.orderTotalFee}}</div></td>
        </tr>
        <tr>
          <td rowspan="14">支出</td>
          <td rowspan="6">承运商运费支出</td>
          <td>运输费</td>
          <td class="money"><div>{{res.carrierFreightFee}}</div></td>
        </tr>
        <tr>
          <td>装货费</td>
          <td class="money"><div>{{res.carrierLoadFee}}</div></td>
        </tr>
        <tr>
          <td>卸货费</td>
          <td class="money"><div>{{res.carrierUnloadFee}}</div></td>
        </tr>
        <tr>
          <td>保险费</td>
          <td class="money"><div>{{res.carrierInsuranceFee}}</div></td>
        </tr>
        <tr>
          <td>路桥费</td>
          <td class="money"><div>{{res.carrierTollFee}}</div></td>
        </tr>
        <tr>
          <td>其他费用</td>
          <td class="money"><div>{{res.carrierOtherFee}}</div></td>
        </tr>
        <tr>
          <td rowspan="7">自有车运费支出</td>
          <td>油费</td>
          <td class="money"><div>{{res.myFuelFee}}</div></td>
        </tr>
        <tr>
          <td>路桥费</td>
          <td class="money"><div>{{res.myTollFee}}</div></td>
        </tr>
        <tr>
          <td>装货费</td>
          <td class="money"><div>{{res.myLoadFee}}</div></td>
        </tr>
        <tr>
          <td>卸货费</td>
          <td class="money"><div>{{res.myUnloadFee}}</div></td>
        </tr>
        <tr>
          <td>保险费</td>
          <td class="money"><div>{{res.myInsuranceFee}}</div></td>
        </tr>
        <tr>
          <td>住宿费</td>
          <td class="money"><div>{{res.myAccommodation}}</div></td>
        </tr>
        <tr>
          <td>其他费用</td>
          <td class="money"><div>{{res.myOtherFee}}</div></td>
        </tr>
        <tr>
          <td>开票税额</td>
          <td>开票税额</td>
          <td class="money"><div>{{res.orderInvoiceFee}}</div></td>
        </tr>
        <tr class="total">
          <td></td>
          <td></td>
          <td>主营业务支出合计</td>
          <td class="money totalMoney"><div>{{res.carrierTotalFee}}</div></td>
        </tr>
        <tr class="total">
          <td></td>
          <td></td>
          <td>利润</td>
          <td class="money totalMoney"><div>{{res.profits}}</div></td>
        </tr>
      </table>
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
      // 'DispatchSet',
      // 'OrderSet'
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
 table.table-list
    color #333
    border-right 1px solid #C9CED9
    border-bottom 1px solid #C9CED9
    tr.total
      background #f8f8f8
      td
        font-weight bold
        border-left none
        &:first-child
          border-left 1px solid #C9CED9
    td
      width 25%
      height 45px
      border-left 1px solid #C9CED9
      border-top 1px solid #C9CED9
    td.money
      div
        text-align right
        padding-right 46%
      &.totalMoney
        color #00A4BD
</style>
