// Global variables
let medicationsData = [];

// Fetch medications data
async function fetchMedications() {
    try {
        const response = await fetch('/data/medications.json');
        medicationsData = await response.json();
    } catch (error) {
        console.error('Error fetching medications:', error);
        showError('Failed to load medications data');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchMedications();
    
    // Add event listener for enter key in search
    const searchInput = document.getElementById('quickSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performQuickSearch();
            }
        });
    }
});

// Perform quick search
function performQuickSearch() {
    const searchInput = document.getElementById('quickSearch');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const resultsDiv = document.getElementById('searchResults');
    
    if (!searchTerm) {
        resultsDiv.innerHTML = '<p class="text-gray-600">Please enter a medication name to search.</p>';
        return;
    }

    const results = medicationsData.filter(med => 
        med.name.toLowerCase().includes(searchTerm) ||
        med.generic.toLowerCase().includes(searchTerm) ||
        med.brand.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="text-gray-600">No medications found matching your search.</p>';
        return;
    }

    let html = '<div class="space-y-4">';
    results.forEach(med => {
        html += `
            <div class="border p-4 rounded-lg">
                <h4 class="font-semibold">${med.name}</h4>
                <p class="text-sm text-gray-600">Generic: ${med.generic}</p>
                <p class="text-sm text-gray-600">Brand: ${med.brand}</p>
                ${med.interchangeable_with.length > 0 ? `
                    <div class="mt-2">
                        <p class="text-sm font-medium">Interchangeable with:</p>
                        <ul class="list-disc list-inside text-sm text-gray-600">
                            ${med.interchangeable_with.map(drug => `<li>${drug}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    });
    html += '</div>';
    
    resultsDiv.innerHTML = html;
}

// Error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4';
    errorDiv.textContent = message;
    
    const container = document.querySelector('main');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Admin authentication check
function checkAdminAuth() {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
}

// Protect admin routes
function protectAdminRoute() {
    if (!checkAdminAuth()) {
        window.location.href = '/pages/admin-login.html';
    }
}