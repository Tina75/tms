<template>
  <div>
    <div class="add_btn">
      <Button v-if="hasPower(130215)" type="primary" @click="addRule">新增规则</Button>
    </div>
    <div  class="rule">
      <div v-if="companyData.length===0" class="data-total-empty">
        <img src="../../../assets/img-empty.png" class="data-empty-img">
        <p>暂无计费规则，快新增一个吧~</p>
      </div>
      <ul v-if="companyData.length>0"  class="ruleList">
        <li v-for="(item,index) in companyData" :class="{companyDataActive:companyDataActive === item.ruleId}" :key="index" class="list" @click="showRuleDetail(item)">
          <div class="icon">
            <FontIcon slot="icon" type="ico-price" ></FontIcon>
          </div>
          <div class="content">
            <div v-if="item.ruleName.length<8" class="ruleName">{{item.ruleName}}</div>
            <Tooltip v-else :content="item.ruleName" max-width="200" class="ruleName" placement="top-start" style="display: list-item">
              <div >{{item.ruleName.slice(0,8)}}...</div>
            </Tooltip>
            <div v-if="item.partnerName.length<8"  class="tips">{{item.partnerName}}</div>
            <Tooltip v-else :content="item.partnerName" max-width="200" class="tips" placement="bottom-start" style="display: list-item">
              <div >{{item.partnerName.slice(0,8)}}...</div>
            </Tooltip>
          </div>
          <div class="operate">
            <span v-if="hasPower(130216)" style="margin-right: 12px;" @click.stop="editRule(item)">修改</span>
            <span v-if="hasPower(130217)" @click="removeRule(item.ruleId)">删除</span>
          </div>
        </li>
      </ul>
      <div v-if="companyData.length>0"  class="ruleDetail">
        <div v-if="!ruleDetail.ruleId" class="data-empty">
          <img src="../../../assets/img-empty.png" class="data-empty-img">
          <p>请点击左侧{{sceneMap[active]}}设置计费规则明细～</p>
        </div>
        <div v-else class="rule-block">
          <div class="rule-basic">
            <Form ref="ruleBasic" :model="ruleDetail" :rules="basicValidate" inline>
              <span>按</span>
              <FormItem prop="ruleType" style="width: 100px">
                <Select v-model="ruleDetail.ruleType">
                  <Option v-for="(value, key) in ruleTypeMap" v-if="((active === '1' || active ==='3') && (key ==='3' || key === '4')) || key ==='1' || key ==='2'" :key="key" :value="key">{{value}}</Option>
                </Select>
              </FormItem>
              <span>计算</span>
            </Form>
          </div>
          <div class="rules-list">
            <div v-for="(item, index) in ruleDetail.details" :key="index" class="rule-item">
              <Collapse v-model="item.showRule" class="rule-content">
                <div class="rule-route">
                  <Form ref="ruleRoute" :model="item" :rules="routeValidate" inline>
                    <Row :gutter="24">
                      <Col span="5"  class="styleCommon">
                      <FormItem prop="departure" style="text-align: left">
                        <SelectInputForCity :code-type = "1" v-model="item.departure" placeholder="请输入始发地" class="search-input-senior"></SelectInputForCity>
                      </FormItem>
                      </Col>
                      <Col span="1" class="styleCommon">
                      <i class="icon font_family icon-ico-line"></i>
                      </Col>
                      <Col span="5" class="styleCommon">
                      <FormItem prop="destination" style="text-align: left">
                        <SelectInputForCity :code-type = "1" v-model="item.destination" placeholder="请输入目的地" class="search-input-senior"></SelectInputForCity>
                      </FormItem>
                      </Col>
                      <Col span="11" class="styleCommon">
                      <div class="startPrice">
                        <span style="margin:0 10px">起步价：货物  ＜</span>
                        <FormItem prop="startNum" inline style="margin-bottom: 0;">
                          <Input v-model="item.startNum" style="width: 80px" @on-change="setItemStartNum(item)"/>
                        </FormItem>
                        <span>{{unitMap[ruleDetail.ruleType]}}，</span>
                        <FormItem prop="startPrice" inline style="margin-bottom: 0;">
                          <Input v-model="item.startPrice" style="width: 80px"/>
                        </FormItem>
                        <span>元起</span>
                      </div>
                      </Col>
                      <Col span="2">
                      <span class="delete_btn" @click="removeItem(index)">删除</span>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <Panel :name="(index + 1) + ''">
                  <div slot></div>
                  <div slot="content">
                    <ul class="rule-detail">
                      <li v-for="(el, no) in item.chargeRules" :key="no" class="rule-detail-item">
                        <div>
                          <span>{{valueTypeMap[ruleDetail.ruleType]}}</span>
                          <span style="margin-left: 5px">≥</span>
                          <Form ref="ruleBase" :model="el" :rules="baseValidate" style="display: inline-block" inline>
                            <FormItem prop="baseAndStart" inline style="margin-bottom: 0">
                              <Input v-model="el.base" @on-change="setElStartNum(item, el)"/>
                            </FormItem>
                            <span>{{unitMap[ruleDetail.ruleType]}}</span>
                          </Form>
                        </div>
                        <div>
                          <span>单价</span>
                          <span style="margin-left: 5px">=</span>
                          <Form ref="rulePrice" :model="el" :rules="priceValidate" style="display: inline-block" inline>
                            <FormItem prop="price" inline style="margin-bottom: 0">
                              <Input v-model="el.price" />
                            </FormItem>
                            <span>元/{{valueMap[ruleDetail.ruleType]}}</span>
                          </Form>
                        </div>
                        <div class="add_decrease">
                          <span v-if="item.chargeRules.length > 1" style="margin-right: 12px"  @click="removeEl(index, no)">删除</span>
                          <span v-if="item.chargeRules.length - 1 === no" @click="addEl(index)">新增</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Panel>
              </Collapse>
            </div>
            <div class="item-add-btn">
              <p @click="addItem">
                <Icon class="add" type="md-add-circle"/>
                新增计费明细
              </p>
            </div>
          </div>
          <div class="rules-operation">
            <Button v-if="hasPower(170403)" type="primary" @click="saveRules()">保存</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import SelectInputForCity from '@/components/SelectInputForCity'
import FontIcon from '@/components/FontIcon'
export default {
  name: 'index',
  components: { SelectInputForCity, FontIcon },
  mixins: [ BasePage ],
  props: {
    /* 合作方类型
       *1 发货方
       *2 承运商
       * 3外转方
     */
    active: {
      type: [String]
    },
    partnerName: {
      type: [String],
      default: ''
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
      ruleDetail: {},
      companyDataActive: -1,
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
      rulesQuery: {
        paramName: ''
      },
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
  mounted () {
    this.getRules()
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
    addRule () {
      const _this = this
      this.openDialog({
        name: 'client/ruleForClient/dialogs/createRule',
        data: {
          scene: this.active,
          operateNum: 1,
          createRuleForm: {
            partnerName: this.partnerName
          }
        },
        methods: {
          ok () {
            _this.getRules()
          }
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
      console.log(index)
      this.ruleDetail.details[index].chargeRules.push({ base: '', price: '', baseAndStart: '' })
    },
    removeEl (index, no) {
      this.ruleDetail.details[index].chargeRules.splice(no, 1)
    },
    addItem () {
      this.ruleDetail.details.push({
        departure: null,
        destination: null,
        showRule: (this.ruleDetail.details.length + 1) + '',
        startNum: '',
        startPrice: '',
        chargeRules: [
          { base: '', price: '', baseAndStart: '' }
        ]
      })
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
        console.log(_this.ruleDetail.details)
        console.log(((item.startNum.length === 0 && item.startPrice.length === 0)) || (item.startNum.length !== 0 && item.startPrice.length !== 0))
        return ((item.startNum.length === 0 && item.startPrice.length === 0)) || (item.startNum.length !== 0 && item.startPrice.length !== 0)
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
                  startNum: item.startNum ? parseFloat(item.startNum) * 100 : '',
                  startPrice: item.startPrice ? parseFloat(item.startPrice) * 100 : '',
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
    editRule (item) {
      const _this = this
      this.openDialog({
        name: 'client/ruleForClient/dialogs/createRule',
        data: {
          operateNum: 2,
          scene: this.active,
          ruleId: item.ruleId,
          ruleType: item.detail.ruleType,
          createRuleForm: {
            ruleName: item.ruleName,
            partnerName: this.partnerName
          }
        },
        methods: {
          ok () {
            _this.getRules()
          }
        }
      })
    },
    getRules () {
      Server({
        url: '/finance/charge/listRules',
        method: 'get',
        params: {
          partnerType: this.active,
          paramName: '' // 没有搜索功能，从参数不用传
        }
      }).then(res => {
        this.companyData = res.data.data
        this.$emit('update:count', this.companyData.length ? this.companyData.length : 0)
        if (this.ruleDetail && this.ruleDetail.ruleId && this.companyData.some(item => item.ruleId === this.ruleDetail.ruleId)) {
          this.showRuleDetail(this.companyData.find(item => item.ruleId === this.ruleDetail.ruleId))
        } else {
          this.ruleDetail = {}
        }
      }).catch(err => console.error(err))
    },
    showRuleDetail (data) {
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
    setElStartNum (item, el) {
      el.baseAndStart = el.base + ',' + item.startNum
    },
    setItemStartNum (item) {
      item.chargeRules.forEach(el => {
        el.baseAndStart = el.base + ',' + item.startNum
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.add_btn
  padding-bottom 11px
  border-bottom 1px solid #E4E7EC
.rule
  display flex
  height 600px
  margin-bottom -20px
  .data-total-empty
    text-align center
    margin-top 150px
    width 100%
  .ruleList
    height 100%
    border-right 1px solid #C9CED9
    flex 0 0 270px
    margin-left -15px
    margin-bottom -20px
    overflow auto
    .list
      list-style none
      height 60px
      line-height 60px
      display flex
      border-bottom 1px solid #E4E7EC
      &.companyDataActive
        background #E9FCFF
      &:hover
        background #E9FCFF
        .operate
          display block
      .icon
        flex 0 0 60px
        text-align center
        position relative
        &:after
          position absolute
          bottom -1px
          content ''
          display block
          height 1px
          width 15px
          border-top  1px solid #fff
        i
          display inline-block
          width 30px
          height 30px
          background #f9f9f9
          border-radius 50%
          line-height 30px
          &:after
            border none
      .content
        flex 1
        font-size 12px
        .ruleName
          height 30px
          line-height 1
          padding-top 11px
          color #333
          font-weight bold
        .tips
          height 30px
          line-height 1
          padding-top 6px
          color #999
      .operate
        display none
        flex 0 0 80px
        cursor pointer
        color #00A4BD
  .ruleDetail
    flex 1
    height 100%
    position relative
    .data-empty
      display flex
      flex-direction column
      justify-content center
      align-items center
      height 500px
      /*border 1px solid #dcdee2*/
      .data-empty-img
        width 70px
        margin-bottom 12px
      p
        color #999999
        text-align center
    .rule-block
      padding-left 10px
      .rule-basic
        padding: 14px
        border-bottom: 1px solid #E4E7EC
        .ivu-form-item
          margin-bottom: 0
        span
          display: inline-block
          color: #333333
          font-size: 12px
          line-height: 35px
          margin-right: 10px
      .rules-list
        height 465px
        overflow: auto
        padding: 20px 0
        border-bottom: 1px solid #E4E7EC
        margin-right -15px
        margin-left -11px
        padding-left 11px
        padding-right 15px
        .rule-item
          display: flex
          margin-bottom: 30px
          .rule-content
            position: relative
            .rule-route
              display: block
              position: absolute
              width: calc(100% - 55px)
              top: 17px
              left: 20px
              z-index: 8
              .startPrice
                line-height 32px
              .delete_btn
                float: right
                text-align right
                line-height 33px
                font-size 14px
                color #00A4BD
                cursor pointer
              .icon
                color: #9DA1B0
                font-size: 24px
                line-height: 28px
              .styleCommon
                padding 0!important
                text-align center
            .rule-detail
              list-style none
              .rule-detail-item
                display flex
                padding 18px 16px
                height auto
                border-bottom 1px solid #DCDEE2
                &>div
                  flex 1
                  /deep/ .ivu-form-inline .ivu-form-item
                    vertical-align middle
                    width 128px
                    margin-left 10px
                &:last-child
                  border-bottom none
                .add_decrease
                  line-height 32px
                  color #00A4BD
                  font-size 14px
                  cursor pointer
          .item-remove
            width: 25px
            align-items center
            align-self: center
            .ivu-icon
              color: #EC4E4E
              font-size: 18px
          .ivu-collapse
            flex: 1
            .ivu-collapse-item
              border-top: none
              /deep/ .ivu-collapse-content
                padding 0
            /deep/ .ivu-collapse-content>.ivu-collapse-content-box
              padding 0
            /deep/ .ivu-collapse-header
              height: 70px
              background-color: rgba(248,248,248,1)
              padding: 15px 20px 15px
              padding-right 0
              text-align: right
              border-bottom 1px solid #DCDEE2
              .ivu-icon
                vertical-align: top
                margin-top: 12px
            .ivu-table-cell
              padding: 5px
              span
                padding: 10px
                display: inline-block
                vertical-align: middle
              .ivu-form-item
                margin-bottom: 0
              /deep/ .ivu-form-item-error-tip
                position: relative
            .adjuster
              i
                display: inline-block
                font-size: 18px
                cursor: pointer
                &.add
                  color: #7ED321
                  margin-right: 10px
                &.remove
                  color: #EC4E4E
        .item-add-btn
          cursor: pointer
          text-align: center
          height: 35px
          border: 1px dashed #E4E7EC
          line-height: 35px
          color: #00A4BD
          i
            font-size: 14px
      .rules-operation
        position absolute
        left 50%
        margin-left -43px
        bottom 20px
        text-align: center
        .ivu-btn
          padding-left: 30px
          padding-right: 30px
</style>
