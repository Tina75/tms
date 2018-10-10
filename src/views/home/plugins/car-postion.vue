<template>
  <div is="i-col" span="12" class="i-mt-15 page-home__padding-8">
    <BlankCard :padding="false" to="/transport/waybill" page-title="运单管理" tab="3">
      <div slot="title">在途车辆位置</div>
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
  name: 'car-position',
  components: {
    BlankCard
  },
  mixins: [mixin],
  data () {
    return {
      pointList: []
    }
  },
  methods: {
    load () {
      this.fetch('home/transport/location')
        .then((response) => {
          const data = response.data
          this.pointList = data.list || []
          this.renderCarPosition()
        })
    },
    renderCarPosition () {
      this.$nextTick(() => {
        const bmap = new BMap.Map(this.$refs.positionMap)
        const points = []

        if (this.pointList.length > 0) {
          for (let i = 0; i < this.pointList.length; i++) {
            const item = this.pointList[i]
            const point = new BMap.Point(item.longtitude, item.latitude)
            if (i === 0) {
              bmap.centerAndZoom(point, 13)
            }
            points.push(point)
            const markerOverlay = new MarkerOverlay(point)
            const labelOverlay = new LabelOverlay(point, item.carNo)
            bmap.addOverlay(markerOverlay)
            bmap.addOverlay(labelOverlay)
          }
        } else {
          const localCity = new BMap.LocalCity()
          localCity.get((city) => {
            const point = new BMap.Point(city.center.lng, city.center.lat)
            bmap.centerAndZoom(point, 13)
            // bmap.setCenter(city.name)
          })
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
          bmap.setViewPort(points)
        }
        this.$refs.positionMap.style.top = '-4px'
      })
    }
  }
}
</script>
