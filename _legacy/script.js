// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// Sample tender data with realistic dates
const tenderData = [
    {
        id: 1,
        dateSubmitted: '2025-12-01',
        name: 'Government IT Infrastructure Upgrade',
        deadline: '2025-12-20T17:00:00',
        quotedAmount: 2450000,
        ourSubmissionDate: '2025-12-15T14:30:00',
        status: 'submitted',
        description: 'Complete overhaul of government IT infrastructure including servers, networking equipment, and security systems.',
        requirements: 'Hardware procurement, installation, configuration, and 2-year maintenance contract.'
    },
    {
        id: 2,
        dateSubmitted: '2025-11-15',
        name: 'Smart City IoT Deployment',
        deadline: '2025-12-18T16:00:00',
        quotedAmount: 5800000,
        ourSubmissionDate: '2025-12-12T10:15:00',
        status: 'submitted',
        description: 'Deployment of IoT sensors and smart city infrastructure across metropolitan area.',
        requirements: 'Sensor installation, data platform setup, mobile app development, and integration with existing systems.'
    },
    {
        id: 3,
        dateSubmitted: '2025-12-05',
        name: 'Healthcare Management System',
        deadline: '2025-12-25T18:00:00',
        quotedAmount: 1850000,
        ourSubmissionDate: null,
        status: 'pending',
        description: 'Development and implementation of comprehensive healthcare management system for regional hospital network.',
        requirements: 'Custom software development, database design, staff training, and ongoing support.'
    },
    {
        id: 4,
        dateSubmitted: '2025-11-28',
        name: 'Cybersecurity Assessment & Implementation',
        deadline: '2025-12-22T15:00:00',
        quotedAmount: 980000,
        ourSubmissionDate: '2025-12-14T16:45:00',
        status: 'submitted',
        description: 'Comprehensive cybersecurity audit and implementation of security measures for financial institution.',
        requirements: 'Security assessment, penetration testing, firewall configuration, and employee training program.'
    },
    {
        id: 5,
        dateSubmitted: '2025-12-08',
        name: 'Cloud Migration Services',
        deadline: '2025-12-30T17:00:00',
        quotedAmount: 3200000,
        ourSubmissionDate: null,
        status: 'pending',
        description: 'Migration of legacy systems to cloud infrastructure with minimal downtime.',
        requirements: 'Cloud architecture design, data migration, application modernization, and staff training.'
    }
];

// Sample submitted tenders data (tenders submitted BY the client TO us)
const submittedTendersData = [
    {
        id: 1,
        dateSubmitted: '2025-12-10',
        name: 'Enterprise Software Development RFP',
        deadline: '2025-12-28T17:00:00',
        documentUrl: '#',
        documentName: 'Enterprise_Software_RFP.pdf'
    },
    {
        id: 2,
        dateSubmitted: '2025-12-08',
        name: 'Network Infrastructure Upgrade Tender',
        deadline: '2025-12-22T16:00:00',
        documentUrl: '#',
        documentName: 'Network_Infrastructure_Tender.pdf'
    },
    {
        id: 3,
        dateSubmitted: '2025-12-12',
        name: 'Data Center Modernization Project',
        deadline: '2025-12-30T18:00:00',
        documentUrl: '#',
        documentName: 'DataCenter_Modernization.pdf'
    },
    {
        id: 4,
        dateSubmitted: '2025-11-25',
        name: 'Cloud Security Implementation',
        deadline: '2025-12-20T15:00:00',
        documentUrl: '#',
        documentName: 'Cloud_Security_RFP.pdf'
    },
    {
        id: 5,
        dateSubmitted: '2025-12-14',
        name: 'Mobile Application Development',
        deadline: '2026-01-05T17:00:00',
        documentUrl: '#',
        documentName: 'Mobile_App_Development.pdf'
    }
];

// Authentication
const CORRECT_PIN = '1111';
let isAuthenticated = false;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const pinInput = document.getElementById('pinInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const togglePinBtn = document.getElementById('togglePin');
const logoutBtn = document.getElementById('logoutBtn');

// Tab elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Form elements
const submitForm = document.getElementById('submitForm');
const contactForm = document.getElementById('contactForm');
const fileUpload = document.getElementById('fileUpload');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileList = document.getElementById('fileList');

// Modal elements
const tenderModal = document.getElementById('tenderModal');
const closeModal = document.getElementById('closeModal');

// File upload handling
let uploadedFiles = [];

// Toggle PIN visibility
togglePinBtn.addEventListener('click', () => {
    const type = pinInput.type === 'password' ? 'text' : 'password';
    pinInput.type = type;
    
    const icon = togglePinBtn.querySelector('i');
    icon.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
    lucide.createIcons();
});

// Login functionality
loginBtn.addEventListener('click', handleLogin);
pinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

function handleLogin() {
    const pin = pinInput.value.trim();
    
    if (pin === CORRECT_PIN) {
        isAuthenticated = true;
        loginScreen.classList.remove('active');
        dashboardScreen.classList.add('active');
        loadDashboard();
        lucide.createIcons();
    } else {
        loginError.textContent = 'Invalid PIN. Please try again.';
        loginError.classList.add('show');
        pinInput.value = '';
        pinInput.focus();
        
        setTimeout(() => {
            loginError.classList.remove('show');
        }, 3000);
    }
}

// Logout functionality
logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    dashboardScreen.classList.remove('active');
    loginScreen.classList.add('active');
    pinInput.value = '';
    pinInput.type = 'password';
    lucide.createIcons();
});

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(`${targetTab}Tab`).classList.add('active');
        
        lucide.createIcons();
    });
});

// Load dashboard data
function loadDashboard() {
    renderTenderTable();
    renderSubmittedTendersTable();
    updateStats();
    startTimers();
}

// Render tender table
function renderTenderTable() {
    const tbody = document.getElementById('tenderTableBody');
    tbody.innerHTML = '';
    
    tenderData.forEach(tender => {
        const row = document.createElement('tr');
        
        // Format dates
        const submittedDate = new Date(tender.dateSubmitted).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const deadlineDate = new Date(tender.deadline).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Calculate time remaining
        const timeRemaining = getTimeRemaining(tender.deadline);
        const timerClass = getTimerClass(timeRemaining);
        
        // Calculate submission status
        const submissionStatus = getSubmissionStatus(tender);
        
        row.innerHTML = `
            <td>${submittedDate}</td>
            <td><strong>${tender.name}</strong></td>
            <td>${deadlineDate}</td>
            <td>
                <span class="timer-badge ${timerClass}" data-deadline="${tender.deadline}">
                    <i data-lucide="clock"></i>
                    <span class="timer-text">${formatTimeRemaining(timeRemaining)}</span>
                </span>
            </td>
            <td><span class="amount">$${tender.quotedAmount.toLocaleString()}</span></td>
            <td>${submissionStatus}</td>
            <td>
                <button class="btn-view" onclick="viewTenderDetails(${tender.id})">
                    <i data-lucide="eye"></i>
                    <span>View</span>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    lucide.createIcons();
}

// Render submitted tenders table
function renderSubmittedTendersTable() {
    const tbody = document.getElementById('submittedTendersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    submittedTendersData.forEach(tender => {
        const row = document.createElement('tr');
        
        // Format dates
        const submittedDate = new Date(tender.dateSubmitted).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const deadlineDate = new Date(tender.deadline).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Calculate time remaining
        const timeRemaining = getTimeRemaining(tender.deadline);
        const timerClass = getTimerClass(timeRemaining);
        
        row.innerHTML = `
            <td>${submittedDate}</td>
            <td><strong>${tender.name}</strong></td>
            <td>
                <a href="${tender.documentUrl}" class="btn-download" download="${tender.documentName}">
                    <i data-lucide="download"></i>
                    <span>${tender.documentName}</span>
                </a>
            </td>
            <td>${deadlineDate}</td>
            <td>
                <span class="timer-badge ${timerClass}" data-deadline="${tender.deadline}">
                    <i data-lucide="clock"></i>
                    <span class="timer-text">${formatTimeRemaining(timeRemaining)}</span>
                </span>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    lucide.createIcons();
}

// Get time remaining in milliseconds
function getTimeRemaining(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate - now;
}

// Get timer class based on time remaining
function getTimerClass(timeRemaining) {
    const days = timeRemaining / (1000 * 60 * 60 * 24);
    
    if (days < 2) return 'urgent';
    if (days < 5) return 'warning';
    return 'normal';
}

// Format time remaining
function formatTimeRemaining(ms) {
    if (ms < 0) return 'Expired';
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Get submission status
function getSubmissionStatus(tender) {
    if (tender.status === 'pending') {
        return `
            <span class="status-badge pending">
                <i data-lucide="clock"></i>
                <span>In Progress</span>
            </span>
        `;
    }
    
    // Calculate days before deadline
    const deadline = new Date(tender.deadline);
    const submission = new Date(tender.ourSubmissionDate);
    const daysEarly = Math.floor((deadline - submission) / (1000 * 60 * 60 * 24));
    
    return `
        <span class="status-badge submitted">
            <i data-lucide="check-circle"></i>
            <span>Submitted ${daysEarly} days early</span>
        </span>
    `;
}

// Update stats
function updateStats() {
    const activeTenders = tenderData.filter(t => getTimeRemaining(t.deadline) > 0).length;
    const completedTenders = tenderData.filter(t => t.status === 'submitted').length;
    
    document.getElementById('activeTenders').textContent = activeTenders;
    document.getElementById('completedTenders').textContent = completedTenders;
}

// Start timers
function startTimers() {
    setInterval(() => {
        const timerElements = document.querySelectorAll('.timer-badge');
        
        timerElements.forEach(timer => {
            const deadline = timer.dataset.deadline;
            const timeRemaining = getTimeRemaining(deadline);
            const timerText = timer.querySelector('.timer-text');
            
            if (timerText) {
                timerText.textContent = formatTimeRemaining(timeRemaining);
                
                // Update timer class
                timer.className = 'timer-badge ' + getTimerClass(timeRemaining);
            }
        });
        
        lucide.createIcons();
    }, 60000); // Update every minute
}

// View tender details
window.viewTenderDetails = function(tenderId) {
    const tender = tenderData.find(t => t.id === tenderId);
    if (!tender) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = tender.name;
    
    const submittedDate = new Date(tender.dateSubmitted).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const deadlineDate = new Date(tender.deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let submissionInfo = 'Not yet submitted';
    if (tender.ourSubmissionDate) {
        const submissionDate = new Date(tender.ourSubmissionDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const deadline = new Date(tender.deadline);
        const submission = new Date(tender.ourSubmissionDate);
        const daysEarly = Math.floor((deadline - submission) / (1000 * 60 * 60 * 24));
        
        submissionInfo = `${submissionDate} (${daysEarly} days before deadline)`;
    }
    
    modalBody.innerHTML = `
        <div class="modal-detail">
            <div class="modal-detail-label">Date Submitted to Us</div>
            <div class="modal-detail-value">${submittedDate}</div>
        </div>
        
        <div class="modal-detail">
            <div class="modal-detail-label">Deadline</div>
            <div class="modal-detail-value">${deadlineDate}</div>
        </div>
        
        <div class="modal-detail">
            <div class="modal-detail-label">Our Submission Date</div>
            <div class="modal-detail-value">${submissionInfo}</div>
        </div>
        
        <div class="modal-detail">
            <div class="modal-detail-label">Quoted Amount</div>
            <div class="modal-detail-value"><strong>$${tender.quotedAmount.toLocaleString()}</strong></div>
        </div>
        
        <div class="modal-detail">
            <div class="modal-detail-label">Description</div>
            <div class="modal-detail-value">${tender.description}</div>
        </div>
        
        <div class="modal-detail">
            <div class="modal-detail-label">Requirements</div>
            <div class="modal-detail-value">${tender.requirements}</div>
        </div>
    `;
    
    tenderModal.classList.add('show');
    lucide.createIcons();
};

// Close modal
closeModal.addEventListener('click', () => {
    tenderModal.classList.remove('show');
});

tenderModal.addEventListener('click', (e) => {
    if (e.target === tenderModal) {
        tenderModal.classList.remove('show');
    }
});

// File upload handling
fileUploadArea.addEventListener('click', () => {
    fileUpload.click();
});

fileUpload.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
            uploadedFiles.push(file);
        }
    });
    
    renderFileList();
    lucide.createIcons();
});

function renderFileList() {
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = uploadedFiles.map((file, index) => `
        <div class="file-item">
            <div class="file-item-info">
                <i data-lucide="file"></i>
                <span class="file-item-name">${file.name}</span>
            </div>
            <button type="button" class="file-item-remove" onclick="removeFile(${index})">
                <i data-lucide="x"></i>
            </button>
        </div>
    `).join('');
    
    lucide.createIcons();
}

window.removeFile = function(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
};

// Submit form handling
submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tenderName = document.getElementById('tenderName').value;
    const deadline = document.getElementById('deadline').value;
    const description = document.getElementById('description').value;
    
    // Simulate submission
    const successMessage = document.getElementById('submitSuccess');
    successMessage.innerHTML = `
        <i data-lucide="check-circle"></i>
        <span>Tender requirements submitted successfully! We'll review and get back to you soon.</span>
    `;
    successMessage.classList.add('show');
    
    // Reset form
    submitForm.reset();
    uploadedFiles = [];
    renderFileList();
    
    lucide.createIcons();
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
});

// Contact form handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simulate submission
    const successMessage = document.getElementById('contactSuccess');
    successMessage.innerHTML = `
        <i data-lucide="check-circle"></i>
        <span>Message sent successfully! We'll respond to your inquiry within 24 hours.</span>
    `;
    successMessage.classList.add('show');
    
    // Reset form
    contactForm.reset();
    
    lucide.createIcons();
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
});