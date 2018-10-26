<template>
  <Modal v-model="visiable" :mask-closable="false" width="1200" @on-visible-change="close">
    <p slot="header" style="text-align:center">查看车辆位置</p>

    <Row>
      <Col :span="multiple ? 24 : 16">
      <div id="map"></div>
      </Col>
      <Col v-if="!multiple" span="8">
      <Button v-for="(item, key) in cars[0].points" :key="key"
              :style="{ marginBottom: '10px' }" long
              type="primary"
              @click="showTracePoint(key)">{{ item.address }}{{currentPointIndex === key ? ' - 当前位置' : ''}}</Button>
      </Col>
    </Row>

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
      map: null,
      currentPointIndex: 0
    }
  },
  created () {
    if (!this.multiple) this.cars = Object.assign([], this.cars.map(item => (item.overlay = []) && item))
  },
  mounted () {
    this.$nextTick(() => {
      this.createMap()
    })
  },
  methods: {
    createMap () {
      this.map = new BMap.Map('map')
      this.map.enableScrollWheelZoom(true)

      if (!this.multiple) {
        this.showCarWithTrace(this.cars[0])
      } else {
        for (let i = 0; i < this.cars.length; i++) {
          this.showCar(this.cars[i], point => {
            if (i === 0) this.map.centerAndZoom(point, 12)
          })
        }
      }
    },

    showCar (car, cb) {
      const point = new BMap.Point(car.longtitude, car.latitude)
      // 添加标志点
      const markerOverlay = new MarkerOverlay(point)
      this.map.addOverlay(markerOverlay)

      // 添加标签
      const labelOverlay = new LabelOverlay(point, car.carNo)
      this.map.addOverlay(labelOverlay)

      cb && cb(point)
    },

    showCarWithTrace (car) {
      for (let i = 0; i < car.points.length; i++) {
        const tempPoint = car.points[i]

        const point = new BMap.Point(tempPoint.longtitude, tempPoint.latitude)
        // 添加标志点
        const markerOverlay = new MarkerOverlay(point)
        // const markerOverlay = new MarkerOverlay(point, () => {
        //   for (let j = 0; j < car.overlay.length; j++) {
        //     if (i === j) {
        //       car.overlay[j].label.show()
        //       car.overlay[j].marker.show()
        //     }
        //     else {
        //       car.overlay[j].label.hide()
        //       car.overlay[j].marker.hide()
        //     }
        //   }
        // })
        this.map.addOverlay(markerOverlay)
        markerOverlay.hide()

        // 添加标签
        const labelOverlay = new LabelOverlay(point, car.carNo)
        this.map.addOverlay(labelOverlay)
        labelOverlay.hide()

        car.overlay.push({
          label: labelOverlay,
          marker: markerOverlay
        })

        if (i === 0) {
          this.map.centerAndZoom(point, 12)
          labelOverlay.show()
          markerOverlay.show()
        } else {
          const polyline = new BMap.Polyline([
            new BMap.Point(car.points[i - 1].longtitude, car.points[i - 1].latitude),
            new BMap.Point(tempPoint.longtitude, tempPoint.latitude)
          ],
          { strokeColor: '#00A4BD', strokeWeight: 3, strokeOpacity: 1 }
          )
          this.map.addOverlay(polyline)
        }
      }
    },

    showTracePoint (index) {
      if (this.currentPointIndex === index) return
      this.currentPointIndex = index
      for (let i = 0; i < this.cars[0].overlay.length; i++) {
        const overlay = this.cars[0].overlay[i]
        console.log(overlay, index, i)
        if (index === i) {
          overlay.label.show()
          overlay.marker.show()
        } else {
          overlay.label.hide()
          overlay.marker.hide()
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
