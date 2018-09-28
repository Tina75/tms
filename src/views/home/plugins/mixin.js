import server from '@/libs/js/server'
import Vue from 'vue'

export const eventHub = new Vue()
export default {
  data () {
    return {
      eventHub: eventHub,
      valid: false
    }
  },
  created () {
    if (this.$options.name) {
      this.eventHub.$on(`plugin.${this.$options.name}`, () => {
        console.log('receive message' + this.$options.name)
      })
    }
  },
  methods: {
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
