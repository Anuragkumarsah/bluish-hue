import { parentPort } from "worker_threads";
import fs from "fs";

parentPort.on("message", (event) => {
  const interval = event.interval;
  const message = event.message;
  if (message === "setJSON") {
    const jsonData = event.data;
    const filePath = event.filePath;
    const jsonString = JSON.stringify(jsonData);
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        parentPort.postMessage({ status: "error", error: err.message });
      } else {
        parentPort.postMessage({
          status: "success",
          message: `${filePath
            .split("/")
            .pop()} json file was successfully created`,
        });
      }
    });
  } else if (message === "scheduler") {
    setInterval(() => {
      parentPort.postMessage("ping");
    }, interval);
  }
});
