<template>
  <div>
    <h3>通用组件Dialog</h3>
    <br>
    <p><a @click="open">demo-dialog1</a></p>
    <Alert closable>An info prompt</Alert>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
export default {
  name: 'page1',
  components: {},
  mixins: [ BasePage ],
  metaInfo: {
    title: 'demo页面'
  },
  data () {
    return {
    }
  },
  methods: {
    open () {
      this.openDialog({
        name: 'example/dialog/demo-dialog1',
        data: {
          title: 'title',
          other: 'something'
        },
        methods: {
          ok () {
            console.log('ok!')
          }
        }
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
