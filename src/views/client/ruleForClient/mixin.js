/* 用于客户管理和财务的计费规则 */
import Server from '@/libs/js/server'
export default {
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
        if (this.ruleDetail.ruleType === '1' || this.ruleDetail.ruleType === '3') { // 重量的只有2位小数
          if (/^((0[.]\d{1,2})|(([1-9]\d{0,8})([.]\d{1,2})?))$/.test(value)) {
            callback()
          } else {
            callback(new Error('最多两位小数'))
          }
        } else if (this.ruleDetail.ruleType === '2' || this.ruleDetail.ruleType === '4') {
          if (/^((0[.]\d{1,2})|(([1-9]\d{0,8})([.]\d)?))$/.test(value)) {
            callback()
          } else {
            callback(new Error('最多一位小数'))
          }
        }
      }
    }
    const startPriceValidate = (rule, value, callback) => {
      if (value === null || value === '') {
        callback()
      }
      if (/^((0[.]\d{1,2})|(([1-9]\d*)([.]\d{1,2})?))$/.test(value)) {
        if (/^((0[.]\d{1,2})|(([1-9]\d{0,8})([.]\d{1,2})?))$/.test(value)) {
          callback()
        } else {
          callback(new Error('最多9位整数'))
        }
      } else {
        callback(new Error('最多两位小数'))
      }
    }
    const baseAndStartValidate = (rule, value, callback) => {
      let realValue = parseFloat(value.split(',')[0])
      let startNum = parseFloat(value.split(',')[1])
      if (realValue === null || realValue === '') {
        callback(new Error('请填写'))
      } else {
        if (this.ruleDetail.ruleType === '1' || this.ruleDetail.ruleType === '3') { // 重量的只有2位小数
          // /^(0|([1-9]\d*))([.]\d{1,2})?$/
          if (!(/^(0|([1-9]\d*))([.]\d{1,2})?$/.test(realValue))) {
            callback(new Error('最多两位小数'))
          }
        }
        if (this.ruleDetail.ruleType === '2' || this.ruleDetail.ruleType === '4') {
          if (!(/^(0|([1-9]\d*))([.]\d)?$/.test(realValue))) {
            callback(new Error('最多一位小数'))
          }
        }
        if (startNum > realValue) {
          callback(new Error('计费区间与起步价冲突'))
        } else {
          callback()
        }
      }
    }
    return {
      companyData: [],
      unitMap: {
        1: '吨',
        2: '方',
        3: '吨',
        4: '方'
      },
      valueMap: {
        1: '吨',
        2: '方',
        3: '吨公里',
        4: '方公里'
      },
      sceneMap: {
        1: '发货方',
        2: '承运商',
        3: '外转方',
        4: '规则'
      },
      ruleTypeMap: {
        '1': '重量',
        '2': '体积',
        '3': '吨公里',
        '4': '方公里'
      },
      valueTypeMap: {
        '1': '重量',
        '2': '体积',
        '3': '重量',
        '4': '体积'
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
          { validator: startNumValidate, trigger: 'blur' }
        ],
        startPrice: [
          { validator: startPriceValidate, trigger: 'blur' }
        ]
      },
      baseValidate: {
        baseAndStart: [
          { validator: baseAndStartValidate, trigger: 'blur' }
        ]
      },
      priceValidate: {
        price: [
          { required: true, message: '请填写金额', trigger: 'blur' },
          { pattern: /^((0[.]\d{1,2})|(([1-9]\d{0,8})([.]\d{1,2})?))$/, message: '9位正数且最多两位小数', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
          }).catch(err => console.error(err))
        }
      })
    },
    addEl (index) {
      this.ruleDetail.details[index].chargeRules.push({ base: '', price: '', baseAndStart: '' })
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
      for (let j = 0; j < this.$refs['ruleBase'].length; j++) {
        await this.formValidate(this.$refs['ruleBase'][j])
        await this.formValidate(this.$refs['rulePrice'][j])
      }
      if (!_this.ruleDetail.details.every((item, index, array) => {
        return (item.startType === '2' || (item.startNum.length === 0 && item.startPrice.length === 0)) || (item.startNum.length !== 0 && item.startPrice.length !== 0)
      })) {
        this.$Message.error('请填写起步价')
        return
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
                  startNum: item.startNum ? parseFloat(item.startNum) * 100 : '',
                  // 选择起步量的时候，startPrice的值传startNum的值
                  startPrice: item.startType === '1' ? (item.startPrice ? parseFloat(item.startPrice) * 100 : '') : (item.startNum ? parseFloat(item.startNum) * 100 : ''),
                  chargeRules: item.chargeRules.map(el => {
                    return {
                      base: parseFloat(el.base) * 100,
                      price: parseFloat(el.price) * 100
                    }
                  })
                }
              })
            })
          }).then(res => {
            _this.$Message.success('保存成功')
            _this.getRules()
          }).catch(err => console.error(err))
        },
        async onCancel () {
          _this.getRules()
        }
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
        startNum: '',
        startPrice: '',
        startType: '2',
        chargeRules: [
          { base: '', price: '', baseAndStart: '' }
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
        details: Object.assign([], data.detail.rules.map((item, index) => {
          return {
            departure: item.departure,
            destination: item.destination,
            startPrice: item.startPrice !== 0 ? (item.startPrice / 100) + '' : '',
            startNum: item.startNum !== 0 ? (item.startNum / 100) + '' : '',
            startType: item.startType ? item.startType + '' : '2',
            showRule: (index + 1) + '',
            chargeRules: item.chargeRules.map(el => {
              return {
                base: el.base ? (el.base / 100) + '' : '0',
                price: el.price ? (el.price / 100) + '' : '0',
                baseAndStart: el.base + ',' + item.startNum
              }
            })
          }
        }))
      }
    },
    startTypeChange (item) {
      console.log(item)
      item.startPrice = ''
    }
  }
}
