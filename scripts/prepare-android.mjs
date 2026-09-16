// Creates (if needed) and customises the Android project, then syncs the web build into it.
// Safe to run repeatedly.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
const read = (f) => fs.readFileSync(f, 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };

const config = JSON.parse(read('capacitor.config.json'));
const appId = config.appId;

if (!fs.existsSync('android')) run('npx cap add android');

const main = 'android/app/src/main';
const javaDir = path.join(main, 'java', ...appId.split('.'));

// 1. Native plugin (orientation lock, keep screen on, full screen)
write(
  path.join(javaDir, 'ReaderPlugin.java'),
  read('native/android/ReaderPlugin.java').replace(/^package .*;$/m, `package ${appId};`),
);

// 2. Register the plugin
write(path.join(javaDir, 'MainActivity.java'), `package ${appId};

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ReaderPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
`);

// 3. Make sure androidx.core is on the app's compile classpath (used by the plugin)
const gradleFile = 'android/app/build.gradle';
let gradle = read(gradleFile);
if (!gradle.includes('androidx.core:core:')) {
  gradle = gradle.replace(
    /(implementation "androidx\.appcompat:appcompat:\$androidxAppCompatVersion")/,
    `$1\n    implementation "androidx.core:core:$androidxCoreVersion"`,
  );
  write(gradleFile, gradle);
}

// 4. App icon and launch screen
const res = path.join(main, 'res');
for (const dir of fs.readdirSync(res)) {
  const splash = path.join(res, dir, 'splash.png');
  if (dir.startsWith('drawable') && fs.existsSync(splash)) fs.rmSync(splash);
}
const copyTree = (from, to) => {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(src, dest);
    else write(dest, read(src));
  }
};
copyTree('native/android/res', res);

const stylesFile = path.join(res, 'values/styles.xml');
let styles = read(stylesFile);
if (!styles.includes('windowSplashScreenBackground')) {
  styles = styles.replace(
    '<item name="android:background">@drawable/splash</item>',
    '<item name="android:background">@drawable/splash</item>\n        <item name="windowSplashScreenBackground">@color/ic_launcher_background</item>',
  );
  write(stylesFile, styles);
}

// 5. Copy www/ and plugins into the Android project
run('npx cap sync android');
console.log('Android project ready.');
