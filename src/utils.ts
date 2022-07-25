export const makeImagePath_backdrop = (id?: string, format?: string) => {
  return `https://image.tmdb.org/t/p/${format ?? "original"}/${id}`;
};

export const makeImagePath_poster = (id?: string, format?: string) => {
  return `https://image.tmdb.org/t/p/${format ?? "original"}/${id}`;
};

export const makeImagePath = (
  backdrop?: string,
  poster?: string,
  format?: string
) => {
  return `https://image.tmdb.org/t/p/${format ?? "original"}/${backdrop !==null ? backdrop : poster}`;
};

// format: size,
// ex) format: w500
