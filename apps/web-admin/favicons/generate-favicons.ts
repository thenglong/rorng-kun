import fs from "fs/promises"
import { existsSync } from "fs"
import crypto from "crypto"
import path from "path"
import favicons from "favicons"
import type {} from "favicons"

import sharp from "sharp"

main()

async function main() {
  const width = 1000
  const height = 1000
  const svgData = await readFaviconFile("favicon.svg")
  const pngData = await sharp(svgData)
    .resize(width, height, { fit: sharp.fit.cover })
    .png()
    .toBuffer()
  const checksum = generateChecksum(pngData.toString())
  const oldChecksum = await readFaviconChecksum()
  if (checksum !== oldChecksum) {
    generateFavicons(pngData)
    // on success, write the new checksum to the file
    await writeChecksumToFile(checksum)
  }
}

function readFaviconFile(file: string) {
  return fs.readFile(path.resolve(__dirname, file))
}

function readFaviconChecksum() {
  return fs.readFile(path.resolve(__dirname, "favicon.checksum"), {
    encoding: "utf8",
  })
}

function writeChecksumToFile(checksum: string) {
  return fs.writeFile(path.resolve(__dirname, "favicon.checksum"), checksum)
}

function generateChecksum(data: string) {
  return crypto.createHash("md5").update(data, "utf8").digest("hex")
}

function generateFavicons(file: Buffer) {
  console.log("Generating favicons")

  const options: FaviconOptions = {
    path: "/", // Path for overriding default icons path. `string`
    appName: "App Name", // Your application's name. `string`
    appShortName: "App Name", // Your application's short_name. `string`. Optional. If not set, appName will be used
    appDescription: "App Name", // Your application's description. `string`
    developerName: "App Name", // Your (or your developer's) name. `string`
    developerURL: "App Name", // Your (or your developer's) URL. `string`
    dir: "auto", // Primary text direction for name, short_name, and description
    lang: "en-US", // Primary language for name and short_name
    background: "#fff", // Background colour for flattened icons. `string`
    theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
    appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
    display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
    orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
    scope: "/", // set of URLs that the browser considers within your app
    start_url: "/?homescreen=1", // Start URL when launching the application from a device. `string`
    preferRelatedApplications: false, // Should the browser prompt the user to install the native companion app. `boolean`
    relatedApplications: undefined, // Information about the native companion apps. This will only be used if `preferRelatedApplications` is `true`. `Array<{ id: string, url: string, platform: string }>`
    version: "1.0", // Your application's version string. `string`
    pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
    loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
    manifestMaskable: false, // Maskable source image(s) for manifest.json. "true" to use default source. More information at https://web.dev/maskable-icon/. `boolean`, `string`, `buffer` or array of `string`
    icons: {
      // Platform Options:
      // - offset - offset in percentage
      // - background:
      //   * false - use default
      //   * true - force use default, e.g. set background for Android icons
      //   * color - set background for the specified icons
      //
      android: true, // Create Android homescreen icon. `boolean` or `{ offset, background }` or an array of sources
      appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background }` or an array of sources
      appleStartup: true, // Create Apple startup images. `boolean` or `{ offset, background }` or an array of sources
      favicons: true, // Create regular favicons. `boolean` or `{ offset, background }` or an array of sources
      // windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background }` or an array of sources
      // yandex: true, // Create Yandex browser icon. `boolean` or `{ offset, background }` or an array of sources
    },
    shortcuts: [
      // Your applications's Shortcuts (see: https://developer.mozilla.org/docs/Web/Manifest/shortcuts)
      // Array of shortcut objects:
      {
        name: "View your Inbox", // The name of the shortcut. `string`
        short_name: "inbox", // optionally, falls back to name. `string`
        description: "View your inbox messages", // optionally, not used in any implemention yet. `string`
        url: "/inbox", // The URL this shortcut should lead to. `string`
        icon: file, // source image(s) for that shortcut. `string`, `buffer` or array of `string`
      },
    ],
    // more shortcuts objects
  }

  favicons(file, options, generateFaviconCb)
}

interface FileReponse {
  name: string
  contents: Buffer | string
}

interface Response {
  images: FileReponse[]
  files: FileReponse[]
  html: string[]
}

type FaviconOptions = Parameters<typeof favicons>[1]

function generateFaviconCb(error: Error, response: Response) {
  if (error) {
    console.log(error?.message) // Error description e.g. "An unknown error has occurred"
    return
  }

  const outputImageDir = path.resolve(__dirname, "images")
  const outputFileDir = path.resolve(__dirname, "files")

  if (!existsSync(outputImageDir)) {
    fs.mkdir(outputImageDir)
  }
  if (!existsSync(outputFileDir)) {
    fs.mkdir(outputFileDir)
  }

  response.images.forEach(image => {
    fs.writeFile(path.resolve(__dirname, "images", image.name), image.contents)
  })

  response.files.forEach(file => {
    fs.writeFile(path.resolve(__dirname, "files", file.name), file.contents)
  })

  response.html.forEach(tag => {
    fs.appendFile(path.resolve(__dirname, "index.html"), tag)
  })
}
