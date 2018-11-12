<template>
  <Modal v-model="show" :mask-closable="false" class="transport-detail" width="980"  @on-visible-change="close">
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
          <Select v-model="abnormalTiming" style="width:160px" @on-change="handleChangeLinks">
            <Option v-for="item in abnormalTimings" :value="item.abnormalTiming" :key="item.abnormalTiming">{{ item.abnormalTimingDesc }}</Option>
          </Select>
        </i-col>
        <i-col span="7" style="margin-right: 15px;">
          <span class="detail-field-title-sm detail-field-required">异常类型：</span>
          <Select v-model="abnormalTypeCode" style="width:160px">
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

      <div v-if="isChangeFee === 1" class="detail-field-group row-fee">
        <div>
          <span class="detail-field-title-sm detail-field-required">{{ details.billType === 2 ? '外转运费：' : '运输费：' }}</span>
          <MoneyInput v-model="payment.freightFee" :is-disabled="isDisabled" class="detail-payment-input" />
          <!-- <a class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a> -->
        </div>
        <div v-if="details.billType !== 2">
          <span class="detail-field-title-sm" style="width: 70px;">装货费：</span>
          <MoneyInput v-model="payment.loadFee" :is-disabled="isDisabled" class="detail-payment-input" />
        </div>
        <div v-if="details.billType !== 2">
          <span class="detail-field-title-sm" style="width: 70px;">卸货费：</span>
          <MoneyInput v-model="payment.unloadFee" :is-disabled="isDisabled" class="detail-payment-input" />
        </div>
        <div v-if="details.billType !== 2">
          <span class="detail-field-title-sm" style="width: 70px;">保险费：</span>
          <MoneyInput v-model="payment.insuranceFee" :is-disabled="isDisabled" class="detail-payment-input" />
        </div>
        <div v-if="details.billType !== 2">
          <span class="detail-field-title-sm">其他费用：</span>
          <MoneyInput v-model="payment.otherFee" :is-disabled="isDisabled" class="detail-payment-input" />
        </div>
      </div>

      <div v-if="isChangeFee === 1 && canUpdateFee === 2 && changeFeeType === 1" class="err-message">存在多个异常记录未处理，只能修改最后一次上报的异常记录的运费。</div>

      <Row v-if="isChangeFee === 1" class="detail-field-group" style="margin-bottom: 10px">
        <i-col span="24">
          <span class="detail-field-title-sm" style="vertical-align: unset;padding-left: 8px;">费用合计：</span>
          <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
        </i-col>
      </Row>

      <PayInfo v-if="isChangeFee === 1 && details.abnormalPayInfos.length > 0"
               ref="$payInfo"
               :loading="loading"
               :total="paymentTotal"
               :data="settlementPayInfo"
               style="margin: 25px 0 25px 82px;"
               mode="edit" />

      <Row class="detail-field-group" style="margin: 25px 0 10px;">
        <i-col span="24" style="display: flex;">
          <span class="detail-field-title-sm" style="vertical-align: unset;padding-left: 8px;width: 90px;line-height: 1.6;">异常描述：</span>
          <!-- <Input :autosize="{minRows: 3, maxRows: 5}" :maxlength="500" type="textarea"></Input> -->
          <div style="width: 100%;">
            <Input v-model="details.abnormalDesc" :autosize="{minRows: 3, maxRows: 5}" :maxlength="500" type="textarea"></Input>
            <p style="color: #999;font-family:PingFangSC-Regular;font-weight:400;line-height: 40px;">注意：问题描述最多输入500个汉字</p>
          </div>
        </i-col>
      </Row>

      <Row class="detail-field-group" style="margin-bottom: 10px">
        <i-col span="24" style="display: flex;">
          <span class="detail-field-title-sm" style="vertical-align: unset;padding-left: 8px;width: 90px;line-height: 1.6;">图片上传：</span>
          <div style="width: 100%;">
            <up-load ref="upLoads" :multiple="true" max-size="10"></up-load>
            <p style="color: #999;font-family:PingFangSC-Regular;font-weight:400;line-height: 1.2;">图片格式必须为jpeg、jpg、gif、png，且最多上传6张，每张不能超过10MB！</p>
          </div>
        </i-col>
      </Row>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button type="primary" @click="submit">确认</Button>
      <Button type="default" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import MoneyInput from '../components/MoneyInput'
import Server from '@/libs/js/server'
import PayInfo from '../components/PayInfo'
import UpLoad from '@/components/upLoad/'
// import { ABNORMAL_TYPE_CODES } from '../constant/abnormal.js'
import _ from 'lodash'
export default {
  name: 'SendCar',
  components: { MoneyInput, PayInfo, UpLoad },
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
        otherFee: 0
      },
      clonePayment: {}, // 复制一份费用数据，用来比较有没有修改费用
      settlementType: '1',
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
      changeFeeType: 1, // 1 可以修改运费 2 已核销 3 已对账
      canUpdateFee: 0 // 判断多条异常记录只有最后一条可以修改运费
    }
  },

  computed: {
    // 计算总费用
    paymentTotal () {
      return parseFloat((Number(this.payment.freightFee) +
      Number(this.payment.loadFee) +
      Number(this.payment.unloadFee) +
      Number(this.payment.insuranceFee) +
      Number(this.payment.otherFee)).toFixed(2))
    }
  },
  created () {
    this.settlementPayInfo = this.type === 3 ? [
      { payType: 1, fuelCardAmount: '', cashAmount: '', isDisabled: false },
      { payType: 2, fuelCardAmount: '', cashAmount: '', isDisabled: false },
      { payType: 3, fuelCardAmount: '', cashAmount: '', isDisabled: false }
    ] : [
      { payType: 2, fuelCardAmount: '', cashAmount: '', isDisabled: false }
    ]
  },

  mounted () {
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
        console.log(_this.details)

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
      }).catch(err => console.error(err))
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
          console.log(res)
          _this.changeFeeType = res.data.data
          if (_this.changeFeeType === 1) {
            _this.checkUpdateFee()
          } else if (_this.changeFeeType === 2) {
            _this.$Message.warning('此单运费已核销，不能修改')
            _this.canotChangeFee()
          } else if (_this.changeFeeType === 3) {
            _this.$Message.warning('此单已经加入对账单，运费不能修改')
            _this.canotChangeFee()
          }
        }).catch(err => console.error(err))
      } else {
        // 将payment 设置为初始值
        for (let key in _this.clonePayment) {
          _this.payment[key] = _this.clonePayment[key]
        }
        console.log(_this.payment)
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
        item.isDisabled = true
      })
    },

    // 异常环节修改后，异常类型、多段支付联动
    handleChangeLinks (val) {
      // this.abnormalTypeCode = ''
      // this.abnormalTypeCodes = ABNORMAL_TYPE_CODES[val.toString()]
      this.autoAbnormalLinks('abnormalTiming', val)
      if (this.changeFeeType === 1 && this.canUpdateFee === 1) {
        console.log(val)
        switch (val) {
          case 1: // 装货环节： 预付、到付、回付这三段都可以修改
            this.settlementPayInfo.map((item) => {
              item.isDisabled = false
            })
            break
          case 2: // 送货环节： 到付、回付这两段都可以修改
            this.settlementPayInfo.map((item) => {
              item.isDisabled = (item.payType === 1)
            })
            break
          case 3: // 卸货环节： 提货只能改到付，送货只能改回付
            this.settlementPayInfo.map((item) => {
              if (this.type === 1) {
                item.isDisabled = false
              } else {
                item.isDisabled = (item.payType === 3)
                item.isDisabled = !item.isDisabled
              }
            })
            break
          default:
            break
        }
      }
    },

    // 提交前数据校验
    validate () {
      if (!this.abnormalTiming) {
        this.$Message.error('请选择异常环节')
        return false
      }
      if (!this.abnormalTypeCode) {
        this.$Message.error('请选择异常类型')
        return false
      }
      if (typeof this.payment.freightFee !== 'number') {
        this.$Message.error('请输入运输费')
        return false
      }
      if (this.details.abnormalPayInfos.length > 0 && this.isChangeFee === 1 && !this.$refs.$payInfo.validate()) return false
      return true
    },

    // 提交
    submit () {
      const _this = this
      if (!_this.validate()) return
      if (_this.isChangeSubmitFee() && _this.changeFeeType === 1 && _this.canUpdateFee === 1) {
        _this.$Toast.confirm({
          title: '提示',
          content: '<p>运费未修改，是否保存？</p>',
          okText: '是',
          cancelText: '否',
          onOk: () => {
            console.log('保存')
            _this.doSubmit()
          }
        })
      } else {
        _this.doSubmit()
      }
    },
    // 创建异常单
    doSubmit () {
      let fileUrls = []
      this.$refs.upLoads.uploadImgList.map((item) => {
        fileUrls.push(item.url)
      })
      let tableData
      if (this.details.abnormalPayInfos.length > 0) {
        if (this.isChangeFee === 1) {
          tableData = _.cloneDeep(this.$refs.$payInfo.tableDataBack)
          tableData.map((item) => {
            item.cashAmount = item.cashAmount * 100 || 0
            item.fuelCardAmount = item.fuelCardAmount * 100 || 0
            delete item._index
            delete item._rowKey
            delete item.isDisabled
          })
        } else {
          this.cloneSettlementPayInfo.map((item) => {
            item.cashAmount = item.cashAmount * 100 || 0
            item.fuelCardAmount = item.fuelCardAmount * 100 || 0
            delete item.isDisabled
          })
          tableData = this.cloneSettlementPayInfo
        }
      } else {
        tableData = []
      }
      let data = {
        ...this.formatMoney(),
        totalFee: this.paymentTotal * 100,
        fileUrls: fileUrls,
        abnormalPayInfos: tableData,
        abnormalTiming: this.abnormalTiming,
        abnormalTypeCode: this.abnormalTypeCode,
        abnormalDesc: this.details.abnormalDesc,
        updateFee: this.isChangeSubmitFee() ? 2 : 1
      }
      if (this.recordId) {
        data.recordId = this.recordId
      } else {
        data.billId = this.id
        data.billType = this.type
      }
      console.log(data)
      Server({
        url: this.recordId ? '/abnormal/update' : '/abnormal/create',
        method: 'post',
        data: data
      }).then(res => {
        console.log(res)
        this.complete()
        this.close()
        if (res.data.data <= 0) {
          this.openAbnormalSuccessDialog()
        } else {
          this.$Message.success(this.recordId ? '编辑成功' : '创建成功')
        }
      }).catch(err => console.error(err))
    },

    // 如果是修改运费状态，提交时需判断有没有修改运费
    isChangeSubmitFee () {
      if (this.isChangeFee === 2) return false
      if (this.details.abnormalPayInfos.length > 0) {
        this.cloneSettlementPayInfo.map((item) => {
          item.cashAmount = item.cashAmount || null
          item.fuelCardAmount = item.fuelCardAmount || null
        })
        let tableDate = _.cloneDeep(this.$refs.$payInfo.tableDataBack)
        tableDate.map((item) => {
          item.cashAmount = item.cashAmount || null
          item.fuelCardAmount = item.fuelCardAmount || null
          delete item._index
          delete item._rowKey
        })
        console.log(this.cloneSettlementPayInfo, tableDate)
        return _.isEqual(this.payment, this.clonePayment) && _.isEqual(this.cloneSettlementPayInfo, tableDate) // 费用输入框和多段付
      } else {
        return _.isEqual(this.payment, this.clonePayment)
      }
    },

    // 设置金额单位为元
    setMoneyUnit2Yuan (money) {
      return (typeof money === 'number' && money !== 0) ? money / 100 : null
    },
    // 格式化金额单位为分
    formatMoney () {
      let temp = Object.assign({}, this.payment)
      for (let key in temp) {
        if (typeof temp[key] === 'number') {
          temp[key] = temp[key] * 100
        } else {
          temp[key] = 0
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
    padding 27px 0 20px 12px
    border-bottom 1px dashed #CBCED3

    &:last-child
      border-style none
      padding-bottom 10px

    .detail-payment-way
      width calc(100% - 100px) !important
    .row-fee
      display flex
      justify-content space-between
      align-items center
      margin-bottom 10px
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
</style>
<style lang='stylus' scoped>
  .err-message
    color #EC4E4E
    font-size 14px
    font-family 'PingFangSC-Regular'
    margin-left 82px
</style>
