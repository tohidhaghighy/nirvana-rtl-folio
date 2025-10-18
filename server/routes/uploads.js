// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const router = express.Router();

// // Helper function to save base64 image
// function saveBase64Image(base64String, uploadDir) {
//   return new Promise((resolve, reject) => {
//     // Extract mime type and data
//     const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
//     if (!matches) return reject(new Error("Invalid base64 image string"));

//     const mimeType = matches[1]; // e.g. image/png
//     const ext = mimeType.split("/")[1]; // png, jpeg, etc
//     const data = matches[2];
//     const buffer = Buffer.from(data, "base64");

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
//     }

//     const filename =
//       Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
//     const filePath = path.join(uploadDir, filename);

//     fs.writeFile(filePath, buffer, (err) => {
//       if (err) return reject(err);
//       resolve(filename);
//     });
//   });
// }

// // POST /project-image expects { image: "data:image/png;base64,...." }
// router.post(
//   "/project-image",
//   express.json({ limit: "6mb" }),
//   async (req, res) => {
//     try {
//       const { image } = req.body;
//       if (!image) {
//         return res.status(400).json({ error: "No image provided" });
//       }

//       const uploadDir = path.join(__dirname, "/uploads/projects");

//       const filename = await saveBase64Image(image, uploadDir);

//       const imageUrl = `/uploads/projects/${filename}`;
//       res.json({ imageUrl });
//     } catch (error) {
//       console.error("Upload error:", error);
//       res.status(500).json({ error: error.message });
//     }
//   }
// );

// // Delete project image
// router.delete("/project-image", (req, res) => {
//   try {
//     const { imageUrl } = req.body;
//     if (!imageUrl) {
//       return res.status(400).json({ error: "No image URL provided" });
//     }

//     const filename = path.basename(imageUrl);
//     const filePath = path.join(
//       __dirname,
//       "../../public/uploads/projects",
//       filename
//     );

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       res.json({ message: "Image deleted successfully" });
//     } else {
//       res.status(404).json({ error: "Image not found" });
//     }
//   } catch (error) {
//     console.error("Delete error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = express.Router();


// Helper function to save base64 image
function saveBase64Image(base64String, uploadDir) {
  return new Promise((resolve, reject) => {
    // Extract mime type and data
    const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return reject(new Error("Invalid base64 image string"));
    const mimeType = matches[1]; // e.g. image/png

    const ext = mimeType.split("/")[1]; // png, jpeg, etc

    const data = matches[2];

    const buffer = Buffer.from(data, "base64");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
    }

    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
    const filePath = path.join(uploadDir, filename);



    fs.writeFile(filePath, buffer, (err) => {
      if (err) return reject(err);
      resolve(filename);
    });
  });
}

// POST /project-image expects { image: "data:image/png;base64,...." }
router.post(
  "/project-image",
  async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      const uploadDir = path.join(__dirname, "/uploads/projects");

      const filename = await saveBase64Image(image, uploadDir);

      const imageUrl = `/uploads/projects/${filename}`;

      res.json({ imageUrl });

    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete project image
router.delete("/project-image", (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "No image URL provided" });
    }

    const filename = path.basename(imageUrl);
    const filePath = path.join(
      __dirname,
      "../../public/uploads/projects",
      filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: "Image not found" });
    }

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }

});

export default router;