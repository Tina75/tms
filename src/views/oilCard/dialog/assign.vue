<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="560" @on-visible-change="close">
    <p slot="header" class="modalTitle">{{ title }}</p>
    <Form ref="validate" :model="assign" :rules="ruleValidate" :label-width="90" label-position="right">
      <FormItem  label="卡号：">
        <span>{{assign.number}}</span>
      </FormItem>
      <FormItem  label="余额：">
        <span class="moneyFormSpan">{{assign.amount | toPoint}}元</span>
      </FormItem>
      <FormItem  label="用途：" prop="type">
        <RadioGroup v-model="assign.type">
          <Radio  v-for="(item, index) in typeList" :key="index" :label="item.value">
            <span>{{item.name}}</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <!--自有车-->
      <div v-if="assign.type===1">
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
      <!--抵扣外转运费-->
      <div v-if="assign.type===2">
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
        <FormItem label="司机：" prop="driverName">
          <SelectInput
            v-model="assign.driverName"
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
      </div>
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
export default {
  name: 'assign',
  components: {
    SelectInput
  },
  mixins: [BaseDialog],
  data () {
    const driverNameVali = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('请选择司机'))
      }
    }
    return {
      loading: false,
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
        truckNo: '',
        driverPhone: '',
        recieveDeposit: '',
        remark: ''
      },
      carriersId: null,
      ruleValidate: {
        type: { required: true },
        driverName: { required: true, validator: driverNameVali, trigger: 'change' },
        carrierName: { required: true, message: '请输入承运商', trigger: 'change' },
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
          value: driver.name,
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
    save () {
      this.$refs['validate'].validate((valid) => {
        if (valid) {
          this.loading = true
          Server({
            url: '/oilCard/assign',
            method: 'post',
            data: {
              id: this.assign.id || '',
              type: this.assign.type || '',
              carrierName: this.assign.carrierName || '',
              driverName: this.assign.driverName || '',
              truckNo: this.assign.truckNo || '',
              driverPhone: this.assign.driverPhone || '',
              recieveDeposit: this.assign.recieveDeposit || '',
              remark: this.assign.remark || ''
            }
          }).then(res => {
            this.loading = false
            this.close()
            this.ok()
          })
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
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
