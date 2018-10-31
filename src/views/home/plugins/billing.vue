<template>
  <div is="i-col" :span="12" class="i-mt-15 page-home__card-item">
    <blank-card :to="linkto" title="近七日开单数" page-title="运营报表" tab="7">
      <ECharts :options="options" :auto-resize="true"></ECharts>
    </blank-card>
  </div>
</template>

<script>
import BlankCard from '../components/BlankCard'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'
import url from '@/libs/constant/url'

import 'echarts/lib/chart/line'

export default {
  name: 'billing',

  components: {
    BlankCard,
    ECharts
  },

  mixins: [mixin],

  data () {
    return {
      xData: [],
      yData: [],

      linkto: url.OPERATE_REPORT
    }
  },

  computed: {
    options () {
      return {
        color: ['#00A4BD'],
        textStyle: {
          color: '#555555',
          fontSize: 12
        },

        xAxis: {
          name: '月/日',
          type: 'category',
          data: this.xData || [],
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: (value) => {
              return value.replace(/^\d+-(\d+)-(\d+)$/g, '$1.$2')
            }
          },
          axisLine: {
            lineStyle: {
              color: '#E9ECF4'
            }
          }
        },

        yAxis: {
          name: '笔',
          type: 'value',
          nameTextStyle: {
            padding: [0, 25, 0, 0]
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#E9ECF4'
            }
          }
        },

        grid: {
          left: 25,
          right: 60,
          top: 30,
          bottom: 12,
          containLabel: true
        },

        series: [
          {
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: this.yData || [],
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#00a4bd' // 0% 处的颜色
                }, {
                  offset: 0.8, color: '#fff' // 100% 处的颜色
                }]
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    load () {
      const self = this
      this.fetch('/home/order/statistics')
        .then(response => {
          if (Number(response.code) === 10000) {
            const res = response.data
            res.map(item => {
              self.xData.push(item.day)
              self.yData.push(item.cnt)
            })
          }
        })
    }
  }
}
</script>
