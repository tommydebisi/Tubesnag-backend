const ytdl = require("ytdl-core");
const validator = require("validator");

class downloadController {
  // API for downloading a single video
  static async singleDownload(req, res) {
    const { url, resolution } = req.body;

    if (!url) {
      return res.status(400).send({ message: "URL is required." });
    }

    if (
      !validator.isURL(url, {
        protocols: ["http", "https"],
        require_tld: true,
        require_protocol: true,
      })
    ) {
      return res.status(400).send({ message: "Invalid URL." });
    }

    try {
      // Get available formats for the video
      const formats = await ytdl.getInfo(url).then((info) => info.formats);

      // Choose the format based on the requested resolution (if provided) or the best quality available
      const format = resolution
        ? formats.find((f) => f.height === resolution)
        : ytdl.chooseFormat(formats, { quality: "highest" });

      // Set the response header to indicate that the content is a video file
      res.header(
        "Content-Disposition",
        `attachment; filename="${format.qualityLabel}.mp4"`
      );
      res.header("Content-Type", "video/mp4");

      // Stream the video to the response object
      ytdl(url, { format }).pipe(res);
    } catch (err) {
      return res
        .status(500)
        .send({ message: "An error occurred while downloading the video." });
    }
  }

  // API for simultaneously downloading multiple videos
  static async batchDownload(req, res) {
    const { urls, resolution } = req.body;

    if (!urls || !urls.length) {
      return res.status(400).send({ message: "URLs array is required." });
    }

    for (let i = 0; i < urls.length; i++) {
      if (
        !validator.isURL(urls[i], {
          protocols: ["http", "https"],
          require_tld: true,
          require_protocol: true,
        })
      ) {
        return res.status(400).send({ message: "Invalid URL." });
      }
    }

    const videoDownloads = urls.map((url) => {
      return ytdl(url, {
        filter: (format) =>
          resolution
            ? format.resolution === resolution
            : format.container === "mp4",
      });
    });

    const mergedVideos = ytdl.merge(videoDownloads);

    // Set the response header to indicate that the content is a video file
    res.header("Content-Disposition", 'attachment; filename="videos.zip"');
    res.header("Content-Type", "application/zip");

    try {
      // Pipe the merged videos to the response object
      mergedVideos.pipe(res);
    } catch (err) {
      return res
        .status(500)
        .send({ message: "An error occurred while downloading the videos." });
    }
  }
}

module.exports = downloadController;
