import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import UploadResponse from './UploadResponse'

const FileUpload = ({ apiEndpoint }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResponse(null)
    if (!file) {
      alert('No file selected')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setResponse(response.data)
    } catch (error) {
      setResponse({ error: 'Failed to upload file' })
      console.error('Error uploading file:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Submit
        </button>
      </form>
      {loading && <p className="mt-4 text-blue-600">Uploading...</p>} {/* Display loading text */}
      {response && <UploadResponse response={response} />} {/* Display the response */}
    </div>
  )
}

FileUpload.propTypes = {
  apiEndpoint: PropTypes.string.isRequired
}

export default FileUpload
