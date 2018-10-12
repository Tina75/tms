<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__card-item">
    <OrderCard
      :data="data"
      :extra="total"
      title="发货方核销待办"
      label="提示文字"
    >
    </OrderCard>
  </div>
</template>

<script>
// 发货方核销待办
import OrderCard from '../components/OrderCard.vue'
import mixin from './mixin.js'
import TMSUrl from '@/libs/constant/url.js'

export default {
  name: 'shipper-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'wait_verify', name: '发货方待核销订单数', value: 0, tab: '1', href: TMSUrl.SENDER_FINANCE, title: '发货方对账' },
        { id: 'wait_reconcile', name: '发货方对账单数量', value: 0, tab: '2', href: TMSUrl.SENDER_FINANCE, title: '发货方对账' }
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
      this.fetch('home/consigner/todo')
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
