<template>
  <div class="order-list">
    <Tabs :value="activeTab" @on-click="handleTabClick">
      <TabPane v-for="pane in panes" :key="pane.name" :label="pane.name === 'ALL' ? pane.label : `${pane.label}(${pane.count})`" :name="pane.name">
        <Row>
          <Col span="16">
          <div class="order-list__button-group">
            <Button type="primary">送货调度</Button>
            <Button>提货调度</Button>
            <Button>订单还原</Button>
            <Button>删除</Button>
            <Button>导出</Button>
          </div>
          </Col>
          <Col v-show="mode==0" span="7">
          <Input v-model="keyword" placeholder="客户名称">
          <Select slot="prepend" v-model="name" style="width:80px">
            <Option value="client">客户名称</Option>
            <Option value="orderNo">订单号</Option>
          </Select>
            </Input>
          </Col>
          <Col v-show="mode==0" span="1">
          <a href="javascript:;" class="order-list__search-mode-button" @click="toggleMode">高级搜素</a>
          </Col>
        </Row>
        <Row v-show="mode === 1" :gutter="8">
          <Col span="18">
          <Form ref="formAdvance" :model="formAdvance" :rules="rules">
            <Row :gutter="16">
              <Col span="6">
              <FormItem prop="client">
                <Select v-model="formAdvance.client" clearable filterable placeholder="请选择或输入客户名称">
                  <Option value="菜鸟物流">菜鸟物流</Option>
                </Select>
              </FormItem>
                </Col>
              <Col span="6">
              <FormItem prop="orderNo">
                <Input v-model="formAdvance.orderNo" :maxlength="20" type="text" placeholder="请输入订单号"></Input>
              </FormItem>
                </Col>
              <Col span="6">
              <FormItem prop="clientOrder">
                <Input v-model="formAdvance.clientOrder" :maxlength="20" type="text" placeholder="请输入客户订单号"></Input>
              </FormItem>
                </Col>
              <Col span="6">
              <FormItem prop="expressOrder">
                <Input v-model="formAdvance.expressOrder" :maxlength="20" type="text" placeholder="请输入运单号"></Input>
              </FormItem>
                </Col>
            </Row>
            <Row :gutter="16">
              <Col span="6">
              <FormItem prop="start">
                <Select v-model="formAdvance.start" clearable filterable placeholder="请输入始发地">
                  <Option value="南京">南京</Option>
                </Select>
              </FormItem>
                </Col>
              <Col span="6">
              <FormItem prop="end">
                <Select v-model="formAdvance.end" clearable filterable placeholder="请输入目的地">
                  <Option value="合肥">合肥</Option>
                </Select>
              </FormItem>
                </Col>
              <Col span="6">
              <FormItem prop="date">
                <DatePicker v-model="formAdvance.date" type="daterange" placeholder="开始日期-结束日期"></DatePicker>
              </FormItem>
                </Col>
            </Row>
          </Form>
          </Col>
          <Col span="6" class="order-list__button-group2">
          <Button type="primary">搜索</Button>
          <Button @click="resetForm">清除条件</Button>
          <Button @click="toggleMode">简易搜索</Button>
          </Col>
        </Row>
        <PageTable :columns="filterColumns"></PageTable>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import PageTable from '@/components/PageTable'
import columns from './columns.js'
export default {
  components: {
    PageTable
  },
  data () {
    return {
      keyword: '',
      name: 'client',
      panes: [
        { name: 'ALL', label: '全部', count: 0 },
        { name: 'WAIT_GET', label: '待提货', count: 0 },
        { name: 'ON_WAY', label: '在途', count: 0 },
        { name: 'REACHED', label: '已到货', count: 0 }
      ],
      activeTab: 'ALL',
      filterColumns: columns(),
      mode: 0,
      formAdvance: {
        client: '',
        clientOrder: '',
        orderNo: '',
        expressOrder: '',
        start: '',
        end: '',
        date: ''
      },
      rules: {
        orderNo: [
          { type: 'string', max: '20', message: '订单号最多输入20个字' }
        ]
      }
    }
  },
  methods: {
    handleTabClick (tabName) {
      this.activeTab = tabName
      // 恢复简易搜索
      this.mode = 0
    },
    toggleMode () {
      this.mode = this.mode ? 0 : 1
    },
    getFormInstanceIndex () {
      return this.panes.findIndex(pane => pane.name === this.activeTab)
    },
    resetForm () {
      let index = this.getFormInstanceIndex()
      this.$refs.formAdvance[index].resetFields()
    }
  }
}
</script>

<style lang="stylus" scoped>
.order-list
  background-color #ffffff
  padding 15px
  margin 10px 15px
  &__button-group
    .ivu-btn:not(:first-child)
      margin-left 15px
  &__button-group2
    .ivu-btn:not(:first-child)
      margin-left 6px
  &__search-mode-button
    width 28px
    display block
    margin 2px auto
    line-height 14px
</style>
