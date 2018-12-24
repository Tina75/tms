export default {
  methods: {
    // 权限控制
    hasPower: function (power) {
      if (!power) { return true }
      return this.$store.state.permissions.includes(power + '')
    }
  }
}
