import server from '@/libs/js/server'
import OssClient from 'ali-oss'
/**
* 后端获取阿里云access token, region 参数
* 初始化oss client，用户上传模板前需要准备好
*/

const initOssInstance = (vm) => {
  return server({
    method: 'post',
    url: 'file/prepareUpload',
    data: {
      bizType: 'order',
      fileCount: 1,
      fileSuffix: 'jpg'
    }
  })
    .then((response) => {
      const { data } = response.data
      vm.ossDir = data.ossKeys[0]
      vm.ossClient = new OssClient({
        accessKeyId: data.ossTokenDTO.stsAccessId,
        accessKeySecret: data.ossTokenDTO.stsAccessKey,
        stsToken: data.ossTokenDTO.stsToken,
        bucket: data.ossTokenDTO.bucketName,
        endpoint: data.ossTokenDTO.endpoint
      })
      return response
    })
}

export default initOssInstance
