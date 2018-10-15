<template>
  <div is="i-col" :span="12" class="i-mt-15 page-home__card-item">
    <blank-card :to="linkto" title="今日开单货物重量/体积" page-title="订单管理">
      <div v-if="volumeData.length || weightData.length" class="chart">
        <ECharts :options="options" :auto-resize="true"></ECharts>
        <div class="chart__attach">
          <span v-if="weightData.length" class="chart__left">
            <span v-text="weight" />
            <small> 吨</small>
          </span>
          <span v-if="volumeData.length" class="chart__right">
            <span v-text="volume" />
            <small> 方</small>
          </span>
        </div>
      </div>
      <no-data v-else />
    </blank-card>
  </div>
</template>

<script>
import BlankCard from '../components/BlankCard'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'
import float from '@/libs/js/float'
import url from '@/libs/constant/url'
import NoData from './noData'

const statusStr = {
  10: '待提货',
  20: '待调度',
  30: '在途',
  40: '已到达',
  50: '已回单'
}

export default {
  name: 'goods',

  components: {
    BlankCard,
    ECharts,
    NoData
  },

  mixins: [mixin],

  data () {
    return {
      volume: 0,
      weight: 0,

      volumeData: [],
      weightData: [],

      linkto: url.ORDER_MANAGEMENT
    }
  },

  computed: {
    options () {
      return {
        color: ['#5D9EFF', '#11C88C', '#79D9F0', '#A7E7FF'],

        tooltip: {
          trigger: 'item'
        },

        series: [
          {
            type: 'pie',
            hoverAnimation: false,
            center: ['25%', '35%'],
            radius: '50%',
            label: {
              show: false
            },
            data: this.weightData || [],
            tooltip: {
              formatter: (param) => {
                return `${statusStr[param.name]}: ${param.value} 吨`
              }
            }
          },
          {
            type: 'pie',
            hoverAnimation: false,
            center: ['75%', '35%'],
            radius: '50%',
            label: {
              show: false
            },
            data: this.volumeData || [],
            tooltip: {
              formatter: (param) => {
                return `${statusStr[param.name]}: ${param.value} 方`
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
      this.fetch('/home/cargo/statistics')
        .then(response => {
          if (Number(response.code) === 10000) {
            const res = response.data
            res.map(item => {
              let obj = {
                name: item.status,
                value: item.weight
              }
              let obj2 = {
                name: item.status,
                value: item.volume
              }
              self.weightData.push(obj)
              self.volumeData.push(obj2)
              self.weight = float.round(self.weight + item.weight)
              self.volume = float.round(self.volume + item.volume)
            })
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart {
  position: relative;

  &__attach {
    position: absolute;
    top: 70%
    left: 0;
    right: 0;
    color: #555;
    font-size: 26px;

    small {
      font-size: 14px;
    }
  }

  &__left {
    position: absolute;
    left: 25%;
    width: 200px;
    margin-left: -100px;
    text-align: center;
  }

  &__right {
    position: absolute;
    left: 75%;
    width: 200px;
    margin-left: -100px;
    text-align: center;
  }
}
</style>
