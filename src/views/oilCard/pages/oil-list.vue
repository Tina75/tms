<template>
  <div>
    <!--搜索列表-->
    <div class="query-box">
      <Form :model="queryParams"   label-position="left" inline>
        <Row>
          <Col span="6">
          <FormItem :label-width="65" label="卡号：">
            <Input v-model="queryParams.number" :maxlength="30" placeholder="请输入主卡号或副卡号"></Input>
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
              class="actionBtn"
              @click="item.func">
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
      url="/oilCard/queryList"
      @on-selection-change="selectionChanged"></PageTable>
  </div>
</template>

<script>
import { OILBTN, oilTableColumns } from '../constant/oil'
import commonmixin from '../mixin/commonmixin'
import operateBtnMixin from '../mixin/operateBtnMixin'
import contantmixin from '../mixin/contantmixin'
import BasePage from '@/basic/BasePage'
import Export from '@/libs/js/export'
// import Server from '@/libs/js/server'
export default {
  name: 'oil-list',
  mixins: [BasePage, commonmixin, operateBtnMixin, contantmixin],
  metaInfo: {
    title: '油卡列表'
  },
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
    // 新增
    add () {
      let _this = this
      this.openDialog({
        name: 'oilCard/dialog/addEdit',
        data: {
          mode: 1,
          title: '新增油卡'
        },
        methods: {
          ok () {
            _this.fetchData()
          }
        }
      })
    },
    // 停用
    stop () {
      if (this.tableSelection.length === 0) {
        this.$Message.warning('请先选择')
        return
      }
      let _this = this
      let idList = this.tableSelection.map(item => {
        return item.id
      })
      console.log(idList)
      this.$Modal.confirm({
        title: '停用',
        content: '是否确认停用所选油卡',
        okText: '确认',
        cancelText: '取消',
        async onOk () {
          let vm = _this
          _this.openDialog({
            name: 'oilCard/dialog/operate',
            data: {
              title: '油卡停用',
              operate: {
                idList: idList,
                type: 1 // 1停用，2启用
              }
            },
            methods: {
              ok () {
                vm.fetchData()
              }
            }
          })
        }
      })
    },
    // 启用
    start () {
      if (this.tableSelection.length === 0) {
        this.$Message.warning('请先选择')
        return
      }
      let _this = this
      let idList = this.tableSelection.map(item => {
        return item.id
      })
      console.log(idList)
      this.$Modal.confirm({
        title: '启用',
        content: '是否确认启用所选油卡',
        okText: '确认',
        cancelText: '取消',
        async onOk () {
          let vm = _this
          _this.openDialog({
            name: 'oilCard/dialog/operate',
            data: {
              title: '油卡启用',
              operate: {
                idList: idList,
                type: 2 // 1停用，2启用
              }
            },
            methods: {
              ok () {
                vm.fetchData()
              }
            }
          })
        }
      })
    },
    // 导出
    export () {
      Export({
        url: '/oilCard/export',
        method: 'post',
        data: this.searchFields,
        fileName: '油卡汇总信息'
      })
    },
    // 到详情页
    toDetail (p) {
      this.openTab({
        title: p.row.number,
        path: '/oilCard/detail/detail',
        query: {
          shipperOrderId: p.row.id
        }
      })
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
