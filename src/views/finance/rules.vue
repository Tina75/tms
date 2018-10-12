<template>
  <div class="finance-rules">
    <div class="tab-box">
      <Tabs v-model="active" @on-click="switchTab">
        <TabPane v-for="(name, key) in sceneMap" v-if="key !== '4'" :key="key" :label="name" :name="key" />
      </Tabs>
    </div>
    <div class="data-container">
      <div class="operate-block">
        <Button v-if="hasPower(170401)" type="primary" @click="addRule">新增规则</Button>
        <div class="query-box">
          <Form ref="rulesQuery" :model="rulesQuery" :rules="validate" inline>
            <FormItem>
              <Select v-model="rulesQuery.type">
                <Option v-if="active === '1'" value="1">发货方名称</Option>
                <Option v-if="active === '2'" value="2">承运商名称</Option>
                <Option v-if="active === '3'" value="3">外转方名称</Option>
                <Option value="4">规则名称</Option>
              </Select>
            </FormItem>
            <FormItem prop="queryText">
              <Input v-model="rulesQuery.queryText" :placeholder="`请输入${sceneMap[rulesQuery.type]}名称`" :maxlength="20" style="width: auto">
              <Icon slot="suffix" type="ios-search" class="suffix-btn" @click="getRules"/>
              </Input>
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="list-box">
        <Row :gutter="20">
          <Col span="7">
          <Table :columns="companyColumn" :data="companyData" class="company-table" height="500" highlight-row @on-row-click="showRuleDetail"></Table>
          </Col>
          <Col span="17">
          <div v-if="!ruleDetail.ruleId" class="data-empty">
            <img src="../../assets/img-empty.png" class="data-empty-img">
            <p>请点击左侧{{sceneMap[active]}}设置计费规则明细～</p>
          </div>
          <div v-else class="rule-block">
            <div class="rule-basic">
              <Form ref="ruleBasic" :model="ruleDetail" :rules="basicValidate" inline>
                <span>按</span>
                <FormItem prop="ruleType">
                  <Select v-model="ruleDetail.ruleType">
                    <Option value="1">重量</Option>
                    <Option value="2">体积</Option>
                  </Select>
                </FormItem>
                <span>计算&#12288;&#12288;单位：元/{{unitMap[ruleDetail.ruleType]}}</span>
                <span>&#12288;&#12288;&#12288;&#12288;&#12288;规则名：</span>
                <FormItem prop="ruleName">
                  <Input v-model="ruleDetail.ruleName" :placeholder="`请输入规则名称`" style="width: auto" />
                </FormItem>
              </Form>
            </div>
            <div class="rules-list">
              <div v-for="(item, index) in ruleDetail.details" :key="index" class="rule-item">
                <div class="item-remove">
                  <Icon type="md-remove-circle" @click="removeItem(index)"/>
                </div>
                <Collapse v-model="item.showRule" class="rule-content">
                  <div class="rule-route">
                    <Form ref="ruleRoute" :model="item" :rules="routeValidate" inline>
                      <Row :gutter="20">
                        <Col span="11">
                        <FormItem prop="departure" style="width: 100%">
                          <AreaSelect v-model="item.departure" :deep="true" placeholder="请输入始发地" class="search-input-senior" />
                        </FormItem>
                        </Col>
                        <Col span="2">
                        <i class="icon font_family icon-ico-line"></i>
                        </Col>
                        <Col span="11">
                        <FormItem prop="destination" style="width: 100%">
                          <AreaSelect v-model="item.destination" :deep="true" placeholder="请输入目的地" class="search-input-senior" />
                        </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                  <Panel :name="(index + 1) + ''">
                    <div slot></div>
                    <div slot="content">
                      <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-default ivu-table-with-fixed-top">
                          <div class="ivu-table-header">
                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%">
                              <colgroup>
                                <col width="100">
                                <col width="250">
                                <col width="250">
                              </colgroup>
                              <thead>
                                <tr>
                                  <th class="">
                                    <div class="ivu-table-cell"><span class="">操作</span></div>
                                  </th>
                                  <th class="">
                                    <div class="ivu-table-cell"><span class="">计费区间</span></div>
                                  </th>
                                  <th class="">
                                    <div class="ivu-table-cell"><span class="">计费价格</span></div>
                                  </th>
                                </tr>
                              </thead>
                            </table>
                          </div>
                          <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%">
                              <colgroup>
                                <col width="100">
                                <col width="250">
                                <col width="250">
                              </colgroup>
                              <tbody class="ivu-table-tbody">
                                <tr v-for="(el, no) in item.chargeRules" :key="no" class="ivu-table-row">
                                  <td>
                                    <div class="ivu-table-cell">
                                      <div class="adjuster">
                                        <Icon class="add" type="md-add-circle" @click="addEl(index)"/>
                                        <Icon v-if="item.chargeRules.length > 1" class="remove" type="md-remove-circle" @click="removeEl(index, no)"/>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="ivu-table-cell">
                                      <Form ref="ruleBase" :model="el" :rules="baseValidate" inline>
                                        <span>大于等于</span>
                                        <FormItem prop="base" inline>
                                          <Input v-model="el.base" style="width: 120px"/>
                                        </FormItem>
                                        <span>{{unitMap[ruleDetail.ruleType]}}</span>
                                      </Form>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="ivu-table-cell">
                                      <Form ref="rulePrice" :model="el" :rules="priceValidate" inline>
                                        <FormItem prop="price" inline>
                                          <Input v-model="el.price" style="width: 120px"/>
                                        </FormItem>
                                        <span>元/{{unitMap[ruleDetail.ruleType]}}</span>
                                      </Form>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
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
              <Button v-if="hasPower(170403)" type="primary" @click="saveRules">保存</Button>
            </div>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import AreaSelect from '@/components/AreaSelect'

export default {
  name: 'financeRules',
  metaInfo: {
    title: '计费规则'
  },
  components: { AreaSelect },
  mixins: [ BasePage ],
  data () {
    const startValidate = (rule, value, callback) => {
      if (value === '' || value.length === 0) {
        callback(new Error('请选择始发地'))
      } else if (!(value === '110000' || value === '120000' || value === '210000' || value === '500000' || value[0] === '110000' || value[0] === '120000' || value[0] === '210000' || value[0] === '500000') && value.length < 2) {
        callback(new Error('始发地至少要选择二级城市'))
      } else {
        callback()
      }
    }
    const endValidate = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请选择目的地'))
      } else if (!(value === '110000' || value === '120000' || value === '210000' || value === '500000' || value[0] === '110000' || value[0] === '120000' || value[0] === '210000' || value[0] === '500000') && value.length < 2) {
        callback(new Error('目的地至少要选择二级城市'))
      } else {
        callback()
      }
    }
    return {
      active: '1',
      unitMap: {
        1: '吨',
        2: '方'
      },
      sceneMap: {
        1: '发货方',
        2: '承运商',
        3: '外转方',
        4: '规则'
      },
      rulesQuery: {
        type: '1',
        queryText: ''
      },
      companyData: [],
      ruleDetail: {},
      validate: {
        queryText: { type: 'string', max: 20, message: '不能超过20个字', trigger: 'blur' }
      },
      basicValidate: {
        ruleType: { required: true, message: '请选择计算方案', trigger: 'change' },
        ruleName: { required: true, message: '请填写规则名称', trigger: 'blur' }
      },
      routeValidate: {
        departure: { validator: startValidate, trigger: 'change' },
        destination: { validator: endValidate, trigger: 'change' }
      },
      baseValidate: {
        base: [
          { required: true, message: '请填写区间', trigger: 'blur' },
          { pattern: /^(0|([1-9]\d*))([.]\d{1,2})?$/, message: '最多精确到两位小数', trigger: 'blur' }
        ]
      },
      priceValidate: {
        price: [
          { required: true, message: '请填写金额', trigger: 'blur' },
          { pattern: /^([1-9]\d*)([.]\d{1,2})?$/, message: '最多精确到两位小数', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    companyColumn () {
      return [
        {
          title: this.sceneMap[this.active],
          width: 130,
          key: 'partnerName'
        },
        {
          title: '规则名',
          width: 110,
          key: 'ruleName'
        },
        {
          title: ' ',
          key: 'action',
          className: 'operation',
          render: (h, params) => {
            return this.hasPower(170402) ? h('a', {
              on: {
                click: () => {
                  this.removeRule(params)
                }
              }
            }, '删除') : ''
          }
        }
      ]
    }
  },
  watch: {
    'ruleDetail.ruleType': function (val) {
      if (val === '1') {
        this.baseValidate.base[1].pattern = /^(0|([1-9]\d*))([.]\d{1,2})?$/
        this.baseValidate.base[1].message = '最多精确到两位小数'
      } else {
        this.baseValidate.base[1].pattern = /^(0|([1-9]\d*))([.]\d)?$/
        this.baseValidate.base[1].message = '最多精确到一位小数'
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
        name: 'finance/dialogs/createRule',
        data: {
          scene: this.active
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
              ruleId: data.row.ruleId
            }
          }).then(res => {
            _this.ruleDetail = {}
            _this.getRules()
          }).catch(err => console.error(err))
        }
      })
    },
    addEl (index) {
      this.ruleDetail.details[index].chargeRules.push({ base: '', price: '' })
    },
    removeEl (index, no) {
      this.ruleDetail.details[index].chargeRules.splice(no, 1)
    },
    addItem () {
      this.ruleDetail.details.push({
        departure: [],
        destination: [],
        showRule: (this.ruleDetail.details.length + 1) + '',
        chargeRules: [
          { base: '', price: '' }
        ]
      })
    },
    removeItem (index) {
      this.ruleDetail.details.splice(index, 1)
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
      await this.formValidate(this.$refs['ruleBasic'])
      for (let i = 0; i < this.$refs['ruleRoute'].length; i++) {
        await this.formValidate(this.$refs['ruleRoute'][i])
      }
      for (let j = 0; j < this.$refs['ruleBase'].length; j++) {
        await this.formValidate(this.$refs['ruleBase'][j])
        await this.formValidate(this.$refs['rulePrice'][j])
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
                  departure: typeof item.departure === 'string' ? item.departure : item.departure[item.departure.length - 1],
                  destination: typeof item.destination === 'string' ? item.destination : item.destination[item.destination.length - 1],
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
    switchTab () {
      this.rulesQuery = {
        type: this.active,
        queryText: ''
      }
      this.getRules()
    },
    startQuery () {
      this.$refs['rulesQuery'].validate((valid) => {
        if (valid) {
          this.getRules()
        }
      })
    },
    getRules () {
      Server({
        url: '/finance/charge/listRules',
        method: 'get',
        params: {
          partnerType: this.active,
          partnerName: this.rulesQuery.type !== '4' ? this.rulesQuery.queryText : '',
          ruleName: this.rulesQuery.type === '4' ? this.rulesQuery.queryText : ''
        }
      }).then(res => {
        this.companyData = res.data.data
        if (this.ruleDetail && this.ruleDetail.ruleId && this.companyData.some(item => item.ruleId === this.ruleDetail.ruleId)) {
          this.showRuleDetail(this.companyData.find(item => item.ruleId === this.ruleDetail.ruleId))
        } else {
          this.ruleDetail = {}
        }
      }).catch(err => console.error(err))
    },
    showRuleDetail (data) {
      this.ruleDetail = {
        ruleId: data.ruleId,
        ruleType: data.detail.ruleType ? (data.detail.ruleType + '') : '1',
        ruleName: data.ruleName,
        details: Object.assign([], data.detail.rules.map((item, index) => {
          return {
            departure: item.departure + '',
            destination: item.destination + '',
            showRule: (index + 1) + '',
            chargeRules: item.chargeRules.map(el => {
              return {
                base: el.base ? (el.base / 100) + '' : '',
                price: el.price ? (el.price / 100) + '' : ''
              }
            })
          }
        }))
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.finance-rules
  .tab-box
    margin -15px
    padding 7px 15px
    border-bottom 15px solid #f5f7f9
    /deep/ .ivu-tabs-bar
      border-bottom none
      margin-bottom 1px
      .ivu-tabs-ink-bar
        bottom 2px

  .query-box
    /deep/ .ivu-select
      width: 100px
  .data-container
    margin: 35px 0 15px
    .company-table
      /deep/ .operation
        a
          display: none
      /deep/ tr:hover
        .operation
          a
            display: inline
    .operate-block
      display: flex
      justify-content space-between
      margin-bottom: 20px
      height: 35px
      .ivu-btn
        padding-left: 30px
        padding-right: 30px
      .suffix-btn
        background-color: #00a4bd
        color: #ffffff
        padding: 0 8px
        border-top-right-radius: 2px
        border-bottom-right-radius: 2px
    .rule-block
      border: 1px solid #C9CED9
      .rule-basic
        padding: 20px
        border-bottom: 1px solid #C9CED9
        .ivu-form-item
          margin-bottom: 0
        span
          display: inline-block
          color: #333333
          font-size: 12px
          line-height: 35px
          margin-right: 10px
      .rules-list
        height: 360px
        overflow: auto
        padding: 20px
        border-bottom: 1px solid #C9CED9
        .rule-item
          display: flex
          margin-bottom: 10px
          .rule-content
            position: relative
            .rule-route
              display: block
              position: absolute
              width: 500px
              top: 10px
              left: 20px
              z-index: 101
              .icon
                color: #9DA1B0
                font-size: 24px
                line-height: 28px
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
            /deep/ .ivu-collapse-header
              height: 60px
              background-color: #ffffff
              padding: 15px 20px 15px
              text-align: right
              .ivu-icon
                vertical-align: top
                margin-top: 8px
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
          margin-left: 25px
          cursor: pointer
          text-align: center
          height: 35px
          border: 1px dashed #c9ced9;
          line-height: 35px
          color: #00A4BD
          i
            font-size: 14px
    .rules-operation
      padding-top: 10px
      padding-bottom: 20px
      text-align: center
      .ivu-btn
        padding-left: 30px
        padding-right: 30px
    .data-empty
      display flex
      flex-direction column
      justify-content center
      align-items center
      height 500px
      border 1px solid #dcdee2
      .data-empty-img
        width 70px
        margin-bottom 12px
      p
        color #999999
        text-align center
</style>
