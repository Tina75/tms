import server from '@/libs/js/server'

export default {
  methods: {
    fetch (url, method = 'get', data = {}) {
      return server({
        method,
        url,
        data
      }).then((response) => {
        return response.data
      })
    },
    push (path) {
      this.$router.push({ path })
    }
  }
}
