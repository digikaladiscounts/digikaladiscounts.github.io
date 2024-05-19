document.addEventListener('DOMContentLoaded', async () => {
    let allProducts = [];

    const loading = document.getElementById('loading');
    const searchContainer = document.querySelector('.search-container');
    const productContainer = document.getElementById('productContainer');
    const showAllButton = document.getElementById('showAll');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const clearSearch = document.getElementById('clearSearch');

    // Function to fetch JSON data with cache busting
    async function fetchData() {
        try {
            const cacheBuster = Date.now();
            const url = `https://api.digikaladiscounts.com/items-history.json?cache=${cacheBuster}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching the JSON:', error);
            throw error;
        }
    }

    // Function to display products
    function displayProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${product.ImageUrl}" alt="${product.Title}">
                <h2>${product.Title}</h2>
                <p class="price">${product.SellingPrice.toLocaleString()} تومان</p>
                <p class="old-price">${product.RrpPrice.toLocaleString()} تومان</p>
                <p>تخفیف: ${product.Discount.toLocaleString()} تومان (${product.DiscountPercent}%)</p>
                <a href="https://digikala.com${product.Url}" target="_blank">مشاهده محصول</a>
            `;
            productContainer.appendChild(card);
        });
    }

    // Function to setup search
    function setupSearch(products) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            searchResults.innerHTML = '';

            if (query.length > 0) {
                const filteredProducts = products.filter(product =>
                    product.Title.toLowerCase().includes(query)
                );

                if (filteredProducts.length > 0) {
                    filteredProducts.forEach(product => {
                        const resultItem = document.createElement('div');
                        resultItem.innerHTML = `
                            <img src="${product.ImageUrl}" alt="${product.Title}" width="50">
                            <span>${product.Title}</span>
                        `;
                        resultItem.addEventListener('click', () => {
                            displayProducts([product]);
                            searchResults.innerHTML = '';
                            searchResults.style.display = 'none';
                            searchInput.value = product.Title;
                            clearSearch.style.display = 'block';
                            showAllButton.style.display = 'block';
                        });
                        searchResults.appendChild(resultItem);
                    });
                    searchResults.style.display = 'block';
                } else {
                    searchResults.style.display = 'none';
                }
            } else {
                searchResults.style.display = 'none';
            }
        });

        clearSearch.addEventListener('click', () => {
            displayProducts(allProducts);
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            searchInput.value = '';
            clearSearch.style.display = 'none';
            showAllButton.style.display = 'none';
        });

        showAllButton.addEventListener('click', () => {
            displayProducts(allProducts);
            searchInput.value = '';
            searchResults.style.display = 'none';
            clearSearch.style.display = 'none';
            showAllButton.style.display = 'none';
        });
    }

    // Fetch data and setup UI
    try {
        const data = await fetchData();
        allProducts = data;
        displayProducts(data);
        setupSearch(data);
        loading.style.display = 'none';
        searchContainer.style.display = 'flex';
        productContainer.style.display = 'flex';
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
});
