<template>
  <div is="i-col" span="12" class="i-mt-15 page-home__card-item">
    <BlankCard :padding="false" to="/transport/waybill" page-title="运单管理" tab="3">
      <div slot="title">在途车辆位置</div>
      <noData v-if="!showMap" msg="暂无车辆位置信息～" type="location"></noData>
      <div v-else ref="positionMap" style="height:238px"></div>
    </BlankCard>
  </div>
</template>

<script>
// 在途车辆位置
import BMap from 'BMap'
import mixin from './mixin.js'
import BlankCard from '../components/BlankCard.vue'
// import MarkerOverlay from '../libs/MarkerOverlay.js'
import LabelOverlay from '../libs/LabelOverlay.js'
import noData from './noData.vue'
import truckMarker from '../libs/getTruckMarker.js'
export default {
  name: 'car-position',
  components: {
    noData,
    BlankCard
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
          this.pointList = data.list.filter(el => {
            return el.truckNo
          })
          if (this.pointList.length > 0) {
            if (!this.showMap) {
              this.showMap = true
            }
            this.renderCarPosition()
          }
        })
    },
    renderCarPosition () {
      this.$nextTick(() => {
        const bmap = new BMap.Map(this.$refs.positionMap)
        const getTruckMarker = truckMarker(bmap)
        const points = []
        if (this.pointList.length > 0) {
          for (let i = 0; i < this.pointList.length; i++) {
            const item = this.pointList[i]
            const point = new BMap.Point(item.longitude, item.latitude)
            if (i === 0) {
              bmap.centerAndZoom(point, 12)
            }
            points.push(point)
            // const markerOverlay = new MarkerOverlay(point)
            const labelOverlay = new LabelOverlay(point, item.truckNo)
            const truckMarker = getTruckMarker(point)
            // bmap.addOverlay(markerOverlay)
            bmap.addOverlay(labelOverlay)
            bmap.addOverlay(truckMarker)
          }
          // 左上角，添加比例尺
          const topLeftControl = new BMap.ScaleControl({ anchor: 'BMAP_ANCHOR_TOP_LEFT' })
          const topLeftNavigation = new BMap.NavigationControl()
          bmap.addControl(topLeftControl)
          bmap.addControl(topLeftNavigation)
          // 允许缩放
          bmap.enableScrollWheelZoom(true)
          if (points.length > 1) {
          /**
           * 根据提供的地理区域或坐标设置地图视野，调整后的视野会保证包含提供的地理区域或坐标
           */
            bmap.setViewport(points)
          }
          this.$refs.positionMap.style.top = '-4px'
        }
      })
    }
  }
}
</script>
