export const getURLORder = (orderBy: string[]): string => {
  return orderBy
    .map((item) => {
      return item.toLowerCase().split(" ").join(".");
    })
    .join(",");
};
