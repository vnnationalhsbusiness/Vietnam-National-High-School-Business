document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  btn.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  const itemsPerPage = 10;
  const newsList = document.querySelectorAll("#news-list li");
  const seeMoreBtn = document.getElementById("see-more");
  let currentPage = 0;

  if (newsList.length && seeMoreBtn) {
    function showPage(page) {
      newsList.forEach((item, index) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        item.style.display = index >= start && index < end ? "list-item" : "none";
      });
    }

    showPage(currentPage);

    seeMoreBtn.addEventListener("click", () => {
      currentPage++;
      const totalPages = Math.ceil(newsList.length / itemsPerPage);
      if (currentPage >= totalPages) currentPage = 0;
      showPage(currentPage);
    });
  }
});

(function() {
  const header = document.querySelector('header');
  const offset = (header?.offsetHeight || 0) + 12;
  const toc = document.querySelector('.toc');
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll('a'));
  const sections = links
    .map(a => document.getElementById((a.hash || '').slice(1)))
    .filter(Boolean);

  function setActive(id) {
    links.forEach(a => {
      const isActive = (a.hash || '').slice(1) === id;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  links.forEach(a => {
    a.addEventListener('click', e => {
      const id = (a.hash || '').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActive(id);
      history.replaceState(null, '', '#' + id);
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    root: null,
    rootMargin: `-${offset + 10}px 0px -55% 0px`,
    threshold: 0.1
  });
  sections.forEach(sec => io.observe(sec));

  if (location.hash) {
    const initId = location.hash.slice(1);
    if (document.getElementById(initId)) setActive(initId);
  }
})();
