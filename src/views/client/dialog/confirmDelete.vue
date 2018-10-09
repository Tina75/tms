<template>
  <Modal v-model="visiable" :mask-closable="false" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">删除</p>
    <div style="text-align: center;">
      <Icon type="ios-information-circle" size="24" color="#FFBB44"></Icon>
      <span style="margin-left: 5px;">确定删除吗？</span>
    </div>
    <div slot="footer">
      <Button  type="primary"  @click="save">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'confirmDelete',
  mixins: [BaseDialog],
  data () {
    return {
    }
  },
  methods: {
    save () {
      this.ok()
      this.close()
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
