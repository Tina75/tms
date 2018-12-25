<template>
  <div class="order-import-page">
    <TabHeader :list="tabs" :value="activeTab"  @on-change="handleChangeTab" />
    <div v-if="activeTab === '1'" class="i-mt-35">
      <OrderImport :oss-client="ossClient" :oss-dir="ossDir" :need-update="true"></OrderImport>
    </div>
    <div v-if="activeTab === '2'" class="i-mt-35">
      <HistoryOrderImport :oss-client="ossClient" :oss-dir="ossDir" :need-update="false"></HistoryOrderImport>
    </div>
  </div>
</template>

<script>
import OssClient from 'ali-oss'
import server from '@/libs/js/server'
import TabHeader from '@/views/finance/components/TabHeader.vue'
import OrderImport from './components/order-import.vue'
import HistoryOrderImport from './components/history-order-import.vue'
export default {
  name: 'order-import',
  components: {
    TabHeader,
    OrderImport,
    HistoryOrderImport
  },
  data () {
    return {
      activeTab: '1',
      tabs: [
        { name: '1', label: '订单导入' },
        { name: '2', label: '导入历史订单' }
      ],
      ossClient: null,
      ossDir: ''
    }
  },
  watch: {
    activeTab (value) {
      // console.log(value)
    }
  },
  created () {
    this.initOssInstance()
  },
  mounted () {

  },
  methods: {
    handleChangeTab (name) {
      this.activeTab = name
    },
    /**
     * 初始化oss
     */
    initOssInstance () {
      const vm = this
      /**
       * 后端获取阿里云access token, region 参数
       * 初始化oss client，用户上传模板前需要准备好
       */
      return server({
        method: 'post',
        url: 'file/prepareUpload',
        data: {
          bizType: 'order',
          fileCount: 1,
          fileSuffix: 'xlsx'
        }
      })
        .then((response) => {
          const { data } = response.data
          vm.ossDir = data.ossKeys[0]
          vm.ossClient = new OssClient({
            accessKeyId: data.ossTokenDTO.stsAccessId,
            accessKeySecret: data.ossTokenDTO.stsAccessKey,
            stsToken: data.ossTokenDTO.stsToken,
            bucket: data.ossTokenDTO.bucketName,
            endpoint: data.ossTokenDTO.endpoint
          })
          return response
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.order-import-page
  position relative
</style>
