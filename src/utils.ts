import sampleImg from "./Image/no_image.jpg";

export const makeImagePath_backdrop = (backdrop?: string, format?: string) => {
  if (backdrop) {
    return `https://image.tmdb.org/t/p/${format ?? "original"}/${backdrop}`;
  } else {
    return sampleImg;
  }
};

export const makeImagePath_poster = (backdrop?: string, format?: string) => {
  if (backdrop) {
    return `https://image.tmdb.org/t/p/${format ?? "original"}/${backdrop}`;
  } else {
    return sampleImg;
  }
};

export const makeImagePath = (
  backdrop?: string,
  poster?: string,
  format?: string
) => {
  if (backdrop || poster) {
    return `https://image.tmdb.org/t/p/${format ?? "original"}/${
      backdrop !== null ? backdrop : poster
    }`;
  } else {
    return sampleImg;
  }
};

// format: size,
// ex) format: w500
