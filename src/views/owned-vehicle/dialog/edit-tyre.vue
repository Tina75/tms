<!--轮胎-->
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
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="90" label-position="right">
        <p class="modalTitle">基础信息</p>
        <Row>
          <Col span="8">
          <FormItem label="车牌号：" prop="carNo">
            <Row>
              <Col span="20">
              <span v-if="flag  >= 2">{{ validate.carNo }}</span>
              <CarSelect v-else v-model="validate.carNo"></CarSelect>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="金额：" prop="cost">
            <Row>
              <Col span="20">
              <TagNumberInput :min="0" v-model="validate.cost" :precision="$numberPrecesion.fee" placeholder="请输入"></TagNumberInput>
              </Col>
              <Col span="2" offset="1">
              <span>元</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="轮胎品牌：" prop="tireBrand">
            <Row>
              <Col span="20">
              <SelectInput v-model="validate.tireBrand" :maxlength="15" placeholder="必填"></SelectInput>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="轮胎型号：" prop="tireModel">
            <Row>
              <Col span="20">
              <SelectInput v-model="validate.tireModel" :maxlength="30" placeholder="请输入"></SelectInput>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="安装日期：" prop="setupDate">
            <Row>
              <Col span="20">
              <DatePicker v-model="validate.setupDate" transfer format="yyyy-MM-dd" type="date" placeholder="请选择日期">
              </DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="换上公里数：" prop="setupMileage">
            <Row>
              <Col span="20">
              <TagNumberInput :min="0" :precision="$numberPrecesion.mileage" :length="6" v-model="validate.setupMileage" :show-chinese="false" placeholder="请输入"></TagNumberInput>
              </Col>
              <Col span="3" offset="1">
              <span>公里</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="换下公里数：" prop="uninstallMileage">
            <Row>
              <Col span="20">
              <TagNumberInput :min="0" :precision="$numberPrecesion.mileage" :length="6" v-model="validate.uninstallMileage" :show-chinese="false" placeholder="请输入"></TagNumberInput>
              </Col>
              <Col span="3" offset="1">
              <span>公里</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <p class="modalTitle">附件照片</p>
        <Row>
          <up-load ref="upLoads" :multiple="true" max-count="6" max-size="10"></up-load>
          <span class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传6张，每张不能超过10MB</span>
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
import float from '@/libs/js/float'
import { multiplyFee, divideFee } from '@/libs/js/config'
export default {
  name: 'edit-tyre',
  components: {
    UpLoad,
    SelectInput,
    TagNumberInput,
    CarSelect
  },
  mixins: [BaseDialog],
  data () {
    return {
      loading: false,
      validate: {
        carNo: '',
        cost: null,
        tireBrand: '',
        tireModel: '',
        setupDate: '',
        setupMileage: null,
        remark: '',
        uninstallMileage: null,
        picUrls: []
      },
      imgList: [],
      formatterCarNo: formatterCarNo, // 车牌号大写转换
      ruleValidate: {
        carNo: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '金额不能为空' },
          { message: '小于等于九位整数,最多两位小数', pattern: /^[0-9]{0,9}(?:\.\d{1,2})?$/ }
        ],
        setupMileage: [
          { message: '小于等于九位整数,最多两位小数', pattern: /^[0-9]{0,9}(?:\.\d{1,2})?$/ }
        ],
        uninstallMileage: [
          { message: '小于等于九位整数,最多两位小数', pattern: /^[0-9]{0,9}(?:\.\d{1,2})?$/ }
        ],
        tireBrand: [
          { required: true, message: '轮胎品牌不能为空' }
        ],
        tireModel: [
          { required: true, message: '轮胎型号不能为空' }
        ],
        setupDate: [
          { required: true, message: '安装日期不能为空' }
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
        vm.validate.cost = divideFee(vm.validate.cost)
        vm.validate.setupMileage = Number(vm.validate.setupMileage) / 1000
        vm.validate.uninstallMileage = Number(vm.validate.uninstallMileage) / 1000
      }
    },
    save (name) {
      this.validate.picUrls = []
      this.$refs.upLoads.uploadImgList.map((item) => {
        this.validate.picUrls.push(item.url)
      })
      let params = Object.assign({}, this.validate)
      if (params.setupDate) params.setupDate = new Date(this.validate.setupDate).getTime()
      if (params.cost) params.cost = multiplyFee(this.validate.cost)
      if (params.setupMileage) params.setupMileage = float.round(this.validate.setupMileage * 1000)
      if (params.uninstallMileage) params.uninstallMileage = float.round(this.validate.uninstallMileage * 1000)
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
        url: '/ownerCar/tire/add',
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
        url: '/ownerCar/tire/edit',
        method: 'post',
        data: params
      }).then(({ data }) => {
        vm.ok()
        vm.$Message.success(data.msg)
        vm.close()
      }).catch(() => {
        this.loading = false
      })
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
