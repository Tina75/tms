<template>
  <Modal v-model="visiable" :mask-closable="false" width="440" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">{{title}}</p>
    <br>
    <b class="dialog-title">您当前账户将于<a>{{expirationTime | datetime('yyyy-MM-dd')}}</a>到期，到期后如需继续使用，请联系我们咨询购买。</b>

    <p class="i-mt-40">购买软件后，您即可享受以下保障：</p>
    <ol class="dialog-content">
      <li>更强大、更稳定的运输管理功能</li>
      <li>物流专家一对一的服务支持</li>
      <li>技术工程师24小时待命确保售后无忧</li>
    </ol>
    <div class="dialog-footer">
      使用咨询、购买洽谈，请联系我们
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
