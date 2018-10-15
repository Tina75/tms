<template>
  <div :class="`${prefixClass}-cell`">
    <a v-if="col.type==='operation'" href="javascript:;">
      <Icon type="ios-add-circle" size="24" color="#7ED321" @click="handleAppend"></Icon>
      <Icon type="ios-remove-circle" size="24" color="#EC4E4E" @click="handleRemove"></Icon>
    </a>
    <SelectInput
      v-else-if="col.type==='select'"
      v-model="record[col.key]"
      :local-options="cargoOptions"
      :maxlength="col.max"
      :transfer="true"
      :remote="false"
      @on-select="handleSelect"
    >
    </SelectInput>
    <InputNumber
      v-else-if="col.type==='number'"
      v-model="record[col.key]"
      :min="col.min"
      :parser="handleParse"
    >
    </InputNumber>
    <Input v-else v-model="record[col.key]" :maxlength="col.max"></Input>
  </div>
</template>

<script>
import SelectInput from '@/components/SelectInput'
import float from '@/libs/js/float'
export default {
  components: {
    SelectInput
  },
  props: {
    index: Number,
    prefixClass: String,
    headers: Array,
    record: Object,
    col: Object,
    onAppend: Function,
    onRemove: Function,
    onSelect: Function
  },
  methods: {
    handleParse (value) {
      return float.floor(value).toString()
    },
    handleAppend () {
      this.$emit('on-append', { index: this.index }, this.record)
    },
    handleRemove (no, row) {
      this.$emit('on-remove', { index: this.index }, this.record)
    },
    handleSelect (no) {
      return (name, cargoItem) => {
        this.$emit('on-select', { index: this.index }, this.reocrd)
      }
    }
  }
}
</script>

<style>

</style>
