<template>
  <div class="unit-bar">
    <!-- <div style="text-align:center">开单设置</div> -->
    <Form ref="unitForm" :model="unitForm" :rules="unitRules" :label-width="120" class="unitForm">
      <FormItem label="货物重量单位">
        <Select v-model="unitForm.unit" clearasble>
          <Option v-for="el in unitList" :value="el.value" :key="el.value">{{el.name}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div class="footer">
      <Button type="primary" @click="reset">恢复默认</Button>
      <Button type="default" style="margin-left: 8px" @click="save">保存</Button>
    </div>
  </div>
</template>
<script>
// import Api from '../libs/api'
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
        unit: 1
      },
      unitRules: {
        unit: [
          { required: true, message: '货物重量单位不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {

    },
    reset () {
      this.unitForm.unit = 1
    },
    save () {
      const param = {
        weightOption: this.unitForm.unit
      }
      setTimeout(() => {
        this.$Message.success('保存成功')
        // this.complete(param)
        console.log(param)
      }, 0)
      // Api.setOrderConfig(param).then((data) => {
      //   this.close()
      // }).catch(err => console.log(err))
    }
  }
}
</script>
<style lang="stylus" scoped>
.unit-bar
  .unitForm
    min-height 100px
  .footer
    text-align center
</style>
