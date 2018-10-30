<template>
  <div ref="el" :style="styleHeight" class="page-home">
    <div class="page-home__header">
      <Row class="page-home__header-row">
        <Col span="18">
        <span class="page-home__header-greetings" v-html="greetings"></span>
        </Col>
        <Col span="6" class="van-right">
        <span class="page-home__header-date">{{today}}</span>
        <Poptip v-model="visible" trigger="click" placement="bottom-end" style="height:21px">
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
      <Alert v-if="notice.content" type="warning" class="page-home__header-notice" banner closable show-icon @on-close="closeNotice">
        <span :class="{'page-home__noticeBar__Pointer': notice.url}" class="page-home__noticeBar" @click="hrefHandle">
          <TextMarquee :content="notice.content" :speed="30"/>
        </span>
        <FontIcon slot="icon" type="tongzhi-paomadeng" size="20" style="vertical-align: middle; color: #00A4BD"></FontIcon>
        <FontIcon slot="close" type="ico-fault" style="color: #9DA1B0"></FontIcon>
      </Alert>
    </div>
    <Row :gutter="16" type="flex" justify="start">
      <!-- 提货代办 -->
      <PickupTodo v-if="cardChecksTemp.includes('pickup-todo')"/>
      <!-- 送货代办 -->
      <DeliveryTodo v-if="cardChecksTemp.includes('delivery-todo')"/>
      <!-- 外转代办 -->
      <TransferTodo v-if="cardChecksTemp.includes('trans-todo')"/>
      <!-- 回单代办 -->
      <ReceiptTodo v-if="cardChecksTemp.includes('receipt-todo')" />
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
      <NewCustumerStatis v-if="cardChecksTemp.includes('new-customer')"/>
      <!-- 在途车辆信息 -->
      <CarPosition v-if="cardChecksTemp.includes('transport-location')"/>

      <Turnover v-if="cardChecksTemp.includes('turnover-statistics')" />

      <SchedulingOrder v-if="cardChecksTemp.includes('dispatch-statistics')"/>

      <Billing v-if="cardChecksTemp.includes('order-statistics')"/>

      <ReceiptsPayments v-if="cardChecksTemp.includes('pay-receive')"/>

      <Goods v-if="cardChecksTemp.includes('cargo-statistics')"/>
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import server from '@/libs/js/server'

import OrderCard from './components/OrderCard.vue'
import BlankCard from './components/BlankCard.vue'
import TextMarquee from './components/TextMarquee.vue'
import BasePage from '@/basic/BasePage'
import FontIcon from '@/components/FontIcon'

import PickupTodo from './plugins/pickup-todo.vue'
import DeliveryTodo from './plugins/delivery-todo.vue'
import TransferTodo from './plugins/transfer-todo.vue'
import ReceiptTodo from './plugins/receipt-todo.vue'
import MessageCenter from './plugins/message-center.vue'
import CreateOrderStatis from './plugins/create-order-statis.vue'

import Turnover from './plugins/turnover'
import SchedulingOrder from './plugins/scheduling-order'
import Billing from './plugins/billing'
import ReceiptsPayments from './plugins/receipts-payments'
import Goods from './plugins/goods'
import { eventHub } from './plugins/mixin.js'

import ShipperTodo from './plugins/shipper-todo.vue'
import CarrierTodo from './plugins/carrier-todo.vue'
import ExteriorTodo from './plugins/exterior-todo.vue'
import NewCustumerStatis from './plugins/new-customer-statis.vue'
import CarPosition from './plugins/car-postion.vue'

const processNoticeKey = 'tms_process_notice'
export default {
  name: 'index',
  metaInfo: { title: '首页' },
  components: {
    TextMarquee,
    OrderCard,
    FontIcon,
    BlankCard,
    PickupTodo,
    DeliveryTodo,
    TransferTodo,
    MessageCenter,
    CreateOrderStatis,
    Turnover,
    SchedulingOrder,
    Billing,
    ReceiptsPayments,
    Goods,
    CarrierTodo,
    ExteriorTodo,
    NewCustumerStatis,
    CarPosition,
    ReceiptTodo,
    ShipperTodo
  },
  mixins: [BasePage],
  data () {
    return {
      visible: false,
      notice: {
        content: '',
        url: ''
      },
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
        'order-create': '今日开单数',
        'new-customer': '今日新增客户数',
        'transport-location': '在途车辆位置',
        'turnover-statistics': '近七日订单和营业额统计',
        'dispatch-statistics': '近七日调度订单数',
        'order-statistics': '近七日开单数',
        'pay-receive': '今日应收款项 / 应付款项',
        'cargo-statistics': '今日开单货物重量 / 体积'
      },
      cardsList: [],
      intersectionObserver: null
    }
  },
  computed: {
    ...mapGetters(['UserInfo']),
    today () {
      var now = new Date()
      return now.Format('yyyy年MM月dd日') + ' ' + this.week(now.getDay())
    },
    greetings () {
      const now = new Date().getHours()
      const name = this.UserInfo.name || ''
      if (now >= 5 && now < 11) {
        return `<strong class="van-font-14 i-pr-20">早上好，${name}</strong> &nbsp;&nbsp;每天给自己一个希望，只为明天更美好。`
      } else if (now >= 11 && now < 14) {
        return `<strong class="van-font-14 i-pr-20">中午好，${name}</strong> &nbsp;&nbsp;拥抱阳光，转身心情。`
      } else if (now >= 14 && now < 17) {
        return `<strong class="van-font-14 i-pr-20">下午好，${name}</strong> &nbsp;&nbsp;相信自己，一定会有辉煌的一天。`
      } else if (now >= 17 && now < 22) {
        return `<strong class="van-font-14 i-pr-20">晚上好，${name}</strong> &nbsp;&nbsp;既然选择了远方，便只顾风雨兼程。`
      } else if (now >= 22 || now < 5) {
        return `<strong class="van-font-14 i-pr-20">夜深了，${name}</strong> &nbsp;&nbsp;再怎么忙碌，也要注意休息哦。`
      }
    },
    styleHeight () {
      return { height: this.$parent.$parent.$el.children[0].style.minHeight }
    }
  },
  created () {
    // 监控卡片卡片
    eventHub.$on('plugin:add', this.addChild)
  },
  beforeMount () {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(this.intersectionObserverEvent, {
        root: this.$refs.el,
        rootMargin: '0px',
        thresholds: [0]
      })
    }
  },
  mounted () {
    this.initCardList()
    this.initNotice()
    // 第一次登录提示流程图
    if (!window.localStorage.getItem(processNoticeKey)) {
      this.showProcess()
      window.localStorage.setItem(processNoticeKey, true)
    }
  },
  beforeDestroy () {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
      this.intersectionObserver = null
    }
    eventHub.$off('plugin:add', this.addChild)
  },
  methods: {
    showProcess () {
      this.openDialog({
        name: 'dialogs/process',
        data: {
          title: '业务'
        }
      })
    },
    week (day) {
      switch (day) {
        case 1:
          return '周一'
        case 2:
          return '周二'
        case 3:
          return '周三'
        case 4:
          return '周四'
        case 5:
          return '周五'
        case 6:
          return '周六'
        case 7:
          return '周日'
      }
    },
    addChild (_vm) {
      if (this.intersectionObserver) {
        _vm.$el.$vm = _vm
        this.intersectionObserver.observe(_vm.$el)
      }
    },
    /**
     * @param array entries 监控的element元素数组
     */
    intersectionObserverEvent (entries) {
      const vm = this
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          eventHub.$emit(`plugin:${entry.target.$vm.$options.name}`)
          vm.unobserve(entry.target)
        }
      })
    },
    unobserve (el) {
      this.intersectionObserver.unobserve(el)
    },
    /**
     * 查询跑马灯消息
     * 只会返回一条
     */
    initNotice () {
      server({
        url: 'message/pmd',
        method: 'get'
      }).then(res => {
        if (res && res.data.code === 10000) {
          this.notice = res.data.data
          // this.cardChecksTemp = []
          // for (const i of data) {
          //   if (i.valid === 1) {
          //     this.cardChecksTemp.push(i.name)
          //   }
          // }
          // this.cardsList = data
          // this.cardChecks = this.cardChecksTemp
        }
      })
    },
    /**
     * 关闭消息
     */
    closeNotice (e) {
      server({
        url: 'message/pmdDel',
        method: 'get',
        params: { id: this.notice.id }
      }).then(() => {
        this.notice = {}
      })
    },
    // 获取card数组
    initCardList () {
      server({
        url: 'home/plugin/user',
        method: 'get'
      }).then(res => {
        if (res && res.data) {
          const data = res.data.data
          this.cardChecksTemp = []
          for (const i of data) {
            if (i.valid === 1) {
              this.cardChecksTemp.push(i.name)
            }
          }
          this.cardsList = data
          this.cardChecks = this.cardChecksTemp
        }
      })
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
    },
    // 跳转链接
    hrefHandle () {
      if (this.notice.url) {
        open(this.notice.url)
      }
    }
  }

}
</script>
<style lang="stylus" scoped>
.page-home
  -webkit-transition all .2s ease-in-out
  transition all .2s ease-in-out
  margin -20px -15px
  overflow-y auto
  overflow-x hidden
  background-color #efefef;
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
  &__card-item
    padding-left 9px
    padding-right 9px
    overflow hidden
  &__header
    position relative
  &__header-row
    line-height 20px
  &__header-greetings
    line-height 24px
  &__header-notice
    width 100%
    background #fff
    border-color #EFEFEF
    border-radius 5px
    margin-top 10px
    margin-bottom 0
  &__header-date
    vertical-align super
    margin-right 30px
  &__setting-icon
    cursor pointer
  &__message-item
    background-color #f3f3f3
    margin-bottom 8px
  &__noticeBar
    position relative
    &__Pointer
      cursor pointer
    :before
      position absolute
      left 3px
      // top 0px
      content ''
      display block
      width 1px
      height 16px
      background-color #e5e7eb
</style>
