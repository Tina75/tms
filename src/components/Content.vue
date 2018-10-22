<template>
  <Content class="content">
    <router-view />
  </Content>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  computed: {},

  mounted () {},

  methods: {}
}

</script>
<style lang='stylus' scoped>
.content
  padding 15px 20px
  height 100%
  overflow-y auto
  max-width cacl(100vw - 200)
  overflow scroll
</style>
