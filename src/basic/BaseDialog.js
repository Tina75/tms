export default {
  replace: true,
  props: {
    showDialog: Boolean
  },
  data: function () {
    return {
      // modulePowers: modulePowers,
      title: '',
      size: 'small',
      visiable: this.showDialog
    }
  },
  // 组件是你刚被创建,组件属性计算前
  beforeCreated: function () {},
  // 组件创建完成,属性已绑定,但是dom还没生产,$el还不存在
  created: function () {
    this.ema = window.EMA.getProxy()
  },
  // 模板编译挂载前
  beforeMount: function () {},
  // 模板编译挂载之后,不保证组件已经在document中。
  mounted: function () {},
  // 组件更新之前
  beforeUpdate: function () {},
  // 组件更新之后
  updated: function () {},
  // keep-alive 会用到
  // 组件被激活
  activated: function () {},
  // 组件被移除
  deactivated: function () {},
  beforDestroy: function () {},
  destroyed: function () {
    this.ema.dispose()
  },
  methods: {
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
    },
    /**
     * 打开一个弹出框
     * @param data
     *  {
     *    name:'', //弹出框名称,dialog目录下弹出框名称
     *    data:{}, //传给弹出框的基础数据 data能包含数据
     *    methods:{} //传给弹出框的基础方法。方便回调等操作
     *  }
     */
    openDialog: function (data) {
      this.ema.fire('Dialogs.push', data)
    },
    /**
     * 打开一个tab页
     * @param data
     *  {
     *    title:'', //tab应该显示的名称,默认值为query.id或metaInfo.title
     *    path:'', //路径
     *    multi:false //是否支持多开 默认false 已废弃
     *    query:{}
     *  }
     */
    openTab: function (data) {
      data.query = Object.assign({ noCache: true }, data.query)
      // data.query = Object.assign({_time: new Date().getTime()}, data.query)
      data.query.title = data.title ? data.title : (data.query.id ? data.query.id : this.$options.metaInfo.title)
      this.ema.fire('openTab', data)
    },
    close: function () {
      console.log('close ' + this.$options.name)
      this.ema.fire('Dialogs.close', this.$options.name)
    },
    // 权限控制
    hasPower: function (power) {
      if (!power) { return true }
      return this.$store.state.permissions.includes(power)
    }
  }
}
