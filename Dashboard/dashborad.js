 // mongodb+srv://rushdim:<db_password>@kglproject.ycxdniv.mongodb.net/?appName=KGLproject


                            const dashboardData = {
                                    sales: 0,
                                    customers: 0,
                                    products: 2,
                                    lowStock: 0
                                };

                                // Function to update the UI
                                function updateDashboard() {
                                    document.getElementById('todaySales').innerText = dashboardData.sales;
                                    document.getElementById('totalCustomers').innerText = dashboardData.customers;
                                    document.getElementById('totalProducts').innerText = dashboardData.products;
                                    document.getElementById('lowStock').innerText = dashboardData.lowStock;
                                }

                                // Run on load
                                window.onload = updateDashboard;
                            