<template>
  <div>
    <tab-header :name="curStatusName" :tabs="status" @tabChange="handleTabChange"></tab-header>
    <div style="margin-top: 30px;display: flex;justify-content: space-between;">
      <div>
        <Button v-for="(btn, index) in btnGroup" v-if="hasPower(btn.code)" :key="index" :type="btn.value === operateValue ? 'primary' : 'default'" @click="handleOperateClick(btn)">{{ btn.name }}</Button>
      </div>
      <div v-if="simpleSearch" class="right">
        <Select v-model="selectStatus"  style="width:120px;margin-right: 11px" @on-change="handleChangeSearchStatus">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <SelectInput
          v-if="selectStatus === 0"
          v-model="keywords.consignerName"
          :maxlength="20"
          :remote="false"
          :clearable="true"
          :local-options="clients"
          placeholder="请选择或输入客户名称"
          style="width:200px"
          @on-focus.once="getClients"
          @on-clear="clearKeywords">
        </SelectInput>
        <Input
          v-else-if="selectStatus === 1"
          v-model.lazy="keywords.orderNo"
          :maxlength="30"
          :icon="keywords.orderNo ? 'ios-close-circle' : ''"
          placeholder="请输入订单号"
          style="width: 200px"
          @on-enter="searchList"
          @on-click="clearKeywords"/>
        <Input
          v-else
          v-model.lazy="keywords.waybillNo"
          :maxlength="30"
          :icon="keywords.waybillNo ? 'ios-close-circle' : ''"
          placeholder="请输入运单号"
          style="width: 200px"
          @on-enter="searchList"
          @on-click="clearKeywords"/>
        <Button type="primary" icon="ios-search" style="width: 40px;margin-right: 0;" @click="searchList"></Button>
        <Button type="text" class="high-search" size="small" @click="handleSwitchSearch">高级搜索</Button>
      </div>
    </div>
    <div v-if="!simpleSearch" class="operate-box">
      <div style="margin-bottom: 10px;">
        <SelectInput
          v-model="keywords.consignerName"
          :maxlength="20"
          :remote="false"
          :local-options="clients"
          placeholder="请选择或输入客户名称"
          style="width:200px;margin-right: 20px;"
          @on-focus.once="getClients">
        </SelectInput>
        <Input v-model="keywords.orderNo" :maxlength="30" placeholder="请输入订单号" style="width: 200px" />
        <Input v-model="keywords.customerOrderNo" :maxlength="30" placeholder="请输入客户订单号" style="width: 200px" />
        <Input v-model="keywords.waybillNo" :maxlength="30" placeholder="请输入运单号" style="width: 200px" />
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div>
          <area-select v-model="keywords.start" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <area-select v-model="keywords.end" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <DatePicker
            :options="timeOption"
            v-model="times"
            type="daterange"
            format="yyyy-MM-dd"
            placeholder="开始日期-结束日期"
            style="width: 200px;display: inline-block;"
            @on-change="handleTimeChange">
          </DatePicker>
        </div>
        <div>
          <Button type="primary" @click="searchList">搜索</Button>
          <Button type="default" @click="clearKeywords">清除条件</Button>
          <Button type="default" style="margin-right: 0;" @click="handleSwitchSearch">简易搜索</Button>
        </div>
      </div>
    </div>
    <page-table
      ref="pageTable"
      :url="url"
      :method="method"
      :keywords="keyword"
      :columns="tableColumns"
      :extra-columns="extraColumns"
      :show-filter="true"
      style="margin-top: 15px"
      @on-select="handleOnSelect"
      @on-select-cancel="handleOnSelectCancel"
      @on-selection-change="handleSelectionChange"
      @on-column-change="handleColumnChange">
    </page-table>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from '@/components/TabHeader'
import PageTable from '@/components/page-table/'
import Server from '@/libs/js/server'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from '@/components/SelectInput.vue'
import { mapGetters, mapActions } from 'vuex'
import City from '@/libs/js/City'
import SearchMixin from './searchMixin'
export default {
  name: 'receipt',

  components: {
    TabHeader,
    PageTable,
    AreaSelect,
    SelectInput
  },
  mixins: [ BasePage, SearchMixin ],
  metaInfo: { title: '回单管理' },
  data () {
    return {
      url: 'order/getReceiptOrderList',
      method: 'post',
      status: [
        { name: '全部', count: '' },
        { name: '待回收', count: '' },
        { name: '待返厂', count: '' },
        { name: '已返厂', count: '' }
      ],
      keyword: {
        receiptStatus: 0// 默认待回收状态  传给pageTable可重新请求数据
      },
      curStatusName: '待回收',
      btnGroup: [
        { name: '回收', value: 1, code: 110201 },
        { name: '返厂', value: 2, code: 110202 },
        { name: '导出', value: 3, code: 110203 }
      ],
      operateValue: 1,
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '操作',
          key: 'do',
          fixed: 'left',
          width: 100,
          extra: true,
          render: (h, params) => {
            if (params.row.receiptOrder.receiptStatus === 0 && params.row.status === 40 && this.hasPower(110201)) {
              return h('div', [
                h('a', {
                  style: {
                    marginRight: '25px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.openReturnDialog(params, '回收')
                    }
                  }
                }, '回收')
              ])
            } else if (params.row.receiptOrder.receiptStatus === 1 && this.hasPower(110202)) {
              return h('div', [
                h('a', {
                  style: {
                    marginRight: '25px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.openReturnDialog(params, '返厂')
                    }
                  }
                }, '返厂')
              ])
            }
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          fixed: 'left',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            return h('a', {
              props: {
                type: 'text'
              },
              style: {
                marginRight: '5px',
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.openTab({
                    path: '/order-management/detail',
                    query: {
                      id: params.row.orderNo,
                      orderId: params.row.id,
                      from: 'receipt'
                    }
                  })
                }
              }
            }, params.row.orderNo)
          }
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '运单号',
          key: 'waybillNo',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '始发地',
          key: 'start',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            return h('span', City.codeToFullName(params.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            return h('span', City.codeToFullName(params.row.end))
          }
        },
        {
          title: '回单数',
          key: 'receiptCount',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '回收时间',
          key: 'recoveryTime',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            return h('span', params.row.recoveryTime ? new Date(params.row.recoveryTime).Format('yyyy-MM-dd hh:mm:ss') : '')
          }
        },
        {
          title: '返厂时间',
          key: 'returnTime',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            return h('span', params.row.returnTime ? new Date(params.row.returnTime).Format('yyyy-MM-dd hh:mm:ss') : '')
          }
        },
        {
          title: '下单时间',
          key: 'createTime',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            return h('span', params.row.createTime ? new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss') : '')
          }
        },
        {
          title: '发货人',
          key: 'consignerContact',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '发货人手机号',
          key: 'consignerPhone',
          minWidth: 140,
          tooltip: true
        },
        {
          title: '收货人',
          key: 'consigneeContact',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '收货人手机号',
          key: 'consigneePhone',
          minWidth: 140,
          tooltip: true
        },
        {
          title: '要求装货时间',
          key: 'deliveryTime',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            return h('span', params.row.deliveryTime ? new Date(params.row.deliveryTime).Format('yyyy-MM-dd hh:mm:ss') : '')
          }
        },
        {
          title: '期望到货时间',
          key: 'arriveTime',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            return h('span', params.row.arriveTime ? new Date(params.row.arriveTime).Format('yyyy-MM-dd hh:mm:ss') : '')
          }
        },
        {
          title: '结算方式',
          key: 'settlementType',
          minWidth: 120,
          tooltip: true,
          render: (h, params) => {
            return h('span', this.settlementToName(params.row.settlementType))
          }
        },
        {
          title: '总费用',
          key: 'totalFee',
          minWidth: 120,
          tooltip: true,
          render: (h, params) => {
            return h('span', params.row.totalFee ? (params.row.totalFee / 100).toFixed(2) : '')
          }
        }
      ],
      extraColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          fixed: true,
          visible: true
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          fixed: false,
          visible: true
        },
        {
          title: '运单号',
          key: 'waybillNo',
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
          title: '回单数',
          key: 'receiptCount',
          fixed: false,
          visible: true
        },
        {
          title: '回收时间',
          key: 'recoveryTime',
          fixed: false,
          visible: true
        },
        {
          title: '返厂时间',
          key: 'returnTime',
          fixed: false,
          visible: true
        },
        {
          title: '下单时间',
          key: 'createTime',
          fixed: false,
          visible: false
        },
        {
          title: '发货人',
          key: 'consignerContact',
          fixed: false,
          visible: false
        },
        {
          title: '发货人手机号',
          key: 'consignerPhone',
          fixed: false,
          visible: false
        },
        {
          title: '收货人',
          key: 'consigneeContact',
          fixed: false,
          visible: false
        },
        {
          title: '收货人手机号',
          key: 'consigneePhone',
          fixed: false,
          visible: false
        },
        {
          title: '要求装货时间',
          key: 'deliveryTime',
          fixed: false,
          visible: false
        },
        {
          title: '期望到货时间',
          key: 'arriveTime',
          fixed: false,
          visible: false
        },
        {
          title: '结算方式',
          key: 'settlementType',
          fixed: false,
          visible: false
        },
        {
          title: '总费用',
          key: 'totalFee',
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

  created () {
    // 刷新页面停留当前tab页
    if (sessionStorage.getItem('receiptVal')) {
      this.curStatusName = sessionStorage.getItem('receiptVal')
      this.keyword.receiptStatus = this.statusToCode(this.curStatusName)
    } else {
      sessionStorage.setItem('receiptVal', '待回收')
      this.keyword.receiptStatus = 0
    }
  },

  mounted () {
    this.getOrderNum()
  },

  methods: {
    ...mapActions([
      'getClients'
    ]),
    // 获取各状态订单数目
    getOrderNum () {
      Server({
        url: 'order/getReceiptOrderNumByStatus',
        method: 'get'
      }).then((res) => {
        console.log(res)
        let list = res.data.data
        let arr = []
        list.map((item) => {
          if (item.total !== undefined) {
            let t = {
              name: '全部',
              count: ''
            }
            arr.unshift(t)
          }
          if (item.waiting_recovery !== undefined) {
            let p = {
              name: '待回收',
              count: item.waiting_recovery
            }
            arr.push(p)
          }
          if (item.waiting_return_factory !== undefined) {
            let d = {
              name: '待返厂',
              count: item.waiting_return_factory
            }
            arr.push(d)
          }
          if (item.already_returned_factory !== undefined) {
            let d = {
              name: '已返厂',
              count: item.already_returned_factory
            }
            arr.push(d)
          }
        })
        this.status = arr
      })
    },
    // tab状态栏切换
    handleTabChange (val) {
      console.log(val)
      this.curStatusName = val
      this.selectedId = []
      if (val === '全部') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '回收', value: 1, code: 110201 },
          { name: '返厂', value: 2, code: 110202 },
          { name: '导出', value: 3, code: 110203 }
        ]
        this.keywords.receiptStatus = null
      } else if (val === '待回收') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '回收', value: 1, code: 110201 },
          { name: '导出', value: 2, code: 110203 }
        ]
        this.keywords.receiptStatus = 0
      } else if (val === '待返厂') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '返厂', value: 1, code: 110202 },
          { name: '导出', value: 2, code: 110203 }
        ]
        this.keywords.receiptStatus = 1
      } else {
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1, code: 110203 }
        ]
        this.keywords.receiptStatus = 2
      }
      this.isSearching = true
      this.clearKeywords() // 清楚搜索条件
    },
    // 表头按钮批量操作
    handleOperateClick (btn) {
      this.operateValue = btn.value
      if (!this.selectOrderList.length) {
        this.$Message.warning('请至少选择一条信息')
        return
      }
      if (btn.name === '回收') { // receiptStatus都为0且status已到货状态（40） 才可批量回收
        let data = this.selectOrderList.find((item) => {
          return (item.receiptOrder.receiptStatus !== 0 || item.status !== 40)
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持回收')
        } else {
          this.openReturnDialog('', btn.name)
        }
      } else if (btn.name === '返厂') { // receiptStatus都为1 才可批量返厂
        let data = this.selectOrderList.find((item) => {
          return item.receiptOrder.receiptStatus !== 1
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持返厂')
        } else {
          this.openReturnDialog('', btn.name)
        }
      } else { // 导出
      }
    },
    // 打开回收或返厂弹窗 (支持单条、多条操作))
    openReturnDialog (params, name) {
      const _this = this
      const data = {
        id: this.selectOrderList,
        name: name
      }
      // params不为空时，id值为当前行
      if (params) {
        data.id = [params.row]
      }
      _this.openDialog({
        name: 'order-management/dialog/return',
        data: data,
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.getOrderNum() // 刷新tab页数量
          }
        }
      })
    },
    // 状态转为状态码
    statusToCode (name) {
      let code
      switch (name) {
        case '全部':
          code = null
          break
        case '待回收':
          code = 0
          break
        case '待返厂':
          code = 1
          break
        case '已返厂':
          code = 2
          break
        default:
          code = 0
          break
      }
      return code
    }
  }
}
</script>
<style lang='stylus' scoped>
.ivu-btn
  margin-right 15px
  width 80px
.high-search
  width 36px
  height 30px
  line-height 1.1
  padding 0
  white-space normal
  margin-right 0
  margin-left 8px
.operate-box
  background: rgba(249,249,249,1)
  margin: 15px 0
  padding: 10px
  .ivu-input-wrapper,.ivu-auto-complete
    margin-right 20px
</style>
