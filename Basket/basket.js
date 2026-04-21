document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const authPrompt = document.getElementById("auth-prompt");
    const checkoutSection = document.getElementById("checkout-section");

    // 1. Check Login Status
    if (user) {
        authPrompt.style.display = "none";
        checkoutSection.style.display = "block";
    }

    // 2. Handle Payment Method Selection
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const ugandaDetails = document.getElementById("uganda-details");
    const sudanDetails = document.getElementById("sudan-details");

    paymentRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "uganda") {
                // Show MTN Uganda Details
                ugandaDetails.innerHTML = `
                    <div class="alert alert-info mt-2">
                        <strong>Send Money to:</strong><br>
                        MTN Number: 0789817673<br>
                        Name: RUSHDI MUSTAFA YOUSIF ADAM
                    </div>
                    <input type="text" id="ug-txid" placeholder="Enter Transaction ID / Your Number" class="form-control">
                `;
                ugandaDetails.style.display = "block";
                sudanDetails.style.display = "none";
            } else {
                // Show Bankak Sudan Details
                sudanDetails.innerHTML = `
                    <div class="alert alert-info mt-2">
                        <strong>Send Money to:</strong><br>
                        Bankak Account: 5142569<br>
                        Name: RUSHDI MUSTAFA YOUSIF ADAM
                    </div>
                    <input type="text" id="sd-txid" placeholder="Enter Reference Number / Screenshot Name" class="form-control">
                `;
                ugandaDetails.style.display = "none";
                sudanDetails.style.display = "block";
            }
        });
    });

    // 3. Handle Payment Button Click
    document.getElementById("pay-btn").addEventListener("click", () => {
        const selectedMethod = document.querySelector('input[name="payment"]:checked');
        
        if (!selectedMethod) {
            alert("Please select a payment method first.");
            return;
        }

        alert("Payment details submitted! We will verify the transaction and contact you shortly.");
        // Here you would typically send this info to your backend
    });
});
