// DOM Elements
const scheduleTable = document.getElementById("schedule-table");
const addButton = document.getElementById("add-schedule");
const modal = document.createElement("div");
modal.className = "modal";
modal.style.display = "none"; // Ẩn modal mặc định
modal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>Đặt lịch tập mới</h2>
    <form id="schedule-form">
      <div class="form-group">
        <label for="class-type">Lớp học:</label>
        <select id="class-type" required>
          <option value="">Chọn lớp học</option>
          <option value="gym">Gym</option>
          <option value="yoga">Yoga</option>
          <option value="zumba">Zumba</option>
        </select>
      </div>
      <div class="form-group">
        <label for="schedule-date">Ngày tập:</label>
        <input type="date" id="schedule-date" required>
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
      </div>
      <div class="form-group">
        <label for="fullname">Họ tên:</label>
        <input type="text" id="fullname" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
      </div>
      <button type="submit">Đặt lịch</button>
    </form>
  </div>
`;

// Add modal to body
document.body.appendChild(modal);

// Get current user from localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Initialize schedules from localStorage
let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

// Display schedules
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
        <button onclick="deleteSchedule(${index})">Xoá</button>
      </td>
    `;
    scheduleTable.appendChild(row);
  });
}

// Add new schedule
function addSchedule(event) {
  event.preventDefault();
  
  // Kiểm tra đăng nhập
  if (!currentUser) {
    alert("Vui lòng đăng nhập để đặt lịch!");
    window.location.href = "login.html";
    return;
  }

  const classType = document.getElementById("class-type").value;
  const date = document.getElementById("schedule-date").value;
  const time = document.getElementById("schedule-time").value;
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  
  const newSchedule = {
    classType,
    date,
    time,
    name: fullname,
    email: email,
    userId: currentUser.id // Thêm userId để theo dõi ai đặt lịch
  };

  schedules.push(newSchedule);
  localStorage.setItem("schedules", JSON.stringify(schedules));
  displaySchedules();
  modal.style.display = "none";
  event.target.reset();
}

// Delete schedule
function deleteSchedule(index) {
  if (confirm("Bạn có chắc chắn muốn xoá lịch này?")) {
    schedules.splice(index, 1);
    localStorage.setItem("schedules", JSON.stringify(schedules));
    displaySchedules();
  }
}

// Event Listeners
addButton.addEventListener("click", () => {
  // Kiểm tra đăng nhập trước khi mở modal
  if (!currentUser) {
    alert("Vui lòng đăng nhập để đặt lịch!");
    window.location.href = "login.html";
    return;
  }
  modal.style.display = "flex";
});

document.querySelector(".close").addEventListener("click", () => {
  modal.style.display = "none";
});

document.getElementById("schedule-form").addEventListener("submit", addSchedule);

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Initialize display
displaySchedules();
