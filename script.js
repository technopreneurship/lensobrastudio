document.addEventListener("DOMContentLoaded", () => {
  // Initialize Firebase only if it's not already initialized
  if (typeof firebase !== "undefined" && !firebase.apps.length) {
    const firebaseConfig = {
      apiKey: "AIzaSyCZL642_1kx9Ah6oDEUs5pQDbkME5MObw4",
      authDomain: "techno-9b7eb.firebaseapp.com",
      databaseURL: "https://techno-9b7eb-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "techno-9b7eb",
      storageBucket: "techno-9b7eb.appspot.com",
      messagingSenderId: "374236940896",
      appId: "1:374236940896:web:e1e7ac070b11eee96c9105",
      measurementId: "G-03X8754ZGF",
    }

    firebase.initializeApp(firebaseConfig)
  }

  // Get a reference to the database service
  const db = firebase.firestore()

  // Fix for Firestore warnings - use the newer recommended cache approach
  try {
    // Use the newer recommended cache setting instead of enablePersistence
    db.settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
      ignoreUndefinedProperties: true,
      merge: true, // Add merge: true to fix the warning about overriding original host
    })

    // Note: We're removing the enablePersistence call that was causing warnings
  } catch (e) {
    console.warn("Firestore persistence could not be enabled:", e)
  }

  const serviceItems = document.querySelectorAll(".service-item")
  const modal = document.getElementById("serviceModal")
  const partnerModal = document.getElementById("partnerModal")
  const partnerEditModal = document.getElementById("partnerEditModal")
  const addPartnerModal = document.getElementById("addPartnerModal")
  const closeBtn = document.querySelector(".close")
  const partnerCloseBtn = document.querySelector(".partner-close")
  const partnerEditCloseBtn = document.querySelector(".partner-edit-close")
  const addPartnerCloseBtn = document.querySelector(".add-partner-close")
  const serviceForm = document.getElementById("serviceForm")
  const partnerForm = document.getElementById("partnerForm")
  const partnerEditForm = document.getElementById("partnerEditForm")
  const addPartnerForm = document.getElementById("addPartnerForm")
  const serviceTypeInput = document.getElementById("serviceType")
  const contactForm = document.getElementById("contactForm")
  const partnerWithUsBtn = document.getElementById("partnerWithUsBtn")

  // Enhanced loader functionality with transition
  const removeLoader = () => {
    const loader = document.querySelector(".page-loader")
    const loaderLogo = document.querySelector(".loader-logo")
    const loaderBar = document.querySelector(".loader-bar")
    const letters = document.querySelectorAll(".letter")

    if (loader) {
      // Minimum loader duration of 2 seconds
      setTimeout(() => {
        // Start the animation by showing expanded text
        loaderLogo.classList.add("start-animation")

        // Animate each letter group sequentially
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.classList.add("expand-text")
          }, index * 500) // 500ms delay between each letter group
        })

        // Fade out loader bar
        setTimeout(() => {
          loaderBar.classList.add("fade-out")
        }, 1500)

        // Final transition: Fade out loader
        setTimeout(() => {
          document.body.classList.remove("loading")
          loader.style.opacity = "0"
          setTimeout(() => {
            loader.style.display = "none"
          }, 800)
        }, 3000) // Increased delay to allow for text expansion
      }, 2000)
    }
  }

  // Remove loader when everything is loaded
  if (document.readyState === "complete") {
    removeLoader()
  } else {
    window.addEventListener("load", removeLoader)
  }

  // Animate header on scroll
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header")
    header.style.backgroundColor = window.scrollY > 50 ? "rgba(26, 26, 26, 0.9)" : "rgba(26, 26, 26, 0.8)"
  })

  // Function to open the service modal
  function openServiceModal(serviceType) {
    console.log("Opening modal for service:", serviceType) // Debugging log
    serviceTypeInput.value = serviceType // Set the service type in the modal
    modal.style.display = "block" // First set display to block

    // Force a reflow before adding the show class for the transition to work
    void modal.offsetWidth

    modal.classList.add("show") // Then add the show class for the transition
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  // Function to open the partner modal
  function openPartnerModal() {
    partnerModal.style.display = "block"

    // Force a reflow before adding the show class for the transition to work
    void partnerModal.offsetWidth

    partnerModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  // Function to show a toast notification
  function showToast(message, type = "info", duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.className = "toast-container"
      document.body.appendChild(toastContainer)
    }

    // Create toast element
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message

    // Add to container
    toastContainer.appendChild(toast)

    // Show toast with animation
    setTimeout(() => {
      toast.classList.add("show")
    }, 10)

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, duration)
  }

  // Create image editor modal
  function createImageEditorModal() {
    // Check if modal already exists
    if (document.getElementById("imageEditorModal")) {
      return
    }

    const editorModal = document.createElement("div")
    editorModal.id = "imageEditorModal"
    editorModal.className = "modal image-editor-modal"

    editorModal.innerHTML = `
      <div class="modal-content image-editor-content">
        <span class="close image-editor-close">&times;</span>
        <h2>Edit Image</h2>
        <div class="image-editor-container">
          <div class="image-editor-preview">
            <div class="fb-image-viewport">
              <div class="fb-image-container">
                <img src="/placeholder.svg" class="fb-editor-image">
              </div>
            </div>
          </div>
          <div class="image-editor-controls">
            <div class="fb-zoom-control">
              <span class="fb-zoom-btn fb-zoom-minus">−</span>
              <input type="range" min="1" max="3" step="0.1" value="1" class="fb-zoom-slider">
              <span class="fb-zoom-btn fb-zoom-plus">+</span>
            </div>
            <div class="editor-buttons">
              <button type="button" class="editor-save-btn">Save Changes</button>
              <button type="button" class="editor-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(editorModal)

    // Add event listeners
    const closeBtn = editorModal.querySelector(".image-editor-close")
    const cancelBtn = editorModal.querySelector(".editor-cancel-btn")
    const saveBtn = editorModal.querySelector(".editor-save-btn")

    closeBtn.addEventListener("click", closeImageEditor)
    cancelBtn.addEventListener("click", closeImageEditor)
    saveBtn.addEventListener("click", saveImageEditorChanges)

    // Close when clicking outside
    editorModal.addEventListener("click", (e) => {
      if (e.target === editorModal) {
        closeImageEditor()
      }
    })

    return editorModal
  }

  // Global variables for image editor
  let currentImageEditor = {
    targetPreview: null,
    formType: "",
    imageUrl: "",
    scale: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  }

  // Open image editor
  function openImageEditor(targetPreview, formType, imageUrl, initialScale = 1, initialPosition = { x: 0, y: 0 }) {
    const editorModal = document.getElementById("imageEditorModal") || createImageEditorModal()

    // Set current editor state
    currentImageEditor = {
      targetPreview,
      formType,
      imageUrl,
      scale: initialScale,
      position: initialPosition,
      isDragging: false,
    }

    // Set image source
    const editorImage = editorModal.querySelector(".fb-editor-image")
    editorImage.src = imageUrl

    // Set initial scale and position
    const imageContainer = editorModal.querySelector(".fb-image-container")
    const zoomSlider = editorModal.querySelector(".fb-zoom-slider")

    zoomSlider.value = initialScale
    imageContainer.style.transform = `scale(${initialScale})`
    imageContainer.style.left = `${initialPosition.x}px`
    imageContainer.style.top = `${initialPosition.y}px`

    // Setup dragging
    setupImageDragging(editorModal)

    // Setup zoom controls
    setupZoomControls(editorModal)

    // Show modal
    editorModal.style.display = "block"
    void editorModal.offsetWidth
    editorModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  // Setup image dragging
  function setupImageDragging(editorModal) {
    const imageContainer = editorModal.querySelector(".fb-image-container")

    // Remove any existing listeners
    imageContainer.removeEventListener("mousedown", startDrag)
    imageContainer.removeEventListener("touchstart", startDrag)
    document.removeEventListener("mousemove", drag)
    document.removeEventListener("touchmove", drag)
    document.removeEventListener("mouseup", endDrag)
    document.removeEventListener("touchend", endDrag)

    // Add new listeners
    imageContainer.addEventListener("mousedown", startDrag)
    imageContainer.addEventListener("touchstart", startDrag, { passive: false })
    document.addEventListener("mousemove", drag)
    document.addEventListener("touchmove", drag, { passive: false })
    document.addEventListener("mouseup", endDrag)
    document.addEventListener("touchend", endDrag)

    function startDrag(e) {
      e.preventDefault()
      currentImageEditor.isDragging = true

      // Get touch or mouse position
      if (e.type === "touchstart") {
        currentImageEditor.startX = e.touches[0].clientX
        currentImageEditor.startY = e.touches[0].clientY
      } else {
        currentImageEditor.startX = e.clientX
        currentImageEditor.startY = e.clientY
      }

      // Get current position
      const computedStyle = window.getComputedStyle(imageContainer)
      currentImageEditor.startLeft = Number.parseInt(computedStyle.left) || 0
      currentImageEditor.startTop = Number.parseInt(computedStyle.top) || 0
    }

    function drag(e) {
      if (!currentImageEditor.isDragging) return
      e.preventDefault()

      let currentX, currentY

      // Get touch or mouse position
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX
        currentY = e.touches[0].clientY
      } else {
        currentX = e.clientX
        currentY = e.clientY
      }

      // Calculate new position
      const deltaX = currentX - currentImageEditor.startX
      const deltaY = currentY - currentImageEditor.startY

      const newLeft = currentImageEditor.startLeft + deltaX
      const newTop = currentImageEditor.startTop + deltaY

      // Update position
      imageContainer.style.left = `${newLeft}px`
      imageContainer.style.top = `${newTop}px`

      // Update current position
      currentImageEditor.position = { x: newLeft, y: newTop }
    }

    function endDrag() {
      currentImageEditor.isDragging = false
    }
  }

  // Setup zoom controls
  function setupZoomControls(editorModal) {
    const zoomSlider = editorModal.querySelector(".fb-zoom-slider")
    const zoomMinus = editorModal.querySelector(".fb-zoom-minus")
    const zoomPlus = editorModal.querySelector(".fb-zoom-plus")
    const imageContainer = editorModal.querySelector(".fb-image-container")

    zoomSlider.addEventListener("input", function () {
      const scale = Number.parseFloat(this.value)
      imageContainer.style.transform = `scale(${scale})`
      currentImageEditor.scale = scale
    })

    zoomMinus.addEventListener("click", () => {
      const currentScale = Number.parseFloat(zoomSlider.value)
      const newScale = Math.max(1, currentScale - 0.1)
      zoomSlider.value = newScale.toString()
      imageContainer.style.transform = `scale(${newScale})`
      currentImageEditor.scale = newScale
    })

    zoomPlus.addEventListener("click", () => {
      const currentScale = Number.parseFloat(zoomSlider.value)
      const newScale = Math.min(3, currentScale + 0.1)
      zoomSlider.value = newScale.toString()
      imageContainer.style.transform = `scale(${newScale})`
      currentImageEditor.scale = newScale
    })
  }

  // Close image editor
  function closeImageEditor() {
    const editorModal = document.getElementById("imageEditorModal")
    if (editorModal) {
      editorModal.classList.remove("show")
      setTimeout(() => {
        editorModal.style.display = "none"
        document.body.style.overflow = ""
      }, 300)
    }
  }

  // Save image editor changes and update partners page
  function saveImageEditorChanges() {
    if (!currentImageEditor.targetPreview) return

    const { targetPreview, formType, scale, position } = currentImageEditor

    // Update scale input
    const scaleInput = document.getElementById(`${formType}LogoScale`)
    if (scaleInput) {
      scaleInput.value = scale.toString()
    }

    // Update position input
    const positionInput = document.getElementById(`${formType}LogoPosition`)
    if (positionInput) {
      positionInput.value = JSON.stringify(position)
    }

    // Update preview
    updateLogoPreview(targetPreview, currentImageEditor.imageUrl, scale, position)

    // Update partners page dynamically
    const partnerCard = document.querySelector(`.partner-card[data-id="${formType}"]`)
    if (partnerCard) {
      const logoContainer = partnerCard.querySelector(".fb-image-container")
      if (logoContainer) {
        logoContainer.style.transform = `scale(${scale})`
        logoContainer.style.left = `${position.x}px`
        logoContainer.style.top = `${position.y}px`
      }
      const logoImage = partnerCard.querySelector(".fb-editor-image")
      if (logoImage) {
        logoImage.src = currentImageEditor.imageUrl
      }
    }

    // Close editor
    closeImageEditor()

    showToast("Image settings saved", "success")
  }

  // Update logo preview with "X" button for removal
  function updateLogoPreview(previewElement, imageUrl) {
    // Clear the preview
    previewElement.innerHTML = "";

    // Create viewport and container
    const viewport = document.createElement("div");
    viewport.className = "fb-image-viewport";

    const container = document.createElement("div");
    container.className = "fb-image-container";

    // Create image
    const image = document.createElement("img");
    image.src = imageUrl;
    image.className = "fb-editor-image";

    // Create "X" button for removing the image
    const removeButton = document.createElement("button");
    removeButton.className = "remove-image-btn";
    removeButton.textContent = "X";
    removeButton.addEventListener("click", () => {
      previewElement.innerHTML = "No logo";
      previewElement.classList.remove("has-image");
      const fileInput = document.querySelector(`#${previewElement.id.replace("Preview", "StudioLogo")}`);
      if (fileInput) fileInput.value = ""; // Clear file input
      showToast("Logo removed", "info");
    });

    // Assemble
    container.appendChild(image);
    viewport.appendChild(container);
    previewElement.appendChild(viewport);
    previewElement.appendChild(removeButton);
    previewElement.classList.add("has-image");
  }

  // Show partner details in a modal
  function showPartnerDetails(partnerData) {
    // Remove any existing modal
    const existingModal = document.querySelector(".partner-details-modal");
    if (existingModal) existingModal.remove();
  
    // Create modal
    const modal = document.createElement("div");
    modal.className = "partner-details-modal";
  
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="partner-details">
          <div class="partner-logo">
            <img src="${partnerData.logoUrl || '/placeholder.svg'}" alt="${partnerData.studioName}">
          </div>
          <h2>${partnerData.studioName}</h2>
          <p><strong>Contact Person:</strong> ${partnerData.contactPerson || "N/A"}</p>
          <p><strong>Email:</strong> ${partnerData.email || "N/A"}</p>
          <p><strong>Phone:</strong> ${partnerData.phone || "N/A"}</p>
          <p><strong>Website:</strong> <a href="${partnerData.website || '#'}" target="_blank">${partnerData.website || "N/A"}</a></p>
          <p><strong>Portfolio:</strong> <a href="${partnerData.portfolioLink || '#'}" target="_blank">${partnerData.portfolioLink || "N/A"}</a></p>
          <p><strong>Description:</strong> ${partnerData.description || "No description provided."}</p>
          <p><strong>Specialties:</strong></p>
          <ul class="specialties-list">
            ${partnerData.specialties.map(specialty => `<li><span class="checkmark">✔</span> ${specialty}</li>`).join("")}
          </ul>
          <p><strong>Services Completed:</strong> ${partnerData.servicesCompleted || 0}</p>
        </div>
      </div>
    `;
  
    document.body.appendChild(modal);
  
    // Add show class to trigger CSS animations
    setTimeout(() => modal.classList.add("show"), 10);
  
    // Close modal functionality
    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", () => {
      modal.classList.remove("show");
      setTimeout(() => modal.remove(), 300); // Wait for animation to complete
    });
  
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        setTimeout(() => modal.remove(), 300);
      }
    });
  }

  // Beautify partners section and add click functionality
  function loadPartners() {
    const partnersGrid = document.getElementById("partners-grid");

    if (!partnersGrid) return;

    // Show loading indicator
    partnersGrid.innerHTML = '<div class="loading-partners">Loading partners...</div>';

    // Load approved partners
    db.collection("partners")
      .where("status", "==", "approved")
      .get()
      .then((querySnapshot) => {
        // Clear loading indicator
        partnersGrid.innerHTML = "";

        if (querySnapshot.empty) {
          partnersGrid.innerHTML = "<p class='no-partners'>No partner studios available at the moment.</p>";
          return;
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const partnerCard = document.createElement("div");
          partnerCard.className = "partner-card";

          // Default logo if none provided
          const logoUrl = data.logoUrl || "/placeholder.svg";

          // Combine specialties logic
          const specialties = data.specialties || [];
          const formattedSpecialties = specialties.map((specialty) => {
            if (specialty === "wedding") return "Wedding Photography";
            if (specialty === "wedding-video") return "Wedding Videography";
            return specialty;
          });

          if (formattedSpecialties.includes("Wedding Photography") && formattedSpecialties.includes("Wedding Videography")) {
            const indexPhoto = formattedSpecialties.indexOf("Wedding Photography");
            const indexVideo = formattedSpecialties.indexOf("Wedding Videography");
            formattedSpecialties.splice(indexPhoto, 1);
            formattedSpecialties.splice(indexVideo - 1, 1);
            formattedSpecialties.push("Wedding Photography & Videography");
          }

          // Create partner card with front and back
          partnerCard.innerHTML = `
            <div class="partner-card-inner">
              <div class="partner-card-front">
                <div class="partner-logo">
                  <img src="${logoUrl}" alt="${data.studioName}">
                </div>
                <h3>${data.studioName}</h3>
                <ul class="specialties-list">
                  ${formattedSpecialties.length > 0
                    ? formattedSpecialties.map((specialty) => `<li><span class="checkmark">✔</span> ${specialty}</li>`).join("")
                    : "<li>No specialties listed</li>"}
                </ul>
                <button class="view-details-btn">View Details</button>
              </div>
              <div class="partner-card-back">
                <h3>${data.studioName}</h3>
                <p><strong>Contact Person:</strong> ${data.contactPerson || "N/A"}</p>
                <p><strong>Email:</strong> ${data.email || "N/A"}</p>
                <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
                <p><strong>Website:</strong> <a href="${data.website || '#'}" target="_blank">${data.website || "N/A"}</a></p>
                <p><strong>Description:</strong> ${data.description || "No description provided."}</p>
                <p><strong>Services Completed:</strong> ${data.servicesCompleted || 0}</p>
                <button class="close-details-btn">Close</button>
              </div>
            </div>
          `;

          // Add click event to flip the card
          const viewDetailsBtn = partnerCard.querySelector(".view-details-btn");
          const closeDetailsBtn = partnerCard.querySelector(".close-details-btn");

          viewDetailsBtn.addEventListener("click", () => {
            partnerCard.classList.add("flipped");
          });

          closeDetailsBtn.addEventListener("click", () => {
            partnerCard.classList.remove("flipped");
          });

          partnersGrid.appendChild(partnerCard);
        });
      })
      .catch((error) => {
        console.error("Error loading partners:", error);
        partnersGrid.innerHTML = "<p class='error-message'>Error loading partners. Please refresh the page.</p>";
      });
  }

  // Function to open the partner edit modal
  function openPartnerEditModal(partnerId) {
    // Show loading indicator
    const loadingIndicator = document.createElement("div")
    loadingIndicator.className = "loading-overlay"
    loadingIndicator.innerHTML =
      '<div class="loading-spinner"></div><div class="loading-text">Loading partner data...</div>'
    document.body.appendChild(loadingIndicator)

    // Fetch partner data and populate the form
    db.collection("partners")
      .doc(partnerId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data()

          // Populate form fields
          document.getElementById("editPartnerId").value = partnerId
          document.getElementById("editStudioName").value = data.studioName || ""
          document.getElementById("editContactPerson").value = data.contactPerson || ""
          document.getElementById("editStudioEmail").value = data.email || ""
          document.getElementById("editStudioPhone").value = data.phone || ""
          document.getElementById("editStudioWebsite").value = data.website || ""
          document.getElementById("editPortfolioLink").value = data.portfolioLink || ""
          document.getElementById("editStudioDescription").value = data.description || ""
          document.getElementById("editServicesCompleted").value = data.servicesCompleted || 0

          // Clear all checkboxes first
          document.querySelectorAll('input[name="editSpecialties"]').forEach((checkbox) => {
            checkbox.checked = false
          })

          // Check the appropriate specialties
          if (data.specialties && data.specialties.length > 0) {
            data.specialties.forEach((specialty) => {
              const checkbox = document.querySelector(`input[name="editSpecialties"][value="${specialty}"]`)
              if (checkbox) checkbox.checked = true
            })
          }

          // Show logo preview if available
          const logoPreview = document.getElementById("editLogoPreview")
          if (data.logoUrl) {
            // Pre-load the image to ensure it's in cache
            const img = new Image()
            img.onload = () => {
              // Set form type for the editor
              currentImageEditor.formType = "edit"

              // Create scale and position inputs if they don't exist
              let scaleInput = document.getElementById("editLogoScale")
              if (!scaleInput) {
                scaleInput = document.createElement("input")
                scaleInput.type = "hidden"
                scaleInput.id = "editLogoScale"
                scaleInput.name = "editLogoScale"
                logoPreview.appendChild(scaleInput)
              }

              let positionInput = document.getElementById("editLogoPosition")
              if (!positionInput) {
                positionInput = document.createElement("input")
                positionInput.type = "hidden"
                positionInput.id = "editLogoPosition"
                positionInput.name = "editLogoPosition"
                logoPreview.appendChild(positionInput)
              }

              // Set values
              scaleInput.value = data.logoScale || 1
              positionInput.value = JSON.stringify(data.logoPosition || { x: 0, y: 0 })

              // Update preview
              updateLogoPreview(logoPreview, data.logoUrl, data.logoScale || 1, data.logoPosition || { x: 0, y: 0 })

              // Remove loading indicator
              loadingIndicator.remove()

              // Show the modal
              partnerEditModal.style.display = "block"
              void partnerEditModal.offsetWidth
              partnerEditModal.classList.add("show")
              document.body.style.overflow = "hidden"
            }

            img.onerror = () => {
              // Handle image loading error
              logoPreview.innerHTML = "Logo image failed to load"
              logoPreview.classList.remove("has-image")

              // Remove loading indicator
              loadingIndicator.remove()

              // Show the modal
              partnerEditModal.style.display = "block"
              void partnerEditModal.offsetWidth
              partnerEditModal.classList.add("show")
              document.body.style.overflow = "hidden"

              showToast("Failed to load logo image. The image may no longer be available.", "error")
            }

            img.src = data.logoUrl
          } else {
            logoPreview.innerHTML = "No logo"
            logoPreview.classList.remove("has-image")

            // Remove loading indicator
            loadingIndicator.remove()

            // Show the modal
            partnerEditModal.style.display = "block"
            void partnerEditModal.offsetWidth
            partnerEditModal.classList.add("show")
            document.body.style.overflow = "hidden"
          }
        } else {
          // Remove loading indicator
          loadingIndicator.remove()
          showToast("Partner not found!", "error")
        }
      })
      .catch((error) => {
        // Remove loading indicator
        loadingIndicator.remove()
        console.error("Error getting partner data:", error)
        showToast("Error loading partner data. Please try again.", "error")
      })
  }

  // Function to open the add partner modal
  function openAddPartnerModal() {
    // Reset the form
    addPartnerForm.reset()

    // Clear logo preview
    const logoPreview = document.getElementById("addLogoPreview")
    logoPreview.innerHTML = "No logo"
    logoPreview.classList.remove("has-image")

    // Set form type for the editor
    currentImageEditor.formType = "add"

    // Create scale and position inputs if they don't exist
    let scaleInput = document.getElementById("addLogoScale")
    if (!scaleInput) {
      scaleInput = document.createElement("input")
      scaleInput.type = "hidden"
      scaleInput.id = "addLogoScale"
      scaleInput.name = "addLogoScale"
      logoPreview.appendChild(scaleInput)
    }

    let positionInput = document.getElementById("addLogoPosition")
    if (!positionInput) {
      positionInput = document.createElement("input")
      positionInput.type = "hidden"
      positionInput.id = "addLogoPosition"
      positionInput.name = "addLogoPosition"
      logoPreview.appendChild(positionInput)
    }

    // Reset values
    scaleInput.value = "1"
    positionInput.value = JSON.stringify({ x: 0, y: 0 })

    // Show the modal
    addPartnerModal.style.display = "block"
    void addPartnerModal.offsetWidth
    addPartnerModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  // Add event listeners to service items
  serviceItems.forEach((item) => {
    item.addEventListener("click", () => {
      const serviceType = item.getAttribute("data-service")
      openServiceModal(serviceType) // Open modal with the selected service type
    })
  })

  // Add event listener to "Partner With Us" button
  if (partnerWithUsBtn) {
    partnerWithUsBtn.addEventListener("click", (e) => {
      e.preventDefault()
      openPartnerModal()
    })
  }

  // Close buttons for modals
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeModal(modal))
  }

  if (partnerCloseBtn) {
    partnerCloseBtn.addEventListener("click", () => closeModal(partnerModal))
  }

  if (partnerEditCloseBtn) {
    partnerEditCloseBtn.addEventListener("click", () => closeModal(partnerEditModal))
  }

  if (addPartnerCloseBtn) {
    addPartnerCloseBtn.addEventListener("click", () => closeModal(addPartnerModal))
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      closeModal(modal)
    }
    if (event.target == partnerModal) {
      closeModal(partnerModal)
    }
    if (event.target == partnerEditModal) {
      closeModal(partnerEditModal)
    }
    if (event.target == addPartnerModal) {
      closeModal(addPartnerModal)
    }
  })

  function closeModal(modalElement) {
    modalElement.classList.remove("show")

    // Re-enable scrolling on body when modal is closed
    document.body.style.overflow = ""

    setTimeout(() => {
      modalElement.style.display = "none"
      // Reset form scroll position
      if (modalElement === modal && serviceForm) {
        serviceForm.scrollTop = 0
      } else if (modalElement === partnerModal && partnerForm) {
        partnerForm.scrollTop = 0
      } else if (modalElement === partnerEditModal && partnerEditForm) {
        partnerEditForm.scrollTop = 0
      } else if (modalElement === addPartnerModal && addPartnerForm) {
        addPartnerForm.scrollTop = 0
      }
    }, 300)
  }

  // Logo preview functionality with improved image editor
  function setupLogoPreview(inputId, previewId, formType) {
    const input = document.getElementById(inputId)
    const preview = document.getElementById(previewId)

    if (input && preview) {
      input.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          const file = this.files[0]

          // Check file size - reject if larger than 1.1MB
          if (file.size > 1.1 * 1024 * 1024) {
            showToast("Image is too large. Please select an image smaller than 1.1MB.", "error")
            this.value = "" // Clear the file input
            return
          }

          // Clear any "remove logo" flag
          const removeLogoInput = document.getElementById(`${formType}RemoveLogo`)
          if (removeLogoInput) {
            removeLogoInput.value = "false"
          }

          // Show loading indicator in preview
          preview.innerHTML = '<div class="preview-loading">Loading image...</div>'

          const reader = new FileReader()
          reader.onload = (e) => {
            // Set current form type
            currentImageEditor.formType = formType

            // Create scale and position inputs if they don't exist
            let scaleInput = document.getElementById(`${formType}LogoScale`)
            if (!scaleInput) {
              scaleInput = document.createElement("input")
              scaleInput.type = "hidden"
              scaleInput.id = `${formType}LogoScale`
              scaleInput.name = `${formType}LogoScale`
              preview.appendChild(scaleInput)
            }

            let positionInput = document.getElementById(`${formType}LogoPosition`)
            if (!positionInput) {
              positionInput = document.createElement("input")
              positionInput.type = "hidden"
              positionInput.id = `${formType}LogoPosition`
              positionInput.name = `${formType}LogoPosition`
              preview.appendChild(positionInput)
            }

            // Set default values
            scaleInput.value = "1"
            positionInput.value = JSON.stringify({ x: 0, y: 0 })

            // Update preview
            updateLogoPreview(preview, e.target.result, 1, { x: 0, y: 0 })

            // Show toast with instructions
            showToast("Image loaded. Click 'Edit' to adjust the image.", "info")
          }

          reader.readAsDataURL(file)
        }
      })
    }
  }

  // Setup logo previews for all forms with improved image editor
  setupLogoPreview("studioLogo", "logoPreview", "")
  setupLogoPreview("editStudioLogo", "editLogoPreview", "edit")
  setupLogoPreview("addStudioLogo", "addLogoPreview", "add")

  // Function to upload logo to Supabase Storage with progress tracking
  async function uploadLogo(file, studioName) {
    if (!file) return null;

    try {
      console.log("Starting logo upload for:", studioName);

      // Create upload progress overlay
      const progressOverlay = document.createElement("div");
      progressOverlay.className = "upload-progress-overlay";
      progressOverlay.innerHTML = `
        <div class="upload-progress-container">
          <div class="upload-progress-text">Uploading logo...</div>
          <div class="upload-progress-bar-container">
            <div class="upload-progress-bar" style="width: 0%"></div>
          </div>
          <div class="upload-progress-percentage">0%</div>
        </div>
      `;
      document.body.appendChild(progressOverlay);

      // Create a unique file name with timestamp to avoid cache issues
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${studioName.replace(/\s+/g, "_")}_${timestamp}.${fileExtension}`;

      // Use Supabase storage API for the upload
      const response = await fetch(
        `https://aufivbehcocgxgzximot.supabase.co/storage/v1/object/partner-logos/${fileName}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1Zml2YmVoY29jZ3hnenhpbW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDAxOTYsImV4cCI6MjA1Nzk3NjE5Nn0.BjwTDsc9Asu6fRenD8EVkTX_czCqT1e27myHGLQ0btA`,
            "Content-Type": "application/octet-stream",
            "x-upsert": "true",
          },
          body: file,
        }
      );

      // Log the response for debugging
      console.log("Supabase response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      // Get the public URL of the uploaded file
      const publicUrl = `https://aufivbehcocgxgzximot.supabase.co/storage/v1/object/public/partner-logos/${fileName}`;
      console.log("Supabase upload successful, URL:", publicUrl);

      // Update progress to 100%
      if (progressOverlay) {
        const progressBar = progressOverlay.querySelector(".upload-progress-bar");
        const progressText = progressOverlay.querySelector(".upload-progress-percentage");

        if (progressBar && progressText) {
          progressBar.style.width = "100%";
          progressText.textContent = "100% - Complete!";
        }
      }

      // Remove progress overlay after a short delay
      setTimeout(() => {
        progressOverlay.remove();
      }, 500);

      return { url: publicUrl };
    } catch (error) {
      // Remove any progress overlay that might be present
      const progressOverlay = document.querySelector(".upload-progress-overlay");
      if (progressOverlay) {
        progressOverlay.remove();
      }

      console.error("Error in upload process:", error);
      showToast("Failed to upload logo. Please try again later.", "error");
      return null;
    }
  }

  // Service form submission (now for referral requests)
  if (serviceForm) {
    serviceForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const formData = {
        name: serviceForm.name.value,
        email: serviceForm.email.value,
        phone: serviceForm.contactNumber.value,
        serviceType: serviceTypeInput.value,
        budget: serviceForm.budget.value,
        date: serviceForm.date.value,
        location: serviceForm.location.value,
        message: serviceForm.message.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: "new", // For tracking referral status
      }

      console.log("Submitting referral request:", formData) // Debugging log

      // Show loading state
      const submitBtn = serviceForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Submitting..."
      submitBtn.disabled = true

      db.collection("referralRequests")
        .add(formData)
        .then(() => {
          showToast(
            "Thank you for your request! We'll match you with suitable studios and contact you within 24 hours.",
            "success",
          )
          serviceForm.reset()
          closeModal(modal)
        })
        .catch((error) => {
          console.error("Error submitting referral request: ", error)
          showToast("There was an error submitting your request. Please try again.", "error")
        })
        .finally(() => {
          // Restore button state
          submitBtn.textContent = originalBtnText
          submitBtn.disabled = false
        })
    })
  }

  // Partner form submission
  if (partnerForm) {
    partnerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Show loading state
      const submitBtn = partnerForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Submitting..."
      submitBtn.disabled = true

      try {
        // Get all selected specialties
        const specialtiesCheckboxes = document.querySelectorAll('input[name="specialties"]:checked')
        const specialties = Array.from(specialtiesCheckboxes).map((checkbox) => checkbox.value)

        // Get the logo file
        const logoFile = document.getElementById("studioLogo").files[0]
        let logoData = null

        // Get scale and position values if available
        const logoScale = document.getElementById("LogoScale")?.value || 1
        const logoPosition = document.getElementById("LogoPosition")?.value || JSON.stringify({ x: 0, y: 0 })

        // Check if logo should be removed
        const removeLogo = document.getElementById("RemoveLogo")?.value === "true"

        // Upload logo if provided and not marked for removal
        if (logoFile && !removeLogo) {
          console.log("Logo file selected, uploading...")
          logoData = await uploadLogo(logoFile, partnerForm.studioName.value)
          console.log("Logo uploaded, data:", logoData)
        }

        const formData = {
          studioName: partnerForm.studioName.value,
          contactPerson: partnerForm.contactPerson.value,
          email: partnerForm.studioEmail.value || "",
          phone: partnerForm.studioPhone.value,
          website: partnerForm.studioWebsite.value || "",
          specialties: specialties,
          portfolioLink: partnerForm.portfolioLink.value || "",
          description: partnerForm.studioDescription.value || "",
          logoUrl: logoData ? logoData.url : null,
          logoScale: Number.parseFloat(logoScale),
          logoPosition: JSON.parse(logoPosition),
          servicesCompleted: 0, // New partners start with 0 services
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          status: "pending", // For application status tracking
        }

        console.log("Submitting partner application:", formData) // Debugging log

        await db.collection("partnerApplications").add(formData)

        showToast(
          "Thank you for your application! We'll review your information and contact you within 3-5 business days.",
          "success",
        )
        partnerForm.reset()
        document.getElementById("logoPreview").innerHTML = "No logo"
        document.getElementById("logoPreview").classList.remove("has-image")
        closeModal(partnerModal)
      } catch (error) {
        console.error("Error submitting partner application: ", error)
        showToast("There was an error submitting your application. Please try again.", "error")
      } finally {
        // Restore button state
        submitBtn.textContent = originalBtnText
        submitBtn.disabled = false
      }
    })
  }

  // Partner edit form submission
  if (partnerEditForm) {
    partnerEditForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Show loading state
      const submitBtn = partnerEditForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Saving..."
      submitBtn.disabled = true

      try {
        const partnerId = document.getElementById("editPartnerId").value

        // Get all selected specialties
        const specialtiesCheckboxes = document.querySelectorAll('input[name="editSpecialties"]:checked')
        const specialties = Array.from(specialtiesCheckboxes).map((checkbox) => checkbox.value)

        // Get the logo file
        const logoFile = document.getElementById("editStudioLogo").files[0]

        // Check if logo should be removed
        const removeLogo = document.getElementById("editRemoveLogo")?.value === "true"

        // Get the current partner data to check if we need to update the logo
        const partnerDoc = await db.collection("partners").doc(partnerId).get()
        const currentData = partnerDoc.data()

        let logoData = null

        // Get scale and position values if available
        const logoScale = document.getElementById("editLogoScale")?.value || 1
        const logoPosition = document.getElementById("editLogoPosition")?.value || JSON.stringify({ x: 0, y: 0 })

        // Handle logo update logic
        if (removeLogo) {
          // If logo should be removed, set logoUrl to null
          logoData = {
            url: null,
          }
        } else if (logoFile) {
          // If a new logo was uploaded, update it
          console.log("New logo file selected, uploading...")
          logoData = await uploadLogo(logoFile, document.getElementById("editStudioName").value)
          console.log("Logo uploaded, data:", logoData)
        } else if (currentData.logoUrl) {
          // Keep the existing logo URL and update settings if no new logo was uploaded
          logoData = {
            url: currentData.logoUrl,
          }
        }

        const formData = {
          studioName: document.getElementById("editStudioName").value,
          contactPerson: document.getElementById("editContactPerson").value,
          email: document.getElementById("editStudioEmail").value || "",
          phone: document.getElementById("editStudioPhone").value,
          website: document.getElementById("editStudioWebsite").value || "",
          specialties: specialties,
          portfolioLink: document.getElementById("editPortfolioLink").value || "",
          description: document.getElementById("editStudioDescription").value || "",
          logoUrl: logoData ? logoData.url : null,
          logoScale: Number.parseFloat(logoScale),
          logoPosition: JSON.parse(logoPosition),
          servicesCompleted: Number.parseInt(document.getElementById("editServicesCompleted").value) || 0,
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        }

        console.log("Updating partner:", formData) // Debugging log

        await db.collection("partners").doc(partnerId).update(formData)

        showToast("Partner information updated successfully!", "success")
        closeModal(partnerEditModal)
        loadPartners() // Refresh the partners list
      } catch (error) {
        console.error("Error updating partner:", error)
        showToast("There was an error updating the partner. Please try again.", "error")
      } finally {
        // Restore button state
        submitBtn.textContent = originalBtnText
        submitBtn.disabled = false
      }
    })
  }

  // Add partner form submission
  if (addPartnerForm) {
    addPartnerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Show loading state
      const submitBtn = addPartnerForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Adding..."
      submitBtn.disabled = true

      try {
        // Get all selected specialties
        const specialtiesCheckboxes = document.querySelectorAll('input[name="addSpecialties"]:checked')
        const specialties = Array.from(specialtiesCheckboxes).map((checkbox) => checkbox.value)

        // Get the logo file
        const logoFile = document.getElementById("addStudioLogo").files[0]
        let logoData = null

        // Check if logo should be removed
        const removeLogo = document.getElementById("addRemoveLogo")?.value === "true"

        // Get scale and position values if available
        const logoScale = document.getElementById("addLogoScale")?.value || 1
        const logoPosition = document.getElementById("addLogoPosition")?.value || JSON.stringify({ x: 0, y: 0 })

        // Upload logo if provided and not marked for removal
        if (logoFile && !removeLogo) {
          console.log("Logo file selected, uploading...")
          logoData = await uploadLogo(logoFile, document.getElementById("addStudioName").value)
          console.log("Logo uploaded, data:", logoData)
        }

        const formData = {
          studioName: document.getElementById("addStudioName").value,
          contactPerson: document.getElementById("addContactPerson").value,
          email: document.getElementById("addStudioEmail").value || "",
          phone: document.getElementById("addStudioPhone").value,
          website: document.getElementById("addStudioWebsite").value || "",
          specialties: specialties,
          portfolioLink: document.getElementById("addPortfolioLink").value || "",
          description: document.getElementById("addStudioDescription").value || "",
          logoUrl: logoData ? logoData.url : null,
          logoScale: Number.parseFloat(logoScale),
          logoPosition: JSON.parse(logoPosition),
          servicesCompleted: Number.parseInt(document.getElementById("addServicesCompleted").value) || 0,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          status: "approved", // Directly approved when added by admin
        }

        console.log("Adding new partner:", formData) // Debugging log

        await db.collection("partners").add(formData)

        showToast("New partner added successfully!", "success")
        addPartnerForm.reset()
        document.getElementById("addLogoPreview").innerHTML = "No logo"
        document.getElementById("addLogoPreview").classList.remove("has-image")
        closeModal(addPartnerModal)
        loadPartners() // Refresh the partners list
      } catch (error) {
        console.error("Error adding partner:", error)
        showToast("There was an error adding the partner. Please try again.", "error")
      } finally {
        // Restore button state
        submitBtn.textContent = originalBtnText
        submitBtn.disabled = false
      }
    })
  }

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true

      const formData = {
        name: contactForm.contactName.value,
        email: contactForm.contactEmail.value,
        phone: contactForm.contactNumber.value,
        message: contactForm.contactMessage.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }

      db.collection("contactMessages")
        .add(formData)
        .then(() => {
          showToast("Thank you for your message! We will get back to you soon.", "success")
          contactForm.reset()
        })
        .catch((error) => {
          console.error("Error writing document: ", error)
          showToast("There was an error submitting your message. Please try again.", "error")
        })
        .finally(() => {
          // Restore button state
          submitBtn.textContent = originalBtnText
          submitBtn.disabled = false
        })
    })
  }

  // Function to approve a partner application
  function approvePartnerApplication(applicationId) {
    // Show loading indicator
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-overlay";
    loadingIndicator.innerHTML =
      '<div class="loading-spinner"></div><div class="loading-text">Approving application...</div>';
    document.body.appendChild(loadingIndicator);
  
    // Get the application data
    db.collection("partnerApplications")
      .doc(applicationId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
  
          // Create a new partner document
          return db.collection("partners").add({
            ...data,
            status: "approved",
            approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          throw new Error("Application not found");
        }
      })
      .then(() => {
        // Delete the application document
        return db.collection("partnerApplications").doc(applicationId).delete();
      })
      .then(() => {
        deleteApplicationRow(applicationId); // Remove the application row
        showToast("Partner application approved successfully!", "success");
        loadDashboardData(); // Refresh the dashboard
        loadPartners(); // Refresh the partners list
      })
      .catch((error) => {
        console.error("Error approving application:", error);
        showToast("Error approving application. Please try again.", "error");
      })
      .finally(() => {
        // Remove loading indicator
        loadingIndicator.remove();
      });
  }
  
  // Function to reject a partner application
  function rejectPartnerApplication(applicationId) {
    // Show loading indicator
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-overlay";
    loadingIndicator.innerHTML =
      '<div class="loading-spinner"></div><div class="loading-text">Rejecting application...</div>';
    document.body.appendChild(loadingIndicator);
  
    // Approve the application temporarily to trigger row removal
    db.collection("partnerApplications")
      .doc(applicationId)
      .update({
        status: "approved",
        approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        deleteApplicationRow(applicationId); // Remove the application row
        return db.collection("partnerApplications").doc(applicationId).delete(); // Delete the document
      })
      .then(() => {
        showToast("Partner application rejected and removed.", "info"); // Refresh the admin dashboard in real-time
      })
      .catch((error) => {
        console.error("Error rejecting application:", error);
        showToast("Error rejecting application. Please try again.", "error");
      })
      .finally(() => {
        // Remove loading indicator
        loadingIndicator.remove();
      });
  }
  

  // Function to delete a partner
  function deletePartner(partnerId) {
    if (confirm("Are you sure you want to delete this partner? This action cannot be undone.")) {
      // Show loading indicator
      const loadingIndicator = document.createElement("div")
      loadingIndicator.className = "loading-overlay"
      loadingIndicator.innerHTML =
        '<div class="loading-spinner"></div><div class="loading-text">Deleting partner...</div>'
      document.body.appendChild(loadingIndicator)

      db.collection("partners")
        .doc(partnerId)
        .delete()
        .then(() => {
          // Remove loading indicator
          loadingIndicator.remove()
          showToast("Partner deleted successfully!", "success")
          loadPartners() // Refresh the partners list
          loadDashboardData() // Refresh the dashboard
        })
        .catch((error) => {
          // Remove loading indicator
          loadingIndicator.remove()
          console.error("Error deleting partner:", error)
          showToast("Error deleting partner. Please try again.", "error")
        })
    }
  }

  // Function to load partners on the partners page
  function loadPartners() {
    const partnersGrid = document.getElementById("partners-grid")

    if (!partnersGrid) return

    // Show loading indicator
    partnersGrid.innerHTML = '<div class="loading-partners">Loading partners...</div>'

    // Load approved partners
    db.collection("partners")
      .where("status", "==", "approved")
      .get()
      .then((querySnapshot) => {
        // Clear loading indicator
        partnersGrid.innerHTML = ""

        if (querySnapshot.empty) {
          partnersGrid.innerHTML = "<p class='no-partners'>No partner studios available at the moment.</p>"
          return
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const partnerCard = document.createElement("div")
          partnerCard.className = "partner-card"

          // Default logo if none provided
          const logoUrl = data.logoUrl || "/placeholder.svg"

          // Format specialties
          const formattedSpecialties = formatSpecialties(data.specialties || [])

          // Create partner card with front and back
          partnerCard.innerHTML = `
            <div class="partner-card-inner">
              <div class="partner-card-front">
                <div class="partner-logo">
                  <img src="${logoUrl}" alt="${data.studioName}">
                </div>
                <h3>${data.studioName}</h3>
                <ul class="specialties-list">
                  ${formattedSpecialties.length > 0
                    ? formattedSpecialties.map((specialty) => `<li><span class="checkmark">✔</span> ${specialty}</li>`).join("")
                    : "<li>No specialties listed</li>"}
                </ul>
                <button class="view-details-btn">View Details</button>
              </div>
              <div class="partner-card-back">
                <h3>${data.studioName}</h3>
                <p><strong>Contact Person:</strong> ${data.contactPerson || "N/A"}</p>
                <p><strong>Email:</strong> ${data.email || "N/A"}</p>
                <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
                <p><strong>Website:</strong> <a href="${data.website || '#'}" target="_blank">${data.website || "N/A"}</a></p>
                <p><strong>Description:</strong> ${data.description || "No description provided."}</p>
                <p><strong>Services Completed:</strong> ${data.servicesCompleted || 0}</p>
                <button class="close-details-btn">Close</button>
              </div>
            </div>
          `;

          // Add click event to flip the card
          const viewDetailsBtn = partnerCard.querySelector(".view-details-btn");
          const closeDetailsBtn = partnerCard.querySelector(".close-details-btn");

          viewDetailsBtn.addEventListener("click", () => {
            partnerCard.classList.add("flipped");
          });

          closeDetailsBtn.addEventListener("click", () => {
            partnerCard.classList.remove("flipped");
          });

          partnersGrid.appendChild(partnerCard);
        });
      })
      .catch((error) => {
        console.error("Error loading partners:", error)
        partnersGrid.innerHTML = "<p class='error-message'>Error loading partners. Please refresh the page.</p>"
      })
  }

  // Call loadPartners when the page loads
  loadPartners()

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
  const revealElements = document.querySelectorAll(".reveal")

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add("active")
      }
    })
  }

  // Add scroll event listener once
  window.addEventListener("scroll", revealOnScroll)
  revealOnScroll() // Initial check

  // Tab Functionality
  const tabLinks = document.querySelectorAll(".tab-link")
  const tabPanes = document.querySelectorAll(".tab-pane")

  function switchTab(e) {
    e.preventDefault()

    // Remove active class from all tabs
    tabLinks.forEach((link) => link.classList.remove("active"))
    tabPanes.forEach((pane) => pane.classList.remove("active"))

    // Add active class to clicked tab
    const targetTab = e.target.getAttribute("data-tab")
    e.target.classList.add("active")
    document.getElementById(targetTab).classList.add("active")

    // Trigger reveal animations for newly visible content
    revealOnScroll()

    // Load partners when switching to partners tab
    if (targetTab === "partners") {
      loadPartners()
    }
  }

  // Add click handlers to tabs
  tabLinks.forEach((link) => {
    link.addEventListener("click", switchTab)
  })

  // Image slideshow functionality for service items
  function setupServiceImageTransitions() {
    document.querySelectorAll(".service-item").forEach((item) => {
      const images = item.querySelectorAll("img")
      let currentImageIndex = 0

      item.addEventListener("mouseenter", () => {
        // Show first image immediately
        images[0].style.opacity = 1

        const interval = setInterval(() => {
          // Hide all images
          images.forEach((img) => (img.style.opacity = 0))

          // Move to next image
          currentImageIndex = (currentImageIndex + 1) % images.length

          // Show next image
          images[currentImageIndex].style.opacity = 1
        }, 1000) // Change to 1 second

        item.addEventListener(
          "mouseleave",
          () => {
            clearInterval(interval)
            images.forEach((img) => (img.style.opacity = 0))
            currentImageIndex = 0
          },
          { once: true },
        )
      })
    })
  }

  setupServiceImageTransitions()

  // Admin functionality
  const adminLoginBtn = document.getElementById("adminLoginBtn")
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Hide all tab panes
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("active")
      })

      // Remove active class from all tab links
      document.querySelectorAll(".tab-link").forEach((link) => {
        link.classList.remove("active")
      })

      // Show admin pane
      const adminPane = document.getElementById("admin")
      if (adminPane) {
        adminPane.classList.add("active")
      }
    })
  }

  // Update the admin login form handler
  const adminLoginForm = document.getElementById("adminLoginForm")
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const username = document.getElementById("adminUsername").value
      const password = document.getElementById("adminPassword").value
      const errorMsg = document.getElementById("adminError")

      if (username === "admin" && password === "admin123") {
        // Replace login form with dashboard
        const adminSection = document.querySelector(".admin-section")
        if (adminSection) {
          adminSection.innerHTML = `
          <div class="admin-dashboard">
            <div class="dashboard-header">
              <h2>Admin Dashboard</h2>
              <button id="logoutBtn" class="logout-btn">Logout</button>
            </div>
            <div class="dashboard-content">
              <h3>Referral Requests</h3>
              <div class="table-container">
                <table id="referralRequestsTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Service Type</th>
                      <th>Budget</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
              
              <h3>Partner Applications</h3>
              <button id="addPartnerBtn" class="add-partner-btn">Add New Partner</button>
              <div class="table-container">
                <table id="partnerApplicationsTable">
                  <thead>
                    <tr>
                      <th>Studio Name</th>
                      <th>Contact Person</th>
                      <th>Email</th>
                      <th>Specialties</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
              
              <h3>Active Partners</h3>
              <div class="table-container">
                <table id="activePartnersTable">
                  <thead>
                    <tr>
                      <th>Studio Name</th>
                      <th>Contact Person</th>
                      <th>Email</th>
                      <th>Specialties</th>
                      <th>Services Completed</th>
                      <th>Actions</th>
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        `

          // Add logout functionality
          const logoutBtn = document.getElementById("logoutBtn")
          if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
              location.reload()
            })
          }

          // Add event listener for "Add New Partner" button
          const addPartnerBtn = document.getElementById("addPartnerBtn")
          if (addPartnerBtn) {
            addPartnerBtn.addEventListener("click", () => {
              openAddPartnerModal()
            })
          }

          // Load dashboard data
          loadDashboardDataRealtime()
        }
      } else {
        if (errorMsg) {
          errorMsg.textContent = "Invalid username or password"
          errorMsg.style.display = "block"
        }
      }
    })
  }

  // Function to delete a document from Firestore
  const deleteDocument = (collection, docId, row) => {
    if (confirm("Are you sure you want to delete this item?")) {
      // Show loading indicator
      const loadingIndicator = document.createElement("div")
      loadingIndicator.className = "loading-overlay"
      loadingIndicator.innerHTML = '<div class="loading-spinner"></div><div class="loading-text">Deleting item...</div>'
      document.body.appendChild(loadingIndicator)

      db.collection(collection)
        .doc(docId)
        .delete()
        .then(() => {
          // Remove loading indicator
          loadingIndicator.remove()
          // Remove the row from the table
          row.remove()
          showToast("Item deleted successfully!", "success")
        })
        .catch((error) => {
          // Remove loading indicator
          loadingIndicator.remove()
          console.error("Error removing document: ", error)
          showToast("Error deleting item. Please try again.", "error")
        })
    }
  }

  // Function to update referral status
  const updateReferralStatus = (docId, newStatus, statusCell) => {
    // Show loading indicator
    const loadingIndicator = document.createElement("div")
    loadingIndicator.className = "loading-overlay"
    loadingIndicator.innerHTML = '<div class="loading-spinner"></div><div class="loading-text">Updating status...</div>'
    document.body.appendChild(loadingIndicator)

    db.collection("referralRequests")
      .doc(docId)
      .update({
        status: newStatus,
      })
      .then(() => {
        // Remove loading indicator
        loadingIndicator.remove()
        statusCell.textContent = newStatus
        showToast(`Referral status updated to: ${newStatus}`, "success")
      })
      .catch((error) => {
        // Remove loading indicator
        loadingIndicator.remove()
        console.error("Error updating status: ", error)
        showToast("Error updating status. Please try again.", "error")
      })
  }

  // Function to update partner application status
  const updatePartnerStatus = (docId, newStatus, statusCell) => {
    // Show loading indicator
    const loadingIndicator = document.createElement("div")
    loadingIndicator.className = "loading-overlay"
    loadingIndicator.innerHTML = '<div class="loading-spinner"></div><div class="loading-text">Updating status...</div>'
    document.body.appendChild(loadingIndicator)

    db.collection("partnerApplications")
      .doc(docId)
      .update({
        status: newStatus,
      })
      .then(() => {
        // Remove loading indicator
        loadingIndicator.remove()
        statusCell.textContent = newStatus
        showToast(`Partner application status updated to: ${newStatus}`, "success")
      })
      .catch((error) => {
        // Remove loading indicator
        loadingIndicator.remove()
        console.error("Error updating status: ", error)
        showToast("Error updating status. Please try again.", "error")
      })
  }

  // Function to load dashboard data from Firestore in real-time
  function loadDashboardDataRealtime() {
    // Load referral requests
    db.collection("referralRequests")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        const referralRequestsTable = document.getElementById("referralRequestsTable").querySelector("tbody");
        referralRequestsTable.innerHTML = ""; // Clear existing rows
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : "N/A";

          const row = referralRequestsTable.insertRow();
          row.innerHTML = `
            <td>${data.name || "N/A"}</td>
            <td>${data.email || "N/A"}</td>
            <td>${data.serviceType || "N/A"}</td>
            <td>${data.budget || "N/A"}</td>
            <td>${date}</td>
            <td class="status-cell">${data.status || "new"}</td>
            <td>
              <select class="status-select">
                <option value="new" ${data.status === "new" ? "selected" : ""}>New</option>
                <option value="in-progress" ${data.status === "in-progress" ? "selected" : ""}>In Progress</option>
                <option value="referred" ${data.status === "referred" ? "selected" : ""}>Referred</option>
                <option value="completed" ${data.status === "completed" ? "selected" : ""}>Completed</option>
              </select>
              <button class="update-btn">Update</button>
              <button class="delete-btn" data-id="${doc.id}" data-collection="referralRequests">Delete</button>
            </td>
          `;

          // Add event listeners for update and delete buttons
          const updateBtn = row.querySelector(".update-btn");
          const statusSelect = row.querySelector(".status-select");
          const statusCell = row.querySelector(".status-cell");
          updateBtn.addEventListener("click", () => {
            const newStatus = statusSelect.value;
            updateReferralStatus(doc.id, newStatus, statusCell);
          });

          const deleteBtn = row.querySelector(".delete-btn");
          deleteBtn.addEventListener("click", () => {
            deleteDocument("referralRequests", doc.id, row);
          });
        });
      });

    // Load partner applications
    db.collection("partnerApplications")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        const partnerApplicationsTable = document.getElementById("partnerApplicationsTable").querySelector("tbody");
        partnerApplicationsTable.innerHTML = ""; // Clear existing rows
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : "N/A";

          const row = partnerApplicationsTable.insertRow();
          row.innerHTML = `
            <td>${data.studioName || "N/A"}</td>
            <td>${data.contactPerson || "N/A"}</td>
            <td>${data.email || "N/A"}</td>
            <td>${(data.specialties || []).join(", ") || "N/A"}</td>
            <td>${date}</td>
            <td class="status-cell">${data.status || "pending"}</td>
            <td>
              <button class="approve-btn" data-id="${doc.id}">Approve</button>
              <button class="reject-btn" data-id="${doc.id}">Reject</button>
            </td>
          `;

          // Add event listeners for approve and reject buttons
          const approveBtn = row.querySelector(".approve-btn");
          const rejectBtn = row.querySelector(".reject-btn");
          approveBtn.addEventListener("click", () => approvePartnerApplication(doc.id));
          rejectBtn.addEventListener("click", () => rejectPartnerApplication(doc.id));
        });
      });

    // Load active partners
    db.collection("partners")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        const activePartnersTable = document.getElementById("activePartnersTable").querySelector("tbody");
        activePartnersTable.innerHTML = ""; // Clear existing rows
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const row = activePartnersTable.insertRow();
          row.innerHTML = `
            <td>${data.studioName || "N/A"}</td>
            <td>${data.contactPerson || "N/A"}</td>
            <td>${data.email || "N/A"}</td>
            <td>${(data.specialties || []).join(", ") || "N/A"}</td>
            <td>${data.servicesCompleted || 0}</td>
            <td>
              <button class="edit-btn" data-id="${doc.id}">Edit</button>
              <button class="delete-btn" data-id="${doc.id}" data-collection="partners">Delete</button>
            </td>
          `;

          // Add event listeners for edit and delete buttons
          const editBtn = row.querySelector(".edit-btn");
          const deleteBtn = row.querySelector(".delete-btn");
          editBtn.addEventListener("click", () => openPartnerEditModal(doc.id));
          deleteBtn.addEventListener("click", () => deleteDocument("partners", doc.id, row));
        });
      });

    // Load contact messages
    db.collection("contactMessages")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        const contactMessagesTable = document.getElementById("contactMessagesTable").querySelector("tbody");
        contactMessagesTable.innerHTML = ""; // Clear existing rows
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : "N/A";

          const row = contactMessagesTable.insertRow();
          row.innerHTML = `
            <td>${data.name || "N/A"}</td>
            <td>${data.email || "N/A"}</td>
            <td>${data.message || "N/A"}</td>
            <td>${date}</td>
            <td>
              <button class="delete-btn" data-id="${doc.id}" data-collection="contactMessages">Delete</button>
            </td>
          `;

          // Add event listener for delete button
          const deleteBtn = row.querySelector(".delete-btn");
          deleteBtn.addEventListener("click", () => deleteDocument("contactMessages", doc.id, row));
        });
      });
  }

  // Ensure `loadDashboardData` is called after the admin dashboard is rendered
  document.addEventListener("DOMContentLoaded", () => {
    const adminDashboard = document.querySelector(".admin-dashboard");
    if (adminDashboard) {
      loadDashboardDataRealtime();
    }
  });

  // Add styles for Facebook-style image editor and loading indicators
  const additionalStyles = document.createElement("style")
  additionalStyles.textContent = `
  /* Facebook-style image editor */
  .logo-preview {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px dashed #ccc;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .logo-preview.has-image {
    border: none;
  }
  
  .fb-image-viewport {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
  }
  
  .fb-image-container {
    position: absolute;
    top: 0;
    left: 0;
    cursor: move;
    transform-origin: center;
  }
  
  .fb-editor-image {
    display: block;
    max-width: none;
    max-height: none;
  }
  
  /* Image editor modal */
  .image-editor-modal .modal-content {
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .image-editor-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .image-editor-preview {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    position: relative;
  }
  
  .image-editor-preview .fb-image-viewport {
    width: 100%;
    height: 100%;
  }
  
  .image-editor-controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .editor-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  
  .editor-save-btn, .editor-cancel-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .editor-save-btn {
    background-color: #4caf50;
    color: white;
  }
  
  .editor-cancel-btn {
    background-color: #f44336;
    color: white;
  }
  
  /* Image buttons */
  .image-buttons {
    position: absolute;
    bottom: -40px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .edit-image-btn, .remove-image-btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .edit-image-btn {
    background-color: #2196f3;
    color: white;
  }
  
  .remove-image-btn {
    background-color: #f44336;
    color: white;
  }
  
  .fb-zoom-control {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .fb-zoom-slider {
    flex: 1;
    height: 5px;
  }
  
  .fb-zoom-btn {
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 50%;
    font-weight: bold;
  }
  
  /* Loading indicators */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .loading-text {
    color: white;
    margin-top: 15px;
    font-size: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .preview-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 12px;
    color: #666;
  }
  
  .loading-partners {
    text-align: center;
    padding: 30px;
    color: #666;
  }
  
  /* Toast notifications */
  .toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .toast {
    min-width: 250px;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: white;
    font-size: 14px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }
  
  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .toast-success {
    background-color: #4caf50;
  }
  
  .toast-error {
    background-color: #f44336;
  }
  
  .toast-info {
    background-color: #2196f3;
  }
  
  .toast-warning {
    background-color: #ff9800;
  }
  
  /* Upload progress */
  .upload-progress-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .upload-progress-container {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 400px;
  }
  
  .upload-progress-text {
    margin-bottom: 10px;
    font-size: 16px;
    text-align: center;
  }
  
  .upload-progress-bar-container {
    height: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 5px;
  }
  
  .upload-progress-bar {
    height: 100%;
    background-color: #4caf50;
    width: 0%;
    transition: width 0.3s ease;
  }
  
  .upload-progress-percentage {
    text-align: center;
    font-size: 14px;
    color: #666;
  }
  `
  document.head.appendChild(additionalStyles)

  // Update the styles for the admin section
  const styleSheet = document.createElement("style")
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
  
  /* Status select and update button */
  .status-select {
      padding: 6px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 5px;
  }
  
  .update-btn {
      padding: 6px 12px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
  }
  
  .update-btn:hover {
      background-color: #45a049;
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
  
  /* Delete button */
  .delete-btn {
      padding: 6px 12px;
      background-color: #ff3860;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
  }
  
  .delete-btn:hover {
      background-color: #ff1443;
  }
  
  /* Fix for service form inputs */
  #serviceForm input,
  #serviceForm textarea,
  #contactForm input,
  #contactForm textarea,
  #partnerForm input,
  #partnerForm textarea {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
  }
  
  .modal-content {
      width: 80%;
      max-width: 600px;
      box-sizing: border-box;
  }
`
  document.head.appendChild(styleSheet)

  // Add this to your existing script.js
  function checkAnimation() {
    const elements = document.querySelectorAll(
      ".about, .why-choose, .features, .benefits, .name-meaning, .lost-meaning, .how-it-works, .partners",
    )

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementBottom = element.getBoundingClientRect().bottom
      const windowHeight = window.innerHeight

      // More precise viewport checking
      const isInViewport =
        elementTop < windowHeight * 0.85 && // Trigger slightly earlier
        elementBottom > windowHeight * 0.15 // Keep animation when element is still partially visible

      if (isInViewport) {
        element.classList.add("animate")
      }
    })
  }

  // Enhanced throttle function with immediate first execution
  function throttle(func, limit) {
    let lastFunc
    let lastRan
    return function () {
      const args = arguments
      if (!lastRan) {
        func.apply(this, args)
        lastRan = Date.now()
      } else {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(
          () => {
            if (Date.now() - lastRan >= limit) {
              func.apply(this, args)
              lastRan = Date.now()
            }
          },
          limit - (Date.now() - lastRan),
        )
      }
    }
  }

  // Multiple event listeners for more reliable animation triggering
  function initAnimationChecks() {
    // Initial check
    checkAnimation()

    // Check after small delay
    setTimeout(checkAnimation, 100)

    // Check after content likely loaded
    setTimeout(checkAnimation, 500)

    // Final check after all resources loaded
    setTimeout(checkAnimation, 1000)
  }

  // Add multiple scroll event listeners with different throttle times
  window.addEventListener("scroll", throttle(checkAnimation, 100)) // Quick checks
  window.addEventListener("scroll", throttle(checkAnimation, 500)) // Backup checks

  // Add multiple load event listeners
  window.addEventListener("load", initAnimationChecks)
  window.addEventListener("DOMContentLoaded", initAnimationChecks)

  // Check on resize events
  window.addEventListener("resize", throttle(checkAnimation, 100))

  // Intersection Observer as backup
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
      }
    })
  }, observerOptions)

  // Observe all animatable elements
  document
    .querySelectorAll(
      ".about, .why-choose, .features, .benefits, .name-meaning, .lost-meaning, .how-it-works, .partners",
    )
    .forEach((element) => observer.observe(element))
})

function formatSpecialties(specialties) {
  const formattedSpecialties = specialties.map((specialty) => {
    if (specialty === "wedding") return "Wedding Photography";
    if (specialty === "wedding-video") return "Wedding Videography";
    if (specialty === "event") return "Event Photography";
    if (specialty === "event-video") return "Event Videography";
    if (specialty === "birthday") return "Birthday Photography";
    if (specialty === "birthday-video") return "Birthday Videography";
    return specialty;
  });

  // Combine Wedding Photography & Videography
  if (
    formattedSpecialties.includes("Wedding Photography") &&
    formattedSpecialties.includes("Wedding Videography")
  ) {
    const indexPhoto = formattedSpecialties.indexOf("Wedding Photography");
    const indexVideo = formattedSpecialties.indexOf("Wedding Videography");
    formattedSpecialties.splice(indexPhoto, 1);
    formattedSpecialties.splice(indexVideo - 1, 1);
    formattedSpecialties.push("Wedding Photography & Videography");
  }

  // Combine Event Photography & Videography
  if (
    formattedSpecialties.includes("Event Photography") &&
    formattedSpecialties.includes("Event Videography")
  ) {
    const indexPhoto = formattedSpecialties.indexOf("Event Photography");
    const indexVideo = formattedSpecialties.indexOf("Event Videography");
    formattedSpecialties.splice(indexPhoto, 1);
    formattedSpecialties.splice(indexVideo - 1, 1);
    formattedSpecialties.push("Event Photography & Videography");
  }

  if (
    formattedSpecialties.includes("Birthday Photography") &&
    formattedSpecialties.includes("Birthday Videography")
  ) {
    const indexPhoto = formattedSpecialties.indexOf("Birthday Photography");
    const indexVideo = formattedSpecialties.indexOf("Birthday Videography");
    formattedSpecialties.splice(indexPhoto, 1);
    formattedSpecialties.splice(indexVideo - 1, 1);
    formattedSpecialties.push("Birthday Photography & Videography");
  }

  return formattedSpecialties;
}

function deleteApplicationRow(applicationId) {
  const row = document.querySelector(`[data-id="${applicationId}"]`);
  if (row) row.remove();
}

function approvePartnerApplication(applicationId) {
  // Show loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "loading-overlay";
  loadingIndicator.innerHTML =
    '<div class="loading-spinner"></div><div class="loading-text">Approving application...</div>';
  document.body.appendChild(loadingIndicator);

  // Get the application data
  db.collection("partnerApplications")
    .doc(applicationId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        // Create a new partner document
        return db.collection("partners").add({
          ...data,
          status: "approved",
          approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        throw new Error("Application not found");
      }
    })
    .then(() => {
      // Delete the application document
      return db.collection("partnerApplications").doc(applicationId).delete();
    })
    .then(() => {
      deleteApplicationRow(applicationId); // Remove the application row
      showToast("Partner application approved successfully!", "success");
      loadDashboardData(); // Refresh the dashboard
      loadPartners(); // Refresh the partners list
    })
    .catch((error) => {
      console.error("Error approving application:", error);
      showToast("Error approving application. Please try again.", "error");
    })
    .finally(() => {
      // Remove loading indicator
      loadingIndicator.remove();
    });
}

function rejectPartnerApplication(applicationId) {
  // Show loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "loading-overlay";
  loadingIndicator.innerHTML =
    '<div class="loading-spinner"></div><div class="loading-text">Rejecting application...</div>';
  document.body.appendChild(loadingIndicator);

  // Approve the application temporarily to trigger row removal
  db.collection("partnerApplications")
    .doc(applicationId)
    .update({
      status: "approved",
      approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      deleteApplicationRow(applicationId); // Remove the application row
      return db.collection("partnerApplications").doc(applicationId).delete(); // Delete the document
    })
    .then(() => {
      showToast("Partner application rejected and removed.", "info");
      loadDashboardData(); // Refresh the admin dashboard in real-time
    })
    .catch((error) => {
      console.error("Error rejecting application:", error);
      showToast("Error rejecting application. Please try again.", "error");
    })
    .finally(() => {
      // Remove loading indicator
      loadingIndicator.remove();
    });
}

