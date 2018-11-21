<template>
  <div class="dialog">
    <Modal v-model="visiable" :mask-closable="false" transfer class="receipt-upload-dialog" width="970" @on-visible-change="close">
      <p slot="header" class="dialog-title">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>{{name + '回单照片'}}</span>
      </p>
      <div class="receipt-upload-content">
        <Row style="padding-bottom: 20px;">
          <i-col span="12">
            <span class="label">订单号：</span>
            <span class="value">{{ params.orderNo }}</span>
          </i-col>
          <i-col span="12">
            <span class="label">客户单号：</span>
            <span class="value">{{ params.customerOrderNo || '-' }}</span>
          </i-col>
        </Row>
        <Row style="padding-bottom: 38px;border-bottom: 1px dashed #CBCED3;margin-bottom: 39px;">
          <i-col span="12">
            <span class="label">客户名称：</span>
            <span class="value">{{ params.consignerName }}</span>
          </i-col>
          <i-col span="12">
            <span class="label">订单线路：</span>
            <span class="value">{{ params.startName + ' —— ' + params.endName }}</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="24" class="tip-text">
            <span class="label">{{ name + '回单照片：' }}</span>
            <div>
              <up-load ref="upLoads" :multiple="true" max-size="10" max-count="10"></up-load>
              <p class="value" style="color: #999;margin-top: 17px;">图片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过10MB！</p>
            </div>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button :disabled="imgList.length <= 0" type="primary"  @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import UpLoad from '@/components/upLoad/index.vue'
export default {
  name: 'uploadOrUpdate',

  components: { UpLoad },

  mixins: [BaseDialog],
  data () {
    return {
      imgList: []
    }
  },

  mounted: function () {
    const _this = this
    // 修改回单照片需要带出上次上传的图片
    if (_this.params.receiptOrder.receiptUrl.length > 0) {
      _this.params.receiptOrder.receiptUrl.map((item) => {
        _this.imgList.push({
          url: item,
          progress: 1
        })
      })
    }
    _this.$refs.upLoads.uploadImgList = _this.imgList
  },

  methods: {
    save () {
      let fileUrls = []
      this.$refs.upLoads.uploadImgList.map((item) => {
        fileUrls.push(item.url)
      })
      Server({
        url: 'order/updateReceiptOrderPhotoUrl',
        method: 'post',
        data: {
          id: this.params.receiptOrder.id,
          receiptUrl: fileUrls
        }
      }).then(() => {
        this.ok()
        this.close()
        this.$Message.success('回单照片' + this.name + '成功')
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.dialog-title
  text-align center
  font-size 16px
  font-family 'PingFangSC-Medium'
  font-weight 700
  color rgba(47,50,62,1)
.receipt-upload-content
  font-size 14px
  font-family 'PingFangSC-Regular'
.tip-text
  display: flex;
  display -ms-flexbox
.label
  display inline-block
  width 100px
  height 20px
  line-height 20px
  color #777
.value
  color #333
</style>
<style lang='stylus'>
.receipt-upload-dialog
  .ivu-modal-body
    padding 39px 51px 56px
</style>
