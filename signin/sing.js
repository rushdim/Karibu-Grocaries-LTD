document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const identifier = document.getElementById('identifier').value;
    
    if (identifier.trim() === "") {
        alert("Please enter your email or mobile phone number");
    } else {
        console.log("Proceeding with:", identifier);
        // Here you would typically redirect to the password page or send to an API
    }
});
