<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <OrderCard
      :data="data"
      :extra="total"
      title="外转待办"
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
export default {
  name: 'transfer-todo',
  components: {
    OrderCard
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { id: 'waitSendCarCnt', name: '待发运的外转单数量', value: 0 },
        { id: 'inTransportCnt', name: '运输中外转单数量', value: 0 }
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

<style>

</style>
