<template>
  <div class="order-import">
    <div class="i-mb-20">
      <Upload :format="['xlsx']" action="/order/template/import" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style="display:inline-block">
        <Button type="primary">导入文件</Button>
      </Upload>
      <Button class="i-ml-10" to="/order/template/download">下载模板</Button>
    </div>
    <Table :columns="columns" :no-data-text="emptyContent"></Table>

  </div>
</template>

<script>
/**
 * 批量导入
 * 1.文件类型
 * 2.文件大小
 */
export default {
  data () {
    return {
      emptyContent: '<div><h1>2323</h1></div>',
      columns: [
        {
          title: '导入日期',
          key: 'createDate'
        },
        {
          title: '导入文件名',
          key: 'importFile'
        },
        {
          title: '导入结果',
          key: 'result'
        },
        {
          title: '导入订单数',
          key: 'orderQuantity'
        },
        {
          title: '操作人',
          key: 'operator'
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('a', {
                href: 'javascript:;'
              }, '下载'),
              h('a', {
                href: 'javascript:;'
              }, '查看订单')
            ])
          }
        }
      ]
    }
  }
}
</script>

<style>

</style>
