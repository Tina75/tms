<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="350" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{ title }}</p>

    <p  style="text-align: center;">
      <Icon class="icon" type="md-help" color="#fff" size="22" />
      <span class="tips">{{ message }}</span>
    </p>

    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="ok">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'Confirm',
  mixins: [ BaseDialog ],
  data () {
    return { }
  },
  methods: {
    ok () {
      this.confirm()
      this.close()
    }
  }
}

</script>
<style lang='stylus' scoped>
  .icon
    width 28px
    height 28px
    border-radius 50%
    background #FF9502
    margin-right 10px
  .ivu-icon-md-help:before
    line-height 28px
  .tips
    color #000
</style>
