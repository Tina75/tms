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
            <div class="page-home__dropdown-header">
              选择显示面板
            </div>
            <CheckboxGroup v-model="cardChecks" class="page-home__dropdown-body">
              <div v-for="(item, index) in cards" :key="index" class="page-home__dropdown-checkbox">
                <Checkbox :label="item.id">
                  <span>{{item.label}}</span>
                </Checkbox>
              </div>
            </CheckboxGroup>
            <div class="page-home__dropdown-footer">
              <Button type="primary" size="small">确定</Button>
              <Button class="i-ml-10" size="small">取消</Button>
            </div>
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
      <!-- 发货方核销代办 -->
      <ShipperTodo />
      <!-- 承运商核销代办 -->
      <CarrierTodo />
      <!-- 外转方核销代办 -->
      <ExteriorTodo />
      <CreateOrderStatis />
      <!-- 新增顾客数 -->
      <NewCustumerStatis />
      <!-- 在途车辆信息 -->
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
      permission: [],
      cardChecks: ['pickup-todo'],
      cards: [
        {label: '提货待办', value: '1', id: 'pickup-todo'},
        {label: '送货待办', value: '1', id: 'delivery-todo'},
        {label: '外转待办', value: '1', id: 'trans-todo'},
        {label: '回单待办', value: '1', id: 'receipt-todo'},
        {label: '发货方核销待办', value: '1', id: 'consigner-todo'},
        {label: '承运商核销待办', value: '1', id: 'carrier-todo'},
        {label: '外转方核销待办', value: '1', id: 'transferfee-todo'},
        {label: '消息中心', value: '1', id: 'message-center'},
        {label: '今日订单数', value: '1', id: 'order-create'},
        {label: '新增客户数', value: '1', id: 'new-customer'},
        {label: '在途车辆位置', value: '1', id: 'transport-location'},
        {label: '营业额通知', value: '1', id: 'turnover-statistics'},
        {label: '调度订单数', value: '1', id: 'dispatch-statistics'},
        {label: '开单数', value: '1', id: 'order-statistics'},
        {label: '应收款/应付款项', value: '1', id: 'pay-receive'},
        {label: '货物重量/体积', value: '1', id: 'cargo-statistics'}
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
    // console.log('user', this.UserInfo)
    // const vm = this
    server({
      url: 'home/plugin/user',
      method: 'get'
    }).then(response => {
      // console.log('permision', response)
      // eventHub.$emit('plugin.delivery-todo', 'pickup')
    })
  },
  methods: {
    getGreetings () {

    }
  }

}
</script>
<style lang="stylus" scoped>
.page-home
  &__dropdown-header
    text-align center
    border-bottom 1px solid #efefef
    padding 10px 0
  &__dropdown-body
    text-align left
    padding 5px 10px
  &__dropdown-checkbox
    margin 6px 0
  &__dropdown-footer
    padding 10px 0
    text-align center
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
</style>
