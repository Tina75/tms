<template>
  <div class="helper-process">
    <h3 class="i-ml-15">点击流程中的节点，可以查看对应的页面信息</h3>
    <ProcessCenter :has-power="hasPower" />
  </div>
</template>

<script>
/**
 * 流程中心
 */
import BasePage from '@/basic/BasePage'
import ProcessCenter from './components/ProcessCenter.vue'
export default {
  components: {
    ProcessCenter
  },
  metaInfo: { title: '业务流程' },
  mixins: [BasePage]
}
</script>

<style lang="stylus" scoped>

</style>
