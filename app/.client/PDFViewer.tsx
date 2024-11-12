import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { ReactNode } from "react";
import { createTw } from "react-pdf-tailwind";

// "vibrate" in window.navigator;

const tw = createTw({});

export function PDFViewer() {
  return (
    <Document>
      <Page size="LETTER" style={tw("open-sans-family p-4 flex flex-col")}>
        <Title>Primer módulo: Animaciones empleando únicamente CSS</Title>
        <Image
          style={tw("w-[320px] h-[320px]")}
          src="https://media.licdn.com/dms/image/v2/D4E12AQE4OzgbQ-BTdg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1680273538907?e=2147483647&v=beta&t=5n9hU7Enj-BAXzOJgeY03OQ9P13xPijVKspKnFDqEBk"
        />
        <Text style={tw("text-amber-600 text-2xl")}>
          Segundo módulo: Algunos fundamentos para usar mejor Framer Motion
        </Text>
      </Page>
    </Document>
  );
}

export const Title = ({ children }: { children: ReactNode }) => {
  return <Text style={tw("text-center text-custom text-6xl")}>{children}</Text>;
};
