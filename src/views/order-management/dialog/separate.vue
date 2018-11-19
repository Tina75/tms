<template>
  <Modal v-model="visiable" :mask-closable="false" class="separate-dialog" width="850" @on-visible-change="close">
    <p slot="header" class="dialog-title">
      <!-- <Icon type="ios-information-circle"></Icon> -->
      <span>拆单</span>
    </p>
    <div>
      <div class="order-number" style="margin-bottom: 8px;">
        <Row>
          <i-col span="12">
            订单号：{{ orderNo }}
          </i-col>
          <i-col span="12">
            客户：{{ detailData.consignerName }}
          </i-col>
        </Row>
      </div>
      <div class="order-number">
        <Row>
          <i-col>
            始发地／目的地：{{ detailData.startName + ' - ' + detailData.endName }}
          </i-col>
        </Row>
      </div>
      <div style="border-top: 1px dashed rgba(203,206,211,1);margin-bottom: 21px;"></div>
      <div v-if="childOrderCargoList.length" class="order-number">
        子订单1：{{ childOneNo }}
      </div>
      <Table :columns="columns1" :data="parentOrderCargoList"></Table>
    </div>
    <div v-if="childOrderCargoList.length">
      <div style="border-top: 1px dashed rgba(203,206,211,1);margin: 32px 0 20px;"></div>
      <div class="order-number">
        子订单2：{{ childTwoNo }}
      </div>
      <Table :columns="columns2" :data="childOrderCargoList"></Table>
    </div>
    <div slot="footer">
      <Button
        :disabled="!(parentOrderCargoList.length && childOrderCargoList.length)"
        type="primary"
        @click="save">
        确定
      </Button>
      <Button  type="default"  @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import float from '@/libs/js/float'
import _ from 'lodash'
export default {
  name: 'separate',
  mixins: [BaseDialog],
  data () {
    return {
      isSeparate: false,
      columns1: [
        {
          title: '货物名称',
          key: 'cargoName'
        },
        {
          title: '货值',
          key: 'cargoCost',
          render: (h, params) => {
            return h('div', parseFloat((params.row.cargoCost / 100).toFixed(2)))
          }
        },
        {
          title: '数量',
          key: 'quantity',
          render: (h, params) => {
            const vm = this
            if (this.isSeparate && (this.currentId === params.row.id) && (this.cloneData[params.index].quantity !== 0)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 0,
                    max: Number(this.parentOrderCargoList[params.index].quantity),
                    value: Number(params.row.quantity),
                    precision: 0
                  },
                  style: {
                  },
                  on: {
                    'on-change': (val) => {
                      this.quantityVal = val
                      let percent = this.quantityVal / params.row.quantity // 当前数量拆分的百分比
                      console.log(percent)
                      // 计算重量
                      if (this.cloneData[params.index].weight !== 0) {
                        params.row.weight = float.round(this.cloneData[params.index].weight * percent, 2)
                        this.weightVal = float.round(this.cloneData[params.index].weight * percent, 2)
                      }
                      // 计算体积
                      if (this.cloneData[params.index].volume !== 0) {
                        params.row.volume = float.round(this.cloneData[params.index].volume * percent, 1)
                        this.volumeVal = float.round(this.cloneData[params.index].volume * percent, 1)
                      }
                      // 计算货值
                      if (vm.cloneData[params.index].cargoCost !== 0) {
                        params.row.cargoCost = vm.cloneData[params.index].cargoCost * percent
                      }
                    }
                  }
                })
              ])
            } else {
              return h('div', params.row.quantity)
            }
          }
        },
        {
          title: '单位',
          key: 'unit',
          width: 80
        },
        {
          title: '重量（吨）',
          key: 'weight',
          render: (h, params) => {
            if (this.isSeparate && (this.currentId === params.row.id) && (this.cloneData[params.index].weight !== 0)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 0,
                    max: parseFloat((this.parentOrderCargoList[params.index].weight).toFixed(2)) + 0.004, // 1.01 + 0.01 = 1.02000000002
                    value: parseFloat((params.row.weight).toFixed(2)),
                    step: 0.01,
                    precision: 2,
                    activeChange: false
                  },
                  style: {
                  },
                  on: {
                    'on-change': (val) => {
                      if (val === null) {
                        this.weightVal = null
                      } else {
                        this.weightVal = parseFloat(val.toFixed(2))
                      }
                    }
                  }
                })
              ])
            } else {
              return h('div', parseFloat((params.row.weight).toFixed(2)))
            }
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, params) => {
            if (this.isSeparate && (this.currentId === params.row.id) && (this.cloneData[params.index].volume !== 0)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 0,
                    max: parseFloat((this.parentOrderCargoList[params.index].volume).toFixed(1)) + 0.04, // 1.1 + 0.1 = 1.2000000002
                    value: parseFloat((params.row.volume).toFixed(1)),
                    step: 0.1,
                    precision: 1,
                    activeChange: false
                  },
                  style: {
                  },
                  on: {
                    'on-change': (val) => {
                      if (val === null) {
                        this.volumeVal = null
                      } else {
                        this.volumeVal = parseFloat(val.toFixed(1))
                      }
                    }
                  }
                })
              ])
            } else {
              return h('div', parseFloat((params.row.volume).toFixed(1)))
            }
          }
        },
        {
          title: '操作',
          key: 'do',
          width: 140,
          className: 'padding-left-30',
          renderHeader: (h, params) => {
            return h('span', [
              h('span', params.column.title),
              h('Tooltip', {
                props: {
                  'max-width': '200',
                  offset: -9,
                  content: '点击“确认”后，完成货物拆分',
                  placement: 'top-start',
                  transfer: true
                }
              }, [
                h('Icon', {
                  props: {
                    type: 'ios-information-circle',
                    size: '16',
                    color: '#FFBB44'
                  },
                  style: {
                    verticalAlign: 'sub',
                    marginLeft: '2px'
                  }
                })
              ])
            ])
          },
          render: (h, params) => {
            if (this.isSeparate && (this.currentId === params.row.id)) {
              return h('div', [
                h('a', {
                  style: {
                    marginRight: '20px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.isSeparate = false
                      console.log(this.quantityVal, params.row.quantity)
                      console.log(this.weightVal, params.row.weight)
                      console.log(this.volumeVal, params.row.volume)
                      if (this.quantityVal === null || this.weightVal === null || this.volumeVal === null) {
                        this.$Message.warning('数量、重量、体积不可为空')
                        this.isSeparate = true
                        return
                      }
                      /**
                       * 当不修改数量：this.quantityVal = 0  或者修改数量和原来一致：this.quantityVal === params.row.quantity  &&
                       * 当不修改重量：this.weightVal = 0  或者修改重量和原来一致：this.weightVal === params.row.weight  &&
                       * 当不修改体积：this.volumeVal = 0  或者修改重量和原来一致：this.volumeVal === params.row.volume
                       * 部分整拆
                       * 重量、体积是小数，可能会出现1.000000000002的情况，需要转一下
                       */
                      if (!((params.row.quantity !== 0 && this.quantityVal === 0) || (params.row.weight !== 0 && this.weightVal === 0) || (params.row.volume !== 0 && this.volumeVal === 0))) {
                        params.row.quantity = this.cloneData[params.index].quantity
                        params.row.weight = this.cloneData[params.index].weight
                        params.row.volume = this.cloneData[params.index].volume
                        params.row.cargoCost = float.round(this.cloneData[params.index].cargoCost)
                      }
                      // 没修改过数量、重量、体积中任意一个 或 修改过数量、重量、体积跟初始值一致   部分整拆
                      if (this.quantityVal === params.row.quantity && parseFloat(this.weightVal.toFixed(2)) === parseFloat(params.row.weight.toFixed(2)) && parseFloat(this.volumeVal.toFixed(1)) === parseFloat(params.row.volume.toFixed(1))) {
                        this.separateWholeList(params.index)
                      } else {
                        if (params.row.quantity !== 0) {
                          if (this.quantityVal === 0) {
                            this.$Message.warning('数量不能为0')
                            this.isSeparate = true
                            return
                          }
                        }
                        if (params.row.weight !== 0) {
                          if (this.weightVal === 0) {
                            this.$Message.warning('重量不能为0')
                            this.isSeparate = true
                            return
                          }
                        }
                        if (params.row.volume !== 0) {
                          if (this.volumeVal === 0) {
                            this.$Message.warning('体积不能为0')
                            this.isSeparate = true
                            return
                          }
                        }
                        if (params.row.quantity !== 0) {
                          if (this.quantityVal === params.row.quantity) {
                            this.$Message.warning('数量必须修改')
                            this.isSeparate = true
                            return
                          }
                        }
                        if (params.row.weight !== 0) {
                          if (parseFloat(this.weightVal.toFixed(2)) === parseFloat(params.row.weight.toFixed(2))) {
                            this.$Message.warning('重量必须修改')
                            this.isSeparate = true
                            return
                          }
                        }
                        if (params.row.volume !== 0) {
                          if (parseFloat(this.volumeVal.toFixed(1)) === parseFloat(params.row.volume.toFixed(1))) {
                            this.$Message.warning('体积必须修改')
                            this.isSeparate = true
                            return
                          }
                        }
                        // 拆部分
                        this.separatePartList(params)
                      }
                    }
                  }
                }, '确认'),
                h('a', {
                  style: {
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.isSeparate = false
                      params.row.quantity = this.cloneData[params.index].quantity
                      params.row.weight = this.cloneData[params.index].weight
                      params.row.volume = this.cloneData[params.index].volume
                      params.row.cargoCost = this.cloneData[params.index].cargoCost
                    }
                  }
                }, '取消')
              ])
            } else {
              if (params.row.quantity === 1 || parseFloat(params.row.weight.toFixed(2)) === 0.01 || parseFloat(params.row.volume.toFixed(1)) === 0.1) {
                return h('div', [
                  h('a', {
                    style: {
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        // console.log(params)
                        this.separateWholeList(params.index)
                      }
                    }
                  }, '拆整笔')
                ])
              } else {
                let renderBtn = [
                  h('a', {
                    style: {
                      marginRight: '20px',
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        this.isSeparate = true
                        this.currentId = params.row.id
                        this.cargoCostVal = this.cloneData[params.index].cargoCost
                        this.quantityVal = this.cloneData[params.index].quantity
                        this.weightVal = this.cloneData[params.index].weight
                        this.volumeVal = this.cloneData[params.index].volume
                      }
                    }
                  }, '拆部分')
                ]
                // 只有一条货物记录没有拆整笔按钮
                if (this.parentOrderCargoList.length > 1) {
                  renderBtn.push(
                    h('a', {
                      style: {
                        color: '#00a4bd'
                      },
                      on: {
                        click: () => {
                          // console.log(params)
                          this.separateWholeList(params.index)
                        }
                      }
                    }, '拆整笔')
                  )
                }
                return h('div', renderBtn)
              }
            }
          }
        }
      ],
      columns2: [
        {
          title: '货物名称',
          key: 'cargoName'
        },
        {
          title: '货值',
          key: 'cargoCost',
          render: (h, params) => {
            return h('div', parseFloat((params.row.cargoCost / 100).toFixed(2)))
          }
        },
        {
          title: '数量',
          key: 'quantity'
        },
        {
          title: '单位',
          key: 'unit',
          width: 80
        },
        {
          title: '重量（吨）',
          key: 'weight',
          render: (h, params) => {
            return h('div', parseFloat((params.row.weight).toFixed(2)))
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, params) => {
            return h('div', parseFloat((params.row.volume).toFixed(1)))
          }
        },
        {
          title: '操作',
          key: 'do',
          width: 140,
          className: 'padding-left-30',
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  color: '#00a4bd'
                },
                on: {
                  click: () => {
                    // console.log(params)
                    this.isSeparate = false
                    if (!this.parentOrderCargoList.length) {
                      let restoreData = this.childOrderCargoList.splice(params.index, 1)
                      this.parentOrderCargoList.push(restoreData[0])
                    } else {
                      let hasParentList = this.parentOrderCargoList.find((item) => {
                        return item.id === params.row.id
                      })
                      if (hasParentList !== undefined) {
                        hasParentList.quantity = Number(hasParentList.quantity)
                        hasParentList.cargoCost = Number(hasParentList.cargoCost)
                        hasParentList.weight = Number(hasParentList.weight)
                        hasParentList.volume = Number(hasParentList.volume)
                        params.row.quantity = Number(params.row.quantity)
                        params.row.cargoCost = Number(params.row.cargoCost)
                        params.row.weight = Number(params.row.weight)
                        params.row.volume = Number(params.row.volume)

                        hasParentList.quantity += params.row.quantity
                        hasParentList.cargoCost += params.row.cargoCost
                        hasParentList.weight += params.row.weight
                        hasParentList.volume += params.row.volume
                        this.childOrderCargoList.splice(params.index, 1)
                      } else {
                        let child = this.childOrderCargoList.splice(params.index, 1)
                        this.parentOrderCargoList.push(child[0])
                      }
                    }
                  }
                }
              }, '还原')
            ])
          }
        }
      ],
      detailData: {},
      subOrderNum: void 0, // 子订单数
      parentOrderCargoList: [],
      childOrderCargoList: [],
      currentId: 0,
      // childPortionData: {}, // 拆分成子单后的数据
      quantityVal: 0,
      weightVal: 0,
      volumeVal: 0,
      cargoCostVal: 0,
      cloneData: [] // 复制一份货物详情数据
    }
  },

  computed: {
    childOneNo () {
      return this.orderNo.indexOf('-') > -1 ? this.orderNo : this.orderNo + '-1'
    },
    childTwoNo () {
      return this.orderNo.indexOf('-') > -1 ? this.orderNo.substring(0, this.orderNo.indexOf('-')) + '-' + (this.subOrderNum + 1) : this.orderNo + '-2'
    }
  },

  mounted: function () {
    this.getData()
    this.getSubOrderNum()
  },

  methods: {
    save () {
      // 将参数中的重量体积四舍五入
      this.parentOrderCargoList.map((item) => {
        item.weight = parseFloat(item.weight.toFixed(2))
        item.volume = parseFloat(item.volume.toFixed(1))
      })
      this.childOrderCargoList.map((item) => {
        item.weight = parseFloat(item.weight.toFixed(2))
        item.volume = parseFloat(item.volume.toFixed(1))
      })
      const data = {
        id: this.id,
        orderCargoList: [[...this.parentOrderCargoList], [...this.childOrderCargoList]]
      }
      Server({
        url: 'order/disassemble',
        method: 'post',
        data: data,
        ignoreCode: true
      }).then((res) => {
        if (res.data.code === 50012) {
          this.close()
          this.openSeparateHintDialog([]) // 重复拆单
        } else {
          if (this.childOneNo + this.childTwoNo === res.data.data.orderNoList.join('')) {
            this.$Message.success('拆单成功')
            this.close()
          } else {
            this.close()
            this.openSeparateHintDialog(res.data.data.orderNoList) // 拆单过后子订单号有修改
          }
        }
        this.ok()
      })
    },
    // 拆单完成后的弹窗提示
    openSeparateHintDialog (list) {
      this.openDialog({
        name: 'order-management/dialog/separateHint',
        data: { orderNoList: list },
        methods: {
          ok (node) {}
        }
      })
    },
    // 查货物详情
    getData () {
      Server({
        url: 'order/detail?id=' + this.id,
        method: 'get'
      }).then((res) => {
        console.log(res)
        this.detailData = res.data.data
        let orderCargoList = res.data.data.orderCargoList
        // 将返回数据列表中货值、数量、重量、体积的''替换成0
        orderCargoList.map((item) => {
          item.cargoCost = item.cargoCost ? item.cargoCost : 0
          item.quantity = item.quantity ? item.quantity : 0
          item.weight = item.weight ? item.weight : 0
          item.volume = item.volume ? item.volume : 0
        })
        this.parentOrderCargoList = orderCargoList
        this.cloneData = _.cloneDeep(this.parentOrderCargoList)
      })
    },
    // 获取子订单数
    getSubOrderNum () {
      Server({
        url: 'order/getSubOrderNum',
        method: 'get',
        data: {
          orderId: this.id
        }
      }).then((res) => {
        this.subOrderNum = res.data.data.subOrderNum
      })
    },
    // 拆整笔
    separateWholeList (index) {
      let childList = this.parentOrderCargoList.splice(index, 1)[0]
      this.childOrderCargoList.unshift(childList)
      this.cloneData = this.parentOrderCargoList
    },
    // 拆部分
    separatePartList (params) {
      // 修改原单数据
      let parentData = { ...params.row }
      let quantity = params.row.quantity
      let weight = params.row.weight
      let volume = params.row.volume
      let cargoCost = params.row.cargoCost
      parentData.quantity = this.quantityVal ? params.row.quantity - this.quantityVal : 0
      parentData.weight = this.weightVal ? params.row.weight - this.weightVal : 0
      parentData.volume = this.volumeVal ? params.row.volume - this.volumeVal : 0
      // 货值比例关联优先级：数量-->重量-->体积
      if (params.row.quantity !== 0) {
        parentData.cargoCost = parseInt(float.round(cargoCost * parentData.quantity) / quantity)
      } else if (params.row.weight !== 0) {
        parentData.cargoCost = parseInt(float.round(cargoCost * parentData.weight) / weight)
      } else {
        parentData.cargoCost = parseInt(float.round(cargoCost * parentData.volume) / volume)
      }
      this.$set(this.parentOrderCargoList, params.index, parentData)
      this.$set(this.cloneData, params.index, parentData)

      // 生成子单数据
      let childData = { ...params.row }
      childData.cargoCost = float.round(cargoCost - parentData.cargoCost)
      childData.quantity = this.quantityVal ? this.quantityVal : params.row.quantity
      childData.weight = this.weightVal ? this.weightVal : params.row.weight
      childData.volume = this.volumeVal ? this.volumeVal : params.row.volume
      this.childOrderCargoList.unshift(childData)
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog-title
  text-align center
  font-size 16px
  font-family 'PingFangSC-Medium'
  font-weight 700
  color rgba(47,50,62,1)
  letter-spacing 1px
.order-number
  height 20px
  font-size 14px
  font-family 'PingFangSC-Regular'
  font-weight 400
  color rgba(47,50,62,1)
  line-height 20px
  margin-bottom 20px
.ivu-btn-primary[disabled]
  background-color rgba(0,164,189,0.3)
  color #fff
</style>
<style lang='stylus'>
.padding-left-30
  .ivu-table-cell
    padding-left 30px
.separate-dialog
  .ivu-modal-body
    padding 20px 32px
  .ivu-table-cell
    padding-left 26px
</style>
