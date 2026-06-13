import { useState } from 'react'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'restaurant_uploads'

export default function ImageUpload({ currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || '')

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', 'restaurant-menu')

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      if (data.secure_url) {
        setPreview(data.secure_url)
        onUploaded(data.secure_url)
      } else {
        alert('Upload failed. Check Cloudinary settings.')
      }
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {preview && (
        <img src={preview} alt="Food" className="w-full h-32 object-cover rounded-lg mb-2" />
      )}
      <label className="block">
        <span className="sr-only">Choose food image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-red-700 file:cursor-pointer"
        />
      </label>
      {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
    </div>
  )
}
