<template>
  <div class="order-import">
    <div class="i-mb-10 ivu-upload">
      <Button v-if="hasPower(100201)" type="primary" @click="handleClick">导入历史订单</Button>
      <input
        ref="fileInput"
        name="file"
        type="file"
        class="ivu-upload-input"
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="handleChange"
      />
      <TimerPoptip :disabled="!showPoptip" max-width="246" content="为方便您导入更多的数据，我们更新了导入模板，请下载最新的导入模板">
        <Badge :dot="needUpdate">
          <a v-if="hasPower(100202)" :href="downloadUrl" download="下载模板" class="i-ml-10 ivu-btn ivu-btn-default" @click="handleDownload">下载模板</a>
        </Badge>
      </TimerPoptip>
      <Button v-if="hasPower(100206)" class="i-ml-10" @click="clearAll">清空导入记录</Button>
    </div>
    <Table :columns="columns" :data="dataSource" no-data-text=" ">
      <div ref="footer" slot="footer" class="order-import__empty-content van-center">
        <div class="order-import__empty-content-wrap">
          <div>
            <img src="../../assets/empty-order.png"/>
            <div>暂无历史订单导入记录，快去下载模板导入吧~</div>
          </div>
          <div class="i-mt-10">
            <Button v-if="hasPower(100201)" type="primary" @click="handleClick">导入历史订单</Button>
          </div>
        </div>
      </div>
    </Table>
    <div v-if="pagination.totalCount !==0" class="order-import__footer-pagination">
      <div class="order-import__footer-pagination-fr">
        <Page
          :current="pagination.pageNo"
          :total="pagination.totalCount"
          :show-sizer="true"
          :page-size-opts="[10,20,50]"
          show-total
          size="small"
          class="order-import__pagination-bar"
          @on-change="handlePageChange"
          @on-page-size-change="handlePageSizeChange"
        >
        </Page>
      </div>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TMSUrl from '@/libs/constant/url.js'
import { Progress } from 'iview'
import importMixin from './importMixin.js'
import TimerPoptip from './timer-poptip.vue'
import jsCookie from 'js-cookie'
export default {
  name: 'histoy-order-import',
  metaInfo: {
    title: '批量导入'
  },
  components: {
    TimerPoptip
  },
  mixins: [BasePage, importMixin],
  data () {
    const vm = this
    return {
      // downloadUrl: '',
      templateRequestUrl: 'histemplate/get', // 模板请求地址
      clearAllRequestUrl: 'histemplate/clearOrderTemplateImportRecord', // 清空所有模板记录
      deleteOrderRequestUrl: 'histemplate/deleteOrderTemplateImportRecord', // 删除记录
      notifyRequestUrl: 'histemplate/uploadNotify', // 上传文件路径, 让后端下载执行任务
      importResultRequestUrl: 'histemplate/getImportResult', // 导入进度查询
      importRecordsRequestUrl: 'histemplate/getImportedOrderTemplateList', // 查询记录
      showPoptip: false,
      columns: [
        {
          title: '操作',
          key: 'action',
          width: 160,
          render: (h, params) => {
            const actions = []
            if (this.hasPower(100203)) {
              actions.push(h('a', {
                attrs: {
                  href: params.row.fileUrl,
                  download: '下载模板'
                }
              }, params.row.status ? '下载' : '下载错误报告'))
            }
            // 导入成功可以看下载
            if (params.row.status === 1 && this.hasPower(100204)) {
              actions.push(h('a', {
                class: 'i-ml-10',
                attrs: {
                  href: `#${TMSUrl.OPERATE_REPORT}`
                }
              }, '查看导入订单'))
            }
            // 添加删除操作
            if (this.hasPower(100205)) {
              actions.push(
                h('a', {
                  class: 'i-ml-10',
                  attrs: {
                    href: 'javascript:;'
                  },
                  on: {
                    click: () => {
                      vm.deleteById(params.row)
                    }
                  }
                }, '删除')
              )
            }
            return h('div', actions)
          }
        },
        {
          title: '导入时间',
          key: 'createTime',
          width: 150,
          render (h, params) {
            let time = params.row.createTime
            return time ? h('span', new Date(time).Format('yyyy-MM-dd hh:mm:ss')) : h('span', '-')
          }
        },
        {
          title: '导入文件名',
          key: 'fileName'
        },
        {
          title: '导入结果',
          key: 'status',
          width: 180,
          render: (h, params) => {
            if (params.row.status === 1) {
              return h('span', '导入成功')
            } else if (params.row.status === 0) {
              return h('span', {
                class: 'i-error'
              }, '导入失败')
            } else {
              return h(Progress, {
                props: {
                  strokeWidth: 6,
                  percent: params.row.progress || 10,
                  status: 'active'
                }
              })
            }
            // return h('span', '正在处理')
          }
        },
        {
          title: '成功导入历史订单数',
          key: 'orderCount',
          width: 120,
          render (h, params) {
            return h('span', {}, params.row['orderCount'] ? params.row['orderCount'] : 0)
          }
        },
        {
          title: '操作人',
          key: 'operatorName',
          width: 150
        }
      ]
    }
  },
  watch: {
    needUpdate (value) {
      if (value && !jsCookie.get('tms_history_order_template')) {
        jsCookie.set('tms_history_order_template', true)
        this.showPoptip = value
      }
    }
  },
  methods: {
    handleDownload () {
      if (this.needUpdate) {
        this.$emit('on-download', 2)
        this.userDownloadTemplate(2)
        jsCookie.remove('tms_history_order_template')
      }
    }
  }
}
</script>

<style lang="stylus">
.order-import
  &__empty-content
    margin 0
    min-height 120px
    position relative
    &-wrap
      display block
      width 100%
      position absolute
      background-color #fff
      line-height 28px
      top -20px
  &__footer-pagination
    margin: 10px;
    overflow: hidden;
    &-fr
      float: right;
  &__pagination-bar
    .ivu-page-item-active
      background-color: #00A4BD
      border-radius: 4px
      a
        color: #fff
</style>
