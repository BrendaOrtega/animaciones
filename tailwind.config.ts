const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0E0E11",
        fish: "#5158F6",
        iron: "#495466",
        metal: "#989898",
        lightGray: "#E5E5E5",
        tale: "#A9A9A9",
      },
      backgroundImage: {
        hero: "url('/cover.png')",
        flipWords: "url('/gifs/flip-words.png')",
        flipWordsGif: "url('/gifs/flip-words.gif')",
        cards: "url('/gifs/card.png')",
        cardsGif: "url('/gifs/3dcard.gif')",
        draggable: "url('/gifs/draggable.png')",
        draggableGif: "url('/gifs/draggable.gif')",
        highlightGif: "url('/gifs/hero-highlight.gif')",
        highlight: "url('/gifs/highlight.png')",
        pattern: "url('/pattern.svg')",
        scrollGif: "url('/gifs/scroll.gif')",
        scroll: "url('/gifs/simpleScroll.png')",
        list: "url('/gifs/list.png')",
        listGif: "url('/gifs/list.gif')",
        slider: "url('/gifs/slider.png')",
        sliderGif: "url('/gifs/slider.gif')",
        border: "url('/gifs/border.png')",
        borderGif: "url('/gifs/border.gif')",
        image: "url('/gifs/3dimage.png')",
        imageGif: "url('/gifs/3dimage.gif')",
        link: "url('/gifs/link.png')",
        linkGif: "url('/gifs/link.gif')",
        zoom: "url('/gifs/zoom.png')",
        zoomGif: "url('/gifs/zoom.gif')",
        infinite: "url('/gifs/infinite.png')",
        infiniteGif: "url('/gifs/infinite.gif')",
      },
    },
  },
  plugins: [addVariablesForColors, require("@tailwindcss/forms")],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
