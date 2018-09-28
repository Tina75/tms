<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <BlankCard>
      <div slot="title">新增顾客数</div>
      <div slot="extra">...</div>
      <div>
        <ECharts :options="options" :auto-resize="true"></ECharts>
      </div>
    </BlankCard>
  </div>
</template>

<script>
/**
 * 新增顾客数
 */
import BlankCard from '../components/BlankCard.vue'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'

import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/graphic'
export default {
  name: 'new-customer-statis',
  components: {
    BlankCard,
    ECharts
  },
  mixins: [mixin],
  data () {
    return {
      options: {
        color: ['#418DF9', '#00A4BD', '#FA871E', '#FFBB44', '#FA871E', '#A7E7FF', '#79D9F0'],
        tooltip: {
          trigger: 'item',
          position: [50, 0],
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: false
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '300单',
            textAlign: 'center',
            fill: '#333',
            font: 'bolder 1em "Microsoft YaHei", sans-serif'
          }
        },
        series: [
          {
            name: '今日订单数',
            type: 'pie',
            radius: ['42%', '62%'],
            avoidLabelOverlap: true,
            label: {
              show: true,
              fontSize: 10,
              position: 'outside',
              color: '#333',
              formatter: '{b}\r\n({c})'
            },
            labelLine: {
              show: true,
              length: 5,
              length2: 10,
              lineStyle: {
                color: '#D9DEE8'
              }
            },
            data: [
              {value: 335, name: '待调度'},
              {value: 310, name: '待提货'},
              {value: 234, name: '在途'},
              {value: 135, name: '已送达'}
            ]
          }
        ]
      }
    }
  },
  methods: {
    load () {
      const vm = this
      this.fetch('home/open/order/statistics')
        .then((response) => {
          vm.options = response.data
        })
    }
  }
}
</script>
