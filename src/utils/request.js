import axios from 'axios'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'

  // 以下是网友提供的接口
  // baseURL: 'https://lianghj.top:8888/api/private/v1/'
})

export default request
