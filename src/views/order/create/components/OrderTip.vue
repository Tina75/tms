<template>
  <Modal v-model="visiable" :mask-closable="false" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">提示</p>
    <div class="tig-box">
      <Icon type="ios-information-circle" size="28" color="#FFBB44"></Icon>
      <span class="tip-bar">您的账号没有{{tipMsg}}的权限，请联系管理员配置权限。</span>
    </div>
    <div slot="footer">
      <Button  type="primary"  @click="close">好的</Button>
    </div>
  </Modal>
</template>
<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'orderTip',
  mixins: [BaseDialog],
  data () {
    return {
      tipMsg: ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.tig-box
  display flex
  .tip-bar
    flex 1
    color #000
    font-size 14px
    margin-left 5px
    line-height 1.5
</style>
