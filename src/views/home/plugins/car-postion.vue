<template>
  <div is="i-col" span="12" class="i-mt-15 page-home__padding-8">
    <BlankCard :padding="false" to="/transport/waybill" page-title="运单管理" tab="3">
      <div slot="title">在途车辆位置</div>
      <noData v-if="!showMap" style="height:238px"></noData>
      <div v-else ref="positionMap" style="height:238px" ></div>
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
import noData from './noData.vue'

export default {
  name: 'car-position',
  components: {
    BlankCard,
    noData
  },
  mixins: [mixin],
  data () {
    return {
      pointList: [],
      showMap: false
    }
  },
  methods: {
    load () {
      this.fetch('home/transport/location')
        .then((response) => {
          const data = response.data
          this.pointList = data.list
          this.renderCarPosition()
        })
    },
    renderCarPosition () {
      this.$nextTick(() => {
        const bmap = new BMap.Map(this.$refs.positionMap)

        for (let i = 0; i < this.pointList.length; i++) {
          if (!this.showMap) {
            this.showMap = true
            this.$refs.positionMap.style.top = '-4px'
          }
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
      })
    }
  }
}
</script>
