/**
 * 货物信息表格
 */
import { renderFee, renderVolume, renderQuantity, renderWeight, renderWeightKg, isNumber } from '@/libs/js/config'
export const orderNo = {
  title: '订单号',
  key: 'orderNo',
  tooltip: true
}
export const customerOrderNo = {
  title: '客户订单号',
  key: 'customerOrderNo',
  render: (h, p) => {
    return h('span', p.row.customerOrderNo || '-')
  }
}
export const cargoName = {
  title: '货物名称',
  key: 'cargoName',
  // tooltip: true
  render: (h, params) => {
    let text = ''
    if (params.row.cargoName.length > 12) { // 显示tooltip
      text = params.row.cargoName.slice(0, 12) + '...'
      return h('div', [
        h('Tooltip', {
          props: {
            placeholder: 'bottom',
            transfer: true
          }
        }, [
          h('span', {
          }, text),
          h('div', {
            slot: 'content',
            style: {
              whiteSpace: 'normal'
            }
          }, params.row.cargoName)
        ])
      ])
    } else {
      return h('span', {
      }, params.row.cargoName || '-')
    }
  }
}
export const cargoNo = {
  title: '货物编号',
  key: 'cargoNo',
  // tooltip: true
  render: (h, params) => {
    let text = ''
    if (params.row.cargoNo.length > 12) { // 显示tooltip
      text = params.row.cargoNo.slice(0, 12) + '...'
      return h('div', [
        h('Tooltip', {
          props: {
            placeholder: 'bottom',
            transfer: true
          }
        }, [
          h('span', {
          }, text),
          h('div', {
            slot: 'content',
            style: {
              whiteSpace: 'normal'
            }
          }, params.row.cargoNo)
        ])
      ])
    } else {
      return h('span', {
      }, params.row.cargoNo || '-')
    }
  }
}
export const weight = {
  title: '重量（吨）',
  key: 'weight',
  render: (h, p) => {
    return renderWeight(h, p.row.weight)
  }
}
export const weightKg = {
  title: '重量（公斤）',
  key: 'weightKg',
  render: (h, p) => {
    return renderWeightKg(h, p.row.weightKg)
  }
}
export const volume = {
  title: '体积（方）',
  key: 'volume',
  render: (h, p) => {
    return renderVolume(h, p.row.volume)
  }
}
export const cargoCost = {
  title: '货值（元）',
  key: 'cargoCost',
  render: (h, params) => {
    return renderFee(h, params.row.cargoCost)
  }
}
export const unit = {
  title: '包装方式',
  key: 'unit',
  render: (h, p) => {
    return h('span', p.row.unit || '-')
  }
}
export const quantity = {
  title: '包装数量',
  key: 'quantity',
  render: (h, p) => {
    return renderQuantity(h, p.row.quantity)
  }
}
export const dimension = {
  title: '包装尺寸（毫米）',
  key: 'dimension',
  render: (h, p) => {
    let text = ''
    if (isNumber(p.row.dimension.length) || isNumber(p.row.dimension.width) || isNumber(p.row.dimension.height)) {
      text = (isNumber(p.row.dimension.length) ? p.row.dimension.length : '-') + ' x ' + (isNumber(p.row.dimension.width) ? p.row.dimension.width : '-') + ' x ' + (isNumber(p.row.dimension.height) ? p.row.dimension.height : '-')
    } else {
      text = '-'
    }
    return h('span', text)
  }
}
export const remark1 = {
  title: '备注1',
  key: 'remark1',
  render: (h, p) => {
    return h('span', p.row.remark1 || '-')
  }
}
export const remark2 = {
  title: '备注2',
  key: 'remark2',
  render: (h, p) => {
    return h('span', p.row.remark2 || '-')
  }
}
