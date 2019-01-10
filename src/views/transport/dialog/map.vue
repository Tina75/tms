<template>
  <Modal id="map-modal" v-model="visiable" :mask-closable="true" transfer width="1200" @on-visible-change="close">
    <p slot="header" style="text-align:center">查看车辆位置</p>

    <Row>
      <Col :span="multiple ? 24 : 16">
      <div id="map"></div>
      </Col>
      <Col v-if="!multiple" span="8">
      <div class="map-timeline-box">
        <Timeline>
          <TimelineItem v-for="(item, key) in cars[0].points" :key="key">
            <i slot="dot" class="map-timeline-dot"></i>
            <div>
              <div class="icon-box">
                <FontIcon v-if="Number(item.positionType) === 1" type="beidoudingwei" size="35"></FontIcon>
                <Tooltip v-else-if="Number(item.positionType) === 2" :content="`此位置通过司机手机号查询，若偏差较大，请联系司机 ${item.phone}`" transfer placement="right-start" max-width="200">
                  <FontIcon type="shoujidingwei" size="35"></FontIcon>
                </Tooltip>
                <FontIcon v-else type="sijidingwei" size="35"></FontIcon>
              </div>

              <div :class="{'info-body-active': key === currentPointIndex}" class="info-body" @click="showTracePoint(key)">
                <p>{{ item.createTime | datetime }}</p>
                <p>
                  {{ item.location }}
                </p>
              </div>
            </div>

          </TimelineItem>
        </Timeline>
      </div>
      </Col>
    </Row>

    <i slot="footer"></i>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import BMap from 'BMap'
import MarkerOverlay from '../../home/libs/MarkerOverlay.js'
import LabelOverlay from '../../home/libs/LabelOverlay.js'
import truckMarker from '../../home/libs/getTruckMarker.js'
// 1北斗   2手机    3司机
import FontIcon from '@/components/FontIcon.vue'
export default {
  name: 'Confirm',
  components: {
    FontIcon
  },
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
            if (i === 0) this.map.centerAndZoom(point, 6)
          })
        }
      }
    },

    showCar (car, cb) {
      const point = new BMap.Point(Number(car.longitude), Number(car.latitude))
      // 添加标志点
      // const markerOverlay = new MarkerOverlay(point)
      // this.map.addOverlay(markerOverlay)
      const getTruckMarker = truckMarker(this.map)
      const marker = getTruckMarker(point)
      this.map.addOverlay(marker)

      // 添加标签
      const labelOverlay = new LabelOverlay(point, car.truckNo === '' ? car.phone : car.truckNo)
      this.map.addOverlay(labelOverlay)

      cb && cb(point)
    },

    showCarWithTrace (car) {
      const getTruckMarker = truckMarker(this.map)
      const length = car.points.length
      for (let i = 0; i < length; i++) {
        const tempPoint = car.points[i]
        const point = new BMap.Point(Number(tempPoint.longitude), Number(tempPoint.latitude))

        // 添加标签
        const labelOverlay = new LabelOverlay(point, car.carNo.length === 11 ? car.carNo : car.carNo.replace(/^(.{2})/, '$1 '))
        this.map.addOverlay(labelOverlay)
        labelOverlay.hide()
        car.overlay.push(labelOverlay)

        if (i === 0) {
          labelOverlay.show()
          this.map.centerAndZoom(point, 11)
          // 替换为卡车图标
          if (length === 1) {
            const marker = getTruckMarker(point)
            this.map.addOverlay(marker)
          } else {
            const marker = getTruckMarker(
              point,
              new BMap.Point(car.points[i + 1].longitude, car.points[i + 1].latitude)
            )
            this.map.addOverlay(marker)
          }
        } else {
          // 添加标志点
          const markerOverlay = new MarkerOverlay(point)
          this.map.addOverlay(markerOverlay)
          // 添加连接线
          const polyline = new BMap.Polyline([
            new BMap.Point(car.points[i - 1].longitude, car.points[i - 1].latitude),
            new BMap.Point(tempPoint.longitude, tempPoint.latitude)
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
        if (index === i) overlay.show()
        else overlay.hide()
      }
    }
  }
}

</script>
<style lang='stylus' scoped>
  #map, .map-timeline-box
    height 500px

  .map-timeline-box
    padding 11px
    overflow auto

  .map-timeline-dot {
    display inline-block
    width 19px
    height 19px
    border-radius 50%
    background rgba(0, 164, 189, .1)
  }

  .map-timeline-dot::after {
    content ""
    display block
    width 5px
    height 5px
    margin 7px
    border-radius 50%
    background #00A4BD
  }

  .info-body
    margin-left 60px
    color #666666
    cursor pointer

    &-active
      color #00A4BD

    &>p:first-child
      font-size 14px

  .icon-box
    float left
    margin-top -11px
    margin-left 8px

    .icon
      font-size 35px
      color #9DA1B0
</style>

<style lang='stylus'>
  #map-modal
    .ivu-modal-body
      padding 31px 16px 5px 24px

    .ivu-timeline-item-tail
      border-left 1px solid #00A4BD

    .ivu-timeline-item-head
      background transparent

    .ivu-timeline-item-head-custom
      margin-top 3px
      left -13.5px

    .ivu-timeline-item-content
      top -9px

    .ivu-tooltip-popper
      top 0 !important
</style>
