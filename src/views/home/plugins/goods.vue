<template>
  <div is="i-col" :span="12" class="i-mt-15 page-home__padding-8">
    <blank-card>
      <div slot="title">货物重量 / 体积</div>
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
      weightData: []
    }
  },

  computed: {
    options () {
      return {
        color: ['#418DF9', '#00A4BD', '#FA871E', '#FFBB44', '#FA871E', '#A7E7FF', '#79D9F0'],
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

  created () {
    this.load()
  },

  methods: {
    load () {
      const self = this
      this.fetch('/home/cargo/statistics')
        .then(response => {
          if (Number(response.code) === 1000) {
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
