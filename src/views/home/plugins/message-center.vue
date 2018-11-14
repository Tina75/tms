<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__card-item">
    <BlankCard to="/information/index" page-title="消息">
      <div slot="title">消息中心</div>
      <CellGroup v-if="data.length" @on-click="handleClick">
        <Cell v-for="(msg, index) in data" :key="index" :name="index" class="message-center__message-item">
          <FontIcon slot="icon" :type="getIcon(msg.type)" :color="getColor(msg.type)" size="26">
          </FontIcon>
          <span slot="label" class="message-center__label">
            {{formatTime(msg.createTime)}}
          </span>
          <span class="message-center__title">
            {{msg.content | removeHtml}}
          </span>
        </Cell>
      </CellGroup>
      <NoData v-else msg="暂无信息～" type="msg"></NoData>
    </BlankCard>
  </div>
</template>

<script>
/**
 * 消息中心
 * 包含系统消息，订单消息，运单等消息
 * SYSTEM(0,"系统消息"),
 * ORDER(1,"订单消息"),
 * TRANSPORT(2,"运输消息"),
 * MARQUEE(3,"跑马灯消息"),
 * ORDERMSG(4,"订单消息"),
 * BACKMSG(5,"回单消息"),
 * SENDMGG(6,"运单消息"),
 * PICKMSG(7,"提货单消息"),
 * OUTERMSG(8,"外转单消息");
 *
 */
import BlankCard from '../components/BlankCard.vue'
import FontIcon from '@/components/FontIcon'
import mixin from './mixin.js'
import BasePage from '@/basic/BasePage'
import NoData from './noData'
import TMSUrl from '@/libs/constant/url'
export default {
  name: 'message-center',
  components: {
    BlankCard,
    FontIcon,
    NoData
  },
  filters: {
    removeHtml (value) {
      // 去除所有html标签
      return value.replace(/<(\S*?)[^>]*>/g, '')
    }
  },
  mixins: [mixin, BasePage],
  data () {
    return {
      data: []
    }
  },
  methods: {
    formatTime (date) {
      return new Date(date).Format('yyyy-MM-dd hh:mm')
    },
    getIcon (type) {
      switch (type) {
        case 0:
          return 'xitongxiaoxi'
        case 1:
          return 'dingdanxiaoxi'
        case 2:
          return 'yunshuxiaoxi'
      }
    },
    getColor (type) {
      switch (type) {
        case 0:
          return '#FFBB44'
        case 1:
          return '#418DF9'
        case 2:
          return '#00A4BD'
      }
    },
    load () {
      const vm = this
      this.fetch('home/message/list')
        .then((response) => {
          vm.data = response.data
        })
    },
    handleClick (index) {
      const msg = this.data[index]
      switch (msg.type) {
        // 0系统消息4订单消息5回单消息6运单消息7提货单消息8外转单消息
        case 0:
          this.openTab({
            path: TMSUrl.MESSAGE_DETAIL, // '/information/message-info',
            query: {
              id: msg.title,
              message: msg
            }
          })
          break
        case 4:
          this.openTab({
            path: TMSUrl.ORDER_MANAGEMENT, // '/order-management/order',
            title: '订单管理'
          })
          break
        case 5:
          this.openTab({
            path: TMSUrl.RECEIPT_ORDER_MANAGEMENT, // '/order-management/receipt',
            title: '回单管理'
          })
          break
        case 6:
          this.openTab({
            path: TMSUrl.TANSPORT_ORDER, // '/transport/waybill',
            title: '运单管理'
          })
          break
        case 7:
          this.openTab({
            path: TMSUrl.PICKUP_ORDER, // '/transport/pickupOrder',
            title: '提货单管理'
          })
          break
        case 8:
          this.openTab({
            path: TMSUrl.OUTER_ORDER, // '/transport/outerOrder',
            title: '外转单管理'
          })
          break
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.message-center
  &__message-item
    position relative
    padding-left 12px
    margin-top 14px
    &:first-child
      margin-top 0
  &__title
    width 100%
    position absolute
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    display block
    font-size 12px
    top 2px
    left 47px
    padding-right 48px
  &__label
    position absolute
    bottom 3px
    font-size 11px
</style>
