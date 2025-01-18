import { Video } from "@prisma/client";
import { Drawer } from "~/components/SimpleDrawer";
import { VideoForm } from "../VideoForm";
export const VideoFormDrawer = ({
  setShowVideoDrawer,
  setVideo,
  showVideoDrawer,
  video,
  initialVideo, // @review
  videos,
}: {
  setShowVideoDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setVideo: (arg0: Partial<Video>) => void;
  showVideoDrawer: boolean;
  video: Partial<Video>;
  initialVideo: Partial<Video>;
  videos: Partial<Video>[];
}) => {
  return (
    <Drawer
      onClose={() => {
        setShowVideoDrawer(false);
        setVideo({});
      }}
      isOpen={showVideoDrawer}
      title={video.id ? "Editar video" : "Añadir video"}
      cta={<></>} // remove cancel button
    >
      <VideoForm
        // @todo❌ sugerir indice, empieza a tener sentido el módulo, cuando menos como meta referencia? 🤫
        // Nel, sigamos la convención de un S3 y usemos / para mantener un array de módulos y submódulos en el modelo del curso. Así conservamos el orden también. ✅
        onSubmit={() => {
          // @Review dónde está el objeto fresco?
          setVideo(video);
          setShowVideoDrawer(false);
        }}
        video={video || initialVideo}
        videosLength={videos.length}
      />
    </Drawer>
  );
};
