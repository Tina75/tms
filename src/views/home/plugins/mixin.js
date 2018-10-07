import server from '@/libs/js/server'
import Vue from 'vue'

export const eventHub = new Vue()

export default {
  data () {
    return {
      eventHub: eventHub,
      loaded: false,
      valid: false
    }
  },
  created () {
    // const vm = this
    if (this.$options.name) {
      this.eventHub.$on(`plugin:${this.$options.name}`, this.invokeLoad)
    }
  },
  beforeDestroy () {
    this.eventHub.$off(`plugin:${this.$options.name}`, this.invokeLoad)
  },

  mounted () {
    this.eventHub.$emit('plugin:add', this)
  },
  methods: {
    invokeLoad () {
      if (!this.loaded) {
        this.loaded = true
        this.load()
      }
      // console.log('receive message' + this.$options.name)
    },
    fetch (url, method = 'get', data = {}) {
      return server({
        method,
        url,
        data
      }).then((response) => {
        return response.data
      })
    }
  }
}
