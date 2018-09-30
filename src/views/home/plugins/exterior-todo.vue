<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <OrderCard
      :data="data"
      :range="['#418DF9','#76E7FD']"
      :extra="total"
      theme="#418DF9"
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

export default {
  name: 'exterior-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'waitPickOrderCnt', name: '外转方待对账订单', value: 1 },
        { id: 'waitPickCnt', name: '外转方待核销订单', value: 10 }
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
      this.fetch('home/trans/todo')
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
