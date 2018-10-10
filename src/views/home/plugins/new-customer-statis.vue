<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <BlankCard>
      <div slot="title">新增顾客数</div>
      <div>
        <ECharts :options="options" :auto-resize="true"></ECharts>
      </div>
    </BlankCard>
  </div>
</template>

<script>
// 新增顾客数
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
            text: '0家',
            textAlign: 'center',
            fill: '#333',
            font: 'bolder 1em "Microsoft YaHei", sans-serif'
          }
        },
        series: [
          {
            name: '今日新增顾客数',
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
              { value: 10, name: '发货方' },
              { value: 20, name: '承运商' },
              { value: 30, name: '外转方' }
            ]
          }
        ]
      }
    }
  },
  methods: {
    load () {
      this.fetch('home/new/customer/cnt')
        .then((response) => {
          const [data, res] = [response.data, []]
          res.push({ value: data.consignerCnt, name: '发货方' })
          res.push({ value: data.carriersCnt, name: '承运商' })
          res.push({ value: data.transfereeCnt, name: '外转方' })
          this.options.series[0].data = res
          this.options.graphic.style.text = `${data.consignerCnt + data.carriersCnt + data.transfereeCnt}家`
        })
    }
  }
}
</script>
