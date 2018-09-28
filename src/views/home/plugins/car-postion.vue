<template>
  <div is="i-col" span="12" class="i-mt-15 page-home__padding-8">
    <BlankCard :padding="false">
      <div slot="title">在途车辆位置</div>
      <div slot="extra">...</div>
      <div ref="positionMap" style="height:238px"></div>
    </BlankCard>
  </div>
</template>

<script>
// 在途车辆位置
import BMap from 'BMap'
import BlankCard from '../components/BlankCard.vue'
import MarkerOverlay from '../libs/MarkerOverlay.js'
import LabelOverlay from '../libs/LabelOverlay.js'

export default {
  components: {
    BlankCard
  },
  data () {
    return {
      data: [
        { id: 'waitPickOrderCnt', name: '待提货调度订单数量', value: 0 },
        { id: 'waitPickCnt', name: '待提货提货订单数量', value: 0 },
        { id: 'inTransportCnt', name: '运输中订单数量', value: 0 }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      const bmap = new BMap.Map(this.$refs.positionMap)
      const point = new BMap.Point(118.787842, 32.026739)
      bmap.centerAndZoom(point, 16)

      const markerOverlay = new MarkerOverlay(point)
      const labelOverlay = new LabelOverlay(point, '苏A 88888')

      bmap.addOverlay(labelOverlay)
      bmap.addOverlay(markerOverlay)

      this.$refs.positionMap.style.top = '-4px'
    })
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
