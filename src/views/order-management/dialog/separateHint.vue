<template>
  <div class="dialog">
    <Modal v-model="visiable" :mask-closable="false" width="360" @on-visible-change="close">
      <p slot="header" class="dialog-title">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>提示</span>
      </p>
      <div v-if="orderNoList && orderNoList.length > 0" style="display: flex;align-items:center;flex-direction: column;padding-left: 10px;">
        <div class="content" style="margin-bottom: 18px;">拆单成功，子订单号更新为</div>
        <div v-for="(item, index) in orderNoList" :key="index" class="order-item">
          {{ item }}
        </div>
      </div>
      <div v-else style="display: flex;justify-content:center;padding-left: 10px;">
        <!-- <Icon type="ios-information-circle" size="24" color="#FFBB44" style="margin-top: -2px;margin-right: 5px;"></Icon> -->
        <div class="content">当前订单已经被拆单，无法重复拆单</div>
      </div>
      <div slot="footer">
        <Button  type="primary"  @click="close">我知道了</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'return',
  mixins: [BaseDialog],
  data () {
    return {
    }
  },

  mounted: function () {
    console.log(this.orderNoList)
  },

  methods: {
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
.content
  text-align center
  font-size 14px
  font-family 'PingFangSC-Regular'
  font-weight 400
  color: rgba(0,0,0,1)
  line-height 20px
.order-item
  width 225px
  background-color #f5f5f5
  text-align center
  font-size 14px
  font-family 'PingFangSC-Regular'
  font-weight 400
  color: rgba(85,85,85,1)
  line-height 20px
  margin-bottom 10px
</style>
