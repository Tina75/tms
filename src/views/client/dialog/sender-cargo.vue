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
        <FormItem label="货物编码：">
          <Input v-model="validate.cargoNo" :maxlength="200" placeholder="请输入"/>
        </FormItem>
        <FormItem label="货值：" prop="cargoCost">
          <Input v-model="validate.cargoCost"  placeholder="请输入"/>元
        </FormItem>
        <FormItem label="包装方式：">
          <SelectPackageType v-model="validate.unit" style="width: 86%" clearable></SelectPackageType>
        </FormItem>
        <FormItem label="包装尺寸：">
          <Row>
            <Col :span="6">
            <TagNumberInput :min="0" :precision="1" v-model="volumeLength" :length="7" :show-chinese="false" placeholder="长"></TagNumberInput>
            </Col>
            <Col :span="1"><span>-</span></Col>
            <Col :span="6">
            <TagNumberInput :min="0" :precision="1" v-model="volumeWidth" :length="7" :show-chinese="false" placeholder="宽"></TagNumberInput>
            </Col>
            <Col :span="1"><span>-</span></Col>
            <Col :span="6">
            <TagNumberInput :min="0" :precision="1" v-model="volumeHeight" :length="7" :show-chinese="false" placeholder="高"></TagNumberInput>
            </Col>
            <Col :span="4"><span style="padding-left: 15px">毫米</span></Col>
          </Row>
        </FormItem>
        <FormItem label="重量：" prop="weight">
          <TagNumberInput :min="0" :precision="3" v-model="validate.weight" :show-chinese="false" class="ivu-input-wrapper" placeholder="请输入"></TagNumberInput>吨
        </FormItem>
        <FormItem label="体积：" prop="volume">
          <TagNumberInput :min="0" :precision="6" v-model="validate.volume" :show-chinese="false" class="ivu-input-wrapper" placeholder="请输入"></TagNumberInput>方
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
import { consignerCargoAdd, consignerCargoUpdate } from '../pages/client'
import float from '@/libs/js/float'
import SelectPackageType from '@/components/SelectPackageType'
import TagNumberInput from '@/components/TagNumberInput'
export default {
  name: 'sender-address',
  components: {
    SelectInput,
    SelectPackageType,
    TagNumberInput
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
      volumeLength: null,
      volumeWidth: null,
      volumeHeight: null,
      ruleValidate: {
        cargoName: [
          { required: true, message: '货物名称不能为空', trigger: 'blur' }
        ],
        cargoCost: [
          { type: 'string', message: '必须为不超过9位的数,最多两位小数', pattern: /^(0|([1-9]\d{0,8}))([.]\d{1,2})?$/, trigger: 'blur' }
        ]
        // weight: [
        //   { type: 'string', message: '必须为大于等于0的数字,最多三位小数', pattern: /^(0|([1-9]\d*))([.]\d{1,3})?$/, trigger: 'blur' }
        // ],
        // volume: [
        //   { type: 'string', message: '必须为大于等于0的数字,最多六位小数', pattern: /^(0|([1-9]\d*))([.]\d{1,6}?)?$/, trigger: 'change' }
        // ]
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
  watch: {
    volumeLength (newVal) {
      if (newVal && this.volumeWidth && this.volumeHeight) this.validate.volume = this.numberInit(newVal, this.volumeWidth, this.volumeHeight)
    },
    volumeWidth (newVal) {
      if (newVal && this.volumeHeight && this.volumeLength) this.validate.volume = this.numberInit(newVal, this.volumeHeight, this.volumeLength)
    },
    volumeHeight (newVal) {
      if (newVal && this.volumeWidth && this.volumeLength) this.validate.volume = this.numberInit(newVal, this.volumeWidth, this.volumeLength)
    }
  },
  methods: {
    numberInit (val1, val2, val3) { // 精确六位小数
      return float.round(val1 * val2 * val3 / (1000 * 1000 * 1000), 6)
    },
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
        cargoCost: float.round(parseFloat(this.validate.cargoCost) * 100), // *100传给后端
        weight: parseFloat(this.validate.weight),
        volume: parseFloat(this.validate.volume),
        remark1: this.validate.remark1,
        remark2: this.validate.remark2,
        cargoNo: this.validate.cargoNo,
        dimension: { length: this.volumeLength, width: this.volumeWidth, height: this.volumeHeight }
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
        cargoCost: float.round(parseFloat(this.validate.cargoCost) * 100),
        weight: parseFloat(this.validate.weight),
        volume: parseFloat(this.validate.volume),
        remark1: this.validate.remark1,
        remark2: this.validate.remark2,
        cargoNo: this.validate.cargoNo,
        dimension: { length: this.volumeLength, width: this.volumeWidth, height: this.volumeHeight }
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
  @import "../pages/client.styl"
  .ivu-input-wrapper
    width: 86%
    margin-right 8px
</style>
