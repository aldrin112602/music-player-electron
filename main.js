const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "development";
const width = isDev ? 1000 : 700;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width,
    height: 370,
    title: "Mp3 player",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // Enable Node.js integration
    },
  });

  if (isDev) mainWindow.webContents.openDevTools();

  
  mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("open-directory-dialog", (event) => {
    dialog
      .showOpenDialog(mainWindow, { properties: ["openDirectory"] })
      .then((result) => {
        if (!result.canceled) {
          const directoryPath = result.filePaths[0];
          event.reply("selected-directory", directoryPath);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  ipcMain.on("process-files", (event, directoryPath) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      const mp3Files = files.filter((file) => file.endsWith(".mp3"));
      console.log(mp3Files)
      mp3Files.forEach((file) => console.log(file));
    });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
  console.log("Windows application closed successfully!");
});
