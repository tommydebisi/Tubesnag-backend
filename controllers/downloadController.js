const ytdl = require('ytdl-core');
const archiver = require('archiver');

class DownloadController {
  static async download(req, res) {
    const videoUrl = req.query.url;
    const itag = parseInt(req.query.itag);

    if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).send('Invalid YouTube URL');
    }
    if (isNaN(itag)) {
        return res.status(400).send('Invalid itag value');
    }

    try {
        const videoInfo = await ytdl.getInfo(videoUrl);
        const format = videoInfo.formats.find(f => f.itag === itag);
        if (!format) {
            return res.status(404).send('Requested format not available');
        }

        const title = videoInfo.videoDetails.title.replace(/[<>:"\/\\|?*]+/g, '');
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        const videoStream = ytdl.downloadFromInfo(videoInfo, { format: format });
        videoStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing your request');
    }
  }

  static async batchDownload(req, res) {
    const videoRequests = req.body.videos; // Expect an array of objects

    if (!Array.isArray(videoRequests) || videoRequests.length === 0 || videoRequests.length > 3) {
        return res.status(400).send('Please provide an array of 1 to 3 video requests');
    }

    // Validate all URLs and itags
    if (videoRequests.some(v => !ytdl.validateURL(v.url) || typeof v.itag !== 'number')) {
        return res.status(400).send('Invalid request. Ensure each video has a valid URL and itag.');
    }

    try {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="videos.zip"');
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        for (const { url, itag } of videoRequests) {
            const videoInfo = await ytdl.getInfo(url);
            const format = videoInfo.formats.find(f => f.itag === itag);
            if (!format) {
                console.error(`Format with itag ${itag} not found for ${url}`);
                continue; // Skip this video or handle as needed
            }

            const title = videoInfo.videoDetails.title.replace(/[<>:"\/\\|?*]+/g, '');
            const videoStream = ytdl.downloadFromInfo(videoInfo, { format: format });
            archive.append(videoStream, { name: `${title}.mp4` });
        }

        archive.finalize();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing your request');
    }
}

}

module.exports = DownloadController;