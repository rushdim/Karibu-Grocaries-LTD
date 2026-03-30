const API_URL = "https://karibu-grocaries-ltd-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    // Check if email is in the URL (from the email link)
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
        localStorage.setItem('pendingEmail', emailParam);
        document.getElementById('verify-msg').innerText = `Verifying account for: ${emailParam}`;
    }
});

async function verifyAndSave() {
    const code = document.getElementById('verify-code').value;
    const email = localStorage.getItem('pendingEmail');

    if (!code) return alert("Please enter the verification code.");
    if (!email) return alert("No email found. Please register again.");

    try {
        const response = await fetch(`${API_URL}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code })
        });

        const data = await response.json();

        if (response.ok) {
            // Hide the input section and show the success section with Login button
            document.getElementById('verify-section').classList.add('hidden');
            document.getElementById('verify-msg').classList.add('hidden');
            document.getElementById('success-section').classList.remove('hidden');
            
            // Cleanup
            localStorage.removeItem('pendingEmail');
        } else {
            alert(data.message || "Invalid Code. Please try again.");
        }
    } catch (err) {
        console.error("Verification error:", err);
        alert("Connection error. Is the server running?");
    }
}
