<template>
  <Modal v-model="visiable" :mask-closable="false" width="440" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">{{title}}</p>
    <br>
    <b class="dialog-title">本版本将于<a>{{expirationTime | datetime}}</a>到期，到期后您将无法使用本软件</b>

    <p class="i-mt-40">您可以选择延长使用本软件，延长之后，您将拥有如下权益：</p>
    <ol class="dialog-content">
      <li>软件的使用期限将增加365天</li>
      <li>将有专人为您提供服务</li>
      <li>系统更加稳定</li>
    </ol>
    <div class="dialog-footer">
      如需延长有效期，请联系客服
      <p><a ><i class="icon font_family icon-ico-call"></i>025-66606056</a></p>
    </div>
    <div slot="footer" style="text-align:center">
      <Button  type="primary"  @click.native="close">我知道了</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'renew',
  mixins: [BaseDialog],
  data () {
    return {
      info: { name: '', phone: '' },
      rules: {
        name: { required: true, message: '请填写姓名', trigger: 'blur' },
        phone: { required: true, message: '请填写手机号', trigger: 'blur' }
      }
    }
  },
  methods: {
    save () {
      this.$refs['info'].validate((valid) => {
        if (valid) {
          // Server({
          //   url: 'user/update',
          //   method: 'post',
          //   data: this.info
          // }).then(() => {
          this.ok()
          this.close()
          // })
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog-title
  font-size 14px
.dialog-content
  font-size:12px;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:17px;
  background:rgba(249,249,249,1);
  border-radius:8px;
  margin-top 15px
  padding 10px
  li
    margin-left 15px
    line-height 2
.dialog-footer
  text-align center
  margin-top 30px
  color rgba(153,153,153,1);
  a
    font-size 20px
    font-weight 500
    .icon-ico-call
      font-size 22px
</style>
