<template>
  <div>
    <div>
      <p v-html="greetings"></p>
    </div>
    <Row>
      <Col span="6">
      <Card>
        <div slot="title">
          <Cell title="提货待办" label="提示内容"></Cell>
        </div>
        <div> </div>
      </Card>
      </Col>
      <Col span="6"></Col>
      <Col span="6"></Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BasePage from '@/basic/BasePage'
export default {
  name: 'index',
  meteInfo: { title: '首页' },
  mixins: [BasePage],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['UserInfo']),
    greetings () {
      const now = new Date().getHours()
      const name = this.UserInfo.name
      if (now >= 5 && now < 11) {
        return `<strong>早上好，${name} </strong> &nbsp;&nbsp;拥抱阳光，转身心情`
      } else if (now >= 11 && now < 14) {
        return `中午好，${name}`
      } else if (now >= 14 && now < 17) {
        return `<strong class="van-font-14 i-pr-20">下午好，${name}</strong> &nbsp;&nbsp;拥抱阳光，转身心情`
      } else if (now >= 17 && now < 22) {
        return `晚上好，${name}`
      } else if (now >= 22 && now < 5) {
        return `夜深了，${name}`
      }
    }
  },
  mounted () {
    console.log('user', this.UserInfo)
  },
  methods: {
    getGreetings () {

    }
  }

}
</script>
<style lang="stylus" scoped>
.page
  padding 10px
  .card-left
    min-height 88vh

</style>
