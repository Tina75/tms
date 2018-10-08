<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <OrderCard
      :data="data"
      :extra="total"
      title="承运商核销待办"
      label="提示文字"
      to="/finance/carrier"
      page-title="承运商对账"
    >
    </OrderCard>
  </div>
</template>

<script>
// 承运商核销待办
import OrderCard from '../components/OrderCard.vue'
import mixin from './mixin.js'

export default {
  name: 'carrier-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'wait_reconcile', name: '承运商待对账订单', value: 0, tab: 'waitReconcile' },
        { id: 'wait_verify', name: '承运商待核销订单', value: 0, tab: 'waitVerify' }
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
      this.fetch('home/carrier/todo')
        .then((response) => {
          const data = response.data
          for (const i of this.data) {
            i.value = data[i.id]
          }
        })
    }
  }
}
</script>
