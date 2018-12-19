
import float from '@/libs/js/float'

export const TABLE_COLUMNS_ONE = vm => [
  {
    title: '货物名称',
    key: 'cargoName'
  },
  {
    title: '货值',
    key: 'cargoCost',
    render: (h, params) => {
      return h('div', float.round(params.row.cargoCost / 100))
    }
  },
  {
    title: '数量',
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
                    params.row.weight = float.round(cloneData.weight * percent, 3)
                    vm.weightVal = params.row.weight
                  } else {
                    params.row.weightKg = float.round(cloneData.weightKg * percent)
                    vm.weightVal = params.row.weightKg
                  }
                }
                // 计算体积
                if (cloneData.volume !== 0) {
                  params.row.volume = float.round(cloneData.volume * percent, 4)
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
    title: '体积（方）',
    key: 'volume',
    render: (h, params) => {
      if (vm.isSeparate && (vm.currentId === params.row.id) && (vm.cloneData[params.index].volume !== 0)) {
        return h('div', [
          h('InputNumber', {
            props: {
              min: 0,
              max: float.round(vm.parentOrderCargoList[params.index].volume, 4) + 0.00004, // 1.1 + 0.1 = 1.2000000002
              value: float.round(params.row.volume, 4),
              step: 0.0001,
              precision: 4,
              activeChange: false
            },
            style: {
            },
            on: {
              'on-change': (val) => {
                if (val === null) {
                  vm.volumeVal = null
                } else {
                  vm.volumeVal = float.round(val, 4)
                }
              }
            }
          })
        ])
      } else {
        return h('div', float.round(params.row.volume, 4))
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
                    params.row.weight = float.round(cloneData.weight, 3)
                  } else {
                    params.row.weightKg = float.round(cloneData.weightKg)
                  }
                  params.row.volume = float.round(cloneData.volume, 4)
                  params.row.cargoCost = float.round(cloneData.cargoCost)
                }
                // 没修改过数量、重量、体积中任意一个 或 修改过数量、重量、体积跟初始值一致   部分整拆
                if (vm.quantityVal === params.row.quantity && float.round(vm.weightVal) === float.round(vm.WeightOption === 1 ? params.row.weight : params.row.weightKg) && float.round(vm.volumeVal, 4) === float.round(params.row.volume, 4)) {
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
                    if (float.round(vm.weightVal) === float.round(vm.WeightOption === 1 ? params.row.weight : params.row.weightKg)) {
                      vm.$Message.warning('重量必须修改')
                      vm.isSeparate = true
                      return
                    }
                  }
                  if (params.row.volume !== 0) {
                    if (float.round(vm.volumeVal, 4) === float.round(params.row.volume, 4)) {
                      vm.$Message.warning('体积必须修改')
                      vm.isSeparate = true
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
        if (params.row.quantity === 1 || float.round(params.row.weight, 3) === 0.001 || float.round(params.row.weightKg) === 1 || float.round(params.row.volume, 4) === 0.0001) {
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
          let renderBtn = [
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
    title: '货值',
    key: 'cargoCost',
    render: (h, params) => {
      return h('div', float.round(params.row.cargoCost / 100))
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
    title: '体积（方）',
    key: 'volume',
    render: (h, params) => {
      return h('div', float.round(params.row.volume, 4))
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
                    hasParentList.weight = float.round(hasParentList.weight + params.row.weight, 3)
                  } else {
                    hasParentList.weightKg += params.row.weightKg
                  }
                  hasParentList.volume = float.round(hasParentList.volume + params.row.volume, 4)
                  vm.childOrderCargoList.splice(params.index, 1)
                } else {
                  let child = vm.childOrderCargoList.splice(params.index, 1)
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
        return h('div', float.round(params.row.weight, 3))
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
        return h('div', float.round(params.row.weightKg))
      }
    }
  }
}

export const COLUMNS_TWO_WEIGHT = vm => {
  return {
    title: '重量（吨）',
    key: 'weight',
    render: (h, params) => {
      return h('div', float.round(params.row.weight, 3))
    }
  }
}

export const COLUMNS_TWO_WEIGHTKG = vm => {
  return {
    title: '重量（公斤）',
    key: 'weightKg',
    render: (h, params) => {
      return h('div', float.round(params.row.weightKg))
    }
  }
}
