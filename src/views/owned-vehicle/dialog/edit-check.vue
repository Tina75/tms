<!--年检-->
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
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="110" label-position="right">
        <p class="modalTitle">基础信息</p>
        <Row>
          <Col span="8">
          <FormItem label="车牌号：" prop="carNo">
            <Row>
              <Col span="20">
              <span v-if="flag > 2">{{ validate.carNo }}</span>
              <CarSelect v-else v-model="validate.carNo"></CarSelect>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="金额:" prop="cost">
            <Row>
              <Col span="20">
              <TagNumberInput :min="0" v-model="validate.cost" :show-chinese="false" placeholder="请输入"></TagNumberInput>
              </Col>
              <Col span="2" offset="1">
              <span>元</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="年检日期：">
            <Row>
              <Col span="20">
              <DatePicker v-model="validate.checkDate" transfer format="yyyy-MM-dd" type="date" placeholder="请选择日期">
              </DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="下次年检日期：">
            <Row>
              <Col span="20">
              <DatePicker v-model="validate.nextCheckDate" transfer format="yyyy-MM-dd" type="date" placeholder="请选择日期">
              </DatePicker>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <p class="modalTitle">年检照片</p>
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
  name: 'edit-check',
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
        checkDate: '',
        nextCheckDate: '',
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
        cost: [
          { required: true, message: '总金额不能为空' }
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
      if (params.checkDate) params.checkDate = new Date(this.validate.checkDate).getTime()
      if (params.nextCheckDate) params.nextCheckDate = new Date(this.validate.nextCheckDate).getTime()
      this.validate.regularLine = JSON.stringify(this.address)
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
        url: '/ownerCar/check/add',
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
        url: '/ownerCar/check/edit',
        method: 'post',
        data: params
      }).then(({ data }) => {
        vm.ok()
        vm.$Message.success('修改成功')
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
