import fetch from "node-fetch";
import { parentPort, workerData } from "worker_threads";

//child process is listening for messages by the parent process

// process.exit(); // make sure to use exit() to prevent orphaned processes

const run = async () => {
  const result = await put(workerData);
  // await new Promise((r) => setTimeout(r, 60000));
  parentPort.postMessage(result.ok);
};

run();

function put({ file, contentLength, contentType, putURL }) {
  return fetch(putURL, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Length": String(contentLength),
      "Content-Type": contentType,
    },
  }).catch((e) => console.error(e));
}
