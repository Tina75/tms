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
    cityCode: String | Number,
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
      return this.localOptions.concat(this.address)
    },
    areaCode () {
      const code = this.cityCode
      return code ? cityUtil.getPathByCode(code) : ''
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
              // item.province + item.city + item.title
              // item.title + ', ' + item.address
              arr.push({
                id: i,
                name: item.province + item.city + item.title + item.address + i,
                value: item.province + item.city + item.title + item.address + i,
                lat: item.point.lat,
                lng: item.point.lng,
                province: item.province,
                city: item.city
              })
            }
            this.address = arr
          }
        }
      }
      const local = new BMap.LocalSearch(this.map, options)
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
      // const code = cityUtil.getFullName(item.province + item.city) '南京市'
      const lat = item.lat
      const lng = item.lng
      this.$emit('latlongt-change', { lat, lng })
    }
  }
}
</script>
