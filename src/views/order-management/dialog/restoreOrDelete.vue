<template>
  <Modal v-model="visiable" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" class="dialog-title">{{name}}</p>
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
      message: '',
      canDelete: true // 是否可以删除
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
    if (this.name === '删除') {
      if (this.id.length === 1) {
        if (this.id[0].status === 10 && this.id[0].pickupStatus === 1) {
          this.message = '此订单已经在提货中，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status === 20 && this.id[0].dispatchStatus === 1) {
          this.message = '此订单已经在送货中，为保证数据安全，不可以删除'
          this.canDelete = false
        }
      } else {
        if (this.id[0].status === 10) {
          if (this.id.some(this.checkSelectList)) {
            this.message = '您选中的订单已有订单在提货中，为保证数据安全，不可以批量删除'
            this.canDelete = false
          }
        }
        if (this.id[0].status === 20) {
          if (this.id.some(this.checkSelectList)) {
            this.message = '您选中的订单已有订单在送货中，为保证数据安全，不可以批量删除'
            this.canDelete = false
          }
        }
      }
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
    },
    // 筛选选中项是否有不满足条件的选项
    checkSelectList (list) {
      return list.pickupStatus === 1
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
</style>
