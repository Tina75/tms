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
      <PickupTodo />
      <DeliveryTodo />
      <TransferTodo />
      <MessageCenter />

      <ShipperTodo />
      <CarrierTodo />
      <ExteriorTodo />
      <CreateOrderStatis />
      <NewCustumerStatis />
      <!-- <Col span="6" class="i-mt-15">
      <BlankCard>
        <div slot="title">新增客户数</div>
        <div slot="extra">...</div>
      </BlankCard>
      </Col> -->
      <CarPosition />

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
import server from '@/libs/js/server'

import OrderCard from './components/OrderCard.vue'
import BlankCard from './components/BlankCard.vue'
import BasePage from '@/basic/BasePage'
import FontIcon from '@/components/FontIcon'

import PickupTodo from './plugins/pickup-todo.vue'
import DeliveryTodo from './plugins/delivery-todo.vue'
import TransferTodo from './plugins/transfer-todo.vue'
import MessageCenter from './plugins/message-center.vue'

import CreateOrderStatis from './plugins/create-order-statis.vue'
// import { eventHub } from './plugins/mixin.js'

import ShipperTodo from './plugins/shipper-todo.vue'
import CarrierTodo from './plugins/carrier-todo.vue'
import ExteriorTodo from './plugins/exterior-todo.vue'
import NewCustumerStatis from './plugins/new-customer-statis.vue'
import CarPosition from './plugins/car-postion.vue'

export default {
  name: 'index',
  meteInfo: { title: '首页' },
  components: {
    OrderCard,
    FontIcon,
    BlankCard,
    PickupTodo,
    DeliveryTodo,
    TransferTodo,
    MessageCenter,
    CreateOrderStatis,
    ShipperTodo,
    CarrierTodo,
    ExteriorTodo,
    NewCustumerStatis,
    CarPosition
  },
  mixins: [BasePage],
  data () {
    return {
      // eventHub: new Vue(),
      permission: []
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
    // const vm = this
    server({
      url: 'home/plugin/user',
      method: 'get'
    }).then(response => {
      console.log('permision', response)
      // eventHub.$emit('plugin.delivery-todo', 'pickup')
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
  &__padding-8
    padding-left 8px
    padding-right 8px
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
