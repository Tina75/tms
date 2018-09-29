
<template>
  <div class="error404">
    <div class="error404-body-con">
      <div>
        <h3 class="error404-body-con-title">404</h3>
        <div class="error404-body-con-message">糟糕，网页出错了</div>
        <div>
          <img class="error404-body-con-img" src="@/assets/404.png" alt="not found">
        </div>
      </div>
      <!-- <Card>
        <div class="error404-body-con-title">4<span><Icon type="ios-navigate-outline"/></span>4</div>
        <p class="error404-body-con-message">YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST</p>
        <div class="error404-btn-con">
          <i-button size="large" style="width: 200px;" type="text" @click="goHome">返回首页</i-button>
          <i-button size="large" style="width: 200px;margin-left: 40px;" type="primary" @click="backPage">返回上一页</i-button>
        </div>
      </Card> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  metaInfo: {
    title: '404'
  },
  methods: {
    backPage () {
      this.$router.go(-1)
    },
    goHome () {
      this.$router.push({
        name: 'home_index'
      })
    }
  }
}
</script>
<style lang="stylus">
// @keyframes error404animation
//   0%
//       transform rotateZ(0deg)
//   20%
//       transform rotateZ(-60deg)
//   40%
//       transform rotateZ(-10deg)
//   60%
//       transform rotateZ(50deg)
//   80%
//       transform rotateZ(-20deg)
//   100%
//       transform rotateZ(0deg)
.error404
  &-body-con
    top 50px
    right 0
    left 200px
    margin 0px auto
    padding 100px 0
    text-align center
    position absolute
    color #999999
    background #efefef
    &-title
      font-size 80px
      font-weight 100
    &-message
      font-size 30px
      margin-bottom 56px
      font-weight 100
    &-img
      width 180px
      height 220px
  &-btn-con
    text-align center
    padding 20px 0
    margin-bottom 40px

</style>
