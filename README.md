# Scrollstand

Hands-free reader for PDFs, EPUB ebooks, Word (.docx) and text (.txt, .md) files. Open a file, set a speed in lines per minute, and it scrolls for you. Built as a single HTML/CSS/JS page and packaged for Android with Capacitor.

## Features

- Smooth auto-scroll with a speed in lines per minute, one-line and several-line jumps, a start countdown and a stop timer
- Page-flip mode: turns a whole page every N seconds (for sheet music, lyrics and slides)
- Library: every file you open is kept on the device (IndexedDB) with your reading position, so you can reopen it and carry on
- Reopens the file you were reading, at the same spot, when the app starts again
- Search inside the file, with highlights on PDF pages and in text view
- Themes: System, Light, Sepia and Night (PDF pages are tinted or darkened to match), plus a teleprompter mirror mode
- Pinch to zoom (two fingers on a phone, pinch or Ctrl + scroll on a computer)
- Text view: PDFs can be reflowed as plain text; Word and text files always open this way. Choose the font (including Mukta for Nepali), text size and line spacing
- Reading guide band, orientation lock, full screen, keeps the screen on while scrolling

Old `.doc` files and copy-protected (DRM) EPUBs aren't supported; save Word files as `.docx` first. Scanned PDFs have no text, so only the page view works for them.

## Project layout

| Path | What it is |
| --- | --- |
| `src/index.html` | The whole app (UI, PDF rendering, scrolling) |
| `native/android/ReaderPlugin.java` | Native bridge: orientation lock, keep screen on, full screen |
| `native/android/res/` | App icon and launch screen |
| `scripts/build-web.mjs` | Copies the app plus PDF.js, the Word reader (mammoth), the EPUB unzipper (JSZip) and fonts into `www/` for offline use |
| `scripts/prepare-android.mjs` | Creates/updates the `android/` project and applies the native files |
| `.github/workflows/android-debug.yml` | Builds a debug APK on every push to `main` |

`www/` and `android/` are generated, so they are not committed.

## Get a debug APK from GitHub

1. Push this repo to GitHub (branch `main`).
2. Open the **Actions** tab and wait for **Android debug APK** to finish (a few minutes). You can also start it by hand with **Run workflow**.
3. Open the finished run and download **scrollstand-debug-apk** under **Artifacts**. It is a zip containing `app-debug.apk`.
4. Copy the APK to your phone and open it. Android will ask you to allow installs from that app (Files, Drive, etc.).

## Work on it locally

Requires Node 22+.

```bash
npm install
npm run serve            # builds www/ and serves it at http://localhost:3000
```

To open the Android project in Android Studio (needs Android Studio and JDK 21):

```bash
npm run android:prepare  # creates android/ and copies the latest web build into it
npm run android:open
```

Run `npm run android:prepare` again after every change to `src/index.html`.

## Changing the app ID

The app ID is `com.ashish.scrollstand` in `capacitor.config.json`. Change it before your first Play Store release; it can't be changed afterwards. If `android/` already exists locally, delete it and run `npm run android:prepare` again.
