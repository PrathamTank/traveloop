const express = require('express');
const multer = require('multer');
const router = express.Router();

// Memory storage to avoid saving files locally as requested
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Endpoint
router.post('/', upload.single('image'), (req, res) => {
    // In a real application, here you would use a Cloudinary/AWS SDK
    // to upload req.file.buffer to the cloud and get back a URL.
    
    // As a placeholder mock since no keys were provided:
    // Generate a random travel-related image from Unsplash
    const randomSeed = Math.floor(Math.random() * 1000);
    const mockCloudUrl = `https://picsum.photos/seed/${randomSeed}/800/600`;

    setTimeout(() => {
        res.json({
            message: 'Image successfully uploaded to mock cloud storage',
            imageUrl: mockCloudUrl
        });
    }, 1000); // Simulate network delay
});

module.exports = router;
