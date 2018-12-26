<template>
  <div>
    <!--搜索列表-->
    <div class="query-box">
      <Form :model="queryParams"   label-position="left" inline>
        <Row>
          <Col span="6">
          <FormItem :label-width="65" label="油卡号：">
            <Input v-model="queryParams.number" :maxlength="20" placeholder="请输入主卡号或副卡号"></Input>
          </FormItem>
          </Col>
          <Col offset="3" span="6">
          <FormItem :label-width="65" label="持卡人：">
            <Input v-model="queryParams.driverName" :maxlength="15" placeholder="请输入持卡人"></Input>
          </FormItem>
        </Col>
          <Col offset="3" span="6">
          <FormItem :label-width="65" label="车牌号：">
            <Input v-model="queryParams.truckNo" :maxlength="15" placeholder="请输入车牌号"></Input>
          </FormItem>
        </Col>
        </Row>
        <Row class="item-row">
          <Col span="6">
          <FormItem :label-width="65" label="承运商：">
            <Input v-model="queryParams.carrierName" :maxlength="10" placeholder="请输入承运商"></Input>
          </FormItem>
          </Col>
          <Col span="6">
          <div class="query-btn">
            <Button type="primary" @click="fetchData">搜索</Button>
            <Button @click="clearParams">清除条件</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </div>
    <!--操作按钮-->
    <div class="operateBtn">
      <Button v-for="(item, key) in showButtons" :key="key"
              :type="key === 0 ? 'primary' : 'default'"
              class="actionBtn">
        {{ item.name }}
      </Button>
    </div>
    <!--列表展示-->
    <PageTable
      :columns="tableColumns"
      :keywords="searchFields"
      class="pageTable"
      row-id="id"
      method="post"
      url="http://192.168.1.39:3000/mock/214/oilCard/queryList"
      @on-selection-change="selectionChanged"></PageTable>
  </div>
</template>

<script>
import { OILBTN, oilTableColumns } from '../constant/oil'
import commonmixin from '../mixin/commonmixin'
export default {
  name: 'oil-list',
  mixins: [commonmixin],
  data () {
    return {
      searchFields: {}, // 发起请求时的搜索字段
      queryParams: {
        number: '',
        driverName: '',
        truckNo: '',
        carrierName: ''
      },
      currentBtns: OILBTN(this),
      tableColumns: oilTableColumns(this),
      tableSelection: []
    }
  },
  methods: {
    fetchData () {
      this.tableSelection = []
      this.$refs.$table && this.$refs.$table.clearSelected() // 清空已选项
      this.searchFields = this.setFetchParams()
    },
    setFetchParams () {
      let obj = {}
      for (let key in this.queryParams) {
        this.queryParams[key] ? (obj[key] = this.queryParams[key]) : (obj[key] = '')
      }
      return obj
    },
    clearParams () {
      for (let key in this.queryParams) {
        if (this.queryParams[key]) {
          this.queryParams[key] = ''
        }
      }
    },
    // 状态对应样式
    statusClass (value) {
      let statusClass = ''
      switch (value) {
        case 1: statusClass = 'status-warning'
          break
        case 2: statusClass = 'status-success'
          break
        case 3: statusClass = 'status-err'
          break
        default:
          break
      }
      return statusClass
    },
    // 选中的表格行
    selectionChanged (selection) {
      this.tableSelection = selection
    },
    // 分配
    assign () {
      console.log('assign')
    },
    // 充值
    recharge () {
      console.log('recharge')
    },
    // 加油
    refuel () {
      console.log('refuel')
    },
    // 转账
    transfer () {
      console.log('transfer')
    },
    // 修改
    update () {
      console.log('update')
    },
    // 回收
    recover () {
      console.log('recover')
    },
    // 到详情页
    toDetail () {
      console.log('toDetail')
    }
  }
}
</script>

<style scoped  lang="stylus">
  @import "../style/common.styl"
.pageTable
  /deep/
    .status-warning
      padding 3px 5px
      color #FA8C15
      background rgba(255,247,230,1)
    .status-success
      padding 3px 5px
      color #00C185
      background rgba(229,255,243,1)
    .status-err
      padding 3px 5px
      color #EE2017
      background rgba(255,241,240,1)
</style>
