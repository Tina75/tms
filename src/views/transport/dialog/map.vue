<template>
  <Modal v-model="visiable" :mask-closable="false" width="1000" @on-visible-change="close">
    <p slot="header" style="text-align:center">位置</p>

    <div id="map"></div>

    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="close">确定</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import BMap from 'BMap'
import MarkerOverlay from '../../home/libs/MarkerOverlay.js'
import LabelOverlay from '../../home/libs/LabelOverlay.js'

export default {
  name: 'Confirm',
  mixins: [ BaseDialog ],
  data () {
    return {
      labels: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.createMap()
    })
  },
  methods: {
    createMap () {
      const map = new BMap.Map('map')
      map.enableScrollWheelZoom(true)

      for (let i = 0; i < this.points.length; i++) {
        const point = new BMap.Point(this.points[i].longtitude, this.points[i].latitude)
        // 添加标志点
        const markerOverlay = new MarkerOverlay(point, () => {
          for (let j = 0; j < this.labels.length; j++) {
            if (i === j) this.labels[j].triggerShow()
            else this.labels[j].triggerShow(false)
          }
        })
        map.addOverlay(markerOverlay)
        // 添加标签
        const labelOverlay = new LabelOverlay(point, this.points[i].carNo)
        map.addOverlay(labelOverlay)
        labelOverlay.triggerShow(false)
        this.labels.push(labelOverlay)

        if (i === 0) {
          map.centerAndZoom(point, 12)
          labelOverlay.triggerShow()
        } else {
          const polyline = new BMap.Polyline([
            new BMap.Point(this.points[i - 1].longtitude, this.points[i - 1].latitude),
            new BMap.Point(this.points[i].longtitude, this.points[i].latitude)
          ],
          { strokeColor: '#00A4BD', strokeWeight: 3, strokeOpacity: 1 }
          )
          map.addOverlay(polyline)
        }
      }
    }
  }
}

</script>
<style lang='stylus' scoped>
  #map
    height 60vh
</style>
