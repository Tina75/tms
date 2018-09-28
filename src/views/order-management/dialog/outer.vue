<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="360" class="outer-dialog">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>订单外转</span>
      </p>
      <Form ref="info" :model="info" :rules="rules" :label-width="100" label-position="left">
        <FormItem label="外转方" prop="transfereeName">
          <SelectInput
            v-model="info.transfereeName"
            :maxlength="20"
            :remote="false"
            :local-options="transferees"
            placeholder="请输入"
            style="width:200px"
            @on-focus.once="getTransferees"
            @on-select="handleSelectTransferee">
          </SelectInput>
        </FormItem>
        <FormItem label="外转方运单号">
          <Input v-model="info.outTransNo" :maxlength="20" style="width:200px" placeholder="请输入"/>
        </FormItem>
        <FormItem label="付款方式" prop="payType">
          <Select v-model="info.payType" style="width:200px">
            <Option v-for="opt in settlements" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
            <!-- <Option value="1">现付</Option>
            <Option value="2">到付</Option>
            <Option value="3">回单付</Option>
            <Option value="4">月结</Option> -->
          </Select>
        </FormItem>
        <FormItem label="外转运费" prop="transFee">
          <!-- <Input v-model="info.transFee" style="width:180px" placeholder="请输入"/> -->
          <TagNumberInput :min="0" v-model="info.transFee" :parser="handleParseFloat" style="width:175px">
            <span slot="suffix" class="order-create__input-suffix">元</span>
          </TagNumberInput>
          <!-- <Icon type="ios-calculator" size="26" color="#00a4bd" @click="showCounter"></Icon> -->
          <span @click="showCounter">
            <FontIcon type="jisuanqi" size="22" color="#00a4bd" class="i-ml-5" style="vertical-align: middle;"></FontIcon>
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
import TagNumberInput from '@/views/order/create/TagNumberInput'
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
    return {
      settlements,
      info: { transfereeName: '', outTransNo: '', payType: 4, transFee: null },
      rules: {
        transfereeName: [
          { required: true, message: '请填写外转方', trigger: 'blur' },
          { required: true, message: '请填写外转方', trigger: 'change' }
        ],
        payType: [
          { required: true, message: '请选择付款方式' }
        ],
        transFee: [
          { required: true, type: 'number', message: '请填写外转运费' }
        ]
      },
      visibale: true
    }
  },

  computed: {
    ...mapGetters([
      'transferees'
    ])
  },

  watch: {
    visibale: function (val) {
      !val && this.close()
    }
  },

  mounted: function () {
  },

  methods: {
    ...mapActions([
      'getTransferees'
    ]),
    // 保留2位小数
    handleParseFloat (value) {
      return float.floor(value)
    },
    // 选择已维护外转方后操作
    handleSelectTransferee (name, row) {
      console.log(name, row)
      this.info.payType = row.payType
    },
    save () {
      this.$refs['info'].validate((valid) => {
        this.info = Object.assign({}, this.info, {
          orderId: this.id,
          payType: Number(this.info.payType),
          transFee: Number(this.info.transFee)
        })
        if (valid) {
          Server({
            url: 'outside/bill/create',
            method: 'post',
            data: this.info
          }).then((res) => {
            this.ok()
            this.$Message.success('创建外转单成功')
            this.visibale = false
          })
        }
      })
    },
    // 显示计费规则
    showCounter () {
      const _this = this
      this.openDialog({
        name: 'order/create/CounterDialog',
        data: {
          value: 0
        },
        methods: {
          ok (value) {
            _this.info.transFee = value || 0
          }
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog
  p
    text-align center
</style>
<style lang='stylus'>
.outer-dialog .ivu-form
  .ivu-form-item-label
    padding 10px 10px 10px 15px
  .ivu-form-item-content
    margin-left 110px !important
</style>
