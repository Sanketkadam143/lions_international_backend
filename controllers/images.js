import path from "path";
import fs from "fs";
import axios from "axios"


const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/, '$1');

export const getImages = async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const imagePath = path.join(__dirname, '..', 'images', folder, filename);
    if (!fs.existsSync(imagePath)) {
      throw new Error();
    }
    return res.sendFile(imagePath);
  } catch (error) {

    return res.status(404).json("Image not found");
  }
};


export const VistorCounter = async (req, res) => {
  try {
    // Make the API request to fetch the image
    const response = await axios.get('https://komarev.com/ghpvc/', {
      params: {
        username: 'dfhservices',
        label: 'Website Visitors',
        color: '0e75b6',
        style: 'flat',
        base: '11100',
      },
      headers: {
        'User-Agent': 'github-camo',
      },
      responseType: 'arraybuffer' // Handle binary data like images
    });

    // Set the content type to match the response (usually 'image/png')
    res.setHeader('Content-Type', response.headers['content-type']);

    // Return the image data to the client
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching the visitor count image:', error);
    res.status(500).json({ error: 'Failed to fetch the visitor count image' });
  }
};
