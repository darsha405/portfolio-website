/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC (JavaScript)
   Owner: Darshan Antaravalli
   Description: Controls typing effect, theme toggle, modals, filtering, and scroll reveal.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Configuration
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateThemeIcon('light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeIcon('dark-theme');
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'light-theme') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // 1.5 Cinematic Custom Cursor Animation
    const cursorDot = document.getElementById('cursor-dot');
    const cursorFollower = document.getElementById('cursor-follower');
    
    if (cursorDot && cursorFollower) {
        // Enable custom cursor behavior by adding the styling class
        document.body.classList.add('custom-cursor-enabled');
        
        let mouseX = 0, mouseY = 0;       // target coordinates
        let dotX = 0, dotY = 0;           // current coordinates of dot
        let folX = 0, folY = 0;           // current coordinates of follower
        
        let currentDotScale = 0, currentFolScale = 0;
        let isHovered = false;
        let isClicked = false;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.classList.add('active');
            cursorFollower.classList.add('active');
        });
        
        document.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('active');
            cursorFollower.classList.remove('active');
        });
        
        document.addEventListener('mousedown', () => { isClicked = true; });
        document.addEventListener('mouseup', () => { isClicked = false; });
        
        // Delegate hover checking to document level for performance & dynamic elements
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, .social-icon, .viewable-cert, .filter-btn, .project-card, .terminal-body, .theme-toggle, .btn');
            isHovered = !!target;
        });
        
        function animateCursor() {
            // Apply fluid inertia (lerp physics)
            // Dot: very fast, Follower: medium trailing lag
            dotX += (mouseX - dotX) * 0.35;
            dotY += (mouseY - dotY) * 0.35;
            
            folX += (mouseX - folX) * 0.12;
            folY += (mouseY - folY) * 0.12;
            
            // Set target scales based on interaction states
            let targetDotScale = 1;
            let targetFolScale = 1;
            
            if (isClicked) {
                targetDotScale = 0.5;
                targetFolScale = 1.4;
                cursorDot.classList.add('clicked');
                cursorFollower.classList.add('clicked');
            } else {
                cursorDot.classList.remove('clicked');
                cursorFollower.classList.remove('clicked');
                
                if (isHovered) {
                    targetDotScale = 0.7;
                    targetFolScale = 1.5;
                    cursorDot.classList.add('hovered');
                    cursorFollower.classList.add('hovered');
                } else {
                    cursorDot.classList.remove('hovered');
                    cursorFollower.classList.remove('hovered');
                }
            }
            
            // Smoothly interpolate the scale transitions
            currentDotScale += (targetDotScale - currentDotScale) * 0.2;
            currentFolScale += (targetFolScale - currentFolScale) * 0.2;
            
            // Render translations and scales using GPU composite layer
            cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate3d(-50%, -50%, 0) scale(${currentDotScale})`;
            cursorFollower.style.transform = `translate3d(${folX}px, ${folY}px, 0) translate3d(-50%, -50%, 0) scale(${currentFolScale})`;
            
            requestAnimationFrame(animateCursor);
        }
        
        requestAnimationFrame(animateCursor);
    }

    // 2. Mobile Nav Menu Toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');

    mobileNavToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            hamburgerIcon.className = 'fa-solid fa-xmark';
        } else {
            hamburgerIcon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerIcon.className = 'fa-solid fa-bars';
        });
    });

    // 3. Typewriter Effect Logic
    const typewriterElement = document.getElementById('typewriter-text');
    const words = ["Java Full Stack Developer", "Android App Developer", "Computer Science Graduate"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50; // Faster deleting speed
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150; // Typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeDelay = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typeDelay);
    }
    
    // Start typing
    if (typewriterElement) {
        setTimeout(typeEffect, 1000);
    }

    // 4. Header Scroll State, Scroll Spy & Top Progress Bar
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Scroll progress indicator width calculation
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollHeight > 0) {
            const scrolledPercentage = (window.scrollY / scrollHeight) * 100;
            scrollProgress.style.width = scrolledPercentage + '%';
        }

        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav Scroll Spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 5. Scroll Reveal & Skill Bar Animation via Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-delay');
    const skillBars = document.querySelectorAll('.skill-progress');

    // Reveal animation observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Reset skill progress width and animate when scrolled into view
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = targetWidth;
                }, 100);
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    skillBars.forEach(bar => skillsObserver.observe(bar));

    // 6. Project Category Filter Handler
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });

    // 7. Project Details Modal Logic
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');

    // Projects Details Database
    const projectDetails = {
        roamly: {
            title: "ROAMLY — AI Powered Travel Explorer",
            subtitle: "Web Application (2026)",
            liveUrl: "https://shorturl.at/1utbo",
            codeLink: "https://github.com/darsha405",
            techStack: ["React.js", "Vite", "JavaScript", "HTML5", "CSS3", "Gemini 3.6 Flash AI", "Lucide React", "Glassmorphism UI", "Web APIs"],
            description: "ROAMLY is an interactive travel exploration and trip planning web application designed to help users discover destinations, explore attractions, and create personalized travel itineraries.<br><br>The platform provides an immersive travel experience through destination discovery, category-based exploration, saved locations, and an AI-powered trip planner. Users can select destinations, customize their travel preferences, choose trip types and travel styles, and generate personalized itineraries.<br><br>The application also includes an AI travel assistant to help users with travel-related questions, recommendations, destinations, local attractions, weather information, and trip planning.",
            features: [
                "<strong>Interactive Travel Exploration:</strong> Modern travel discovery interface with attraction browsing and category/experience-based filtering.",
                "<strong>Personalized AI Trip Planner:</strong> Generates dynamic itineraries tailored to custom travel preferences, trip styles, and duration.",
                "<strong>Gemini AI Travel Assistant:</strong> Intelligent AI assistant powered by Google Gemini AI API to provide personalized destination insights and travel assistance.",
                "<strong>Destination Bookmarks & Storage:</strong> Save favorite destinations and places with local browser persistence.",
                "<strong>Itinerary Export Tools:</strong> Instant Copy, Download, and Print itinerary options powered by Web APIs (Clipboard API, Print API, File Download).",
                "<strong>Modern Glassmorphism Design:</strong> Responsive and animated user interface with fluid CSS transitions and Lucide React icons."
            ]
        },
        lms: {
            title: "Library Management System",
            subtitle: "Academic Project (2025)",
            codeLink: "https://github.com/darsha405/library-management-systems",
            techStack: ["HTML", "CSS", "JavaScript"],
            description: "A comprehensive library cataloging and administration platform created to simplify book loans, client records, and inventory auditing.",
            features: [
                "<strong>Robust User Authentication:</strong> Distinct admin and member log-ins with customizable clearance roles.",
                "<strong>JDBC Database Connection:</strong> Implemented direct database persistence to map library transactions safely with relational schemas.",
                "<strong>Issue & Return Workflow:</strong> Automated checkout alerts, return counters, and active book availability tracking.",
                "<strong>Fast Query Lookup:</strong> Implemented search scripts filtering by title, author, or availability status in real-time."
            ]
        },
        kelsa: {
            title: "Namma-Kelsa — Job Portal",
            subtitle: "Internship Project (2026)",
            codeLink: "https://github.com/darsha405/Namma-kelsa",
            techStack: ["Android Studio", "Java", "XML Layouts", "Firebase Auth", "Firebase Database", "MySQL"],
            description: "A dual-dashboard mobile job market matching recruiters and job seekers, optimized for local resource mapping and low data overhead.",
            features: [
                "<strong>Recruiter & Seeker Dashboards:</strong> Dedicated UI workflows based on credential logins (posting job ads vs. browsing & tracking applications).",
                "<strong>Firebase Authentication:</strong> Secure profile logs protecting personal resumes, bio listings, and recruiter company profiles.",
                "<strong>Real-time Synchronisation:</strong> Utilised Firebase Realtime Database to push job posting feeds instantly to active seeker dashboards.",
                "<strong>Search & Filter:</strong> Structured criteria parameters including wage ranges, location filters, and experience benchmarks."
            ]
        }
    };

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectKey = e.currentTarget.getAttribute('data-project');
            const data = projectDetails[projectKey];

            if (data) {
                let techMarkup = data.techStack.map(tech => `<span class="modal-tech-pill">${tech}</span>`).join('');
                let featuresMarkup = data.features.map(feat => `<li>${feat}</li>`).join('');

                let actionsMarkup = '';
                if (data.liveUrl) {
                    actionsMarkup += `
                        <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                        </a>
                    `;
                }
                if (data.codeLink) {
                    actionsMarkup += `
                        <a href="${data.codeLink}" target="_blank" rel="noopener noreferrer" class="btn ${data.liveUrl ? 'btn-secondary' : 'btn-primary'}" style="flex: 1;">
                            <i class="fa-brands fa-github"></i> View Repository
                        </a>
                    `;
                }

                modalBody.innerHTML = `
                    <h3 class="modal-proj-title">${data.title}</h3>
                    <span class="modal-proj-subtitle">${data.subtitle}</span>
                    
                    <h4 class="modal-section-title">Overview</h4>
                    <p class="modal-description">${data.description}</p>
                    
                    <h4 class="modal-section-title">Key Implementations & Features</h4>
                    <ul class="modal-features-list">
                        ${featuresMarkup}
                    </ul>
                    
                    <h4 class="modal-section-title">Tech Stack</h4>
                    <div class="modal-tech-pills">
                        ${techMarkup}
                    </div>
                    
                    <div class="modal-actions" style="margin-top: 30px; display: flex; gap: 12px;">
                        ${actionsMarkup}
                    </div>
                `;

                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 8. Interactive Developer Terminal Mockup Logic
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const terminalBody = document.getElementById('terminal-body');

    // Auto focus terminal input when clicking inside the terminal container
    if (terminalBody && terminalInput) {
        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim();
                const cleanCmd = cmd.toLowerCase();
                
                // Add the typed line to history
                addTerminalLine(`darshan@portfolio:~$ ${cmd}`, 'user-line');
                
                // Process command
                interpretTerminalCommand(cleanCmd);
                
                // Clear input
                terminalInput.value = '';
                
                // Scroll terminal to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }

    function addTerminalLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        terminalHistory.appendChild(line);
    }

    function interpretTerminalCommand(cmd) {
        if (cmd === '') return;

        switch (cmd) {
            case 'help':
                addTerminalLine('Available commands:<br>' +
                               '  - <span class="terminal-highlight">about</span>    : Learn about me<br>' +
                               '  - <span class="terminal-highlight">skills</span>   : View technical skillset details<br>' +
                               '  - <span class="terminal-highlight">projects</span> : List key project details<br>' +
                               '  - <span class="terminal-highlight">contact</span>  : Show direct contact methods<br>' +
                               '  - <span class="terminal-highlight">secret</span>   : Clue to the hidden messages dashboard<br>' +
                               '  - <span class="terminal-highlight">clear</span>    : Reset the screen history');
                break;
            case 'about':
                addTerminalLine('<strong>Darshan Antaravalli</strong> - Java Full Stack Developer & Android App Developer.<br>' +
                               'Computer Science Engineering graduate (2026 Batch). Seeking Trainee Software Engineer roles.');
                break;
            case 'skills':
                addTerminalLine('<strong>Technical Profile:</strong><br>' +
                               '  - Languages : Java (Core/Adv), JavaScript, SQL, HTML5/CSS3, XML<br>' +
                               '  - Backend   : Advanced Java, JDBC, Servlets<br>' +
                               '  - Frontend  : Responsive UI Design, Android Studio XML Layouts<br>' +
                               '  - Databases : MySQL, Firebase (Realtime & Auth)<br>' +
                               '  - Tools     : Git, GitHub, VS Code');
                break;
            case 'projects':
                addTerminalLine('<strong>Key Projects:</strong><br>' +
                               '  1. <strong>Roamly Travel Explorer</strong> [Web App]<br>' +
                               '     Interactive Maps + Weather API + AI Assistant. Live 3D Atlas & Trip Planner.<br>' +
                               '  2. <strong>Library Management System</strong> [Web App]<br>' +
                               '     JDBC + MySQL + Java. Secure book checkouts & role clearances.<br>' +
                               '  3. <strong>Namma-Kelsa Job Portal</strong> [Android App]<br>' +
                               '     Firebase + Java. Recruiter postings & real-time syncing.');
                break;
            case 'contact':
                addTerminalLine('<strong>Contact Inquiries:</strong><br>' +
                               '  - Email: <a href="mailto:darshannayak580@gmail.com" style="color: var(--accent-primary);">darshannayak580@gmail.com</a><br>' +
                               '  - Phone: +91 8431631896<br>' +
                               '  - Office: Haveri, Karnataka, India');
                break;
            case 'secret':
                addTerminalLine('<em>Hint:</em> Look at the footer brand logo details. Try double-clicking &lt;Darshan.A /&gt; inside the page footer to see contact inquiries.');
                break;
            case 'clear':
                terminalHistory.innerHTML = '';
                break;
            default:
                addTerminalLine(`Command not found: "${cmd}". Type <span class="terminal-highlight">help</span> for help.`, 'error-line');
        }
    }

    // 9. Certificate Lightbox Modal Controller
    const certCards = document.querySelectorAll('.viewable-cert');
    const certModal = document.getElementById('cert-modal');
    const certClose = document.getElementById('cert-modal-close');
    const certBody = document.getElementById('cert-modal-body');

    const certificatesData = {
        tap: {
            title: "Java Full Stack Development",
            org: "Tap Academy, Bengaluru",
            date: "Certified in 2026",
            icon: "fa-mug-hot",
            details: "Comprehensive professional certified training in Java architecture, SQL relational schema setups, JDBC connectivity, Servlets API, CSS styles layouts, and frontend vanilla JavaScript integration."
        },
        mind: {
            title: "Android App Development using Generative AI",
            org: "Mind-Matrix, Bengaluru",
            date: "Certified in 2026",
            icon: "fa-android",
            details: "Native mobile development training using Android Studio, Java layouts structure, SQLite, Firebase cloud authentication, and generative AI prompt engineering templates."
        },
        deloitte: {
            title: "Data Analytics Job Simulation",
            org: "Deloitte (Forage)",
            date: "Issued in 2025",
            icon: "fa-chart-pie",
            details: "Simulated analytics cohort task solving: performing data cleaning algorithms, designing correlation charts, and creating data visualization dashboard summaries."
        }
    };

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const certKey = card.getAttribute('data-cert');
            const data = certificatesData[certKey];

            if (data) {
                certBody.innerHTML = `
                    <div class="cert-visual-frame">
                        <div class="cert-visual-badge">
                            <i class="fa-solid ${data.icon}"></i>
                        </div>
                        <h4 class="cert-visual-title">${data.title}</h4>
                        <span class="cert-visual-subtitle">Certificate of Accomplishment</span>
                        <p class="cert-visual-recipient">Presented to: <strong>Darshan Antaravalli</strong></p>
                        <p class="cert-visual-org">Issuer: ${data.org}</p>
                        <p class="cert-visual-date">${data.date}</p>
                        <div style="margin-top: 24px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; padding: 0 10px;">
                            ${data.details}
                        </div>
                    </div>
                `;

                certModal.classList.add('active');
                certModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeCertModal() {
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    if (certClose) {
        certClose.addEventListener('click', closeCertModal);
    }
    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) closeCertModal();
        });
    }

    // 10. Secret Inbox Messages Dashboard logic
    const adminTrigger = document.getElementById('footer-admin-trigger');
    const adminModal = document.getElementById('admin-modal');
    const adminClose = document.getElementById('admin-modal-close');
    const adminMessagesList = document.getElementById('admin-messages-list');
    const adminClearBtn = document.getElementById('admin-clear-btn');
    const adminDownloadBtn = document.getElementById('admin-download-btn');

    if (adminTrigger) {
        adminTrigger.addEventListener('dblclick', () => {
            renderAdminMessages();
            adminModal.classList.add('active');
            adminModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    function renderAdminMessages() {
        if (!adminMessagesList) return;
        
        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        
        if (messages.length === 0) {
            adminMessagesList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 30px 0;">No messages in inbox.</div>`;
            return;
        }

        // Render card for each inquiry
        adminMessagesList.innerHTML = messages.map((msg, index) => {
            const formattedTime = new Date(msg.timestamp).toLocaleString();
            return `
                <div class="admin-msg-card">
                    <button class="admin-msg-delete" data-index="${index}" title="Delete Message"><i class="fa-solid fa-trash-can"></i></button>
                    <div class="admin-msg-header">
                        <div>
                            <span class="admin-msg-sender">${msg.senderName}</span>
                            <span class="admin-msg-email">&lt;${msg.senderEmail}&gt;</span>
                        </div>
                        <span class="admin-msg-time">${formattedTime}</span>
                    </div>
                    <div class="admin-msg-subject">Subject: ${msg.subject}</div>
                    <div class="admin-msg-text">${msg.message}</div>
                </div>
            `;
        }).join('');

        // Add delete event listeners
        const deleteButtons = adminMessagesList.querySelectorAll('.admin-msg-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.currentTarget.getAttribute('data-index'));
                deleteAdminMessage(targetIdx);
            });
        });
    }

    function deleteAdminMessage(idx) {
        let messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        messages.splice(idx, 1);
        localStorage.setItem('contact_messages', JSON.stringify(messages));
        renderAdminMessages();
    }

    // Clear All local inquiries
    if (adminClearBtn) {
        adminClearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all inquiries from local storage?')) {
                localStorage.removeItem('contact_messages');
                renderAdminMessages();
            }
        });
    }

    // Download Backup JSON
    if (adminDownloadBtn) {
        adminDownloadBtn.addEventListener('click', () => {
            const messages = localStorage.getItem('contact_messages') || '[]';
            const blob = new Blob([messages], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `darshan_portfolio_messages_${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    function closeAdminModal() {
        adminModal.classList.remove('active');
        adminModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    if (adminClose) {
        adminClose.addEventListener('click', closeAdminModal);
    }
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) closeAdminModal();
        });
    }

    // Unified global Esc keypress close helper
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeCertModal();
            closeAdminModal();
        }
    });

    // 11. Contact Form State Controller & Web3Forms AJAX submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitSpinner = submitBtn.querySelector('.submit-spinner');
    const formAlert = document.getElementById('form-alert');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitText.textContent = "Sending...";
        submitSpinner.classList.remove('hidden');
        formAlert.classList.add('hidden');

        const accessKeyEl = document.getElementById('web3forms-access-key');
        const accessKeyVal = accessKeyEl ? accessKeyEl.value.trim() : 'YOUR_ACCESS_KEY_HERE';

        if (accessKeyVal === 'YOUR_ACCESS_KEY_HERE' || accessKeyVal === '') {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitText.textContent = "Send Message";
                submitSpinner.classList.add('hidden');
                formAlert.textContent = "Configuration Required: Please replace 'YOUR_ACCESS_KEY_HERE' with your Web3Forms Access Key in index.html.";
                formAlert.className = 'form-alert error';
                formAlert.classList.remove('hidden');
            }, 800);
            return;
        }

        const nameVal = document.getElementById('form-name').value;
        const emailVal = document.getElementById('form-email').value;
        const subjectVal = document.getElementById('form-subject').value;
        const messageVal = document.getElementById('form-message').value;

        const messagePayload = {
            access_key: accessKeyVal,
            from_name: "PORTFOLIO",
            name: nameVal,
            email: emailVal,
            subject: `[PORTFOLIO] ${subjectVal}`,
            message: messageVal
        };

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(messagePayload)
        })
        .then(async (response) => {
            const result = await response.json();
            if (response.status === 200 || result.success) {
                // Save locally to local messages list backup
                const backupPayload = {
                    senderName: nameVal,
                    senderEmail: emailVal,
                    subject: subjectVal,
                    message: messageVal,
                    timestamp: new Date().toISOString()
                };
                let existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
                existingMessages.push(backupPayload);
                localStorage.setItem('contact_messages', JSON.stringify(existingMessages));

                formAlert.textContent = `Thanks, ${nameVal}! Your message has been sent successfully.`;
                formAlert.className = 'form-alert success';
                contactForm.reset();
            } else {
                formAlert.textContent = result.message || "Something went wrong. Please try again.";
                formAlert.className = 'form-alert error';
            }
        })
        .catch(error => {
            console.error('Web3Forms submit error:', error);
            formAlert.textContent = "Network error. Please check your connection and try again.";
            formAlert.className = 'form-alert error';
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitText.textContent = "Send Message";
            submitSpinner.classList.add('hidden');
            formAlert.classList.remove('hidden');

            setTimeout(() => {
                formAlert.classList.add('hidden');
            }, 6000);
        });
    });
});
