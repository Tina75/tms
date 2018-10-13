<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__card-item">
    <OrderCard
      :data="data"
      :extra="total"
      title="提货待办"
      label="提示文字"
    >
    </OrderCard>
  </div>
</template>

<script>
/**
 * 提货待办
 * 1.待提货调度订单数量
 * 2.待提货提货订单数量
 * 3.运输中订单数量
 */
import OrderCard from '../components/OrderCard.vue'
import mixin from './mixin.js'
import TMSUrl from '@/libs/constant/url.js'

export default {
  name: 'pickup-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'waitPickOrderCnt', name: '待提货调度订单数量', value: 0, tab: '2', href: TMSUrl.DISPATCH_PANEL, title: '调度工作台' },
        { id: 'waitPickCnt', name: '待提货提货订单数量', value: 0, tab: '1', href: TMSUrl.PICKUP_ORDER, title: '提货管理' },
        { id: 'inTransportCnt', name: '提货中提货单数量', value: 0, tab: '2', href: TMSUrl.PICKUP_ORDER, title: '提货管理' }
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
      this.fetch('home/pickup/todo')
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
