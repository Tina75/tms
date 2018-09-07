import axios from '@/libs/axios'
export function senderList (data) {
  return axios({
    url: 'trade/withdraw/list',
    method: 'post',
    data: data
  })
}
