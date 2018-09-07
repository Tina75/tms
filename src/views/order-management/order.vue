<template>
  <div>
    <tab-header :tabs="status"></tab-header>
    <div style="margin-top: 30px;display: flex;justify-content: space-between;">
      <div>
        <Button v-for="(btn, index) in btnGroup" :key="index" :type="btn.type">{{ btn.name }}</Button>
      </div>
      <div v-if="simpleSearch" class="right">
        <Select v-model="selectStatus"  style="width:120px;margin-right: 11px">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input v-if="selectStatus === 0" v-model="customerName" placeholder="请输入客户名称" search style="width: 200px"  @on-click="searchList" />
        <Input v-else-if="selectStatus === 1" v-model="orderNum" placeholder="请输入订单号" search style="width: 200px"  @on-click="searchList" />
        <Input v-else v-model="waybillNum" placeholder="请输入运单号" search style="width: 200px"  @on-click="searchList" />
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
    <page-table :columns="tableColumns" :data="tableData" style="margin-top: 15px"></page-table>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from '@/components/TabHeader'
import PageTable from '@/components/PageTable'
export default {
  name: 'order',

  components: {
    TabHeader,
    PageTable
  },
  mixins: [ BasePage ],
  metaInfo: { title: '订单管理' },
  data () {
    return {
      status: [
        { name: '全部', count: '' },
        { name: '待提货', count: '123' },
        { name: '待调度', count: 123 },
        { name: '在途', count: '23' },
        { name: '已到货', count: '12' },
        { name: '已回单', count: '3333' }
      ],
      btnGroup: [
        { name: '送货调度', type: 'primary' },
        { name: '提货调度', type: 'default' },
        { name: '订单还原', type: 'default' },
        { name: '删除', type: 'default' },
        { name: '导出', type: 'default' }
      ],
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
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      tableData: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
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
