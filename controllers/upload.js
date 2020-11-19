const uploadImage = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const image = req.files.img;
    const fileExtension = image.name.split(".").slice(-1)[0];
    const fileName = `${new Date().getTime()}.${fileExtension}`;
    image.mv(`upload-files/${fileName}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send({
            url: fileName,
        })
    });
};

module.exports = {
    uploadImage
};