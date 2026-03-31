// وحدة التنبيهات - مهامي PWA
// تطوير: زياد يحيى زكريا - فريق ZIADPWA

class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.scheduled = [];
        this.init();
    }

    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }
        this.loadScheduled();
        this.checkDueTasks();
    }

    // طلب الإذن
    async requestPermission() {
        if (!('Notification' in window)) {
            return { success: false, error: 'التنبيهات غير مدعومة في هذا المتصفح' };
        }

        const permission = await Notification.requestPermission();
        this.permission = permission;

        return {
            success: permission === 'granted',
            permission: permission
        };
    }

    // إرسال تنبيه
    async send(title, options = {}) {
        if (this.permission !== 'granted') {
            const result = await this.requestPermission();
            if (!result.success) return result;
        }

        const defaultOptions = {
            icon: './icons/icon-512x512.jpg',
            badge: './icons/icon-512x512.jpg',
            dir: 'rtl',
            lang: 'ar',
            vibrate: [100, 50, 100],
            requireInteraction: false,
            silent: false
        };

        const notification = new Notification(title, { ...defaultOptions, ...options });

        notification.onclick = () => {
            window.focus();
            if (options.onClick) options.onClick();
            notification.close();
        };

        notification.onclose = () => {
            if (options.onClose) options.onClose();
        };

        // تسجيل التنبيه
        this.logNotification(title, options);

        return { success: true, notification };
    }

    // تنبيه مهمة
    sendTaskNotification(task, type = 'reminder') {
        const messages = {
            reminder: `تذكير: ${task.title}`,
            due: `المهمة "${task.title}" مستحقة اليوم`,
            overdue: `المهمة "${task.title}" متأخرة!`,
            completed: `تم إنجاز المهمة: ${task.title}`
        };

        const icons = {
            reminder: './icons/reminder.png',
            due: './icons/due.png',
            overdue: './icons/overdue.png',
            completed: './icons/completed.png'
        };

        return this.send(messages[type] || task.title, {
            body: task.description || '',
            icon: icons[type] || './icons/icon-192x192.png',
            tag: `task-${task.id}`,
            data: { taskId: task.id, type },
            actions: [
                { action: 'view', title: 'عرض' },
                { action: 'complete', title: 'إنجاز' }
            ]
        });
    }

    // جدولة تنبيه
    schedule(title, options, scheduleTime) {
        const id = Date.now().toString();
        const scheduled = {
            id,
            title,
            options,
            scheduleTime: new Date(scheduleTime).getTime(),
            created: Date.now()
        };

        this.scheduled.push(scheduled);
        this.saveScheduled();

        // حساب الوقت المتبقي
        const delay = scheduled.scheduleTime - Date.now();
        if (delay > 0) {
            setTimeout(() => {
                this.send(title, options);
                this.removeScheduled(id);
            }, delay);
        }

        return { success: true, id };
    }

    // إلغاء تنبيه مجدول
    cancelScheduled(id) {
        this.scheduled = this.scheduled.filter(s => s.id !== id);
        this.saveScheduled();
        return { success: true };
    }

    // حفظ التنبيهات المجدولة
    saveScheduled() {
        localStorage.setItem('mahamey_scheduled_notifications', JSON.stringify(this.scheduled));
    }

    // تحميل التنبيهات المجدولة
    loadScheduled() {
        this.scheduled = JSON.parse(localStorage.getItem('mahamey_scheduled_notifications') || '[]');
        
        // إعادة جدولة التنبيهات
        this.scheduled.forEach(s => {
            const delay = s.scheduleTime - Date.now();
            if (delay > 0) {
                setTimeout(() => {
                    this.send(s.title, s.options);
                    this.removeScheduled(s.id);
                }, delay);
            }
        });
    }

    // إزالة تنبيه من القائمة
    removeScheduled(id) {
        this.scheduled = this.scheduled.filter(s => s.id !== id);
        this.saveScheduled();
    }

    // تسجيل التنبيه
    logNotification(title, options) {
        const logs = JSON.parse(localStorage.getItem('mahamey_notification_logs') || '[]');
        logs.push({
            title,
            body: options.body,
            date: new Date().toISOString()
        });
        // الاحتفاظ بآخر 100 تنبيه فقط
        localStorage.setItem('mahamey_notification_logs', JSON.stringify(logs.slice(-100)));
    }

    // الحصول على سجل التنبيهات
    getLogs() {
        return JSON.parse(localStorage.getItem('mahamey_notification_logs') || '[]');
    }

    // مسح سجل التنبيهات
    clearLogs() {
        localStorage.removeItem('mahamey_notification_logs');
        return { success: true };
    }

    // فحص المهام المستحقة
    checkDueTasks() {
        const tasks = JSON.parse(localStorage.getItem('mahamey_tasks') || '[]');
        const today = new Date().toISOString().split('T')[0];

        tasks.forEach(task => {
            if (task.status !== 'completed' && task.dueDate) {
                const dueDate = task.dueDate;
                
                if (dueDate === today) {
                    this.sendTaskNotification(task, 'due');
                } else if (dueDate < today) {
                    this.sendTaskNotification(task, 'overdue');
                }
            }
        });
    }

    // إعداد تنبيهات المهام
    setupTaskReminders() {
        const tasks = JSON.parse(localStorage.getItem('mahamey_tasks') || '[]');
        const settings = JSON.parse(localStorage.getItem('mahamey_settings') || '{}');
        const reminderTime = settings.reminderTime || '09:00';

        tasks.forEach(task => {
            if (task.status !== 'completed' && task.dueDate && task.reminder) {
                const reminderDate = new Date(task.dueDate);
                const [hours, minutes] = reminderTime.split(':');
                reminderDate.setHours(parseInt(hours), parseInt(minutes), 0);

                // تذكير قبل يوم
                if (settings.reminderDayBefore) {
                    const dayBefore = new Date(reminderDate);
                    dayBefore.setDate(dayBefore.getDate() - 1);
                    if (dayBefore > new Date()) {
                        this.schedule(`غداً: ${task.title}`, {
                            body: task.description,
                            tag: `task-reminder-${task.id}`
                        }, dayBefore);
                    }
                }

                // تذكير في نفس اليوم
                if (reminderDate > new Date()) {
                    this.schedule(`اليوم: ${task.title}`, {
                        body: task.description,
                        tag: `task-due-${task.id}`
                    }, reminderDate);
                }
            }
        });
    }

    // تنبيه الإنجاز
    sendAchievementNotification(achievement) {
        return this.send('إنجاز جديد!', {
            body: achievement.title,
            icon: './icons/achievement.png',
            tag: `achievement-${achievement.id}`,
            vibrate: [200, 100, 200]
        });
    }

    // تنبيه مخصص
    sendCustomNotification(message, options = {}) {
        return this.send(message, {
            body: options.body || '',
            icon: options.icon || './icons/icon-512x512.jpg',
            ...options
        });
    }

    // Push Notification عبر Service Worker
    async sendPushNotification(title, options) {
        if (!('serviceWorker' in navigator)) {
            return this.send(title, options);
        }

        const registration = await navigator.serviceWorker.ready;
        
        return registration.showNotification(title, {
            icon: './icons/icon-192x192.png',
            badge: './icons/icon-72x72.png',
            dir: 'rtl',
            lang: 'ar',
            ...options
        });
    }

    // الاشتراك في Push Notifications
    async subscribeToPush() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            return { success: false, error: 'Push غير مدعوم' };
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    // يجب استبدال هذا بمفتاح VAPID الخاص بك
                    'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
                )
            });

            return { success: true, subscription };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // تحويل مفتاح VAPID
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // إلغاء الاشتراك
    async unsubscribeFromPush() {
        if (!('serviceWorker' in navigator)) {
            return { success: false, error: 'Service Worker غير مدعوم' };
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                await subscription.unsubscribe();
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // الحصول على حالة الإذن
    getPermissionStatus() {
        return {
            supported: 'Notification' in window,
            permission: this.permission,
            pushSupported: 'PushManager' in window
        };
    }
}

// تصدير الوحدة
window.NotificationManager = NotificationManager;
