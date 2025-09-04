// Navigation and scroll functionality
document.addEventListener("DOMContentLoaded", function () {
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
    const sections = ["hero", "about", "experience", "work", "contact"];
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

  // Hover card functionality
  const nameElement = document.getElementById("nameElement");
  const hoverCard = document.getElementById("hoverCard");

  if (nameElement && hoverCard) {
    nameElement.addEventListener("mouseenter", () => {
      hoverCard.classList.add("visible");
    });

    nameElement.addEventListener("mouseleave", () => {
      hoverCard.classList.remove("visible");
    });
  }

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
});
