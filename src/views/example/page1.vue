<template>
  <div>
    <h3>通用组件Dialog</h3>
    <br>
    <p><a @click="open">demo-dialog1</a></p>
    <Alert closable>An info prompt</Alert>
    <br>
    <h3>iconfont</h3>
    <!--<div>-->
    <!--<i class="icon font_family icon-dingdanguanli"></i>-->
    <!--<div class="name">订单管理</div>-->
    <!--<div class="fontclass">.icon-dingdanguanli</div>-->
    <!--</div>-->
    <!--<p><Button type="danger" @click="closeTab">关闭当前tab页</Button></p>-->
    <!--<br>-->
    <!--<p><Button v-if="hasPower(110301)" type="primary" @click="closeTab">关闭当前tab页</Button></p>-->
    <h3>城市插件的使用</h3>
    <div>
      <select-input-for-city ref="child" v-model="code" :clearable="true"></select-input-for-city>
      <!--<SelectInput :@focus=""></SelectInput>-->
      <button @click="save">提交</button>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import SelectInputForCity from '@/components/SelectInputForCity'
// import SelectInput from '@/components/SelectInput'
export default {
  name: 'page1',
  components: {
    SelectInputForCity
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: 'demo页面'
  },
  data () {
    return {
      code: 959030
    }
  },
  watch: {
    code (code) {
      console.log(code)
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
    },
    closeTab () {
      this.ema.fire('closeTab', this.$route)
    },
    save () {
      this.$refs.child.saveCity()
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
