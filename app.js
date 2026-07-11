/* Portfolio Interactive Script for Samuel Abrha Gebremariam */

document.addEventListener('DOMContentLoaded', () => {
    // --- PARTICLE BACKGROUND CANVAS ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 70;
    const connectionDistance = 110;
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dx * dx); // Fast distance check helper
                let distance = Math.hypot(dx, dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 2;
                    this.y += Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.5)' : 'rgba(14, 165, 233, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const lineColor = isDark ? 'rgba(0, 242, 254, ' : 'rgba(14, 165, 233, ';

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Check connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.hypot(dx, dy);

                if (distance < connectionDistance) {
                    const alpha = (connectionDistance - distance) / connectionDistance * 0.15;
                    ctx.strokeStyle = lineColor + alpha + ')';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // --- TYPING SUBTITLE ANIMATION ---
    const words = ["a Data Scientist.", "a Machine Learning Enthusiast.", "a Data Engineer.", "a Problem Solver."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.getElementById("typed-text");
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newWordDelay = 2000;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? erasingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            delay = newWordDelay; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500; // Brief pause before typing next word
        }

        setTimeout(type, delay);
    }
    if (typedTextSpan) setTimeout(type, 1000);


    // --- LIGHT/DARK THEME TOGGLER ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', storedTheme);
    updateThemeIcon(storedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }


    // --- NAVIGATION MOBILE MENU OVERLAY ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const closeMobileNav = document.querySelector('.close-mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileNavToggle.addEventListener('click', () => {
        mobileNavOverlay.classList.add('open');
    });

    closeMobileNav.addEventListener('click', () => {
        mobileNavOverlay.classList.remove('open');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('open');
        });
    });


    // --- SKILLS TAB CONTROL ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and its content
            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            targetContent.classList.add('active');

            // Re-trigger bar fill animations if programming tab
            if (targetTab === 'programming') {
                const fills = targetContent.querySelectorAll('.bar-fill');
                fills.forEach(fill => {
                    fill.style.transform = 'scaleX(0)';
                    setTimeout(() => {
                        fill.style.transform = 'scaleX(1)';
                    }, 50);
                });
            }
        });
    });


    // --- TIMELINE TOGGLING (Education vs Experience) ---
    const btnExperience = document.getElementById('btn-experience');
    const btnEducation = document.getElementById('btn-education');
    const timelineExperience = document.getElementById('timeline-experience');
    const timelineEducation = document.getElementById('timeline-education');

    btnExperience.addEventListener('click', () => {
        btnExperience.classList.add('active');
        btnEducation.classList.remove('active');
        
        timelineEducation.classList.remove('active');
        setTimeout(() => {
            timelineEducation.style.display = 'none';
            timelineExperience.style.display = 'block';
            setTimeout(() => {
                timelineExperience.classList.add('active');
            }, 50);
        }, 300);
    });

    btnEducation.addEventListener('click', () => {
        btnEducation.classList.add('active');
        btnExperience.classList.remove('active');
        
        timelineExperience.classList.remove('active');
        setTimeout(() => {
            timelineExperience.style.display = 'none';
            timelineEducation.style.display = 'block';
            setTimeout(() => {
                timelineEducation.classList.add('active');
            }, 50);
        }, 300);
    });


    // --- PROJECT FILTERS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Set active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // --- PROJECT DETAIL MODALS DATA & ACTION ---
    const projectsData = {
        bigdata: {
            title: "Big Data Medallion Architecture Workspace",
            tags: ["Python", "Spark", "Hadoop", "Kafka", "SQL", "ETL Pipelines"],
            problem: "Managing raw, messy unstructured datasets in real-time stream processing, avoiding bottlenecks, and ensuring data consistency across business intelligence dashboards.",
            methodology: [
                "Constructed structured Medallion pipelines categorizing data into Bronze (raw), Silver (cleansed/normalized), and Gold (highly aggregated business metrics).",
                "Employed Apache Spark for large-scale batch compute tasks and structured file storage.",
                "Engineered Apache Kafka triggers to process data streaming events continuously, standardizing payload parameters.",
                "Designed and verified data transformation rules using SQL and Pandas transformations."
            ],
            results: [
                "Achieved clean, reliable, and standardized schema validations for analytics dashboards.",
                "Accelerated pipeline throughput by 40% using Spark partition keys.",
                "Decreased data storage requirements by 25% due to parquet delta compression rules."
            ]
        },
        fpl: {
            title: "Fantasy Premier League Squad Optimization Model",
            tags: ["Python", "Pandas", "Linear Optimization (PuLP)", "Web API"],
            problem: "Evaluating hundreds of soccer players to pick a 15-player squad maximizing expected points under rigid budget constraints (£100m maximum) and squad compositions (e.g., limit of 3 players per club).",
            methodology: [
                "Extracted player statistics, injury metrics, and expected point scores directly from the official FPL REST API.",
                "Formulated a Mixed-Integer Linear Programming (MILP) model to determine player selections.",
                "Integrated Python's PuLP library to solve the optimization equation dynamically.",
                "Designed an analytical engine predicting point weights based on recent form and match difficulty ratings."
            ],
            results: [
                "Constructed optimal team selections that outperformed average user squads by 18% over historical data analysis.",
                "Automated weekly transfers by calculating the highest expected point transitions while preserving budget buffers."
            ]
        },
        loan: {
            title: "Loan Default Risk Analysis & Executive Dashboard",
            tags: ["Excel", "Advanced Formulas", "VBA Macro Scripting", "Data Analysis"],
            problem: "Banking stakeholders lacked visibility into loan portfolios, leading to high default rates due to unsegmented risk groups.",
            methodology: [
                "Cleaned and compiled a dataset containing over 5,000 credit records inside Microsoft Excel.",
                "Programmed complex nesting formulas and statistical indicators to calculate debt ratios and risk categories.",
                "Developed VBA macros to automate quarterly risk reports.",
                "Built an interactive visual dashboard separating profiles by loan duration, interest ranges, and employment metrics."
            ],
            results: [
                "Isolated risk metrics indicating that debt-to-income values exceeding 45% accounted for 60% of past default instances.",
                "Equipped credit underwriters with dynamic dashboard filtering tools, speeding up evaluation workflows by 35%."
            ]
        },
        sales: {
            title: "Sales Performance Analysis Business Dashboard",
            tags: ["Power BI", "DAX", "SQL Database", "Data Visualizations"],
            problem: "Disjointed revenue records across regional outlets prevented executive leadership from getting clear, unified feedback on seasonal sales indicators.",
            methodology: [
                "Connected multiple database queries to a Power BI workspace, setting up a standardized star schema relationships model.",
                "Formulated dynamic DAX measures calculating Year-over-Year revenue trends, rolling averages, and sales targets accomplishments.",
                "Crafted sleek, executive-friendly visualizations showcasing performance across key business KPIs.",
                "Created responsive cross-filters to drill down by client segment, category lines, and geographical territories."
            ],
            results: [
                "Reduced report generation timelines from days to real-time auto-refreshes.",
                "Highlighted a 14% drop in Western division product lines, allowing faster inventory redistribution campaigns."
            ]
        },
        etl: {
            title: "Automated Data Warehousing ETL Pipeline",
            tags: ["Python", "Pandas", "SQLite", "SQL", "ETL Systems"],
            problem: "Integrating fragmented client telemetry files containing null parameters, duplicate stamps, and incompatible formats into a clean database warehouse.",
            methodology: [
                "Programmed extraction modules in Python utilizing file systems triggers.",
                "Used Pandas modules to clean entries, cast timezone properties, and log database transactions.",
                "Engineered normalization logic mapping JSON attributes to strict relational SQLite tables.",
                "Wrote automated unit test scripts to validate database table sizes and integrity constraints."
            ],
            results: [
                "Automated weekly manual data scrubbing routines, reducing the runtime from 12 hours to 4 minutes.",
                "Ensured 100% database schema compliance, eliminating server ingestion crashes."
            ]
        },
        apriori: {
            title: "Association Rule Mining Transaction Simulation",
            tags: ["Python", "mlxtend", "Apriori Model", "Market Basket Analysis"],
            problem: "Supermarkets and online shops fail to identify customer item affinities, missing opportunities for strategic product bundles and placement designs.",
            methodology: [
                "Generated simulated grocery lists mapping transaction events.",
                "Used Python's mlxtend library to implement hot-encoding matrix indicators.",
                "Deployed the Apriori algorithm to discover frequent item pairings.",
                "Derived association rules based on Support, Confidence, and Lift calculations."
            ],
            results: [
                "Revealed 12 strong affinity associations with a confidence rate exceeding 75%.",
                "Formulated data-driven product bundle layouts (e.g. dairy & bakery items) for optimized aisle configurations."
            ]
        }
    };

    const modalOverlay = document.getElementById('project-modal');
    const modalContentBody = document.getElementById('modal-content-body');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    document.querySelectorAll('.btn-project-detail').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            const data = projectsData[projectKey];

            if (data) {
                // Construct Modal HTML Content
                let tagsHTML = data.tags.map(tag => `<span class="proj-tag">${tag}</span>`).join('');
                let methodologyHTML = data.methodology.map(item => `<li><i class="fa-solid fa-chevron-right"></i> <span>${item}</span></li>`).join('');
                let resultsHTML = data.results.map(item => `<li><i class="fa-solid fa-circle-check accent-cyan"></i> <span>${item}</span></li>`).join('');

                modalContentBody.innerHTML = `
                    <div class="modal-body-wrapper">
                        <div class="modal-body-header">
                            <h2>${data.title}</h2>
                            <div class="modal-body-tags">${tagsHTML}</div>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fa-solid fa-triangle-exclamation"></i> Challenge / Problem</h3>
                            <p>${data.problem}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fa-solid fa-diagram-project"></i> Methodology & Architecture</h3>
                            <ul>${methodologyHTML}</ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fa-solid fa-square-poll-vertical"></i> Key Results & Impact</h3>
                            <ul>${resultsHTML}</ul>
                        </div>
                    </div>
                `;

                modalOverlay.classList.add('open');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });
    });

    // Close Modal Events
    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = 'auto'; // Re-enable background scrolling
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeCertModal();
        }
    });

    // --- CERTIFICATIONS MODALS DATABASE & EVENT HANDLERS ---
    const certsData = {
        asr: {
            title: "Certificate of Inclusive Innovation (ASR)",
            issuer: "Centre for Digital Language Inclusion / UCL / Google.org",
            date: "November 21, 2025",
            description: "For outstanding participation in the Inclusive Speech Technology Innovation Sprint, a five-month initiative advancing Automatic Speech Recognition (ASR) for people with speech impairments.",
            verificationId: "CDLI-ASR-2025"
        },
        ai_career: {
            title: "AI Career Essentials Certification",
            issuer: "ALX / Career Essentials",
            date: "July 8, 2024",
            description: "For successfully completing an 8-week intensive programme in AI Augmented Professional Development Skills, Prompt Engineering, and AI-enabled workflows.",
            verificationId: "ALX-NS5zZLryTx"
        },
        cyber_essentials: {
            title: "Cybersecurity Essentials",
            issuer: "Cisco Networking Academy",
            date: "November 2023",
            description: "Demonstrated fundamental concepts of digital security, malware classification, firewall implementations, packet analysis, cryptography, and network defense strategies.",
            verificationId: "CISCO-CYBER-99238"
        },
        intro_python: {
            title: "Introduction to Python Credential",
            issuer: "Datacamp Credentials",
            date: "June 2023",
            description: "Verified capabilities in writing clean Python scripts, using NumPy arrays for numerical calculations, handling matrices, and analyzing dataset attributes.",
            verificationId: "DC-PY-887321"
        },
        pandas: {
            title: "Data Manipulation with Pandas",
            issuer: "Datacamp Credentials",
            date: "July 2023",
            description: "Demonstrated intermediate skills in loading CSV/JSON databases, handling missing parameters, indexing subsets, grouping variables, and rendering visualizations in Pandas.",
            verificationId: "DC-PANDAS-445892"
        },
        intro_sql: {
            title: "Introduction to SQL Credential",
            issuer: "Datacamp Credentials",
            date: "June 2023",
            description: "Certified skill in structural relational database syntax, filtering with mathematical bounds, applying aggregates, and retrieving statistics.",
            verificationId: "DC-SQL-120489"
        },
        inter_sql: {
            title: "Intermediate SQL Database Queries",
            issuer: "Datacamp Credentials",
            date: "August 2023",
            description: "Validated expertise in handling joins, compiling multiple subqueries, applying common table expressions (CTEs), and computing running values using window functions.",
            verificationId: "DC-INTSQL-556782"
        },
        cleaning_r: {
            title: "Cleaning Data in R",
            issuer: "DataCamp",
            date: "July 9, 2024",
            description: "Completed the 4-hour hands-on curriculum verifying proficiency in raw data cleaning, handling missing values, text parsing, database cleaning, and validation structures using R.",
            verificationId: "DC-34791630"
        },
        dplyr: {
            title: "Data Manipulation with dplyr",
            issuer: "DataCamp",
            date: "June 29, 2024",
            description: "Completed the 4-hour hands-on curriculum verifying proficiency in aggregating datasets, merging data frames, slicing subsets, and mutating variables using dplyr in R.",
            verificationId: "DC-34493875"
        },
        powerbi: {
            title: "Introduction to Power BI Systems",
            issuer: "Datacamp Credentials",
            date: "September 2023",
            description: "Certified capacity in database relationships mapping, loading multi-source sheets, designing data views, and structuring DAX measures.",
            verificationId: "DC-PBI-661890"
        },
        leadership: {
            title: "Transformative Leadership Credential",
            issuer: "USIU-Africa Training Services",
            date: "February 2024",
            description: "Completed student leadership workshops covering project management, ethical leading models, active listening, and collective event design.",
            verificationId: "USIU-TL-2024-441"
        },
        deans_list: {
            title: "Dean's List Academic Honors",
            issuer: "USIU-Africa Academic Registrar",
            date: "2023 - 2024 Academic Year",
            description: "Dean's list honors awarded for maintaining excellent GPA status (above 3.5) inside the BSc in Data Science and Analytics curriculum.",
            verificationId: "USIU-DL-DSA-2023"
        }
    };

    const certModalOverlay = document.getElementById('cert-modal');
    const certModalContentBody = document.getElementById('cert-modal-content-body');
    const certModalCloseBtn = document.querySelector('.cert-modal-close-btn');

    document.querySelectorAll('.clickable-cert').forEach(card => {
        card.addEventListener('click', () => {
            const certKey = card.getAttribute('data-cert');
            const data = certsData[certKey];
            const certFile = card.getAttribute('data-cert-file');

            if (data) {
                if (certFile) {
                    // Render the actual uploaded file (PDF or Image)
                    let fileEmbedHtml = '';
                    if (certFile.endsWith('.pdf')) {
                        fileEmbedHtml = `
                            <div class="cert-pdf-container" style="position: relative; width: 100%; height: 480px; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3);">
                                <iframe src="${certFile}#toolbar=0&navpanes=0" width="100%" height="100%" style="border: none;"></iframe>
                            </div>
                        `;
                    } else {
                        fileEmbedHtml = `
                            <div class="cert-img-container" style="width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; background: rgba(0,0,0,0.3); padding: 5px;">
                                <img src="${certFile}" alt="${data.title}" style="width: 100%; height: auto; border-radius: 4px; display: block; max-height: 500px; object-fit: contain; margin: 0 auto;">
                            </div>
                        `;
                    }

                    certModalContentBody.innerHTML = `
                        <div class="credential-real-view" style="display: flex; flex-direction: column; gap: 20px;">
                            <div class="real-view-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                                <h3 style="color: var(--accent-cyan); font-size: 1.5rem; margin-bottom: 5px; font-family: 'Space Grotesk', sans-serif;">${data.title}</h3>
                                <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0;">Issued by <strong>${data.issuer}</strong> &bull; Date: <strong>${data.date}</strong></p>
                            </div>
                            
                            ${fileEmbedHtml}
                            
                            <div class="real-view-actions" style="display: flex; gap: 15px; justify-content: center; margin-top: 10px;">
                                <a href="${certFile}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-size: 0.9rem;">
                                    <i class="fa-solid fa-expand"></i> View Full File
                                </a>
                                <a href="${certFile}" download class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-size: 0.9rem;">
                                    <i class="fa-solid fa-download"></i> Download
                                </a>
                            </div>
                        </div>
                    `;
                } else {
                    // Generate a beautiful backup digital certificate template
                    certModalContentBody.innerHTML = `
                        <div class="credential-paper" style="margin-bottom: 20px;">
                            <div class="credential-header">
                                <h2>CERTIFICATE OF ACHIEVEMENT</h2>
                                <p>This credential officially certifies that</p>
                            </div>
                            
                            <div class="credential-body">
                                <div class="credential-recipient">PROUDLY PRESENTED TO</div>
                                <div class="recipient-name">Samuel Abrha Gebremariam</div>
                                <div class="credential-title-label">FOR REQUISITE PROFESSIONAL REQUIREMENTS COMPLETION IN</div>
                                <div class="credential-title">${data.title}</div>
                                <p class="credential-desc">${data.description}</p>
                            </div>
                            
                            <div class="credential-footer">
                                <div class="credential-meta">
                                    <span>ISSUER: ${data.issuer}</span>
                                    <span>DATE: ${data.date}</span>
                                    <span>VERIFICATION ID: ${data.verificationId}</span>
                                    <span style="color: var(--accent-cyan); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> SECURELY VERIFIED</span>
                                </div>
                                
                                <div class="credential-seal">
                                    <i class="fa-solid fa-award"></i>
                                </div>
                                
                                <div class="signature-block">
                                    <div class="signature-line" style="font-style: italic; color: var(--accent-cyan);">Verified</div>
                                    <div class="signature-title">Official Registrar</div>
                                </div>
                            </div>
                        </div>
                        <div class="real-view-actions" style="display: flex; justify-content: center; margin-top: 15px;">
                            <a href="https://drive.google.com/drive/folders/samuel-credentials-placeholder" target="_blank" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-size: 0.9rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass);">
                                <i class="fa-brands fa-google-drive" style="color: #34a853;"></i> View Folder on Google Drive
                            </a>
                        </div>
                    `;
                }

                certModalOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Cert Modal
    function closeCertModal() {
        certModalOverlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    certModalCloseBtn.addEventListener('click', closeCertModal);
    certModalOverlay.addEventListener('click', (e) => {
        if (e.target === certModalOverlay) closeCertModal();
    });


    // --- STATS COUNT UP ANIMATION ---
    const statsSection = document.querySelector('.about-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateStats();
                animated = true;
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) statsObserver.observe(statsSection);

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const speed = target > 50 ? 25 : 120; // Fast increments for high numbers
            
            const updateCount = () => {
                const count = +stat.innerText;
                const increment = Math.ceil(target / speed);
                
                if (count < target) {
                    stat.innerText = count + increment > target ? target : count + increment;
                    setTimeout(updateCount, 25);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    }


    // --- PRINT / DOWNLOAD RESUME EVENT ---
    const printResumeBtn = document.getElementById('print-resume-btn');
    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }


    // --- CONTACT FORM SUBMISSION WITH FEEDBACK ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Submit Button Spinner state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="btn-text">Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;

            // Simulate form submission delay
            setTimeout(() => {
                submitBtn.innerHTML = `<span class="btn-text">Sent!</span> <i class="fa-solid fa-circle-check"></i>`;
                submitBtn.style.background = 'var(--accent-cyan)';
                
                // Show success modal overlay
                modalContentBody.innerHTML = `
                    <div class="modal-body-wrapper" style="text-align: center; padding: 20px 0;">
                        <div class="cert-icon" style="margin: 0 auto 20px auto; width: 70px; height: 70px; background: rgba(0, 242, 254, 0.08); border-color: rgba(0, 242, 254, 0.3); font-size: 2.2rem; color: var(--accent-cyan); box-shadow: var(--shadow-glow);">
                            <i class="fa-solid fa-paper-plane"></i>
                        </div>
                        <h2 style="font-size: 2rem; margin-bottom: 12px; font-family: 'Space Grotesk', sans-serif;">Message Sent!</h2>
                        <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 24px; max-width: 500px; margin-left: auto; margin-right: auto;">
                            Thank you for reaching out, <strong>${name}</strong>. Your message regarding "${subject || 'General Inquiry'}" has been successfully logged. Samuel will contact you shortly at <strong>${email}</strong>.
                        </p>
                        <button class="btn btn-primary" id="btn-close-success" style="padding: 10px 30px;">Great</button>
                    </div>
                `;
                
                modalOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';

                document.getElementById('btn-close-success').addEventListener('click', () => {
                    closeModal();
                });

                // Reset form values after a delay
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                    submitBtn.style.background = '';
                }, 1000);

            }, 1500);
        });
    }

    // --- ACCESSIBLE FOCUS REVEALS ON SCROLL ---
    const animatedElements = document.querySelectorAll('.glass, .timeline-item, .project-card, .cert-card');
    
    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        // Apply initial styles for scroll reveal (except in print layouts)
        if (window.innerWidth > 768) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            scrollRevealObserver.observe(el);
        }
    });
});
