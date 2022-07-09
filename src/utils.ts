
export const makeImagePath_backdrop = (id: string, format?: string) => {
  return `https://image.tmdb.org/t/p/${format ?? "original"}/${id}`;
};

export const makeImagePath_poster = (id:string, format?:string)=>{
  return `https://image.tmdb.org/t/p/${format ?? "original"}/${id}`;
}


// format: size,  
// ex) format: w500
