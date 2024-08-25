import { dialog } from 'electron'
const fs = require('fs').promises

export default async function exportResponseToFile(data) {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Save JSON File',
    defaultPath: 'response.json',
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  })

  if (filePath) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return { success: true, filePath }
  } else {
    return { success: false }
  }
}
