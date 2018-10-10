<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="850">
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
                      console.log(this.quantityVal)
                      if (this.quantityVal === null || this.weightVal === null || this.volumeVal === null) {
                        this.$Message.warning('数量、重量、体积不可为空')
                        this.isSeparate = true
                        return
                      }
                      // 当不修改数量：this.quantityVal = 0  或者修改数量和原来一致：this.quantityVal === params.row.quantity  部分整拆
                      if (!this.quantityVal || this.quantityVal === params.row.quantity) {
                        this.separateWholeList(params.index)
                      } else {
                        // 数量修改后，体积和重量必须修改
                        if ((this.weightVal === 0 || this.weightVal === params.row.weight) || (this.volumeVal === 0 || this.volumeVal === params.row.volume)) {
                          this.$Message.warning('数量修改后，体积和重量必须修改')
                          this.isSeparate = true
                          return
                        }
                        // 修改原单数据
                        let parentData = { ...params.row }
                        let quantity = params.row.quantity
                        let cargoCost = params.row.cargoCost
                        parentData.quantity = params.row.quantity - this.quantityVal
                        parentData.weight = (this.weightVal || this.weightVal === null) ? params.row.weight - this.weightVal : 0
                        parentData.volume = (this.volumeVal || this.volumeVal === null) ? params.row.volume - this.volumeVal : 0
                        parentData.cargoCost = (cargoCost * parentData.quantity / quantity)
                        // 货值、重量体积保留2位小数
                        // parentData.weight = Number(parentData.weight).toFixed(2)
                        // parentData.volume = Number(parentData.volume).toFixed(2)
                        // parentData.cargoCost = Number(parentData.cargoCost).toFixed(2)
                        this.$set(this.parentOrderCargoList, params.index, parentData)

                        // 生成子单数据
                        let childData = { ...params.row }
                        childData.cargoCost = cargoCost - parentData.cargoCost
                        childData.quantity = this.quantityVal || 0
                        childData.weight = this.weightVal === null ? 0 : (this.weightVal ? this.weightVal : params.row.weight)
                        childData.volume = this.volumeVal === null ? 0 : (this.volumeVal ? this.volumeVal : params.row.volume)
                        // 货值、重量体积保留2位小数
                        // childData.weight = Number(childData.weight).toFixed(2)
                        // childData.volume = Number(childData.volume).toFixed(2)
                        // childData.cargoCost = Number(childData.cargoCost).toFixed(2)
                        this.childOrderCargoList.unshift(childData)
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
              if (params.row.quantity <= 1) {
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
                        this.cargoCostVal = 0
                        this.quantityVal = 0
                        this.weightVal = 0
                        this.volumeVal = 0
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
            return h('div', (Number(params.row.cargoCost) / 100).toFixed(2))
          }
        },
        {
          title: '数量',
          key: 'quantity',
          render: (h, params) => {
            if (this.isSeparate && (this.currentId === params.row.id)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 1,
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
          title: '单位',
          key: 'unit',
          width: 80
        },
        {
          title: '重量（吨）',
          key: 'weight',
          render: (h, params) => {
            if (this.isSeparate && (this.currentId === params.row.id)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 0,
                    max: Number(params.row.weight),
                    value: Number(params.row.weight),
                    precision: 2,
                    activeChange: false
                  },
                  style: {
                  },
                  on: {
                    'on-change': (val) => {
                      this.weightVal = val
                    }
                  }
                })
              ])
            } else {
              return h('div', Number(params.row.weight).toFixed(2))
            }
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, params) => {
            if (this.isSeparate && (this.currentId === params.row.id)) {
              return h('div', [
                h('InputNumber', {
                  props: {
                    min: 0,
                    max: Number(params.row.volume),
                    value: Number(params.row.volume),
                    precision: 1,
                    activeChange: false
                  },
                  style: {
                  },
                  on: {
                    'on-change': (val) => {
                      this.volumeVal = val
                    }
                  }
                })
              ])
            } else {
              return h('div', Number(params.row.volume).toFixed(1))
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
            return h('div', (Number(params.row.cargoCost) / 100).toFixed(2))
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
            return h('div', Number(params.row.weight).toFixed(2))
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, params) => {
            return h('div', Number(params.row.volume).toFixed(1))
          }
        }
      ],
      parentOrderCargoList: [],
      childOrderCargoList: [],
      currentId: 0,
      childPortionData: {}, // 拆分成子单后的数据
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
        this.parentOrderCargoList = res.data.data.orderCargoList
      })
    },
    // 拆整笔
    separateWholeList (index) {
      let childList = this.parentOrderCargoList.splice(index, 1)[0]
      this.childOrderCargoList.unshift(childList)
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog-title
  text-align center
  font-size 16px
  font-family 'PingFangSC-Medium'
  color rgba(47,50,62,1)
  letter-spacing 1px
.order-number
  height 20px
  font-size 13px
  font-family 'PingFangSC-Regular'
  font-weight 400
  color rgba(47,50,62,1)
  line-height 20px
  margin-bottom 15px
</style>
<style lang='stylus'>
.padding-left-30
  .ivu-table-cell
    padding-left 30px
</style>
