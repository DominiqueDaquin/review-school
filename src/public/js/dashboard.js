
let currentTab = "accueil"
let gradesChart = null
let subjectsChart = null

document.addEventListener("DOMContentLoaded", () => {
  initializeCharts()
  
  showTab("accueil")
})


function showTab(tabName) {
  const tabs = document.querySelectorAll(".tab-content")
  
  tabs.forEach((tab) => {
    tab.classList.add("hidden")
  })


  const selectedTab = document.getElementById(tabName + "-tab")
  console.log(selectedTab);
  
  if (selectedTab) {
    selectedTab.classList.remove("hidden")
  }

  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.classList.remove("active")
  })

  const activeNavItem = document.querySelector(`[onclick="showTab('${tabName}')"]`)
  if (activeNavItem) {
    activeNavItem.classList.add("active")
  }

  const titles = {
    accueil: "Accueil",
    explorer: "Explorer",
    chats: "Messages",
    notifications: "Notifications",
  }

  const pageTitle = document.getElementById("page-title")
  if (pageTitle && titles[tabName]) {
    pageTitle.textContent = titles[tabName]
  }

  currentTab = tabName

  if (tabName === "accueil") {
    initializeCharts()
  }
}


function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebar-overlay")

  if (sidebar.classList.contains("-translate-x-full")) {
    sidebar.classList.remove("-translate-x-full")
    overlay.classList.remove("hidden")
  } else {
    sidebar.classList.add("-translate-x-full")
    overlay.classList.add("hidden")
  }
}



function initializeCharts() {
  const gradesCtx = document.getElementById("grades");
  const subjectsCtx = document.getElementById("subjects");

  // 💥 Détruire les anciens graphiques s’ils existent
  if (gradesChart) {
    gradesChart.destroy();
  }
  if (subjectsChart) {
    subjectsChart.destroy();
  }

  // 📈 Créer à nouveau les graphiques
  if (gradesCtx) {
    gradesChart = new Chart(gradesCtx, {
      type: "line",
      data: {
        labels: ["Sept", "Oct", "Nov", "Déc", "Jan", "Fév"],
        datasets: [
          {
            label: "Moyenne générale",
            data: [12.5, 13.2, 14.1, 15.3, 15.8, 16.2],
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 10,
            max: 20,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  if (subjectsCtx) {
    subjectsChart = new Chart(subjectsCtx, {
      type: "doughnut",
      data: {
        labels: ["Mathématiques", "Physique", "Chimie", "Français", "Histoire"],
        datasets: [
          {
            data: [15, 12, 8, 7, 6],
            backgroundColor: [
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(245, 101, 101)",
              "rgb(251, 191, 36)",
              "rgb(139, 92, 246)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
      },
    });
  }
}

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && currentTab === "chats") {
    const messageInput = document.querySelector('input[placeholder="Tapez votre message..."]')
    if (messageInput === document.activeElement) {
      sendMessage()
    }
  }
})


document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      toggleSidebar()
    }
  })
})
