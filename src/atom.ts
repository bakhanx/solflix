import { atom, selector } from "recoil";


export const windowWidth = atom({
  key: "windowWidth",
  default: window.innerWidth,
});

export const slideOffset = selector({
  key: "slideOffset",
  get: ({ get }) => {
    const width = get(windowWidth);
    if (width > 1024) {
        return 6;
    } else if (width > 768) {
        return 5;
    } else {
        return 4;
    }
  },
});
