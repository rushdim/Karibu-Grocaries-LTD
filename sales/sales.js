

           // mongodb+srv://rushdim:<db_password>@kglproject.ycxdniv.mongodb.net/?appName=KGLproject
// 
        document.getElementById('saleForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form data
    const buyerName = document.getElementById('buyerName').value;
    const amountPaid = document.getElementById('amountPaid').value;
    const isCreditSale = document.getElementById('creditSale').checked;

    // Store data in localStorage (or send to a server using fetch API)
    localStorage.setItem('saleDetails', JSON.stringify({
        name: buyerName,
        amount: amountPaid,
        credit: isCreditSale
    }));

    // Redirect to another page
    window.location.href = 'confirmation.html';
});