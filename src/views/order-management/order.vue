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
        <!-- <Input
          v-if="selectStatus === 0"
          v-model="consignerName"
          placeholder="请输入客户名称"
          search
          style="width: 200px"
          @on-click="searchList" /> -->
        <AutoComplete
          v-if="selectStatus === 0"
          v-model="keywords.consignerName"
          :data="customerData"
          :filter-method="filterMethod"
          clearable
          placeholder="请选择或输入客户名称"
          style="width:200px"
          @on-select="searchList"
          @on-change="autoSearch">
        </AutoComplete>
        <Input v-else-if="selectStatus === 1" v-model="keywords.orderNo" placeholder="请输入订单号" style="width: 200px" clearable @on-enter="searchList" @on-change="autoSearch"/>
        <Input v-else v-model="keywords.waybillNo" placeholder="请输入运单号" style="width: 200px" clearable @on-enter="searchList" @on-change="autoSearch"/>
        <Button type="primary" icon="ios-search" style="width: 40px;margin-right: 0;" @click="searchList"></Button>
        <Button type="text" class="high-search" size="small" @click="handleSwitchSearch">高级搜索</Button>
      </div>
    </div>
    <div v-if="!simpleSearch" class="operate-box">
      <div style="margin-bottom: 10px;">
        <AutoComplete
          v-model="keywords.consignerName"
          :data="customerData"
          :filter-method="filterMethod"
          placeholder="请选择或输入客户名称"
          style="width:200px">
        </AutoComplete>
        <Input v-model="keywords.orderNo" placeholder="请输入订单号" style="width: 200px" />
        <Input v-model="keywords.customerOrderNo" placeholder="请输入客户订单号" style="width: 200px" />
        <Input v-model="keywords.waybillNo" placeholder="请输入运单号" style="width: 200px" />
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div style="">
          <area-select v-model="keywords.start" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <area-select v-model="keywords.end" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <DatePicker v-model="times" type="daterange" format="yyyy-MM-dd" split-panels placeholder="开始日期-结束日期" style="width: 200px;display: inline-block;" @on-change="handleTimeChange"></DatePicker>
        </div>
        <div>
          <Button type="primary" @click="searchList">搜索</Button>
          <Button type="default" @click="clearKeywords">清除条件</Button>
          <Button type="default" style="margin-right: 0;" @click="handleSwitchSearch">简易搜索</Button>
        </div>
      </div>
    </div>
    <page-table
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
export default {
  name: 'order',

  components: {
    TabHeader,
    PageTable,
    AreaSelect
  },
  mixins: [ BasePage ],
  metaInfo: { title: '订单管理' },
  data () {
    return {
      url: 'order/list',
      method: 'post',
      status: [
        { name: '全部', count: '' },
        { name: '待提货', count: '' },
        { name: '待调度', count: '' },
        { name: '在途', count: '' },
        { name: '已到货', count: '' },
        { name: '已回单', count: '' }
      ],
      curStatusName: '全部',
      btnGroup: [
        { name: '送货调度', value: 1 },
        { name: '提货调度', value: 2 },
        { name: '订单还原', value: 3 },
        { name: '删除', value: 4 },
        { name: '导出', value: 5 }
      ],
      operateValue: 1,
      selectStatus: 0, // 当前搜索状态   0：客户名称   1：订单号  2：运单号
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
        status: null,
        consignerName: '',
        orderNo: '',
        waybillNo: '',
        customerOrderNo: '',
        // startTime: '',
        // endTime: '',
        start: [],
        end: []
      },
      times: ['', ''],
      customerData: ['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive'],
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
            if (this.curStatusName === '全部' || this.curStatusName === '待提货' || this.curStatusName === '待调度') {
              // 未拆且未转 显示拆单、外转按钮
              if (params.row.parentId === '0' && params.row.disassembleStatus === '0' && params.row.transStatus === '0') {
                if (params.row.pickup === '1') { // 如果是上门提货则没有外转
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
                          this.openSeparateDialog(params)
                        }
                      }
                    }, '拆单')
                  ])
                } else {
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
                          this.openSeparateDialog(params)
                        }
                      }
                    }, '拆单'),
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
                          this.openOuterDialog(params)
                        }
                      }
                    }, '外转')
                  ])
                }
              } else if (params.row.parentId === '0' && params.row.disassembleStatus === '1') { // 已拆且是父单  显示还原、删除按钮
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
                        this.openResOrDelDialog(params, '还原')
                      }
                    }
                  }, '还原'),
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
                        this.openResOrDelDialog(params, '删除')
                      }
                    }
                  }, '删除')
                ])
              } else if (params.row.parentId !== '0') { // 子单   显示拆单按钮
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
                        this.openSeparateDialog(params)
                      }
                    }
                  }, '拆单')
                ])
              } else if (params.row.transStatus === '1') {} // 订单外转  不显示按钮
            }
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          className: 'padding-20',
          render: (h, params) => {
            if (params.row.parentId !== '0') {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    background: '#418DF9',
                    borderRadius: '2px',
                    color: '#fff',
                    lineHeight: '14px',
                    textAlign: 'center',
                    marginRight: '5px',
                    marginLeft: '-19px'
                  }
                }, '子'),
                h('a', {
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
                          from: 'order'
                        }
                      })
                    }
                  }
                }, params.row.orderNo)
              ])
            } else {
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
                        id: params.row.orderNo
                      }
                    })
                  }
                }
              }, params.row.orderNo)
            }
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
          key: 'start'
        },
        {
          title: '目的地',
          key: 'end'
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        },
        {
          title: '下单时间',
          key: 'createTime'
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
          title: '里程数（公里）',
          key: 'kilometres',
          fixed: false,
          visible: true
        },
        {
          title: '体积（方）',
          key: 'volume',
          fixed: false,
          visible: true
        },
        {
          title: '重量（吨）',
          key: 'weight',
          fixed: false,
          visible: true
        },
        {
          title: '下单时间',
          key: 'createTime',
          fixed: false,
          visible: true
        }
      ],
      selectOrderList: [] // 选中的订单集合
    }
  },

  computed: {},

  watch: {},

  mounted () {
    this.getOrderNum()
  },

  methods: {
    // 获取各状态订单数目
    getOrderNum () {
      Server({
        url: 'order/getOrderNum',
        method: 'get'
      }).then((res) => {
        console.log(res)
        let list = res.data.data.orderNumList
        list.map((item) => {
          if (item.name === 'total') {
            item.name = '全部'
          }
          if (item.name === 'pickup') {
            item.name = '待提货'
          }
          if (item.name === 'dispatch') {
            item.name = '待调度'
          }
          if (item.name === 'transit') {
            item.name = '在途'
          }
          if (item.name === 'arrive') {
            item.name = '已到货'
          }
          if (item.name === 'receipt') {
            item.name = '已回单'
          }
        })
        this.status = list
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
    },
    // 点X清除搜索条件时  默认为无搜索条件下的数据
    autoSearch () {
      if (this.selectStatus === 0) {
        if (!this.keywords.consignerName) {
          this.searchList()
        }
      } else if (this.selectStatus === 1) {
        if (!this.keywords.orderNo) {
          this.searchList()
        }
      } else {
        if (!this.keywords.waybillNo) {
          this.searchList()
        }
      }
    },
    // 过滤已维护的客户信息
    filterMethod (value, option) {
      if (value) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
      }
    },
    // 清除keywords搜索
    clearKeywords () {
      this.keywords = {
        status: this.keywords.status,
        consignerName: '',
        orderNo: '',
        waybillNo: '',
        customerOrderNo: '',
        // startTime: '',
        // endTime: '',
        start: [],
        end: []
      }
      this.keyword = Object.assign({}, this.keywords, {
        start: null,
        end: null
      })
    },
    // 高级搜索切换
    handleSwitchSearch () {
      this.clearKeywords()
      this.simpleSearch = !this.simpleSearch
    },
    // 修改开始结束时间
    handleTimeChange (val) {
      // this.keywords.startTime = val[0]
      // this.keywords.endTime = val[1]
    },
    // tab状态栏切换
    handleTabChange (val) {
      console.log(val)
      this.curStatusName = val
      if (val === '全部') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '送货调度', value: 1 },
          { name: '提货调度', value: 2 },
          { name: '订单还原', value: 3 },
          { name: '删除', value: 4 },
          { name: '导出', value: 5 }
        ]
        this.keywords.status = null
        this.keyword = {...this.keywords}
      } else if (val === '待提货') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '提货调度', value: 1 },
          { name: '订单还原', value: 2 },
          { name: '删除', value: 3 },
          { name: '导出', value: 4 }
        ]
        this.keywords.status = 10
        this.keyword = {...this.keywords}
      } else if (val === '待调度') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '送货调度', value: 1 },
          { name: '提货调度', value: 2 },
          { name: '订单还原', value: 3 },
          { name: '删除', value: 4 },
          { name: '导出', value: 5 }
        ]
        this.keywords.status = 20
        this.keyword = {...this.keywords}
      } else {
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1 }
        ]
        if (val === '在途') {
          this.keywords.status = 30
        } else if (val === '已到货') {
          this.keywords.status = 40
        } else {
          this.keywords.status = 50
        }
        this.keyword = {...this.keywords}
      }
    },
    // 表头按钮操作
    handleOperateClick (btn) {
      this.operateValue = btn.value
      if (!this.selectOrderList.length) {
        this.$Message.warning('请至少选择一条信息')
        return
      }
      if (btn.name === '送货调度' || btn.name === '提货调度') { // 打开送货或提货调度窗口
        this.openDispatchDialog(btn.name)
      } else if (btn.name === '订单还原' || btn.name === '删除') { // 打开还原或删除窗口
        this.openResOrDelDialog('', btn.name) // 点表头按钮批量操作   params入参为空
      }
    },
    // 外转
    openOuterDialog (params) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/outer',
        data: { id: params.row.id },
        methods: {
          ok (node) {
            _this.onAddUserSuccess(node)
          }
        }
      })
    },
    // 拆单
    openSeparateDialog (params) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/separate',
        data: { id: params.row.id, orderNo: params.row.orderNo },
        methods: {
          ok (node) {
            _this.onAddUserSuccess(node)
          }
        }
      })
    },
    // 送货或提货调度
    openDispatchDialog (name) {
      const _this = this
      _this.openDialog({
        name: 'order-management/dialog/dispatch',
        data: { id: this.selectOrderList, name: name },
        methods: {
          ok (node) {
            _this.onAddUserSuccess(node)
          }
        }
      })
    },
    // 还原或删除 (支持单条和多条)
    openResOrDelDialog (params, name) {
      const _this = this
      const data = {
        id: this.selectOrderList,
        name: name
      }
      // params不为空时，id值为当前行
      if (params) {
        data.id = [params.row]
      }
      console.log(this.selectOrderList)
      _this.openDialog({
        name: 'order-management/dialog/restoreOrDelete',
        data: data,
        methods: {
          ok (node) {
            _this.onAddUserSuccess(node)
          }
        }
      })
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
      this.selectOrderList = val
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
<style lang="stylus">
.padding-20
  .ivu-table-cell
    padding-left 20px
</style>
