<template>
  <div class="unit-bar">
    <!-- <div style="text-align:center">开单设置</div> -->
    <Form ref="unitForm" :model="unitForm" :label-width="120" class="unitForm">
      <FormItem label="货物重量单位">
        <Select v-model="unitForm.unit" clearasble>
          <Option v-for="el in unitList" :value="el.value" :key="el.value">{{el.name}}</Option>
        </Select>
      </FormItem>
      <FormItem class="i-mt-30">
        <Button type="primary" @click="save">保存</Button>
        <Button type="default" class="i-ml-10" @click="reset">恢复默认</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Server from '@/libs/js/server'
import { mapGetters, mapMutations } from 'vuex'
const unitList = [
  {
    value: 1,
    name: '吨'
  },
  {
    value: 2,
    name: '公斤'
  }
]
export default {
  name: 'order-unit',
  data () {
    return {
      unitList,
      unitForm: {
        unit: this.WeightOption
      }
    }
  },
  computed: {
    ...mapGetters(['WeightOption'])
  },
  mounted () {
    this.unitForm.unit = this.WeightOption
  },
  methods: {
    ...mapMutations(['changeOrderConfiguration']),
    reset () {
      this.unitForm.unit = 1
    },
    save () {
      const vm = this
      Server({
        url: 'order/config/insertOrUpdate',
        method: 'post',
        data: {
          weightOption: vm.unitForm.unit
        }
      }).then((result) => {
        this.$Message.success('保存成功')
        // this.complete(param)
        this.changeOrderConfiguration(vm.unitForm.unit)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.unit-bar
  .unitForm
    width 400px
    margin 10px auto 0
    min-height 100px
  .footer
    text-align center
</style>
