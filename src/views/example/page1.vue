<template>
  <div>
    <h3>通用组件Dialog</h3>
    <br>
    <p><a @click="open">demo-dialog1</a></p>
    <Alert closable>An info prompt</Alert>
    <br>
    <h3>iconfont</h3>
    <div>
      <i class="icon font_family icon-dingdanguanli"></i>
      <div class="name">订单管理</div>
      <div class="fontclass">.icon-dingdanguanli</div>
    </div>
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
