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