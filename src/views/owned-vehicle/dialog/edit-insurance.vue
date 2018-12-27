<!--保险-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      transfer
      width="1020"
      label-position="left"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center;font-weight: bold;">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="100" label-position="right">
        <p class="modalTitle">基础信息</p>
        <Row>
          <Col span="8">
          <FormItem label="车牌号：" prop="carNo">
            <Row>
              <Col span="20">
              <span v-if="flag  > 2">{{ validate.carNo }}</span>
              <CarSelect v-else v-model="validate.carNo"></CarSelect>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="保单号：" prop="invoiceNo">
            <Row>
              <Col span="20">
              <SelectInput v-model="validate.invoiceNo" :maxlength="8" placeholder="必填"></SelectInput>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="保险公司：" prop="insuranceCompanyName">
            <Row>
              <Col span="20">
              <SelectInput v-model="validate.insuranceCompanyName" :maxlength="8" placeholder="必填"></SelectInput>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="购买日期：">
            <Row>
              <Col span="20">
              <DatePicker v-model="validate.buyDate" transfer format="yyyy-MM-dd" type="date" placeholder="请选择日期">
              </DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="生效日期：" prop="effectDate">
            <Row>
              <Col span="20">
              <DatePicker
                :options="optionsStart"
                v-model="validate.effectDate"
                transfer
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择日期"
                @on-change="getExpireDate">
              </DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="失效日期：" prop="expireDate">
            <Row>
              <Col span="20">
              <DatePicker
                :options="optionsEnd"
                v-model="validate.expireDate"
                transfer
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择日期">
              </DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="交强险金额：" prop="trafficFee">
            <Row>
              <Col span="20">
              <TagNumberInput :min="0" v-model="validate.trafficFee" :show-chinese="false" placeholder="请输入"></TagNumberInput>
              </Col>
              <Col span="2" offset="1">
              <span>元</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="商业险金额：">
            <Row>
              <Col span="20">
              <TagNumberInput :min="0" v-model="validate.businessFee" :show-chinese="false" placeholder="请输入"></TagNumberInput>
              </Col>
              <Col span="2" offset="1">
              <span>元</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <p class="modalTitle">保单照片</p>
        <Row>
          <up-load ref="upLoads" :multiple="true" max-count="10" max-size="10"></up-load>
          <span class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过10MB</span>
        </Row>
        <p class="modalTitle">备注</p>
        <Input v-model="validate.remark" :maxlength="100" type="textarea" placeholder="请输入"></Input>
      </Form>
      <div slot="footer" class="footerSty">
        <Button :loading="loading" type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { CAR, formatterCarNo } from '../pages/client'
import BaseDialog from '@/basic/BaseDialog'
import UpLoad from '@/components/upLoad/index.vue'
import SelectInput from '@/components/SelectInput'
import Server from '@/libs/js/server'
import TagNumberInput from '@/components/TagNumberInput'
import CarSelect from '@/components/own-car-form/CarSelect'
export default {
  name: 'edit-insurance',
  components: {
    UpLoad,
    SelectInput,
    TagNumberInput,
    CarSelect
  },
  mixins: [BaseDialog],
  data () {
    return {
      optionsStart: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      optionsEnd: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      loading: false,
      validate: {
        invoiceNo: '',
        insuranceCompanyName: '',
        carNo: '',
        buyDate: '',
        effectDate: '',
        expireDate: '',
        trafficFee: null,
        businessFee: null,
        remark: '',
        picUrls: []
      },
      imgList: [],
      formatterCarNo: formatterCarNo, // 车牌号大写转换
      ruleValidate: {
        carNo: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        invoiceNo: [
          { required: true, message: '保单号不能为空', trigger: 'blur' }
        ],
        insuranceCompanyName: [
          { required: true, message: '保险公司不能为空', trigger: 'blur' }
        ],
        effectDate: [
          { required: true, message: '生效日期不能为空' }
        ],
        expireDate: [
          { required: true, message: '失效日期不能为空' }
        ],
        trafficFee: [
          { required: true, message: '交强险金额不能为空' }
        ]

      }
    }
  },
  mounted () {
    this.configData()
  },
  methods: {
    // 修改页面初始值更改
    configData () {
      let vm = this
      if (!(vm.flag % 2)) {
        if (vm.validate.picUrls.length > 0) {
          vm.validate.picUrls.map((item) => {
            vm.imgList.push({
              url: item,
              progress: 1
            })
          })
        }
        vm.$refs.upLoads.uploadImgList = vm.imgList
      }
    },
    save (name) {
      this.validate.picUrls = []
      this.$refs.upLoads.uploadImgList.map((item) => {
        this.validate.picUrls.push(item.url)
      })
      let params = Object.assign({}, this.validate)
      if (params.buyDate) params.buyDate = new Date(this.validate.buyDate).getTime()
      if (params.effectDate) params.effectDate = new Date(this.validate.effectDate).getTime()
      if (params.expireDate) params.expireDate = new Date(this.validate.expireDate).getTime()
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag % 2) { // 新增
            this.add(params)
          } else { // 2-编辑
            this.update(params)
          }
        }
      })
    },
    add (params) {
      let vm = this
      Server({
        url: '/ownerCar/insurance/add',
        method: 'post',
        data: params
      }).then(({ data }) => {
        vm.ok()
        vm.$Message.success(data.msg)
        vm.close()
      }).catch(() => {
        this.loading = false
      })
    },
    update (params) {
      let vm = this
      Server({
        url: '/ownerCar/insurance/edit',
        method: 'post',
        data: params
      }).then(({ data }) => {
        vm.ok()
        vm.$Message.success(data.msg)
        vm.close()
      }).catch(() => {
        this.loading = false
      })
    },
    getExpireDate () {
      let vm = this
      vm.optionsEnd = {
        disabledDate (date) {
          return date && date.valueOf() <= (Date.parse(new Date(vm.validate.effectDate)) - (86400000 * 2) && Date.now() - 86400000)
        }
      }
      let yearDate = vm.validate.effectDate.getFullYear() % 4 !== 0 ? 364 : 365 // 区分闰年
      vm.validate.expireDate = new Date(vm.validate.effectDate.getTime() + (yearDate * 86400000))
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../pages/client.styl"
>>>.ivu-form-item-content
  width 200px
.modalTitle
  font-size: 14px;
.imageTips
  color #999999
  font-size 13px
  line-height 60px
</style>
