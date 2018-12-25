<template>
  <Modal v-model="visiable" :mask-closable="true" transfer class="recovery-dialog" width="360" @on-visible-change="close">
    <p slot="header" class="dialog-title">恢复</p>
    <div class="tip-text">
      <Icon type="ios-information-circle" size="24" color="#FFBB44" style="margin-top: -2px;margin-right: 5px;"></Icon>
      <span v-if="canRecovery">共选择了{{ id.length }}条订单，确定恢复吗？</span>
      <span v-else>
        {{ id.length === 1 ? '此客户已存在相同客户订单号订单，请检查订单信息' :  '选中的订单中已存在客户订单号相同的订单，为避免重复，请检查订单信息' }}
      </span>
    </div>
    <div slot="footer">
      <div v-if="canRecovery">
        <Button type="primary" @click="save">确定</Button>
        <Button type="default" @click.native="close">取消</Button>
      </div>
      <div v-else>
        <div v-if="id.length > 1">
          <Button type="primary" @click.native="close">知道了</Button>
        </div>
        <div v-else>
          <Button type="primary" @click="toDetail">去查看</Button>
          <Button type="default" @click.native="close">知道了</Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'recovery',

  mixins: [BaseDialog],

  data () {
    return {
      canRecovery: false,
      orderId: '',
      orderNo: ''
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
    this.isRecovery()
  },

  methods: {
    // 检查被删除的订单是否可恢复
    isRecovery () {
      Server({
        url: 'order/canRecoveryDelete',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then((res) => {
        // console.log(res.data.data.can)
        let can = res.data.data.can
        if (can) {
          this.canRecovery = true
        } else {
          this.canRecovery = false
          this.orderId = res.data.data.orderId
          this.orderNo = res.data.data.orderNo
        }
      })
    },
    // 查看详情
    toDetail () {
      this.openTab({
        path: '/order-management/detail',
        query: {
          id: this.orderNo,
          orderId: this.orderId,
          from: 'order'
        }
      })
      this.close()
    },
    save () {
      this.doRecovery()
    },
    // 订单恢复
    doRecovery () {
      Server({
        url: 'order/recoveryDelete',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then(() => {
        this.ok()
        this.$Message.success('恢复成功')
        this.close()
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
