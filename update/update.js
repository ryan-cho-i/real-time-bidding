const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
const Log = require("./Log");

const { PNG } = require("pngjs");

const cors = require("cors");

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://soo:12341@rtb.e20asj4.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB Connected");

    app.get("/firePixel/:id", async (req, res) => {
      try {
        console.log(req.params.id);

        // Update Data
        const updatedLog = await Log.findOneAndUpdate(
          { id: req.params.id },
          { $set: { firePixel: "true" } },
          { new: true }
        );

        console.log("Update!");

        const width = 10;
        const height = 10;

        let png = new PNG({
          width,
          height,
          filterType: 4,
        });

        for (let y = 0; y < png.height; y++) {
          for (let x = 0; x < png.width; x++) {
            let idx = (png.width * y + x) << 2;

            // Red color
            png.data[idx] = 255;
            png.data[idx + 1] = 0;
            png.data[idx + 2] = 0;
            png.data[idx + 3] = 255;
          }
        }

        res.setHeader("Content-Type", "image/png");
        png.pack().pipe(res);
      } catch (error) {
        console.error("Error consuming message:", error);
      }
    });

    const PORT = 3002;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });
