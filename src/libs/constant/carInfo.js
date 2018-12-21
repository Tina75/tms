export const CAR_TYPE = [
  { value: 1, label: '平板' },
  { value: 2, label: '高栏' },
  { value: 3, label: '厢车' },
  { value: 4, label: '自卸' },
  { value: 5, label: '冷藏' },
  { value: 6, label: '保温' },
  { value: 7, label: '高低板' },
  { value: 8, label: '面包车' },
  { value: 9, label: '爬梯车' },
  { value: 10, label: '飞翼车' }
]

export const CAR_TYPE1 = {
  1: '平板',
  2: '高栏',
  3: '厢车',
  4: '自卸',
  5: '冷藏',
  6: '保温',
  7: '高低板',
  8: '面包车',
  9: '爬梯车',
  10: '飞翼车'
}

export const PACKAGE_TYPE = [
  { value: '纸箱', label: '纸箱' },
  { value: '木箱', label: '木箱' },
  { value: '铁桶', label: '铁桶' },
  { value: '纤袋', label: '纤袋' },
  { value: '麻袋', label: '麻袋' },
  { value: '木架', label: '木架' }
]

export const DRIVER_TYPE = [
  { id: '1', name: '合约' },
  { id: '2', name: '临时' },
  { id: '3', name: '自有' },
  { id: '4', name: '挂靠' }
]

export const DRIVER_TYPE1 = {
  1: '合约',
  2: '临时',
  3: '自有',
  4: '挂靠'
}

export const CAR_LENGTH = [
  { value: 1, label: '1.8米' },
  { value: 2, label: '2.7米' },
  { value: 3, label: '3.8米' },
  { value: 4, label: '4.2米' },
  { value: 5, label: '5米' },
  { value: 6, label: '6.2米' },
  { value: 7, label: '6.8米' },
  { value: 8, label: '7.7米' },
  { value: 9, label: '8.2米' },
  { value: 10, label: '8.7米' },
  { value: 11, label: '9.6米' },
  { value: 12, label: '11.7米' },
  { value: 13, label: '12.5米' },
  { value: 14, label: '13米' },
  { value: 15, label: '15米' },
  { value: 16, label: '16米' },
  { value: 17, label: '17.5米' }
].sort((a, b) => Number(b.label.substr(0, b.label.length - 1)) - Number(a.label.substr(0, a.label.length - 1)))

export const CAR_LENGTH1 = {
  1: '1.8米',
  2: '2.7米',
  3: '3.8米',
  4: '4.2米',
  5: '5米',
  6: '6.2米',
  7: '6.8米',
  8: '7.7米',
  9: '8.2米',
  10: '8.7米',
  11: '9.6米',
  12: '11.7米',
  13: '12.5米',
  14: '13米',
  15: '15米',
  16: '16米',
  17: '17.5米'
}

export function getCarType (value) {
  for (let i = 0; i < CAR_TYPE.length; i++) {
    if (value === CAR_TYPE[i].value) {
      return CAR_TYPE[i].label
    }
  }
  return ''
}

export function getDriverType (value) {
  for (let i = 0; i < DRIVER_TYPE.length; i++) {
    if (value === DRIVER_TYPE[i].value) {
      return DRIVER_TYPE[i].label
    }
  }
  return ''
}

export function getCarLength (value) {
  for (let i = 0; i < CAR_LENGTH.length; i++) {
    if (value === CAR_LENGTH[i].value) {
      return CAR_LENGTH[i].label
    }
  }
  return ''
}
