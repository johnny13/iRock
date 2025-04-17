const sharp = require('sharp')
const fs = require('fs').promises
const path = require('path')

// Configuration
const inputFolder = './docs/imgs' // Folder containing original images
const outputFolder = './docs/thumbnails' // Folder for thumbnails
const thumbnailWidth = 500 // Width of thumbnails (adjust as needed)
// const thumbnailHeight = 200 // Height of thumbnails (adjust as needed)

// Supported image formats
const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

async function generateThumbnails() {
    try {
        // Create output folder if it doesn't exist
        await fs.mkdir(outputFolder, { recursive: true })

        // Read all files in the input folder
        const files = await fs.readdir(inputFolder)

        // Filter for supported image files
        const imageFiles = files.filter((file) =>
            supportedFormats.includes(path.extname(file).toLowerCase())
        )

        // Process each image
        for (const file of imageFiles) {
            const inputPath = path.join(inputFolder, file)
            const outputPath = path.join(outputFolder, `thumb_${file}`)

            console.log(`Processing: ${file}`)

            // Generate thumbnail
            await sharp(inputPath)
                .resize({
                    width: thumbnailWidth,
                })
                .toFile(outputPath)

            console.log(`Generated thumbnail: ${outputPath}`)
        }

        console.log('Thumbnail generation complete!')
    } catch (error) {
        console.error('Error generating thumbnails:', error)
    }
}

// Run the function
generateThumbnails()
