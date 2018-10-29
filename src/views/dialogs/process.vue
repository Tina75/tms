<template>
  <Modal v-model="visiable" :styles="modalStyle" :mask-closable="false" width="1165"  @on-visible-change="handleClose">
    <h3 class="i-ml-15">为方便您快速了解系统，在试用本系统前请先了解系统的业务流程，下图中的节点都可以点击查看。</h3>
    <ProcessCenter :has-power="hasPower"></ProcessCenter>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
/**
 * 用户第一次弹出
 * 提示用户熟悉业务流程
 */
import ProcessCenter from '../helper/components/ProcessCenter.vue'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'process',
  components: {
    ProcessCenter
  },
  mixins: [ BaseDialog ],
  computed: {
    modalStyle () {
      return {
        top: '15px'
      }
    }
  },
  methods: {
    handleClose () {
      this.close()
      this.openDialog({
        name: 'dialogs/processTip',
        data: {

        }
      })
    }
  }
}
</script>

<style>

</style>
