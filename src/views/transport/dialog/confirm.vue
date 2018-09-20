<template>
  <Modal v-model="visibale" :mask-closable="true" width="350" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{ title }}</p>

    <p style="text-align: center;">
      <Icon type="ios-alert" color="#FFBB44" size="26" />
      {{ message }}
    </p>

    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="ok">确定</Button>
      <Button  type="default"  @click.native="visibale = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'Confirm',
  mixins: [ BaseDialog ],
  data () {
    return { visibale: true }
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
</style>
