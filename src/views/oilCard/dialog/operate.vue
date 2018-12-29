<!--停用启用弹窗-->
<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="560" @on-visible-change="close">
    <p slot="header" class="modalTitle">{{ title }}</p>
    <Form ref="validate" :model="operate" :rules="ruleValidate" :label-width="90" label-position="right">
      <FormItem label="备注:">
        <Input :maxlength="100" v-model="operate.remark" type="textarea" placeholder="请输入"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="footerSty">
      <Button :loading="loading" type="primary" @click="save()">确定</Button>
      <Button style="margin-left: 8px" @click="close()">取消</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
export default {
  name: 'operate',
  components: {
  },
  mixins: [BaseDialog],
  data () {
    return {
      loading: false,
      operate: {
        idList: [],
        type: null, // 1停用，2启用
        remark: ''
      },
      ruleValidate: {}
    }
  },
  mounted () {
    console.log(this.ok())
  },
  methods: {
    save () {
      this.loading = true
      let _this = this
      Server({
        url: '/oilCard/operate',
        method: 'post',
        data: _this.operate
      }).then(res => {
        _this.loading = false
        _this.close()
        if (!res.data.data) {
          _this.$Message.success(res.data.msg)
        } else if (res.data.data.invalidNumberList) {
          if (res.data.data.invalidNumberList.length === 1) {
            if (_this.operate.operate.type === 1) this.$Message.error('只有未分配状态的油卡才可以停用。')
            else _this.$Message.error('只有停用状态的油卡才可以启用。')
          } else if (res.data.data.invalidNumberList.length > 1) {
            _this.tipDialog(res.data.data.invalidNumberList)
          }
        }
        _this.ok()
      }).catch(err => {
        _this.loading = false
        console.log(err)
      })
    },
    tipDialog (invalidNumberList) {
      // this.ok()
      let str = ''
      if (this.operate.operate.type === 1) str = '以下油卡因为状态不是未分配不能停用'
      else str = '以下油卡因为状态不是停用不能启用'
      this.$Toast.warning({
        title: '操作提示',
        content: str,
        render: (h) => {
          const list = invalidNumberList.map(item => {
            return h('p', item)
          })
          return h('div', [
            ...list
          ])
        },
        okText: '确认',
        cancelText: '取消',
        onOk () {
          this.ok()
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
  .modalTitle
    text-align center
    font-weight bold
    font-size 14px
  .radioSty
    margin-left 35px
  .moneyFormSpan
    font-size 14px
    color #00A4BD
    font-weight 500
</style>
