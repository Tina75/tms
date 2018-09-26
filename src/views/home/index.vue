<template>
  <div>
    <div class="page-home__header">
      <Row>
        <Col span="20">
        <p v-html="greetings"></p>
        </Col>
        <Col span="4" class="van-right">
        <Poptip trigger="click" placement="bottom-end">
          <FontIcon type="shouye" size="20" class="page-home__setting-icon" />
          <div slot="content">
            插件
          </div>
        </Poptip>
        </Col>
      </Row>

    </div>
    <Row gutter="16">
      <Col span="6" class="i-mt-15">
      <OrderCard
        :data="loadBills"
        :range="['#418DF9','#76E7FD']"
        theme="#418DF9"
        title="提货待办"
        label="提示文字"
        extra="123"
      >
      </OrderCard>
      </Col>
      <Col span="6" class="i-mt-15">
      <OrderCard
        :data="wayBills"
        :range="['#FFBB44','#FFB897']"
        theme="#FFBB44"
        title="送货待办"
        label="提示文字"
        extra="456"
      >
      </OrderCard>
      </Col>
      <Col span="6" class="i-mt-15">
      <OrderCard
        :data="outsideBills"
        :range="['#00A4BD','#00E0CD']"
        theme="#00A4BD"
        title="外转待办"
        label="提示文字"
        extra="789"
      >
      </OrderCard>
      </Col>
      <Col span="6" class="i-mt-15">
      <BlankCard>
        <div slot="title">消息中心</div>
        <div slot="extra">...</div>
        <CellGroup>
          <Cell title="系统升级提示" label="2018-9-12" class="page-home__message-item">
            <Icon slot="icon" type="md-chatboxes">
            </Icon>
          </Cell>
          <Cell title="系统升级提示" label="2018-9-12" class="page-home__message-item">
            <Icon slot="icon" type="md-chatboxes">
            </Icon>
          </Cell>
        </cell></CellGroup>
      </BlankCard>
      </Col>
      <Col span="6" class="i-mt-15">
      <BlankCard>
        <div slot="title">今日订单数</div>
        <div slot="extra">...</div>
      </BlankCard>
      </Col>
      <Col span="6" class="i-mt-15">
      <BlankCard>
        <div slot="title">新增客户数</div>
        <div slot="extra">...</div>
      </BlankCard>
      </Col>
      <Col span="12" class="i-mt-15">
      <BlankCard :padding="false">
        <div slot="title">在途车辆位置</div>
        <div slot="extra">...</div>
        <div ref="positionMap" style="height:238px"></div>
      </BlankCard>
      </Col>
      <Col span="24" class="i-mt-15">
      <BlankCard>
        <div slot="title">营业额通知（近七日）</div>
        <div slot="extra">...</div>
      </BlankCard>
      </Col>
      <Col span="12" class="i-mt-15">
      <BlankCard>
        <div slot="title">调度订单数</div>
        <div slot="extra">...</div>
      </BlankCard>
      </Col>
      <Col span="12" class="i-mt-15">
      <BlankCard>
        <div slot="title">开单数</div>
        <div slot="extra">...</div>
      </BlankCard>
      </Col>
      <Col span="12" class="i-mt-15">
      <BlankCard>
        <div slot="title">应收款项/应付款项</div>
        <div slot="extra">...</div>
      </BlankCard>
      </Col>
      <Col span="12" class="i-mt-15">
      <BlankCard>
        <div slot="title">货物重量/体积</div>
        <div slot="extra">...</div>
      </BlankCard>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BMap from 'BMap'
import OrderCard from './OrderCard.vue'
import BlankCard from './BlankCard.vue'
import BasePage from '@/basic/BasePage'
import FontIcon from '@/components/FontIcon'

import MarkerOverlay from './libs/MarkerOverlay.js'
import LabelOverlay from './libs/LabelOverlay.js'
export default {
  name: 'index',
  meteInfo: { title: '首页' },
  components: {
    OrderCard,
    FontIcon,
    BlankCard
  },
  mixins: [BasePage],
  data () {
    return {
      loadBills: [
        {name: '待提货调度订单数量', value: '12'},
        {name: '待提货提货订单数量', value: '32'},
        {name: '运输中订单数量', value: '42'}
      ],
      wayBills: [
        {name: '待送货调度订单数量', value: '12'},
        {name: '待送派车订单数量', value: '32'},
        {name: '待发运订单数量', value: '412'},
        {name: '运输中订单数量', value: '42'}
      ],
      outsideBills: [
        {name: '待提货调度订单数量', value: '12'},
        {name: '待提货提货订单数量', value: '32'},
        {name: '运输中订单数量', value: '42'}
      ]
    }
  },
  computed: {
    ...mapGetters(['UserInfo']),
    greetings () {
      const now = new Date().getHours()
      const name = this.UserInfo.name
      if (now >= 5 && now < 11) {
        return `<strong class="van-font-14 i-pr-20">早上好，${name}</strong> &nbsp;&nbsp;拥抱阳光，转身心情`
      } else if (now >= 11 && now < 14) {
        return `<strong class="van-font-14 i-pr-20">中午好，${name}</strong> &nbsp;&nbsp;拥抱阳光，转身心情`
      } else if (now >= 14 && now < 17) {
        return `<strong class="van-font-14 i-pr-20">下午好，${name}</strong> &nbsp;&nbsp;拥抱阳光，转身心情`
      } else if (now >= 17 && now < 22) {
        return `<strong class="van-font-14 i-pr-20">晚上好，${name}</strong> &nbsp;&nbsp;拥抱阳光，转身心情`
      } else if (now >= 22 && now < 5) {
        return `<strong class="van-font-14 i-pr-20">夜深了，${name}</strong> &nbsp;&nbsp;拥抱阳光，转身心情`
      }
    }
  },
  mounted () {
    console.log('user', this.UserInfo)
    this.$nextTick(() => {
      const bmap = new BMap.Map(this.$refs.positionMap)
      const point = new BMap.Point(118.787842, 32.026739)
      bmap.centerAndZoom(point, 16)

      const markerOverlay = new MarkerOverlay(point)
      const labelOverlay = new LabelOverlay(point, '苏A 88888')

      bmap.addOverlay(labelOverlay)
      bmap.addOverlay(markerOverlay)

      this.$refs.positionMap.style.top = '-4px'
    })
  },
  methods: {
    getGreetings () {

    }
  }

}
</script>
<style lang="stylus">
.page-home
  &__header
    position relative
  &__setting-icon
    cursor pointer
  &__message-item
    background-color #f3f3f3
    margin-bottom 8px
.anchorBL
  display none
</style>
