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
import SelectInput from '@/components/SelectInput.vue'
export default {
  components: {
    SelectInput
  },
  props: {
    value: String,
    maxlength: Number,
    city: String | Number,
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
                name: item.province + item.city + item.title,
                value: item.province + item.city + item.title,
                lat: item.point.lat,
                lng: item.point.lng
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
      this.$emit('latlongt-change', item.lat, item.lng)
    }
  }
}
</script>
