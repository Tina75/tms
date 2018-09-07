<template>
  <div>
    <p>I'm page1</p>
    <p><a @click="openDialog1">打开dialog</a></p>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
export default {
  name: 'page1',
  components: {},
  mixins: [ BasePage ],
  metaInfo: {
    title: '页面1'
  },
  data () {
    return {
    }
  },

  computed: {},

  mounted: function () {},

  methods: {
    openDialog1 () {
      const _this = this
      this.openDialog({
        name: 'example/dialog/demo-dialog1',
        data: { id: 1 },
        methods: {
          ok (node) {
            _this.onAddUserSuccess(node)
          }
        }
      })
    },
    onAddUserSuccess () {
      this.$Message.success('This is a success tip')
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
