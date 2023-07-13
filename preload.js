const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  // get mp3 files
  if(confirm('This will search all mp3 files in your folder\nDo you want to continue?')) {
    ipcRenderer.send("open-directory-dialog");
  }
});

ipcRenderer.on("selected-directory", (event, directoryPath) => {
  ipcRenderer.send("process-files", directoryPath);
});
