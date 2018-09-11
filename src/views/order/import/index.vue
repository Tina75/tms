<template>
  <div class="order-import">
    <div class="i-mb-10">
      <Upload
        ref="uploader"
        :format="['xlsx','xls']"
        :show-upload-list="false"
        :with-credentials="true"
        :on-success="handleSuccess"
        :on-error="handleError"
        name="file"
        action="//yapi.yundada56.com/mock/214/order/template/import"
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style="display:inline-block">
        <Button type="primary">导入文件</Button>
      </Upload>
      <Button class="i-ml-10" to="/order/template/download" target="_blank">下载模板</Button>
    </div>
    <PageTable ref="pageTable" :columns="columns" :data="data" :no-data-text="emptyContent" :show-filter="false">
      <div v-if="data.length === 0" slot="footer">
        <div class="order-import__empty-content van-center">
          <Button type="primary" @click="handleClick">导入文件</Button>
        </div>
      </div>
    </PageTable>

  </div>
</template>

<script>
import PageTable from '@/components/PageTable'
import BaseComponent from '@/basic/BaseComponent'
import BasePage from '@/basic/BasePage'
/**
 * 批量导入
 * 1.文件类型
 * 2.文件大小
 */
export default {
  metaInfo: {
    title: '批量导入'
  },
  components: {
    PageTable
  },
  mixins: [BaseComponent, BasePage],
  data () {
    return {
      emptyContent: `<div>
                      <img />
                      <p>您还没有导入订单，去下载模板导入订单吧！</p>
                    </div>`,
      data: [
        {
          createDate: '2018-9-10',
          importFile: 'test.txt',
          result: '导入成功',
          orderQuantity: 2,
          operator: '离散'
        }
      ],
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
                href: 'javascript:;',
                class: 'i-ml-10'
              }, '查看订单')
            ])
          }
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    // 主动触发上传
    handleClick (e) {
      this.$refs.uploader.handleClick()
    },
    handleSuccess (res, file) {
      // const vm = this
      if (res.code === 1000) {
        this.$Message.success('导入成功')
      }
    },
    handleError (errorInfo, file, fileList) {
      const vm = this
      this.openDialog({
        name: 'order/import/ErrorDialog.vue',
        data: {
          value: 0,
          download: 'javascript:;'
        },
        methods: {
          ok () {
            console.log('fetch')
            vm.$refs.pageTable.fetch()
          }
        }
      })
      // this.$Message.error('上传文件失败')
    }
  }
}
</script>

<style lang="stylus" scoped>
.order-import
  &__empty-content
    margin 0
    position relative
    &::after
      display block
      position absolute
      width 100%
      height 3px
      background-color #fff
      content ''
      top -1px
</style>
