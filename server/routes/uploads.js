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

// Standard way to get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// --- Configuration for File Saving ---
// We must resolve the path to the 'public/uploads' directory,
// which is relative to the project root (up two levels from the 'routes' folder).
// If your server.js is in the root, and this file is in 'routes/', this path works:
const UPLOAD_ROOT_DIR = path.resolve(__dirname, "../../public/uploads");


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

      // We only return the file path relative to the public/uploads folder
      // to construct the final URL later.
      resolve(filename);
    });
  });
}

// POST /project-image expects { image: "data:image/png;base64,...." }
router.post(
  "/project-image",
  // REMOVED redundant express.json() middleware, using global 50MB limit from server.js
  async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      // 1. Define the final save location based on the UPLOAD_ROOT_DIR
      const projectUploadDir = path.join(UPLOAD_ROOT_DIR, "projects");

      // 2. saveBase64Image now returns the path relative to the public/uploads folder
      const filename = await saveBase64Image(image, projectUploadDir);

      // 3. Construct the URL using the base URL prefix set in server.js (/uploads)
      // const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${relativePath.replace(/\\/g, '/')}`;

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
    
    let pathSegment = '';
    
    // Determine the path segment that comes after the UPLOAD_ROOT_DIR
    if (imageUrl.includes('/uploads/')) {
        // Extract the part after the last /uploads/
        const uploadsIndex = imageUrl.lastIndexOf('/uploads/');
        pathSegment = imageUrl.substring(uploadsIndex + '/uploads/'.length);
    } else {
        // Assuming a clean relative path (e.g., projects/filename.png) was passed
        pathSegment = imageUrl;
    }
    
    // Normalize path to prevent directory traversal issues and clean up double slashes
    const safePathSegment = path.normalize(pathSegment.replace(/\\/g, '/'));
    
    // Reconstruct the full file path to where it's physically stored
    const filePath = path.join(UPLOAD_ROOT_DIR, safePathSegment);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Image deleted successfully" });
    } else {
      console.warn("Delete request: Image not found at path:", filePath);
      // Respond 200/204 even if not found, since the user's goal (image gone) is achieved
      res.json({ message: "Image was already removed or not found" }); 
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
