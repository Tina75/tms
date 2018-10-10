<template>
  <div is="i-col" :span="12" class="i-mt-15 page-home__padding-8">
    <blank-card :to="linkto" title="货物重量 / 体积" page-title="订单管理">
      <div class="chart">
        <ECharts :options="options" :auto-resize="true"></ECharts>
        <div class="chart__attach">
          <span class="chart__left">
            <span v-text="weight" />
            <small> 吨</small>
          </span>
          <span class="chart__right">
            <span v-text="volume" />
            <small> 方</small>
          </span>
        </div>
      </div>
    </blank-card>
  </div>
</template>

<script>
import BlankCard from '../components/BlankCard'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'
import url from '@/libs/constant/url'

const statusStr = {
  10: '待提货',
  20: '待调度',
  30: '在途',
  40: '已到达'
}

export default {
  name: 'goods',

  components: {
    BlankCard,
    ECharts
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
          trigger: 'item',
          formatter: (param) => {
            return `${statusStr[param.name]}: ${param.value}`
          }
        },
        series: [
          {
            type: 'pie',
            hoverAnimation: false,
            center: ['75%', '35%'],
            radius: '50%',
            label: {
              show: false
            },
            data: this.weightData || []
          },
          {
            type: 'pie',
            hoverAnimation: false,
            center: ['25%', '35%'],
            radius: '50%',
            label: {
              show: false
            },
            data: this.volumeData || []
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
                value: item.volume
              }
              self.volumeData.push(obj)
              let obj2 = {
                name: item.status,
                value: item.weight
              }
              self.weightData.push(obj2)
              self.volume += item.volume
              self.weight += item.weight
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
