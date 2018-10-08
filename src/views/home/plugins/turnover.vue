<template>
  <div is="i-col" :span="24" class="i-mt-15 page-home__padding-8">
    <blank-card>
      <div slot="title">营业额通知（近七日）</div>
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

import 'echarts/lib/chart/bar'

export default {
  name: 'turnover',

  components: {
    BlankCard,
    ECharts
  },

  mixins: [mixin],

  data () {
    return {
      xData: [],
      yTotalData: [],
      yCountData: []
    }
  },

  computed: {
    options () {
      return {
        color: ['#11C88C', '#418DF9'],
        textStyle: {
          color: '#555',
          fontSize: 12
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 0,
          right: 0,
          top: 30,
          bottom: 12,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData || [],
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              formatter: (value) => {
                return value.replace(/-/g, '/')
              }
            }
          }
        ],
        yAxis: [
          {
            name: '营业额',
            offset: 35,
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 25]
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              align: 'left'
            },
            splitLine: {
              show: false
            }
          },
          {
            name: '单量',
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 35]
            },
            axisLabel: {
              align: 'left'
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '营业额',
            barWidth: '16px',
            data: this.yTotalData || []
          },
          {
            type: 'bar',
            name: '单量',
            barWidth: '16px',
            yAxisIndex: 1,
            data: this.yCountData || []
          }
        ]
      }
    }
  },
  methods: {
    load () {
      const self = this
      this.fetch('/home/turnover/statistics')
        .then(response => {
          if (Number(response.code) === 10000) {
            const res = response.data
            res.map(item => {
              console.log(item)
              const fmtTotal = Number(item.total) / 100
              self.xData.push(item.day)
              self.yTotalData.push(fmtTotal)
              self.yCountData.push(item.cnt)
            })
          }
        })
    }
  }
}
</script>
