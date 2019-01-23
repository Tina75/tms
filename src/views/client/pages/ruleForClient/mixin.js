/* 用于客户管理和财务的计费规则 */
import { CAR_TYPE, CAR_LENGTH } from '@/libs/constant/carInfo'
import Server from '@/libs/js/server'
import { mapGetters, mapActions } from 'vuex'
import { ruleTypeAllList } from '@/libs/constant/ruleType.js'
import float from '@/libs/js/float'
// import { multiplyFee, divideFee } from '@/libs/js/config'
export default {
  computed: {
    ...mapGetters(['ruleTypeList']),
    ruleTypeMap () {
      /**
       * active 类型
       * 1: '发货方',
       * 2: '承运商',
       * 车型只有承运商有
       */
      let obj = {}
      for (let i = 0; i < ruleTypeAllList.length; i++) {
        if (this.ruleTypeList.includes(ruleTypeAllList[i].value)) {
          obj[ruleTypeAllList[i].value] = ruleTypeAllList[i].name
        }
        // for (let j = 0; j < this.ruleTypeList.length; j++) {
        //   if (ruleTypeAllList[i].value === '5' && this.active === '1') break
        //   if (this.ruleTypeList[j] === ruleTypeAllList[i].value) {
        //     obj[ruleTypeAllList[i].value] = ruleTypeAllList[i].name
        //   }
        // }
      }
      // 车型只有承运商有, 如果当前是发货方就剔除车型类型
      if (obj['5'] && this.active === '1') {
        delete obj['5']
      }
      return obj
    },
    precision () {
      if (this.ruleDetail.ruleType === '1' || this.ruleDetail.ruleType === '3') { // 重量(吨)的只有3位小数
        // return 3
        return this.$numberPrecesion.weight
      } else if (this.ruleDetail.ruleType === '2' || this.ruleDetail.ruleType === '4') { // 体积保留6位
        // return 6
        return this.$numberPrecesion.volume
      } else if (this.ruleDetail.ruleType === '6' || this.ruleDetail.ruleType === '7') { // 重量公斤没小数
        // return 0
        return this.$numberPrecesion.weightKg
      } else {
        return 2
      }
    },
    ruleType () {
      return this.ruleDetail.ruleType
    }
  },
  watch: {
    ruleType (val, old) {
      // debugger
      if (old && (old !== '5' && old !== '8')) {
        for (let j = 0; j < this.$refs['ruleBase'].length; j++) {
          this.$refs['ruleBase'][j].resetFields()
          // this.$refs['rulePrice'][j].resetFields()
        }
      }
      if (old && old === '5') {
        for (let j = 0; j < this.$refs['ruleCar'].length; j++) {
          this.$refs['ruleCar'][j].resetFields()
          // this.$refs['rulePrice'][j].resetFields()
        }
      }
      if (old && old === '8') {
        for (let j = 0; j < this.$refs['cargoName'].length; j++) {
          this.$refs['cargoName'][j].resetFields()
          // this.$refs['rulePrice'][j].resetFields()
        }
      }
      this.ruleDetail.details && this.ruleDetail.details.forEach(item => {
        item.chargeRules.forEach(el => {
          el.baseAndStart = el.base + ',' + item.startNum
        })
      })
    }
  },
  data () {
    const startValidate = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('请选择始发地'))
      } else {
        callback()
      }
    }
    const endValidate = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('请选择目的地'))
      } else {
        callback()
      }
    }
    const startNumValidate = (rule, value, callback) => {
      if (value === null || value === '') {
        callback()
      } else {
        if (/^((0[.]\d*)|(([1-9]\d{0,8})([.]\d*)?))$/.test(String(value))) {
          callback()
        } else {
          callback(new Error('必须大于0'))
        }
        if (this.ruleDetail.ruleType === '1' || this.ruleDetail.ruleType === '3') { // 重量精确3位小数
          if (/^((0[.]\d{1,3})|(([1-9]\d*)([.]\d{1,3})?))$/.test(String(value))) {
          } else {
            callback(new Error('最多三位小数'))
          }
        } else
        if (this.ruleDetail.ruleType === '2' || this.ruleDetail.ruleType === '4') { // 体积精确6位小数
          if (/^((0[.]\d{1,6})|(([1-9]\d{0,8})([.]\d{1,6})?))$/.test(String(value))) {
            callback()
          } else {
            callback(new Error('最多一位小数'))
          }
        } else
        if (this.ruleDetail.ruleType === '6' || this.ruleDetail.ruleType === '7') { // 重量公斤，保留整数
          if (/^(([1-9]\d{0,8})?)$/.test(String(value))) {
            callback()
          } else {
            callback(new Error('不能有小数'))
          }
        } else {
          callback()
        }
      }
    }
    const startPriceValidate = (rule, value, callback) => {
      if (value === null || value === '') {
        callback()
      }
      if (!(/^((0[.]\d{1,4})|(([1-9]\d{0,8})([.]\d{1,4})?))$/.test(String(value)))) {
        callback(new Error('必须大于0'))
      } else {
        callback()
      }
    }
    const baseAndStartValidate = (rule, value, callback) => {
      let realValue = parseFloat(value.split(',')[0])
      let startNum = parseFloat(value.split(',')[1])
      if (realValue === null || realValue === '' || isNaN(realValue) === true) {
        callback(new Error('请填写'))
      } else {
        // 小数判断
        if (this.ruleDetail.ruleType === '1' || this.ruleDetail.ruleType === '3') { // 重量吨的只有2位小数
          // /^(0|([1-9]\d*))([.]\d{1,2})?$/
          if (!(/^(0|([1-9]\d*))([.]\d{1,3})?$/.test(String(realValue)))) {
            callback(new Error('最多三位小数'))
          }
        }
        if (this.ruleDetail.ruleType === '2' || this.ruleDetail.ruleType === '4') { // 体积6未
          if (!(/^(0|([1-9]\d*))([.]\d{1,6})?$/.test(String(realValue)))) {
            callback(new Error('最多六位小数'))
          }
        }
        if (this.ruleDetail.ruleType === '6' || this.ruleDetail.ruleType === '7') { // 重量公斤没有小数
          if (!(/^(0|([1-9]\d*))?$/.test(String(realValue)))) {
            callback(new Error('不能输入小数'))
          }
        }
        if (startNum > realValue) {
          callback(new Error('计费区间与起步价冲突'))
        } else {
          callback()
        }
      }
    }
    const carTypeValidate = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('请填写车型'))
      }
    }
    const carLengthValidate = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('请填写车长'))
      }
    }
    const cargoNameValidater = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('请填写货物名称'))
      }
    }
    return {
      carType: CAR_TYPE,
      carLength: CAR_LENGTH,
      unitMap: {
        1: '吨',
        2: '方',
        3: '吨',
        4: '方',
        // 5: '车型没有单位'
        6: '公斤',
        7: '公斤',
        8: '' // 件数没有单位
      },
      valueMap: {
        1: '吨',
        2: '方',
        3: '吨公里',
        4: '方公里',
        5: '', // 车型没有单位
        6: '公斤',
        7: '公斤公里',
        8: '件'
      },
      sceneMap: {
        1: '发货方',
        2: '承运商',
        // 3: '外转方',
        4: '规则'
      },
      valueTypeMap: {
        '1': '重量',
        '2': '体积',
        '3': '重量',
        '4': '体积',
        '5': '车型',
        '6': '重量',
        '7': '重量',
        '8': '货物名称'
      },
      startTypeMap: {
        1: '起步价',
        2: '起送量'
      },
      rulesQuery: {
        paramName: ''
      },
      companyDataActive: -1,
      ruleDetail: {},
      validate: {
        paramName: { type: 'string', max: 20, message: '不能超过20个字', trigger: 'blur' }
      },
      basicValidate: {
        ruleType: { required: true, message: '请选择计算方案', trigger: 'change' },
        ruleName: { required: true, message: '请填写规则名称', trigger: 'blur' }
      },
      routeValidate: {
        departure: { validator: startValidate, trigger: 'change' },
        destination: { validator: endValidate, trigger: 'change' },
        startType: { required: true, message: '请选择起送量', trigger: 'change' },
        startNum: [
          { validator: startNumValidate, trigger: 'change' }
        ],
        startPrice: [
          { validator: startPriceValidate, trigger: 'change' }
        ]
      },
      baseValidate: {
        baseAndStart: [
          { validator: baseAndStartValidate, trigger: 'change' }
        ]
      },
      priceValidate: {
        price: [
          { required: true, message: '请填写金额', trigger: 'change', type: 'number' },
          { pattern: /^((0[.]\d{1,4})|(([1-9]\d{0,8})([.]\d{1,4})?))$/, message: '9位正数且最多四位小数', trigger: 'change' }
        ]
        // /^((0[.]\d{1,2})|(([1-9]\d{0,8})([.]\d{1,2})?))$/
      },
      carValidate: {
        carType: [
          // { required: true, message: '请选择车型', trigger: 'change' }
          { validator: carTypeValidate, trigger: 'change' }
        ],
        carLength: [
          { validator: carLengthValidate, trigger: 'change' }
        ]
      },
      cargoNameValidate: {
        cargoName: [
          { validator: cargoNameValidater, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getRuleTypeList()
  },
  methods: {
    ...mapActions(['getRuleTypeList', 'getSenderRules', 'getCarriesRules']),
    toDetail (data) {
      this.$router.push({
        name: 'accountDetail',
        params: {
          id: data.row.id
        }
      })
    },
    removeRule (data) {
      const _this = this
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除该条规则吗？',
        okText: '确认',
        cancelText: '取消',
        async onOk () {
          Server({
            url: '/finance/charge/deleteRule',
            method: 'post',
            data: {
              ruleId: data
            }
          }).then(res => {
            _this.ruleDetail = {}
            _this.getRules()
          })
        }
      })
    },
    addEl (index) {
      this.ruleDetail.details[index].chargeRules.push({ base: null, price: null, baseAndStart: '', carType: 0, carLength: 0 })
    },
    removeEl (index, no) {
      this.ruleDetail.details[index].chargeRules.splice(no, 1)
    },
    removeItem (index) {
      // this.ruleDetail.details.splice(index, 1)
      let _this = this
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除该条规则吗？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          _this.ruleDetail.details.splice(index, 1)
        }
      })
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
    async saveRules () {
      const _this = this
      if (!this.ruleDetail.details.length) {
        this.$Message.error('请添加至少一条规则')
        return
      }
      await this.formValidate(this.$refs['ruleBasic'])
      for (let i = 0; i < this.$refs['ruleRoute'].length; i++) {
        await this.formValidate(this.$refs['ruleRoute'][i])
      }
      if (this.ruleDetail.ruleType !== '5' && this.ruleDetail.ruleType !== '8') {
        for (let j = 0; j < this.$refs['ruleBase'].length; j++) {
          await this.formValidate(this.$refs['ruleBase'][j])
          await this.formValidate(this.$refs['rulePrice'][j])
        }
      }
      if (this.ruleDetail.ruleType === '5') {
        for (let j = 0; j < this.$refs['ruleCar'].length; j++) {
          await this.formValidate(this.$refs['ruleCar'][j])
          // await this.formValidate(this.$refs['carLength'][j])
          await this.formValidate(this.$refs['rulePrice'][j])
        }
      }
      if (this.ruleDetail.ruleType === '8') {
        for (let j = 0; j < this.$refs['cargoName'].length; j++) {
          await this.formValidate(this.$refs['cargoName'][j])
          await this.formValidate(this.$refs['rulePrice'][j])
        }
      }
      // 1、起步量 不做验证 2、起步价 起步量和起步价要么都写要么都不写
      if (this.ruleDetail.ruleType !== '5' && this.ruleDetail.ruleType !== '8') {
        if (!_this.ruleDetail.details.every((item, index, array) => {
          return (item.startType === '2' || (item.startNum === null && item.startPrice === null)) || (item.startNum && item.startPrice)
        })) {
          this.$Message.error('请填写起步价')
          return
        }
      }
      this.$Modal.confirm({
        title: '提示',
        content: '确认保存该条规则吗？',
        okText: '确认',
        cancelText: '取消',
        async onOk () {
          Server({
            url: '/finance/charge/updateRule',
            method: 'post',
            data: Object.assign({}, _this.ruleDetail, {
              details: _this.ruleDetail.details.map(item => {
                return {
                  departure: item.departure,
                  destination: item.destination,
                  startType: item.startType,
                  // 选择车型，件时，起步价，起步量都没有
                  startNum: (_this.ruleDetail.ruleType === '5' || _this.ruleDetail.ruleType === '8') ? undefined : (item.startNum ? float.round(item.startNum * 100, 6) : ''),
                  // 选择起步量的时候，startPrice的值传startNum的值
                  startPrice: (_this.ruleDetail.ruleType === '5' || _this.ruleDetail.ruleType === '8') ? undefined : (item.startType === '1' ? (item.startPrice ? float.round(item.startPrice * 100, 6) : '') : (item.startNum ? float.round(item.startNum * 100, 6) : '')),
                  chargeRules: item.chargeRules.map(el => {
                    return {
                      base: (_this.ruleDetail.ruleType === '5' || _this.ruleDetail.ruleType === '8') ? undefined : (float.round(el.base * 100, 6)),
                      price: float.round(el.price * 100, 6),
                      carType: _this.ruleDetail.ruleType === '5' ? el.carType : undefined,
                      carLength: _this.ruleDetail.ruleType === '5' ? el.carLength : undefined,
                      cargoName: _this.ruleDetail.ruleType === '8' ? el.cargoName : undefined
                    }
                  })
                }
              })
            })
          }).then(res => {
            _this.$Message.success('保存成功')
            _this.saveCitrCode(_this.ruleDetail.details)
            _this.getRules()
          })
        },
        async onCancel () {
          _this.getRules()
        }
      })
    },
    saveCitrCode (arr) {
      arr.map((item, index) => {
        this.$refs.city1[index].saveCity(item.departure)
        this.$refs.city2[index].saveCity(item.destination)
      })
    },
    startQuery () {
      this.$refs['rulesQuery'].validate((valid) => {
        if (valid) {
          this.getRules()
        }
      })
    },
    addItem () {
      this.ruleDetail.details.push({
        departure: null,
        destination: null,
        showRule: (this.ruleDetail.details.length + 1) + '',
        startNum: null,
        startPrice: null,
        startType: '2',
        chargeRules: [
          { base: null, price: null, baseAndStart: '', carType: 0, carLength: 0, cargoName: '' }
        ]
      })
    },
    setElStartNum (item, el) {
      el.baseAndStart = el.base + ',' + item.startNum
    },
    setItemStartNum (item) {
      item.chargeRules.forEach(el => {
        el.baseAndStart = el.base + ',' + item.startNum
      })
    },
    showRuleDetail (data) {
      // 详情在此处
      this.companyDataActive = data.ruleId
      this.ruleDetail = {
        ruleId: data.ruleId,
        ruleType: data.detail.ruleType ? (data.detail.ruleType + '') : '1',
        ruleName: data.ruleName,
        partnerName: data.partnerName,
        details: Object.assign([], data.detail.rules.map((item, index) => {
          return {
            departure: item.departure,
            destination: item.destination,
            startPrice: typeof item.startPrice === 'number' ? float.round(item.startPrice / 100, 6) : null,
            startNum: typeof item.startNum === 'number' ? float.round(item.startNum / 100, 6) : null,
            startType: item.startType ? item.startType + '' : '2',
            showRule: (index + 1) + '',
            chargeRules: item.chargeRules.map(el => {
              return {
                base: typeof el.base === 'number' ? float.round(el.base / 100, 6) : null,
                price: typeof el.price === 'number' ? float.round(el.price / 100, 6) : null,
                baseAndStart: el.base + ',' + item.startNum,
                carType: el.carType,
                carLength: el.carLength,
                cargoName: el.cargoName
              }
            })
          }
        }))
      }
      if (this.ruleDetail.details.length === 0) {
        this.addItem()
      }
    },
    startTypeChange (item) {
      item.startPrice = null
    }
    // async ruleTypeChange () {
    // @on-change="ruleTypeChange"
    // await this.formValidate(this.$refs['ruleBasic'])
    // for (let i = 0; i < this.$refs['ruleRoute'].length; i++) {
    //   await this.formValidate(this.$refs['ruleRoute'][i])
    // }
    // for (let j = 0; j < this.$refs['ruleBase'].length; j++) {
    //   await this.formValidate(this.$refs['ruleBase'][j])
    //   await this.formValidate(this.$refs['rulePrice'][j])
    // }
    // }
  }
}
