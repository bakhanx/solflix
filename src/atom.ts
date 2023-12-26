import { atom, selector } from "recoil";

export const windowWidth = atom({
  key: "windowWidth",
  default: window.innerWidth,
});

export const windowHeight = atom({
  key: "windowHeight",
  default: window.innerHeight,
});

export const onOffOverlay = atom({
  key: "onOffOverlay",
  default: "",
});

export const slideOffset = selector({
  key: "slideOffset",
  get: ({ get }) => {
    const width = get(windowWidth);
    if (width > 1024) {
      return 6;
    } else if (width > 768) {
      return 5;
    } else if (width > 480) {
      return 4;
    } else return 3;
  },
});
