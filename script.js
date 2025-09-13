let loaderProgress = 0;
let loader, progressFill, progressText;
let loaderStarted = false;

function updateProgress() {
  if (progressFill && progressText && loaderProgress < 100) {
    loaderProgress += 1;
    progressFill.style.width = loaderProgress + "%";
    progressText.textContent = Math.floor(loaderProgress) + "%";

    if (loaderProgress < 100) {
      setTimeout(updateProgress, 50);
    } else {
      setTimeout(hideLoader, 800);
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
    setTimeout(updateProgress, 500);
  }
}

document.body.classList.add("loading");

document.addEventListener("DOMContentLoaded", function () {
  loader = document.getElementById("loader");
  progressFill = document.getElementById("progressFill");
  progressText = document.getElementById("progressText");

  startLoader();
  const navigation = document.getElementById("navigation");
  const navItems = document.querySelectorAll(".nav-item");
  const hamburger = document.getElementById("hamburger");
  const navItemsContainer = document.getElementById("navItems");

  window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });

      navItems.forEach((nav) => nav.classList.remove("active"));
      const activeNav = document.querySelector(
        `[onclick*="scrollToSection('${sectionId}')"]`
      );
      if (activeNav) {
        activeNav.classList.add("active");
      }
    }
  };

  window.scrollToHero = function () {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });

      navItems.forEach((nav) => nav.classList.remove("active"));
    }
  };

  window.toggleMenu = function () {
    hamburger.classList.toggle("active");
    navItemsContainer.classList.toggle("mobile-menu");
    navItemsContainer.classList.toggle("active");
  };

  window.closeMenu = function () {
    hamburger.classList.remove("active");
    navItemsContainer.classList.remove("mobile-menu", "active");
  };

  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
      navigation.classList.add("scrolled");
    } else {
      navigation.classList.remove("scrolled");
    }

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

  const animateElements = document.querySelectorAll(
    ".scroll-animate, .scroll-animate-left, .scroll-animate-right"
  );

  animateElements.forEach((el) => {
    observer.observe(el);
  });

  document.addEventListener("click", function (event) {
    if (
      !navigation.contains(event.target) &&
      navItemsContainer.classList.contains("active")
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (
      window.innerWidth > 768 &&
      navItemsContainer.classList.contains("active")
    ) {
      closeMenu();
    }
  });

  const companyTabs = document.querySelectorAll(".company-tab");
  const jobDetails = document.querySelectorAll(".job-details");

  function switchExperienceTab(targetCompany) {
    companyTabs.forEach((tab) => tab.classList.remove("active"));
    jobDetails.forEach((detail) => detail.classList.remove("active"));

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

  companyTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const company = this.getAttribute("data-company");
      switchExperienceTab(company);
    });
  });
});
