// Loader functionality
const handleLoader = () => {
    const hasSeenLoader = localStorage.getItem('hasSeenLoader');
    
    const removeLoader = () => {
        const loader = document.querySelector('.page-loader');
        if (!loader) return;

        if (hasSeenLoader) {
            // Immediately hide loader if user has seen it before
            loader.style.display = 'none';
            document.body.classList.remove('loading');
        } else {
            const loaderLogo = document.querySelector('.loader-logo');
            const loaderBar = document.querySelector('.loader-bar');

            // Show full loader animation for first visit
            setTimeout(() => {
                // Transform LOST into Lens Obra Studio
                if (loaderLogo) loaderLogo.classList.add('transform');
                if (loaderBar) loaderBar.classList.add('fade-out');

                // Final transition: Fade out loader
                setTimeout(() => {
                    document.body.classList.remove('loading');
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        // Set flag after first loader animation
                        localStorage.setItem('hasSeenLoader', 'true');
                    }, 800);
                }, 1500);
            }, 2000);
        }
    };

    // Remove loader based on whether user has seen it before
    if (document.readyState === 'complete') {
        removeLoader();
    } else {
        window.addEventListener('load', removeLoader);
    }
};

// Initialize loader
document.addEventListener('DOMContentLoaded', handleLoader);

// Prevent loader on internal navigation
const links = document.querySelectorAll('a[href^="index.html"], a[href^="services.html"], a[href^="contact.html"]');
links.forEach(link => {
    link.addEventListener('click', () => {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
        document.body.classList.remove('loading');
    });
}); 