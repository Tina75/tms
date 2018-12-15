<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="524" @on-visible-change="onCancel">
    <p slot="header" style="text-align:center">试用期数据删除</p>
    <div class="clear-trial__declaration">
      贵公司账号的试用期为<b>{{beginTime | datetime}} ~ {{endTime | datetime}}</b>，为减少试用数据的干扰，您可选择删除试用期相关数据。请谨慎选择需要删除的试用期数据，数据删除后不可恢复
    </div>
    <Form ref="info" :model="info" :rules="rules" class="clear-trial__form i-mt-25">
      <FormItem prop="name">
        <CheckboxGroup v-model="info.types">
          <Checkbox label="1" class="clear-trial__checkbox">
            <div class="clear-trial__checkbox-content">
              <strong>订单相关数据</strong>
              <p>订单相关的订单、运单、财务、报表等数据</p>
            </div>
          </Checkbox>
          <Checkbox label="2" class="clear-trial__checkbox">
            <div class="clear-trial__checkbox-content">
              <strong>发货方数据</strong>
              <p>客户管理中维护的发货方数据</p>
            </div>
          </Checkbox>
          <Checkbox label="3" class="clear-trial__checkbox">
            <div class="clear-trial__checkbox-content">
              <strong>承运商数据</strong>
              <p>承运商管理中维护的承运商数据</p>
            </div>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button :loading="loading" type="primary" @click="onSave">确定</Button>
      <Button type="default" @click.native="onCancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
/**
 * 清除试用期脏数据
 */
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
export default {
  name: 'clear-trial-data',
  mixins: [BaseDialog],
  data () {
    return {
      beginTime: null,
      endTime: null,
      content: '',
      info: { types: [] },
      loading: false,
      rules: {
        types: { required: true, message: '请选择需要删除的数据' }
      }
    }
  },
  methods: {
    onSave () {
      const vm = this
      this.$refs['info'].validate((valid) => {
        if (valid) {
          vm.loading = true
          Server({
            url: 'message/clearUserLitterInfo',
            method: 'post',
            data: {
              types: vm.info.types,
              endTime: vm.endTime,
              beginTime: vm.beginTime
            }
          })
            .then((resp) => {
              if (resp.code === 10000) {
                this.$Message.success('数据删除成功!')
                vm.ok()
                vm.close()
              }
              vm.loading = false
            })
            .catch((error) => {
              vm.loading = false
              throw error
            })
        }
      })
    },
    onCancel () {
      this.cancel()
      this.close()
    }
  }

}

</script>
<style lang='stylus' scoped>
.clear-trial
  &__declaration
    font-size 14px
    padding-bottom 22px
    word-break break-all
    border-bottom 1px dashed #D8DADE
  &__form
    font-size 14px
  &__checkbox
    display table
  &__checkbox-content
    display table-cell
    padding-left 18px
    vertical-align bottom
    strong
      color #333333
      font-size 16px
      font-weight 500
    p
      font-size 14px
      color #666
</style>
