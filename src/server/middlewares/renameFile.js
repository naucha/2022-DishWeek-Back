const chalk = require("chalk");
const debug = require("debug")("dishweek:server:middlewares:renameFile");
const { initializeApp } = require("firebase/app");
const fs = require("fs");
const path = require("path");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBI24WNicorKeGc6QmRmgQuBRLhoIm_dZ4",
  authDomain: "images-3286d.firebaseapp.com",
  projectId: "images-3286d",
  storageBucket: "images-3286d.appspot.com",
  messagingSenderId: "1096893269963",
  appId: "1:1096893269963:web:fc8c6ee97729bb4362984e",
};

const firebaseApp = initializeApp(firebaseConfig);

const renameFile = async (req, res, next) => {
  const { file } = req;
  if (file) {
    const newFilename = `${Date.now()}${file.originalname}`;
    fs.rename(
      path.join("uploads", "images", file.filename),
      path.join("uploads", "images", newFilename),
      async (error) => {
        if (error) {
          debug(chalk.red(error.message));
          const userError = new Error(error.message);
          userError.statusCode = 500;
          userError.customMessage = "Failed renaming file";

          next(error);
          return;
        }

        fs.readFile(
          path.join("uploads", "images", newFilename),
          async (readError, readFile) => {
            if (readError) {
              debug(chalk.bgRed("Success on upload file to Firebase"));
              next(readError);
              return;
            }

            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, newFilename);

            await uploadBytes(storageRef, readFile);
            const firebaseFileURL = await getDownloadURL(storageRef);

            req.firebaseFileURL = firebaseFileURL;
            req.newFilename = newFilename;

            debug(chalk.yellow("Success on upload file to Firebase"));
            debug(chalk.green("Success on rename file"));
            if (firebaseFileURL) {
              next();
            }
          }
        );
      }
    );
  } else {
    next();
  }
};

module.exports = { renameFile };
