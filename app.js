document.addEventListener("DOMContentLoaded", () => {
    // Initialize Firebase (replace with your actual Firebase config)
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyCZL642_1kx9Ah6oDEUs5pQDbkME5MObw4",
      authDomain: "techno-9b7eb.firebaseapp.com",
      databaseURL: "https://techno-9b7eb-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "techno-9b7eb",
      storageBucket: "techno-9b7eb.firebasestorage.app",
      messagingSenderId: "374236940896",
      appId: "1:374236940896:web:e1e7ac070b11eee96c9105",
      measurementId: "G-03X8754ZGF",
    }
  
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)
  
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
  })
  
  