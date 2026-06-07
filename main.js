/**
 * Omega Skin & Laser Clinic - Interaction & Scroll Animations
 * Dr. Rajni Goyal Khare
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Hamburger Toggle
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Toggle body scroll to prevent background scrolling when menu is open
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Sticky Header Class on Scroll
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 3. IntersectionObserver for Reveal-on-Scroll Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once animated, we don't need to observe it anymore
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // viewport
            threshold: 0.15, // trigger when 15% of element is visible
            rootMargin: '0px 0px -50px 0px' // slightly offset trigger point
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // 4. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const faqAnswer = btn.nextElementSibling;
            
            // Close other active FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            
            // Toggle current FAQ item
            faqItem.classList.toggle('active');
            
            if (faqItem.classList.contains('active')) {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            } else {
                faqAnswer.style.maxHeight = null;
            }
        });
    });

    // 5. Booking Form Submission & Validation
    const bookingForm = document.getElementById('appointment-form');
    const modalOverlay = document.getElementById('success-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalWhatsAppBtn = document.getElementById('modal-whatsapp-btn');
    
    // Storing form data briefly to build a direct WhatsApp link on success
    let lastSubmission = {
        name: '',
        phone: '',
        service: '',
        date: '',
        time: ''
    };

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation flag
            let isValid = true;
            
            const nameInput = document.getElementById('booking-name');
            const phoneInput = document.getElementById('booking-phone');
            const serviceInput = document.getElementById('booking-service');
            const dateInput = document.getElementById('booking-date');
            const timeInput = document.getElementById('booking-time');
            
            // Quick resets
            [nameInput, phoneInput, serviceInput, dateInput, timeInput].forEach(input => {
                if (input) input.style.borderColor = '';
            });

            // Validate Name
            if (!nameInput.value.trim()) {
                nameInput.style.borderColor = '#dc2626';
                isValid = false;
            }

            // Validate Phone (simple 10 digit check for India)
            const phoneRegex = /^[6-9]\d{9}$/;
            const phoneVal = phoneInput.value.replace(/\s+/g, '').replace(/^\+91/, '');
            if (!phoneRegex.test(phoneVal)) {
                phoneInput.style.borderColor = '#dc2626';
                isValid = false;
            }

            // Validate Service select
            if (!serviceInput.value) {
                serviceInput.style.borderColor = '#dc2626';
                isValid = false;
            }

            // Validate Date
            if (!dateInput.value) {
                dateInput.style.borderColor = '#dc2626';
                isValid = false;
            }

            // Validate Time
            if (!timeInput.value) {
                timeInput.style.borderColor = '#dc2626';
                isValid = false;
            }

            if (isValid) {
                // Save submission data
                lastSubmission = {
                    name: nameInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    service: serviceInput.options[serviceInput.selectedIndex].text,
                    date: dateInput.value,
                    time: timeInput.value
                };
                
                // Show custom modal
                if (modalOverlay) {
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                
                // Reset form
                bookingForm.reset();
            }
        });
    }

    // Modal Action: Close
    if (modalCloseBtn && modalOverlay) {
        modalCloseBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close modal when clicking overlay background
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Modal Action: Quick confirm on WhatsApp
    if (modalWhatsAppBtn) {
        modalWhatsAppBtn.addEventListener('click', () => {
            // Build pre-filled message text
            const whatsappText = `Hello Dr. Rajni Goyal Khare, I've booked an appointment via your website.\n\n` +
                `*Name:* ${lastSubmission.name}\n` +
                `*Phone:* ${lastSubmission.phone}\n` +
                `*Service:* ${lastSubmission.service}\n` +
                `*Date:* ${lastSubmission.date}\n` +
                `*Time:* ${lastSubmission.time}\n\n` +
                `Please confirm my slot. Thank you!`;
            
            const encodedText = encodeURIComponent(whatsappText);
            const whatsappUrl = `https://wa.me/918607040000?text=${encodedText}`;
            
            // Redirect
            window.open(whatsappUrl, '_blank');
            
            // Close modal
            if (modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Set minimum date to today for booking
    const datePicker = document.getElementById('booking-date');
    if (datePicker) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0
        let dd = today.getDate();
        
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        
        const formattedToday = yyyy + '-' + mm + '-' + dd;
        datePicker.setAttribute('min', formattedToday);
    }
});
