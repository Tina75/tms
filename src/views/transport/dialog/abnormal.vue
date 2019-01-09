<template>
  <Modal v-model="show" :mask-closable="false" transfer class="transport-detail" width="1100"  @on-visible-change="close">
    <p slot="header" style="text-align:center">
      上报异常
    </p>

    <div>
      <Row class="abnormal-header">
        <i-col span="7">
          {{ (details.billType === 1 ? '提货单号：' : (details.billType === 2 ? '外转单号：' : '运单号：')) + details.billNo }}
        </i-col>
        <i-col span="8">
          {{ (details.billType === 2 ? '外转方：' : '承运商：') + details.carrierName }}
        </i-col>
        <i-col span="9">
          车牌号：{{ details.carNo || '-' }}
        </i-col>
      </Row>
    </div>

    <div class="part">
      <Row class="detail-field-group" style="margin-bottom: 10px">
        <i-col span="7" style="margin-right: 15px;">
          <span class="detail-field-title-sm detail-field-required">异常环节：</span>
          <Select v-model="abnormalTiming" style="width:160px" transfer @on-change="handleChangeLinks">
            <Option v-for="item in abnormalTimings" :value="item.abnormalTiming" :key="item.abnormalTiming">{{ item.abnormalTimingDesc }}</Option>
          </Select>
        </i-col>
        <i-col span="7" style="margin-right: 15px;">
          <span class="detail-field-title-sm detail-field-required">异常类型：</span>
          <Select v-model="abnormalTypeCode" style="width:160px" transfer>
            <Option v-for="item in abnormalTypeCodes" :value="item.abnormalTypeCode" :key="item.abnormalTypeCode">{{ item.abnormalTypeDesc }}</Option>
          </Select>
        </i-col>
        <i-col span="9">
          <span class="detail-field-title-sm detail-field-required" style="width: 125px;">是否修改运费：</span>
          <RadioGroup v-model="isChangeFee" class="abnormal-radio" @on-change="handleCheckFee">
            <Radio :label="1" style="margin-right: 35px;">是</Radio>
            <Radio :label="2">否</Radio>
          </RadioGroup>
        </i-col>
      </Row>

      <div v-if="details.billType === 3">
        <send-fee
          v-if="isChangeFee === 1"
          ref="sendFee"
          :payment="payment"
          :settlement-pay-info="settlementPayInfo"
          :send-way="sendWay"
          :is-disabled="isDisabled"
          :abnormal-length="details.abnormalPayInfos.length"
          :allocation-type="allocationStrategy"
          :order-cnt="details.orderCnt"
          source="abnormal">
        </send-fee>
      </div>
      <div v-else>
        <pickup-fee
          v-if="isChangeFee === 1"
          ref="pickupFee"
          :payment="payment"
          :settlement-pay-info="settlementPayInfo"
          :send-way="sendWay"
          :is-disabled="isDisabled"
          :abnormal-length="details.abnormalPayInfos.length"
          :allocation-type="allocationStrategy"
          :order-cnt="details.orderCnt"
          source="abnormal"></pickup-fee>
      </div>

      <div v-if="isChangeFee === 1 && canUpdateFee === 2 && (changeFeeType === 0 || changeFeeType === 2)" class="err-message">存在多个异常记录未处理，只能修改最后一次上报的异常记录的运费。</div>

      <Row class="detail-field-group" style="margin: 25px 0 10px;">
        <i-col span="24" class="exception-distribution">
          <span class="detail-field-title-sm" style="vertical-align: unset;padding-left: 8px;width: 90px;line-height: 1.6;">异常描述：</span>
          <!-- <Input :autosize="{minRows: 3, maxRows: 5}" :maxlength="500" type="textarea"></Input> -->
          <div style="width: calc(100% - 80px);">
            <Input v-model="details.abnormalDesc" :autosize="{minRows: 3, maxRows: 5}" :maxlength="500" type="textarea"></Input>
            <p style="color: #999;font-family:PingFangSC-Regular;font-weight:400;line-height: 40px;">注意：问题描述最多输入500个汉字</p>
          </div>
        </i-col>
      </Row>

      <Row class="detail-field-group" style="margin-bottom: 10px">
        <i-col span="24" class="exception-distribution">
          <span class="detail-field-title-sm" style="vertical-align: unset;padding-left: 8px;width: 90px;line-height: 1.6;">图片上传：</span>
          <div style="width: 100%;">
            <up-load ref="upLoads" :multiple="true" max-size="10"></up-load>
            <p style="color: #999;font-family:PingFangSC-Regular;font-weight:400;line-height: 1.2;">图片格式必须为jpeg、jpg、gif、png，且最多上传6张，每张不能超过10MB！</p>
          </div>
        </i-col>
      </Row>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button :loading="btnLoading" type="primary" @click="submit">确认</Button>
      <Button type="default" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import TagNumberInput from '@/components/TagNumberInput'
import Server from '@/libs/js/server'
import SendFee from '../components/SendFee'
import PickupFee from '../components/PickupFee'
import UpLoad from '@/components/upLoad/index.vue'
import float from '@/libs/js/float'
// import { ABNORMAL_TYPE_CODES } from '../constant/abnormal.js'
import _ from 'lodash'
import { divideFee } from '@/libs/js/config'
export default {
  name: 'SendCar',
  components: { TagNumberInput, UpLoad, PickupFee, SendFee },
  mixins: [ BaseDialog ],
  data () {
    return {
      show: true,
      loading: false,
      payment: {
        freightFee: 0,
        loadFee: 0,
        unloadFee: 0,
        insuranceFee: 0,
        otherFee: 0,
        tollFee: 0,
        totalFee: 0,
        accommodation: 0 // 住宿费 v1.08 新增
      },
      clonePayment: {}, // 复制一份费用数据，用来比较有没有修改费用
      // settlementType: '1',
      settlementPayInfo: [],
      cloneSettlementPayInfo: [], // 复制一份多段付费用数据，用来比较有没有修改多段付
      details: {}, // 详情信息
      abnormalTiming: '', // 异常环节编码
      abnormalTimings: [],
      abnormalTypeCode: '', // 异常类型编码
      abnormalTypeCodes: [],
      isChangeFee: 0, // 是否修改运费
      // abnormalDesc: '', // 异常描述
      fileUrls: [], // 图片url列表
      isDisabled: false,
      changeFeeType: 0, // 0 可以修改运费 10 已对账 11 已核销 2 部分修改运费
      canUpdateFee: 0, // 判断多条异常记录只有最后一条可以修改运费
      sendWay: '1',
      btnLoading: false,
      allocationStrategy: 1 // 分摊策略 默认按订单数分摊 v1.08新增
    }
  },

  created () {
    this.settlementPayInfo = this.type === 3 ? [
      { payType: 1, fuelCardAmount: '', cashAmount: '', isCardDisabled: 0, isCashDisabled: 0 },
      { payType: 2, fuelCardAmount: '', cashAmount: '', isCardDisabled: 0, isCashDisabled: 0 },
      { payType: 3, fuelCardAmount: '', cashAmount: '', isCardDisabled: 0, isCashDisabled: 0 },
      { payType: 4, fuelCardAmount: '', cashAmount: '', isCardDisabled: 0, isCashDisabled: 0 }
    ] : [
      { payType: 2, fuelCardAmount: '', cashAmount: '', isCardDisabled: 0, isCashDisabled: 0 }
    ]
    this.fetchData()
  },

  methods: {
    // 查询数据
    fetchData () {
      const _this = this
      _this.loading = true
      const data = {}
      if (_this.recordId) {
        data.recordId = _this.recordId
      } else {
        data.billId = _this.id
        data.billType = _this.type
      }
      Server({
        url: '/abnormal/report/page',
        method: 'post',
        data: data
      }).then(res => {
        _this.details = res.data.data
        // 分摊策略
        this.allocationStrategy = _this.details.allocationStrategy
        // 派车类型
        this.sendWay = _this.details.assignCarType.toString()

        this.autoAbnormalLinks('selected', 1) // 自动带出selected=1的异常环节,和selected=1的异常类型

        _this.canUpdateFee = _this.details.canUpdateFee // 多条异常记录只有最后一条可以修改运费
        _this.isChangeFee = _this.details.updateFee // 判断是否修改运费radio初始状态

        // 编辑异常需要带出上次上传的图片
        if (_this.details.fileUrls.length > 0) {
          let fileUrls = []
          _this.details.fileUrls.map((item) => {
            fileUrls.push({
              url: item,
              progress: 1
            })
          })
          _this.$refs.upLoads.uploadImgList = fileUrls
        }

        for (let key in _this.payment) {
          _this.payment[key] = _this.setMoneyUnit2Yuan(_this.details[key])
        }

        if (this.type !== 3) {
          delete this.payment.tollFee // 去掉路桥费
          delete this.payment.accommodation // 去掉住宿费
        }
        // this.settlementType = billInfo.settlementType ? billInfo.settlementType.toString() : '1'
        // 将收费信息中的金额单位转为元
        let temp = _this.settlementPayInfo.map((item, i) => {
          if (!_this.details.abnormalPayInfos[i]) return item // 后台只返回预付、到付、回付有的那一项数据，前端需要都展示，保持数据同步
          else {
            const temp = _this.details.abnormalPayInfos[i]
            temp.fuelCardAmount = _this.setMoneyUnit2Yuan(temp.fuelCardAmount)
            temp.cashAmount = _this.setMoneyUnit2Yuan(temp.cashAmount)
            return Object.assign(item, temp)
          }
        })
        _this.settlementPayInfo = temp

        _this.clonePayment = _.cloneDeep(_this.payment)
        _this.cloneSettlementPayInfo = _.cloneDeep(_this.settlementPayInfo)

        _this.handleChangeLinks(_this.abnormalTiming) // 默认自动填充第一条环节对应的异常类型,和多段支付联动
        _this.handleCheckFee(_this.isChangeFee)

        _this.loading = false
      }).catch(err => {
        throw err
      })
    },

    // 自动带出selected=1的异常环节,和selected=1的异常类型
    autoAbnormalLinks (key, value) {
      const _this = this
      _this.abnormalTimings = _this.details.abnormalLinks
      let abnormalLink = _.find(_this.abnormalTimings, [key, value])
      _this.abnormalTiming = abnormalLink.abnormalTiming // 默认自动选择selected=1的项
      _this.abnormalTypeCodes = abnormalLink.abnormalTypes // 带出selected=1的项的异常类型列表
      let abnormalType = _.find(_this.abnormalTypeCodes, ['selected', 1])
      if (abnormalType) {
        _this.abnormalTypeCode = abnormalType.abnormalTypeCode // 带出selected=1的项的异常类型列表对应selected=1的值
      } else {
        _this.abnormalTypeCode = _this.abnormalTypeCodes[0].abnormalTypeCode
      }
    },

    // 检查是否可修改运费
    handleCheckFee (val) {
      const _this = this
      if (val === 1) {
        const data = {
          billId: _this.id,
          billType: _this.type
        }
        // if (this.recordId) {
        //   data.recordId = this.recordId
        // } else {
        //   data.billId = this.id
        // }
        Server({
          url: '/abnormal/check/update/fee',
          method: 'post',
          data: data
        }).then(res => {
          _this.changeFeeType = res.data.data.status
          if (_this.changeFeeType === 0) {
            _this.checkUpdateFee()
          } else if (_this.changeFeeType === 20) {
            _this.$Message.warning('此单运费已核销，不能修改')
            _this.canotChangeFee()
          } else if (_this.changeFeeType === 10) {
            _this.$Message.warning('此单已经加入对账单，运费不能修改')
            _this.canotChangeFee()
          } else if (_this.changeFeeType === 2) {
            if (_this.canUpdateFee === 2) {
              // this.$Message.warning('多条异常记录只有最后一条可以修改运费')
              _this.canotChangeFee()
            } else {
              let statusDetail = res.data.data.statusDetail
              // 校验多段付哪些部分已核销，修改payInfo组件赋值
              _this.settlementPayInfo.map((item, i) => {
                if (item.payType === 1) {
                  item.isCardDisabled = statusDetail.prepaidFuel
                  item.isCashDisabled = statusDetail.prepaidCash
                }
                if (item.payType === 2) {
                  item.isCardDisabled = statusDetail.arrivePaidFuel
                  item.isCashDisabled = statusDetail.arrivePaidCash
                }
                if (item.payType === 3) {
                  item.isCardDisabled = statusDetail.receiptPaidFule
                  item.isCashDisabled = statusDetail.receiptPaidCash
                }
                if (item.payType === 4) {
                  item.isCardDisabled = statusDetail.tailPaidFule
                  item.isCashDisabled = statusDetail.tailPaidCash
                }
              })
            }
          }
        }).catch(err => {
          throw err
        })
      }
    },

    // 多条异常记录只有最后一条可以修改运费
    checkUpdateFee () {
      if (this.canUpdateFee === 2) {
        // this.$Message.warning('多条异常记录只有最后一条可以修改运费')
        this.canotChangeFee()
      }
    },

    // 不能修改运费的情况下，输入框置灰
    canotChangeFee () {
      this.isDisabled = true
      this.settlementPayInfo.map((item) => {
        item.isCardDisabled = true
        item.isCashDisabled = true
      })
    },

    // 异常环节修改后，异常类型联动
    handleChangeLinks (val) {
      this.autoAbnormalLinks('abnormalTiming', val)
    },

    // 提交
    submit () {
      const _this = this
      // if (!_this.validate()) return
      if (_this.isChangeFee !== 2 && (_this.changeFeeType === 0 || _this.changeFeeType === 2) && _this.canUpdateFee === 1) {
        if (this.type === 3) {
          _this.wayBillAbnormal()
        } else {
          _this.pickUpAbnormal()
        }
      } else {
        _this.doSubmit()
      }
    },

    // 提货单上报异常
    pickUpAbnormal () {
      const _this = this
      if (!_this.$refs.pickupFee.validate()) return
      if (_this.isChangeSubmitFee()) {
        _this.confirmToast()
      } else {
        _this.doSubmit()
      }
    },

    // 运单上报异常
    wayBillAbnormal () {
      const _this = this
      if (!_this.$refs.sendFee.validate()) return
      if (_this.isChangeSubmitFee()) {
        _this.confirmToast()
      } else {
        _this.doSubmit()
      }
    },

    confirmToast () {
      const _this = this
      _this.$Toast.confirm({
        title: '提示',
        content: '<p>费用未修改，是否保存？</p>',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          _this.doSubmit()
        },
        onCancel: () => {
          // 将payment 设置为初始值
          for (let key in _this.clonePayment) {
            // _this.clonePayment[key] / 100
            _this.clonePayment[key] = divideFee(_this.clonePayment[key])
          }
        }
      })
    },

    // 创建异常单
    doSubmit () {
      const z = this
      z.btnLoading = true
      let fileUrls = []
      z.$refs.upLoads.uploadImgList.map((item) => {
        fileUrls.push(item.url)
      })
      let tableData = []
      if (z.details.abnormalPayInfos.length > 0) {
        if (z.isChangeFee === 1) {
          tableData = z.type === 3 ? z.$refs.sendFee.getSettlementPayInfo() : z.$refs.pickupFee.getSettlementPayInfo()
        } else {
          z.cloneSettlementPayInfo.map((item, i) => {
            tableData.push({
              payType: item.payType,
              cashAmount: float.round(item.cashAmount * 100 || 0),
              fuelCardAmount: float.round(item.fuelCardAmount * 100 || 0)
            })
          })
        }
      } else {
        tableData = []
      }
      let data = {
        ...z.formatMoney(),
        fileUrls: fileUrls,
        abnormalPayInfos: tableData,
        abnormalTiming: z.abnormalTiming,
        abnormalTypeCode: z.abnormalTypeCode,
        abnormalDesc: z.details.abnormalDesc,
        updateFee: z.isChangeSubmitFee() ? 2 : 1,
        assignCarType: z.details.assignCarType
      }
      if (z.recordId) {
        data.recordId = this.recordId
      } else {
        data.billId = z.id
        data.billType = z.type
      }
      Server({
        url: z.recordId ? '/abnormal/update' : '/abnormal/create',
        method: 'post',
        data: data
      }).then(res => {
        z.btnLoading = false
        z.complete()
        z.close()
        if (res.data.data <= 0) {
          z.openAbnormalSuccessDialog()
        } else {
          z.$Message.success(z.recordId ? '编辑成功' : '创建成功')
        }
      }).catch(() => {
        z.btnLoading = false
      })
    },

    // 如果是修改运费状态，提交时需判断有没有修改运费
    isChangeSubmitFee () {
      const z = this
      if (z.isChangeFee === 2) return false
      for (let key in z.clonePayment) {
        if (typeof z.clonePayment[key] === 'number') {
          z.clonePayment[key] = float.round(z.clonePayment[key] * 100)
        } else {
          z.clonePayment[key] = 0
        }
      }
      if (z.details.abnormalPayInfos.length > 0) {
        let cloneTableData = []
        z.cloneSettlementPayInfo.map((item, i) => {
          cloneTableData.push({
            payType: item.payType,
            fuelCardAmount: float.round(item.fuelCardAmount * 100) || void 0,
            cashAmount: float.round(item.cashAmount * 100) || void 0
          })
        })
        if (z.type === 3) {
          if (z.sendWay === '1') {
            delete z.clonePayment.accommodation // 外转去掉住宿费
          }
          return _.isEqual(z.$refs.sendFee.formatMoney(), z.clonePayment) && _.isEqual(cloneTableData, z.$refs.sendFee.getSettlementPayInfo()) // 费用输入框和多段付
        } else {
          return _.isEqual(z.$refs.pickupFee.formatMoney(), z.clonePayment) && _.isEqual(cloneTableData, z.$refs.pickupFee.getSettlementPayInfo()) // 费用输入框和多段付
        }
      } else {
        if (z.type === 3) {
          if (z.sendWay === '1') {
            delete z.clonePayment.accommodation // // 外转去掉住宿费
          }
          return _.isEqual(z.$refs.sendFee.formatMoney(), z.clonePayment)
        } else {
          return _.isEqual(z.$refs.pickupFee.formatMoney(), z.clonePayment)
        }
      }
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      return (typeof money === 'number' && money !== 0) ? divideFee(money) : null
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp
      if (this.isChangeFee === 2) {
        temp = Object.assign({}, this.clonePayment)
        for (let key in temp) {
          if (typeof temp[key] === 'number') {
            temp[key] = float.round(temp[key] * 100)
          } else {
            temp[key] = 0
          }
        }
      } else {
        if (this.type === 3) {
          temp = Object.assign({}, this.$refs.sendFee.formatMoney())
        } else {
          temp = Object.assign({}, this.$refs.pickupFee.formatMoney())
        }
      }
      return temp
    },

    // 上报异常成功跳转弹窗
    openAbnormalSuccessDialog () {
      const self = this
      self.openDialog({
        name: 'transport/dialog/abnormalSuccess',
        data: {},
        methods: {
          complete () {
            // self.clearSelectedAndFetch()
          }
        }
      })
    }
  }
}

</script>
<style lang='stylus'>
 @import "../style/detail.styl"

  .part

    .ivu-form-item-label
      color #777
      font-size 14px

    .detail-payment-way
      width calc(100% - 100px) !important
    .row-fee
      display flex
      display: -ms-flexbox;
      justify-content space-between
      -ms-flex-pack justify
      align-items center
      -ms-flex-align center
      margin-bottom 10px
      .ivu-form-item-label
        padding 10px 0
        text-align center
      .require-fee
        .ivu-form-item-label
          text-align left
    .waizhuan-label
      width 300px
      .ivu-form-item-label
        width 82px !important
        padding-right 0
      .ivu-form-item-content
        margin-left 82px !important
  .abnormal-header
      font-size 14px
      font-family 'PingFangSC-Regular'
      font-weight 400
      color rgba(47,50,62,1)
      line-height 20px
      padding 10px 20px 35px
      border-bottom 1px dashed #ddd
  .abnormal-radio
    .ivu-radio-wrapper
      vertical-align top
      .ivu-radio
        margin-right 16px
  .exception-distribution
    display: flex
    display: -ms-flexbox
</style>
<style lang='stylus' scoped>
  .part
    padding 27px 0 20px 12px
    &:last-child
      border-style none
      padding-bottom 10px
  .err-message
    color #EC4E4E
    font-size 14px
    font-family 'PingFangSC-Regular'
    margin-left 72px
    margin-top -15px
  .ivu-col-span-6
    height 68px
</style>
