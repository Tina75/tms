<template>
  <div>
    <div class="page-home__header">
      <Row>
        <Col span="20">
        <p v-html="greetings"></p>
        </Col>
        <Col span="4" class="van-right">
        <Poptip v-model="visible" trigger="click" placement="bottom-end">
          <FontIcon type="shouye" size="20" class="page-home__setting-icon" />
          <div slot="content">
            <div class="page-home__dropdown-header">
              选择显示面板
            </div>
            <CheckboxGroup v-model="cardChecks" class="page-home__dropdown-body">
              <div v-for="(item, index) in cardsList" :key="index" class="page-home__dropdown-checkbox">
                <Checkbox :label="item.name">
                  <span>{{cardsMap[item.name]}}</span>
                </Checkbox>
              </div>
            </CheckboxGroup>
            <div class="page-home__dropdown-footer">
              <Button type="primary" size="small" @click="confirmAction">确定</Button>
              <Button class="i-ml-10" size="small" @click="cancelAction">取消</Button>
            </div>
          </div>
        </Poptip>
        </Col>
      </Row>
    </div>
    <Row :gutter="16">
      <!-- 提货代办 -->
      <PickupTodo v-if="cardChecksTemp.includes('pickup-todo')"/>
      <!-- 送货代办 -->
      <DeliveryTodo v-if="cardChecksTemp.includes('delivery-todo')"/>
      <!-- 外转代办 -->
      <TransferTodo v-if="cardChecksTemp.includes('trans-todo')"/>
      <!-- 消息中心 -->
      <MessageCenter v-if="cardChecksTemp.includes('message-center')"/>
      <!-- 发货方核销代办 -->
      <ShipperTodo v-if="cardChecksTemp.includes('consigner-todo')"/>
      <!-- 承运商核销代办 -->
      <CarrierTodo v-if="cardChecksTemp.includes('carrier-todo')"/>
      <!-- 外转方核销代办 -->
      <ExteriorTodo  v-if="cardChecksTemp.includes('transferfee-todo')"/>
      <!-- 今日订单数 -->
      <CreateOrderStatis v-if="cardChecksTemp.includes('order-create')"/>
      <!-- 新增顾客数 -->
      <NewCustumerStatis  v-if="cardChecksTemp.includes('new-customer')"/>
      <!-- 在途车辆信息 -->
      <CarPosition  v-if="cardChecksTemp.includes('transport-location')"/>

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
      visible: false,
      permission: [],
      cardChecks: [],
      cardChecksTemp: [],
      cardsMap: {
        'pickup-todo': '提货待办',
        'delivery-todo': '送货待办',
        'trans-todo': '外转待办',
        'receipt-todo': '回单待办',
        'consigner-todo': '发货方核销待办',
        'carrier-todo': '承运商核销待办',
        'transferfee-todo': '外转方核销待办',
        'message-center': '消息中心',
        'order-create': '今日订单数',
        'new-customer': '新增客户数',
        'transport-location': '在途车辆位置',
        'turnover-statistics': '营业额通知',
        'dispatch-statistics': '调度订单数',
        'order-statistics': '开单数',
        'pay-receive': '应收款/应付款项',
        'cargo-statistics': '货物重量/体积'
      },
      cardsList: []
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
    this.initCardList()
  },
  methods: {
    // 获取card数组
    initCardList () {
      server({
        url: 'home/plugin/user',
        method: 'get'
      }).then(res => {
        console.log('permision', res)
      })
      // setTimeout(() => {
      //   const data = [
      //     {code: 1, name: 'pickup-todo', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 2, name: 'delivery-todo', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 3, name: 'trans-todo', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 4, name: 'receipt-todo', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 5, name: 'consigner-todo', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 6, name: 'carrier-todo', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 7, name: 'transferfee-todo', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 8, name: 'message-center', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 9, name: 'order-create', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 10, name: 'new-customer', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 11, name: 'transport-location', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 12, name: 'turnover-statistics', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 13, name: 'dispatch-statistics', url: '', w: '', h: '', s: '', valid: '0'},
      //     {code: 14, name: 'order-statistics', url: '', w: '', h: '', s: '', valid: '0'},
      //     {code: 15, name: 'pay-receive', url: '', w: '', h: '', s: '', valid: '1'},
      //     {code: 16, name: 'cargo-statistics', url: '', w: '', h: '', s: '', valid: '1'}
      //   ]
      //   let [valid, invalid] = [[], []]
      //   for (const i of data) {
      //     if (i.valid === '1') {
      //       valid.push(i)
      //       this.cardChecksTemp.push(i.name)
      //     } else if (i.valid === '0') {
      //       invalid.push(i)
      //     }
      //   }
      //   valid = valid.sort((a, b) => a.code - b.code)
      //   invalid = invalid.sort((a, b) => (a, b) => (a.code - b.code))
      //   // 排序
      //   this.cardsList = [...valid, ...invalid]
      //   this.cardChecks = this.cardChecksTemp
      // }, 0)
    },
    // 确认请求
    confirmAction () {
      const data = this.cardsList.map(el => {
        const status = this.cardChecks.includes(el.name)
        status ? el.valid = 1 : el.valid = 0
        return el
      })
      server({
        url: 'home/plugin/save',
        method: 'post',
        data
      }).then(res => {
        this.visible = false
        this.initCardList()
      })
    },
    // 取消
    cancelAction () {
      this.visible = false
      this.cardChecks = this.cardChecksTemp
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
