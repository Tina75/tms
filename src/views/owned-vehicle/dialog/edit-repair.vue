<!--承运商详情----车辆新增编辑-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      transfer
      width="1020"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center;font-weight: bold;">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="100" label-position="right">
        <Row>
          <Col span="8">
          <FormItem label="车牌号：" prop="carNo">
            <Row>
              <Col span="19">
              <span v-if="disAbleBtn">{{ validate.carNo }}</span>
              <CarSelect v-if="!disAbleBtn" v-model="validate.carNo"></CarSelect>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="维修类别：" prop="repairType">
            <Row>
              <Col span="19">
              <Select v-model="validate.repairType"  placeholder="必选" class="minWidth" transfer>
                <Option
                  v-for="item in selectList"
                  :value="item.id"
                  :key="item.id">
                  {{ item.name }}
                </Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="送修日期：" prop="repairDate">
            <Row>
              <Col span="19">
              <DatePicker v-model="validate.repairDate" transfer type="date" placeholder="必选"></DatePicker>
                </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="维修费用：" prop="repairMoney">
            <Row>
              <Col span="19">
              <TagNumberInput :min="0" v-model="validate.repairMoney" :precision="$numberPrecesion.fee" placeholder="必填" @on-blur="repairMoneyChange"></TagNumberInput>
              </Col>
              <Col span="4" offset="1">
              <span>元</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="已支付费用：" prop="payMoney">
            <Row>
              <Col span="19">
              <TagNumberInput :min="0" :max="validate.repairMoney" :precision="$numberPrecesion.fee" v-model="validate.payMoney" placeholder="必填" @on-blur="payMoneyChange"></TagNumberInput>
              </Col>
              <Col span="2" offset="1">
              <span>元</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="未支付费用：" prop="waitPayMoney">
            <Row>
              <Col span="19">
              <TagNumberInput :min="0" v-model="validate.waitPayMoney" :precision="$numberPrecesion.fee" disabled></TagNumberInput>
              </Col>
              <Col span="2" offset="1">
              <span>元</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="送修人：" prop="repairPerson">
            <Row>
              <Col span="19">
              <Input v-model="validate.repairPerson" :maxlength="15" placeholder="必填"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="送修公里数：" prop="repairMile">
            <Row>
              <Col span="19">
              <TagNumberInput :min="0" :precision="$numberPrecesion.mileage" v-model="validate.repairMile" :length="6" :show-chinese="false" placeholder="必填"></TagNumberInput>
              </Col>
              <Col span="4" offset="1">
              <span>公里</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col span="23" class="formatSty">
          <FormItem label="修理单位：">
            <Input v-model="validate.repairUnit" :maxlength="50" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23" class="formatSty">
          <FormItem label="修理原因：">
            <Input v-model="validate.repairReason" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23" class="formatSty">
          <FormItem label="修理结果：">
            <Input v-model="validate.repairResult" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23" class="formatSty">
          <FormItem label="备注：">
            <Input v-model="validate.remark" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button :loading="loading" type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { CAR_TYPE1, CAR_LENGTH } from '@/libs/constant/carInfo'
import BaseDialog from '@/basic/BaseDialog'
import { CAR } from '../pages/client'
import float from '@/libs/js/float'
import Server from '@/libs/js/server'
import CarSelect from '@/components/own-car-form/CarSelect'
import TagNumberInput from '@/components/TagNumberInput'
import { multiplyFee, divideFee } from '@/libs/js/config'
export default {
  name: 'owned-vehicle',
  components: { CarSelect, TagNumberInput },
  mixins: [BaseDialog],
  data () {
    return {
      loading: false,
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      driverId: 0, // 司机id
      driverName: '', // 只有编辑需要的数据
      carId: '', // 车辆id
      unbindedDriver: [], // 承运商下尚未被绑定车辆的司机
      validate: {
        payMoney: null,
        waitPayMoney: null,
        repairMoney: null,
        repairMile: null
      },
      carNoList: [],
      disAbleBtn: true,
      selectList: [
        { id: '1', name: '维修' },
        { id: '2', name: '保养' }
      ],
      ruleValidate: {
        carNo: [
          { required: true, message: '车牌号不能为空' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR }
        ],
        repairType: [
          { required: true, message: '维修类别不能为空' }
        ],
        repairDate: [
          { required: true, message: '送修日期不能为空' }
        ],
        repairPerson: [
          { required: true, message: '送修人不能为空' }
        ],
        repairMile: [
          { required: true, message: '送修公里数不能为空' }
        ],
        repairMoney: [
          { required: true, message: '维修费用不能为空' }
          // { message: '<=九位整数,最多两位小数', pattern: /^[0-9]{0,9}(?:\.\d{1,2})?$/ }
        ],
        payMoney: [
          { required: true, message: '已支付费用不能为空' }
          // { message: '<=九位整数,最多两位小数', pattern: /^[0-9]{0,9}(?:\.\d{1,2})?$/ }
        ],
        waitPayMoney: [
          { required: true, message: '未支付费用不能为空' }
          // { message: '<=九位整数,最多两位小数', pattern: /^[0-9]{0,9}(?:\.\d{1,2})?$/ }
        ]
      }
    }
  },
  mounted () {
    if (this.flag === 2) {
      this.configData()
    } else if (this.flag === 1 && this.carNo) {
      this.validate.carNo = this.carNo
    } else {
      this.disAbleBtn = false
    }
  },
  methods: {
    repairMoneyChange () {
      if (this.validate.payMoney && float.round(float.round(this.validate.repairMoney) - (float.round(this.validate.payMoney))) >= 0) {
        this.validate.waitPayMoney = float.round(float.round(this.validate.repairMoney) - (float.round(this.validate.payMoney)) || 0)
      } else {
        this.validate.payMoney = this.validate.repairMoney
        this.validate.waitPayMoney = 0
      }
      this.$refs.validate.validateField('payMoney')
    },
    payMoneyChange () {
      if ((float.round(this.validate.repairMoney) - float.round(this.validate.payMoney)) <= 0) {
        this.validate.payMoney = float.round(this.validate.repairMoney)
      }
      if (this.validate.repairMoney) {
        this.validate.waitPayMoney = float.round(float.round(this.validate.repairMoney) - (float.round(this.validate.payMoney)) || 0)
      }
    },
    // 修改页面初始化
    configData () {
      this.disAbleBtn = true
      this.validate.repairType = this.validate.repairType.toString()
      this.validate.repairMoney = divideFee(this.validate.repairMoney)
      this.validate.payMoney = divideFee(this.validate.payMoney)
      this.validate.waitPayMoney = divideFee(this.validate.waitPayMoney)
      this.validate.repairMile = this.validate.repairMile / 1000
      this.carNoList.push({ carNo: this.validate.carNo })
    },
    save (name) {
      this.$refs[name].validate((valid) => {
        this.validate.repairDate = new Date(this.validate.repairDate).Format('yyyy-MM-dd hh:mm:ss')
        let params = Object.assign({}, this.validate)
        params.repairMoney = multiplyFee(this.validate.repairMoney)
        params.payMoney = multiplyFee(this.validate.payMoney)
        params.waitPayMoney = multiplyFee(this.validate.waitPayMoney)
        params.repairMile = float.round(this.validate.repairMile * 1000)
        if (valid) {
          this.loading = true
          if (this.flag === 1) { // 新增
            this.add(params)
          } else { // 2-编辑
            this.update(params)
          }
        }
      })
    },
    add (params) {
      Server({
        url: '/ownerCar/repair/add',
        method: 'post',
        data: params
      }).then(({ data }) => {
        this.$Message.success(data.msg)
        this.loading = false
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
    },
    update (params) {
      delete params.creater
      Server({
        url: '/ownerCar/repair/update',
        method: 'post',
        data: params
      }).then(({ data }) => {
        this.loading = false
        this.$Message.success(data.msg)
        this.ok() // 刷新页面
        this.close()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../pages/client.styl"
.ivu-col-span-7
  margin-left: 25px!important
</style>
