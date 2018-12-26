<template>
  <Modal v-model="visiable" :mask-closable="false" transfer @on-visible-change="close" >
    <p slot="header" style="text-align:center">批量导入</p>
    <Upload multiple type="drag" action="url">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>将文件拖至此处，或<a>点击导入</a></p>
      </div>
    </Upload>
    <div slot="footer">
      <Button :href="downLoadUrl" type="primary">下载模板</Button>
      <Button style="margin-left: 8px" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'batch-import',
  mixins: [BaseDialog],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
