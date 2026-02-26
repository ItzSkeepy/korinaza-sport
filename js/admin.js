// Fichier JavaScript pour l'admin - admin.js

// Charger les statistiques
function loadStats() {
    const stats = dataManager.getStats();
    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('totalCategories').textContent = stats.totalCategories;
}

// Charger les produits récents pour le dashboard
function loadRecentProducts() {
    const products = dataManager.getProducts();
    const recentProducts = products.slice(-5).reverse(); // Les 5 derniers
    const tbody = document.getElementById('recentProducts');
    
    if (recentProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Aucun produit</td></tr>';
        return;
    }
    
    tbody.innerHTML = recentProducts.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail" onerror="this.style.display='none'"></td>
            <td>${product.name}</td>
            <td><span class="category-badge">${product.category}</span></td>
            <td>${product.price} FCFA</td>
        </tr>
    `).join('');
}

// Charger tous les produits
function loadAllProducts() {
    const products = dataManager.getProducts();
    const tbody = document.getElementById('productsTable');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Aucun produit. Cliquez sur "Nouveau produit" pour en ajouter.</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail" onerror="this.style.display='none'"></td>
            <td>${product.name}</td>
            <td><span class="category-badge">${product.category}</span></td>
            <td>${product.price} FCFA</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-danger btn-small" onclick="deleteProduct('${product.id}')">
                        🗑️ Supprimer
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Charger toutes les catégories
function loadAllCategories() {
    const categories = dataManager.getCategories();
    const tbody = document.getElementById('categoriesTable');
    
    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Aucune catégorie. Cliquez sur "Nouvelle catégorie" pour en ajouter.</td></tr>';
        return;
    }
    
    tbody.innerHTML = categories.map(category => `
        <tr>
            <td><img src="${category.image}" alt="${category.name}" class="product-thumbnail" onerror="this.style.display='none'"></td>
            <td>${category.name}</td>
            <td>${category.count} produits</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-danger btn-small" onclick="deleteCategory('${category.id}')">
                        🗑️ Supprimer
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Charger les catégories pour le select du formulaire produit
function loadCategoryOptions() {
    const categories = dataManager.getCategories();
    const select = document.getElementById('productCategory');
    
    if (categories.length === 0) {
        select.innerHTML = '<option value="">Aucune catégorie disponible - Créez-en une d\'abord</option>';
        return;
    }
    
    select.innerHTML = '<option value="">Sélectionner une catégorie</option>' + 
        categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
}

// Ouvrir le modal produit
function openProductModal() {
    loadCategoryOptions();
    document.getElementById('productModal').classList.add('active');
}

// Fermer le modal produit
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
}

// Ouvrir le modal catégorie
function openCategoryModal() {
    document.getElementById('categoryModal').classList.add('active');
}

// Fermer le modal catégorie
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    document.getElementById('categoryForm').reset();
}

// Ajouter un produit
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const newProduct = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: document.getElementById('productPrice').value,
            image: document.getElementById('productImage').value
        };
        
        if (!newProduct.category) {
            showAlert('productAlert', 'Veuillez sélectionner une catégorie', 'error');
            return;
        }
        
        dataManager.addProduct(newProduct);
        
        showAlert('productAlert', 'Produit ajouté avec succès! ✓', 'success');
        closeProductModal();
        loadAllProducts();
        loadRecentProducts();
        loadStats();
    } catch (error) {
        showAlert('productAlert', 'Erreur lors de l\'ajout du produit', 'error');
        console.error('Erreur:', error);
    }
});

// Ajouter une catégorie
document.getElementById('categoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const newCategory = {
            name: document.getElementById('categoryName').value,
            image: document.getElementById('categoryImage').value
        };
        
        dataManager.addCategory(newCategory);
        
        showAlert('categoryAlert', 'Catégorie ajoutée avec succès! ✓', 'success');
        closeCategoryModal();
        loadAllCategories();
        loadStats();
    } catch (error) {
        showAlert('categoryAlert', 'Erreur lors de l\'ajout de la catégorie', 'error');
        console.error('Erreur:', error);
    }
});

// Supprimer un produit
function deleteProduct(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
        dataManager.deleteProduct(id);
        showAlert('productAlert', 'Produit supprimé avec succès! ✓', 'success');
        loadAllProducts();
        loadRecentProducts();
        loadStats();
    } catch (error) {
        showAlert('productAlert', 'Erreur lors de la suppression', 'error');
        console.error('Erreur:', error);
    }
}

// Supprimer une catégorie
function deleteCategory(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Les produits associés ne seront pas supprimés.')) return;
    
    try {
        dataManager.deleteCategory(id);
        showAlert('categoryAlert', 'Catégorie supprimée avec succès! ✓', 'success');
        loadAllCategories();
        loadStats();
    } catch (error) {
        showAlert('categoryAlert', 'Erreur lors de la suppression', 'error');
        console.error('Erreur:', error);
    }
}

// Afficher une alerte
function showAlert(containerId, message, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    
    // Faire disparaître l'alerte après 3 secondes
    setTimeout(() => {
        container.innerHTML = '';
    }, 3000);
}

// Navigation entre les sections
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Ne pas empêcher le comportement par défaut si c'est un vrai lien
        if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
            return;
        }
        
        e.preventDefault();
        
        const section = this.dataset.section;
        if (!section) return;
        
        // Mettre à jour le lien actif
        document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Afficher la section correspondante
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Mettre à jour le titre de la page
        const titles = {
            'dashboard': 'Tableau de bord',
            'products': 'Gestion des Produits',
            'categories': 'Gestion des Catégories'
        };
        document.getElementById('pageTitle').textContent = titles[section] || section;
    });
});

// Fermer les modals en cliquant en dehors
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de l\'admin...');
    
    loadStats();
    loadRecentProducts();
    loadAllProducts();
    loadAllCategories();
});

// Gérer l'erreur si dataManager n'est pas défini
if (typeof dataManager === 'undefined') {
    console.error('DataManager non chargé! Assurez-vous que data.js est bien inclus avant admin.js');
}
