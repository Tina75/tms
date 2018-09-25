<template>
  <Cascader :data="cities" v-model="location" :placeholder="placeholder"
            @on-change="locationChange"
            @on-visible-change="locationBlur"></Cascader>
</template>

<script>
import City from '@/libs/js/City'

export default {
  name: 'AreaSelect',
  props: {
    value: [Array, String, Number],
    placeholder: String
  },
  data () {
    return {
      cityId: '',
      location: [],
      cities: []
    }
  },
  created () {
    this.getCities()
  },
  methods: {
    locationChange (value, data) {
      this.cityId = value[value.length - 1]
      this.$emit('input', this.cityId)
      this.$emit('on-change', this.cityId)
    },

    locationBlur (open) {
      if (!open && !this.cityId) this.$emit('on-blur', this.cityId)
    },

    // 查询城市列表
    getCities () {
      this.cities = walk()
      function walk (code) {
        return City.getAllChild(code).map(item => {
          let temp = {
            value: item.code,
            label: item.name
          }
          if (item.hasChild) temp.children = walk(item.code)
          return temp
        })
      }
    }
  }
}
</script>
