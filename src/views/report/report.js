import Server from '../../libs/js/server'
// 基本变量
export const CODE = 10000
// 发货方列表
export function reportForOperating (data) {
  return Server({
    url: '/report/for/operating',
    method: 'POST',
    data: data
  })
}
