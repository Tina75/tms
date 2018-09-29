export const CAR_TYPE = [
  {value: 1, label: '平板'},
  {value: 2, label: '高栏'},
  {value: 3, label: '厢车'},
  {value: 4, label: '自卸'},
  {value: 5, label: '冷藏'},
  {value: 6, label: '保温'},
  {value: 7, label: '高低板'},
  {value: 8, label: '面包车'},
  {value: 9, label: '爬梯车'},
  {value: 10, label: '飞翼车'}
]

export const CAR_LENGTH = [
  {value: 1, label: '1.8米'},
  {value: 2, label: '2.7米'},
  {value: 3, label: '3.8米'},
  {value: 4, label: '4.2米'},
  {value: 5, label: '5米'},
  {value: 6, label: '6.2米'},
  {value: 7, label: '6.8米'},
  {value: 8, label: '7.7米'},
  {value: 9, label: '8.2米'},
  {value: 10, label: '8.7米'},
  {value: 11, label: '9.6米'},
  {value: 12, label: '11.7米'},
  {value: 13, label: '12.5米'},
  {value: 14, label: '13米'},
  {value: 15, label: '15米'},
  {value: 16, label: '16米'},
  {value: 17, label: '17.5米'}
]

export function getCarType (value) {
  for (let i = 0; i < CAR_TYPE.length; i++) {
    if (value === CAR_TYPE[i].value) {
      return CAR_TYPE[i].label
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
