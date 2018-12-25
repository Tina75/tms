<template>
  <div class="frequent-order">
    <div class="right header">
      <span class="search-label">客户名称：</span>
      <SelectInput
        v-model="consignerName"
        :maxlength="20"
        :clearable="true"
        :local-options="clients"
        class="search-input"
        placeholder="请选择或输入客户名称"
        @on-focus.once="getClients"
        @on-clear="clearKeywords">
      </SelectInput>
      <Button type="primary" icon="ios-search" class="search-btn" @click="searchList"></Button>
    </div>
    <page-table
      :url="url"
      :method="method"
      :columns="tableColumns"
      :show-filter="true"
      table-head-type="order_head"
      @on-selection-change="handleSelectionChange"
      @on-column-change="handleColumnChange">
    </page-table>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BasePage from '@/basic/BasePage'
import PageTable from '@/components/page-table/'
import SelectInput from '@/components/SelectInput.vue'
export default {
  name: 'frequent-order',
  components: {
    PageTable,
    SelectInput
  },
  mixins: [BasePage],
  data () {
    return {
      tabType: 'ORDER',
      method: 'post',
      url: 'order/list',
      clients: [],
      consignerName: '',
      /**
       * 字段需对应
       * 操作按钮权限
       */
      tableColumns: [
        {
          title: '操作',
          width: 180,
          render: (h, params) => {
            const btnList = []
            btnList.push(h('a', {
              style: {
                marginRight: '12px'
              },
              on: {
                click: () => {
                  this.openTab({
                    path: 'update',
                    title: '创建订单',
                    query: { id: params.row.id }
                  })
                }
              }
            }, '再来一单'))
            btnList.push(h('a', {
              style: {
                marginRight: '12px'
              },
              on: {
                click: () => {
                  this.openTab({
                    path: 'frequent-order-detail',
                    title: '常发订单详情',
                    query: { id: params.row.id }
                  })
                }
              }
            }, '查看'))
            btnList.push(h('a', {
              on: {
                click: () => {
                  this.$Toast.confirm({
                    content: '确认需要删除此常发订单',
                    onOk: () => {
                      this.deleteItem(params.row)
                    }
                  })
                }
              }
            }, '删除'))
            return h('div', btnList)
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '发货城市',
          key: 'startName',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '到货城市',
          key: 'endName',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '对接业务员',
          key: 'salesmanName',
          minWidth: 180
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
          minWidth: 130,
          tooltip: true
        }
      ]
    }
  },
  methods: {
    searchList () {},
    clearKeywords () {},
    getClients () {},
    // 删除
    deleteItem (id) {
      Server({
        url: 'http://192.168.1.39:3000/mock/214/order/template/delete',
        method: 'post',
        data: {
          id
        }
      }).then((res) => {
        this.$Message.success('删除成功')
        this.searchList()
      })
    },
    handleColumnChange (columns) {
      this.extraColumns = columns
      window.sessionStorage.setItem(this.tabType + '_COLUMNS', JSON.stringify(columns))
    },
    handleSelectionChange () {}
  }
}
</script>
<style lang="stylus" scoped>
.header
  margin-bottom 14px
  text-align right
.search-label
  display inline-block
  width 80px
  margin-right 11px
  vertical-align middle
.search-input
  display inline-block
  width 200px
  vertical-align middle
.search-btn
  width 40px
  margin-left -2px
  height 32px
  border-top-left-radius 0
  border-bottom-left-radius 0
  vertical-align middle
</style>
