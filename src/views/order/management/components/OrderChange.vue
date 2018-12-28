<template>
  <div class="order-change">
    <ChangeDetail v-for="(item, index) in changeList" :data="item" :key="index" :index="index" :list-length="listLength"/>
  </div>
</template>
<script>
import Server from '@/libs/js/server'
import ChangeDetail from './ChangeDetail'
export default {
  name: 'order-change',
  components: {
    ChangeDetail
  },
  data () {
    return {
      changeList: []
    }
  },
  computed: {
    listLength () {
      return this.changeList.length
    },
    id () {
      return this.$route.query.orderId
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      Server({
        url: 'order/getOrderChangeRecordList',
        method: 'post',
        data: {
          id: this.id
        }
      }).then(res => {
        const data = res.data.data
        this.changeList = data
      })
    }
  }
}
</script>
