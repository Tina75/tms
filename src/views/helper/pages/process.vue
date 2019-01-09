<template>
  <div class="helper-process">
    <p class="i-ml-15 van-font-14" style="color:#666666">点击流程中的节点，可以查看对应的页面信息</p>
    <ProcessCenter :has-power="hasPower" />
  </div>
</template>

<script>
/**
 * 流程中心
 */
import BasePage from '@/basic/BasePage'
import ProcessCenter from '../components/ProcessCenter.vue'
export default {
  components: {
    ProcessCenter
  },
  mixins: [BasePage],
  metaInfo: { title: '业务流程' }
}
</script>

<style lang="stylus" scoped>

</style>
