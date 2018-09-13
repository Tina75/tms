<template>
  <OrderCreate></OrderCreate>
</template>

<script>
import OrderCreate from '../create/index.vue'
export default {
  components: {
    OrderCreate
  },
  mounted () {
    if (!this.$route.query.id) {
      this.$Message.error('请检查订单号参数')
    }
  }
}
</script>

<style>

</style>
