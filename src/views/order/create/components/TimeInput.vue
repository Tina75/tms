<template>
  <Poptip v-model="visible" class="timeInput" placement="bottom-end">
    <div slot="content" class="order-create__timeSelect">
      <div class="order-create__timeSelectTitle" v-text="timeDate ? timeDate : '请先选择日期'"></div>
      <Row>
        <Col v-for="(opt, index) in timeList" :key="index" span="6">
        <div :class="{'order-create__timeCellDisable': isDisabled(opt), 'order-create__timeActive': value === opt}" class="order-create__timeCell" @click="clickHandle(opt)">
          {{opt}}
        </div>
        </Col>
      </Row>
    </div>
    <Input v-model="inputValue" placeholder="请选择时间" readonly clearable/>
  </Poptip>
</template>
<script>

export default {
  props: {
    value: {
      type: String
    },
    type: {
      type: String
    },
    timeDate: {
      type: String,
      default: ''
    },
    options: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      timeList: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00',
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '23:59']
    }
  },
  computed: {
    inputValue: {
      get: function () {
        return this.value ? `${this.value}前` : ''
      },
      set: function (newValue) {
        if (newValue === '') {
          this.$emit('input', '')
        }
      }
    },
    disabledArr () {
      const arr = []
      const opt = this.options
      if (this.type === 'START_DATE' && opt) {
        const t = this.getMins(opt)
        this.timeList.forEach(e => {
          if (this.getMins(e) >= t) {
            arr.push(e)
          }
        })
      } else if (this.type === 'END_DATE' && opt) {
        const t = this.getMins(opt)
        this.timeList.forEach(e => {
          if (this.getMins(e) <= t) {
            arr.push(e)
          }
        })
      }
      return arr
    }
  },
  // mounted () {
  //   if (this.type === 'START_DATE') {
  //     this.$on('START_DATE', this.changeShow)
  //   } else if (this.type === 'END_DATE') {
  //     this.$on('END_DATE', this.changeShow)
  //   }
  // },
  // beforeDestroy () {
  //   this.$off('START_DATE', this.changeShow)
  //   this.$off('END_DATE', this.changeShow)
  // },
  methods: {
    clickHandle (e) {
      if (this.isDisabled(e)) {
        return false
      }
      this.$emit('input', e)
      this.visible = false
    },
    changeShow () {
      this.visible = true
    },
    getMins (str) {
      if (!(typeof str === 'string' && str.length === 5)) {
        return 0
      }
      return Number(str.substr(0, 2) * 60 + str.substr(3, 2))
    },
    // 是否可点击
    isDisabled (opt) {
      if (!this.timeDate) {
        return true
      }
      if (this.disabledArr.includes(opt)) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="stylus" scoped>
.order-create
  &__timeSelect
    width 200px
    height 170px
    line-height 17px
  &__timeSelectTitle
    text-align center
  &__timeCell
    padding 10px 0
    cursor pointer
    text-align center
  &__timeActive
    color #00A4BD
  &__timeCellDisable
    color #DCDEE2
</style>
<style lang="stylus">
.timeInput
  .ivu-poptip-arrow
    display none
  .ivu-poptip-popper
   padding-top 5px
</style>
