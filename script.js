document.addEventListener("DOMContentLoaded", () => {
    // Initialize Firebase only if it's not already initialized
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        const firebaseConfig = {
            apiKey: "AIzaSyCZL642_1kx9Ah6oDEUs5pQDbkME5MObw4",
            authDomain: "techno-9b7eb.firebaseapp.com",
            databaseURL: "https://techno-9b7eb-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "techno-9b7eb",
            storageBucket: "techno-9b7eb.appspot.com",
            messagingSenderId: "374236940896",
            appId: "1:374236940896:web:e1e7ac070b11eee96c9105",
            measurementId: "G-03X8754ZGF"
        };
        
        firebase.initializeApp(firebaseConfig);
    }

    // Enhanced loader functionality with transition
    const removeLoader = () => {
        const loader = document.querySelector('.page-loader');
        const loaderLogo = document.querySelector('.loader-logo');
        const loaderBar = document.querySelector('.loader-bar');
        const letters = document.querySelectorAll('.letter');

        if (loader) {
            // Minimum loader duration of 2 seconds
            setTimeout(() => {
                // Start the animation by showing expanded text
                loaderLogo.classList.add('start-animation');
                
                // Animate each letter group sequentially
                letters.forEach((letter, index) => {
                    setTimeout(() => {
                        letter.classList.add('expand-text');
                    }, index * 500); // 500ms delay between each letter group
                });

                // Fade out loader bar
                setTimeout(() => {
                    loaderBar.classList.add('fade-out');
                }, 1500);

                // Final transition: Fade out loader
                setTimeout(() => {
                    document.body.classList.remove('loading');
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 800);
                }, 3000); // Increased delay to allow for text expansion
            }, 2000);
        }
    };

    // Remove loader when everything is loaded
    if (document.readyState === 'complete') {
        removeLoader();
    } else {
        window.addEventListener('load', removeLoader);
    }

    // Get a reference to the database service
    const db = firebase.firestore()
  
    const serviceItems = document.querySelectorAll(".service-item")
    const modal = document.getElementById("serviceModal")
    const closeBtn = document.querySelector(".close")
    const serviceForm = document.getElementById("serviceForm")
    const serviceTypeInput = document.getElementById("serviceType")
    const contactForm = document.getElementById("contactForm")
  
    // Animate header on scroll
    window.addEventListener("scroll", () => {
      const header = document.querySelector(".header")
      header.style.backgroundColor = window.scrollY > 50 ? "rgba(26, 26, 26, 0.9)" : "rgba(26, 26, 26, 0.8)"
    })
  
    // Service modal functionality
    if (serviceItems) {
      serviceItems.forEach((item) => {
        item.addEventListener("click", function () {
          const serviceType = this.getAttribute("data-service")
          serviceTypeInput.value = serviceType
          modal.style.display = "block"
          setTimeout(() => modal.classList.add("show"), 10)
        })
      })
    }
  
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal)
    }
  
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        closeModal()
      }
    })
  
    function closeModal() {
      modal.classList.remove("show")
      setTimeout(() => (modal.style.display = "none"), 300)
    }
  
    // Service form submission
    if (serviceForm) {
      serviceForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = {
          name: serviceForm.name.value,
          email: serviceForm.email.value,
          serviceType: serviceForm.serviceType.value,
          message: serviceForm.message.value,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
  
        db.collection("serviceRequests")
          .add(formData)
          .then(() => {
            alert("Thank you for your interest! We will contact you soon.")
            serviceForm.reset()
            closeModal()
          })
          .catch((error) => {
            console.error("Error writing document: ", error)
            alert("There was an error submitting your request. Please try again.")
          })
      })
    }
  
    // Contact form submission
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = {
          name: contactForm.name.value,
          email: contactForm.email.value,
          message: contactForm.message.value,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
  
        db.collection("contactMessages")
          .add(formData)
          .then(() => {
            alert("Thank you for your message! We will get back to you soon.")
            contactForm.reset()
          })
          .catch((error) => {
            console.error("Error writing document: ", error)
            alert("There was an error submitting your message. Please try again.")
          })
      })
    }
  
    // Animate service items on scroll
    const animateOnScroll = () => {
      const triggerBottom = (window.innerHeight / 5) * 4
      serviceItems.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top
        if (itemTop < triggerBottom) {
          item.style.opacity = "1"
          item.style.transform = "translateY(0)"
        }
      })
    }
  
    window.addEventListener("scroll", animateOnScroll)
    animateOnScroll() // Call once to check initial state

    // Define revealElements at the beginning
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add("active");
            }
        });
    };

    // Add scroll event listener once
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Tab Functionality
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function switchTab(e) {
        e.preventDefault();
        
        // Remove active class from all tabs
        tabLinks.forEach(link => link.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked tab
        const targetTab = e.target.getAttribute('data-tab');
        e.target.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        // Trigger reveal animations for newly visible content
        revealOnScroll();
    }

    // Add click handlers to tabs
    tabLinks.forEach(link => {
        link.addEventListener('click', switchTab);
    });

    // Image slideshow functionality for service items
    function setupServiceImageTransitions() {
        document.querySelectorAll('.service-item').forEach(item => {
            const images = item.querySelectorAll('img');
            let currentImageIndex = 0;

            item.addEventListener('mouseenter', () => {
                // Show first image immediately
                images[0].style.opacity = 1;
                
                const interval = setInterval(() => {
                    // Hide all images
                    images.forEach(img => img.style.opacity = 0);
                    
                    // Move to next image
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    
                    // Show next image
                    images[currentImageIndex].style.opacity = 1;
                }, 1000); // Change to 1 second

                item.addEventListener('mouseleave', () => {
                    clearInterval(interval);
                    images.forEach(img => img.style.opacity = 0);
                    currentImageIndex = 0;
                }, { once: true });
            });
        });
    }

    setupServiceImageTransitions();

    // Admin functionality
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Remove active class from all tab links
            document.querySelectorAll('.tab-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Show admin pane
            const adminPane = document.getElementById('admin');
            if (adminPane) {
                adminPane.classList.add('active');
            }
        });
    }

    // Update the admin login form handler
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            const errorMsg = document.getElementById('adminError');

            if (username === 'admin' && password === 'admin123') {
                // Replace login form with dashboard
                const adminSection = document.querySelector('.admin-section');
                if (adminSection) {
                    adminSection.innerHTML = `
                        <div class="admin-dashboard">
                            <div class="dashboard-header">
                                <h2>Admin Dashboard</h2>
                                <button id="logoutBtn" class="logout-btn">Logout</button>
                            </div>
                            <div class="dashboard-content">
                                <h3>Service Requests</h3>
                                <div class="table-container">
                                    <table id="serviceRequestsTable">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Service Type</th>
                                                <th>Message</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>

                                <h3>Contact Messages</h3>
                                <div class="table-container">
                                    <table id="contactMessagesTable">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Message</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Add logout functionality
                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', () => {
                            location.reload();
                        });
                    }
                    
                    // Load dashboard data
                    loadDashboardData();
                }
            } else {
                if (errorMsg) {
                    errorMsg.textContent = 'Invalid username or password';
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    // Function to load dashboard data from Firestore
    const loadDashboardData = () => {
        const db = firebase.firestore();
        const serviceRequestsTable = document.getElementById('serviceRequestsTable').getElementsByTagName('tbody')[0];
        const contactMessagesTable = document.getElementById('contactMessagesTable').getElementsByTagName('tbody')[0];

        // Load service requests
        db.collection('serviceRequests')
            .orderBy('timestamp', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const row = serviceRequestsTable.insertRow();
                    const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'N/A';
                    row.innerHTML = `
                        <td>${data.name || 'N/A'}</td>
                        <td>${data.email || 'N/A'}</td>
                        <td>${data.serviceType || 'N/A'}</td>
                        <td>${data.message || 'N/A'}</td>
                        <td>${date}</td>
                    `;
                });
            });

        // Load contact messages
        db.collection('contactMessages')
            .orderBy('timestamp', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const row = contactMessagesTable.insertRow();
                    const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'N/A';
                    row.innerHTML = `
                        <td>${data.name || 'N/A'}</td>
                        <td>${data.email || 'N/A'}</td>
                        <td>${data.message || 'N/A'}</td>
                        <td>${date}</td>
                    `;
                });
            });
    };

    // Update the styles for the admin section
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .admin-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: calc(100vh - 100px); /* Adjust for header height */
            padding: 40px 20px;
            margin-top: 60px; /* Add margin to prevent header overlap */
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .login-container h2 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
            font-size: 24px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #1a1a1a;
        }
        
        .submit-button {
            width: 100%;
            padding: 12px;
            background-color: #1a1a1a;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        
        .submit-button:hover {
            background-color: #333;
        }
        
        .error-message {
            color: #ff3333;
            text-align: center;
            margin-bottom: 15px;
            display: none;
        }

        .admin-login-section {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .admin-link {
            color: #666;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }

        .admin-link:hover {
            color: #1a1a1a;
        }

        /* Admin Dashboard Styles */
        .admin-dashboard {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            width: 95%;
            max-width: 1200px;
            margin: 80px auto 40px;
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
        }

        .dashboard-header h2 {
            margin: 0;
            color: #333;
        }

        .dashboard-content {
            overflow-x: auto;
        }

        .dashboard-content h3 {
            margin: 30px 0 20px;
            color: #444;
        }

        /* Table Styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f8f8f8;
            font-weight: 600;
            color: #333;
        }

        tr:hover {
            background-color: #f5f5f5;
        }

        /* Responsive table */
        @media screen and (max-width: 768px) {
            table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
            }
        }

        /* Logout button */
        .logout-btn {
            padding: 8px 20px;
            background-color: #1a1a1a;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .logout-btn:hover {
            background-color: #333;
        }
    `;
    document.head.appendChild(styleSheet);

    // Add this to your existing script.js
    function checkAnimation() {
        const elements = document.querySelectorAll('.about, .why-choose, .features, .benefits, .name-meaning, .lost-meaning');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // More precise viewport checking
            const isInViewport = (
                elementTop < windowHeight * 0.85 && // Trigger slightly earlier
                elementBottom > windowHeight * 0.15  // Keep animation when element is still partially visible
            );
            
            if (isInViewport) {
                element.classList.add('animate');
            }
        });
    }

    // Enhanced throttle function with immediate first execution
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    // Multiple event listeners for more reliable animation triggering
    function initAnimationChecks() {
        // Initial check
        checkAnimation();
        
        // Check after small delay
        setTimeout(checkAnimation, 100);
        
        // Check after content likely loaded
        setTimeout(checkAnimation, 500);
        
        // Final check after all resources loaded
        setTimeout(checkAnimation, 1000);
    }

    // Add multiple scroll event listeners with different throttle times
    window.addEventListener('scroll', throttle(checkAnimation, 100));  // Quick checks
    window.addEventListener('scroll', throttle(checkAnimation, 500));  // Backup checks

    // Add multiple load event listeners
    window.addEventListener('load', initAnimationChecks);
    window.addEventListener('DOMContentLoaded', initAnimationChecks);

    // Check on resize events
    window.addEventListener('resize', throttle(checkAnimation, 100));

    // Intersection Observer as backup
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.about, .why-choose, .features, .benefits, .name-meaning, .lost-meaning')
        .forEach(element => observer.observe(element));
})
  
  