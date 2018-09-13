<template>
  <div>
    <TabHeader :tabs="status" @tabChange="handleTabChange"></TabHeader>
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
    <PageTable :columns="tableColumns" :extra-columns="extraColumns" :data="tableData" :show-filter="true" style="margin-top: 15px" @on-column-change="handleColumnChange"></PageTable>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from '@/components/TabHeader'
import PageTable from '@/components/page-table/'
export default {
  name: 'WaybillManager',
  components: { TabHeader, PageTable },
  mixins: [ BasePage ],
  metaInfo: { title: '运单管理' },
  data () {
    return {
      status: [
        { name: '全部', count: '' },
        { name: '待派车', count: '123' },
        { name: '待发运', count: '123' },
        { name: '在途', count: '23' },
        { name: '已到货', count: '12' }
      ],
      btnGroup: [
        { name: '发运', value: 1 },
        { name: '打印', value: 2 },
        { name: '到货', value: 3 },
        { name: '删除', value: 4 },
        { name: '位置', value: 4 },
        { name: '导出', value: 5 }
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
          width: 180,
          extra: true,
          render: (h, params) => {
            if (params.row.orderNo === 'D111111') {
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
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          width: 160,
          fixed: true,
          visible: true
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
          key: 'consignerName',
          width: 180
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
          title: '里程数（公里）',
          key: 'kilometres'
        },
        {
          title: '体积（方）',
          key: 'volume',
          width: 100
        },
        {
          title: '重量（吨）',
          key: 'weight',
          width: 100
        },
        {
          title: '下单时间',
          key: 'create_time',
          width: 150
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
          key: 'create_time',
          fixed: false,
          visible: true
        }
      ],
      tableData: [
        {
          orderNo: 'D21234734637647',
          customerOrderNo: 'D2123473',
          waybillNo: 'D2123473',
          consignerName: '南京可口可乐有限公司',
          start: '江苏省南京市',
          end: '新疆乌鲁木齐',
          kilometres: 45,
          volume: 45,
          weight: 78,
          create_time: '2018-08-09 12:00:23'
        },
        {
          orderNo: 'D111111',
          customerOrderNo: 'D2123473',
          waybillNo: 'D2123473',
          consignerName: '南京可口可乐有限公司',
          start: '江苏省南京市',
          end: '新疆乌鲁木齐',
          kilometres: 45,
          volume: 45,
          weight: 78,
          create_time: '2018-08-09 12:00:23'
        },
        {
          orderNo: 'D111111',
          customerOrderNo: 'D2123473',
          waybillNo: 'D2123473',
          consignerName: '南京可口可乐有限公司',
          start: '江苏省南京市',
          end: '新疆乌鲁木齐',
          kilometres: 45,
          volume: 45,
          weight: 78,
          create_time: '2018-08-09 12:00:23'
        },
        {
          orderNo: 'D21234734637647',
          customerOrderNo: 'D2123473',
          waybillNo: 'D2123473',
          consignerName: '南京可口可乐有限公司',
          start: '江苏省南京市',
          end: '新疆乌鲁木齐',
          kilometres: 45,
          volume: 45,
          weight: 78,
          create_time: '2018-08-09 12:00:23'
        }
      ]
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
          { name: '送货调度', value: 1 },
          { name: '提货调度', value: 2 },
          { name: '订单还原', value: 3 },
          { name: '删除', value: 4 },
          { name: '导出', value: 5 }
        ]
      } else if (val === '待提货') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '提货调度', value: 1 },
          { name: '订单还原', value: 2 },
          { name: '删除', value: 3 },
          { name: '导出', value: 4 }
        ]
      } else if (val === '待调度') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '送货调度', value: 1 },
          { name: '提货调度', value: 2 },
          { name: '订单还原', value: 3 },
          { name: '删除', value: 4 },
          { name: '导出', value: 5 }
        ]
      } else {
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1 }
        ]
      }
    },
    handleOperateClick (btn) {
      this.operateValue = btn.value
    },
    showTableRow (e) {
      console.log(e)
    },
    openOuterDialog (params) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/outer',
        data: { id: params.row.orderNo },
        methods: {
          ok (node) {
            _this.onAddUserSuccess(node)
          }
        }
      })
    },
    openSeparateDialog (params) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/separate',
        data: { id: params.row.orderNo },
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
    handleColumnChange (val) {
      console.log(val)
      this.extraColumns = val
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
