import PropTypes from 'prop-types'

const UploadResponse = ({ response }) => {
  if (!response) return null

  const handleExport = () => {
    window.electron.exportResponse(response).then((result) => {
      if (result.success) {
        alert(`File saved successfully to ${result.filePath}`)
      } else {
        alert('File save canceled or failed')
      }
    })
  }

  const renderParagraphs = () => {
    return response.paragraphs.map((paragraph, index) => (
      <p key={index} className="text-gray-800">
        {paragraph}
      </p>
    ))
  }

  const renderFormFields = () => {
    return response.formFields.map((field, index) => (
      <p key={index} className="text-gray-800">
        <strong>{field.name}:</strong> {field.value}
      </p>
    ))
  }

  return (
    <div>
      <div className="mt-4 upload-response">
        <h3 className="text-lg font-semibold text-gray-700">Upload Response</h3>
        <div>
          <h4 className="text-md font-semibold">Paragraphs:</h4>
          {renderParagraphs()}
        </div>
        <div className="mt-2">
          <h4 className="text-md font-semibold">Form Fields:</h4>
          {renderFormFields()}
        </div>
        <pre className="mt-2">{JSON.stringify(response, null, 2)}</pre>
      </div>
      <button
        onClick={handleExport}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Export output
      </button>
    </div>
  )
}

UploadResponse.propTypes = {
  response: PropTypes.object
}

export default UploadResponse
