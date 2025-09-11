// Loader functionality
let loaderProgress = 0;
let loader, progressFill, progressText;
let loaderStarted = false; // Prevent double loading

function updateProgress() {
  if (progressFill && progressText && loaderProgress < 100) {
    loaderProgress += 1;
    progressFill.style.width = loaderProgress + "%";
    progressText.textContent = Math.floor(loaderProgress) + "%";

    if (loaderProgress < 100) {
      setTimeout(updateProgress, 50); // 50ms intervals = 5 seconds total
    } else {
      setTimeout(hideLoader, 800); // Brief pause at 100%
    }
  }
}

function hideLoader() {
  if (loader && !loader.classList.contains("fade-out")) {
    loader.classList.add("fade-out");

    setTimeout(() => {
      document.body.classList.remove("loading");
    }, 400);

    setTimeout(() => {
      if (loader) {
        loader.style.display = "none";
      }
    }, 800);
  }
}

function startLoader() {
  if (!loaderStarted && progressFill && progressText) {
    loaderStarted = true;
    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    setTimeout(updateProgress, 500); // Brief delay then start
  }
}

// Initialize loader
document.body.classList.add("loading");

// Navigation and scroll functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize loader elements
  loader = document.getElementById("loader");
  progressFill = document.getElementById("progressFill");
  progressText = document.getElementById("progressText");

  // Start loader
  startLoader();
  const navigation = document.getElementById("navigation");
  const navItems = document.querySelectorAll(".nav-item");
  const hamburger = document.getElementById("hamburger");
  const navItemsContainer = document.getElementById("navItems");

  // Function to scroll to specific section
  window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });

      // Update active navigation
      navItems.forEach((nav) => nav.classList.remove("active"));
      const activeNav = document.querySelector(
        `[onclick*="scrollToSection('${sectionId}')"]`
      );
      if (activeNav) {
        activeNav.classList.add("active");
      }
    }
  };

  // Function to scroll to hero section
  window.scrollToHero = function () {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });

      // Remove active state from all nav items when returning to hero
      navItems.forEach((nav) => nav.classList.remove("active"));
    }
  };

  // Toggle mobile menu
  window.toggleMenu = function () {
    hamburger.classList.toggle("active");
    navItemsContainer.classList.toggle("mobile-menu");
    navItemsContainer.classList.toggle("active");
  };

  // Close mobile menu
  window.closeMenu = function () {
    hamburger.classList.remove("active");
    navItemsContainer.classList.remove("mobile-menu", "active");
  };

  // Scroll spy to update active navigation and background
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;

    // Update navigation background based on scroll position
    if (scrollPosition > 100) {
      navigation.classList.add("scrolled");
    } else {
      navigation.classList.remove("scrolled");
    }

    // Update active navigation items
    const sections = ["hero", "about", "experience", "projects", "contact"];
    const currentScrollPosition = scrollPosition + 150;

    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          currentScrollPosition >= sectionTop &&
          currentScrollPosition < sectionTop + sectionHeight
        ) {
          navItems.forEach((nav) => nav.classList.remove("active"));
          if (sectionId !== "hero") {
            const activeNav = document.querySelector(
              `[onclick*="scrollToSection('${sectionId}')"]`
            );
            if (activeNav) {
              activeNav.classList.add("active");
            }
          }
        }
      }
    });
  });

  // Bio card is now permanently visible
  // Removed hover functionality as the card displays automatically

  // Smooth scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all elements with scroll animation classes
  const animateElements = document.querySelectorAll(
    ".scroll-animate, .scroll-animate-left, .scroll-animate-right"
  );

  animateElements.forEach((el) => {
    observer.observe(el);
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !navigation.contains(event.target) &&
      navItemsContainer.classList.contains("active")
    ) {
      closeMenu();
    }
  });

  // Close mobile menu on window resize if screen gets larger
  window.addEventListener("resize", function () {
    if (
      window.innerWidth > 768 &&
      navItemsContainer.classList.contains("active")
    ) {
      closeMenu();
    }
  });

  // Experience section tab functionality
  const companyTabs = document.querySelectorAll(".company-tab");
  const jobDetails = document.querySelectorAll(".job-details");

  // Function to switch experience tab
  function switchExperienceTab(targetCompany) {
    // Remove active class from all tabs and job details
    companyTabs.forEach((tab) => tab.classList.remove("active"));
    jobDetails.forEach((detail) => detail.classList.remove("active"));

    // Add active class to selected tab and corresponding job detail
    const selectedTab = document.querySelector(
      `[data-company="${targetCompany}"]`
    );
    const selectedDetail = document.querySelector(
      `.job-details[data-company="${targetCompany}"]`
    );

    if (selectedTab && selectedDetail) {
      selectedTab.classList.add("active");
      selectedDetail.classList.add("active");
    }
  }

  // Add click event listeners to company tabs
  companyTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const company = this.getAttribute("data-company");
      switchExperienceTab(company);
    });
  });
});
