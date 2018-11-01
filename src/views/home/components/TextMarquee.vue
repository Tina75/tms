<template>
  <p class="marquee-tips" v-html="content"></p>
</template>
<script>
function insertKeyFrame (rule) {
  if (document.styleSheets && document.styleSheets.length) {
    try {
      document.styleSheets[0].insertRule(rule, 0)
    } catch (ex) {
    }
  } else {
    var style = document.createElement('style')
    style.innerHTML = rule
    document.head.appendChild(style)
  }
}

function deleteKeyFrame (ruleName) {
  var cssrules = (document.all) ? 'rules' : 'cssRules'
  var i
  if (document.styleSheets && document.styleSheets.length && document.styleSheets[0][cssrules]) {
    for (i = 0; i < document.styleSheets[0][cssrules].length; i += 1) {
      var rule = document.styleSheets[0][cssrules][i]
      if (rule.name === ruleName || rule.selectorText === '.' + ruleName) {
        document.styleSheets[0].deleteRule(i)
        break
      }
    }
  }
}

function getWidthHeight () {
  var w = window
  var d = document
  var e = d.documentElement
  var g = d.getElementsByTagName('body')[0]
  return {
    width: w.innerWidth || e.clientWidth || g.clientWidth, height: w.innerHeight || e.clientHeight || g.clientHeight
  }
}

function getTextWidth (text, font) {
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  var context = canvas.getContext('2d')
  context.font = font
  var metrics = context.measureText(text)
  return metrics.width
}
export default {
  props: {
    content: String,
    font: {
      type: String,
      default: '14px sans-serif'
    },
    speed: {
      type: Number,
      default: 5
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      let _this = this.$el
      let animationName = 'marquee' + Math.random().toString(36).substring(3, 8)
      deleteKeyFrame(animationName)
      insertKeyFrame(`@keyframes ${animationName} {
        0% {
          text-indent: ${(_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10}px
        }
        100% {
          text-indent: ${-getTextWidth(this.content, this.font)}px
        }
      }`)
      insertKeyFrame(`@-webkit-keyframes ${animationName} {
        0% {
          text-indent: ${(_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10}px
        }
        100% {
          text-indent: ${-getTextWidth(this.content, this.font)}px
        }
      }`)
      insertKeyFrame(`@-moz-keyframes ${animationName} {
        0% {
          text-indent: ${(_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10}px
        }
        100% {
          text-indent: ${-getTextWidth(this.content, this.font)}px
        }
      }`)
      insertKeyFrame(`@-o-keyframes ${animationName} {
        0% {
          text-indent: ${(_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10}px
        }
        100% {
          text-indent: ${-getTextWidth(this.content, this.font)}px
        }
      }`)
      _this.style.animation = animationName + ' ' + this.speed + 's' + ' linear infinite'
      _this.style.webkitAnimation = animationName + ' ' + this.speed + 's' + ' linear infinite'
      _this.style.mozAnimation = animationName + ' ' + this.speed + 's' + ' linear infinite'
      _this.style.oAnimation = animationName + ' ' + this.speed + 's' + ' linear infinite'
    }
  }
}
</script>
<style lang="stylus" scoped>
.marquee-tips
  text-align left
  margin-left 15px
  overflow hidden
  white-space nowrap
  box-sizing border-box
</style>
