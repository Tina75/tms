<template>
  <div is="i-col" :span="12" class="i-mt-15 page-home__padding-8">
    <blank-card>
      <div slot="title">开单数</div>
      <div>
        <ECharts :options="options" :auto-resize="true"></ECharts>
      </div>
    </blank-card>
  </div>
</template>

<script>
import BlankCard from '../components/BlankCard'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'

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
      yData: []
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
          name: '周月',
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
          name: '万',
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
          left: 0,
          right: 0,
          top: 30,
          bottom: 12,
          containLabel: true
        },

        series: [
          {
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: this.yData || [],
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#00a4bd69' // 0% 处的颜色
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
