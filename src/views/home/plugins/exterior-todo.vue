<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <OrderCard
      :data="data"
      :extra="total"
      title="外转方核销待办"
      label="提示文字"
    >
    </OrderCard>
  </div>
</template>

<script>
// 外转方核销待办
import OrderCard from '../components/OrderCard.vue'
import mixin from './mixin.js'
import TMSUrl from '@/libs/constant/url.js'

export default {
  name: 'exterior-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'wait_reconcile', name: '外转方待对账订单', value: 0, tab: '2', href: TMSUrl.TRANSFER_FINANCE, title: '外转方对账' },
        { id: 'wait_verify', name: '外转方待核销订单', value: 0, tab: '1', href: TMSUrl.TRANSFER_FINANCE, title: '外转方对账' }
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
