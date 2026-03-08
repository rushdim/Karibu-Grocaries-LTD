

const { createApp } = Vue;

createApp({
    data() {
        return {
            customer: { name: '', phone: '' },
            message: '',
            messageColor: 'red'
        }
    },
    methods: {
        async registerCustomer() {
            // 1. Frontend Validation (Filling is required)
            if (!this.customer.name.trim() || !this.customer.phone.trim()) {
                this.message = "Filling is required";
                this.messageColor = "red";
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.customer)
                });

                const result = await response.json();

                if (response.ok) {
                    this.message = result.message;
                    this.messageColor = "green";
                    this.customer = { name: '', phone: '' }; // Clear inputs
                } else {
                    // This catches "User is already there" or "Filling is required"
                    this.message = result.message;
                    this.messageColor = "red";
                }
            } catch (error) {
                this.message = "Error: Cannot connect to server.";
                this.messageColor = "red";
            }
        }
    }
}).mount('#app');