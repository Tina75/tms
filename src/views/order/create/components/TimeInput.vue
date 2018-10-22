<template>
  <Poptip v-model="visible">
    <div slot="content" class="order-create__timeSelect">
      <Row>
        <Col v-for="(opt, index) in timeList" :key="index" span="6">
        <div class="timeCell" @click="clickHandle(opt)">
          {{opt}}: 00前
        </div>
        </Col>
      </Row>
    </div>
    <Input v-model="inputValue" placeholder="请选择时间"/>
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
        arr.push(`${i}`)
      }
      return arr
    },
    inputValue () {
      return this.value ? `${this.value}: 00前` : ''
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
</style>
