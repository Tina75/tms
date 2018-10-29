<template>
  <Modal v-model="visiable" :mask-closable="true" class="delete-dialog" width="360" @on-visible-change="close">
    <p slot="header" class="dialog-title">提示</p>
    <div>
      <div >您可以在页面顶部右上角继续查看了解业务流程</div>
      <img src="../../assets/process-help.png" alt="右上角查看业务流程" />
    </div>
    </div>
    <div slot="footer">
      <div>
        <Button  type="primary"  @click.native="close">我知道了</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'process-tip',
  mixins: [BaseDialog]
}
</script>

<style lang="stylus" scoped>
.dialog-title
  text-align center
</style>
