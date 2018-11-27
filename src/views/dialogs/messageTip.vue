<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="400" @on-visible-change="close">
    <p slot="header" style="text-align:center">提示</p>
    <div class="modal-content">
      <p>
        尊敬的用户，您好：
      </p>
      <div v-if="isTryout" class="modal-indent">
        <p v-if="maxNumber === current">
          您当前试用账号的短信发送条数已达到上限{{maxNumber}}条，若需继续使用，请开通正式版，享受更多权益。
        </p>
        <p v-else>
          您当前试用账号的短信发送条数已达到{{current}}条，还有{{leftNumber}}条就达到上限，若需继续使用，请开通正式版，享受更多权益。
        </p>
      </div>
      <div else class="modal-indent">
        <p v-if="maxNumber === current">
          您当前账号的短信发送条数已达到上限{{maxNumber}}条，若需继续使用，请联系客服咨询。
        </p>
        <p v-else>
          您当前账号的短信发送条数已达到{{current}}条，还有{{leftNumber}}条就达到上限，若需继续使用，请联系客服咨询。
        </p>
      </div>
    </div>
    <div slot="footer">
      <Button  type="primary"  @click="save">知道了</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'demo-dialog1',
  mixins: [BaseDialog],
  data () {
    return {
      isTryout: false,
      maxNumber: 50,
      current: 45
    }
  },
  computed: {
    leftNumber () {
      return this.maxNumber - this.current
    }
  },
  methods: {
    save () {
      this.close()
    }
  }

}

</script>
<style lang='stylus' scoped>
.modal-content
  font-size 14px
.modal-indent
  text-indent 2em
</style>
