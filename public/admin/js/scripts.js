//  PreviewImage Upload
// const uploadImage = document.querySelector("[upload-image]");
// if (uploadImage) {
//   const btnRemoveImage = document.querySelector("[upload-image-remove]");
//   const uploadImageInput = document.querySelector("[upload-image-input]");
//   const uploadImagePreview = document.querySelector("[upload-image-preview]");
//   if (uploadImageInput) {
//     uploadImageInput.addEventListener("change", (e) => {
//       const [file] = e.target.files;
//       if (file) {
//         uploadImagePreview.src = URL.createObjectURL(file);
//         btnRemoveImage.addEventListener("click", (e) => {
//           uploadImageInput.value = "";
//           uploadImagePreview.src = "";
//         });
//       }
//     });
//   }
// }
const formDelete = document.querySelector("#formDelete");
if (formDelete) {
  const path = formDelete.getAttribute("data-path");
  const btnDelete = document.querySelectorAll("[btn-delete]");
  btnDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const isConfirm = confirm("Bạn có chắc muốn xóa không ? ");
      if (isConfirm) {
        const action = `${path}/${id}?_method=Delete`;
        formDelete.action = action;
        formDelete.submit();
      } else {
        return;
      }
    });
  });
}
//  Search
const formSearch = document.querySelector("[ form-search]");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    let url = new URL(window.location.href);
    e.preventDefault();
    const search = e.target[0].value;
    if (search) {
      url.searchParams.set("search", search);
    } else {
      url.searchParams.delete("search");
    }
    location.href = url.href;
  });
}
// Change Sattus
const formChangeStatus = document.querySelector("[form-change-status]");
if (formChangeStatus) {
  const path = formChangeStatus.getAttribute("data-path");
  const btnChangeStatus = document.querySelectorAll("[btn-change-status]");
  if (btnChangeStatus.length > 0) {
    btnChangeStatus.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const status = btn.getAttribute("data-status");
        const statusChange = status === "active" ? "inactive" : "active";
        const id = btn.getAttribute("data-id");
        const action = path + "/" + statusChange + "/" + id + "?_method=PATCH";
        formChangeStatus.action = action;
        formChangeStatus.submit();
      });
    });
  }
}
const formReset = document.querySelector("[form-reset]");
if (formReset) {
  const path = formReset.getAttribute("data-path");
  const btnDelete = document.querySelectorAll("[btn-reset]");
  btnDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const isConfirm = confirm("Bạn có chắc muốn khôi phục sản phẩm này không ? ");
      if (isConfirm) {
        const action = `${path}/${id}?_method=PATCH`;
        formReset.action = action;
        formReset.submit();
      } else {
        return;
      }
    });
  });
}