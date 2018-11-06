<template>
  <div class="order-log">
    <div class="detail-part-title">
      <span>异常处理日志</span>
    </div>
    <div class="detail-log">
      <div class="detail-log-icon" @click="showList">
        <i :class="{'detail-log-show': showLog}"></i>
      </div>
      <Timeline class="detail-log-timeline" style="height: auto">
        <TimelineItem v-for="(item, key) in logList" :key="key" class="detail-log-timeline-item">
          <i slot="dot"></i>
          <span style="margin-right: 60px;color: #777;">{{item.createTime}}</span>
          <span style="color: #333;">{{'【' + item.operatorName + '】' + item.description}}</span>
        </TimelineItem>
      </Timeline>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showLog: false
    }
  },
  computed: {
    logList () {
      return !this.showLog ? this.data.slice(0, 1) : this.data
    }
  },
  methods: {
    showList () {
      this.showLog = !this.showLog
    }
  }
}
</script>
