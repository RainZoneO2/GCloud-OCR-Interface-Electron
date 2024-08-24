import React from 'react'
import PropTypes from 'prop-types'

const UploadResponse = ({ response }) => {
  return (
    <div className="mt-4 upload-response">
      <h3 className="text-lg font-semibold text-gray-700">Upload Response</h3>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  )
}

UploadResponse.propTypes = {
  response: PropTypes.object
}

export default UploadResponse
