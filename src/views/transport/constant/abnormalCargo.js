
import float from '@/libs/js/float'
import _ from 'lodash'

export const TABLE_COLUMNS_ONE = vm => [
  {
    title: '货物名称',
    key: 'cargoName',
    width: 139
  },
  {
    title: '包装方式',
    key: 'unit',
    width: 100
  },
  {
    title: '包装数量',
    key: 'quantity',
    width: 130,
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.cargoId) && (vm.cloneData[params.index].quantity !== 0)) {
        return h('div', [
          h('InputNumber', {
            props: {
              min: 0,
              max: Number(vm.parentOrderCargoList[params.index].quantity),
              value: Number(params.row.quantity),
              precision: 0
            },
            on: {
              'on-change': (val) => {
                vm.quantityVal = val
                let percent = vm.quantityVal / params.row.quantity // 当前数量拆分的百分比
                let cloneData = vm.cloneData[params.index]
                // 计算重量
                if (cloneData.weight !== 0 || cloneData.weightKg !== 0) {
                  // 区分吨和公斤
                  if (vm.WeightOption === 1) {
                    params.row.weight = float.round(cloneData.weight * percent, 3)
                    vm.weightVal = params.row.weight
                  } else {
                    params.row.weightKg = float.round(cloneData.weightKg * percent)
                    vm.weightVal = params.row.weightKg
                  }
                }
                // 计算体积
                if (cloneData.volume !== 0) {
                  params.row.volume = float.round(cloneData.volume * percent, 6)
                  vm.volumeVal = params.row.volume
                }
                // 计算货值
                if (cloneData.cargoCost !== 0) {
                  params.row.cargoCost = float.round(cloneData.cargoCost * percent)
                }
              }
            }
          })
        ])
      } else {
        if (vm.originData[params.index].quantity === vm.parentOrderCargoList[params.index].quantity) {
          return h('div', vm.originData[params.index].quantity)
        } else {
          return h('Tooltip', {
            props: {
              maxWidth: '240',
              offset: -12,
              content: '剩余' + vm.parentOrderCargoList[params.index].quantity,
              placement: 'top-start',
              transfer: true
            }
          }, [
            h('div', {
              style: {
                color: 'red'
              }
            }, vm.originData[params.index].quantity)
          ])
        }
      }
    }
  },
  {
    title: '体积（方）',
    key: 'volume',
    width: 130,
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.cargoId) && (vm.cloneData[params.index].volume !== 0)) {
        return h('div', [
          h('InputNumber', {
            props: {
              min: 0,
              max: float.round(vm.parentOrderCargoList[params.index].volume, 6) + 0.0000004, // 1.1 + 0.1 = 1.2000000002
              value: float.round(params.row.volume, 6),
              step: 0.000001,
              precision: 6,
              activeChange: false
            },
            style: {
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.volumeVal = null
                } else {
                  vm.volumeVal = float.round(val, 6)
                }
              }
            }
          })
        ])
      } else {
        if (float.round(vm.originData[params.index].volume, 6) === float.round(vm.parentOrderCargoList[params.index].volume, 6)) {
          return h('div', float.round(vm.originData[params.index].volume, 6))
        } else {
          return h('Tooltip', {
            props: {
              maxWidth: '240',
              offset: -12,
              content: '剩余' + float.round(vm.parentOrderCargoList[params.index].volume, 6),
              placement: 'top-start',
              transfer: true
            }
          }, [
            h('div', {
              style: {
                color: 'red'
              }
            }, float.round(vm.originData[params.index].volume, 6))
          ])
        }
      }
    }
  },
  {
    title: '操作',
    key: 'do',
    width: 160,
    className: 'padding-left-30',
    renderHeader: (h, params) => {
      return h('span', [
        h('span', params.column.title),
        h('Tooltip', {
          props: {
            'max-width': '200',
            offset: -9,
            content: '点击“确认”后，完成异常货物添加',
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
      if (vm.isSeparate && (vm.currentId === params.row.cargoId)) {
        return h('div', [
          h('a', {
            style: {
              marginRight: '20px',
              color: '#00a4bd'
            },
            on: {
              click: () => {
                vm.isSeparate = false
                if (vm.quantityVal === null || vm.weightVal === null || vm.volumeVal === null) {
                  vm.$Message.warning('数量、重量、体积不可为空')
                  vm.isSeparate = true
                  return
                }
                /**
                 * 当不修改数量：this.quantityVal = 0  或者修改数量和原来一致：this.quantityVal === params.row.quantity  &&
                 * 当不修改重量：this.weightVal = 0  或者修改重量和原来一致：this.weightVal === params.row.weight  &&
                 * 当不修改体积：this.volumeVal = 0  或者修改重量和原来一致：this.volumeVal === params.row.volume
                 * 部分整拆
                 * 重量、体积是小数，可能会出现1.000000000002的情况，需要转一下
                 */
                if (!((params.row.quantity !== 0 && vm.quantityVal === 0) || ((params.row.weight !== 0 || params.row.weightKg !== 0) && vm.weightVal === 0) || (params.row.volume !== 0 && vm.volumeVal === 0))) {
                  let cloneData = vm.cloneData[params.index]
                  params.row.quantity = cloneData.quantity
                  // 区分吨和公斤
                  if (vm.WeightOption === 1) {
                    params.row.weight = float.round(cloneData.weight, 3)
                  } else {
                    params.row.weightKg = float.round(cloneData.weightKg)
                  }
                  params.row.volume = float.round(cloneData.volume, 6)
                  params.row.cargoCost = float.round(cloneData.cargoCost)
                }
                // 没修改过数量、重量、体积中任意一个 或 修改过数量、重量、体积跟初始值一致   部分整拆
                if (vm.quantityVal === params.row.quantity && float.round(vm.weightVal, 3) === float.round(vm.WeightOption === 1 ? params.row.weight : params.row.weightKg, 3) && float.round(vm.volumeVal, 6) === float.round(params.row.volume, 6)) {
                  vm.separateWholeList(params.index)
                } else {
                  if (params.row.quantity !== 0) {
                    if (vm.quantityVal === 0) {
                      vm.$Message.warning('数量不能为0')
                      vm.isSeparate = true
                      return
                    }
                  }
                  if (params.row.weight !== 0 || params.row.weightKg !== 0) {
                    if (vm.weightVal === 0) {
                      vm.$Message.warning('重量不能为0')
                      vm.isSeparate = true
                      return
                    }
                  }
                  if (params.row.volume !== 0) {
                    if (vm.volumeVal === 0) {
                      vm.$Message.warning('体积不能为0')
                      vm.isSeparate = true
                      return
                    }
                  }
                  if (params.row.quantity !== 0) {
                    if (vm.quantityVal === params.row.quantity) {
                      vm.$Message.warning('数量必须修改')
                      vm.isSeparate = true
                      return
                    }
                  }
                  if (params.row.weight !== 0 || params.row.weightKg !== 0) {
                    if (float.round(vm.weightVal, 3) === float.round(vm.WeightOption === 1 ? params.row.weight : params.row.weightKg, 3)) {
                      vm.$Message.warning('重量必须修改')
                      vm.isSeparate = true
                      params.row.volume = vm.volumeVal
                      return
                    }
                  }
                  if (params.row.volume !== 0) {
                    if (float.round(vm.volumeVal, 6) === float.round(params.row.volume, 6)) {
                      vm.$Message.warning('体积必须修改')
                      vm.isSeparate = true
                      params.row.weight = vm.weightVal
                      return
                    }
                  }
                  // 拆部分
                  vm.separatePartList(params)
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
                vm.isSeparate = false
                let cloneData = vm.cloneData[params.index]
                params.row.quantity = cloneData.quantity
                // 区分吨和公斤
                if (vm.WeightOption === 1) {
                  params.row.weight = cloneData.weight
                } else {
                  params.row.weightKg = cloneData.weightKg
                }
                params.row.volume = cloneData.volume
                params.row.cargoCost = cloneData.cargoCost
              }
            }
          }, '取消')
        ])
      } else {
        if (vm.parentOrderCargoList[params.index].quantity === 1 ||
            float.round(vm.parentOrderCargoList[params.index].weight, 3) === 0.001 ||
            float.round(vm.parentOrderCargoList[params.index].weightKg) === 1 ||
            float.round(vm.parentOrderCargoList[params.index].volume, 6) === 0.000001) {
          return h('div', [
            h('a', {
              style: {
                color: '#00a4bd'
              },
              on: {
                click: () => {
                  vm.separateWholeList(params.index)
                }
              }
            }, '整笔异常')
          ])
        } else if (!(vm.parentOrderCargoList[params.index].quantity === 0 &&
                     vm.parentOrderCargoList[params.index].weight === 0 &&
                     vm.parentOrderCargoList[params.index].weightKg === 0 &&
                     vm.parentOrderCargoList[params.index].volume === 0)) {
          let renderBtn = [
            h('a', {
              style: {
                marginRight: '20px',
                color: '#00a4bd'
              },
              on: {
                click: () => {
                  vm.isSeparate = true
                  vm.currentId = params.row.cargoId
                  let cloneData = vm.cloneData[params.index]
                  vm.cargoCostVal = cloneData.cargoCost
                  vm.quantityVal = cloneData.quantity
                  vm.weightVal = vm.WeightOption === 1 ? cloneData.weight : cloneData.weightKg
                  vm.volumeVal = cloneData.volume
                }
              }
            }, '部分异常'),
            h('a', {
              style: {
                color: '#00a4bd'
              },
              on: {
                click: () => {
                  vm.separateWholeList(params.index)
                }
              }
            }, '整笔异常')
          ]
          return h('div', renderBtn)
        }
      }
    }
  }
]

export const TABLE_COLUMNS_TWO = vm => [
  {
    title: '货物名称',
    key: 'cargoName',
    width: 139
  },
  {
    title: '包装方式',
    key: 'unit',
    width: 100
  },
  {
    title: '包装数量',
    key: 'quantity',
    width: 130
  },
  {
    title: '体积（方）',
    key: 'volume',
    width: 130,
    render: (h, params) => {
      return h('div', float.round(params.row.volume, 6))
    }
  },
  {
    title: '操作',
    key: 'do',
    width: 160,
    className: 'padding-left-30',
    render: (h, params) => {
      return h('div', [
        h('a', {
          style: {
            color: '#00a4bd'
          },
          on: {
            click: () => {
              vm.isSeparate = false

              let hasParentList = vm.parentOrderCargoList.find((item) => {
                return item.cargoId === params.row.cargoId
              })
              // 找到原单对应数组的下标
              let index = _.findIndex(vm.parentOrderCargoList, hasParentList)
              hasParentList.quantity += params.row.quantity
              hasParentList.cargoCost = float.round(hasParentList.cargoCost + params.row.cargoCost)
              // 区分吨和公斤
              if (vm.WeightOption === 1) {
                hasParentList.weight = float.round(hasParentList.weight + params.row.weight, 3)
              } else {
                hasParentList.weightKg += params.row.weightKg
              }
              hasParentList.volume = float.round(hasParentList.volume + params.row.volume, 6)

              vm.$set(vm.parentOrderCargoList, index, hasParentList)
              vm.cloneData = vm.parentOrderCargoList
              vm.childOrderCargoList.splice(params.index, 1)

              // 合并单元格需要
              vm.mergeCell('childOrderCargoList', 'childOrderData')
            }
          }
        }, '移除')
      ])
    }
  }
]

export const COLUMNS_ONE_WEIGHT = vm => {
  return {
    title: '重量（吨）',
    key: 'weight',
    width: 130,
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.cargoId) && (vm.cloneData[params.index].weight !== 0)) {
        return h('div', [
          h('InputNumber', {
            props: {
              min: 0,
              max: float.round(vm.parentOrderCargoList[params.index].weight, 3) + 0.0004, // 1.01 + 0.01 = 1.02000000002
              value: float.round(params.row.weight, 3),
              step: 0.001,
              precision: 3,
              activeChange: false
            },
            style: {
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.weightVal = null
                } else {
                  vm.weightVal = float.round(val, 3)
                }
              }
            }
          })
        ])
      } else {
        if (float.round(vm.originData[params.index].weight, 3) === float.round(vm.parentOrderCargoList[params.index].weight, 3)) {
          return h('div', float.round(vm.originData[params.index].weight, 3))
        } else {
          return h('Tooltip', {
            props: {
              maxWidth: '240',
              offset: -12,
              content: '剩余' + float.round(vm.parentOrderCargoList[params.index].weight, 3),
              placement: 'top-start',
              transfer: true
            }
          }, [
            h('div', {
              style: {
                color: 'red'
              }
            }, float.round(vm.originData[params.index].weight, 3))
          ])
        }
      }
    }
  }
}

export const COLUMNS_ONE_WEIGHTKG = vm => {
  return {
    title: '重量（公斤）',
    key: 'weightKg',
    width: 130,
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.cargoId) && (vm.cloneData[params.index].weightKg !== 0)) {
        return h('div', [
          h('InputNumber', {
            props: {
              min: 0,
              max: float.round(vm.parentOrderCargoList[params.index].weightKg),
              value: float.round(params.row.weightKg),
              precision: 0
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.weightVal = null
                } else {
                  vm.weightVal = float.round(val)
                }
              }
            }
          })
        ])
      } else {
        if (float.round(vm.originData[params.index].weightKg) === float.round(vm.parentOrderCargoList[params.index].weightKg)) {
          return h('div', float.round(vm.originData[params.index].weightKg))
        } else {
          return h('Tooltip', {
            props: {
              maxWidth: '240',
              offset: -12,
              content: '剩余' + float.round(vm.parentOrderCargoList[params.index].weightKg),
              placement: 'top-start',
              transfer: true
            }
          }, [
            h('div', {
              style: {
                color: 'red'
              }
            }, float.round(vm.originData[params.index].weightKg))
          ])
        }
      }
    }
  }
}

export const COLUMNS_TWO_WEIGHT = vm => {
  return {
    title: '重量（吨）',
    key: 'weight',
    width: 130,
    render: (h, params) => {
      return h('div', float.round(params.row.weight, 3))
    }
  }
}

export const COLUMNS_TWO_WEIGHTKG = vm => {
  return {
    title: '重量（公斤）',
    key: 'weightKg',
    width: 130,
    render: (h, params) => {
      return h('div', float.round(params.row.weightKg))
    }
  }
}
