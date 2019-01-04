<template>
  <div>
    <Input
      :maxlength="maxlength"
      :value="formatterValue"
      :placeholder="placeholder"
      :rows="rows"
      type="textarea"
      class="textarea"
      @input.native="descInput"/>
    <span :class="remnant ? 'numberCount haveNumber' : 'numberCount noneNumber'">{{remnant}}/{{maxlength}}</span>
  </div>
</template>
<script>
export default {
  name: 'TextAreaNumber',
  props: {
    value: '',
    placeholder: {
      type: String,
      default: '请输入'
    },
    maxlength: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      currentValue: this.value,
      desc: '',
      remnant: 0,
      rows: 3
    }
  },
  computed: {
    formatterValue () {
      return this.currentValue
    }
  },
  mounted () {
    if (this.value) this.remnant = this.value.length
    this.initTextAreaRow(this.value)
  },
  methods: {
    initTextAreaRow (inputText) {
      let fromIndex = 0
      this.rows = 3
      while (true) {
        let index = inputText.indexOf('\n', fromIndex)
        if (index !== -1) {
          fromIndex = index + 1
          this.rows++
        } else {
          break
        }
      }
    },
    descInput (event) {
      let inputText = event.target.value
      this.initTextAreaRow(inputText)
      this.remnant = inputText.length
      this.$emit('input', event.target.value)
    }
  }
}
</script>
<style lang="stylus" scoped>
.numberCount
  float: right;
  position: relative;
  right: 20px;
  top: -30px;
  font-size 12px
.haveNumber
  color #333333
.noneNumber
  color #999999
</style>
