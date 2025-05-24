// Form Add to Cart
const formsUpdateQuantity = document.querySelectorAll("[form-update-quantity]");
if (formsUpdateQuantity.length > 0) {
  formsUpdateQuantity.forEach((form) => {
    const btnUp = form.querySelector("[btn-up]");
    const btnDow = form.querySelector("[btn-dow]");
    const inputQuantity = form.querySelector("[quantity]");
    const path = form.getAttribute("data-path");

    btnUp.addEventListener("click", () => {
      let value = parseInt(inputQuantity.value);
      inputQuantity.value = value + 1;

      const id = inputQuantity.getAttribute("data-id");
      const quantity = inputQuantity.value;

      // Ví dụ tạo đường dẫn để gửi đi (nếu cần)
      const action = `${path}/${id}/${quantity}?_method=PATCH`;
      form.action = action;
      form.submit();
    });

    btnDow.addEventListener("click", () => {
      let value = parseInt(inputQuantity.value);
      if (value > 1) {
        inputQuantity.value = value - 1;

        const id = inputQuantity.getAttribute("data-id");
        const quantity = inputQuantity.value;

        const action = `${path}/${id}/${quantity}?_method=PATCH`;
        form.action = action;
        form.submit();
      }
    });
  });
}
// Form Delete in Cart
const formDeleteCart = document.querySelector("#deleteCart");
if (formDeleteCart) {
  const path = formDeleteCart.getAttribute("data-path");
  const btnDeletItem = document.querySelectorAll("[btn-delete]");
  
  btnDeletItem.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const action = `${path}/${id}?_method=DELETE`;
      formDeleteCart.action = action;
      formDeleteCart.submit();
    });
  });
}
