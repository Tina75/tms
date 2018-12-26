<template>
  <div class="area-input">
    <SelectInput
      ref="selectInput"
      :value="value"
      :no-filter="true"
      :maxlength="maxlength"
      :clearable="true"
      :local-options="areaList"
      :placeholder="placeholder"
      :prefix="showIcon ? 'ios-pin-outline' : ''"
      @input="inputHandle"
      @on-select="selectChange"
    >
    </SelectInput>
    <!-- <Select
      v-else
      ref="selectInput"
      v-model="selectValue"
      :loading="loading"
      :placeholder="placeholder"
      :remote-method="doSearch"
      filterable
      remote
      @on-change="selectChange">
      <Option v-for="(option, index) in areaList" :value="option.name" :key="index">{{option.name}}</Option>
    </Select> -->
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
    maxlength: {
      type: Number,
      default: 100
    },
    // 城市编码
    cityCode: String | Number,
    // 下拉数组
    localOptions: {
      type: Array,
      default: () => []
    },
    // 城市组件 过滤掉省市信息
    filterCity: {
      type: Boolean,
      default: false
    },
    // 强制城市搜索
    // 默认 当前城市搜索再搜全国
    forceCity: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入地址（省市区+详细地址）'
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    onlySelect: {
      type: Boolean,
      default: false
    },
    firstSelect: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      address: [],
      timer: '',
      selectItem: null,
      selectValue: this.value
    }
  },
  computed: {
    areaList () {
      const obj = {}
      let res = []
      // const arr = this.value ? this.address : this.localOptions
      const arr = this.address
      // 去重
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (!obj[item.name]) {
          res.push(item)
          obj[item.name] = 1
        }
      }
      return arr
    },
    areaName () {
      const arr = cityUtil.getPathByCode(this.cityCode)
      return arr.length ? arr[1].name : '全国'
    }
  },
  methods: {
    search (val) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.doSearch(val, this.areaName !== '全国')
      }, 200)
    },
    doSearch (val, forceLocal) {
      const area = forceLocal ? this.areaName : '全国'
      const options = {
        onSearchComplete: results => {
          if (local.getStatus() === window.BMAP_STATUS_SUCCESS) {
            // 判断状态是否正确
            let arr = []
            if (this.firstSelect) {
              this.$nextTick(() => {
                this.$refs['selectInput'].focusIndex = 0
              })
            }
            for (let i = 0; i < results.getCurrentNumPois(); i++) {
              const item = results.getPoi(i)
              // 省市
              const city = results.city === results.province ? results.province : results.province + results.city
              /**
               * 地址和title
               * 去除省市信息
               * title和name互去除重复信息
               */
              const addr = this.replace(item.address, results.province, results.city, item.title) +
                this.replace(item.title, results.province, results.city, item.address)
              const names = !this.filterCity || !addr || this.areaName === '全国' ? city + addr : addr
              arr.push({
                id: i,
                name: names,
                value: names,
                lat: item.point.lat,
                lng: item.point.lng,
                city: results.city
              })
            }
            this.address = arr
          } else {
            if (forceLocal && !this.forceCity) {
              this.doSearch(val, false)
            }
          }
        },
        pageCapacity: 20
      }
      const local = new BMap.LocalSearch(area, options)
      local.search(val, { forceLocal })
    },
    inputHandle (value) {
      this.address = []
      this.$emit('input', value)
      if (this.selectItem && this.selectItem.value === value) {
        return
      }
      if (value) {
        this.search(value)
      } else {
        this.address = []
      }
      if ((this.selectItem && this.selectItem.value !== value) || this.selectItem === null) {
        this.selectItem = null
        this.selectChange(null, { lat: '', lng: '', city: '' })
      }
    },
    selectChange (value, item) {
      // 经纬度改变
      this.selectItem = item
      const res = {
        lat: item.lat,
        lng: item.lng,
        type: item.lng && item.lat ? 1 : '',
        cityCode: item.city ? cityUtil.getCodeByName(item.city) : ''
      }
      this.$emit('city-select', res)
      //   if (value) {
      //     let obj = {}
      //     this.address.map(el => {
      //       if (value === el.name) {
      //         obj = el
      //       }
      //     })
      //     obj.cityCode = obj.city ? cityUtil.getCodeByName(obj.city) : ''
      //     this.$emit('input', value)
      //     this.$emit('city-select', obj)
      //   }
    },
    // v过滤省市 title或name
    replace (v, p, c, t) {
      return v.replace(p || '', '').replace(c || '', '').replace(t || '', '')
    }
  }
}
</script>
<style lang="stylus">
.area-input
  .ivu-select-dropdown
    width 100% !important
</style>
