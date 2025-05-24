module.exports =  (objectPagination, query, countProducts) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem; // Công thức phân trang
  const totalPage = Math.ceil(countProducts / objectPagination.limitItem);// Làm tròn lên
  objectPagination.totalPage = totalPage;
  return objectPagination;
};
