const showAlert = document.querySelector("#show-alert");
const closeAlert = document.querySelector("#close-alert");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  closeAlert.addEventListener("click", () => {
    showAlert.style.display = "none";
  });
}
//  Làm phân trang PaginationPagination
const btnPagnation = document.querySelectorAll("[button-pagination]");
if (btnPagnation) {
  btnPagnation.forEach((btn) => {
    let url = new URL(window.location.href);
    btn.addEventListener("click", (e) => {
      console.log("ok");
      const page = btn.getAttribute("button-pagination");

      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const checkAll = checkboxMulti.querySelector("#checkAll");

  const checkboxItem = checkboxMulti.querySelectorAll(".checkItem");
  checkAll.addEventListener("click", () => {
    if (checkAll.checked) {
      checkboxItem.forEach((item) => {
        item.checked = true;
      });
    } else {
      checkboxItem.forEach((item) => {
        item.checked = false;
      });
    }
  });
  checkboxItem.forEach((item) => {
    item.addEventListener("click", () => {
      const countChecked =
        checkboxMulti.querySelectorAll(".checkItem:checked").length;
      if (countChecked === checkboxItem.length) {
        checkAll.checked = true;
      } else {
        checkAll.checked = false;
      }
    });
  });
}
// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkedItem = checkboxMulti.querySelectorAll(".checkItem:checked");
    const inputStatus = checkboxMulti.querySelector("#status-value");
    const typeChange = e.target.elements.type.value;
    if (typeChange == "deleteAll") {
      const isConfirm = confirm("Bạn có muốn xóa tất cả sản phẩm không ?");
      if (!isConfirm) {
        return;
      }
    }

    if (checkedItem.length > 0) {
      let ids = [];
      const inputValues = formChangeMulti.querySelector("#input-values");
      checkedItem.forEach((item) => {
        const id = item.getAttribute("data-id");
        if (typeChange == "change-position") {
          const position = item
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id} - ${position}`);
        } else {
          ids.push(id);
        }
      });
      inputValues.value = ids.join(",");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một bản ghi !");
    }
  });
}
// Preview upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const btnRemoveImage = document.querySelector("[upload-image-remove]");
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  if (uploadImageInput) {
    uploadImageInput.addEventListener("change", (e) => {
      const [file] = e.target.files;
      if (file) {
        uploadImagePreview.src = URL.createObjectURL(file);
        btnRemoveImage.addEventListener("click", (e) => {
          uploadImageInput.value = "";
          uploadImagePreview.src = "";
        });
      }
    });
  }
}

// Add to Cart
const formAddCart = document.querySelector("#addCart");

if (formAddCart) {
  const path = formAddCart.getAttribute("data-path");

  const inputQuantity = formAddCart.querySelector(".quantity");
  const btnAddCart = formAddCart.querySelector("[btn-add-cart]");

  btnAddCart.addEventListener("click", (e) => {
    e.preventDefault();
    const id = btnAddCart.getAttribute("data-id");
    const quantity = inputQuantity.value;
    const action = path + "/" + id + "/" + quantity;
    console.log(action);
    formAddCart.action = action;
    formAddCart.submit();
  });
}
const formByNow = document.querySelector("#byNow");
if (formByNow) {
  const btnByNow = document.querySelector("[btn-by-now]");
  const path = formByNow.getAttribute("data-path");
  const quantity = document.querySelector(".quantity").value;
  const id = btnByNow.getAttribute("data-id");

  const action = `${path}/${id}/${quantity}`;
  formByNow.setAttribute("action", action);
}
