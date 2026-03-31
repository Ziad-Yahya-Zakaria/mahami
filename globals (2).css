// وحدة النسخ الاحتياطي والاستعادة - مهامي PWA
// تطوير: زياد يحيى زكريا - فريق ZIADPWA

class BackupManager {
    constructor() {
        this.version = '1.0.0';
        this.appName = 'mahamey';
    }

    // الحصول على جميع بيانات التطبيق
    getAllData() {
        const data = {
            version: this.version,
            appName: this.appName,
            exportDate: new Date().toISOString(),
            data: {
                tasks: JSON.parse(localStorage.getItem('mahamey_tasks') || '[]'),
                achievements: JSON.parse(localStorage.getItem('mahamey_achievements') || '[]'),
                notes: JSON.parse(localStorage.getItem('mahamey_notes') || '[]'),
                settings: JSON.parse(localStorage.getItem('mahamey_settings') || '{}'),
                theme: localStorage.getItem('mahamey_theme') || 'dark',
                font: localStorage.getItem('mahamey_font') || 'Cairo',
                colors: JSON.parse(localStorage.getItem('mahamey_colors') || '{}'),
                notifications: JSON.parse(localStorage.getItem('mahamey_notifications') || '[]'),
                categories: JSON.parse(localStorage.getItem('mahamey_categories') || '[]'),
                tags: JSON.parse(localStorage.getItem('mahamey_tags') || '[]'),
                history: JSON.parse(localStorage.getItem('mahamey_history') || '[]')
            }
        };
        return data;
    }

    // إنشاء نسخة احتياطية
    createBackup(options = {}) {
        const {
            includeSettings = true,
            includeTasks = true,
            includeAchievements = true,
            includeNotes = true,
            compress = false
        } = options;

        let backupData = {
            version: this.version,
            appName: this.appName,
            exportDate: new Date().toISOString(),
            device: this.getDeviceInfo(),
            data: {}
        };

        if (includeTasks) {
            backupData.data.tasks = JSON.parse(localStorage.getItem('mahamey_tasks') || '[]');
            backupData.data.history = JSON.parse(localStorage.getItem('mahamey_history') || '[]');
        }

        if (includeAchievements) {
            backupData.data.achievements = JSON.parse(localStorage.getItem('mahamey_achievements') || '[]');
        }

        if (includeNotes) {
            backupData.data.notes = JSON.parse(localStorage.getItem('mahamey_notes') || '[]');
        }

        if (includeSettings) {
            backupData.data.settings = JSON.parse(localStorage.getItem('mahamey_settings') || '{}');
            backupData.data.theme = localStorage.getItem('mahamey_theme') || 'dark';
            backupData.data.font = localStorage.getItem('mahamey_font') || 'Cairo';
            backupData.data.colors = JSON.parse(localStorage.getItem('mahamey_colors') || '{}');
            backupData.data.categories = JSON.parse(localStorage.getItem('mahamey_categories') || '[]');
            backupData.data.tags = JSON.parse(localStorage.getItem('mahamey_tags') || '[]');
        }

        const jsonStr = JSON.stringify(backupData, null, 2);
        
        if (compress) {
            return this.compressData(jsonStr);
        }

        return jsonStr;
    }

    // تنزيل النسخة الاحتياطية
    downloadBackup(options = {}) {
        const backupStr = this.createBackup(options);
        const date = new Date().toISOString().split('T')[0];
        const filename = `mahamey_backup_${date}.json`;

        const blob = new Blob([backupStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // إضافة للسجل
        this.addToHistory('backup', filename);

        return { success: true, filename };
    }

    // استعادة من نسخة احتياطية
    async restoreBackup(file, options = {}) {
        const {
            restoreSettings = true,
            restoreTasks = true,
            restoreAchievements = true,
            restoreNotes = true,
            mergeData = false
        } = options;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    let backupData = JSON.parse(e.target.result);

                    // التحقق من صحة الملف
                    if (!this.validateBackup(backupData)) {
                        reject({ success: false, error: 'ملف النسخة الاحتياطية غير صالح' });
                        return;
                    }

                    // إنشاء نسخة احتياطية قبل الاستعادة
                    const preRestoreBackup = this.createBackup();
                    localStorage.setItem('mahamey_pre_restore_backup', preRestoreBackup);

                    const data = backupData.data;

                    if (restoreTasks && data.tasks) {
                        if (mergeData) {
                            const existingTasks = JSON.parse(localStorage.getItem('mahamey_tasks') || '[]');
                            const mergedTasks = this.mergeArrays(existingTasks, data.tasks, 'id');
                            localStorage.setItem('mahamey_tasks', JSON.stringify(mergedTasks));
                        } else {
                            localStorage.setItem('mahamey_tasks', JSON.stringify(data.tasks));
                        }
                        
                        if (data.history) {
                            localStorage.setItem('mahamey_history', JSON.stringify(data.history));
                        }
                    }

                    if (restoreAchievements && data.achievements) {
                        if (mergeData) {
                            const existing = JSON.parse(localStorage.getItem('mahamey_achievements') || '[]');
                            const merged = this.mergeArrays(existing, data.achievements, 'id');
                            localStorage.setItem('mahamey_achievements', JSON.stringify(merged));
                        } else {
                            localStorage.setItem('mahamey_achievements', JSON.stringify(data.achievements));
                        }
                    }

                    if (restoreNotes && data.notes) {
                        if (mergeData) {
                            const existing = JSON.parse(localStorage.getItem('mahamey_notes') || '[]');
                            const merged = this.mergeArrays(existing, data.notes, 'id');
                            localStorage.setItem('mahamey_notes', JSON.stringify(merged));
                        } else {
                            localStorage.setItem('mahamey_notes', JSON.stringify(data.notes));
                        }
                    }

                    if (restoreSettings) {
                        if (data.settings) localStorage.setItem('mahamey_settings', JSON.stringify(data.settings));
                        if (data.theme) localStorage.setItem('mahamey_theme', data.theme);
                        if (data.font) localStorage.setItem('mahamey_font', data.font);
                        if (data.colors) localStorage.setItem('mahamey_colors', JSON.stringify(data.colors));
                        if (data.categories) localStorage.setItem('mahamey_categories', JSON.stringify(data.categories));
                        if (data.tags) localStorage.setItem('mahamey_tags', JSON.stringify(data.tags));
                    }

                    // إضافة للسجل
                    this.addToHistory('restore', file.name);

                    resolve({
                        success: true,
                        message: 'تمت استعادة النسخة الاحتياطية بنجاح',
                        restoredFrom: backupData.exportDate,
                        stats: {
                            tasks: data.tasks?.length || 0,
                            achievements: data.achievements?.length || 0,
                            notes: data.notes?.length || 0
                        }
                    });

                } catch (error) {
                    reject({ success: false, error: 'خطأ في قراءة الملف: ' + error.message });
                }
            };

            reader.onerror = () => {
                reject({ success: false, error: 'فشل في قراءة الملف' });
            };

            reader.readAsText(file);
        });
    }

    // التحقق من صحة النسخة الاحتياطية
    validateBackup(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.appName || data.appName !== this.appName) return false;
        if (!data.version) return false;
        if (!data.data || typeof data.data !== 'object') return false;
        return true;
    }

    // دمج المصفوفات
    mergeArrays(existing, incoming, key) {
        const merged = [...existing];
        const existingIds = new Set(existing.map(item => item[key]));

        incoming.forEach(item => {
            if (!existingIds.has(item[key])) {
                merged.push(item);
            }
        });

        return merged;
    }

    // معلومات الجهاز
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: screen.width,
            screenHeight: screen.height
        };
    }

    // إضافة للسجل
    addToHistory(action, filename) {
        const history = JSON.parse(localStorage.getItem('mahamey_backup_history') || '[]');
        history.push({
            action,
            filename,
            date: new Date().toISOString()
        });
        localStorage.setItem('mahamey_backup_history', JSON.stringify(history.slice(-50)));
    }

    // الحصول على سجل النسخ الاحتياطي
    getBackupHistory() {
        return JSON.parse(localStorage.getItem('mahamey_backup_history') || '[]');
    }

    // ضغط البيانات (بسيط)
    compressData(data) {
        // يمكن استخدام مكتبة ضغط حقيقية مثل pako
        return btoa(encodeURIComponent(data));
    }

    // فك ضغط البيانات
    decompressData(data) {
        return decodeURIComponent(atob(data));
    }

    // النسخ الاحتياطي التلقائي
    enableAutoBackup(intervalDays = 7) {
        const settings = JSON.parse(localStorage.getItem('mahamey_settings') || '{}');
        settings.autoBackup = true;
        settings.autoBackupInterval = intervalDays;
        settings.lastAutoBackup = new Date().toISOString();
        localStorage.setItem('mahamey_settings', JSON.stringify(settings));
    }

    // التحقق من الحاجة للنسخ الاحتياطي التلقائي
    checkAutoBackup() {
        const settings = JSON.parse(localStorage.getItem('mahamey_settings') || '{}');
        if (!settings.autoBackup) return false;

        const lastBackup = new Date(settings.lastAutoBackup || 0);
        const now = new Date();
        const daysDiff = Math.floor((now - lastBackup) / (1000 * 60 * 60 * 24));

        if (daysDiff >= (settings.autoBackupInterval || 7)) {
            this.downloadBackup();
            settings.lastAutoBackup = now.toISOString();
            localStorage.setItem('mahamey_settings', JSON.stringify(settings));
            return true;
        }

        return false;
    }

    // تصدير للمشاركة
    async shareBackup() {
        if (!navigator.share) {
            return { success: false, error: 'المشاركة غير مدعومة في هذا المتصفح' };
        }

        const backupStr = this.createBackup();
        const blob = new Blob([backupStr], { type: 'application/json' });
        const file = new File([blob], `mahamey_backup_${new Date().toISOString().split('T')[0]}.json`, {
            type: 'application/json'
        });

        try {
            await navigator.share({
                title: 'نسخة احتياطية - مهامي',
                text: 'نسخة احتياطية من تطبيق مهامي',
                files: [file]
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // استيراد من رابط
    async importFromUrl(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!this.validateBackup(data)) {
                return { success: false, error: 'الملف غير صالح' };
            }

            // إنشاء ملف وهمي للاستعادة
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const file = new File([blob], 'import.json');

            return this.restoreBackup(file);
        } catch (error) {
            return { success: false, error: 'فشل في استيراد الملف: ' + error.message };
        }
    }

    // مسح جميع البيانات
    clearAllData(keepSettings = false) {
        const keys = [
            'mahamey_tasks',
            'mahamey_achievements',
            'mahamey_notes',
            'mahamey_history',
            'mahamey_categories',
            'mahamey_tags',
            'mahamey_notifications'
        ];

        if (!keepSettings) {
            keys.push('mahamey_settings', 'mahamey_theme', 'mahamey_font', 'mahamey_colors');
        }

        keys.forEach(key => localStorage.removeItem(key));

        return { success: true, message: 'تم مسح جميع البيانات' };
    }

    // التراجع عن الاستعادة
    undoRestore() {
        const preRestoreBackup = localStorage.getItem('mahamey_pre_restore_backup');
        if (!preRestoreBackup) {
            return { success: false, error: 'لا توجد نسخة للتراجع' };
        }

        const blob = new Blob([preRestoreBackup], { type: 'application/json' });
        const file = new File([blob], 'undo.json');

        return this.restoreBackup(file, { mergeData: false });
    }
}

// تصدير الوحدة
window.BackupManager = BackupManager;
