<template>
  <div class="finance-rules">
    <div class="tab-box">
      <Tabs v-model="active" @on-click="switchTab">
        <TabPane v-for="(name, key) in sceneMap" :key="key" :label="name" :name="key" />
      </Tabs>
    </div>
    <div class="data-container">
      <div class="operate-block">
        <Button type="primary" @click="addRule">新增规则</Button>
        <div class="query-box">
          <Form :model="rulesQuery" inline>
            <FormItem>
              <Select v-model="rulesQuery.type" clearable>
                <Option value="1">{{sceneMap[active]}}名称</Option>
                <Option value="2">规则名称</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input v-model="rulesQuery.queryText" :placeholder="`请输入${sceneMap[active]}名称`" style="width: auto">
              <Icon slot="suffix" type="ios-search" @click="getRules"/>
              </Input>
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="list-box">
        <Row :gutter="20">
          <Col span="7">
          <Table :columns="companyColumn" :data="companyData" height="500" highlight-row @on-row-click="showRuleDetail"></Table>
          </Col>
          <Col v-if="ruleDetail.ruleId" span="17">
          <div class="rule-block">
            <div class="rule-basic">
              <Form inline>
                <span>按</span>
                <FormItem>
                  <Select v-model="ruleDetail.ruleType">
                    <Option value="1">重量</Option>
                    <Option value="2">体积</Option>
                  </Select>
                </FormItem>
                <span>计算&#12288;&#12288;单位：元/吨</span>
                <span>&#12288;&#12288;&#12288;&#12288;&#12288;规则名：</span>
                <FormItem>
                  <Input v-model="ruleDetail.ruleName" :placeholder="`请输入${sceneMap[active]}名称`" style="width: auto" />
                </FormItem>
              </Form>
            </div>
            <div class="rules-list">
              <div v-for="(item, index) in ruleDetail.details" :key="index" class="rule-item">
                <div class="item-remove">
                  <Icon type="md-remove-circle" @click="removeItem(index)"/>
                </div>
                <Collapse v-model="ruleShowIndex">
                  <Panel name="1" hide-arrow>
                    <div slot class="rule-route">
                      <Row :gutter="20">
                        <Col span="6">
                        <AreaSelect v-model="item.departure" placeholder="请输入始发地" class="search-input-senior" />
                        </Col>
                        <Col span="6">
                        <AreaSelect v-model="item.destination" placeholder="请输入目的地" class="search-input-senior" />
                        </Col>
                      </Row>
                    </div>
                    <div slot="content">
                      <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-default ivu-table-with-fixed-top">
                          <div class="ivu-table-header">
                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%">
                              <colgroup>
                                <col width="150">
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
                                <col width="150">
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
                                  <td class="">
                                    <div class="ivu-table-cell">
                                      <span>大于等于</span>
                                      <Input v-model="el.base" style="width: 120px"/>
                                      <span>吨</span>
                                    </div>
                                  </td>
                                  <td class="">
                                    <div class="ivu-table-cell">
                                      <Input v-model="el.price" style="width: 120px"/>
                                      <span>元/吨</span>
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
              <Button type="primary" @click="saveRules">保存</Button>
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
  components: {AreaSelect},
  mixins: [ BasePage ],
  data () {
    return {
      active: '1',
      ruleShowIndex: '1',
      sceneMap: {
        1: '发货方',
        2: '承运商',
        3: '外转方'
      },
      rulesQuery: {
        type: '',
        queryText: ''
      },
      companyData: [],
      ruleDetail: {
        ruleType: '1',
        ruleName: '',
        detail: []
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
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.removeRule(params)
                }
              }
            }, '删除')
          }
        }
      ]
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
        content: '确认从删除该条规则吗？',
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
            _this.getRules()
          }).catch(err => console.error(err))
        }
      })
    },
    addEl (index) {
      this.ruleDetail.details[index].chargeRules.push({base: '', price: ''})
    },
    removeEl (index, no) {
      this.ruleDetail.details[index].chargeRules.splice(no, 1)
    },
    addItem () {
      this.ruleDetail.details.push({
        departure: '',
        destination: '',
        chargeRules: [
          {base: '', price: ''}
        ]
      })
    },
    removeItem (index) {
      this.ruleDetail.details.splice(index, 1)
    },
    saveRules () {
      Server({
        url: '/finance/charge/updateRule',
        method: 'post',
        data: Object.assign({}, this.ruleDetail, {
          details: this.ruleDetail.details.map(item => {
            return {
              departure: item.departure[item.departure.length - 1],
              destination: item.destination[item.destination.length - 1],
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
        this.getRules()
      }).catch(err => console.error(err))
    },
    switchTab () {
      this.getRules()
    },
    getRules () {
      Server({
        url: '/finance/charge/listRules',
        method: 'get',
        params: {
          partnerType: this.active,
          partnerName: this.rulesQuery.type === '1' ? this.rulesQuery.queryText : '',
          ruleName: this.rulesQuery.type === '2' ? this.rulesQuery.queryText : ''
        }
      }).then(res => {
        this.companyData = res.data.data
        if (this.ruleDetail && this.ruleDetail.ruleId) {
          this.showRuleDetail(this.companyData.find(item => item.ruleId === this.ruleDetail.ruleId))
        }
      }).catch(err => console.error(err))
    },
    showRuleDetail (data) {
      this.ruleDetail = {
        ruleId: data.ruleId,
        ruleType: data.detail.ruleType + '',
        ruleName: data.ruleName,
        details: Object.assign([], data.detail.rules.map(item => {
          return {
            departure: item.departure + '',
            destination: item.destination + '',
            chargeRules: item.chargeRules.map(el => {
              return {
                base: el.base / 100,
                price: el.price / 100
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
  .data-container
    margin: 35px 0 15px
    .operate-block
      display: flex
      justify-content space-between
      margin-bottom: 20px
      height: 35px
      .ivu-btn
        padding-left: 30px
        padding-right: 30px
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
          .item-remove
            width: 25px
            align-items center
            align-self: center
            .ivu-icon
              color: #EC4E4E
              font-size: 14px
          .ivu-collapse
            flex: 1
            /deep/ .ivu-collapse-header
              height: 54px
              background-color: #ffffff
              padding: 10px 20px
            .ivu-table-cell
              span
                padding: 10px
            .adjuster
              i
                display: inline-block
                font-size: 14px
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
</style>
