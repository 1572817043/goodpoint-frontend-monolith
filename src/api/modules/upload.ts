import { http } from '../index'

// 上传图片
export async function uploadImage(file: File, directory: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('directory', directory)

  return http.post<any, string>('/upload/image', formData, {
    headers: { 'Content-Type': null },
    timeout: 60000,
  })
}
