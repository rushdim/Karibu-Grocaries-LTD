const translations = {
    en: {
        home: "Home",
        products: "Products",
        cart: "Cart",
        account: "My Account",
        login: "Login",
        register: "Register",
        checkout: "Checkout",
        logout: "Logout",
        basket: "My Basket",
        orders: "My Orders"
    },

    ar: {
        home: "الرئيسية",
        products: "المنتجات",
        cart: "السلة",
        account: "حسابي",
        login: "تسجيل الدخول",
        register: "إنشاء حساب",
        checkout: "إتمام الطلب",
        logout: "تسجيل الخروج",
        basket: "سلتي",
        orders: "طلباتي"
    }
};

function changeLanguage(lang) {
    localStorage.setItem("language", lang);

    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.dataset.lang;

        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
}

// AUTO RUN ON EVERY PAGE
document.addEventListener("DOMContentLoaded", () => {

    const savedLang = localStorage.getItem("language") || "en";

    changeLanguage(savedLang);

    const switcher = document.getElementById("languageSwitcher");

    if (switcher) {
        switcher.value = savedLang;

        switcher.addEventListener("change", (e) => {
            changeLanguage(e.target.value);
        });
    }
});