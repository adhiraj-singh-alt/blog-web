export const paginationFilter = (page: number, limit: number) => {
  page = Math.floor(parseInt(page)) > 0 ? page - 1 : 0;
  limit = Math.floor(parseInt(page)) > 50 ? 50 : limit;

  let offset = page * limit;
  return { limit, offset };
};
