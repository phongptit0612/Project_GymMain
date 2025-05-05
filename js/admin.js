const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'admin') {
  window.location.href = 'login.html';
}

document.querySelector('.logout').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
});

let gymCourses = 0;
let yogaCourses = 0;
let zumbaCourses = 0;
let scheduleChart; 

function countCourses() {
  const schedules = JSON.parse(localStorage.getItem('schedules')) || [];

  gymCourses = 0;
  yogaCourses = 0;
  zumbaCourses = 0;

  schedules.forEach(schedule => {
    if (schedule.classType === "yoga") {
      yogaCourses++;
    } else if (schedule.classType === "gym") {
      gymCourses++;
    } else if (schedule.classType === "zumba") {
      zumbaCourses++;
    }
  });

  document.getElementById('gymCount').textContent = gymCourses;
  document.getElementById('yogaCount').textContent = yogaCourses;
  document.getElementById('zumbaCount').textContent = zumbaCourses;

  updateChart();
}

function updateChart() {
  const chartData = [gymCourses, yogaCourses, zumbaCourses];

  if (!scheduleChart) {
    const ctx = document.getElementById('scheduleChart').getContext('2d');
    scheduleChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Gym', 'Yoga', 'Zumba'],
        datasets: [{
          label: 'Số lượng lịch đặt',
          data: chartData,
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)', 
            'rgba(255, 206, 86, 0.5)', 
            'rgba(75, 192, 192, 0.5)'  
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)', 
            'rgba(255, 206, 86, 1)', 
            'rgba(75, 192, 192, 1)'  
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } else {
    scheduleChart.data.datasets[0].data = chartData;
    scheduleChart.update();
  }
}

countCourses();

function displaySchedules(filteredSchedules) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  filteredSchedules.forEach((schedule, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${schedule.classType}</td>
      <td>${schedule.date}</td>
      <td>${schedule.time}</td>
      <td>${schedule.name}</td>
      <td>${schedule.email}</td>
      <td>
        <button onclick="editSchedule(${index})">Sửa</button>
        <button onclick="deleteSchedule(${index})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterSchedules() {
  const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
  const classTypeFilter = document.getElementById('filter-class-type').value;
  const dateFilter = document.getElementById('filter-date').value;
  const emailFilter = document.getElementById('filter-email').value.toLowerCase();

  const filteredSchedules = schedules.filter(schedule => {
    const matchesClassType = classTypeFilter === '' || schedule.classType === classTypeFilter;
    const matchesDate = dateFilter === '' || schedule.date === dateFilter;
    const matchesEmail = emailFilter === '' || schedule.email.toLowerCase().includes(emailFilter);

    return matchesClassType && matchesDate && matchesEmail;
  });

  displaySchedules(filteredSchedules);
}

function deleteSchedule(index) {
  const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
  const filteredSchedules = filterSchedules();
  const scheduleToDelete = filteredSchedules[index];

  const scheduleIndex = schedules.findIndex(s =>
    s.email === scheduleToDelete.email &&
    s.date === scheduleToDelete.date &&
    s.time === scheduleToDelete.time
  );

  if (scheduleIndex !== -1) {
    schedules.splice(scheduleIndex, 1);
    localStorage.setItem('schedules', JSON.stringify(schedules));
    countCourses();
    filterSchedules(); // Refresh the filtered table
  }
}

function editSchedule(index) {
  const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
  const filteredSchedules = filterSchedules();
  const scheduleToEdit = filteredSchedules[index];

  const scheduleIndex = schedules.findIndex(s =>
    s.email === scheduleToEdit.email &&
    s.date === scheduleToEdit.date &&
    s.time === scheduleToEdit.time
  );

  if (scheduleIndex !== -1) {
    // Pre-fill the form with the schedule data
    document.getElementById('class-type').value = schedules[scheduleIndex].classType;
    document.getElementById('schedule-date').value = schedules[scheduleIndex].date;
    document.getElementById('schedule-time').value = schedules[scheduleIndex].time;
    document.getElementById('email').value = schedules[scheduleIndex].email;

    // Show the modal for editing
    const editModal = document.getElementById('edit-modal');
    editModal.style.display = 'flex';

    // Handle save changes
    document.getElementById('save-changes').onclick = function () {
      schedules[scheduleIndex].classType = document.getElementById('class-type').value;
      schedules[scheduleIndex].date = document.getElementById('schedule-date').value;
      schedules[scheduleIndex].time = document.getElementById('schedule-time').value;

      localStorage.setItem('schedules', JSON.stringify(schedules));
      countCourses();
      filterSchedules(); // Refresh the filtered table
      editModal.style.display = 'none';
    };

    // Handle cancel
    document.getElementById('cancel-edit').onclick = function () {
      editModal.style.display = 'none';
    };
  }
}

// Initial display of schedules
filterSchedules();
// Create the delete modal
const deleteModal = document.createElement("div");
deleteModal.className = "modal";
deleteModal.style.display = "none";
deleteModal.innerHTML = `
  <div class="modal-content">
    <p>Bạn có chắc chắn muốn xoá lịch này?</p>
    <button id="confirm-delete">Xóa</button>
    <button id="cancel-delete">Hủy</button>
  </div>
`;
document.body.appendChild(deleteModal);

// Create the edit modal
const editModal = document.createElement("div");
editModal.className = "modal";
editModal.style.display = "none";
editModal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>Chỉnh sửa lịch tập</h2>
    <form id="edit-form">
      <div class="form-group">
        <label for="edit-class-type">Lớp học:</label>
        <select id="edit-class-type" required>
          <option value="gym">Gym</option>
          <option value="yoga">Yoga</option>
          <option value="zumba">Zumba</option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-schedule-date">Ngày tập:</label>
        <input type="date" id="edit-schedule-date" required>
      </div>
      <div class="form-group">
        <label for="edit-schedule-time">Khung giờ:</label>
        <select id="edit-schedule-time" required>
          <option value="8:00-9:00">8:00 - 9:00</option>
          <option value="9:00-10:00">9:00 - 10:00</option>
          <option value="10:00-11:00">10:00 - 11:00</option>
          <option value="14:00-15:00">14:00 - 15:00</option>
          <option value="15:00-16:00">15:00 - 16:00</option>
          <option value="16:00-17:00">16:00 - 17:00</option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-name">Họ tên:</label>
        <input type="text" id="edit-name" required>
      </div>
      <div class="form-group">
        <label for="edit-email">Email:</label>
        <input type="email" id="edit-email" disabled>
      </div>
      <button type="submit">Lưu thay đổi</button>
    </form>
  </div>
`;
document.body.appendChild(editModal);

// Close the edit modal
editModal.querySelector(".close").addEventListener("click", () => {
  editModal.style.display = "none";
});

// Delete schedule function
function deleteSchedule(index) {
  deleteModal.style.display = "flex";

  document.getElementById("confirm-delete").onclick = function () {
    const schedules = JSON.parse(localStorage.getItem("schedules")) || [];
    schedules.splice(index, 1);
    localStorage.setItem("schedules", JSON.stringify(schedules));
    countCourses();
    filterSchedules(); // Refresh the table
    deleteModal.style.display = "none";
  };

  document.getElementById("cancel-delete").onclick = function () {
    deleteModal.style.display = "none";
  };
}

// Edit schedule function
function editSchedule(index) {
  const schedules = JSON.parse(localStorage.getItem("schedules")) || [];
  const scheduleToEdit = schedules[index];

  // Pre-fill the modal with the schedule data
  document.getElementById("edit-class-type").value = scheduleToEdit.classType;
  document.getElementById("edit-schedule-date").value = scheduleToEdit.date;
  document.getElementById("edit-schedule-time").value = scheduleToEdit.time;
  document.getElementById("edit-name").value = scheduleToEdit.name;
  document.getElementById("edit-email").value = scheduleToEdit.email;

  // Clear previous error messages
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
  document.querySelectorAll(".form-group input, .form-group select").forEach(el => el.classList.remove("error"));

  editModal.style.display = "flex";

  // Handle save changes
  document.getElementById("edit-form").onsubmit = function (event) {
    event.preventDefault();

    // Get updated values
    const updatedClassType = document.getElementById("edit-class-type").value;
    const updatedDate = document.getElementById("edit-schedule-date").value;
    const updatedTime = document.getElementById("edit-schedule-time").value;
    const updatedName = document.getElementById("edit-name").value;

    let hasError = false;

    // Validate fields
    if (updatedClassType === "") {
      showError("edit-class-type", "Vui lòng chọn lớp học.");
      hasError = true;
    }
    if (updatedDate === "") {
      showError("edit-schedule-date", "Vui lòng chọn ngày tập.");
      hasError = true;
    }
    if (updatedTime === "") {
      showError("edit-schedule-time", "Vui lòng chọn khung giờ.");
      hasError = true;
    }
    if (updatedName === "") {
      showError("edit-name", "Vui lòng nhập họ tên.");
      hasError = true;
    }

    const isDuplicate = schedules.some((schedule, i) =>
      i !== index && 
      schedule.classType === updatedClassType &&
      schedule.date === updatedDate &&
      schedule.time === updatedTime &&
      schedule.email === scheduleToEdit.email
    );

    if (isDuplicate) {
      showError("edit-schedule-time", "Lịch tập này đã tồn tại.");
      hasError = true;
    }

    if (hasError) return;

    scheduleToEdit.classType = updatedClassType;
    scheduleToEdit.date = updatedDate;
    scheduleToEdit.time = updatedTime;
    scheduleToEdit.name = updatedName;

    schedules[index] = scheduleToEdit;
    localStorage.setItem("schedules", JSON.stringify(schedules));
    countCourses();
    filterSchedules(); 
    editModal.style.display = "none";
  };
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