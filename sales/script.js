document.getElementById('procurementForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get input values
    const produceName = document.getElementById('produceName').value;
    const tonnage = document.getElementById('tonnage').value;
    const cost = document.getElementById('cost').value;
    const dealerName = document.getElementById('dealerName').value;

    // Display the results
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.style.display = 'block'; // Make results container visible

    const resultHTML = `
        <div class="result-item"><strong>Produce Name:</strong> ${produceName}</div>
        <div class="result-item"><strong>Tonnage:</strong> ${tonnage} kg</div>
        <div class="result-item"><strong>Cost:</strong> UgX ${cost}</div>
        <div class="result-item"><strong>Dealer Name:</strong> ${dealerName}</div>
    `;

    resultsContainer.innerHTML = '<h2>Procurement Recorded:</h2>' + resultHTML;

    // Optional: Reset the form after submission
    event.target.reset();
});