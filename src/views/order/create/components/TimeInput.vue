<template>
  <Poptip v-model="visible" class="timeInput">
    <div slot="content" class="order-create__timeSelect">
      <Row>
        <Col v-for="(opt, index) in timeList" :key="index" span="6">
        <div class="timeCell" @click="clickHandle(opt)">
          {{opt}}
        </div>
        </Col>
      </Row>
    </div>
    <Input v-model="inputValue" placeholder="请选择时间" readonly/>
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
    inputValue () {
      return this.value ? `${this.value}` : ''
    }
  },
  mounted () {
    if (this.type === 'START_DATE') {
      this.$root.$on('START_DATE', this.changeShow)
    } else if (this.type === 'END_DATE') {
      this.$root.$on('END_DATE', this.changeShow)
    }
  },
  beforeDestroy () {
    this.$root.$off('START_DATE', this.changeShow)
    this.$root.$off('END_DATE', this.changeShow)
  },
  methods: {
    clickHandle (e) {
      this.$emit('input', e)
      this.visible = false
    },
    changeShow () {
      this.visible = true
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
.timeCell
  padding 10px 0
  cursor pointer
  text-align center
</style>
<style lang="stylus">
.timeInput
  .ivu-poptip-arrow
    display none
  .ivu-poptip-popper
   padding-top 5px
</style>
