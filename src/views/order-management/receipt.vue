<template>
  <div>
    <tab-header :tabs="status" @tabChange="handleTabChange"></tab-header>
    <div style="margin-top: 30px;display: flex;justify-content: space-between;">
      <div>
        <Button v-for="(btn, index) in btnGroup" :key="index" :type="btn.value === operateValue ? 'primary' : 'default'" @click="handleOperateClick(btn)">{{ btn.name }}</Button>
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
          placeholder="请输入订单号"
          style="width: 200px"
          clearable
          @on-enter="searchList"
          @on-change="autoSearch"/>
        <Input
          v-else
          v-model.lazy="keywords.waybillNo"
          :maxlength="30"
          placeholder="请输入运单号"
          style="width: 200px"
          clearable
          @on-enter="searchList"
          @on-change="autoSearch"/>
        <Button type="primary" icon="ios-search" style="width: 40px;margin-right: 0;" @on-click="searchList"></Button>
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
export default {
  name: 'receipt',

  components: {
    TabHeader,
    PageTable,
    AreaSelect,
    SelectInput
  },
  mixins: [ BasePage ],
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
      curStatusName: '',
      btnGroup: [
        { name: '回收', value: 1 },
        { name: '返厂', value: 2 },
        { name: '导出', value: 3 }
      ],
      operateValue: 1,
      selectStatus: 0,
      selectList: [
        {
          value: 0,
          label: '客户名称'
        },
        {
          value: 1,
          label: '订单号'
        },
        {
          value: 2,
          label: '运单号'
        }
      ],
      keyword: {},
      keywords: {
        receiptStatus: null,
        consignerName: null,
        orderNo: null,
        waybillNo: null,
        customerOrderNo: null,
        startTime: null,
        endTime: null,
        start: [],
        end: []
      },
      times: ['', ''],
      timeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      simpleSearch: true,
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '操作',
          key: 'do',
          width: 160,
          extra: true,
          render: (h, params) => {
            if (params.row.receiptStatus === '0') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.openReturnDialog(params, '回收')
                    }
                  }
                }, '回收')
              ])
            } else if (params.row.receiptStatus === '1') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
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
          key: 'customerOrderNo'
        },
        {
          title: '运单号',
          key: 'waybillNo'
        },
        {
          title: '客户名称',
          key: 'consignerName'
        },
        {
          title: '始发地',
          key: 'start',
          render: (h, params) => {
            return h('span', City.codeToFullName(params.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          render: (h, params) => {
            return h('span', City.codeToFullName(params.row.end))
          }
        },
        {
          title: '回单数',
          key: 'volume'
        },
        {
          title: '回收时间',
          key: 'recoveryTime',
          render: (h, params) => {
            return h('span', new Date(params.row.recoveryTime).Format('yyyy-MM-dd hh:mm'))
          }
        },
        {
          title: '返厂时间',
          key: 'returnTime',
          render: (h, params) => {
            return h('span', new Date(params.row.returnTime).Format('yyyy-MM-dd hh:mm'))
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
          key: 'volume',
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
        }
      ],
      selectReceiptList: [] // 选中的回单集合
    }
  },

  computed: {
    ...mapGetters([
      'clients'
    ])
  },

  created () {
    if (sessionStorage.getItem('operateVal')) {
      sessionStorage.removeItem('operateVal')
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
    // 切换搜索条件  客户名称/订单号/运单号
    handleChangeSearchStatus (val) {
      this.clearKeywords()
      this.selectStatus = val
    },
    // 条件搜索
    searchList () {
      this.keyword = Object.assign({}, this.keywords, {
        // 地址搜索为最后一级区号
        start: this.keywords.start.length ? Number(this.keywords.start[this.keywords.start.length - 1]) : null,
        end: this.keywords.end.length ? Number(this.keywords.end[this.keywords.end.length - 1]) : null
      })
      this.selectReceiptList = []
    },
    // 点X清除搜索条件时  默认为无搜索条件下的数据
    autoSearch () {
      if (this.selectStatus === 1) {
        if (!this.keywords.orderNo) {
          this.clearKeywords()
        }
      } else {
        if (!this.keywords.waybillNo) {
          this.clearKeywords()
        }
      }
    },
    // 清除keywords搜索
    clearKeywords () {
      this.keywords = {
        receiptStatus: this.keywords.receiptStatus,
        consignerName: null,
        orderNo: null,
        waybillNo: null,
        customerOrderNo: null,
        start: [],
        end: []
      }
      this.times = ['', '']
      this.keyword = Object.assign({}, this.keywords, {
        start: null,
        end: null,
        startTime: null,
        endTime: null
      })
      this.selectReceiptList = []
    },
    // 高级搜索切换
    handleSwitchSearch () {
      this.clearKeywords()
      this.simpleSearch = !this.simpleSearch
    },
    // 修改开始结束时间
    handleTimeChange (val) {
      this.keywords.startTime = val[0]
      this.keywords.endTime = val[1]
    },
    // tab状态栏切换
    handleTabChange (val) {
      console.log(val)
      this.curStatusName = val
      if (val === '全部') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '回收', value: 1 },
          { name: '返厂', value: 2 },
          { name: '导出', value: 3 }
        ]
        this.keywords.receiptStatus = null
      } else if (val === '待回收') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '回收', value: 1 },
          { name: '导出', value: 2 }
        ]
        this.keywords.receiptStatus = 0
      } else if (val === '待返厂') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '返厂', value: 1 },
          { name: '导出', value: 2 }
        ]
        this.keywords.receiptStatus = 1
      } else {
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1 }
        ]
        this.keywords.receiptStatus = 2
      }
      this.clearKeywords() // 清楚搜索条件
    },
    // 表头按钮批量操作
    handleOperateClick (btn) {
      this.operateValue = btn.value
      if (!this.selectReceiptList.length) {
        this.$Message.warning('请至少选择一条信息')
        return
      }
      if (btn.name === '回收') { // receiptStatus都为0 才可批量回收
        let data = this.selectReceiptList.find((item) => {
          return item.receiptStatus !== '0'
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持回收')
        } else {
          this.openReturnDialog('', btn.name)
        }
      } else if (btn.name === '返厂') { // receiptStatus都为1 才可批量返厂
        let data = this.selectReceiptList.find((item) => {
          return item.receiptStatus !== '1'
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持返厂')
        } else {
          this.openReturnDialog('', btn.name)
        }
      } else { // 导出
      }
    },
    onAddUserSuccess () {
      this.$Message.success('This is a success tip')
    },
    // 筛选列表显示字段
    handleColumnChange (val) {
      console.log(val)
      this.extraColumns = val
    },
    // 列表批量选择操作
    handleSelectionChange (val) {
      this.selectReceiptList = val
    },
    // 打开回收或返厂弹窗 (支持单条、多条操作))
    openReturnDialog (params, name) {
      const _this = this
      const data = {
        id: this.selectReceiptList,
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
          }
        }
      })
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
