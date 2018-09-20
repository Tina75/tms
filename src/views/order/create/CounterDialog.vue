<template>
  <Modal v-model="visibale" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">计费规则</p>
    <Form ref="counterForm" :model="counterForm" :label-width="80">
      <FormItem label="计费规则" prop="rule">
        <Select v-model="counterForm.rule">
          <Option value="1">暂无数据</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer" class="van-center">
      <Button  type="primary"  @click="save">确定</Button>
      <Button  type="default"  @click.native="visibale = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  mixins: [BaseDialog],
  data () {
    return {
      counterForm: {
        rule: ''
      },
      visibale: true
    }
  },
  methods: {
    save () {
      this.visibale = false
      this.ok(this.counterForm.rule)
    }
  }
}
</script>
