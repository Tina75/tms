<template>
  <Modal v-model="visiable" :mask-closable="true" transfer class="recovery-dialog" width="360" @on-visible-change="close">
    <p slot="header" class="dialog-title">分享订单</p>
    <div class="tip-text">
      <Icon type="ios-information-circle" size="24" color="#FFBB44" style="margin-top: -2px;margin-right: 5px;"></Icon>
      <span>当前选中的订单包含多个客户，确定需要继续分享吗？</span>
    </div>
    <div slot="footer">
      <div>
        <Button  type="primary"  @click="save">继续分享</Button>
        <Button  type="default"  @click.native="close">取消</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'ShareConfirm',

  mixins: [BaseDialog],

  data () {
    return {
    }
  },

  mounted () {
  },

  methods: {
    save () {
      const _this = this
      _this.close()
      _this.openDialog({
        name: 'order/management/dialog/share',
        data: {
          id: _this.id,
          suffix: '等' // 多个客户名称需要在末尾加‘等’
        },
        methods: {
          ok (node) {}
        }
      })
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
    letter-spacing 1px
  .tip-text
    display: flex;
    display -ms-flexbox
    justify-content:center;
    -ms-flex-pack center
</style>
<style lang='stylus'>
  .recovery-dialog
    .ivu-modal-body
      padding 24px 45px
</style>
