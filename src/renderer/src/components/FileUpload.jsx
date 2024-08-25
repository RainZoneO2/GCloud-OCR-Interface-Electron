import { useState } from 'react'
import UploadResponse from './UploadResponse'

const FileUpload = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      alert('Please select a valid PDF file')
      e.target.value = null
    }
  }

  const handleUpload = async () => {
    if (file) {
      setLoading(true)
      const filePath = file.path
      try {
        const result = await window.electron.processDocument(filePath)
        setResponse(result)
      } catch (error) {
        console.error('Error processing file:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Upload PDF</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
      <button
        onClick={handleUpload}
        disabled={!file}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Upload
      </button>
      {loading && <p className="mt-4 text-blue-600">Uploading...</p>}
      {response && <UploadResponse response={response} />}
    </div>
  )
}

export default FileUpload
