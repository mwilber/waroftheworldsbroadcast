module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{mp3,ogg,css,json,png,svg,jpg,js,html}"
  ],
  "swSrc": "sw-base.js",
  "swDest": "dist/sw.js",
  "maximumFileSizeToCacheInBytes": 30 * 1024 * 1024
};