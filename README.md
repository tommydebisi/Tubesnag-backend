# YouTube Video Downloader API

This Node.js API allows users to download videos from YouTube. It provides endpoints to fetch video information, download a single video, and download multiple videos in a batch.

## Endpoints

### 1. Get Video Information (`/api/videoInfo`)

This endpoint retrieves information about a YouTube video, including its title, available formats, and thumbnails.

#### Request

```http
GET /api/videoInfo?url=<YOUTUBE_VIDEO_URL>
```


#### Query Parameters

- `url` - The full URL of the YouTube video.

#### Response

- JSON object containing video details.

#### Example

```bash
curl "http://localhost:3000/api/videoInfo?url=https://www.youtube.com/watch?v=lRFeuSH9t44"
```


### 2. Download Video (`/api/download`)

This endpoint downloads a single YouTube video in the specified format.

#### Request

```http
GET /api/download?url=<YOUTUBE_VIDEO_URL>&itag=<ITAG>
```


#### Query Parameters

- `url` - The full URL of the YouTube video.
- `itag` - The format identifier for the desired quality (obtained from `/api/videoInfo`).

#### Response

- The video file in the requested format.

#### Example

```bash
curl -o "downloaded_video.mp4" "http://localhost:3000/api/download?url=https://www.youtube.com/watch?v=lRFeuSH9t44&itag=18"
```


### 3. Batch Download Videos (`/api/batchDownload`)

This endpoint allows downloading up to three YouTube videos in a single batch request. Each video can be in a different specified format.

#### Request

```http
POST /api/batchDownload
```


#### Body Parameters (JSON)

- `videos` - An array of objects, each containing `url` and `itag`.

#### Response

- A ZIP file containing all requested videos.

#### Example

```bash
curl -X POST "http://localhost:3000/api/batchDownload" -H "Content-Type: application/json" -d '{"videos":[{"url":"https://www.youtube.com/watch?v=lRFeuSH9t44","itag":18},{"url":"https://www.youtube.com/watch?v=QdBZY2fkU-0","itag":22},{"url":"https://www.youtube.com/watch?v=1tELuR_6hj8","itag":18}]}' -o "downloaded_videos.zip"
```


## Installation and Setup

To use this API, ensure you have Node.js and npm installed. Clone the repository, install dependencies, and start the server:

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
npm install
node app.js
```

Author: [Oluwatomiwa Adebisi](https://linkedin.com/in/oluwatomiwaadebisi)