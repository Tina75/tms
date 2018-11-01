<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__card-item">
    <BlankCard to="/order-management/order" page-title="订单管理">
      <div slot="title">今日开单数</div>
      <ECharts :options="options" :auto-resize="true"></ECharts>
    </BlankCard>
  </div>
</template>

<script>
/**
 * 今天开单统计
 * 1. {arrive:'已到达订单数'}
 * 2. {wait_pickup:'待提货订单数'}
 * 3. {wait_dispacth: '待调度订单'}
 * 4. {in_transport: '运输中订单'}
 */
import BlankCard from '../components/BlankCard.vue'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'

import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/graphic'
export default {
  name: 'create-order-statis',
  components: {
    BlankCard,
    ECharts
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { value: 0, name: '今日开单数' }
      ]
    }
  },
  computed: {
    total () {
      return this.data.reduce((num, item) => {
        num += item.value
        return num
      }, 0)
    },
    options () {
      return {
        color: ['#418DF9', '#00A4BD', '#FA871E', '#FFBB44', '#FA871E', '#A7E7FF', '#79D9F0'],
        tooltip: {
          trigger: 'item',
          position: [50, 0],
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          show: false
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: this.total + '单',
            textAlign: 'center',
            fill: '#333',
            font: 'bolder 1em "Microsoft YaHei", sans-serif'
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['42%', '62%'],
            avoidLabelOverlap: true,
            label: {
              show: true,
              fontSize: 10,
              position: 'outside',
              color: '#333',
              formatter: '{b} {c}'
            },
            labelLine: {
              show: true,
              length: 5,
              length2: 10,
              lineStyle: {
                color: '#D9DEE8'
              }
            },
            data: this.data
          }
        ]
      }
    }
  },
  methods: {
    load () {
      this.fetch('home/open/order/statistics')
        .then((response) => {
          const data = response.data.cnt
          this.data[0].value = data
        })
    }
  }
}
</script>

<style lang="stylus">

</style>
