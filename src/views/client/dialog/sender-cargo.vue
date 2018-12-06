<template>
  <div>
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
        <FormItem label="货物名称：" prop="cargoName">
          <Input v-model="validate.cargoName" :maxlength="20" placeholder="请输入"/>
        </FormItem>
        <FormItem label="包装方式：">
          <!--<Input v-model="validate.unit" :maxlength="10" placeholder="请输入"/>-->
          <SelectInput
            v-model="validate.unit"
            :local-options="getUnit"
            :maxlength="10"
            :remote="false"
            :clearable="true"
            style="width: 86%"
          >
          </SelectInput>
        </FormItem>
        <FormItem label="货值：" prop="cargoCost">
          <Input v-model="validate.cargoCost"  placeholder="请输入"/>
        </FormItem>
        <FormItem label="重量：" prop="weight">
          <Input v-model="validate.weight" :maxlength="60" placeholder="请输入"/>吨
        </FormItem>
        <FormItem label="体积：" prop="volume">
          <Input v-model="validate.volume" :maxlength="60" placeholder="请输入"/>方
        </FormItem>
        <FormItem label="备注1：">
          <Input v-model="validate.remark1" :maxlength="100" placeholder="请输入"/>
        </FormItem>
        <FormItem label="备注2：">
          <Input v-model="validate.remark2" :maxlength="100" placeholder="请输入"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button :loading="loading" type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from '@/components/SelectInput.vue'
import { consignerCargoAdd, consignerCargoUpdate } from '../client'
export default {
  name: 'sender-address',
  components: {
    SelectInput
  },
  mixins: [BaseDialog],
  data () {
    return {
      loading: false,
      consignerId: '', // 详情传过来的id
      id: '',
      validate: {
        cargoName: '',
        unit: '',
        cargoCost: '',
        weight: '',
        volume: '',
        remark1: '',
        remark2: ''
      },
      ruleValidate: {
        cargoName: [
          { required: true, message: '货物名称不能为空', trigger: 'blur' }
        ],
        cargoCost: [
          { type: 'string', message: '必须为不超过9位的数,最多两位小数', pattern: /^(0|([1-9]\d{0,8}))([.]\d{1,2})?$/, trigger: 'blur' }
        ],
        weight: [
          { type: 'string', message: '必须为大于等于0的数字,最多两位小数', pattern: /^(0|([1-9]\d*))([.]\d{1,2})?$/, trigger: 'blur' }
        ],
        volume: [
          { type: 'string', message: '必须为大于等于0的数字,最多一位小数', pattern: /^(0|([1-9]\d*))([.]\d?)?$/, trigger: 'blur' }
        ]
      },
      getUnit: [
        { name: '纸箱', value: '纸箱' },
        { name: '木箱', value: '木箱' },
        { name: '铁桶', value: '铁桶' },
        { name: '纤袋', value: '纤袋' },
        { name: '麻袋', value: '麻袋' },
        { name: '木架', value: '木架' }
      ]
    }
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 1) { // 新增
            this.add()
          } else { // 2-编辑
            this.update()
          }
          this.close()
        }
      })
    },
    add () {
      let data = {
        consignerId: this.consignerId,
        cargoName: this.validate.cargoName,
        unit: this.validate.unit,
        cargoCost: parseFloat(this.validate.cargoCost) * 100, // *100传给后端
        weight: parseFloat(this.validate.weight),
        volume: parseFloat(this.validate.volume),
        remark1: this.validate.remark1,
        remark2: this.validate.remark2
      }
      consignerCargoAdd(data).then(res => {
        this.loading = false
        this.ok() // 刷新页面
      }).catch(() => {
        this.loading = false
      })
    },
    update () {
      let data = {
        id: this.id,
        cargoName: this.validate.cargoName,
        unit: this.validate.unit,
        cargoCost: parseFloat(this.validate.cargoCost) * 100,
        weight: parseFloat(this.validate.weight),
        volume: parseFloat(this.validate.volume),
        remark1: this.validate.remark1,
        remark2: this.validate.remark2
      }
      consignerCargoUpdate(data).then(res => {
        this.loading = false
        this.ok() // 刷新页面
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../client.styl"
  .ivu-input-wrapper
    width: 86%
    margin-right 8px
</style>
