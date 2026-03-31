/* ========================================
   مهامي - Main Application JavaScript
   المطور: زياد يحيى زكريا
   فريق ZIADPWA
======================================== */

// ========== App State ==========
const AppState = {
    tasks: [],
    notes: [],
    notifications: [],
    achievements: [],
    settings: {
        darkMode: false,
        themeColor: '#6366f1',
        font: 'Cairo',
        fontSize: 'medium',
        notificationsEnabled: true,
        soundEnabled: true
    },
    stats: {
        streak: 0,
        bestStreak: 0,
        totalCompleted: 0,
        lastCompletedDate: null
    },
    currentPage: 'tasks',
    currentFilter: 'all',
    selectedTask: null,
    selectedNote: null
};

// ========== Utility Functions ==========
const Utils = {
    generateId: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    
    formatDate: (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('ar-EG', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    },
    
    formatTime: (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const period = h >= 12 ? 'م' : 'ص';
        const hour12 = h % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    },
    
    formatDateTime: (date, time) => {
        let result = '';
        if (date) result += Utils.formatDate(date);
        if (time) result += ` - ${Utils.formatTime(time)}`;
        return result;
    },
    
    getRelativeTime: (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'الآن';
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        if (hours < 24) return `منذ ${hours} ساعة`;
        if (days < 7) return `منذ ${days} يوم`;
        return Utils.formatDate(timestamp);
    },
    
    isToday: (date) => {
        const today = new Date();
        const d = new Date(date);
        return d.toDateString() === today.toDateString();
    },
    
    isThisWeek: (date) => {
        const today = new Date();
        const d = new Date(date);
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        return d >= weekStart && d <= weekEnd;
    },
    
    getWeekDay: (date) => {
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return days[new Date(date).getDay()];
    },
    
    getPriorityLabel: (priority) => {
        const labels = {
            low: 'منخفضة',
            medium: 'متوسطة',
            high: 'عالية',
            urgent: 'عاجلة'
        };
        return labels[priority] || priority;
    },
    
    getCategoryLabel: (category) => {
        const labels = {
            personal: 'شخصي',
            work: 'عمل',
            study: 'دراسة',
            health: 'صحة',
            shopping: 'تسوق',
            other: 'أخرى'
        };
        return labels[category] || category;
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ========== Storage Manager ==========
const Storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(`mahamey_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    },
    
    load: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(`mahamey_${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Storage load error:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(`mahamey_${key}`);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('mahamey_'));
            keys.forEach(k => localStorage.removeItem(k));
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    },
    
    saveAll: () => {
        Storage.save('tasks', AppState.tasks);
        Storage.save('notes', AppState.notes);
        Storage.save('notifications', AppState.notifications);
        Storage.save('achievements', AppState.achievements);
        Storage.save('settings', AppState.settings);
        Storage.save('stats', AppState.stats);
    },
    
    loadAll: () => {
        AppState.tasks = Storage.load('tasks', []);
        AppState.notes = Storage.load('notes', []);
        AppState.notifications = Storage.load('notifications', []);
        AppState.achievements = Storage.load('achievements', []);
        AppState.settings = { ...AppState.settings, ...Storage.load('settings', {}) };
        AppState.stats = { ...AppState.stats, ...Storage.load('stats', {}) };
    }
};

// ========== Task Manager ==========
const TaskManager = {
    add: (task) => {
        const newTask = {
            id: Utils.generateId(),
            title: task.title,
            description: task.description || '',
            category: task.category || 'personal',
            priority: task.priority || 'medium',
            date: task.date || null,
            time: task.time || null,
            reminder: task.reminder || 'none',
            color: task.color || '#6366f1',
            completed: false,
            createdAt: Date.now(),
            completedAt: null
        };
        
        AppState.tasks.unshift(newTask);
        Storage.save('tasks', AppState.tasks);
        
        // Add notification
        NotificationManager.add({
            type: 'success',
            title: 'تمت إضافة مهمة',
            message: newTask.title
        });
        
        // Set reminder if needed
        if (newTask.reminder !== 'none' && newTask.date && newTask.time) {
            ReminderManager.set(newTask);
        }
        
        return newTask;
    },
    
    update: (id, updates) => {
        const index = AppState.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            AppState.tasks[index] = { ...AppState.tasks[index], ...updates };
            Storage.save('tasks', AppState.tasks);
            return AppState.tasks[index];
        }
        return null;
    },
    
    delete: (id) => {
        const index = AppState.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            AppState.tasks.splice(index, 1);
            Storage.save('tasks', AppState.tasks);
            return true;
        }
        return false;
    },
    
    toggle: (id) => {
        const task = AppState.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? Date.now() : null;
            
            if (task.completed) {
                AppState.stats.totalCompleted++;
                StatsManager.updateStreak();
                AchievementManager.check();
            }
            
            Storage.save('tasks', AppState.tasks);
            Storage.save('stats', AppState.stats);
            return task;
        }
        return null;
    },
    
    getFiltered: (filter = 'all') => {
        switch (filter) {
            case 'pending':
                return AppState.tasks.filter(t => !t.completed);
            case 'completed':
                return AppState.tasks.filter(t => t.completed);
            default:
                return AppState.tasks;
        }
    },
    
    getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return AppState.tasks.filter(t => t.date === today);
    },
    
    getWeekTasks: () => {
        return AppState.tasks.filter(t => t.date && Utils.isThisWeek(t.date));
    },
    
    getStats: () => {
        const total = AppState.tasks.length;
        const completed = AppState.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { total, completed, pending, completionRate };
    }
};

// ========== Note Manager ==========
const NoteManager = {
    add: (note) => {
        const newNote = {
            id: Utils.generateId(),
            title: note.title,
            content: note.content || '',
            color: note.color || '#fef3c7',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        AppState.notes.unshift(newNote);
        Storage.save('notes', AppState.notes);
        
        return newNote;
    },
    
    update: (id, updates) => {
        const index = AppState.notes.findIndex(n => n.id === id);
        if (index !== -1) {
            AppState.notes[index] = { 
                ...AppState.notes[index], 
                ...updates,
                updatedAt: Date.now()
            };
            Storage.save('notes', AppState.notes);
            return AppState.notes[index];
        }
        return null;
    },
    
    delete: (id) => {
        const index = AppState.notes.findIndex(n => n.id === id);
        if (index !== -1) {
            AppState.notes.splice(index, 1);
            Storage.save('notes', AppState.notes);
            return true;
        }
        return false;
    }
};

// ========== Notification Manager ==========
const NotificationManager = {
    add: (notification) => {
        const newNotification = {
            id: Utils.generateId(),
            type: notification.type || 'info',
            title: notification.title,
            message: notification.message,
            read: false,
            createdAt: Date.now()
        };
        
        AppState.notifications.unshift(newNotification);
        Storage.save('notifications', AppState.notifications);
        UI.updateNotificationBadge();
        
        return newNotification;
    },
    
    markAsRead: (id) => {
        const notification = AppState.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            Storage.save('notifications', AppState.notifications);
            UI.updateNotificationBadge();
        }
    },
    
    clearAll: () => {
        AppState.notifications = [];
        Storage.save('notifications', AppState.notifications);
        UI.updateNotificationBadge();
    },
    
    getUnreadCount: () => {
        return AppState.notifications.filter(n => !n.read).length;
    }
};

// ========== Reminder Manager ==========
const ReminderManager = {
    set: (task) => {
        if (!('Notification' in window)) return;
        
        if (Notification.permission === 'granted') {
            ReminderManager.schedule(task);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    ReminderManager.schedule(task);
                }
            });
        }
    },
    
    schedule: (task) => {
        if (!task.date || !task.time || task.reminder === 'none') return;
        
        const reminderMinutes = parseInt(task.reminder);
        const taskDateTime = new Date(`${task.date}T${task.time}`);
        const reminderTime = new Date(taskDateTime.getTime() - reminderMinutes * 60000);
        const now = new Date();
        
        if (reminderTime > now) {
            const delay = reminderTime - now;
            setTimeout(() => {
                new Notification('مهامي - تذكير', {
                    body: task.title,
                    icon: 'icons/icon-192.png',
                    badge: 'icons/icon-192.png',
                    tag: task.id,
                    vibrate: [200, 100, 200]
                });
                
                if (AppState.settings.soundEnabled) {
                    ReminderManager.playSound();
                }
            }, delay);
        }
    },
    
    playSound: () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
};

// ========== Stats Manager ==========
const StatsManager = {
    updateStreak: () => {
        const today = new Date().toDateString();
        const lastDate = AppState.stats.lastCompletedDate;
        
        if (lastDate === today) {
            // Already completed task today
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate === yesterday.toDateString()) {
            // Continuing streak
            AppState.stats.streak++;
        } else if (lastDate !== today) {
            // Streak broken
            AppState.stats.streak = 1;
        }
        
        AppState.stats.lastCompletedDate = today;
        
        if (AppState.stats.streak > AppState.stats.bestStreak) {
            AppState.stats.bestStreak = AppState.stats.streak;
        }
        
        Storage.save('stats', AppState.stats);
    },
    
    getWeeklyData: () => {
        const data = [0, 0, 0, 0, 0, 0, 0];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split('T')[0];
            
            const completedCount = AppState.tasks.filter(t => {
                if (!t.completedAt) return false;
                const completedDate = new Date(t.completedAt).toISOString().split('T')[0];
                return completedDate === dateStr;
            }).length;
            
            data[i] = completedCount;
        }
        
        return data;
    }
};

// ========== Achievement Manager ==========
const AchievementManager = {
    badges: [
        { id: 'first', name: 'البداية', desc: 'أكمل أول مهمة', icon: '🎯', condition: () => AppState.stats.totalCompleted >= 1 },
        { id: 'ten', name: 'عشرة مهام', desc: 'أكمل 10 مهام', icon: '🔟', condition: () => AppState.stats.totalCompleted >= 10 },
        { id: 'fifty', name: 'خمسون مهمة', desc: 'أكمل 50 مهمة', icon: '🎖️', condition: () => AppState.stats.totalCompleted >= 50 },
        { id: 'hundred', name: 'مئة مهمة', desc: 'أكمل 100 مهمة', icon: '🏆', condition: () => AppState.stats.totalCompleted >= 100 },
        { id: 'streak3', name: '3 أيام متتالية', desc: 'أكمل مهام 3 أيام متتالية', icon: '🔥', condition: () => AppState.stats.streak >= 3 },
        { id: 'streak7', name: 'أسبوع كامل', desc: 'أكمل مهام 7 أيام متتالية', icon: '⭐', condition: () => AppState.stats.streak >= 7 },
        { id: 'streak30', name: 'شهر كامل', desc: 'أكمل مهام 30 يوم متتالي', icon: '👑', condition: () => AppState.stats.streak >= 30 },
        { id: 'organizer', name: 'المنظم', desc: 'أضف 20 مهمة', icon: '📋', condition: () => AppState.tasks.length >= 20 }
    ],
    
    check: () => {
        AchievementManager.badges.forEach(badge => {
            if (badge.condition() && !AppState.achievements.includes(badge.id)) {
                AppState.achievements.push(badge.id);
                Storage.save('achievements', AppState.achievements);
                
                NotificationManager.add({
                    type: 'success',
                    title: 'شارة جديدة!',
                    message: `حصلت على شارة "${badge.name}"`
                });
                
                Toast.show(`🎉 حصلت على شارة "${badge.name}"`, 'success');
            }
        });
    },
    
    getUnlocked: () => {
        return AchievementManager.badges.filter(b => AppState.achievements.includes(b.id));
    },
    
    getLocked: () => {
        return AchievementManager.badges.filter(b => !AppState.achievements.includes(b.id));
    }
};

// ========== Backup Manager ==========
const BackupManager = {
    create: () => {
        const backup = {
            version: '1.0.0',
            createdAt: Date.now(),
            data: {
                tasks: AppState.tasks,
                notes: AppState.notes,
                achievements: AppState.achievements,
                settings: AppState.settings,
                stats: AppState.stats
            }
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mahamey-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        Storage.save('lastBackup', Date.now());
        UI.updateBackupInfo();
        Toast.show('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
    },
    
    restore: (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                
                if (backup.data) {
                    AppState.tasks = backup.data.tasks || [];
                    AppState.notes = backup.data.notes || [];
                    AppState.achievements = backup.data.achievements || [];
                    AppState.settings = { ...AppState.settings, ...backup.data.settings };
                    AppState.stats = { ...AppState.stats, ...backup.data.stats };
                    
                    Storage.saveAll();
                    UI.applySettings();
                    UI.renderCurrentPage();
                    
                    Toast.show('تم استعادة النسخة الاحتياطية بنجاح', 'success');
                } else {
                    Toast.show('ملف النسخة الاحتياطية غير صالح', 'error');
                }
            } catch (error) {
                Toast.show('خطأ في قراءة ملف النسخة الاحتياطية', 'error');
            }
        };
        reader.readAsText(file);
    }
};

// ========== Report Manager ==========
const ReportManager = {
    generate: (type, startDate = null, endDate = null) => {
        let tasks = [];
        let title = '';
        
        switch (type) {
            case 'daily':
                const today = new Date().toISOString().split('T')[0];
                tasks = AppState.tasks.filter(t => t.date === today || 
                    (t.createdAt && new Date(t.createdAt).toISOString().split('T')[0] === today));
                title = `التقرير اليومي - ${Utils.formatDate(today)}`;
                break;
                
            case 'weekly':
                tasks = AppState.tasks.filter(t => t.date && Utils.isThisWeek(t.date));
                title = 'التقرير الأسبوعي';
                break;
                
            case 'monthly':
                const thisMonth = new Date().toISOString().slice(0, 7);
                tasks = AppState.tasks.filter(t => t.date && t.date.startsWith(thisMonth));
                title = `التقرير الشهري - ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}`;
                break;
                
            case 'custom':
                if (startDate && endDate) {
                    tasks = AppState.tasks.filter(t => {
                        if (!t.date) return false;
                        return t.date >= startDate && t.date <= endDate;
                    });
                    title = `تقرير مخصص: ${Utils.formatDate(startDate)} - ${Utils.formatDate(endDate)}`;
                }
                break;
        }
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        const byCategory = {};
        const byPriority = {};
        
        tasks.forEach(t => {
            byCategory[t.category] = (byCategory[t.category] || 0) + 1;
            byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
        });
        
        return {
            title,
            total,
            completed,
            pending,
            completionRate,
            byCategory,
            byPriority,
            tasks
        };
    },
    
    render: (report) => {
        let html = `
            <div class="report-stats">
                <div class="report-stat">
                    <span class="report-stat-value">${report.total}</span>
                    <span class="report-stat-label">إجمالي المهام</span>
                </div>
                <div class="report-stat">
                    <span class="report-stat-value">${report.completed}</span>
                    <span class="report-stat-label">مكتملة</span>
                </div>
                <div class="report-stat">
                    <span class="report-stat-value">${report.pending}</span>
                    <span class="report-stat-label">قيد الانتظار</span>
                </div>
                <div class="report-stat">
                    <span class="report-stat-value">${report.completionRate}%</span>
                    <span class="report-stat-label">معدل الإنجاز</span>
                </div>
            </div>
        `;
        
        if (Object.keys(report.byCategory).length > 0) {
            html += '<h4>حسب التصنيف</h4><ul class="report-list">';
            for (const [cat, count] of Object.entries(report.byCategory)) {
                html += `<li>${Utils.getCategoryLabel(cat)}: ${count}</li>`;
            }
            html += '</ul>';
        }
        
        if (Object.keys(report.byPriority).length > 0) {
            html += '<h4>حسب الأولوية</h4><ul class="report-list">';
            for (const [priority, count] of Object.entries(report.byPriority)) {
                html += `<li>${Utils.getPriorityLabel(priority)}: ${count}</li>`;
            }
            html += '</ul>';
        }
        
        return html;
    }
};

// ========== Toast ==========
const Toast = {
    show: (message, type = 'info', duration = 3000) => {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');
        
        toast.className = `toast ${type}`;
        toastMessage.textContent = message;
        
        const icons = {
            success: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };
        
        toastIcon.innerHTML = icons[type] || icons.info;
        
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, duration);
    }
};

// ========== Confirm Dialog ==========
const Confirm = {
    show: (title, message) => {
        return new Promise((resolve) => {
            const dialog = document.getElementById('confirm-dialog');
            const confirmTitle = document.getElementById('confirm-title');
            const confirmMessage = document.getElementById('confirm-message');
            const confirmOk = document.getElementById('confirm-ok');
            const confirmCancel = document.getElementById('confirm-cancel');
            
            confirmTitle.textContent = title;
            confirmMessage.textContent = message;
            
            dialog.classList.add('active');
            
            const handleOk = () => {
                dialog.classList.remove('active');
                cleanup();
                resolve(true);
            };
            
            const handleCancel = () => {
                dialog.classList.remove('active');
                cleanup();
                resolve(false);
            };
            
            const cleanup = () => {
                confirmOk.removeEventListener('click', handleOk);
                confirmCancel.removeEventListener('click', handleCancel);
            };
            
            confirmOk.addEventListener('click', handleOk);
            confirmCancel.addEventListener('click', handleCancel);
        });
    }
};

// ========== UI Manager ==========
const UI = {
    init: () => {
        UI.bindEvents();
        UI.applySettings();
        UI.renderCurrentPage();
        UI.updateStats();
        UI.updateNotificationBadge();
    },
    
    bindEvents: () => {
        // Menu toggle
        document.getElementById('menu-toggle').addEventListener('click', UI.toggleSidebar);
        document.getElementById('sidebar-overlay').addEventListener('click', UI.closeSidebar);
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) {
                    navigateTo(page);
                    UI.closeSidebar();
                }
            });
        });
        
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) navigateTo(page);
            });
        });
        
        // FAB
        document.getElementById('fab').addEventListener('click', () => {
            navigateTo('add-task');
        });
        
        // Task filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AppState.currentFilter = btn.dataset.filter;
                UI.renderTasks();
            });
        });
        
        // Add task form
        document.getElementById('add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            UI.handleAddTask();
        });
        
        // Color picker
        document.querySelectorAll('.color-picker .color-option:not(.note-color)').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-picker .color-option:not(.note-color)').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Note modal
        document.getElementById('add-note-btn').addEventListener('click', () => {
            UI.openNoteModal();
        });
        
        document.getElementById('note-form').addEventListener('submit', (e) => {
            e.preventDefault();
            UI.handleSaveNote();
        });
        
        // Note color picker
        document.querySelectorAll('.note-color').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.note-color').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Multi tasks
        document.getElementById('add-multi-tasks').addEventListener('click', UI.handleAddMultiTasks);
        
        // Reports
        document.querySelectorAll('.report-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.report;
                if (type === 'custom') {
                    UI.openDateRangeModal();
                } else {
                    UI.generateReport(type);
                }
            });
        });
        
        document.getElementById('date-range-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            closeDateRangeModal();
            UI.generateReport('custom', startDate, endDate);
        });
        
        // Import
        document.getElementById('import-file').addEventListener('change', UI.handleImportFile);
        document.getElementById('paste-tasks-btn').addEventListener('click', UI.handlePasteTasks);
        document.getElementById('confirm-import').addEventListener('click', UI.confirmImport);
        document.getElementById('cancel-import').addEventListener('click', UI.cancelImport);
        
        // Backup
        document.getElementById('create-backup').addEventListener('click', BackupManager.create);
        document.getElementById('restore-file').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                BackupManager.restore(e.target.files[0]);
            }
        });
        
        // Settings
        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            AppState.settings.darkMode = e.target.checked;
            UI.applyDarkMode();
            Storage.save('settings', AppState.settings);
        });
        
        document.querySelectorAll('.theme-color').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.theme-color').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AppState.settings.themeColor = btn.dataset.themeColor;
                UI.applyThemeColor();
                Storage.save('settings', AppState.settings);
            });
        });
        
        document.getElementById('font-select').addEventListener('change', (e) => {
            AppState.settings.font = e.target.value;
            UI.applyFont();
            Storage.save('settings', AppState.settings);
        });
        
        document.getElementById('font-size-select').addEventListener('change', (e) => {
            AppState.settings.fontSize = e.target.value;
            UI.applyFontSize();
            Storage.save('settings', AppState.settings);
        });
        
        document.getElementById('notifications-toggle').addEventListener('change', (e) => {
            AppState.settings.notificationsEnabled = e.target.checked;
            Storage.save('settings', AppState.settings);
        });
        
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            AppState.settings.soundEnabled = e.target.checked;
            Storage.save('settings', AppState.settings);
        });
        
        document.getElementById('clear-data-btn').addEventListener('click', async () => {
            const confirmed = await Confirm.show('مسح البيانات', 'هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.');
            if (confirmed) {
                Storage.clear();
                location.reload();
            }
        });
        
        // Clear notifications
        document.getElementById('clear-notifications').addEventListener('click', () => {
            NotificationManager.clearAll();
            UI.renderNotifications();
        });
        
        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                UI.shareAchievements(btn.dataset.platform);
            });
        });
        
        // Log date filter
        document.getElementById('log-date-filter').addEventListener('change', (e) => {
            UI.renderTaskLog(e.target.value);
        });
        
        // Notifications button
        document.getElementById('notifications-btn').addEventListener('click', () => {
            navigateTo('notifications');
        });
    },
    
    toggleSidebar: () => {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('sidebar-overlay').classList.toggle('active');
    },
    
    closeSidebar: () => {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
    },
    
    applySettings: () => {
        UI.applyDarkMode();
        UI.applyThemeColor();
        UI.applyFont();
        UI.applyFontSize();
        
        // Update UI to reflect settings
        document.getElementById('dark-mode-toggle').checked = AppState.settings.darkMode;
        document.getElementById('font-select').value = AppState.settings.font;
        document.getElementById('font-size-select').value = AppState.settings.fontSize;
        document.getElementById('notifications-toggle').checked = AppState.settings.notificationsEnabled;
        document.getElementById('sound-toggle').checked = AppState.settings.soundEnabled;
        
        document.querySelectorAll('.theme-color').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeColor === AppState.settings.themeColor);
        });
    },
    
    applyDarkMode: () => {
        document.body.classList.toggle('dark-mode', AppState.settings.darkMode);
        document.querySelector('meta[name="theme-color"]').content = 
            AppState.settings.darkMode ? '#1e293b' : AppState.settings.themeColor;
    },
    
    applyThemeColor: () => {
        document.body.setAttribute('data-theme-color', AppState.settings.themeColor);
        document.documentElement.style.setProperty('--primary-color', AppState.settings.themeColor);
    },
    
    applyFont: () => {
        document.body.classList.remove('font-dubai', 'font-idris');
        if (AppState.settings.font === 'Dubai') {
            document.body.classList.add('font-dubai');
        } else if (AppState.settings.font === '29LT Idris') {
            document.body.classList.add('font-idris');
        }
    },
    
    applyFontSize: () => {
        document.body.classList.remove('font-small', 'font-large');
        if (AppState.settings.fontSize === 'small') {
            document.body.classList.add('font-small');
        } else if (AppState.settings.fontSize === 'large') {
            document.body.classList.add('font-large');
        }
    },
    
    renderCurrentPage: () => {
        switch (AppState.currentPage) {
            case 'tasks':
                UI.renderTasks();
                break;
            case 'achievements':
                UI.renderAchievements();
                break;
            case 'task-log':
                UI.renderTaskLog();
                break;
            case 'kpi-board':
                UI.renderKPIBoard();
                break;
            case 'notes':
                UI.renderNotes();
                break;
            case 'notifications':
                UI.renderNotifications();
                break;
            case 'task-achievements':
                UI.renderTaskAchievements();
                break;
            case 'backup':
                UI.updateBackupInfo();
                break;
        }
    },
    
    renderTasks: () => {
        const tasks = TaskManager.getFiltered(AppState.currentFilter);
        const container = document.getElementById('tasks-list');
        
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 11l3 3L22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    <h3>لا توجد مهام</h3>
                    <p>ابدأ بإضافة مهمة جديدة</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}" style="border-right-color: ${task.color}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="event.stopPropagation(); toggleTask('${task.id}')">
                    ${task.completed ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                </div>
                <div class="task-content" onclick="openTaskDetail('${task.id}')">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-meta">
                        <span class="task-meta-item">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                            </svg>
                            ${task.date ? Utils.formatDate(task.date) : 'بدون تاريخ'}
                        </span>
                        <span class="task-priority ${task.priority}">${Utils.getPriorityLabel(task.priority)}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        UI.updateStats();
    },
    
    updateStats: () => {
        const stats = TaskManager.getStats();
        document.getElementById('pending-count').textContent = stats.pending;
        document.getElementById('completed-count').textContent = stats.completed;
        document.getElementById('total-count').textContent = stats.total;
    },
    
    handleAddTask: () => {
        const title = document.getElementById('task-title').value.trim();
        if (!title) {
            Toast.show('الرجاء إدخال عنوان المهمة', 'warning');
            return;
        }
        
        const task = {
            title,
            description: document.getElementById('task-description').value.trim(),
            category: document.getElementById('task-category').value,
            priority: document.getElementById('task-priority').value,
            date: document.getElementById('task-date').value,
            time: document.getElementById('task-time').value,
            reminder: document.getElementById('task-reminder').value,
            color: document.querySelector('.color-picker .color-option.active:not(.note-color)')?.dataset.color || '#6366f1'
        };
        
        TaskManager.add(task);
        
        // Reset form
        document.getElementById('add-task-form').reset();
        document.querySelectorAll('.color-picker .color-option:not(.note-color)').forEach((btn, i) => {
            btn.classList.toggle('active', i === 0);
        });
        
        Toast.show('تمت إضافة المهمة بنجاح', 'success');
        navigateTo('tasks');
    },
    
    handleAddMultiTasks: () => {
        const input = document.getElementById('multi-tasks-input').value.trim();
        if (!input) {
            Toast.show('الرجاء إدخال المهام', 'warning');
            return;
        }
        
        const category = document.getElementById('multi-category').value;
        const priority = document.getElementById('multi-priority').value;
        
        const tasks = input.split('\n').filter(t => t.trim());
        let addedCount = 0;
        
        tasks.forEach(title => {
            if (title.trim()) {
                TaskManager.add({ title: title.trim(), category, priority });
                addedCount++;
            }
        });
        
        document.getElementById('multi-tasks-input').value = '';
        Toast.show(`تمت إضافة ${addedCount} مهمة بنجاح`, 'success');
        navigateTo('tasks');
    },
    
    renderAchievements: () => {
        const stats = TaskManager.getStats();
        const progress = stats.completionRate;
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (progress / 100) * circumference;
        
        document.getElementById('achievement-progress').style.strokeDashoffset = offset;
        document.getElementById('achievement-value').textContent = progress;
        
        const achievementText = document.getElementById('achievement-text');
        if (progress === 0) {
            achievementText.textContent = 'لم تكمل أي مهام بعد';
        } else if (progress < 25) {
            achievementText.textContent = 'بداية جيدة! استمر في العمل';
        } else if (progress < 50) {
            achievementText.textContent = 'أداء جيد! أنت في المسار الصحيح';
        } else if (progress < 75) {
            achievementText.textContent = 'رائع! أكثر من نصف المهام مكتملة';
        } else if (progress < 100) {
            achievementText.textContent = 'ممتاز! اقتربت من إنهاء جميع المهام';
        } else {
            achievementText.textContent = 'مذهل! أكملت جميع المهام 🎉';
        }
        
        // Render badges
        const badgesContainer = document.getElementById('badges-container');
        const unlocked = AchievementManager.getUnlocked();
        const locked = AchievementManager.getLocked();
        
        badgesContainer.innerHTML = [...unlocked, ...locked].map(badge => `
            <div class="badge-item ${!unlocked.includes(badge) ? 'locked' : ''}">
                <div class="badge-icon">${badge.icon}</div>
                <span class="badge-name">${badge.name}</span>
            </div>
        `).join('');
    },
    
    renderTaskLog: (filterDate = null) => {
        const container = document.getElementById('task-log-list');
        let tasks = AppState.tasks;
        
        if (filterDate) {
            tasks = tasks.filter(t => t.date === filterDate || 
                (t.createdAt && new Date(t.createdAt).toISOString().split('T')[0] === filterDate));
        }
        
        // Group by date
        const grouped = {};
        tasks.forEach(task => {
            const date = task.date || new Date(task.createdAt).toISOString().split('T')[0];
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(task);
        });
        
        if (Object.keys(grouped).length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <h3>لا يوجد سجل</h3>
                    <p>سجل المهام فارغ حالياً</p>
                </div>
            `;
            return;
        }
        
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
        
        container.innerHTML = sortedDates.map(date => `
            <div class="log-item">
                <div class="log-date">${Utils.formatDate(date)} - ${Utils.getWeekDay(date)}</div>
                <div class="log-tasks">
                    ${grouped[date].map(t => `
                        <div class="task-item ${t.completed ? 'completed' : ''}" style="margin-top: 8px; border-right-color: ${t.color}">
                            <div class="task-checkbox ${t.completed ? 'checked' : ''}">
                                ${t.completed ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                            </div>
                            <div class="task-content">
                                <h3 class="task-title">${t.title}</h3>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },
    
    renderKPIBoard: () => {
        const stats = TaskManager.getStats();
        const todayTasks = TaskManager.getTodayTasks();
        const weekTasks = TaskManager.getWeekTasks().filter(t => t.completed);
        
        document.getElementById('kpi-today').textContent = todayTasks.length;
        document.getElementById('kpi-completion').textContent = `${stats.completionRate}%`;
        document.getElementById('kpi-completion-bar').style.width = `${stats.completionRate}%`;
        document.getElementById('kpi-week').textContent = weekTasks.length;
        document.getElementById('kpi-streak').textContent = AppState.stats.streak;
        
        // Weekly chart
        const weeklyData = StatsManager.getWeeklyData();
        const maxValue = Math.max(...weeklyData, 1);
        const chartContainer = document.getElementById('weekly-chart');
        
        chartContainer.innerHTML = weeklyData.map(value => `
            <div class="chart-bar" style="height: ${(value / maxValue) * 100}%"></div>
        `).join('');
    },
    
    renderNotes: () => {
        const container = document.getElementById('notes-list');
        
        if (AppState.notes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <h3>لا توجد ملاحظات</h3>
                    <p>ابدأ بإضافة ملاحظة جديدة</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = AppState.notes.map(note => `
            <div class="note-card" style="background: ${note.color}" onclick="openNoteModal('${note.id}')">
                <button class="note-delete" onclick="event.stopPropagation(); deleteNote('${note.id}')">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
                <h3 class="note-title">${note.title}</h3>
                <p class="note-content">${note.content}</p>
                <span class="note-date">${Utils.getRelativeTime(note.updatedAt)}</span>
            </div>
        `).join('');
    },
    
    openNoteModal: (noteId = null) => {
        const modal = document.getElementById('note-modal');
        const title = document.getElementById('note-modal-title');
        const form = document.getElementById('note-form');
        
        if (noteId) {
            const note = AppState.notes.find(n => n.id === noteId);
            if (note) {
                title.textContent = 'تعديل الملاحظة';
                document.getElementById('note-id').value = note.id;
                document.getElementById('note-title').value = note.title;
                document.getElementById('note-content').value = note.content;
                
                document.querySelectorAll('.note-color').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.color === note.color);
                });
                
                AppState.selectedNote = note;
            }
        } else {
            title.textContent = 'ملاحظة جديدة';
            form.reset();
            document.getElementById('note-id').value = '';
            document.querySelectorAll('.note-color').forEach((btn, i) => {
                btn.classList.toggle('active', i === 0);
            });
            AppState.selectedNote = null;
        }
        
        modal.classList.add('active');
    },
    
    handleSaveNote: () => {
        const noteId = document.getElementById('note-id').value;
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const color = document.querySelector('.note-color.active')?.dataset.color || '#fef3c7';
        
        if (!title) {
            Toast.show('الرجاء إدخال عنوان الملاحظة', 'warning');
            return;
        }
        
        if (noteId) {
            NoteManager.update(noteId, { title, content, color });
            Toast.show('تم تحديث الملاحظة', 'success');
        } else {
            NoteManager.add({ title, content, color });
            Toast.show('تمت إضافة الملاحظة', 'success');
        }
        
        closeNoteModal();
        UI.renderNotes();
    },
    
    renderNotifications: () => {
        const container = document.getElementById('notifications-list');
        
        if (AppState.notifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <h3>لا توجد تنبيهات</h3>
                    <p>ستظهر التنبيهات هنا</p>
                </div>
            `;
            return;
        }
        
        const icons = {
            success: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };
        
        container.innerHTML = AppState.notifications.map(notif => `
            <div class="notification-item" onclick="NotificationManager.markAsRead('${notif.id}')">
                <div class="notification-icon ${notif.type}">
                    ${icons[notif.type] || icons.info}
                </div>
                <div class="notification-content">
                    <h4 class="notification-title">${notif.title}</h4>
                    <p class="notification-text">${notif.message}</p>
                    <span class="notification-time">${Utils.getRelativeTime(notif.createdAt)}</span>
                </div>
            </div>
        `).join('');
    },
    
    renderTaskAchievements: () => {
        document.getElementById('total-achievements').textContent = AppState.stats.totalCompleted;
        document.getElementById('best-streak').textContent = AppState.stats.bestStreak;
        
        const container = document.getElementById('achievements-list');
        const achievements = AchievementManager.getUnlocked();
        
        if (achievements.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <h3>لا توجد إنجازات</h3>
                    <p>أكمل المهام لفتح الإنجازات</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = achievements.map(badge => `
            <div class="achievement-item">
                <div class="achievement-icon-wrapper">${badge.icon}</div>
                <div class="achievement-info">
                    <h4 class="achievement-name">${badge.name}</h4>
                    <p class="achievement-desc">${badge.desc}</p>
                </div>
            </div>
        `).join('');
    },
    
    updateNotificationBadge: () => {
        const count = NotificationManager.getUnreadCount();
        const badge = document.getElementById('notification-badge');
        
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    },
    
    updateBackupInfo: () => {
        const lastBackup = Storage.load('lastBackup');
        const infoEl = document.getElementById('last-backup');
        
        if (lastBackup) {
            infoEl.textContent = `آخر نسخة: ${Utils.formatDate(lastBackup)}`;
        } else {
            infoEl.textContent = 'آخر نسخة: لم يتم إنشاء نسخة بعد';
        }
    },
    
    generateReport: (type, startDate = null, endDate = null) => {
        const report = ReportManager.generate(type, startDate, endDate);
        
        document.getElementById('report-title').textContent = report.title;
        document.getElementById('report-content').innerHTML = ReportManager.render(report);
        document.getElementById('report-preview').classList.remove('hidden');
    },
    
    openDateRangeModal: () => {
        document.getElementById('date-range-modal').classList.add('active');
    },
    
    handleImportFile: (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                let tasks = [];
                
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(event.target.result);
                    tasks = Array.isArray(data) ? data : data.tasks || [];
                } else if (file.name.endsWith('.csv')) {
                    const lines = event.target.result.split('\n');
                    tasks = lines.slice(1).map(line => {
                        const [title] = line.split(',');
                        return { title: title?.trim() };
                    }).filter(t => t.title);
                }
                
                if (tasks.length > 0) {
                    AppState.importBuffer = tasks;
                    UI.showImportPreview(tasks);
                } else {
                    Toast.show('لم يتم العثور على مهام في الملف', 'warning');
                }
            } catch (error) {
                Toast.show('خطأ في قراءة الملف', 'error');
            }
        };
        reader.readAsText(file);
    },
    
    handlePasteTasks: async () => {
        try {
            const text = await navigator.clipboard.readText();
            const tasks = text.split('\n').filter(t => t.trim()).map(title => ({ title: title.trim() }));
            
            if (tasks.length > 0) {
                AppState.importBuffer = tasks;
                UI.showImportPreview(tasks);
            } else {
                Toast.show('لم يتم العثور على مهام', 'warning');
            }
        } catch (error) {
            Toast.show('لا يمكن قراءة الحافظة', 'error');
        }
    },
    
    showImportPreview: (tasks) => {
        const container = document.getElementById('import-list');
        container.innerHTML = tasks.map((task, i) => `
            <div class="task-item" style="margin-bottom: 8px">
                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>
                </div>
            </div>
        `).join('');
        
        document.getElementById('import-preview').classList.remove('hidden');
    },
    
    confirmImport: () => {
        if (AppState.importBuffer && AppState.importBuffer.length > 0) {
            AppState.importBuffer.forEach(task => {
                TaskManager.add({
                    title: task.title,
                    description: task.description || '',
                    category: task.category || 'personal',
                    priority: task.priority || 'medium'
                });
            });
            
            Toast.show(`تم استيراد ${AppState.importBuffer.length} مهمة`, 'success');
            AppState.importBuffer = null;
            document.getElementById('import-preview').classList.add('hidden');
            navigateTo('tasks');
        }
    },
    
    cancelImport: () => {
        AppState.importBuffer = null;
        document.getElementById('import-preview').classList.add('hidden');
    },
    
    shareAchievements: (platform) => {
        const stats = AppState.stats;
        const text = `🎯 إنجازاتي في تطبيق مهامي:\n✅ ${stats.totalCompleted} مهمة مكتملة\n🔥 ${stats.streak} أيام متتالية\n⭐ أفضل سلسلة: ${stats.bestStreak} يوم\n\n#مهامي #إنجاز`;
        
        const urls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
            telegram: `https://t.me/share/url?text=${encodeURIComponent(text)}`
        };
        
        window.open(urls[platform], '_blank');
    }
};

// ========== Global Functions ==========
function navigateTo(page) {
    AppState.currentPage = page;
    
    // Update active states
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`)?.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    // Update header title
    const titles = {
        tasks: 'مهامي',
        achievements: 'الإنجاز',
        'add-task': 'إضافة مهمة',
        'task-log': 'سجل المهام',
        'kpi-board': 'لوحة الأداء',
        notes: 'المذكرة',
        reports: 'التقارير',
        'import-task': 'استيراد مهمة',
        'multi-tasks': 'مهام متعددة',
        notifications: 'التنبيهات',
        'task-achievements': 'الإنجازات',
        settings: 'الإعدادات',
        backup: 'النسخ الاحتياطي',
        about: 'عن البرنامج',
        licenses: 'رخص الطرف الثالث',
        disclaimer: 'إخلاء المسؤولية'
    };
    
    document.getElementById('page-title').textContent = titles[page] || 'مهامي';
    
    UI.renderCurrentPage();
}

function toggleTask(id) {
    TaskManager.toggle(id);
    UI.renderTasks();
    UI.renderAchievements();
}

function openTaskDetail(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (!task) return;
    
    AppState.selectedTask = task;
    
    const modal = document.getElementById('task-modal');
    document.getElementById('task-modal-title').textContent = task.title;
    
    document.getElementById('task-detail-content').innerHTML = `
        <h3 class="task-detail-title">${task.title}</h3>
        ${task.description ? `<p class="task-detail-desc">${task.description}</p>` : ''}
        <div class="task-detail-meta">
            <div class="task-detail-item">
                <label>التصنيف</label>
                <span>${Utils.getCategoryLabel(task.category)}</span>
            </div>
            <div class="task-detail-item">
                <label>الأولوية</label>
                <span class="task-priority ${task.priority}">${Utils.getPriorityLabel(task.priority)}</span>
            </div>
            <div class="task-detail-item">
                <label>الموعد</label>
                <span>${Utils.formatDateTime(task.date, task.time) || 'غير محدد'}</span>
            </div>
            <div class="task-detail-item">
                <label>الحالة</label>
                <span>${task.completed ? 'مكتملة ✓' : 'قيد الانتظار'}</span>
            </div>
        </div>
    `;
    
    document.getElementById('delete-task-btn').onclick = async () => {
        const confirmed = await Confirm.show('حذف المهمة', 'هل أنت متأكد من حذف هذه المهمة؟');
        if (confirmed) {
            TaskManager.delete(id);
            closeTaskModal();
            UI.renderTasks();
            Toast.show('تم حذف المهمة', 'success');
        }
    };
    
    modal.classList.add('active');
}

function closeTaskModal() {
    document.getElementById('task-modal').classList.remove('active');
    AppState.selectedTask = null;
}

function closeNoteModal() {
    document.getElementById('note-modal').classList.remove('active');
    AppState.selectedNote = null;
}

function closeDateRangeModal() {
    document.getElementById('date-range-modal').classList.remove('active');
}

async function deleteNote(id) {
    const confirmed = await Confirm.show('حذف الملاحظة', 'هل أنت متأكد من حذف هذه الملاحظة؟');
    if (confirmed) {
        NoteManager.delete(id);
        UI.renderNotes();
        Toast.show('تم حذف الملاحظة', 'success');
    }
}

function openNoteModal(noteId = null) {
    UI.openNoteModal(noteId);
}

// ========== Service Worker Registration ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ========== App Initialization ==========
document.addEventListener('DOMContentLoaded', () => {
    // Load saved data
    Storage.loadAll();
    
    // Hide splash screen after delay
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        
        // Initialize UI
        UI.init();
        
        // Check achievements
        AchievementManager.check();
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, 2000);
});

// ========== Handle back button ==========
window.addEventListener('popstate', () => {
    if (AppState.currentPage !== 'tasks') {
        navigateTo('tasks');
    }
});

// ========== Handle visibility change ==========
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        UI.renderCurrentPage();
    }
});
