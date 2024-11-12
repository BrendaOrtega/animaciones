import { ReactNode, Suspense } from "react";
import { createTw } from "react-pdf-tailwind";
import { PDFViewer } from "~/.client/PDFViewer";

// "vibrate" in window.navigator;

const tw = createTw({});

export default function Route() {
  return (
    <>
      <Suspense fallback={<>cargando...</>}>
        <PDFViewer />;
      </Suspense>
    </>
  );
}
