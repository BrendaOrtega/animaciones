export const getMetaTags = ({
  title = "Fixtergeek.com",
  description = "Cursos para programadores latinoamericanos reales",
  image = "https://i.imgur.com/kP5Rrjt.png", // || "/full-logo.svg",
  url = "https://fixtergeek.com",
  video,
  audio,
}: {
  title?: string;
  description?: string;
  image?: string;
  video?: string;
  audio?: string;
  url?: string;
}) => [
  { title },
  {
    property: "og:title",
    content: title,
  },
  {
    name: "description",
    content: description,
  },
  {
    property: "og:description",
    content: description,
  },
  {
    property: "og:site_name",
    content: title,
  },
  {
    property: "og:url",
    content: url,
  },

  {
    property: "og:type",
    content: "video.courses",
  },
  {
    property: "og:image",
    content: image,
  },
  {
    property: "og:image:alt",
    content: "fixtergeek.com logo",
  },
  {
    property: "og:locale",
    content: "es_MX",
  },
  {
    property: "og:video",
    content: video,
  },
  {
    property: "og:audio",
    content: audio,
  },
  {
    property: "twitter:card",
    content: "summary_large_image",
  },
  {
    property: "twitter:description",
    content: description,
  },
  {
    property: "twitter:title",
    content: title,
  },
  {
    property: "twitter:image",
    content: image,
  },
];
