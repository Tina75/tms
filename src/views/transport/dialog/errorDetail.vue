<template>
  <Modal v-model="show" :mask-closable="false" @on-visible-change="close">
    <p slot="header" style="text-align:center">
      处理异常
    </p>

    <p style="padding-left: 8px;"><Icon type="ios-alert" style="font-size: 20px;color: #FFBB44;vertical-align: bottom;" />是否确定已处理该异常</p>
    <Row class="detail-field-group" style="margin: 25px 0 10px;">
      <i-col span="24" style="display: flex;">
        <span class="detail-field-title-sm" style="vertical-align: unset;padding-left: 8px;width: 90px;line-height: 1.6;">异常描述：</span>
        <div style="width: 100%;">
          <Input v-model="errorMsg" :autosize="{minRows: 3, maxRows: 5}" :maxlength="500" type="textarea"></Input>
          <p style="color: #999;font-family:PingFangSC-Regular;font-weight:400;line-height: 40px;">注意：问题描述最多输入500个汉字</p>
        </div>
      </i-col>
    </Row>
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
