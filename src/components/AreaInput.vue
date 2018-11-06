<template>
  <div>
    <SelectInput
      :value="value"
      :maxlength="maxlength"
      :local-options="areaList"
      :remote="remote"
      :clearable="true"
      :placeholder="placeholder"
      :no-filter="true"
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
    placeholder: String,
    remote: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      address: [],
      map: new BMap.Map(null),
      timer: ''
    }
  },
  computed: {
    areaList () {
      const obj = {}
      const res = []
      const arr = this.value ? this.address : this.localOptions
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (!obj[item.name]) {
          res.push(item)
          obj[item.name] = 1
        }
      }
      return res
    },
    areaName () {
      const code = this.cityCode
      return code ? cityUtil.getNameByCode(code) : this.map
    }
  },
  methods: {
    search (val) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.doSearch(val, true)
      }, 200)
    },
    doSearch (val, forceLocal) {
      const options = {
        onSearchComplete: results => {
          if (local.getStatus() === window.BMAP_STATUS_SUCCESS) {
            // 判断状态是否正确
            let arr = []
            for (let i = 0; i < results.getCurrentNumPois(); i++) {
              const item = results.getPoi(i)
              const pro = item.province ? item.province : ''
              const city = item.city ? item.city : ''
              const addr = item.address ? item.address.replace(pro, '').replace(city, '') : ''
              arr.push({
                id: i,
                name: pro + city + addr + item.title,
                value: pro + city + addr + item.title,
                lat: item.point.lat,
                lng: item.point.lng
              })
            }
            this.address = arr
          } else {
            if (forceLocal) {
              this.doSearch(val, false)
            }
          }
        }
      }
      const area = forceLocal ? this.areaName : '全国'
      const local = new BMap.LocalSearch(area, options)
      local.search(val, { forceLocal })
    },
    inputHandle (value, type) {
      this.address = []
      if (value) {
        this.search(value)
      }
      this.$emit('input', value)
      if (type !== 'on-select') {
        this.selectChange(null, { lat: '', lng: '' })
      }
    },
    selectChange (value, item) {
      const lat = item.lat
      const lng = item.lng
      const type = item.lng && item.lat ? 1 : ''
      // 经纬度改变
      this.$emit('latlongt-change', { lat, lng, type })
    }
  }
}
</script>
