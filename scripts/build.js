const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const files = ["index.html", "main.js", "styles.css"];
const directories = ["vendor"];
const publicImages = ["roundkeeper-mark.svg"];

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (entry.isFile()) {
      copyFile(sourcePath, targetPath);
    }
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  copyFile(path.join(root, file), path.join(dist, file));
}

for (const directory of directories) {
  copyDirectory(path.join(root, directory), path.join(dist, directory));
}

for (const image of publicImages) {
  copyFile(path.join(root, "images", image), path.join(dist, "images", image));
}

console.log(`Built static app in ${dist}`);
