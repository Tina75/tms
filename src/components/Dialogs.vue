<template>
  <div class="dialogs">
    <component v-for="item in dialogs" :is="item.name" :key="item.name"></component>
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
      currentDialog: ''
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
      var lenght = this.dialogs.length - 1
      for (var i = lenght; i >= 0; i--) {
        var obj = this.dialogs[ i ]
        if (obj.name === name) {
          break
        }
      }
      this.dialogs.splice(i, 1)
    })
  },
  methods: {
    pushDialog: function (name) {
      // 对基础数据验证放入弹框列表中
      this.dialogs.push({
        name: name
      })
    },
    loadDialog: function (data, fn) {
      var name = data.name
      import('../views/' + name + '').then(module => {
        // 加载弹出框模块
        // 注入method 方法,注入初始化数据
        var tempModule = Vue.extend(module.default)
        tempModule = tempModule.extend({
          data: function () {
            return data.data
          },
          methods: data.methods
        })
        Vue.component(name.replace(/\//g, '-'), tempModule)
        fn()
      }).catch(() => {
        console.log('Chunk loading failed', name.replace(/\//g, '-'))
      })
    },
    close: function () {
      console.log('close')
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
