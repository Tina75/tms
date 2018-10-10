<template>
  <div is="i-col" span="6" class="i-mt-15 page-home__padding-8">
    <BlankCard to="info/index" page-title="消息">
      <div slot="title">消息中心</div>
      <CellGroup>
        <Cell v-for="(msg, index) in data" :key="index" :title="msg.title" :label="formatTime(msg.createTime)" class="page-home__message-item">
          <FontIcon slot="icon" :type="getIcon(msg.type)" :color="getColor(msg.type)" size="26">
          </FontIcon>
        </Cell>
      </CellGroup>
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
export default {
  name: 'message-center',
  components: {
    BlankCard,
    FontIcon
  },
  mixins: [mixin],
  data () {
    return {
      data: [
        { title: '系统升级提示', url: '/info/index', createTime: '2018-8-8', type: 0 },
        { title: '订单发货啦', url: '/info/index', createTime: '2018-8-8', type: 1 },
        { title: '订单快到啦', url: '/info/index', createTime: '2018-8-8', type: 2 }
      ]
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
    }
  }
}
</script>

<style>

</style>
