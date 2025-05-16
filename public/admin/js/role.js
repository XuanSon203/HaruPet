// Permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const btnSubmit = document.querySelector("[ btn-submit]");
  btnSubmit.addEventListener("click", () => {
    let permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");
    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      // Lấy ra các id tương ứng
      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        // Lặp qua tất cả các thẻ input và in ra các trạng thái của ô input checked bằng true hay false
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });
    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector(
        "#form-change-permissions"
      );
      if (formChangePermissions) {
        const inputPermissions = formChangePermissions.querySelector(
          "input[name='permissions']"
        );
        inputPermissions.value = JSON.stringify(permissions);
        formChangePermissions.submit();
      }
    }
  });
}
// Permission data default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermissions = document.querySelector("[table-permissions]");
  records.forEach((record, index) => {
    const permissions = record.permissions;
    permissions.forEach((permission) => {
      const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
      const input = row.querySelectorAll("input")[index];
      input.checked = true;
      console.log(index);
      console.log(permission);
    });
  });
}

