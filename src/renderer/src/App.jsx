import { RootLayout } from './components/AppLayout'
import FileUpload from './components/FileUpload'

function App() {
  const apiEndpoint = 'https://6d374618-3991-43d8-b124-f6f65d198968.mock.pstmn.io/post'

  return (
    <RootLayout>
      <div className="text-left">
        <h2 className="text-3xl font-bold">Enterprise OCR</h2>
        <p className="mt-4">Please upload the form below and click submit afterwards.</p>
        <FileUpload apiEndpoint={apiEndpoint} />
      </div>
    </RootLayout>
  )
}

export default App
