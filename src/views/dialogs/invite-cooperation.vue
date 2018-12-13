<template>
  <Modal v-model="visiable" :mask-closable="false" transfer class="invite-cooperation" width="514" @on-visible-change="close">
    <div class="invite-cooperation__modal">
      <div class="invite-cooperation__title">
        接受邀请，您就可以在线承接订单啦~
      </div>
      <div class="invite-cooperation__content">
        <div class="invite-cooperation__content-detail">
          <!-- 【南京奋斗物流公司】的孙老板（13585112134）邀请您进行线上合作，直接从系统指派订单给贵公司运输，以便提高运作效率。 -->
          {{content}}
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button  :loading="loading" type="primary"  @click="save">接受</Button>
      <Button  type="default"  @click.native="cancel">拒绝</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
export default {
  name: 'invite-cooperation',

  mixins: [BaseDialog],
  data () {
    return {
      phone: '',
      content: '',
      loading: false
    }
  },
  methods: {
    /**
     * 同意邀请
     */
    async save () {
      try {
        this.loading = true
        // status: 1:同意；2：拒绝
        await this.handleInviteMessage({ status: 1, phone: this.phone })
        this.loading = false
        this.ok()
        this.close()
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    /**
     * 拒绝邀请合作
     */
    async cancel () {
      await this.handleInviteMessage({ status: 2, phone: this.phone })
      this.close()
    },
    async handleInviteMessage (data) {
      try {
        const result = await Server({
          url: 'message/inviteMessageDeal',
          method: 'post',
          data
        })
        return result
      } catch (error) {
        throw error
      }
    }
  }

}

</script>
<style lang='stylus' scoped>
.invite-cooperation
  font-size 14px
  &__modal
    margin-top 90px
  &__title
    margin 0 20px 50px 93px
    color #ffffff
  &__content
    margin-top 95px
    margin-bottom 20px
</style>
<style lang="stylus">
.invite-cooperation
  .ivu-modal-body
    border-radius 6px
    background url("../../assets/invite.png") no-repeat top center
    background-size 514px 200px
  .ivu-icon-ios-close
    color #fff
</style>
