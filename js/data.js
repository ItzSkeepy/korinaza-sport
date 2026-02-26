// Fichier de gestion des données - data.js

// Données par défaut
const DEFAULT_CATEGORIES = [
    {
        id: 'cat1',
        name: 'Football',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
        count: 0
    },
    {
        id: 'cat2',
        name: 'Basketball',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
        count: 0
    },
    {
        id: 'cat3',
        name: 'Running',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
        count: 0
    },
    {
        id: 'cat4',
        name: 'Fitness',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        count: 0
    },
    {
        id: 'cat5',
        name: 'Natation',
        image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80',
        count: 0
    },
    {
        id: 'cat6',
        name: 'Vêtements',
        image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        count: 0
    }
];

const DEFAULT_PRODUCTS = [
    {
        id: 'prod1',
        name: 'Ballon de Football Pro',
        category: 'Football',
        price: '25,000',
        image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aac?w=800&q=80'
    },
    {
        id: 'prod2',
        name: 'Chaussures de Running',
        category: 'Running',
        price: '45,000',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    },
    {
        id: 'prod3',
        name: 'Maillot de Basketball',
        category: 'Basketball',
        price: '18,000',
        image: 'https://images.unsplash.com/photo-1615487829542-1c6e3e5b9e8d?w=800&q=80'
    },
    {
        id: 'prod4',
        name: 'Tapis de Yoga',
        category: 'Fitness',
        price: '12,000',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
    },
    {
        id: 'prod5',
        name: 'Lunettes de Natation',
        category: 'Natation',
        price: '8,000',
        image: 'https://contents.mediadecathlon.com/p1815221/k$19e93146c4136521e375980b52062e60/picture.jpg?format=auto&f=640x0'
    },
    {
        id: 'prod6',
        name: 'Short de Sport',
        category: 'Vêtements',
        price: '15,000',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80'
    },
    {
        id: 'prod7',
        name: 'Gants de Gardien',
        category: 'Football',
        price: '22,000',
        image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80'
    },
    {
        id: 'prod8',
        name: 'Ballon de Basketball',
        category: 'Basketball',
        price: '20,000',
        image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80'
    }
];

// Classe pour gérer le stockage des données
class DataManager {
    constructor() {
        this.CATEGORIES_KEY = 'korinaza_categories';
        this.PRODUCTS_KEY = 'korinaza_products';
        this.initializeData();
    }

    // Initialiser les données si elles n'existent pas
    initializeData() {
        if (!localStorage.getItem(this.CATEGORIES_KEY)) {
            this.saveCategories(DEFAULT_CATEGORIES);
        }
        if (!localStorage.getItem(this.PRODUCTS_KEY)) {
            this.saveProducts(DEFAULT_PRODUCTS);
        }
        this.updateCategoryCounts();
    }

    // Récupérer les catégories
    getCategories() {
        const data = localStorage.getItem(this.CATEGORIES_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Sauvegarder les catégories
    saveCategories(categories) {
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    }

    // Ajouter une catégorie
    addCategory(category) {
        const categories = this.getCategories();
        category.id = 'cat' + Date.now();
        category.count = 0;
        categories.push(category);
        this.saveCategories(categories);
        return category;
    }

    // Supprimer une catégorie
    deleteCategory(id) {
        let categories = this.getCategories();
        categories = categories.filter(c => c.id !== id);
        this.saveCategories(categories);
    }

    // Récupérer les produits
    getProducts() {
        const data = localStorage.getItem(this.PRODUCTS_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Sauvegarder les produits
    saveProducts(products) {
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        this.updateCategoryCounts();
    }

    // Ajouter un produit
    addProduct(product) {
        const products = this.getProducts();
        product.id = 'prod' + Date.now();
        products.push(product);
        this.saveProducts(products);
        return product;
    }

    // Supprimer un produit
    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== id);
        this.saveProducts(products);
    }

    // Mettre à jour le nombre de produits par catégorie
    updateCategoryCounts() {
        const categories = this.getCategories();
        const products = this.getProducts();
        
        categories.forEach(cat => {
            cat.count = products.filter(p => p.category === cat.name).length;
        });
        
        this.saveCategories(categories);
    }

    // Obtenir les produits par catégorie
    getProductsByCategory(categoryName) {
        const products = this.getProducts();
        return products.filter(p => p.category === categoryName);
    }

    // Obtenir les statistiques
    getStats() {
        return {
            totalProducts: this.getProducts().length,
            totalCategories: this.getCategories().length
        };
    }
}

// Créer une instance globale
const dataManager = new DataManager();
