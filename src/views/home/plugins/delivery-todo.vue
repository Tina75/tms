<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__card-item">
    <OrderCard
      :data="data"
      :extra="total"
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
import mixin from './mixin.js'
import TMSUrl from '@/libs/constant/url.js'

export default {
  name: 'delivery-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'waitDispatchOrderCnt', name: '待调度', value: 0, tab: '0', href: TMSUrl.TANSPORT_ORDER, title: '送货管理' },
        { id: 'waitAssignCarCnt', name: '待派车', value: 0, tab: '1', href: TMSUrl.TANSPORT_ORDER, title: '运单管理' },
        { id: 'waitSendCarCnt', name: '待发运', value: 0, tab: '2', href: TMSUrl.TANSPORT_ORDER, title: '运单管理' },
        { id: 'inTransportCnt', name: '在途', value: 0, tab: '3', href: TMSUrl.TANSPORT_ORDER, title: '运单管理' }
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
