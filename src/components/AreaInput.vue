<template>
  <div>
    <div id="container"></div>
    <SelectInput
      :value="value"
      :maxlength="maxlength"
      :local-options="areaList"
      :remote="remote"
      :clearable="true"
      @input="inputHandle"
      @on-select="selectChange"
    >
    </SelectInput>
  </div>
</template>
<script>
import BMap from 'BMap'
import cityUtil from '@/libs/js/city'
import SelectInput from '@/components/SelectInput.vue'
export default {
  components: {
    SelectInput
  },
  props: {
    value: String,
    maxlength: Number,
    // 城市编码
    cityCode: String | Number,
    // 下拉数组
    localOptions: {
      type: Array,
      default: () => []
    },
    remote: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      address: [],
      map: new BMap.Map('container')
    }
  },
  computed: {
    areaList () {
      return this.localOptions.concat(this.address) // .slice(0,20)
    },
    areaName () {
      const code = this.cityCode
      return code ? cityUtil.getNameByCode(code) : this.map
    }
  },
  methods: {
    search (val) {
      const options = {
        onSearchComplete: results => {
          if (local.getStatus() === 0) {
            // 判断状态是否正确
            let arr = []
            for (let i = 0; i < results.getCurrentNumPois(); i++) {
              const item = results.getPoi(i)
              const pro = item.province ? item.province : ''
              const city = item.city ? item.city : ''
              arr.push({
                id: i,
                name: pro + city + item.title + item.address,
                value: pro + city + item.title + item.address,
                lat: item.point.lat,
                lng: item.point.lng
              })
            }
            this.address = arr
          }
        }
      }
      const local = new BMap.LocalSearch(this.areaName, options)
      local.search(val)
    },
    inputHandle (value) {
      if (value) {
        this.search(value)
      } else {
        // 清空输入框
        this.address = []
        this.selectChange(null, { lat: '', lng: '' })
      }

      this.$emit('input', value)
    },
    selectChange (value, item) {
      const lat = item.slat
      const lng = item.lng
      // 经纬度改变
      this.$emit('latlongt-change', { lat, lng })
    }
  }
}
</script>
