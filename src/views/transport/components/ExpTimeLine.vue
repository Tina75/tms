<template>
  <div class="order-log">
    <div class="detail-part-title">
      <span>异常处理日志</span>
    </div>
    <div class="detail-log">
      <div class="detail-log-icon" @click="showLog = !showLog">
        <i :class="{'detail-log-show': showLog}"></i>
      </div>
      <Timeline class="detail-log-timeline">
        <TimelineItem v-for="(item, key) in logList" :key="key" class="detail-log-timeline-item">
          <i slot="dot"></i>
          <span style="margin-right: 60px;color: #777;">{{item.createTimeLong}}</span>
          <span style="color: #333;">{{'【' + item.operatorName + '】' + item.description}}</span>
        </TimelineItem>
      </Timeline>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showLog: false,
      logList: [{
        'id': 5806,
        'orderId': 2540,
        'operatorId': 176,
        'operatorName': '徐斌',
        'code': '52001',
        'description': '创建订单成功',
        'createTime': 1540989941000
      },
      {
        'id': 5809,
        'orderId': 2540,
        'operatorId': 174,
        'operatorName': '徐斌haha',
        'code': '520101',
        'description': '创建订单成功',
        'createTime': 1540989941123
      }]
    }
  },
  methods: {
  }
}
</script>
<style>

</style>
