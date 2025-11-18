
export const getFavoriteKey = (username: string) =>
  `favorites_${username}`;


export const getFavorites = (username: string) => {
  const key = getFavoriteKey(username);
  return JSON.parse(localStorage.getItem(key) || "[]");
};


export const addFavorite = (username: string, article: any) => {
  const key = getFavoriteKey(username);
  const current = getFavorites(username);

  
  const exists = current.some((a: any) => a.url === article.url);
  if (!exists) {
    current.push(article);
    localStorage.setItem(key, JSON.stringify(current));
  }
};


export const removeFavorite = (username: string, url: string) => {
  const key = getFavoriteKey(username);
  let current = getFavorites(username);
  current = current.filter((a: any) => a.url !== url);
  localStorage.setItem(key, JSON.stringify(current));
};
