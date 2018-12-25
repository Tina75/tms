<template>
  <div :style="styleHeight" class="page-loading">
    <Spin v-if="loading" fix>
      <img src="../../../assets/loading.gif" width="24" height="24" alt="加载中">
    </Spin>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'loading',
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight']),
    styleHeight () {
      return {
        height: this.DocumentHeight + 'px'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-loading
  position relative
  margin -20px -15px
</style>
