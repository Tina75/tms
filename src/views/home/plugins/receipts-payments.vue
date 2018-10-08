<template>
  <div is="i-col" :span="12" class="i-mt-15 page-home__padding-8">
    <blank-card>
      <div slot="title">应收款项 / 应付款项</div>
      <div class="chart">
        <ECharts :options="options" :auto-resize="true"></ECharts>
        <div class="chart__attach">
          <span class="chart__left">{{ receive | retMoney }}</span>
          <span class="chart__right">{{ pay | retMoney }}</span>
        </div>
      </div>
    </blank-card>
  </div>
</template>

<script>
import BlankCard from '../components/BlankCard'
import ECharts from 'vue-echarts/components/ECharts'
import mixin from './mixin.js'

export default {
  name: 'receipts-payments',

  components: {
    BlankCard,
    ECharts
  },

  filters: {
    retMoney (val) {
      return '￥' + (Number(val) / 100).toFixed(2)
    }
  },

  mixins: [mixin],

  data () {
    return {
      pay: 0,
      receive: 0
    }
  },

  computed: {
    options () {
      return {
        series: [
          {
            type: 'pie',
            hoverAnimation: false,
            radius: ['40%', '50%'],
            center: ['25%', '35%'],
            itemStyle: {
              color: '#11C88C'
            },
            label: {
              position: 'center',
              color: '#333333',
              fontSize: 14
            },
            data: [
              {value: Number(this.receive) / 100, name: '应收'}
            ]
          },
          {
            type: 'pie',
            hoverAnimation: false,
            radius: ['40%', '50%'],
            center: ['75%', '35%'],
            itemStyle: {
              color: '#418DF9'
            },
            label: {
              position: 'center',
              color: '#333333',
              fontSize: 14
            },
            data: [
              {value: Number(this.pay) / 100, name: '应付'}
            ]
          }
        ]
      }
    }
  },

  methods: {
    load () {
      const self = this
      this.fetch('/home/pay/receive')
        .then(response => {
          if (Number(response.code) === 10000) {
            const res = response.data
            self.pay = res.pay
            self.receive = res.receive
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
