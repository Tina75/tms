<template>
  <div>
    <div v-for="item in dialogs" :key="item.name">
      <component :is="item.name" :show-dialog="item.visiable"></component>
    </div>
  </div>
</template>
<style lang="stylus" scoped >
</style>

<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
  name: 'Dialogs',
  data: function () {
    return {
      dialogs: [],
      cache: {}
    }
  },
  watch: {
    dialogs: function (val) {
      console.log(JSON.stringify(val))
    }
  },
  mounted: function () {
    this.ema = window.EMA.getProxy()

    // 打开一个弹出框
    this.bindEvent('push', (data) => {
      this.loadDialog({
        name: data.name,
        data: JSON.parse(JSON.stringify(data.data)),
        methods: data.methods
      }, () => {
        this.pushDialog(data.name.replace(/\//g, '-'))
      })
    })
    // 关闭指定弹出框
    this.bindEvent('close', (name) => {
      let obj = this.dialogs[this.dialogs.length - 1]
      obj.visiable = false
      this.cache[obj.name] = undefined
      this.dialogs.splice(this.dialogs.length - 1, 1)
    })
  },
  methods: {
    pushDialog: function (name) {
      // 对基础数据验证放入弹框列表中
      this.dialogs.push({
        name: name,
        visiable: true
      })
      // this.dialogs.splice(0, 0, {name: name})
    },
    loadDialog: function (data, fn) {
      var name = data.name
      const key = name.replace(/\//g, '-')
      if (this.cache[key]) {
        fn()
      } else {
        import('../../../views/' + name + '').then(module => {
          // 加载弹出框模块
          // 注入method 方法,注入初始化数据
          let tempModule = Vue.extend(module.default)
          tempModule = tempModule.extend({
            data: function () {
              return data.data
            },
            methods: data.methods
          })
          Vue.component(name.replace(/\//g, '-'), tempModule)
          this.cache[key] = tempModule
          fn()
        }).catch(() => {
          console.error('Chunk loading failed', name.replace(/\//g, '-'))
        })
      }
    },
    close: function () {
      this.ema.fire('Dialogs.close', this.$options.name)
    },
    /**
     * 组件内部范围绑定事件
     * @param key
     * @param fn
     */
    bindEvent: function (key, fn) {
      if (!this.$options.name) {
        console.warn('绑定事件的组件不存在组件名称', key)
      }
      this.ema.bind(`${this.$options.name}.${key}`, fn)
    }
  }
}
</script>
