<!--油卡新增編輯-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      transfer
      width="554"
      label-position="left"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" class="modalTitle">{{ title }}</p>
      <Form ref="validate" :model="addEdit" :rules="ruleValidate" :label-width="90" label-position="right">
        <FormItem  :prop="mode ===1 ? 'issuer' : 'noissuer'" label="发卡机构：">
          <!--新增-->
          <RadioGroup v-if = "mode ===1" v-model="addEdit.issuer" @on-change="getPrimaryCardList">
            <Radio v-for="(item, index) in issuerList" :key="index" :label="item.value">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
          <!--编辑-->
          <span v-else>{{issuerToName(addEdit.issuer)}}</span>
        </FormItem>
        <FormItem :prop="mode ===1 ? 'type' : 'notype'"  label="类型：">
          <!--新增-->
          <RadioGroup v-if = "mode ===1" v-model="addEdit.type">
            <Radio v-for="(item, index) in cardTypeList"
                   :key="index" :label="item.value" :disabled="item.value===2 &&primaryCardList.length===0">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
          <!--编辑-->
          <span v-else>{{typeToName(addEdit.type)}}</span>
        </FormItem>
        <FormItem v-if = "addEdit.type === 2" :prop="mode ===1 ? 'primaryCardId' : 'noprimaryCardId'" label="主卡号：" >
          <!--新增-->
          <Select v-if="mode===1" v-model="addEdit.primaryCardId" placeholder="请选择卡号">
            <Option v-for="(item,index) in primaryCardList"
                    :value="item.id"  :key="index">{{ item.number }}</Option>
          </Select>
          <!--編輯-->
          <span v-else>{{addEdit.type === 2 ? addEdit.primaryCardNumber : addEdit.number}}</span>
        </FormItem>
        <FormItem :label="addEdit.type === 1 ? '主卡号：' : '副卡号：'" prop="number">
          <Input :maxlength="numberMax"
                 v-model="addEdit.number" :placeholder="addEdit.type === 1 ? '请输入卡号' : '请输入副卡号'"></Input>
        </FormItem>
        <FormItem label="金额：">
          <Row>
            <Col span="20">
            <TagNumberInput v-model="addEdit.amount" :show-chinese="false" :precision="precision" placeholder="请输入金额"></TagNumberInput>
            </Col>
            <Col span="2" offset="1">
            <span>元</span>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="备注:">
          <Input :maxlength="100" v-model="addEdit.remark" type="textarea" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="footerSty">
        <Button :loading="loading" type="primary" @click="save()">确定</Button>
        <Button style="margin-left: 8px" @click="close()">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { CARDTYPELIST, ISSUERLIST } from '../constant/enum'
import BaseDialog from '@/basic/BaseDialog'
import TagNumberInput from '@/components/TagNumberInput'
import Server from '@/libs/js/server'
import float from '@/libs/js/float'
import contantmixin from '../mixin/contantmixin'
export default {
  name: 'addEdit',
  components: {
    TagNumberInput
  },
  mixins: [BaseDialog, contantmixin],
  data () {
    const numberValidate = (rule, value, callback) => {
      if (this.addEdit.issuer === 1) { // 中石化
        if (/^([1]\d{18}$)/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入“1”开头19位卡号'))
        }
      } else
      if (this.addEdit.issuer === 2) { // 中石油
        if (/^([9]\d{15})$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入“9”开头16位卡号'))
        }
      } else {
        callback()
      }
    }
    return {
      cardTypeList: CARDTYPELIST,
      issuerList: ISSUERLIST,
      loading: false,
      mode: 1, // 1 新增 2 編輯
      addEdit: {
        type: 1,
        number: '',
        primaryCardId: null,
        issuer: 1,
        amount: null,
        remark: '',
        primaryCardNumber: ''
      },
      primaryCardList: [],
      ruleValidate: {
        issuer: { required: true },
        noissuer: { required: false },
        type: { required: true },
        notype: { notype: false },
        number: [
          { required: true, validator: numberValidate, trigger: 'blur' }
        ],
        primaryCardId: { required: true, message: '没有主卡可选，请先新增主卡' },
        noprimaryCardId: { required: false }
      },
      precision: 2
    }
  },
  computed: {
    numberMax () {
      if (this.addEdit.issuer === 1) return 19
      else if (this.addEdit.issuer === 2) return 16
      else return 20
    }
  },
  mounted () {
    console.log(this.addEdit)
    this.getPrimaryCardList()
  },
  methods: {
    // 查询公司已存在的所有主卡信息（需指定发卡机构，如不指定，查询所有机构的）
    getPrimaryCardList () {
      this.addEdit.primaryCardId = null
      Server({
        url: '/oilCard/getPrimaryCardList',
        method: 'get',
        params: {
          issuer: this.addEdit.issuer
        }
      }).then(res => {
        this.primaryCardList = res.data.data.list
      })
    },
    save () {
      this.$refs['validate'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.mode === 1) this.add()
          else this.edit()
        }
      })
    },
    add () {
      Server({
        url: '/oilCard/add',
        method: 'post',
        data: {
          type: this.addEdit.type || undefined,
          number: this.addEdit.number || undefined,
          primaryCardId: this.addEdit.primaryCardId || undefined,
          issuer: this.addEdit.issuer || undefined,
          amount: typeof this.addEdit.amount === 'number' ? float.round(this.addEdit.amount * 100) : undefined,
          remark: this.addEdit.remark || undefined
        }
      }).then(res => {
        this.loading = false
        this.close()
        this.ok()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    edit () {
      Server({
        url: '/oilCard/update',
        method: 'post',
        data: {
          id: this.addEdit.id || undefined,
          type: this.addEdit.type || undefined,
          number: this.addEdit.number || undefined,
          primaryCardId: this.addEdit.primaryCardId || undefined,
          issuer: this.addEdit.issuer || undefined,
          amount: typeof this.addEdit.amount === 'number' ? float.round(this.addEdit.amount * 100) : undefined,
          remark: this.addEdit.remark || ''
        }
      }).then(res => {
        this.loading = false
        this.close()
        this.ok()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  /*@import "../pages/client.styl"*/
  .modal
    /deep/
      .ivu-radio-wrapper
        margin-right 40px
  .modalTitle
    text-align center
    font-weight bold
    font-size 14px
  .radioSty
    margin-left 35px
</style>
