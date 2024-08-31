const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileToCloud = async (filePath) => {
    try {
        const response = await cloudinary.uploader.upload(filePath);
        return response;
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteFileFromCloud = async (publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    uploadFileToCloud,
    deleteFileFromCloud
};
