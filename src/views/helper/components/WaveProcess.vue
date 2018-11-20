<template>
  <div class="wave-process">
    <!-- <canvas></canvas> -->
    <div v-if="process !== 0">
      <div :style="styles" class="ocean">
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <div class="wave-text">
        <span>{{process}}%</span>
      </div>
    </div>
    <div v-else>
      <div class="wave-logo">
        <i class="icon font_family icon-logo-1"></i><br/>
        <i class="icon font_family icon-ico-text"></i>
      </div>
    </div>
  </div>
</template>

<script>
// import { requestAnimationFrame } from '@/libs/js/requestAnimationFrame.js'
export default {
  props: {
    process: {
      type: Number,
      default: 0
    }
  },
  computed: {
    styles () {
      return {
        height: this.process + '%'
      }
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>
.wave-process
  width 140px
  height 140px
  border-radius 50%
  -webkit-border-radius 50%
  -moz-border-radius 50%
  -ms-border-radius 50%
  overflow hidden
  border 1px dashed #00A4BD
.ocean
  height: 5%;
  width:968px;
  position:absolute;
  bottom:0;
  left:0;
  background: #00A4BD;
  .wave
    background: url(../../../assets/wave.png) repeat-x top center;
    position: absolute;
    top: -10px;
    width: 968px;
    height: 10px;
    animation: wave 5s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
    transform: translate3d(0, 0, 0);
    opacity: 0.3
  .wave:nth-of-type(2)
    top: -7px;
    animation: wave 8s cubic-bezier( 0.5, 0.32, 0.49, 0.66) -.125s infinite, swell 6s ease -1.25s infinite;
    opacity: 1;
.wave-text
  position absolute
  top 50px
  width 140px
  text-align center
  span
    font-size 24px
    color #333
.wave-logo
  position absolute
  width 140px
  text-align center
  .icon-ico-text
    color #199BB1
    font-size 30px
    position: absolute
    top 80px
    left 23px
  .icon-logo-1
    color #199BB1
    font-size: 75px;
@keyframes wave {
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: -121px;
  }
}

@keyframes swell {
  0%, 100% {
    transform: translate3d(0,-3px,0);
  }
  50% {
    transform: translate3d(0,3px,0);
  }
}
</style>
