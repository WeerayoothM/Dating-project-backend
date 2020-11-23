const Formidable = require('formidable');
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: 'software-park-thailand',
    api_key: '926694112918671',
    api_secret: 'q9V_gK8DTstkbd0rJatjbC5adEc'
});

const uploadImage = async (req, res) => {
    try {
        const fileStr = req.body.data;
        // console.log('uploading', fileStr)
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
        });
        console.log(uploadResponse.url);
        res.status(201).json({ url: uploadResponse.url });
    } catch (err) {
        console.error('error', err);
        res.status(500).json({ err: 'Something went wrong' });
    }
};

module.exports = {
    uploadImage
};