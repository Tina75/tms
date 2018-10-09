<template>
  <Modal v-model="visibale" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" class="dialog-title">{{name}}</p>
    <div style="text-align: center;">
      <Icon type="ios-information-circle" size="24" color="#FFBB44"></Icon>
      <span style="margin-left: 5px;">共选择了{{id.length}}条订单，确定{{name}}吗？</span>
    </div>
    <div slot="footer">
      <Button  type="primary"  @click="save">确定</Button>
      <Button  type="default"  @click.native="visibale = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'restoreOrDelete',
  mixins: [BaseDialog],
  data () {
    return {
      visibale: true
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
  methods: {
    save () {
      if (this.name === '删除') {
        this.doDelete()
      } else {
        this.doRestore()
      }
    },
    // 订单还原
    doRestore () {
      Server({
        url: 'order/recovery',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then(() => {
        this.ok()
        this.$Message.success('还原成功')
        this.visibale = false
      })
    },
    // 订单删除
    doDelete () {
      Server({
        url: 'order/delete',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then(() => {
        this.$Message.success('删除成功')
        this.visibale = false
        if (this.$route.path === '/order-management/detail') {
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
    color rgba(47,50,62,1)
    letter-spacing 1px
</style>
