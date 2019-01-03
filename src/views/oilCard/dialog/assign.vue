<template>
  <Modal v-model="visiable" :mask-closable="false" class="modal" transfer width="560" @on-visible-change="close">
    <p slot="header" class="modalTitle">{{ title }}</p>
    <Form ref="validate" :model="assign" :rules="ruleValidate" :label-width="90" label-position="right">
      <FormItem  label="卡号：">
        <span>{{assign.number}}</span>
      </FormItem>
      <FormItem  label="金额：">
        <span class="moneyFormSpan">{{assign.amount | toPoint}}元</span>
      </FormItem>
      <FormItem  label="用途：" prop="type">
        <RadioGroup v-model="assign.type" @on-change="typeChange">
          <Radio  v-for="(item, index) in typeList" :key="index" :label="item.value">
            <span>{{item.name}}</span>
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <!--自有车-->
    <Form v-show="assign.type===1" ref="validate1" :model="assign" :rules="ruleValidate1" :label-width="90" label-position="right">
      <div >
        <FormItem label="司机：" prop="driverName">
          <Select :clearable="true" v-model="assign.driverName"  placeholder="请选择司机" @on-change="chooseDriverName">
            <Option v-for="(item, index) in ownDriversList"
                    :key="index" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="车牌号：">
          <Select :clearable="true" v-model="assign.truckNo" placeholder="请选择车牌号">
            <Option v-for="(item, index) in ownCars"
                    :key="index" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
      </div>
    </Form>
    <!--抵扣外转运费-->
    <Form v-show="assign.type===2" ref="validate2" :model="assign" :rules="ruleValidate2" :label-width="90" label-position="right">
      <FormItem label="承运商：" prop="carrierName">
        <SelectInput
          v-model="assign.carrierName"
          :maxlength="20"
          :remote="false"
          :clearable="true"
          :local-options="carriers"
          placeholder="请选择或输入承运商名称"
          style="width: 100%"
          @on-focus.once="getCarriers"
          @on-select = "getCarriersId"
        >
        </SelectInput>
      </FormItem>
      <FormItem prop="driverNameOther"  label="司机：">
        <SelectInput
          v-model="assign.driverNameOther"
          :maxlength="15"
          :remote="false"
          :clearable="true"
          :local-options="carrierDrivers"
          placeholder="请选择或输入司机名称"
          style="width: 100%"
          @on-focus="getCarrierDriversList"
          @on-select = "getCarriersPhone"
        >
        </SelectInput>
      </FormItem>
      <FormItem label="手机号：" prop="driverPhone">
        <Input :maxlength="11" v-model="assign.driverPhone" placeholder="请输入司机号码"  />
      </FormItem>
      <FormItem label="车牌号：" prop="truckNo">
        <SelectInput
          v-model="assign.truckNo"
          :maxlength="15"
          :remote="false"
          :clearable="true"
          :local-options="carrierCars"
          placeholder="请选择或输入车牌号"
          style="width: 100%"
          @on-focus="getCarrierCarsList"
        >
        </SelectInput>
      </FormItem>
      <FormItem label="收押金：" prop="changeAmount">
        <Row>
          <Col span="20">
          <TagNumberInput v-model="assign.recieveDeposit" :show-chinese="false" :length="moneyLength" :precision="precision" placeholder="请输入押金金额"></TagNumberInput>
          </Col>
          <Col span="2" offset="1">
          <span>元</span>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="备注:">
        <Input :maxlength="100" v-model="assign.remark" type="textarea" placeholder="请输入"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="footerSty">
      <Button :loading="loading" type="primary" @click="save()">确定</Button>
      <Button style="margin-left: 8px" @click="close()">取消</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
import SelectInput from '@/components/SelectInput.vue'
import { mapGetters, mapActions } from 'vuex'
import { CAR } from '@/views/client/pages/client'
import float from '@/libs/js/float'
import TagNumberInput from '@/components/TagNumberInput'
export default {
  name: 'assign',
  components: {
    SelectInput,
    TagNumberInput
  },
  mixins: [BaseDialog],
  data () {
    const driverNameVali = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('司机不能为空'))
      }
    }
    const driverNameOtherVali = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('司机不能为空'))
      }
    }
    return {
      loading: false,
      precision: 2,
      moneyLength: 9,
      typeList: [
        { name: '自有车加油', value: 1 },
        { name: '抵扣外转运费', value: 2 }
      ],
      assign: {
        id: '',
        number: '',
        amount: '',
        type: 1,
        carrierName: '',
        driverName: '',
        driverNameOther: '', // 抵扣外转费用时的司机
        truckNo: '',
        driverPhone: '',
        recieveDeposit: '',
        remark: ''
      },
      carriersId: null,
      ruleValidate: {
        type: { required: true, message: '请选择用途' }
      },
      ruleValidate1: {
        driverName: { required: true, validator: driverNameVali }
      },
      ruleValidate2: {
        driverNameOther: { required: true, validator: driverNameOtherVali },
        carrierName: { required: true, message: '请输入承运商' },
        driverPhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/ }
        ],
        truckNo: { type: 'string', message: '车牌号格式错误', pattern: CAR }
      }
    }
  },
  computed: {
    ...mapGetters([
      'ownDrivers',
      'ownCars',
      'carriers',
      'carrierDrivers',
      'carrierCars'
    ]),
    ownDriversList () {
      let arr = []
      arr = this.ownDrivers.map(driver => {
        return {
          name: driver.name + ' ' + driver.driverPhone,
          value: driver.name + ' ' + driver.driverPhone,
          driverPhone: driver.driverPhone,
          id: driver.id,
          type: driver.type
        }
      })
      return arr
    }
  },
  mounted () {
    this.getOwnDrivers()
    this.getOwnCars()
    this.getCarriers()
  },
  methods: {
    ...mapActions([
      'getOwnDrivers',
      'getOwnCars',
      'getCarrierCars',
      'getCarriers',
      'getCarrierDrivers'
    ]),
    typeChange () {
      this.assign.driverName = ''
    },
    getCarriersId (name, obj) {
      this.carriersId = obj.id
    },
    getCarrierCarsList () {
      if (this.carriersId) {
        this.getCarrierCars(this.carriersId)
      }
    },
    chooseDriverName (driverName) {
      let arr = this.ownCars.filter(item => {
        return item.driverName === driverName
      })
      if (arr.length !== 0) this.assign.truckNo = arr[0].value
    },
    getCarrierDriversList () {
      if (this.carriersId) {
        this.getCarrierDrivers(this.carriersId)
      }
    },
    getCarriersPhone (name, obj) {
      this.assign.driverPhone = obj.driverPhone
      this.assign.truckNo = obj.carNO
    },
    formValidate (ref) {
      return new Promise((resolve, reject) => {
        ref.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject(new Error())
          }
        })
      })
    },
    async save () {
      await this.formValidate(this.$refs['validate'])
      if (this.assign.type === 1) {
        await this.formValidate(this.$refs['validate1'])
      } else {
        await this.formValidate(this.$refs['validate2'])
      }
      this.$refs['validate'].validate((valid) => {
        if (valid) {
          this.loading = true
          Server({
            url: '/oilCard/assign',
            method: 'post',
            data: {
              id: this.assign.id || undefined,
              type: this.assign.type || undefined,
              carrierName: this.assign.carrierName || undefined,
              driverName: this.assign.type === 1 ? this.assign.driverName.split(' ')[0] : (this.assign.driverNameOther || undefined),
              truckNo: this.assign.truckNo || undefined,
              driverPhone: this.assign.type === 1 ? this.assign.driverName.split(' ')[1] : (this.assign.driverPhone || undefined),
              recieveDeposit: typeof this.assign.recieveDeposit === 'number' ? float.round(this.assign.recieveDeposit * 100) : undefined,
              remark: this.assign.remark || undefined
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
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
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
  .moneyFormSpan
    font-size 14px
    color #00A4BD
    font-weight 500
</style>
