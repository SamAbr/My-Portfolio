/* Certificates Dashboard Interactive Logic */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('cert-search');
    const filterButtons = document.querySelectorAll('.filter-buttons .filter-btn');
    const certCards = document.querySelectorAll('#gallery-grid .cert-card');
    const noResultsMsg = document.getElementById('no-results-msg');

    let currentFilter = 'all';
    let searchQuery = '';

    // Filter categories & Search handler
    function filterCertifications() {
        let visibleCount = 0;

        certCards.forEach(card => {
            const categories = card.getAttribute('data-category') || '';
            const title = card.querySelector('h4').textContent.toLowerCase();
            const issuer = card.querySelector('.cert-issuer').textContent.toLowerCase();
            
            const matchesCategory = (currentFilter === 'all' || categories.split(' ').includes(currentFilter));
            const matchesSearch = (title.includes(searchQuery) || issuer.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                // Trigger transition styles
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                card.style.display = 'none';
            }
        });

        // Show "no results" message if no items match
        if (visibleCount === 0) {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    }

    // Category click handler
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            filterCertifications();
        });
    });

    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterCertifications();
        });
    }
});
