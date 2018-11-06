<template>
  <Modal v-model="show" :mask-closable="false" @on-visible-change="close">
    <p slot="header" style="text-align:center">
      处理异常
    </p>
    <p style="text-align: center; font-size: 14px"><Icon type="ico-ask" style="font-size: 20px;color: #FFBB44;vertical-align: bottom;" />是否确定已处理该异常</p>
    <div style="width: 100%; margin: 10px">
      <Input v-model="errorMsg" :autosize="{minRows: 3, maxRows: 5}" :maxlength="500" type="textarea" placeholder="请填写备注信息（非必填）"></Input>
    </div>
    <div slot="footer" style="text-align: center;">
      <Button type="primary" @click="submit">确认</Button>
      <Button type="default" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
export default {
  name: 'errorDialog',
  mixins: [ BaseDialog ],
  data () {
    return {
      show: true,
      errorMsg: ''
    }
  },
  methods: {
    submit () {
      const data = {
        recordId: this.id,
        disposeDesc: this.errorMsg
      }
      Server({
        url: '/abnormal/dispose',
        method: 'post',
        data
      }).then(res => {
        this.close()
        this.complete()
      })
    }
  }
}
</script>
