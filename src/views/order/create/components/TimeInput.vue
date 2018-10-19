<template>
  <Poptip v-model="visible">
    <div slot="content" class="order-create__timeSelect">
      <Row>
        <Col v-for="(opt, index) in timeList" :key="index" span="6">
        <div class="timeCell" @click="clickHandle(opt)">
          {{opt}}
        </div>
        </Col>
      </Row>
    </div>
    <Input v-model="value" placeholder="请选择时间"/>
  </Poptip>
</template>
<script>
export default {
  props: {
    value: ''
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    timeList () {
      const arr = []
      for (let i = 1; i < 25; i++) {
        if (i < 10) {
          i = '0' + i
        }
        arr.push(`${i}:00前`)
      }
      return arr
    }
  },
  methods: {
    clickHandle (e) {
      this.$emit('time-input', e)
      this.visible = false
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
</style>
