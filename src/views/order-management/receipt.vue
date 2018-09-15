<template>
  <div>
    <tab-header :tabs="status" @tabChange="handleTabChange"></tab-header>
    <div style="margin-top: 30px;display: flex;justify-content: space-between;">
      <div>
        <Button v-for="(btn, index) in btnGroup" :key="index" :type="btn.value === operateValue ? 'primary' : 'default'" @click="handleOperateClick(btn)">{{ btn.name }}</Button>
      </div>
      <div v-if="simpleSearch" class="right">
        <Select v-model="selectStatus"  style="width:120px;margin-right: 11px">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <!-- <Input
          v-if="selectStatus === 0"
          v-model="customerName"
          placeholder="请输入客户名称"
          search
          style="width: 200px"
          @on-click="searchList" /> -->
        <AutoComplete
          v-if="selectStatus === 0"
          v-model="customerName"
          :data="customerData"
          clearable
          placeholder="请选择或输入客户名称"
          style="width:200px"
          @on-search="searchList">
        </AutoComplete>
        <Input v-else-if="selectStatus === 1" v-model="orderNum" placeholder="请输入订单号" style="width: 200px" clearable />
        <Input v-else v-model="waybillNum" placeholder="请输入运单号" style="width: 200px" clearable />
        <Button type="primary" icon="ios-search" style="width: 40px;margin-right: 0;" @on-click="searchList"></Button>
        <Button type="text" class="high-search" size="small" @click="handleSwitchSearch">高级搜索</Button>
      </div>
    </div>
    <div v-if="!simpleSearch" class="operate-box">
      <div style="margin-bottom: 10px;">
        <AutoComplete
          v-model="customerName"
          :data="customerData"
          placeholder="请选择或输入客户名称"
          style="width:200px">
        </AutoComplete>
        <Input v-model="orderNum" placeholder="请输入订单号" style="width: 200px" />
        <Input v-model="customerOrderNum" placeholder="请输入客户订单号" style="width: 200px" />
        <Input v-model="waybillNum" placeholder="请输入运单号" style="width: 200px" />
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div>
          <Input v-model="customerOrderNum" placeholder="请输入始发地" style="width: 200px" />
          <Input v-model="waybillNum" placeholder="请输入目的地" style="width: 200px" />
          <DatePicker type="daterange" split-panels placeholder="开始日期-结束日期" style="width: 200px"></DatePicker>
        </div>
        <div>
          <Button type="primary">搜索</Button>
          <Button type="default">清除条件</Button>
          <Button type="default" style="margin-right: 0;" @click="handleSwitchSearch">简易搜索</Button>
        </div>
      </div>
    </div>
    <page-table
      :url="url"
      :method="method"
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
export default {
  name: 'receipt',

  components: {
    TabHeader,
    PageTable
  },
  mixins: [ BasePage ],
  metaInfo: { title: '回单管理' },
  data () {
    return {
      url: 'order/getReceiptOrderList',
      method: 'post',
      status: [
        { name: '全部', count: '' },
        { name: '待回收', count: '123' },
        { name: '待返厂', count: 123 },
        { name: '已返厂', count: '23' }
      ],
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
      customerName: '',
      orderNum: '',
      customerOrderNum: '',
      waybillNum: '',
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
              }, '回收')
            ])
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
                  this.$router.push({
                    path: '/order-management/detail'
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
          key: 'start'
        },
        {
          title: '目的地',
          key: 'end'
        },
        {
          title: '回单数',
          key: 'volume'
        },
        {
          title: '回收时间',
          key: 'recoveryTime'
        },
        {
          title: '返厂时间',
          key: 'returnTime'
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

  computed: {},

  mounted () {},

  methods: {
    searchList () {
      console.log('触发')
    },
    handleSwitchSearch () {
      this.simpleSearch = !this.simpleSearch
    },
    handleTabChange (val) {
      console.log(val)
      if (val === '全部') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '回收', value: 1 },
          { name: '返厂', value: 2 },
          { name: '导出', value: 3 }
        ]
      } else if (val === '待回收') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '回收', value: 1 },
          { name: '导出', value: 2 }
        ]
      } else if (val === '待返厂') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '返厂', value: 1 },
          { name: '导出', value: 2 }
        ]
      } else {
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1 }
        ]
      }
    },
    // 表头按钮相关操作
    handleOperateClick (btn) {
      this.operateValue = btn.value
      const _this = this
      if (!this.selectReceiptList.length) {
        this.$Message.warning('请至少选择一条信息')
        return
      }
      if (btn.name !== '导出') {
        _this.openDialog({
          name: 'order-management/dialog/return',
          data: { id: this.selectReceiptList, name: btn.name },
          methods: {
            ok (node) {
              _this.onAddUserSuccess(node)
            }
          }
        })
      }
    },
    onAddUserSuccess () {
      this.$Message.success('This is a success tip')
    },
    handleColumnChange (val) {
      console.log(val)
      this.extraColumns = val
    },
    handleSelectionChange (val) {
      this.selectReceiptList = val
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
