<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="850">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>拆单</span>
      </p>
      <div>
        <div class="order-number">
          订单号：{{ childOrderCargoList.length ? id + '-1' : id }}
        </div>
        <Table :columns="columns1" :data="parentOrderCargoList"></Table>
      </div>
      <div v-if="childOrderCargoList.length">
        <div style="border-top: 1px dashed rgba(203,206,211,1);margin: 32px 0 20px;"></div>
        <div class="order-number">
          订单号：{{ id + '-2' }}
        </div>
        <Table :columns="columns2" :data="childOrderCargoList"></Table>
      </div>
      <div slot="footer">
        <Button  type="primary"  @click="save">确定</Button>
        <Button  type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'editUser',
  mixins: [BaseDialog],
  data () {
    return {
      visibale: true,
      isSeparate: false,
      columns1: [
        {
          title: '操作',
          key: 'do',
          width: 200,
          render: (h, params) => {
            if (this.isSeparate && (this.currentId === params.row.id)) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.isSeparate = false
                      if (!this.quantityVal) {
                        this.childPortionData = this.parentOrderCargoList.splice(params.index, 1)[0]
                        this.childOrderCargoList.unshift(this.childPortionData)
                      } else {
                        let parentData = { ...params.row }
                        let quantity = params.row.quantity
                        let cargoCost = params.row.cargoCost
                        parentData.quantity = params.row.quantity - this.quantityVal
                        parentData.weight = params.row.weight - this.weightVal
                        parentData.volume = params.row.volume - this.volumeVal
                        parentData.cargoCost = (params.row.cargoCost * parentData.quantity / quantity)
                        this.$set(this.parentOrderCargoList, params.index, parentData) // 修改原单数据

                        let childData = { ...params.row }
                        childData.cargoCost = cargoCost - parentData.cargoCost
                        childData.quantity = this.quantityVal
                        childData.weight = this.weightVal
                        childData.volume = this.volumeVal
                        this.childOrderCargoList.unshift(childData) // 生成子单数据
                      }
                    }
                  }
                }, '确认'),
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
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
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.isSeparate = true
                      this.currentId = params.row.id
                      this.childPortionData = params.row
                    }
                  }
                }, '拆部分'),
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      // console.log(params)
                      let childList = this.parentOrderCargoList.splice(params.index, 1)
                      this.childOrderCargoList.unshift(childList[0])
                    }
                  }
                }, '拆整笔')
              ])
            }
          }
        },
        {
          title: '货物名称',
          key: 'cargoName'
        },
        {
          title: '货值',
          key: 'cargoCost'
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
                    min: 1,
                    max: Number(params.row.weight),
                    value: Number(params.row.weight)
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
              return h('div', params.row.weight)
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
                    min: 1,
                    max: Number(params.row.volume),
                    value: Number(params.row.volume)
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
              return h('div', params.row.volume)
            }
          }
        }
      ],
      columns2: [
        {
          title: '操作',
          key: 'do',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  marginRight: '5px',
                  color: '#00a4bd'
                },
                on: {
                  click: () => {
                    console.log(params)
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
          key: 'cargoCost'
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
          key: 'weight'
        },
        {
          title: '体积（方）',
          key: 'volume'
        }
      ],
      parentOrderCargoList: [],
      childOrderCargoList: [],
      currentId: 0,
      parentPortionData: {}, // 原单拆分后的数据
      childPortionData: {}, // 拆分成子单后的数据
      quantityVal: 0,
      weightVal: 0,
      volumeVal: 0,
      cargoCostVal: 0
    }
  },
  watch: {
    visibale: function (val) {
      !val && this.close()
    }
  },

  mounted: function () {
    console.log(this.id)
    this.getData()
  },

  methods: {
    save () {
    },
    getData () {
      Server({
        url: 'order/detail?id=' + this.id,
        method: 'get'
      }).then((res) => {
        console.log(res)
        this.parentOrderCargoList = res.data.data.orderCargoList
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog
  p
    text-align center
.order-number
  height 20px
  font-size 13px
  font-family PingFangSC-Regular
  font-weight 400
  color rgba(47,50,62,1)
  line-height 20px
  margin-bottom 15px
</style>
