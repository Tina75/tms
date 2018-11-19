<template>
  <div class="order-log">
    <div class="order-log-list">
      <div class="fold-icon" @click="showOperationLog">
        <span :class="showLog ? 'hide-log' : 'show-log'"></span>
      </div>
      <Timeline :class="showLog ? 'show-timeline' : 'hide-timeline'" :style="{ 'height': showLog ? 44*orderLogCount + 'px' : '15px' }" style="margin-top: 7px;overflow: hidden;">
        <TimelineItem v-for="(item, index) in orderLog" :key="index">
          <i slot="dot"></i>
          <span style="margin-right: 60px;color: #777;font-size: 14px;">{{item.createTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
          <span style="color: #333;font-size: 14px;">{{'【' + item.operatorName + '】' + item.description}}</span>
        </TimelineItem>
      </Timeline>
    </div>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
export default {
  props: {
    // 接口url
    methodsUrl: {
      type: String,
      default: ''
    },
    // 请求方式
    methodType: {
      type: String,
      default: 'get'
    },
    // 请求体
    searchData: {
      type: Object,
      default: Object
    }
  },
  data () {
    return {
      showLog: false,
      orderLogCount: 0,
      orderLog: []
    }
  },
  mounted () {
    this.queryLog()
  },
  methods: {
    // 日志切换显示
    showOperationLog () {
      this.showLog = !this.showLog
    },
    // 查询数据
    queryLog () {
      let vm = this
      Server({
        url: vm.methodsUrl,
        method: vm.methodType,
        data: vm.searchData
      }).then((res) => {
        vm.orderLog = res.data.data.list
        vm.orderLogCount = res.data.data.list.length
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.order-log
  .order-log-list
    display: flex;
    display -ms-flexbox
    justify-content: flex-start;
    -ms-flex-pack start
    min-height: 150px;
    margin-top: 25px;
  .ivu-timeline-item
    i
      display inline-block
      width 12px
      height 12px
      background-color #C9CED9
      border-radius 50%
      vertical-align text-bottom
    &:first-child
      i
        background-color #00A4BD
.fold-icon
    width 26px
    height 26px
    background rgba(0,164,189,1)
    border-radius 5px
    margin 0 60px 0 30px
    text-align center
    cursor pointer
    span
      display block
      width 16px
      height 16px
      margin 5px
      background url(../assets/img-icon-expand.png) no-repeat
      background-size contain
  .show-log
    transition all 0.3s linear
  .hide-log
    transform rotate(180deg)
    transition all 0.3s linear
</style>
