import { SimpleDragger } from "~/components/SimpleHover";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import chp from "child_process";
import fetch from "node-fetch";
import fs from "fs";
import { getGetVideoExperiment, getPutVideoExperiment } from "~/.server/tigris";

const videoURL =
  "https://wild-bird-2039.fly.storage.tigris.dev/courses/animations/bolita.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=tid_wwTNvYmQACiTfuBlYMWtzrMlJdflLKbdvbMcBqYDcqFKujEpOl%2F20241129%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241129T032730Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=4b41e805a3995e58beab2096ef1f61394c81928e3e564460a4b61e59b5879d1c";
// "https://cdn.pixabay.com/video/2022/10/30/137088-765727914_large.mp4";

export const loader = async () => {
  const videoURL = await getGetVideoExperiment(
    "2873666c-cbd4-44ce-934f-c803894c3263"
  );
  const tempPath = path.join("./conversiones", "perro.mp4");
  const outputPath = path.join("./conversiones", "small.mp4");
  const downloadFile = async (fileURL: string, thePath = tempPath) => {
    const res = await fetch(fileURL);
    const fileStream = fs.createWriteStream(thePath);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
  };
  await downloadFile(videoURL);

  // feed it to the ffmpeg
  const command = ffmpeg(tempPath).videoCodec("libx264").format("mp4");
  command.clone().size("320x200").save(outputPath);
  // command.clone().save(outputPath);
  const file = fs.readFileSync(outputPath);
  const putURL = await getPutVideoExperiment();
  await fetch(putURL, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Length": "1258291.2",
      "Content-Type": "video/mp4",
    },
  })
    .then((r) => console.log("Uploaded to S3: ", r.ok))
    .catch((e) => console.error(e));

  // const command = ffmpeg(path.join(url))
  //   // .audioCodec("libfaac")
  //   .videoCodec("libx264")
  //   .format("mp4");

  // command.clone().size("320x200").save("../../public/videos/small.mp4");
  // command.clone().save("../../public/videos/output.mp4");

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
