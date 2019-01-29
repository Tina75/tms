<template>
  <div class="order-import-page">
    <TabHeader :list="filterTabs" :value="activeTab"  @on-change="handleChangeTab" />
    <div v-if="hasPower(100207) && activeTab === '1'" class="i-mt-35">
      <OrderImport :oss-client="ossClient" @on-download="handleDownloadTemplate"></OrderImport>
    </div>
    <div v-if="hasPower(100208) && activeTab === '2'" class="i-mt-35">
      <HistoryOrderImport :oss-client="ossClient" @on-download="handleDownloadTemplate"></HistoryOrderImport>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
// import OssClient from 'ali-oss'
// import server from '@/libs/js/server'
import TabHeader from '@/views/finance/components/TabHeader.vue'
import OrderImport from './components/order-import.vue'
import HistoryOrderImport from './components/history-order-import.vue'
import OssClient from '@/libs/js/ossClient'
export default {
  name: 'order-import',
  metaInfo: {
    title: '批量导入'
  },
  components: {
    TabHeader,
    OrderImport,
    HistoryOrderImport
  },
  mixins: [BasePage],
  data () {
    return {
      activeTab: '1',
      isOrderTemplateUpdate: false, // 订单模板有更新？
      isHistoryTemplateUpdate: false, // 历史订单模板有更新
      tabs: [
        { name: '1', label: '订单导入', code: 100207 },
        { name: '2', label: '历史订单导入', code: 100208 }
      ],
      ossClient: null
      // ossDir: ''
    }
  },
  computed: {
    filterTabs () {
      return this.tabs.filter(tab => this.hasPower(tab.code))
    }
  },
  created () {
    // this.initOssInstance()
    this.ossClient = new OssClient()
  },
  mounted () {
    // this.checkTemplateUpdate()
  },
  methods: {
    handleChangeTab (name) {
      this.activeTab = name
    },
    /**
     * 点击下载模板后，红点提示取消
     */
    handleDownloadTemplate (type) {
      // if (type === 1) {
      //   this.isOrderTemplateUpdate = false
      // } else {
      //   this.isHistoryTemplateUpdate = false
      // }
    }

  }
}
</script>

<style lang="stylus" scoped>
.order-import-page
  height 100%
</style>
