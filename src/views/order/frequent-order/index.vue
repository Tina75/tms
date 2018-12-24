<template>
  <div>
    <page-table
      :url="url"
      :method="method"
      :columns="tableColumns">
    </page-table>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import PageTable from '@/components/page-table/'
export default {
  name: 'frequent-order',
  components: {
    PageTable
  },
  mixins: [BasePage],
  data () {
    return {
      tabType: 'ORDER',
      method: 'post',
      url: 'order/list',
      /**
       * 字段需对应
       */
      tableColumns: [
        {
          title: '操作',
          width: 180,
          render (h, params) {
            const btnList = []
            btnList.push(h('a', {
              on: {
                click (e) {
                  console.log(e)
                }
              }
            }, '再来一担'))
            btnList.push(h('a', {
              on: {
                click (e) {
                  console.log(e)
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
    handleSelectionChange () {

    },
    handleColumnChange () {

    }
  }
}
</script>
