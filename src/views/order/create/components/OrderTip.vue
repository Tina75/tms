<template>
  <Modal v-model="visiable" :mask-closable="false" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">提示</p>
    <div style="text-align: center;">
      <Icon type="ios-information-circle" size="24" color="#FFBB44"></Icon>
      <span style="margin-left: 5px;">您的账号没有{{tipMsg}}的权限，请联系管理员配置权限。</span>
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
