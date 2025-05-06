const serviceModal = document.createElement("div");
serviceModal.className = "modal";
serviceModal.style.display = "none";
serviceModal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2 id="modal-title">Thêm dịch vụ</h2>
    <form id="service-form">
      <div class="form-group">
        <label for="service-name">Tên dịch vụ:</label>
        <input type="text" id="service-name" required>
        <span class="error-message"></span>
      </div>
      <div class="form-group">
        <label for="service-image">Hình ảnh (URL):</label>
        <input type="text" id="service-image" required>
        <span class="error-message"></span>
      </div>
      <div class="form-group">
        <label for="service-description">Mô tả:</label>
        <textarea id="service-description" rows="3" required></textarea>
        <span class="error-message"></span>
      </div>
      <button type="submit">Lưu</button>
    </form>
  </div>
`;
document.body.appendChild(serviceModal);

serviceModal.querySelector(".close").addEventListener("click", () => {
  serviceModal.style.display = "none";
});

let services = JSON.parse(localStorage.getItem("services")) || [];

const serviceTable = document.querySelector("table tbody");

const addServiceButton = document.querySelector(".btn");

function displayServices() {
  serviceTable.innerHTML = ""; 

  services.forEach((service, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${service.name}</td>
      <td>${service.description}</td>
      <td><img src="${service.image}" alt="${service.name}" class="service-image"></td>
      <td>
        <button class="btn-edit" onclick="editService(${index})">Sửa</button>
        <button class="btn-delete" onclick="deleteService(${index})">Xóa</button>
      </td>
    `;
    serviceTable.appendChild(row);
  });
}

addServiceButton.addEventListener("click", () => {
  document.getElementById("modal-title").textContent = "Thêm dịch vụ";
  document.getElementById("service-name").value = "";
  document.getElementById("service-image").value = "";
  document.getElementById("service-description").value = "";
  clearErrors();
  serviceModal.style.display = "flex";

  document.getElementById("service-form").onsubmit = function (event) {
    event.preventDefault();

    const name = document.getElementById("service-name").value.trim();
    const image = document.getElementById("service-image").value.trim();
    const description = document.getElementById("service-description").value.trim();

    if (!validateServiceForm(name, image, description)) return;

    services.push({ name, image, description });
    localStorage.setItem("services", JSON.stringify(services));
    displayServices();
    serviceModal.style.display = "none";
  };
});

function editService(index) {
  const service = services[index];
  document.getElementById("modal-title").textContent = "Sửa dịch vụ";
  document.getElementById("service-name").value = service.name;
  document.getElementById("service-image").value = service.image;
  document.getElementById("service-description").value = service.description;
  clearErrors();
  serviceModal.style.display = "flex";

  document.getElementById("service-form").onsubmit = function (event) {
    event.preventDefault();

    const name = document.getElementById("service-name").value.trim();
    const image = document.getElementById("service-image").value.trim();
    const description = document.getElementById("service-description").value.trim();

    if (!validateServiceForm(name, image, description)) return;

    services[index] = { name, image, description };
    localStorage.setItem("services", JSON.stringify(services));
    displayServices();
    serviceModal.style.display = "none";
  };
}

function deleteService(index) {
  if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
    services.splice(index, 1);
    localStorage.setItem("services", JSON.stringify(services));
    displayServices();
  }
}

function validateServiceForm(name, image, description) {
  let isValid = true;

  if (name === "") {
    showError("service-name", "Vui lòng nhập tên dịch vụ.");
    isValid = false;
  }

  if (image === "") {
    showError("service-image", "Vui lòng nhập URL hình ảnh.");
    isValid = false;
  }

  if (description === "") {
    showError("service-description", "Vui lòng nhập mô tả.");
    isValid = false;
  }

  return isValid;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = field.nextElementSibling;

  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.textContent = message;
  } else {
    const errorMessage = document.createElement("span");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "12px";
    errorMessage.style.marginTop = "5px";
    field.parentNode.appendChild(errorMessage);
  }

  field.classList.add("error");
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
  document.querySelectorAll(".form-group input, .form-group textarea").forEach(el => el.classList.remove("error"));
}

displayServices();