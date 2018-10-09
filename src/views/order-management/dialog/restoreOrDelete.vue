<template>
  <Modal v-model="visiable" :mask-closable="false" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{name}}</p>
    <div style="text-align: center;">
      <Icon type="ios-information-circle" size="24" color="#FFBB44"></Icon>
      <span style="margin-left: 5px;">共选择了{{id.length}}条订单，确定{{name}}吗？</span>
    </div>
    <div slot="footer">
      <Button  type="primary"  @click="save">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
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
        this.close()
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
        this.close()
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
</style>
