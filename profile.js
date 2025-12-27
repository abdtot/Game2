// profile.js - إدارة الملف الشخصي والإنجازات (نسخة كاملة محدثة)

// بيانات الإنجازات
let achievementsData = [
    { 
        id: "first_win", 
        title: "الفائز الأول", 
        description: "أكمل مستوى واحد", 
        icon: "fa-trophy", 
        earned: false,
        color: "#fdcb6e",
        points: 10,
        condition: (stats) => stats.completedLevels >= 1
    },
    { 
        id: "five_wins", 
        title: "بطل مبتدئ", 
        description: "أكمل 5 مستويات", 
        icon: "fa-medal", 
        earned: false,
        color: "#a29bfe",
        points: 25,
        condition: (stats) => stats.completedLevels >= 5
    },
    { 
        id: "ten_wins", 
        title: "بطل محترف", 
        description: "أكمل 10 مستويات", 
        icon: "fa-crown", 
        earned: false,
        color: "#6c5ce7",
        points: 50,
        condition: (stats) => stats.completedLevels >= 10
    },
    { 
        id: "daily_challenge", 
        title: "متحدي اليوم", 
        description: "أكمل التحدي اليومي", 
        icon: "fa-calendar", 
        earned: false,
        color: "#00b894",
        points: 30,
        condition: (stats) => stats.dailyChallengesCompleted >= 1
    },
    { 
        id: "speed_runner", 
        title: "عداء سريع", 
        description: "أكمل مستوى في أقل من 30 ثانية", 
        icon: "fa-stopwatch", 
        earned: false,
        color: "#fd79a8",
        points: 40,
        condition: (stats) => stats.fastCompletions >= 1
    },
    { 
        id: "hint_master", 
        title: "سيد التلميحات", 
        description: "أكمل مستوى دون استخدام تلميحات", 
        icon: "fa-lightbulb", 
        earned: false,
        color: "#fdcb6e",
        points: 35,
        condition: (stats) => stats.noHintCompletions >= 3
    },
    { 
        id: "puzzle_master", 
        title: "سيد الألغاز", 
        description: "أجب على 10 ألغاز ثقافية بشكل صحيح", 
        icon: "fa-puzzle-piece", 
        earned: false,
        color: "#74b9ff",
        points: 45,
        condition: (stats) => stats.culturalPuzzlesSolved >= 10
    },
    { 
        id: "perfect_score", 
        title: "نتيجة مثالية", 
        description: "أكمل 3 مستويات بنتيجة 3/3", 
        icon: "fa-star", 
        earned: false,
        color: "#ffeaa7",
        points: 60,
        condition: (stats) => stats.perfectScores >= 3
    },
    { 
        id: "stage_completer", 
        title: "فاتح المراحل", 
        description: "أكمل مرحلة كاملة", 
        icon: "fa-flag", 
        earned: false,
        color: "#55efc4",
        points: 100,
        condition: (stats) => stats.completedStages >= 1
    },
    { 
        id: "collector", 
        title: "جامع البطاقات", 
        description: "تطابق 50 بطاقة بشكل صحيح", 
        icon: "fa-layer-group", 
        earned: false,
        color: "#fd79a8",
        points: 75,
        condition: (stats) => stats.totalCardsMatched >= 50
    }
];

// متغيرات الملف الشخصي
let userProfileData = {
    name: "المستخدم",
    email: "",
    level: 1,
    totalPoints: 0,
    completedLevels: 0,
    successRate: 0,
    playTime: 0
};

// مؤقت التحديث التلقائي
let profileAutoUpdateInterval = null;
let isProfileScreenActive = false;

// تهيئة الملف الشخصي
function initProfileScreen() {
    console.log('جاري تهيئة شاشة الملف الشخصي...');
    
    // انتظر حتى يتم تحميل DOM بالكامل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupProfileScreen();
        });
    } else {
        // DOM محمل بالفعل
        setTimeout(() => {
            setupProfileScreen();
        }, 100);
    }
}

// إعداد شاشة الملف الشخصي
function setupProfileScreen() {
    console.log('جاري إعداد شاشة الملف الشخصي...');
    
    const trySetup = () => {
        // التحقق من وجود العناصر الأساسية
        const profileScreen = document.getElementById('profile-screen');
        const achievementsContainer = document.getElementById('achievements-container');
        
        if (profileScreen && achievementsContainer) {
            console.log('تم العثور على عناصر شاشة الملف الشخصي');
            
            // تحميل بيانات المستخدم من قاعدة البيانات
            loadAllProfileData();
            
            // إعداد مستمعي الأحداث
            setupProfileEventListeners();
            
            // إعداد مراقب نشاط الشاشة
            setupProfileScreenObserver();
            
        } else {
            console.log('العناصر غير جاهزة، إعادة المحاولة...');
            setTimeout(trySetup, 300);
        }
    };
    
    trySetup();
}

// إعداد مراقب لشاشة الملف الشخصي
function setupProfileScreenObserver() {
    const profileScreen = document.getElementById('profile-screen');
    if (!profileScreen) return;
    
    // مراقبة تغييرات الفئة
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (profileScreen.classList.contains('active')) {
                    console.log('شاشة الملف الشخصي أصبحت نشطة');
                    isProfileScreenActive = true;
                    startProfileAutoUpdate();
                    
                    // تحديث البيانات فوراً عند فتح الشاشة
                    setTimeout(() => {
                        loadAllProfileData();
                    }, 300);
                } else {
                    console.log('شاشة الملف الشخصي أصبحت غير نشطة');
                    isProfileScreenActive = false;
                    stopProfileAutoUpdate();
                }
            }
        });
    });
    
    observer.observe(profileScreen, { attributes: true });
}

// تحميل جميع بيانات الملف الشخصي
function loadAllProfileData() {
    console.log('جاري تحميل جميع بيانات الملف الشخصي...');
    
    // التحقق من وجود قاعدة البيانات
    if (!window.db) {
        console.error('قاعدة البيانات غير متاحة');
        showToast('قاعدة البيانات غير متاحة، جاري إعادة المحاولة...');
        
        // إعادة المحاولة بعد 2 ثانية
        setTimeout(loadAllProfileData, 2000);
        return;
    }
    
    // تحميل بيانات المستخدم الأساسية
    loadUserProfileFromDB(() => {
        // تحميل الإحصائيات
        loadProfileStats(() => {
            // تحميل الإنجازات
            loadAchievementsFromDB(() => {
                // تحديث واجهة المستخدم
                updateAllProfileUI();
                console.log('تم تحميل جميع بيانات الملف الشخصي بنجاح');
            });
        });
    });
}

// تحميل بيانات المستخدم من قاعدة البيانات
function loadUserProfileFromDB(callback) {
    console.log('جاري تحميل بيانات المستخدم من قاعدة البيانات...');
    
    try {
        const transaction = window.db.transaction(['user'], 'readonly');
        const userStore = transaction.objectStore('user');
        const request = userStore.get('profile');
        
        request.onsuccess = (event) => {
            const userData = event.target.result;
            
            if (userData) {
                console.log('تم تحميل بيانات المستخدم:', userData);
                
                // تحديث بيانات الملف الشخصي
                userProfileData.name = userData.name || "المستخدم";
                userProfileData.email = userData.email || "";
                userProfileData.playTime = userData.playTime || 0;
                userProfileData.totalPoints = userData.totalPoints || 0;
                userProfileData.completedLevels = userData.completedLevels || 0;
                
                // تحديث المتغيرات العامة
                window.userName = userProfileData.name;
                window.userEmail = userProfileData.email;
                window.playTime = userProfileData.playTime;
                window.totalPoints = userProfileData.totalPoints;
                
                if (callback) callback();
            } else {
                console.log('لا توجد بيانات مستخدم محفوظة، إنشاء بيانات افتراضية');
                createDefaultUserData(callback);
            }
        };
        
        request.onerror = (error) => {
            console.error('خطأ في تحميل بيانات المستخدم:', error);
            showToast('خطأ في تحميل بيانات المستخدم');
            if (callback) callback();
        };
        
    } catch (error) {
        console.error('خطأ في عملية قاعدة البيانات:', error);
        showToast('خطأ في الوصول إلى قاعدة البيانات');
        if (callback) callback();
    }
}

// إنشاء بيانات افتراضية للمستخدم
function createDefaultUserData(callback) {
    console.log('جاري إنشاء بيانات افتراضية للمستخدم...');
    
    const defaultUserData = {
        id: 'profile',
        name: "المستخدم",
        email: "",
        playTime: 0,
        totalPoints: 0,
        completedLevels: 0,
        currentStage: 1,
        dailyChallengesCompleted: 0,
        fastCompletions: 0,
        noHintCompletions: 0,
        culturalPuzzlesSolved: 0,
        perfectScores: 0,
        completedStages: 0,
        totalCardsMatched: 0,
        lastUpdate: Date.now()
    };
    
    // حفظ في قاعدة البيانات
    saveUserProfileToDB(defaultUserData, (success) => {
        if (success) {
            // تحديث بيانات الملف الشخصي
            userProfileData.name = defaultUserData.name;
            userProfileData.email = defaultUserData.email;
            userProfileData.playTime = defaultUserData.playTime;
            userProfileData.totalPoints = defaultUserData.totalPoints;
            userProfileData.completedLevels = defaultUserData.completedLevels;
            
            // تحديث المتغيرات العامة
            window.userName = userProfileData.name;
            window.userEmail = userProfileData.email;
            window.playTime = userProfileData.playTime;
            window.totalPoints = userProfileData.totalPoints;
            
            console.log('تم إنشاء بيانات افتراضية للمستخدم');
        }
        
        if (callback) callback();
    });
}

// تحميل إحصائيات الملف الشخصي
function loadProfileStats(callback) {
    console.log('جاري تحميل إحصائيات الملف الشخصي...');
    
    try {
        // فتح معاملة لجلب جميع البيانات المطلوبة
        const transaction = window.db.transaction(['levels', 'stats', 'user'], 'readonly');
        const levelsStore = transaction.objectStore('levels');
        const statsStore = transaction.objectStore('stats');
        const userStore = transaction.objectStore('user');
        
        let completedLevels = 0;
        let totalEarnedPoints = 0;
        
        // حساب المستويات المكتملة والنقاط المكتسبة
        const levelsRequest = levelsStore.index('completed').openCursor(IDBKeyRange.only(true));
        
        levelsRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                completedLevels++;
                totalEarnedPoints += cursor.value.points || 0;
                cursor.continue();
            } else {
                // الحصول على إجمالي النقاط من الإحصائيات
                statsStore.get('totalPoints').onsuccess = (e) => {
                    const statsResult = e.target.result;
                    const totalPoints = statsResult ? statsResult.value : totalEarnedPoints;
                    
                    // الحصول على إحصائيات المستخدم الإضافية
                    userStore.get('profile').onsuccess = (userEvent) => {
                        const userResult = userEvent.target.result;
                        
                        // تحديث بيانات الملف الشخصي
                        userProfileData.completedLevels = completedLevels;
                        userProfileData.totalPoints = totalPoints;
                        
                        // حساب معدل النجاح
                        let successRate = 0;
                        if (completedLevels > 0) {
                            const maxPossiblePoints = completedLevels * 3;
                            successRate = Math.round((totalEarnedPoints / maxPossiblePoints) * 100);
                        }
                        userProfileData.successRate = successRate;
                        
                        // تحديث المتغيرات العامة
                        window.totalPoints = totalPoints;
                        
                        console.log('إحصائيات الملف الشخصي:', {
                            completedLevels,
                            totalPoints,
                            successRate,
                            totalEarnedPoints
                        });
                        
                        if (callback) callback();
                    };
                };
            }
        };
        
        levelsRequest.onerror = (error) => {
            console.error('خطأ في حساب المستويات المكتملة:', error);
            if (callback) callback();
        };
        
    } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
        if (callback) callback();
    }
}

// تحديث جميع عناصر واجهة المستخدم
function updateAllProfileUI() {
    console.log('جاري تحديث جميع عناصر واجهة المستخدم...');
    
    // تحديث معلومات المستخدم الأساسية
    updateBasicProfileUI();
    
    // تحديث الإحصائيات
    updateStatsUI();
    
    // تحديث الإنجازات
    updateAchievementsUI();
}

// تحديث معلومات المستخدم الأساسية
function updateBasicProfileUI() {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const profileName = document.getElementById('profile-name');
    
    if (nameInput) {
        nameInput.value = userProfileData.name;
    }
    
    if (emailInput) {
        emailInput.value = userProfileData.email;
    }
    
    if (profileName) {
        profileName.textContent = userProfileData.name;
    }
}

// تحديث واجهة الإحصائيات
function updateStatsUI() {
    console.log('تحديث واجهة الإحصائيات:', userProfileData);
    
    // تحديث النقاط الإجمالية
    const totalPointsElement = document.getElementById('total-points-profile');
    if (totalPointsElement) {
        totalPointsElement.textContent = userProfileData.totalPoints;
    }
    
    // تحديث المستويات المكتملة
    const completedLevelsElement = document.getElementById('completed-levels');
    if (completedLevelsElement) {
        const totalLevels = window.levelsData ? window.levelsData.length : 0;
        completedLevelsElement.textContent = `${userProfileData.completedLevels}/${totalLevels}`;
    }
    
    // تحديث معدل النجاح
    const successRateElement = document.getElementById('success-rate');
    if (successRateElement) {
        successRateElement.textContent = `${userProfileData.successRate}%`;
    }
    
    // تحديث وقت اللعب
    const playTimeElement = document.getElementById('play-time');
    if (playTimeElement) {
        const hours = Math.floor(userProfileData.playTime / 60);
        const minutes = userProfileData.playTime % 60;
        playTimeElement.textContent = `${hours} س ${minutes} د`;
    }
    
    // حساب وتحديث مستوى المستخدم
    const userLevel = Math.floor(userProfileData.completedLevels / 5) + 1;
    userProfileData.level = userLevel;
    
    const profileLevelElement = document.getElementById('profile-level');
    if (profileLevelElement) {
        profileLevelElement.textContent = userLevel;
    }
    
    // تحديث شريط التقدم للمستوى
    const levelProgress = (userProfileData.completedLevels % 5) * 20;
    updateLevelProgressBar(levelProgress);
}

// تحديث شريط تقدم المستوى
function updateLevelProgressBar(progress) {
    let progressBar = document.getElementById('profile-level-progress');
    if (!progressBar) {
        // إنشاء شريط التقدم إذا لم يكن موجوداً
        const profileHeader = document.querySelector('.profile-header');
        if (profileHeader) {
            const progressHTML = `
                <div class="level-progress-container" style="margin-top: 15px;">
                    <div class="progress-bar" style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div class="progress" id="profile-level-progress" style="height: 100%; background: var(--gradient); width: ${progress}%; border-radius: 4px; transition: width 0.5s ease;"></div>
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 5px;">
                        التقدم للوصول للمستوى التالي: ${progress}%
                    </div>
                </div>
            `;
            profileHeader.insertAdjacentHTML('beforeend', progressHTML);
        }
    } else {
        progressBar.style.width = `${progress}%`;
    }
}

// بدء التحديث التلقائي كل 5 ثوان
function startProfileAutoUpdate() {
    // إيقاف أي مؤقت سابق
    stopProfileAutoUpdate();
    
    // تحديث كل 5 ثوان عند فتح الشاشة
    profileAutoUpdateInterval = setInterval(() => {
        if (isProfileScreenActive && window.db) {
            console.log('تحديث تلقائي لبيانات الملف الشخصي...');
            loadAllProfileData();
        }
    }, 5000); // 5 ثواني
}

// إيقاف التحديث التلقائي
function stopProfileAutoUpdate() {
    if (profileAutoUpdateInterval) {
        clearInterval(profileAutoUpdateInterval);
        profileAutoUpdateInterval = null;
    }
}

// إعداد مستمعي أحداث الملف الشخصي
function setupProfileEventListeners() {
    console.log('جاري إعداد مستمعي أحداث الملف الشخصي...');
    
    // زر حفظ الملف الشخصي
    const saveProfileBtn = document.getElementById('save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', handleSaveProfile);
        console.log('تم إعداد مستمع لحفظ الملف الشخصي');
    }
    
    // حقول الإدخال
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSaveProfile();
            }
        });
        
        nameInput.addEventListener('input', (e) => {
            const profileName = document.getElementById('profile-name');
            if (profileName) {
                profileName.textContent = e.target.value || userProfileData.name;
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSaveProfile();
            }
        });
    }
}

// معالجة حفظ الملف الشخصي
function handleSaveProfile() {
    console.log('جاري حفظ بيانات الملف الشخصي...');
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    
    if (!nameInput || !emailInput) {
        console.error('حقول الإدخال غير موجودة');
        showToast('خطأ في حفظ البيانات');
        return;
    }
    
    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();
    
    if (!newName) {
        showToast('الرجاء إدخال اسم مستخدم صحيح');
        if (window.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(100);
        }
        return;
    }
    
    // تحديث البيانات المحلية
    userProfileData.name = newName;
    userProfileData.email = newEmail;
    
    // تحديث الواجهة فوراً
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = newName;
    }
    
    // تحديث المتغيرات العامة
    window.userName = newName;
    window.userEmail = newEmail;
    
    // حفظ في قاعدة البيانات
    saveUserProfileToDB({
        name: newName,
        email: newEmail,
        playTime: userProfileData.playTime,
        totalPoints: userProfileData.totalPoints,
        completedLevels: userProfileData.completedLevels,
        currentStage: window.currentStage || 1
    }, (success) => {
        if (success) {
            showToast('تم حفظ التغييرات بنجاح في قاعدة البيانات');
            
            // تشغيل صوت النجاح
            if (window.soundEnabled && window.audioSystem && window.audioSystem.play) {
                window.audioSystem.play('success');
            }
            
            // اهتزاز إذا كان مفعلاً
            if (window.vibrationEnabled && navigator.vibrate) {
                navigator.vibrate(50);
            }
        } else {
            showToast('فشل في حفظ التغييرات في قاعدة البيانات');
        }
    });
}

// حفظ بيانات المستخدم في قاعدة البيانات
function saveUserProfileToDB(userData, callback) {
    if (!window.db) {
        console.error('قاعدة البيانات غير متاحة للحفظ');
        showToast('قاعدة البيانات غير متاحة، جاري إعادة المحاولة...');
        
        // إعادة المحاولة بعد 1 ثانية
        setTimeout(() => {
            saveUserProfileToDB(userData, callback);
        }, 1000);
        
        if (callback) callback(false);
        return;
    }
    
    try {
        const transaction = window.db.transaction(['user'], 'readwrite');
        const userStore = transaction.objectStore('user');
        
        const fullUserData = {
            id: 'profile',
            name: userData.name,
            email: userData.email,
            playTime: userData.playTime || 0,
            totalPoints: userData.totalPoints || 0,
            completedLevels: userData.completedLevels || 0,
            currentStage: userData.currentStage || 1,
            lastUpdate: Date.now()
        };
        
        const request = userStore.put(fullUserData);
        
        request.onsuccess = () => {
            console.log('تم حفظ بيانات المستخدم في قاعدة البيانات');
            if (callback) callback(true);
        };
        
        request.onerror = (error) => {
            console.error('خطأ في حفظ بيانات المستخدم:', error);
            if (callback) callback(false);
        };
        
        transaction.oncomplete = () => {
            console.log('تمت عملية حفظ البيانات بنجاح');
        };
        
        transaction.onerror = (error) => {
            console.error('خطأ في عملية قاعدة البيانات:', error);
        };
        
    } catch (error) {
        console.error('خطأ في عملية قاعدة البيانات:', error);
        if (callback) callback(false);
    }
}

// تحميل الإنجازات من قاعدة البيانات
function loadAchievementsFromDB(callback) {
    console.log('جاري تحميل الإنجازات من قاعدة البيانات...');
    
    if (!window.db) {
        console.error('قاعدة البيانات غير متاحة');
        if (callback) callback();
        return;
    }
    
    try {
        const transaction = window.db.transaction(['achievements', 'user'], 'readonly');
        const achievementsStore = transaction.objectStore('achievements');
        const userStore = transaction.objectStore('user');
        
        // الحصول على إحصائيات المستخدم
        userStore.get('profile').onsuccess = (userEvent) => {
            const userStats = userEvent.target.result || {};
            
            // الحصول على الإنجازات المحفوظة
            const request = achievementsStore.getAll();
            
            request.onsuccess = (event) => {
                const savedAchievements = event.target.result || [];
                
                // تحديث بيانات الإنجازات
                achievementsData.forEach((achievement, index) => {
                    const saved = savedAchievements.find(a => a.id === achievement.id);
                    
                    if (saved) {
                        // استخدام الإنجازات المحفوظة
                        achievementsData[index].earned = saved.earned;
                    } else {
                        // التحقق من شروط الإنجاز
                        achievementsData[index].earned = achievement.condition(userStats);
                    }
                });
                
                // حفظ الإنجازات المحدثة
                saveAchievementsToDB(() => {
                    if (callback) callback();
                });
            };
            
            request.onerror = (error) => {
                console.error('خطأ في تحميل الإنجازات:', error);
                if (callback) callback();
            };
        };
        
    } catch (error) {
        console.error('خطأ في تحميل الإنجازات:', error);
        if (callback) callback();
    }
}

// حفظ الإنجازات في قاعدة البيانات
function saveAchievementsToDB(callback) {
    if (!window.db) {
        console.error('قاعدة البيانات غير متاحة لحفظ الإنجازات');
        if (callback) callback();
        return;
    }
    
    try {
        const transaction = window.db.transaction(['achievements'], 'readwrite');
        const achievementsStore = transaction.objectStore('achievements');
        
        // حفظ جميع الإنجازات
        achievementsData.forEach(achievement => {
            achievementsStore.put({
                id: achievement.id,
                title: achievement.title,
                description: achievement.description,
                icon: achievement.icon,
                earned: achievement.earned,
                color: achievement.color,
                points: achievement.points
            });
        });
        
        transaction.oncomplete = () => {
            console.log('تم حفظ الإنجازات في قاعدة البيانات');
            updateAchievementsUI();
            if (callback) callback();
        };
        
        transaction.onerror = (error) => {
            console.error('خطأ في حفظ الإنجازات:', error);
            if (callback) callback();
        };
        
    } catch (error) {
        console.error('خطأ في عملية قاعدة البيانات:', error);
        if (callback) callback();
    }
}

// تحديث واجهة الإنجازات
function updateAchievementsUI() {
    console.log('جاري تحديث واجهة الإنجازات...');
    
    const achievementsContainer = document.getElementById('achievements-container');
    if (!achievementsContainer) {
        console.error('حاوية الإنجازات غير موجودة');
        return;
    }
    
    achievementsContainer.innerHTML = '';
    
    if (achievementsData.length === 0) {
        achievementsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.5);">
                <i class="fas fa-trophy" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>لا توجد إنجازات متاحة حالياً</p>
            </div>
        `;
        return;
    }
    
    achievementsData.forEach(achievement => {
        const achievementElement = createAchievementElement(achievement);
        achievementsContainer.appendChild(achievementElement);
    });
    
    console.log('تم عرض', achievementsData.length, 'إنجاز');
}

// إنشاء عنصر الإنجاز
function createAchievementElement(achievement) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = `achievement-item ${achievement.earned ? 'earned' : 'locked'}`;
    achievementDiv.dataset.id = achievement.id;
    
    achievementDiv.innerHTML = `
        <div class="achievement-icon" style="
            width: 60px;
            height: 60px;
            background: ${achievement.earned ? 
                `linear-gradient(135deg, ${achievement.color}, ${lightenColor(achievement.color, 30)})` : 
                'rgba(255, 255, 255, 0.1)'};
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px auto;
            border: 2px solid ${achievement.earned ? achievement.color : 'rgba(255, 255, 255, 0.2)'};
            box-shadow: ${achievement.earned ? 
                `0 4px 15px ${achievement.color}40` : 
                'none'};
        ">
            <i class="fas ${achievement.icon}" style="
                font-size: 28px;
                color: ${achievement.earned ? 'white' : 'rgba(255, 255, 255, 0.5)'};
            "></i>
        </div>
        <div class="achievement-title" style="
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 5px;
            color: ${achievement.earned ? 'var(--light)' : 'rgba(255, 255, 255, 0.5)'};
        ">${achievement.title}</div>
        <div class="achievement-desc" style="
            font-size: 12px;
            color: ${achievement.earned ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)'};
            margin-bottom: 8px;
        ">${achievement.description}</div>
        <div class="achievement-points" style="
            font-size: 11px;
            font-weight: bold;
            color: ${achievement.earned ? '#fdcb6e' : 'rgba(255, 255, 255, 0.3)'};
        ">
            <i class="fas fa-coins"></i> ${achievement.points} نقطة
        </div>
        ${achievement.earned ? `
            <div class="achievement-badge" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: ${achievement.color};
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            ">
                <i class="fas fa-check"></i>
            </div>
        ` : ''}
    `;
    
    // إضافة تأثيرات التفاعل
    if (achievement.earned) {
        achievementDiv.style.cursor = 'pointer';
        achievementDiv.title = 'انقر لعرض التفاصيل';
        
        achievementDiv.addEventListener('click', () => {
            showAchievementDetails(achievement);
        });
        
        // تأثير hover للإنجازات المكتسبة
        achievementDiv.addEventListener('mouseenter', () => {
            achievementDiv.style.transform = 'translateY(-5px) scale(1.05)';
            achievementDiv.style.boxShadow = `0 10px 25px ${achievement.color}40`;
        });
        
        achievementDiv.addEventListener('mouseleave', () => {
            achievementDiv.style.transform = 'translateY(0) scale(1)';
            achievementDiv.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    }
    
    return achievementDiv;
}

// عرض تفاصيل الإنجاز
function showAchievementDetails(achievement) {
    const detailsHTML = `
        <div class="cultural-puzzle-overlay active" id="achievement-details-overlay">
            <div class="cultural-puzzle-container glass-effect" style="max-width: 500px;">
                <div class="puzzle-header">
                    <h2><i class="fas ${achievement.icon}"></i> ${achievement.title}</h2>
                </div>
                <div class="puzzle-question" style="text-align: center; margin: 20px 0;">
                    ${achievement.description}
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 48px; color: ${achievement.color}; margin: 20px 0;">
                        <i class="fas ${achievement.icon}"></i>
                    </div>
                    <div style="font-size: 18px; color: #fdcb6e; font-weight: bold;">
                        <i class="fas fa-coins"></i> ${achievement.points} نقطة
                    </div>
                    <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                        <i class="fas ${achievement.earned ? 'fa-check-circle text-success' : 'fa-times-circle text-warning'}"></i>
                        ${achievement.earned ? 'تم كسب هذا الإنجاز' : 'لم يتم كسب هذا الإنجاز بعد'}
                    </div>
                </div>
                <div style="text-align: center;">
                    <button class="btn" id="close-achievement-details" style="margin-top: 20px;">
                        <i class="fas fa-check"></i> فهمت
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    document.getElementById('close-achievement-details').addEventListener('click', () => {
        document.getElementById('achievement-details-overlay').remove();
    });
}

// فتح إنجاز محدد
function unlockAchievement(achievementId) {
    const achievement = achievementsData.find(a => a.id === achievementId);
    if (achievement && !achievement.earned) {
        achievement.earned = true;
        
        // حفظ في قاعدة البيانات
        saveAchievementsToDB(() => {
            // عرض إشعار
            showAchievementNotification(achievement);
            
            // تحديث الواجهة
            updateAchievementsUI();
        });
        
        return true;
    }
    return false;
}

// عرض إشعار الإنجاز
function showAchievementNotification(achievement) {
    if (window.showToast) {
        window.showToast(`🎉 تهانينا! لقد حصلت على إنجاز: ${achievement.title}`);
    }
    
    // إنشاء عنصر إشعار
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, ${achievement.color}, ${darkenColor(achievement.color, 20)});
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas ${achievement.icon}" style="font-size: 24px;"></i>
        <div>
            <div style="font-weight: bold; font-size: 16px;">${achievement.title}</div>
            <div style="font-size: 12px; opacity: 0.9;">${achievement.description}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// دوال مساعدة للألوان
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    )
    .toString(16)
    .slice(1)}`;
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return `#${(
        0x1000000 +
        (R > 0 ? R : 0) * 0x10000 +
        (G > 0 ? G : 0) * 0x100 +
        (B > 0 ? B : 0)
    )
    .toString(16)
    .slice(1)}`;
}

// دالة مساعدة لعرض الرسائل
function showToast(message) {
    console.log('Toast:', message);
    if (window.showToast) {
        window.showToast(message);
    } else {
        // إنشاء toast بسيط
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// تصدير الدوال الرئيسية
window.profileModule = {
    initProfileScreen,
    loadAllProfileData,
    handleSaveProfile,
    updateAllProfileUI,
    unlockAchievement,
    achievementsData,
    startProfileAutoUpdate,
    stopProfileAutoUpdate
};

// تهيئة تلقائية عند تحميل الملف
console.log('تم تحميل ملف profile.js بنجاح');

// بدء التهيئة عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM محمل، جاري تهيئة شاشة الملف الشخصي...');
        setTimeout(initProfileScreen, 1000);
    });
} else {
    console.log('DOM محمل بالفعل، جاري تهيئة شاشة الملف الشخصي...');
    setTimeout(initProfileScreen, 1000);
}

// إضافة أنماط CSS للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .achievement-item {
        transition: all 0.3s ease;
        position: relative;
        padding: 15px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .achievement-item.earned {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);
