<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <OrderCard
      :data="data"
      :extra="total"
      title="外转方核销待办"
      label="提示文字"
      to="/finance/transfer"
      page-title="外转方对账"
    >
    </OrderCard>
  </div>
</template>

<script>
// 外转方核销待办
import OrderCard from '../components/OrderCard.vue'
import mixin from './mixin.js'

export default {
  name: 'exterior-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'wait_reconcile', name: '外转方待对账订单', value: 0, tab: 'wait_reconcile' },
        { id: 'wait_verify', name: '外转方待核销订单', value: 0, tab: 'wait_verify' }
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
      this.fetch('home/transferee/todo')
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
