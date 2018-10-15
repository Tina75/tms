<template>
  <div>
    <Modal v-model="visiable" :mask-closable="false" class="separate-dialog" width="850" @on-visible-change="close">
      <p slot="header" class="dialog-title">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>拆单</span>
      </p>
      <div>
        <div class="order-number">
          订单号：{{ orderNo }}
        </div>
        <Table :columns="columns1" :data="parentOrderCargoList"></Table>
      </div>
      <div v-if="childOrderCargoList.length">
        <div style="border-top: 1px dashed rgba(203,206,211,1);margin: 32px 0 20px;"></div>
        <div class="order-number">
          子订单：
        </div>
        <Table :columns="columns2" :data="childOrderCargoList"></Table>
      </div>
      <div slot="footer">
        <Button
          :disabled="!(parentOrderCargoList.length && childOrderCargoList.length)"
          :style="(parentOrderCargoList.length && childOrderCargoList.length) || 'background-color: rgba(0,164,189,0.3);color: #fff;'"
          type="primary"
          @click="save">
          确定
        </Button>
        <Button  type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'separate',
  mixins: [BaseDialog],
  data () {
    return {
      isSeparate: false,
      columns1: [
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
                      console.log(this.quantityVal, params.row.quantity)
                      console.log(this.weightVal, params.row.weight)
                      console.log(this.volumeVal, params.row.volume)
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
                    }
                  }
                }, '取消')
              ])
            } else {
              console.log(this.parentOrderCargoList)
              console.log(params.row.weight, params.row.volume)
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
                // 只有一条货物记录没有拆整笔按钮
                if (this.parentOrderCargoList.length > 1) {
                  return h('div', [
                    h('a', {
                      style: {
                        marginRight: '20px',
                        color: '#00a4bd'
                      },
                      on: {
                        click: () => {
                          this.isSeparate = true
                          this.currentId = params.row.id
                          this.cargoCostVal = params.row.cargoCost
                          this.quantityVal = params.row.quantity
                          this.weightVal = params.row.weight
                          this.volumeVal = params.row.volume
                        }
                      }
                    }, '拆部分'),
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
                  return h('div', [
                    h('a', {
                      style: {
                        marginRight: '20px',
                        color: '#00a4bd'
                      },
                      on: {
                        click: () => {
                          this.isSeparate = true
                          this.currentId = params.row.id
                          this.cargoCostVal = params.row.cargoCost
                          this.quantityVal = params.row.quantity
                          this.weightVal = params.row.weight
                          this.volumeVal = params.row.volume
                        }
                      }
                    }, '拆部分')
                  ])
                }
              }
            }
          }
        },
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
            if (this.isSeparate && (this.currentId === params.row.id) && (params.row.quantity !== 0)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 0,
                    max: Number(params.row.quantity),
                    value: Number(params.row.quantity),
                    precision: 0
                  },
                  style: {
                  },
                  on: {
                    'on-change': (val) => {
                      this.quantityVal = val
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
          title: '包装方式',
          key: 'unit',
          width: 80
        },
        {
          title: '重量（吨）',
          key: 'weight',
          render: (h, params) => {
            if (this.isSeparate && (this.currentId === params.row.id) && (params.row.weight !== 0)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 0,
                    max: parseFloat((params.row.weight).toFixed(2)) + 0.009, // 1.01 + 0.01 = 1.02000000002
                    value: parseFloat((params.row.weight).toFixed(2)),
                    step: 0.01,
                    precision: 2,
                    activeChange: false
                  },
                  style: {
                  },
                  on: {
                    'on-change': (val) => {
                      this.weightVal = parseFloat(val.toFixed(2))
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
            if (this.isSeparate && (this.currentId === params.row.id) && (params.row.volume !== 0)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 0,
                    max: parseFloat((params.row.volume).toFixed(1)) + 0.09, // 1.1 + 0.1 = 1.2000000002
                    value: parseFloat((params.row.volume).toFixed(1)),
                    step: 0.1,
                    precision: 1,
                    activeChange: false
                  },
                  style: {
                  },
                  on: {
                    'on-change': (val) => {
                      this.volumeVal = parseFloat(val.toFixed(1))
                    }
                  }
                })
              ])
            } else {
              return h('div', parseFloat((params.row.volume).toFixed(1)))
            }
          }
        }
      ],
      columns2: [
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
                    // this.quantityVal = params.row.quantity
                    // this.weightVal = params.row.weight
                    // this.volumeVal = params.row.volume
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
        },
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
          title: '包装方式',
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
        }
      ],
      parentOrderCargoList: [],
      childOrderCargoList: [],
      currentId: 0,
      // childPortionData: {}, // 拆分成子单后的数据
      quantityVal: 0,
      weightVal: 0,
      volumeVal: 0,
      cargoCostVal: 0
    }
  },

  mounted: function () {
    this.getData()
  },

  methods: {
    save () {
      const data = {
        id: this.id,
        orderCargoList: [[...this.parentOrderCargoList], [...this.childOrderCargoList]]
      }
      Server({
        url: 'order/disassemble',
        method: 'post',
        data: data
      }).then((res) => {
        this.ok()
        this.$Message.success('拆单成功')
        this.close()
      })
    },
    // 查货物详情
    getData () {
      Server({
        url: 'order/detail?id=' + this.id,
        method: 'get'
      }).then((res) => {
        console.log(res)
        let orderCargoList = res.data.data.orderCargoList
        // 将返回数据列表中的''替换成0
        orderCargoList.map((item) => {
          item.quantity = item.quantity ? item.quantity : 0
          item.weight = item.weight ? item.weight : 0
          item.volume = item.volume ? item.volume : 0
        })
        this.parentOrderCargoList = orderCargoList
      })
    },
    // 拆整笔
    separateWholeList (index) {
      let childList = this.parentOrderCargoList.splice(index, 1)[0]
      this.childOrderCargoList.unshift(childList)
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
        parentData.cargoCost = (cargoCost * parentData.quantity / quantity)
      } else if (params.row.weight !== 0) {
        parentData.cargoCost = (cargoCost * parentData.weight / weight)
      } else {
        parentData.cargoCost = (cargoCost * parentData.volume / volume)
      }
      this.$set(this.parentOrderCargoList, params.index, parentData)

      // 生成子单数据
      let childData = { ...params.row }
      childData.cargoCost = cargoCost - parentData.cargoCost
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
  font-size 13px
  font-family 'PingFangSC-Regular'
  font-weight 400
  color rgba(47,50,62,1)
  line-height 20px
  margin-bottom 16px
</style>
<style lang='stylus'>
.padding-left-30
  .ivu-table-cell
    padding-left 30px
.separate-dialog
  .ivu-modal-body
    padding 20px 32px
</style>
