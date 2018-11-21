<template>
  <Modal v-model="visible" :mask-closable="false" transfer width="360" @on-visible-change="close">
    <p slot="header" class="order-import__dialog-header">
      <Icon type="md-close-circle" size="26" color="#EC4E4E"></Icon>
      导入失败
    </p>
    此次批量导入失败，具体失败原因请下载错误报告。
    <div slot="footer">
      <Button  :to="download" type="primary" target="_blank"  @click.native="downloadReport">点击下载错误报告</Button>
    </div>
  </Modal>
</template>
<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  mixins: [BaseDialog],
  data () {
    return {
      download: 'javascript:;',
      visible: true
    }
  },
  methods: {
    downloadReport () {
      this.visible = false
      this.ok && this.ok()
    }
  }
}
</script>
<style lang="stylus" scoped>
.order-import
  &__dialog-header
    text-align center
    height 30px
    line-height 30px
</style>
