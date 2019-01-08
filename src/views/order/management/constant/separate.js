
import float from '@/libs/js/float'
import { roundFee, renderFee, renderVolume, roundVolume, roundWeight, renderWeight, roundWeightKg, renderWeightKg } from '@/libs/js/config'
import TagNumberInput from '@/components/TagNumberInput'
export const TABLE_COLUMNS_ONE = vm => [
  {
    title: '货物名称',
    key: 'cargoName'
  },
  {
    title: '包装数量',
    key: 'quantity',
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.id) && (vm.cloneData[params.index].quantity !== 0)) {
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
                    params.row.weight = roundWeight(cloneData.weight * percent)
                    vm.weightVal = params.row.weight
                  } else {
                    params.row.weightKg = roundWeightKg(cloneData.weightKg * percent)
                    vm.weightVal = params.row.weightKg
                  }
                }
                // 计算体积
                if (cloneData.volume !== 0) {
                  params.row.volume = roundVolume(cloneData.volume * percent)
                  vm.volumeVal = params.row.volume
                }
                // 计算货值
                if (cloneData.cargoCost !== 0) {
                  params.row.cargoCost = roundFee(cloneData.cargoCost * percent)
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
    title: '体积（方）',
    key: 'volume',
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.id) && (vm.cloneData[params.index].volume !== 0)) {
        return h('div', [
          h(TagNumberInput, {
            props: {
              min: 0,
              max: roundVolume(vm.parentOrderCargoList[params.index].volume) + 0.0000004, // 1.1 + 0.1 = 1.2000000002
              value: roundVolume(params.row.volume),
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
                  vm.volumeVal = roundVolume(val)
                }
              }
            }
          })
        ])
      } else {
        return h('div', float.round(params.row.volume, 6))
      }
    }
  },
  {
    title: '货值',
    key: 'cargoCost',
    render: (h, params) => {
      return renderFee(h, params.row.cargoCost)
      // return h('div', float.round(params.row.cargoCost / 100))
    }
  },
  {
    title: '包装方式',
    key: 'unit',
    width: 100
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
      if (vm.isSeparate && (vm.currentId === params.row.id)) {
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
                    params.row.weight = roundWeight(cloneData.weight)
                  } else {
                    params.row.weightKg = roundWeightKg(cloneData.weightKg)
                  }
                  params.row.volume = roundVolume(cloneData.volume)
                  params.row.cargoCost = roundFee(cloneData.cargoCost)
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
                    if (roundWeight(vm.weightVal) === roundWeight(vm.WeightOption === 1 ? params.row.weight : params.row.weightKg)) {
                      vm.$Message.warning('重量必须修改')
                      vm.isSeparate = true
                      params.row.volume = vm.volumeVal
                      return
                    }
                  }
                  if (params.row.volume !== 0) {
                    if (roundVolume(vm.volumeVal) === roundVolume(params.row.volume)) {
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
        if ((params.row.quantity === 1 || roundWeight(params.row.weight) === 0.001 || roundWeightKg(params.row.weightKg) === 1 || roundVolume(params.row.volume) === 0.000001) && vm.muiltyOrderCargoList.length === 0) {
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
            }, '拆整笔')
          ])
        } else {
          let renderBtn = []
          if (vm.muiltyOrderCargoList.length === 0) {
            renderBtn = [
              h('a', {
                style: {
                  marginRight: '20px',
                  color: '#00a4bd'
                },
                on: {
                  click: () => {
                    vm.isSeparate = true
                    vm.currentId = params.row.id
                    let cloneData = vm.cloneData[params.index]
                    vm.cargoCostVal = cloneData.cargoCost
                    vm.quantityVal = cloneData.quantity
                    vm.weightVal = vm.WeightOption === 1 ? cloneData.weight : cloneData.weightKg
                    vm.volumeVal = cloneData.volume
                  }
                }
              }, '拆部分')
            ]
          }

          // 只有一条货物记录没有拆整笔按钮
          if (vm.parentOrderCargoList.length > 1) {
            renderBtn.push(
              h('a', {
                style: {
                  color: '#00a4bd'
                },
                on: {
                  click: () => {
                    vm.separateWholeList(params.index)
                  }
                }
              }, '拆整笔')
            )
          } else {
            if (((vm.parentOrderCargoList[0].quantity && vm.parentOrderCargoList[0].quantity !== 1) ||
            (vm.parentOrderCargoList[0].weight && vm.parentOrderCargoList[0].weight !== 0.001) ||
            (vm.parentOrderCargoList[0].weightKg && vm.parentOrderCargoList[0].weightKg !== 1) ||
            (vm.parentOrderCargoList[0].volume && vm.parentOrderCargoList[0].volume !== 0.000001)) &&
            vm.childOrderCargoList.length === 0) {
            /**
             * 只有一条货物记录，并且重量和体积不是最小值，数量不为1，就有【拆批量】功能
             */
              renderBtn.push(
                h('a', {
                  style: {
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      vm.separateAverage()
                    }
                  }
                }, '拆批量')
              )
            }
          }
          return h('div', renderBtn)
        }
      }
    }
  }
]

export const TABLE_COLUMNS_TWO = vm => [
  {
    title: '货物名称',
    key: 'cargoName'
  },
  {
    title: '包装数量',
    key: 'quantity'
  },
  {
    title: '体积（方）',
    key: 'volume',
    render: (h, params) => {
      return renderVolume(h, params.row.volume)
      // return h('div', float.round(params.row.volume, 6))
    }
  },
  {
    title: '货值',
    key: 'cargoCost',
    render: (h, params) => {
      return renderFee(h, params.row.cargoCost)
      // return h('div', float.round(params.row.cargoCost / 100))
    }
  },
  {
    title: '包装方式',
    key: 'unit',
    width: 100
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
              vm.isSeparate = false
              if (!vm.parentOrderCargoList.length) {
                let restoreData = vm.childOrderCargoList.splice(params.index, 1)
                vm.parentOrderCargoList.push(restoreData[0])
              } else {
                let hasParentList = vm.parentOrderCargoList.find((item) => {
                  return item.id === params.row.id
                })
                if (hasParentList !== undefined) {
                  hasParentList.quantity = Number(hasParentList.quantity)
                  hasParentList.cargoCost = Number(hasParentList.cargoCost)
                  // 区分吨和公斤
                  if (vm.WeightOption === 1) {
                    hasParentList.weight = Number(hasParentList.weight)
                  } else {
                    hasParentList.weightKg = Number(hasParentList.weightKg)
                  }
                  hasParentList.volume = Number(hasParentList.volume)
                  params.row.quantity = Number(params.row.quantity)
                  params.row.cargoCost = Number(params.row.cargoCost)
                  // 区分吨和公斤
                  if (vm.WeightOption === 1) {
                    params.row.weight = Number(params.row.weight)
                  } else {
                    params.row.weightKg = Number(params.row.weightKg)
                  }
                  params.row.volume = Number(params.row.volume)

                  hasParentList.quantity += params.row.quantity
                  hasParentList.cargoCost = float.round(hasParentList.cargoCost + params.row.cargoCost)
                  // 区分吨和公斤
                  if (vm.WeightOption === 1) {
                    hasParentList.weight = roundWeight(hasParentList.weight + params.row.weight)
                  } else {
                    hasParentList.weightKg += params.row.weightKg
                  }
                  hasParentList.volume = roundVolume(hasParentList.volume + params.row.volume)
                  if (vm.childOrderCargoList.length > 0) {
                    // 拆部分
                    vm.childOrderCargoList.splice(params.index, 1)
                  } else {
                    // 拆批量
                    vm.muiltyOrderCargoList.splice(params.index, 1)
                  }
                } else {
                  let child
                  if (vm.childOrderCargoList.length > 0) {
                    child = vm.childOrderCargoList.splice(params.index, 1)
                  } else {
                    child = vm.muiltyOrderCargoList.splice(params.index, 1)
                  }
                  vm.parentOrderCargoList.push(child[0])
                }
              }
            }
          }
        }, '还原')
      ])
    }
  }
]

export const COLUMNS_ONE_WEIGHT = vm => {
  return {
    title: '重量（吨）',
    key: 'weight',
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.id) && (vm.cloneData[params.index].weight !== 0)) {
        return h('div', [
          h(TagNumberInput, {
            props: {
              min: 0,
              max: roundWeight(vm.parentOrderCargoList[params.index].weight) + 0.0004, // 1.01 + 0.01 = 1.02000000002
              value: roundWeight(params.row.weight),
              step: 0.001,
              precision: vm.$numberPrecesion.weight,
              activeChange: false
            },
            style: {
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.weightVal = null
                } else {
                  vm.weightVal = roundWeight(val)
                }
              }
            }
          })
        ])
      } else {
        return h('div', roundWeight(params.row.weight))
      }
    }
  }
}

export const COLUMNS_ONE_WEIGHTKG = vm => {
  return {
    title: '重量（公斤）',
    key: 'weightKg',
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.id) && (vm.cloneData[params.index].weightKg !== 0)) {
        return h('div', [
          h(TagNumberInput, {
            props: {
              min: 0,
              max: roundWeightKg(vm.parentOrderCargoList[params.index].weightKg),
              value: roundWeightKg(params.row.weightKg),
              precision: vm.$numberPrecesion.weightKg
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.weightVal = null
                } else {
                  vm.weightVal = roundWeightKg(val)
                }
              }
            }
          })
        ])
      } else {
        return renderWeightKg(h, params.row.weightKg)
        // return h('div', float.round(params.row.weightKg))
      }
    }
  }
}

export const COLUMNS_TWO_WEIGHT = vm => {
  return {
    title: '重量（吨）',
    key: 'weight',
    render: (h, params) => {
      return renderWeight(h, params.row.weight)
      // return h('div', roundWeight(params.row.weight))
    }
  }
}

export const COLUMNS_TWO_WEIGHTKG = vm => {
  return {
    title: '重量（公斤）',
    key: 'weightKg',
    render: (h, params) => {
      return renderWeightKg(h, params.row.weightKg)
      // return h('div', roundWeightKg(params.row.weightKg))
    }
  }
}
/**
 * 拆批量的时候调用，因为 和拆部分逻辑不一样，所以重复了一个
 * @param {*} vm
 */
export const COLUMNS_THREE_WEIGHT = vm => {
  return {
    title: '重量（吨）',
    key: 'weight',
    render: (h, params) => {
      if ((vm.cargoList[0].weight !== 0)) {
        return h('div', [
          h(TagNumberInput, {
            props: {
              min: 0,
              value: roundWeight(params.row.weight),
              precision: vm.$numberPrecesion.weight,
              activeChange: false
            },
            style: {
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.handleChange(params.index, 'weight', 0)
                } else {
                  vm.handleChange(params.index, 'weight', val)
                }
              }
            }
          })
        ])
      } else {
        return h('div', roundWeight(params.row.weight))
      }
    }
  }
}
export const COLUMNS_THREE_WEIGHTKG = vm => {
  return {
    title: '重量（公斤）',
    key: 'weightKg',
    render: (h, params) => {
      if ((vm.cargoList[0].weightKg !== 0)) {
        return h('div', [
          h(TagNumberInput, {
            props: {
              min: 0,
              value: roundWeightKg(params.row.weightKg),
              precision: vm.$numberPrecesion.weightKg
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.handleChange(params.index, 'weightKg', 0)
                } else {
                  vm.handleChange(params.index, 'weightKg', val)
                }
              }
            }
          })
        ])
      } else {
        return renderWeightKg(h, params.row.weightKg)
        // return h('div', float.round(params.row.weightKg))
      }
    }
  }
}
// 批量拆单的列表表头字段
export const TABLE_COLUMNS_AVERAGE = (vm) => [
  {
    title: '货物名称',
    key: 'cargoName'
  },
  {
    title: '包装数量',
    key: 'quantity'
  },
  {
    title: '体积（方）',
    key: 'volume',
    render: (h, params) => {
      return renderVolume(h, params.row.volume)
      // return h('div', float.round(params.row.volume, 6))
    }
  },
  {
    title: '货值',
    key: 'cargoCost',
    render: (h, params) => {
      return renderFee(h, params.row.cargoCost)
      // return h('div', float.round(params.row.cargoCost / 100))
    }
  },
  {
    title: '包装方式',
    key: 'unit',
    width: 100
  }
]
export const TABLE_COLUMNS_AVERAGE_EDIT = (vm) => {
  return [
    {
      title: '货物名称',
      key: 'cargoName'
    },
    {
      title: '包装数量',
      key: 'quantity',
      render (h, params) {
        if (!params.row.quantity) {
          return h('span', '-')
        }
        return h(
          TagNumberInput,
          {
            props: {
              precision: 0,
              value: parseInt(params.row.quantity)
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.handleChange(params.index, 'quantity', 0)
                } else {
                  vm.handleChange(params.index, 'quantity', val)
                }
              }
            }
          }
        )
      }
    },
    {
      title: '体积（方）',
      key: 'volume',
      render: (h, params) => {
        return h(
          TagNumberInput,
          {
            props: {
              precision: vm.$numberPrecesion.volume,
              value: roundVolume(params.row.volume)
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.handleChange(params.index, 'volume', 0)
                } else {
                  vm.handleChange(params.index, 'volume', val)
                }
              }
            }
          }
        )
      }
    },
    {
      title: '货值',
      key: 'cargoCost',
      render: (h, params) => {
        return renderFee(h, params.row.cargoCost)
        // return h('div', float.round(params.row.cargoCost / 100))
      }
    },
    {
      title: '包装方式',
      key: 'unit',
      width: 100
    },
    {
      title: '操作',
      key: 'operation',
      render (h, params) {
        return h('a', {
          style: {
            color: '#00a4bd'
          },
          on: {
            click: () => {
              vm.removeCargo(params.index)
            }
          }
        }, '移除')
      }
    }
  ]
}
