import { RootLayout } from './components/AppLayout'
import FileUpload from './components/FileUpload'

function App() {
  return (
    <RootLayout>
      <div className="text-left">
        <h2 className="text-3xl font-bold">Enterprise OCR</h2>
        <FileUpload />
      </div>
    </RootLayout>
  )
}

export default App
