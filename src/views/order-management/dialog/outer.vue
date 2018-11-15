<template>
  <div class="dialog">
    <Modal v-model="visiable" :mask-closable="false" width="400" class="outer-dialog" @on-visible-change="close">
      <p slot="header" class="dialog-title">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>订单外转</span>
      </p>
      <Form ref="info" :model="info" :rules="rules" :label-width="120" label-position="left">
        <FormItem label="外转方:" prop="transfereeName">
          <SelectInput
            v-model="info.transfereeName"
            :maxlength="20"
            :remote="false"
            :local-options="transferees"
            placeholder="请选择或输入外转方"
            style="width:200px"
            @on-focus.once="getTransferees"
            @on-select="handleSelectTransferee">
          </SelectInput>
        </FormItem>
        <FormItem label="外转方运单号:" class="ivu-form-item-required blank">
          <Input v-model="info.outTransNo" :maxlength="20" style="width:200px"/>
        </FormItem>
        <FormItem label="付款方式:" prop="payType">
          <Select v-model="info.payType" style="width:200px">
            <Option v-for="opt in settlements" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="公里数:" prop="mileage" class="ivu-form-item-required blank">
          <TagNumberInput :min="0" v-model="info.mileage" :parser="handleParseFloat" style="width:200px">
            <span slot="suffix" class="order-create__input-suffix">公里</span>
          </TagNumberInput>
        </FormItem>
        <FormItem label="外转运费:" prop="transFee">
          <TagNumberInput :min="0" v-model="info.transFee" :parser="handleParseFloat" placeholder="请填写外转运费" style="width:175px">
            <span slot="suffix" class="order-create__input-suffix">元</span>
          </TagNumberInput>
          <span @click="showChargeRules">
            <FontIcon type="jisuanqi" size="22" color="#00a4bd" class="i-ml-5" style="vertical-align: middle;"></FontIcon>
          </span>
        </FormItem>
        <FormItem label="返现运费:" prop="cashBack" class="ivu-form-item-required blank">
          <TagNumberInput v-model="info.cashBack" :parser="handleParseFloat" style="width:175px">
            <span slot="suffix" class="order-create__input-suffix">元</span>
          </TagNumberInput>
          <span>
            <Tooltip
              style="margin-left: 5px;"
              max-width="200"
              transfer
              content="返现运费是指在实际运输过程中存在某一段运输没有执行，需要将提前支付的运费返还">
              <Icon type="ios-alert" style="font-size: 20px;color: #FFBB44;" />
            </Tooltip>
          </span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  type="primary"  @click="save">确定</Button>
        <Button  type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from '@/components/SelectInput.vue'
import TagNumberInput from '@/components/TagNumberInput'
import float from '@/libs/js/float'
import settlements from '@/libs/constant/settlement.js'
import FontIcon from '@/components/FontIcon'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'outer',

  components: {
    SelectInput,
    TagNumberInput,
    FontIcon
  },

  mixins: [BaseDialog],
  data () {
    // 9位整数 2位小数
    const validateFee = (rule, value, callback) => {
      if ((value && /^[0-9]{0,9}(?:\.\d{1,2})?$/.test(value)) || !value) {
        callback()
      } else {
        callback(new Error('最多整数位只可输入9位,小数两位'))
      }
    }
    return {
      settlements,
      info: { transfereeName: '', outTransNo: '', payType: 4, transFee: null, cashBack: null, mileage: null },
      rules: {
        transfereeName: [
          { required: true, message: '请填写外转方', trigger: 'blur' },
          { required: true, message: '请填写外转方', trigger: 'change' }
        ],
        transFee: [
          { required: true, type: 'number', message: '请填写外转运费' },
          { validator: validateFee }
        ],
        payType: [
          { required: true, message: '请选择付款方式' }
        ],
        mileage: [
          { message: '小于等于六位整数,最多一位小数', pattern: /^[0-9]{0,6}(?:\.\d{1})?$/ }
        ],
        cashBack: [
          { validator: validateFee }
        ]
      }
    }
  },

  computed: {
    ...mapGetters([
      'transferees'
    ])
  },

  mounted: function () {
    // 公里数
    this.info.mileage = this.detail.mileage === 0 ? null : Number(this.detail.mileage) / 1000
  },

  methods: {
    ...mapActions([
      'getTransferees'
    ]),
    // 保留2位小数
    handleParseFloat (value) {
      if (!value) {
        return value
      }
      if (parseFloat(value) === 0) {
        return null
      }
      return float.floor(value).toString()
    },
    // 选择已维护外转方后操作
    handleSelectTransferee (name, row) {
      this.info.payType = row.payType
    },
    save () {
      this.$refs['info'].validate((valid) => {
        if (valid) {
          this.info = Object.assign({}, this.info, {
            orderId: this.detail.id,
            payType: Number(this.info.payType),
            transFee: Number(this.info.transFee) * 100,
            mileage: Number(this.info.mileage) * 1000
          })
          this.info.cashBack = this.info.cashBack * 100 || null
          Server({
            url: 'outside/bill/create',
            method: 'post',
            data: this.info
          }).then((res) => {
            this.ok()
            this.$Message.success('创建外转单成功')
            this.close()
          })
        }
      })
    },
    // 计费规则
    showChargeRules () {
      const self = this
      if (self.info.transfereeName) {
        const transfereeItem = this.transferees.find(transferee => transferee.value === self.info.transfereeName)
        if (!transfereeItem) {
          this.$Message.warning('您选择或输入的外转方没有维护的计费规则')
          return
        }
        let transfereeId = transfereeItem.id
        if (!transfereeId) {
          this.$Message.warning('您选择或输入的外转方没有维护的计费规则')
          return
        }
        this.openDialog({
          name: 'dialogs/financeRule',
          data: {
            partnerName: self.info.transfereeName,
            partnerId: transfereeId, // 客户编号
            // 以下数据必传
            partnerType: 3, // 计费规则分类 - 发货方1 承运商2 外转方3
            weight: self.detail.weight, // 货物重量
            volume: self.detail.volume, // 货物体积
            start: self.detail.start, // 始发地code
            end: self.detail.end, // 目的地code
            startPoint: { lat: self.detail.consignerAddressLatitude, lng: self.detail.consignerAddressLongitude }, // 始发地经纬度
            endPoint: { lat: self.detail.consigneeAddressLatitude, lng: self.detail.consigneeAddressLongitude } // 目的地经纬度
          },
          methods: {
            // 确认计费规则后返回金额(元)
            ok (charge) {
              self.info.transFee = charge || 0
            },
            // 如果有两层对话框，在计费规则中点击去设置按钮后需要关闭第一层对话框
            closeParentDialog () {
              self.close()
            }
          }
        })
      } else {
        this.$Message.warning('请先选择或输入外转方')
      }
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
  letter-spacing 1px
</style>
<style lang='stylus'>
.outer-dialog .ivu-form
  .ivu-form-item-label
    padding 10px 10px 10px 15px
.blank
  /deep/ .ivu-form-item-label:before
    visibility: hidden
</style>
