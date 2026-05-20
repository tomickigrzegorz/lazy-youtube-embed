const fs = require("fs");

const pkg = require("../package.json");

const newVersion = pkg.version;

function updateVersion(file, newVersion) {
  fs.readFile(file, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const match = data.match(/@(.*?)\/dist/i);
    if (!match) {
      return console.log(
        `version.js: no "@<version>/dist" pattern found in ${file}, skipping`,
      );
    }

    const reg = new RegExp(match[1].replace(/\./g, "\\."), "g");

    const result = data.replace(reg, newVersion);

    fs.writeFile(file, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}

// ------------------------------------------------------------

const someFiles = ["README.md"];

someFiles.forEach((file) => {
  updateVersion(file, newVersion);
});
