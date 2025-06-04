'use client'

import { ChangeEvent, useState } from 'react'
import { supabase } from '@/libs/db/supabase'

export const UploadImage = (props: { menuItemId: string }) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != undefined && e.target.files?.length > 0) {
      setFile(e.target.files![0])
    }
  }

  const handleUpload = async () => {
    try {
      setUploading(true)
      if (!file) return

      const { data, error } = await supabase.storage
        .from('menu-images')
        .update(`public/${props.menuItemId}`, file, { upsert: true })

      if (error) throw error

      if (data) {
        const publicUrl = await supabase.storage
          .from('menu-images')
          .getPublicUrl(data.path)

        console.log('File uploaded successfully:', publicUrl)
        alert('File uploaded successfully!')
      }
    } catch (e) {
      console.error('Error uploading file:', e)
      throw e
    }
  }

  return (
    <div>
      <h1>File Upload</h1>
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'uploading...' : 'upload'}
      </button>
    </div>
  )
}