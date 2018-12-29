<template>
  <div>
    <div v-for="item in dialogs" :key="item.name">
      <component :is="cache[item.name]" :show-dialog="item.visiable"></component>
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
    const vm = this
    this.ema = window.EMA.getProxy()

    // 打开一个弹出框
    vm.bindEvent('push', (data) => {
      vm.loadDialog({
        name: data.name,
        data: JSON.parse(JSON.stringify(data.data)),
        methods: data.methods
      }, (key) => {
        vm.pushDialog(key)
      })
    })
    // 关闭指定弹出框
    vm.bindEvent('close', (name) => {
      let obj = vm.dialogs[vm.dialogs.length - 1]
      obj.visiable = false
      vm.cache[obj.name] = undefined
      vm.dialogs.splice(vm.dialogs.length - 1, 1)
      delete vm.cache[obj.name]
    })
  },
  beforeDestroy () {
    this.cache = []
    this.dialogs = []
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
      const vm = this
      var name = data.name
      const key = name.replace(/\//g, '-')
      if (vm.cache[key]) {
        // 弹出框出现2次，所以先关闭掉，再执行打开操作
        this.ema.fire('Dialogs.close', key)
      }
      if (!vm.cache[key]) {
        vm.importFile(key, data, fn)
      }
    },
    importFile (key, data, fn) {
      const vm = this
      import('../../../views/' + data.name + '').then(module => {
        // 加载弹出框模块
        // 注入method 方法,注入初始化数据
        let tempModule = Vue.extend(module.default)
        tempModule = tempModule.extend({
          data: function () {
            return data.data
          },
          methods: data.methods
        })
        // 全局注册暂时关闭
        // Vue.component(key, tempModule)
        vm.cache[key] = tempModule
        fn(key)
      }).catch(() => {
        console.error('Chunk loading failed', name.replace(/\//g, '-'))
      })
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
