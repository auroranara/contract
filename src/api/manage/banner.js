import request from '@/utils/request'

export function getBannerList(data) {
  return request({
    url: '/api/systemBanner/banners',
    method: 'get',
    params: {
      title: data.title,
      status: data.status,
      page: data.page,
      limit: data.limit
    }
  })
}
export function saveBanner(data) {
  return request({
    url: '/api/systemBanner/banner',
    method: 'post',
    data
  })
}

export function editBanner(data) {
  return request({
    url: '/api/systemBanner/banner/' + data.id,
    method: 'post',
    data
  })
}
export function getBanner(id) {
  return request({
    url: '/api/systemBanner/banner/' + id,
    method: 'get'
  })
}

export function changeStatus(data) {
  return request({
    url: '/api/systemBanner/status',
    method: 'post',
    params: {
      id: data.id,
      status: data.status
    }
  })
}
