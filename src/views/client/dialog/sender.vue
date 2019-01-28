<template>
  <Modal
    v-model="visiable"
    :mask-closable="false"
    transfer
    label-position="left"
    class="modal"
    @on-visible-change="close"
  >
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122" label-position="right">
      <FormItem label="发货方名称：" prop="name">
        <Input v-model="validate.name" :maxlength="$fieldLength.company" placeholder="请输入"/>
      </FormItem>
      <FormItem label="发货方联系人：" prop="contact">
        <Input v-model="validate.contact"  :maxlength="$fieldLength.name" placeholder="请输入"/>
      </FormItem>
      <FormItem label="联系号码：" prop="phone" >
        <SelectInput v-model="validate.phone" :formatter="formatePhoneNum"  :maxlength="phoneLength(validate.phone)" placeholder="请输入手机号或座机号"></selectInput>
      </FormItem>
      <FormItem label="提货方式：">
        <Select v-model="validate.pickUp" transfer clearable placeholder="请输入">
          <Option v-for="opt in pickups" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="结算方式：">
        <Select v-model="validate.payType" transfer clearable placeholder="请输入">
          <Option v-for="opt in settlements" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="是否开票：">
        <Select v-model="validate.isInvoice" transfer clearable placeholder="请输入">
          <Option v-for="opt in invoiceList" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
        </Select>
        <Tooltip :max-width="200" :content="`开票税额将计入成本统计`" placement="top" transfer>
          <Icon class="vermiddle paddingBlock" type="ios-information-circle" size="16" color="#FFBB44"></Icon>
        </Tooltip>
      </FormItem>
      <FormItem v-if="validate.isInvoice === 1" prop="invoiceRate">
        <label slot="label">
          <span class="vermiddle">开票税率：</span>
        </label>
        <TagNumberInput v-model="validate.invoiceRate" :show-chinese="false" :min="0" :max="100" :precision="2">
        </TagNumberInput>
        <span class="paddingBlock">%</span>
      </FormItem>
      <FormItem label="开拓渠道：" >
        <Select v-model="validate.exploiteChannel" transfer placeholder="请输入">
          <Option v-for="opt in exploiteChannel" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="">
        <label slot="label">
          <span class="vermiddle">对接业务员：</span>
        </label>
        <Select v-model="validate.salesmanId" transfer clearable placeholder="请选择对接此客户的业务员">
          <Option v-for="(opt, index) in salesmans" :key="index" :value="opt.id">{{opt.name}}</Option>
        </Select>
        <Tooltip :max-width="200" :content="`只可选择配置了提货调度和送货调度权限的员工账号`" placement="top" transfer>
          <Icon class="vermiddle paddingBlock" type="ios-information-circle" size="16" color="#FFBB44"></Icon>
        </Tooltip>
      </FormItem>
      <FormItem label="备注：" >
        <Input v-model="validate.remark" :maxlength="100" :rows="2" :autosize="{minRows: 2,maxRows: 5}" type="textarea"  placeholder="请输入"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button :loading="loading" type="primary" @click="save('validate')">确定</Button>
      <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
    </div>
  </Modal>
</template>

<script>
import { consignerAdd, consignerUpdate } from '../pages/client'
import BaseDialog from '@/basic/BaseDialog'
import { pickups } from '@/libs/constant/pickup.js'
import { invoiceList, exploiteChannel } from '@/libs/constant/orderCreate.js'
import TagNumberInput from '@/components/TagNumberInput'
import SelectInput from '@/components/SelectInput.vue'
import server from '@/libs/js/server'
import float from '@/libs/js/float'
import { validatePhone } from '@/libs/js/validate'
import { formatePhone } from '@/libs/js/formate'
import settlements from '@/libs/constant/settlement.js'
const rate = {
  set (value) {
    return value ? float.floor(value / 100, 4) : value
  }
}
export default {
  name: 'sender',
  components: {
    TagNumberInput,
    SelectInput
  },
  mixins: [BaseDialog],
  data () {
    return {
      settlements,
      exploiteChannel,
      loading: false,
      pickups, // 提货方式
      invoiceList,
      salesmans: [],
      id: '',
      validate: {
        name: '',
        contact: '',
        phone: '',
        payType: '',
        remark: '',
        pickUp: '', // 提货方式
        isInvoice: 0, // 是否开票
        invoiceRate: null, // 开票税率
        salesmanId: '', // 业务员
        exploiteChannel: 1
      },
      ruleValidate: {
        name: [
          { required: true, type: 'string', message: '发货方名称不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, type: 'string', message: '发货方联系人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系号码不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        invoiceRate: [
          { required: true, message: '请填写开票税率' }
        ]
      }
    }
  },
  mounted () {
    this.initSaleMan()
  },
  methods: {
    formatePhoneNum (temp) {
      return formatePhone(temp)
    },
    phoneLength (value) {
      return /^1/.test(value) ? 13 : this.$fieldLength.telephone
    },
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 1) { // 新增
            this._consignerAdd()
          } else { // 2-编辑
            this._consignerUpdate()
          }
        }
      })
    },
    _consignerAdd () {
      const param = Object.assign({}, this.validate, { invoiceRate: this.validate.isInvoice === 1 ? rate.set(this.validate.invoiceRate) : null })
      consignerAdd(param).then(res => {
        this.loading = false
        this.ok() // 刷新页面
        this.openTab({
          path: '/client/sender-info',
          title: '发货方详情',
          query: { id: res.data.data }
        })
        this.close()
      }).catch(() => {
        this.loading = false
      })
    },
    _consignerUpdate () {
      const param = Object.assign({}, this.validate, { id: this.id, invoiceRate: this.validate.isInvoice === 1 ? rate.set(this.validate.invoiceRate) : null })
      consignerUpdate(param).then(res => {
        this.loading = false
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
    },
    initSaleMan () {
      server({
        method: 'get',
        url: '/permission/buttOperator'
      }).then((response) => {
        this.salesmans = response.data.data
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../pages/client.styl"
  .ivu-select
  .ivu-input-wrapper
  .ivu-dropdown
    width 90%
  .paddingBlock
    padding-left 5px
</style>
