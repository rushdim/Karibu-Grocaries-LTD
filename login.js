// function showToast(message, type) {
//     const container = document.getElementById('toastContainer');
//     const toast = document.createElement('div');
//     toast.className = `custom-toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
//     toast.innerHTML = `<span>${message}</span>`;
//     container.appendChild(toast);

//     setTimeout(() => {
//         toast.classList.add('fade-out');
//         setTimeout(() => toast.remove(), 500);
//     }, 3000);
// }

// document.getElementById('loginForm').onsubmit = (e) => {
//     e.preventDefault();

//     const username = document.getElementById('adminUser').value.trim();
//     const password = document.getElementById('adminPass').value.trim();

//     // 1. Check for empty fields
//     if (!username || !password) {
//         showToast("Please enter username and password.", "error");
//         return;
//     }

//     // 2. Validate against your specific credentials
//     const togglePassword = document.querySelector('#togglePassword');
// const password = document.querySelector('#adminPass');
// const eyeIcon = document.querySelector('#eyeIcon');

// togglePassword.addEventListener('click', function () {
//     // Toggle the type attribute
//     const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
//     password.setAttribute('type', type);
    
//     // Toggle the icon
//     eyeIcon.classList.toggle('fa-eye');
//     eyeIcon.classList.toggle('fa-eye-slash');
// });

//     if (username === "kgl_admin" && password === "groceries2026") {
        
//         // Success logic
//         showToast(`Welcome, Admin! Redirecting...`, "success");
        
//         // Create a dummy user object for the session
//         const user = { name: "Admin", role: "kgl_staff" };
//         localStorage.setItem('currentSession', JSON.stringify(user));

//         setTimeout(() => {
//             window.location.href = "Dashboard/dashboard.html";
//         }, 1200);

//     } else {
//         // Error logic
//         showToast("Invalid username or password.", "error");
//     }
// };


//  const { createApp } = Vue;
//   createApp({
//     data() {
//       return {
//         formData: { email: '', password: '' },
//         message: '',
//         isError: false
//       }
//     },
//     methods: {
//       async submitLogin() {
//         try {
//           const response = await fetch('/api/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(this.formData)
//           });
//           const data = await response.json();
//           if (data.token) {
//             // Save the JWT (JWS) securely in local storage
//             localStorage.setItem('userToken', data.token);
//             this.message = "Login successful!";
//             this.isError = false;
//             window.location.href = 'Dashboard/index.html'; // Redirect to Dashboard [1]
//           } else {
//             throw new Error(data.error);
//           }
//         } catch (err) {
//           this.message = "Login failed: " + err.message;
//           this.isError = true;
//         }
//       }
//     }
//   }).mount('#app')
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* --- TOGGLE PASSWORD LOGIC (Placed outside the submit function) --- */
const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#adminPass'); // renamed to avoid conflict
const eyeIcon = document.querySelector('#eyeIcon');

if (togglePassword) {
    togglePassword.addEventListener('click', function () {
        // Toggle the type attribute
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        // Toggle the icon
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });
}

/* --- FORM SUBMISSION LOGIC --- */
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPass').value.trim();

    // 1. Check for empty fields
    if (!username || !password) {
        showToast("Please enter username and password.", "error");
        return;
    }

    // 2. Validate against your specific credentials
    if (username === "kgl_admin" && password === "groceries2026") {
        
        // Success logic
        showToast(`Welcome, Admin! Redirecting...`, "success");
        
        // Create a dummy user object for the session
        const user = { name: "Admin", role: "kgl_staff" };
        localStorage.setItem('currentSession', JSON.stringify(user));

        setTimeout(() => {
            window.location.href = "Dashboard/dashboard.html";
        }, 1200);

    } else {
        // Error logic
        showToast("Invalid username or password.", "error");
    }
};

// --- Vue Logic (Optional/Separate) ---
const { createApp } = Vue;
createApp({
    data() {
        return {
            formData: { email: '', password: '' },
            message: '',
            isError: false
        }
    },
    methods: {
        async submitLogin() {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.formData)
                });
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('userToken', data.token);
                    this.message = "Login successful!";
                    this.isError = false;
                    window.location.href = 'Dashboard/index.html'; 
                } else {
                    throw new Error(data.error);
                }
            } catch (err) {
                this.message = "Login failed: " + err.message;
                this.isError = true;
            }
        }
    }
}).mount('#app');
