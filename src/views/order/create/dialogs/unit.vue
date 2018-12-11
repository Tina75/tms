<template>
  <Modal v-model="visiable" :mask-closable="false" height="400" transfer @on-visible-change="close">
    <div slot="header" style="text-align:center">开单设置</div>
    <Form ref="unitForm" :model="unitForm" :rules="unitRules" :label-width="120" class="unitForm">
      <FormItem label="货物重量单位">
        <Select v-model="unitForm.unit" clearasble>
          <Option v-for="el in unitList" :value="el.value" :key="el.value">{{el.name}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="reset">恢复默认</Button>
      <Button type="default" @click="save">保存</Button>
      <Button type="default" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
import BaseDialog from '@/basic/BaseDialog'
// import Api from '../libs/api'
import unitList from '../libs/unit'
export default {
  name: 'order-unit',
  mixins: [ BaseDialog ],
  data () {
    return {
      unitList,
      unitRules: {
        unit: [
          { required: true, message: '货物重量单位不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.unitForm.unit = 1
    },
    save () {
      const param = {
        weightOption: this.unitForm.unit
      }
      setTimeout(() => {
        this.$Message.success('保存成功')
        this.complete(param)
        this.close()
      }, 0)
      // Api.setOrderConfig(param).then((data) => {
      //   this.close()
      // }).catch(err => console.log(err))
    },
    cancel () {
      this.close()
    }
  }
}
</script>
<style lang="stylus">
.unitForm
  min-height 80px
</style>
