/* ========================================
   مهامي - Themes Stylesheet
   الوضع الليلي والتخصيصات
======================================== */

/* ========== Dark Theme ========== */
body.dark-mode {
    --bg-color: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --border-color: #475569;
    --shadow-color: rgba(0, 0, 0, 0.3);
}

/* Adjust specific elements for dark mode */
body.dark-mode .splash-screen {
    background: linear-gradient(135deg, #1e293b, #0f172a);
}

body.dark-mode .note-card {
    background: #334155;
}

body.dark-mode .note-title {
    color: #f1f5f9;
}

body.dark-mode .note-content {
    color: #94a3b8;
}

body.dark-mode .note-date {
    color: #64748b;
}

body.dark-mode .note-delete {
    background: rgba(255, 255, 255, 0.1);
}

body.dark-mode input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
}

body.dark-mode input[type="time"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
}

body.dark-mode .color-option.note-color[data-color="#fff"] {
    background: #334155 !important;
    border-color: #475569;
}

/* ========== Theme Color Variations ========== */
/* Pink Theme */
body[data-theme-color="#ec4899"] {
    --primary-color: #ec4899;
    --primary-light: #f472b6;
    --primary-dark: #db2777;
}

/* Green Theme */
body[data-theme-color="#10b981"] {
    --primary-color: #10b981;
    --primary-light: #34d399;
    --primary-dark: #059669;
}

/* Orange Theme */
body[data-theme-color="#f59e0b"] {
    --primary-color: #f59e0b;
    --primary-light: #fbbf24;
    --primary-dark: #d97706;
}

/* Red Theme */
body[data-theme-color="#ef4444"] {
    --primary-color: #ef4444;
    --primary-light: #f87171;
    --primary-dark: #dc2626;
}

/* Purple Theme */
body[data-theme-color="#8b5cf6"] {
    --primary-color: #8b5cf6;
    --primary-light: #a78bfa;
    --primary-dark: #7c3aed;
}

/* Cyan Theme */
body[data-theme-color="#06b6d4"] {
    --primary-color: #06b6d4;
    --primary-light: #22d3ee;
    --primary-dark: #0891b2;
}

/* ========== Animations ========== */
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

/* Animation classes */
.animate-slide-in {
    animation: slideInRight 0.3s ease forwards;
}

.animate-bounce-in {
    animation: bounceIn 0.5s ease forwards;
}

.animate-shake {
    animation: shake 0.5s ease;
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* ========== Custom Scrollbar ========== */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-tertiary);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}

body.dark-mode::-webkit-scrollbar-thumb {
    background: #475569;
}

body.dark-mode::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}

/* ========== Selection ========== */
::selection {
    background: var(--primary-color);
    color: white;
}

/* ========== Focus States ========== */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
a:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* ========== Reduced Motion ========== */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* ========== High Contrast Mode ========== */
@media (prefers-contrast: high) {
    :root {
        --border-color: #000;
        --shadow-color: rgba(0, 0, 0, 0.3);
    }
    
    body.dark-mode {
        --border-color: #fff;
    }
    
    .btn-primary,
    .btn-outline:hover {
        border: 2px solid currentColor;
    }
}

/* ========== Print Optimizations ========== */
@media print {
    body {
        background: white !important;
        color: black !important;
    }
    
    .bg-secondary {
        background: white !important;
    }
    
    * {
        box-shadow: none !important;
    }
}
