import { SimpleDragger } from "~/components/SimpleHover";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
// import chp from "child_process";
import fetch from "node-fetch";
import fs from "fs";
import { getPutVideoExperiment } from "~/.server/tigris";
import { Worker } from "worker_threads";

const videoURL =
  "https://cdn.pixabay.com/video/2022/10/30/137088-765727914_large.mp4";

export const loader = async () => {
  // const videoURL = await getReadURL("video-673b52243699b4f81b671523");
  const tempPath = path.join("./conversiones", "temp");
  const outputPath = path.join("./conversiones", "small.mp4");
  let contentLength = null;
  let contentType = null;
  const downloadFile = async (fileURL: string) => {
    const res = await fetch(fileURL);
    contentLength = res.headers.get("content-length");
    contentType = res.headers.get("content-type");
    const fileStream = fs.createWriteStream(tempPath);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
  };
  await downloadFile(videoURL);

  // feed it to the ffmpeg
  const command = ffmpeg(tempPath).videoCodec("libx264").format("mp4");
  command.clone().size("320x200").save(outputPath); // @todo bitrates etc.
  command.clone().save(outputPath.replace("small", "original"));
  const file = fs.readFileSync(outputPath);
  // const putURL = await getPutVideoExperiment();
  // const cpu = require("os").cpus().length;
  // console.log("cores?", cpu);
  const putURL = await getPutVideoExperiment();
  const worker = new Worker("./conversiones/resizeAndUpload.js", {
    workerData: { file, contentLength, contentType, putURL },
  });
  worker.on("message", (da) => console.log("MESSAGE: ", da));
  worker.on("error", (e) => console.error(e));
  worker.on("exit", (code) => {
    console.log("Exit Code: ", code);
  });

  // const childProcess = chp.fork(
  //   path.join("./conversiones", "resizeAndUpload.js")
  // );

  // childProcess.send();
  // childProcess.on("message", (message) => {
  //   console.log("Terminó", message);
  // });

  return null;

  await fetch(putURL, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Length": String(contentLength),
      "Content-Type": contentType,
    },
  })
    .then((r) => console.log("Uploaded to S3: ", r.ok))
    .catch((e) => console.error(e));

  return null;
};

export default function SegundoEjemplo() {
  return (
    <article className="h-screen flex items-center justify-center bg-pink-400 ">
      <SimpleDragger />
    </article>
  );
}

// import { useEffect, useRef, useState } from "react";
// import { FaWindowClose } from "react-icons/fa";
// import { AnimatePresence, motion } from "framer-motion";

// export default function SegundoEjemplo() {
//   const [show, setShow] = useState(true);

//   const handleClose = () => {
//     setShow(false);
//     setTimeout(() => setShow(true), 2000);
//   };

//   return (

//     <article className="h-screen flex items-center justify-center bg-pink-400 ">
//       <AnimatePresence>
//         {show && (
//           <motion.div
//             className="relative"
//             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//             initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
//             exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
//             transition={{ duration: 1, type: "spring" }}
//           >
//             <h1 className="text-8xl text-gray-800">Hola blissmo</h1>
//             <button
//               onClick={handleClose}
//               className="text-6xl hover:scale-105 transition-all active:scale-100"
//               style={{
//                 position: "absolute",
//                 top: -16,
//                 right: -16,
//                 rotate: "-4deg",
//               }}
//             >
//               <FaWindowClose />
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </article>
//   );
// }

// export function PrimerEjemplo() {
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setTimeout(() => {
//       animateEnter();
//     }, 300);
//   }, []);

//   const animateExit = (secs: number = 1) => {
//     if (!ref.current) return;
//     ref.current.style.animationDuration = `${secs * 1000}`;
//     ref.current.style.transform = "translateY(-20px)";
//     ref.current.style.opacity = "0";
//     ref.current.style.filter = "blur(9px)";
//   };

//   const animateEnter = (secs: number = 1) => {
//     if (!ref.current) return;
//     ref.current.style.animationDuration = `${secs * 1000}`;
//     ref.current.style.transform = "translateY(0px)";
//     ref.current.style.opacity = "1";
//     ref.current.style.filter = "blur(0px)";
//   };

//   const handleClose = () => {
//     if (!ref.current) return; // guard

//     animateExit();
//     setTimeout(animateEnter, 3000); // reset
//   };

//   return (
//     <article className="h-screen flex items-center justify-center bg-pink-400 ">
//       <div
//         style={{
//           transform: "translateY(20px)",
//           opacity: "0",
//           filter: "blur(9px)",
//           animationDelay: "1",
//           transition: "all 1s",
//           transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
//         }}
//         className="relative"
//         ref={ref}
//       >
//         <h1 className="text-8xl text-gray-800">Hola blissmo</h1>
//         <button
//           onClick={handleClose}
//           className="text-6xl hover:scale-105 transition-all active:scale-100"
//           style={{
//             position: "absolute",
//             top: -16,
//             right: -16,
//             rotate: "4deg",
//           }}
//         >
//           <FaWindowClose />
//         </button>
//       </div>
//     </article>
//   );
// }
