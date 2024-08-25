const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1
require('dotenv').config()
const fs = require('fs').promises

// Instantiates a client
const client = new DocumentProcessorServiceClient()

export default async function processDocument(filePath) {
  const projectId = process.env.MAIN_VITE_GOOGLE_CLOUD_PROJECT_ID
  const location = process.env.MAIN_VITE_GOOGLE_CLOUD_LOCATION
  const processorId = process.env.MAIN_VITE_GOOGLE_CLOUD_PROCESSOR_ID

  // The full resource name of the processor
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`

  console.log(`Starting document processing with processor: ${name}`)
  console.log(`Reading file from path: ${filePath}`)

  // Read the file into memory.
  const imageFile = await fs.readFile(filePath)

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage = Buffer.from(imageFile).toString('base64')

  console.log('File successfully read and encoded.')

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: 'application/pdf'
    }
  }

  console.log('Sending request to Document AI API...')

  // Recognizes text entities in the PDF document
  const [result] = await client.processDocument(request)
  const { document } = result

  console.log('Received response from Document AI API.')

  // Get all of the document text as one big string
  const { text } = document
  console.log(`Full document text: ${JSON.stringify(text)}`)
  console.log(`There are ${document.pages.length} page(s) in this document.`)

  for (const page of document.pages) {
    console.log(`Page ${page.pageNumber}`)
    printPageDimensions(page.dimension)
    printDetectedLanguages(page.detectedLanguages)
    printParagraphs(page.paragraphs, text)
    printBlocks(page.blocks, text)
    printLines(page.lines, text)
    printTokens(page.tokens, text)
  }

  // Read the text recognition output from the processor
  const paragraphs = []
  const formFields = []

  for (const page of document.pages) {
    // Extract paragraphs from the current page
    const currentPageParagraphs = page.paragraphs.map((paragraph) => {
      const paragraphText = getText(paragraph.layout.textAnchor, text)
      return paragraphText
    })
    paragraphs.push(...currentPageParagraphs)

    // Extract form fields from the current page
    const currentPageFormFields = page.formFields.map((field) => {
      const fieldName = getText(field.fieldName.textAnchor, text)
      const fieldValue = getText(field.fieldValue.textAnchor, text)
      return { name: fieldName, value: fieldValue }
    })
    formFields.push(...currentPageFormFields)
  }

  console.log('Document processing complete.')

  return { paragraphs, formFields }
}

const printPageDimensions = (dimension) => {
  console.log(`    Width: ${dimension.width}`)
  console.log(`    Height: ${dimension.height}`)
}

const printDetectedLanguages = (detectedLanguages) => {
  console.log('    Detected languages:')
  for (const lang of detectedLanguages) {
    const code = lang.languageCode
    const confPercent = lang.confidence * 100
    console.log(`        ${code} (${confPercent.toFixed(2)}% confidence)`)
  }
}

const printParagraphs = (paragraphs, text) => {
  console.log(`    ${paragraphs.length} paragraphs detected:`)
  const firstParagraphText = getText(paragraphs[0].layout.textAnchor, text)
  console.log(`        First paragraph text: ${JSON.stringify(firstParagraphText)}`)
  const lastParagraphText = getText(paragraphs[paragraphs.length - 1].layout.textAnchor, text)
  console.log(`        Last paragraph text: ${JSON.stringify(lastParagraphText)}`)
}

const printBlocks = (blocks, text) => {
  console.log(`    ${blocks.length} blocks detected:`)
  const firstBlockText = getText(blocks[0].layout.textAnchor, text)
  console.log(`        First block text: ${JSON.stringify(firstBlockText)}`)
  const lastBlockText = getText(blocks[blocks.length - 1].layout.textAnchor, text)
  console.log(`        Last block text: ${JSON.stringify(lastBlockText)}`)
}

const printLines = (lines, text) => {
  console.log(`    ${lines.length} lines detected:`)
  const firstLineText = getText(lines[0].layout.textAnchor, text)
  console.log(`        First line text: ${JSON.stringify(firstLineText)}`)
  const lastLineText = getText(lines[lines.length - 1].layout.textAnchor, text)
  console.log(`        Last line text: ${JSON.stringify(lastLineText)}`)
}

const printTokens = (tokens, text) => {
  console.log(`    ${tokens.length} tokens detected:`)
  const firstTokenText = getText(tokens[0].layout.textAnchor, text)
  console.log(`        First token text: ${JSON.stringify(firstTokenText)}`)
  const firstTokenBreakType = tokens[0].detectedBreak.type
  console.log(`        First token break type: ${firstTokenBreakType}`)
  const lastTokenText = getText(tokens[tokens.length - 1].layout.textAnchor, text)
  console.log(`        Last token text: ${JSON.stringify(lastTokenText)}`)
  const lastTokenBreakType = tokens[tokens.length - 1].detectedBreak.type
  console.log(`        Last token break type: ${lastTokenBreakType}`)
}

// Extract shards from the text field
const getText = (textAnchor, text) => {
  if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
    return ''
  }

  // First shard in document doesn't have startIndex property
  const startIndex = textAnchor.textSegments[0].startIndex || 0
  const endIndex = textAnchor.textSegments[0].endIndex

  return text.substring(startIndex, endIndex)
}
