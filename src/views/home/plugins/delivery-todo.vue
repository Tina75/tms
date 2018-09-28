<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <OrderCard
      :data="data"
      :extra="total"
      :range="['#FFBB44','#FFB897']"
      theme="#FFBB44"
      title="送货待办"
      label="提示文字"
    >
    </OrderCard>
  </div>
</template>

<script>
/**
 * 送货待办
 * 1.待送货的订单数量
 * 2.待派车的运单数量
 * 3.待发运的运单数量
 * 4.运输中的运单数
 */
import OrderCard from '../components/OrderCard.vue'
export default {
  components: {
    OrderCard
  },
  data () {
    return {
      data: [
        {id: 'waitDispatchOrderCnt', name: '待送货调度订单数量', value: 0},
        {id: 'waitAssignCarCnt', name: '待派车订单数量', value: 0},
        {id: 'waitSendCarCnt', name: '待发运订单数量', value: 0},
        {id: 'inTransportCnt', name: '运输中订单数量', value: 0}
      ]
    }
  },
  computed: {
    total () {
      return this.data.reduce((num, item) => {
        num += item.value
        return num
      }, 0)
    }
  },
  methods: {
    load () {
      const vm = this
      this.fetch('home/delivery/todo')
        .then((response) => {
          const data = response.data
          vm.data.forEach((item) => {
            item.value = data[item.id]
          })
        })
    }
  }
}
</script>

<style>

</style>
