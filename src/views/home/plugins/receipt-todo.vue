<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__card-item">
    <OrderCard
      :data="data"
      :extra="total"
      title="回单待办"
      label="提示文字"
    >
    </OrderCard>
  </div>
</template>

<script>
/**
 * 外转待办
 * 1.待发运的外转单数量
 * 2.运输中外转单数量
 */
import OrderCard from '../components/OrderCard.vue'
import mixin from './mixin.js'
import TMSUrl from '@/libs/constant/url.js'

export default {
  name: 'transfer-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'waitRecovery', name: '待回收', value: 0, tab: '1', href: TMSUrl.RECEIPT_ORDER_MANAGEMENT, title: '回单管理' },
        { id: 'waitReturnFactory', name: '待返厂', value: 0, tab: '2', href: TMSUrl.RECEIPT_ORDER_MANAGEMENT, title: '回单管理' }
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
      this.fetch('home/receipt/todo')
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
