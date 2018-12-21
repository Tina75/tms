<template>
  <div :class="classes">
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
      @on-blur="handleBlur(col)"
      @on-select="handleSelect"
    >
    </SelectInput>
    <InputNumber
      v-else-if="col.type==='number'"
      :value="record[col.key]"
      :min="col.min"
      :max="col.maxLen"
      :parser="handleParse"
      @input="v => { this.inputHandle(v, col.key) }"
      @on-change="handleChange(col.key)"
      @on-blur="handleBlur(col)"
    >
    </InputNumber>
    <Input v-else v-model="record[col.key]" :maxlength="col.max"></Input>
    <p v-if="record.hasError && record.errorMsg[col.key] !== ''" :class="errorClass">
      {{record.errorMsg[col.key]}}
    </p>
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
    cargoes: Array,
    headers: Array,
    record: Object,
    col: Object,
    onAppend: Function,
    onRemove: Function,
    onSelect: Function
  },
  data () {
    return {
      type: null
    }
  },
  computed: {
    classes () {
      return [
        `${this.prefixClass}-cell`,
        `${this.prefixClass}-cell-margin`
      ]
    },
    errorClass () {
      return [
        'i-error',
        `${this.prefixClass}-error-content`
      ]
    },
    cargoOptions (state, getters) {
      return this.cargoes.map(cargo => {
        let name = [
          cargo.cargoName,
          `${cargo.weight}吨`,
          `${cargo.volume}方`
        ]
        if (cargo.cargoCost) {
          name.push(`${cargo.cargoCost}元`)
        }
        if (cargo.unit) {
          name.push(cargo.unit)
        }
        return {
          name: name.join('，'),
          value: cargo.cargoName,
          id: cargo.id
        }
      })
    }
  },
  methods: {
    /**
     * 保持小数
     */
    handleParse (value) {
      if (this.requird) {
        return float.floor(value, this.col.point).toString()
      }
      return value ? float.floor(value, this.col.point).toString() : value
    },
    /**
     * 新增货物
     */
    handleAppend () {
      // this.$emit('on-append', { index: this.index }, this.record)
      this.onAppend(this.index, this.record)
    },
    /**
     * 删除
     */
    handleRemove () {
      this.onRemove(this.index, this.record)
    },
    /**
     * 选中已维护货物
     */
    handleSelect (no, cargo) {
      this.onSelect({ index: this.index }, cargo)
    },
    handleBlur (col) {
      if (col.required || col.key === 'cargoCost') {
        this.record.validateField(col.key)
      }
    },
    handleChange (type) {
      if (type !== 'quantity') {
        return
      }
      // 是否输入了货物名称
      let cargoName = this.record.cargoName
      // 查找货物名称，是否是已维护的货物信息
      if (cargoName) {
        const matchCargo = this.cargoes.find((cargo) => cargo.cargoName === cargoName)
        // 匹配成功
        if (matchCargo) {
          ['weight', 'volume', 'cargoCost'].forEach((key) => {
            let value = this.record[this.col.key] || 1
            this.record[key] = float.round(value * matchCargo[key])
          })
        }
      }
    },
    inputHandle (value, key) {
      if (key === 'weightKg') {
        const v = float.floor(value / 1000, 3)
        if (v !== this.record['weight']) {
          this.record['weight'] = v
        }
      } else {
        this.record[key] = value
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.ivu-table-cell-margin
  margin-top 25px
  margin-bottom 25px
.ivu-table-error-content
  line-height 22px
  position absolute
</style>
