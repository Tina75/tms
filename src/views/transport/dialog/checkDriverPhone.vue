<template>
  <div class="dialog">
    <Modal v-model="visiable" :mask-closable="false" transfer width="360" @on-visible-change="close">
      <p slot="header" class="dialog-title">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>提示</span>
      </p>
      <div class="tip-text">
        <Icon type="ios-information-circle" size="24" color="#FFBB44" style="margin-top: -2px;margin-right: 5px;"></Icon>
        <p style="display: inline">{{ name }}号码近期有过更改记录，请确认是否继续向该号码下单？</p>
      </div>
      <div slot="footer">
        <Button  type="primary"  @click="save">确定</Button>
        <Button  type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'checkDriverPhone',
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
<style lang='stylus' scoped>
.dialog-title
  text-align center
  font-size 16px
  font-family 'PingFangSC-Medium'
  font-weight 700
  color rgba(47,50,62,1)
.tip-text
  display: flex;
  display -ms-flexbox
  justify-content:center;
  -ms-flex-pack center
</style>
