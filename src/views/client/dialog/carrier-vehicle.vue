<!--承运商详情----车辆新增编辑-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      width="1020"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center;font-weight: bold;">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="90">
        <Row>
          <Col span="7">
          <FormItem label="车牌号:" prop="carNo">
            <Row>
              <Col span="19">
              <span v-if="!disAbleBtn">{{ validate.carNo }}</span>
              <Select v-if="disAbleBtn" v-model="validate.carNo" placeholder="必选" class="minWidth">
                <Option
                  v-for="item in carNoList"
                  :value="item.carNo"
                  :key="item.carNo">
                  {{ item.carNo }}
                </Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="7">
          <FormItem label="维修类别:" prop="repairType">
            <Row>
              <Col span="19">
              <Select v-model="validate.repairType"  placeholder="必选" class="minWidth">
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
          <Col span="7">
          <FormItem label="送修日期:" prop="repairDate">
            <Row>
              <Col span="19">
              <DatePicker v-model="validate.repairDate" type="date" placeholder="必选"></DatePicker>
                </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="7">
          <FormItem label="维修费用:" prop="repairMoney">
            <Row>
              <Col span="19">
              <Input v-model="validate.repairMoney" :maxlength="9" placeholder="必填" @on-blur="repairMoneyChange"></Input>
                </Col>
              <Col span="4" offset="1">
              <span>元</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="7">
          <FormItem label="已支付费用:" prop="payMoney">
            <Row>
              <Col span="19">
              <Input v-model="validate.payMoney" :maxlength="9" placeholder="必填" @on-change="payMoneyChange"></Input>
                </Col>
              <Col span="2" offset="1">
              <span>元</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="7">
          <FormItem label="未支付费用:" prop="waitPayMoney">
            <Row>
              <Col span="19">
              <Input v-model="validate.waitPayMoney" :maxlength="9" placeholder="必填" @on-change="waitpayMoneyChange"></Input>
                </Col>
              <Col span="2" offset="1">
              <span>元</span>
                </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="7">
          <FormItem label="送修人:" prop="repairPerson">
            <Row>
              <Col span="19">
              <Input v-model="validate.repairPerson" :maxlength="20" placeholder="必填"></Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="7">
          <FormItem label="送修公里数:" prop="repairMile">
            <Row>
              <Col span="19">
              <Input v-model="validate.repairMile" :maxlength="9" placeholder="必填"></Input>
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
          <Col span="22" class="formatSty">
          <FormItem class="ivu-form-item-required blank" label="修理单位:">
            <Input v-model="validate.repairUnit" :maxlength="50" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" class="formatSty">
          <FormItem class="ivu-form-item-required blank" label="修理原因:">
            <Input v-model="validate.repairReason" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" class="formatSty">
          <FormItem class="ivu-form-item-required blank" label="修理结果:">
            <Input v-model="validate.repairResult" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" class="formatSty">
          <FormItem class="ivu-form-item-required blank" label="备注:">
            <Input v-model="validate.remark" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { CAR_TYPE1, CAR_LENGTH } from '@/libs/constant/carInfo'
import BaseDialog from '@/basic/BaseDialog'
import { carrierAddVehicle, carrierUpdateVehicle, carrierQueryCarlist, CODE, CAR } from '../client'
export default {
  name: 'carrier-vehicle',
  mixins: [BaseDialog],
  data () {
    return {
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      carrierId: '', // 承运商id
      driverId: 0, // 司机id
      driverName: '', // 只有编辑需要的数据
      carId: '', // 车辆id
      unbindedDriver: [], // 承运商下尚未被绑定车辆的司机
      validate: {
        payMoney: null,
        waitPayMoney: null,
        repairMoney: null
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
          { required: true, message: '送修公里数不能为空' },
          { message: '必须小于等于六位整数,不能有小数', pattern: /^[0-9]{0,6}?$/ }
        ],
        repairMoney: [
          { required: true, message: '维修费用不能为空' },
          { message: '必须小于等于六位整数,最多两位小数', pattern: /^[0-9]{0,6}(?:\.\d{1,2})?$/ }
        ],
        payMoney: [
          { required: true, message: '已支付费用不能为空' },
          { message: '必须小于等于六位整数,最多两位小数', pattern: /^[0-9]{0,6}(?:\.\d{1,2})?$/ }
        ],
        waitPayMoney: [
          { required: true, message: '未支付费用不能为空' },
          { message: '必须小于等于六位整数,最多两位小数', pattern: /^[0-9]{0,6}(?:\.\d{1,2})?$/ }
        ]
      }
    }
  },
  mounted () {
    if (this.title === '修改维修记录') {
      this.configData()
    } else {
      this.queryCarnoList()
    }
  },
  methods: {
    repairMoneyChange () {
      this.validate.payMoney = this.validate.repairMoney
      this.validate.waitPayMoney = 0
    },
    payMoneyChange () {
      if (this.validate.repairMoney) {
        this.validate.waitPayMoney = parseFloat(this.validate.repairMoney) - parseFloat(this.validate.payMoney)
      }
    },
    waitpayMoneyChange () {
      if (this.validate.repairMoney) {
        this.validate.payMoney = parseFloat(this.validate.repairMoney) - parseFloat(this.validate.waitPayMoney)
      }
    },
    // 修改页面初始化
    configData () {
      this.disAbleBtn = false
      this.validate.repairType = this.validate.repairType.toString()
      this.validate.carrierId = this.carrierId
      this.validate.repairMoney = this.validate.repairMoney / 100
      this.validate.payMoney = this.validate.payMoney / 100
      this.validate.waitPayMoney = this.validate.waitPayMoney / 100
      this.carNoList.push({ carNo: this.validate.carNo })
    },
    save (name) {
      this.validate.carrierId = this.carrierId
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag === 1) { // 新增
            this.add()
          } else { // 2-编辑
            this.update()
          }
        }
      })
    },
    add () {
      let data = Object.assign({}, this.validate)
      data.repairMoney = this.validate.repairMoney * 100
      data.payMoney = this.validate.payMoney * 100
      data.waitPayMoney = this.validate.waitPayMoney * 100
      carrierAddVehicle(data).then(res => {
        if (res.data.code === CODE) {
          this.$Message.success(res.data.msg)
          this.ok() // 刷新页面
          this.close()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = Object.assign({}, this.validate)
      data.repairMoney = this.validate.repairMoney * 100
      data.payMoney = this.validate.payMoney * 100
      data.waitPayMoney = this.validate.waitPayMoney * 100
      delete data.creater
      carrierUpdateVehicle(data).then(res => {
        if (res.data.code === CODE) {
          this.$Message.success(res.data.msg)
          this.ok() // 刷新页面
          this.close()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 查询车辆列表
    queryCarnoList () {
      let data = {}
      data.carrierId = this.carrierId
      carrierQueryCarlist(data).then(res => {
        if (res.data.code === CODE) {
          this.carNoList = res.data.data
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../client.styl"
.ivu-col-span-7
  margin-left: 25px!important
.formatSty
  margin-left: 25px;
</style>
