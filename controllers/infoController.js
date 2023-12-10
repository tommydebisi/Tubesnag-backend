const ytdl = require('ytdl-core');


class infoController {
  static async videoInfo(req, res) {
    const videoUrl = req.query.url;
    if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).send('Invalid YouTube URL');
    }

    try {
        const videoInfo = await ytdl.getInfo(videoUrl);
        const durationSeconds = parseInt(videoInfo.videoDetails.lengthSeconds);
        const duration = `${Math.floor(durationSeconds / 60)}:${durationSeconds % 60 < 10 ? '0' : ''}${durationSeconds % 60}`;
        const title = videoInfo.videoDetails.title;
        const thumbnail = videoInfo.videoDetails.thumbnails[videoInfo.videoDetails.thumbnails.length - 1].url;
        const formats = videoInfo.formats
            .filter(f => f.container === 'mp4' && f.hasAudio && f.hasVideo)
            .map(f => ({ quality: f.qualityLabel, itag: f.itag }));

        res.json({ title, thumbnail, duration, formats });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing your request');
    }
  }
}


module.exports = infoController;