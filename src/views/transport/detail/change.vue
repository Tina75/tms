<template>
  <div class="exception">
    <template v-for="(item,index) in changeList">
      <changeList :data="item" :key="index" :index="index" :list-length="listLength" />
    </template>
  </div>
</template>
<script>
import changeList from '../components/changeList.vue'
import Server from '@/libs/js/server'
export default {
  name: 'change',
  components: {
    changeList
  },
  props: {
    pickupId: {
      type: Number | String
    },
    billType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      changeList: []
    }
  },
  computed: {
    listLength () {
      return this.changeList.length
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      Server({
        url: '/waybill/modify/list',
        method: 'post',
        data: {
          waybillId: Number(this.pickupId)
        }
      }).then(res => {
        const data = res.data.data
        this.changeList = data
      })
    }
  }
}
</script>
