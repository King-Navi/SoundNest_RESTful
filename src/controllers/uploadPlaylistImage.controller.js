const { getImageUrl } = require("../service/playlist.service");

const uploadPlaylistImageController = (req, res) => {

  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    /*
    file
    {
      fieldname: 'image', (por ejemplo, "image" si usaste upload.single('image'))
      originalname: 'cover.png',  como lo subió el usuario
      encoding: '7bit',
      mimetype: 'image/png',
      destination: 'uploads/playlist_image',
      filename: '1715465678901-cover.png', Nombre del archivo generado por Multer en el servidor 
      path: 'uploads/playlist_image/1715465678901-cover.png',
      size: 458721
    }
    */
    const filename = req.file.filename;
    const imageUrl = getImageUrl(req.protocol, req.get("host"), filename);

    res.json({
      message: "Image uploaded successfully",
      url: imageUrl,
      userId: userId,
      metadata: {
        title,
        description
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process image upload" });
  }
};

module.exports = {
  uploadPlaylistImageController,
};
