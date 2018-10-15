<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__card-item">
    <BlankCard to="/client/sender" page-title="发货方管理" >
      <div slot="title">今日新增客户数</div>
      <ECharts v-if="show" :options="options" :auto-resize="true"></ECharts>
      <noData v-else></noData>
    </BlankCard>
  </div>
</template>

<script>
// 新增顾客数
import BlankCard from '../components/BlankCard.vue'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'
import noData from './noData.vue'

import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/graphic'
export default {
  name: 'new-customer-statis',
  components: {
    BlankCard,
    ECharts,
    noData
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { value: 10, name: '发货方', id: 'consignerCnt' },
        { value: 20, name: '承运商', id: 'carriersCnt' },
        { value: 30, name: '外转方', id: 'transfereeCnt' }
      ],
      show: false
    }
  },
  computed: {
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
            text: `${this.data.map(e => e.value).reduce((s, e) => s + e)}家`,
            textAlign: 'center',
            fill: '#333',
            font: 'bolder 1em "Microsoft YaHei", sans-serif'
          }
        },
        series: [
          {
            name: '今日新增客户数',
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
            data: this.data
          }
        ]
      }
    }
  },
  methods: {
    load () {
      this.fetch('home/new/customer/cnt')
        .then((response) => {
          const data = response.data
          if (data.consignerCnt || data.carriersCnt || data.transfereeCnt) {
            this.show = true
            const arr = this.data
            arr.forEach((item) => {
              item.value = data[item.id]
            })
            this.data = arr.filter(e => e.value !== 0)
          }
        })
    }
  }
}
</script>
