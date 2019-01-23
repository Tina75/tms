<template>
  <div is="i-col" :span="12" class="i-mt-15 page-home__card-item">
    <blank-card :to="linkto" title="近七日订单和营业额统计" page-title="营业额汇总表" tab="7">
      <ECharts :options="options" :auto-resize="true"></ECharts>
    </blank-card>
  </div>
</template>

<script>
import BlankCard from '../components/BlankCard'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'
import url from '@/libs/constant/url'
import { divideFee } from '@/libs/js/config'
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
      yCountData: [],

      linkto: url.TOTAL_REPORT
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
          bottom: 5,
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
            offset: 0,
            type: 'value',
            // nameTextStyle: {
            //   padding: [0, 0, 0, 0]
            // },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              align: 'right'
            },
            splitLine: {
              show: false
            }
          },
          {
            name: '单量',
            type: 'value',
            // nameTextStyle: {
            //   padding: [0, 0, 0, 10]
            // },
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
              const fmtTotal = divideFee(Number(item.total))
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
