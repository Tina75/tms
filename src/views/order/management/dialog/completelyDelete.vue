<template>
  <Modal v-model="visiable" :mask-closable="true" transfer class="recovery-dialog" width="360" @on-visible-change="close">
    <p slot="header" class="dialog-title">彻底删除</p>
    <div class="tip-text">
      <Icon type="ios-information-circle" size="24" color="#FFBB44" style="margin-top: -2px;margin-right: 5px;"></Icon>
      <span>订单彻底删除后，将不可找回!</span>
    </div>
    <div slot="footer">
      <div>
        <Button  type="primary"  @click="save">彻底删除</Button>
        <Button  type="default"  @click.native="close">我再想想</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'completelyDeleteDialog',

  mixins: [BaseDialog],

  data () {
    return {
    }
  },

  computed: {
    orderIds () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.id)
      })
      return arr
    }
  },

  mounted () {
    // console.log(this.id)
  },

  methods: {
    save () {
      this.completelyDelete()
    },
    // 彻底删除
    completelyDelete () {
      Server({
        url: 'order/completelyDelete',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then(() => {
        // this.ok()
        this.$Message.success('删除成功')
        this.close()
        if (this.$route.path === '/order/management/detail') {
          this.ema.fire('closeTab', this.$route) // 关闭tab页
        } else {
          this.ok()
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
