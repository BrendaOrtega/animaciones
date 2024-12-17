export const getMasterFileResponse = ({
  sizes = ["360p", "480p", "720p", "1080p"],
  storageKey,
}: {
  storageKey: string;
  sizes?: string[];
}) => {
  let content = "#EXTM3U\n";
  if (sizes.includes("360p")) {
    content += `#EXT-X-STREAM-INF:BANDWIDTH=375000,RESOLUTION=640x360\n/playlist/${storageKey}/360p.m3u8\n`;
  }
  if (sizes.includes("480p")) {
    // content += `#EXT-X-STREAM-INF:BANDWIDTH=750000,RESOLUTION=854x480\n/playlist/${storageKey}/480p.m3u8\n`;
    content += `#EXT-X-STREAM-INF:BANDWIDTH=750000,RESOLUTION=854x480\n/playlist/${storageKey}/480p.m3u8\n`;
  }
  if (sizes.includes("720p")) {
    // content += `#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720\n/playlist/${storageKey}/720p.m3u8\n`;
    content += `#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720\n/playlist/${storageKey}/720p.m3u8\n`;
  }
  if (sizes.includes("1080p")) {
    content += `#EXT-X-STREAM-INF:BANDWIDTH=3500000,RESOLUTION=1920x1080\n/playlist/${storageKey}/1080p.m3u8`;
  }

  //   sizes.forEach(size) // @todo just write it once
  // console.log("CONTET: \n", content);
  return new Response(content, {
    headers: {
      "content-type": "application/x-mpegURL",
    },
  });
};
