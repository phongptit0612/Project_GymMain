const scheduleTable = document.getElementById("schedule-table");
const modal = document.createElement("div");

modal.className = "modal";
modal.style.display = "none";
modal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>Đặt lịch tập mới</h2> <br>
    <form id="schedule-form" novalidate>
      <div class="form-group">
        <label for="class-type">Lớp học:</label>
        <select id="class-type" required>
          <option value="">Chọn lớp học</option>
          <option value="gym">Gym</option>
          <option value="yoga">Yoga</option>
          <option value="zumba">Zumba</option>
        </select>
        <span class="error-message" id="error-class-type"></span>
      </div>
      <div class="form-group">
        <label for="schedule-date">Ngày tập:</label>
        <input type="date" id="schedule-date" required>
        <span class="error-message" id="error-schedule-date"></span>
      </div>
      <div class="form-group">
        <label for="schedule-time">Khung giờ:</label>
        <select id="schedule-time" required>
          <option value="">Chọn khung giờ</option>
          <option value="8:00-9:00">8:00 - 9:00</option>
          <option value="9:00-10:00">9:00 - 10:00</option>
          <option value="10:00-11:00">10:00 - 11:00</option>
          <option value="14:00-15:00">14:00 - 15:00</option>
          <option value="15:00-16:00">15:00 - 16:00</option>
          <option value="16:00-17:00">16:00 - 17:00</option>
        </select>
        <span class="error-message" id="error-schedule-time"></span>
      </div>
      <div class="form-group">
        <label for="fullname">Họ tên:</label>
        <input type="text" id="fullname" disabled>
        <span class="error-message" id="error-fullname"></span>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" disabled>
        <span class="error-message" id="error-email"></span>
      </div>
      <button type="submit">Thêm Lịch</button>
    </form>
  </div>
`;
document.body.appendChild(modal);

//lay add schedule button
const addButton = document.getElementById("add-schedule");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

const deleteModal = document.createElement("div");
deleteModal.className = "modal";
deleteModal.style.display = "none";
deleteModal.innerHTML = `
  <div class="modal-content">
    <p>Bạn có chắc chắn muốn xoá lịch này?</p>
    <button id="confirm-delete">Xoá</button>
    <button id="cancel-delete">Huỷ</button>
  </div>
`;
document.body.appendChild(deleteModal);

addButton.addEventListener("click", () => {
  if (!currentUser) {
    alert("Vui lòng đăng nhập để đặt lịch!");
    window.location.href = "login.html";
    return;
  }

  // Xoa cac loi
  modal.querySelectorAll(".error-message").forEach(el => el.textContent = "");
  modal.querySelectorAll(".error").forEach(el => el.classList.remove("error"));

  document.getElementById("fullname").value = currentUser.name;
  document.getElementById("email").value = currentUser.email;

  modal.style.display = "flex";
});

document.querySelector(".close").addEventListener("click", () => {
  modal.style.display = "none";
});

document.getElementById("schedule-form").addEventListener("submit", addSchedule);

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

function displaySchedules() {
  scheduleTable.innerHTML = ""; 

  schedules.forEach((schedule, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${schedule.classType}</td>
      <td>${schedule.date}</td>
      <td>${schedule.time}</td>
      <td>${schedule.name}</td>
      <td>${schedule.email}</td>
      <td>
        <button onclick="editSchedule(${index})">Sửa</button>
        <button onclick="deleteSchedule(${index})">Xoá</button>
      </td>
    `;
    scheduleTable.appendChild(row);
  });
}

let editIndex = null;

function addSchedule(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Vui lòng đăng nhập để đặt lịch!");
    window.location.href = "login.html";
    return;
  }

  //Xoa cac dong error
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
  document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));

  const classType = document.getElementById("class-type").value;
  const date = document.getElementById("schedule-date").value;
  const time = document.getElementById("schedule-time").value;

  const errorClassType = document.getElementById("error-class-type");
  const errorDate = document.getElementById("error-schedule-date");
  const errorTime = document.getElementById("error-schedule-time");

  let hasError = false;

  if (classType === "") {
    errorClassType.textContent = "Vui lòng chọn lớp học.";
    document.getElementById("class-type").classList.add("error");
    hasError = true;
  }

  if (date === "") {
    errorDate.textContent = "Vui lòng chọn ngày tập.";
    document.getElementById("schedule-date").classList.add("error");
    hasError = true;
  }

  if (time === "") {
    errorTime.textContent = "Vui lòng chọn khung giờ.";
    document.getElementById("schedule-time").classList.add("error");
    hasError = true;
  }

  const duplicate = schedules.some(schedule =>
    schedule.classType === classType &&
    schedule.date === date &&
    schedule.time === time &&
    schedule.email === currentUser.email
  );
  if (duplicate) {
    errorTime.textContent = "Lịch tập này đã tồn tại.";
    document.getElementById("schedule-time").classList.add("error");
    hasError = true;
  }

  if (hasError) return;

  const newSchedule = {
    classType,
    date,
    time,
    name: currentUser.name,
    email: currentUser.email,
    userId: currentUser.id
  };

  if (editIndex === null) {
    schedules.push(newSchedule);
  } else {
    schedules[editIndex] = newSchedule;
    editIndex = null;
  }

  localStorage.setItem("schedules", JSON.stringify(schedules));
  displaySchedules();
  modal.style.display = "none";
  event.target.reset();
}

function editSchedule(index) {
  const schedule = schedules[index];
  editIndex = index;

  modal.style.display = "flex";

  document.getElementById("class-type").value = schedule.classType;
  document.getElementById("schedule-date").value = schedule.date;
  document.getElementById("schedule-time").value = schedule.time;
  document.getElementById("fullname").value = schedule.name;
  document.getElementById("email").value = schedule.email;
}

function deleteSchedule(index) {
  deleteModal.style.display = "flex";

  document.getElementById("confirm-delete").onclick = function () {
    schedules.splice(index, 1);
    localStorage.setItem("schedules", JSON.stringify(schedules));
    displaySchedules();
    deleteModal.style.display = "none";
  };

  document.getElementById("cancel-delete").onclick = function () {
    deleteModal.style.display = "none";
  };
}

displaySchedules();