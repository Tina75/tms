<template>
  <Modal v-model="visibale" :mask-closable="true" width="1000" @on-visible-change="close">
    <p slot="header" style="text-align:center">位置</p>

    <div id="map">

    </div>

    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="close">确定</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import BMap from 'BMap'

export default {
  name: 'Confirm',
  mixins: [ BaseDialog ],
  data () {
    return {
      visibale: true
    }
  },
  mounted () {
    this.createMap()
  },
  methods: {
    createMap () {
      const map = new BMap.Map('map')
      map.enableScrollWheelZoom(true)

      for (let i = 0; i < this.points.length; i++) {
        const point = new BMap.Point(this.points[i].longtitude, this.points[i].latitude)
        if (i === 0) map.centerAndZoom(point, 15)
        map.addOverlay(new BMap.Marker(point))
      }
    }
  }
}

</script>
<style lang='stylus' scoped>
  #map
    height 70vh
</style>
