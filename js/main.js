// Fichier JavaScript principal - main.js

// Charger les catégories
function loadCategories() {
    const categories = dataManager.getCategories();
    const grid = document.getElementById('categoriesGrid');
    
    if (!categories || categories.length === 0) {
        grid.innerHTML = '<div class="empty-message"><h3>Aucune catégorie disponible</h3></div>';
        return;
    }
    
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.name}')">
            <img src="${cat.image}" alt="${cat.name}" class="category-image" 
                 onerror="this.style.display='none'" 
                 loading="lazy">
            <div class="category-overlay">
                <div class="category-name">${cat.name}</div>
                <div class="category-count">${cat.count} produits</div>
            </div>
        </div>
    `).join('');
}

// Charger les produits
function loadProducts(filterCategory = 'all') {
    let products = dataManager.getProducts();
    
    if (filterCategory !== 'all') {
        products = products.filter(p => p.category === filterCategory);
    }

    const grid = document.getElementById('productsGrid');
    
    if (!products || products.length === 0) {
        grid.innerHTML = `
            <div class="empty-message">
                <h3>Aucun produit disponible</h3>
                <p>Les produits apparaîtront ici une fois ajoutés depuis le panneau admin.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image" 
                     onerror="this.parentElement.style.background='var(--gris)'"
                     loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price} FCFA</div>
            </div>
        </div>
    `).join('');
}

// Créer les filtres
function createFilters() {
    const categories = dataManager.getCategories();
    const filtersContainer = document.getElementById('filters');
    
    if (!categories || categories.length === 0) {
        filtersContainer.innerHTML = '<button class="filter-btn active" data-category="all">Tous</button>';
        return;
    }
    
    const categoryButtons = categories.map(cat => 
        `<button class="filter-btn" data-category="${cat.name}">${cat.name}</button>`
    ).join('');
    
    filtersContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">Tous</button>
        ${categoryButtons}
    `;

    // Ajouter les événements aux boutons de filtre
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            // Charger les produits filtrés
            loadProducts(this.dataset.category);
        });
    });
}

// Fonction pour filtrer par catégorie (appelée depuis les cartes de catégorie)
function filterByCategory(category) {
    // Scroll vers la section produits
    document.querySelector('#produits').scrollIntoView({ behavior: 'smooth' });
    
    // Petit délai pour l'effet de scroll
    setTimeout(() => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        loadProducts(category);
    }, 500);
}

// Animation au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.section-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // Si l'élément est dans la fenêtre visible
        if (elementTop < window.innerHeight * 0.8 && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
}

// Effet parallaxe sur le hero
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const heroBg = document.getElementById('heroBg');
    
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

// Gestion du header au scroll
function handleHeaderScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Event listener pour le scroll
window.addEventListener('scroll', function() {
    handleHeaderScroll();
    animateOnScroll();
    parallaxEffect();
});

// Smooth scroll pour les liens d'ancrage
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Écouter les changements de localStorage (synchronisation entre onglets)
window.addEventListener('storage', function(e) {
    if (e.key === 'korinaza_products' || e.key === 'korinaza_categories') {
        console.log('Données mises à jour, rechargement...');
        loadCategories();
        createFilters();
        loadProducts();
    }
});

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du site...');
    
    // Charger les données
    loadCategories();
    createFilters();
    loadProducts();
    
    // Cacher l'animation de chargement
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hide');
        }
    }, 1000);
    
    // Déclencher l'animation initiale
    setTimeout(() => {
        animateOnScroll();
    }, 100);
});

// Gérer l'erreur si dataManager n'est pas défini
if (typeof dataManager === 'undefined') {
    console.error('DataManager non chargé! Assurez-vous que data.js est bien inclus avant main.js');
}
