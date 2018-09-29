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
import mixin from './mixin.js'
import BlankCard from '../components/BlankCard.vue'
import MarkerOverlay from '../libs/MarkerOverlay.js'
import LabelOverlay from '../libs/LabelOverlay.js'

export default {
  components: {
    BlankCard
  },
  mixins: [mixin],
  data () {
    return {
      pointList: [
        {
          billId: 1,
          longtitude: 118.787842,
          latitude: 32.026739,
          carNo: '苏A 66666'
        },
        {
          billId: 2,
          longtitude: 118.789842,
          latitude: 32.027739,
          carNo: '苏A 88888'
        }]
    }
  },
  mounted () {
    this.$nextTick(() => {
      const bmap = new BMap.Map(this.$refs.positionMap)

      for (let i = 0; i < this.pointList.length; i++) {
        const item = this.pointList[i]
        const point = new BMap.Point(item.longtitude, item.latitude)
        if (i === 0) {
          bmap.centerAndZoom(point, 16)
        }
        const markerOverlay = new MarkerOverlay(point)
        const labelOverlay = new LabelOverlay(point, item.carNo)
        bmap.addOverlay(markerOverlay)
        bmap.addOverlay(labelOverlay)
      }

      this.$refs.positionMap.style.top = '-4px'
    })
  },
  methods: {
    load () {
      const vm = this
      this.fetch('home/transport/location')
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
