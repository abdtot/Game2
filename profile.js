// profile.js - نظام الملف الشخصي والإنجازات المتكامل (مصحح بالكامل)

// بيانات الإنجازات (بدون نقاط مكافأة)
const achievementsData = [
    {
        id: "first_level",
        title: "الخطوة الأولى",
        description: "أكمل أول مستوى في اللعبة",
        icon: "fas fa-play-circle",
        color: "#6c5ce7",
        requirement: { type: "levels_completed", value: 1 }
    },
    {
        id: "fast_learner",
        title: "متعلم سريع",
        description: "أكمل 5 مستويات",
        icon: "fas fa-bolt",
        color: "#00b894",
        requirement: { type: "levels_completed", value: 5 }
    },
    {
        id: "champion",
        title: "بطل مبتدئ",
        description: "أكمل 10 مستويات",
        icon: "fas fa-shield-alt",
        color: "#fd79a8",
        requirement: { type: "levels_completed", value: 10 }
    },
    {
        id: "perfect_score",
        title: "نتيجة مثالية",
        description: "احصل على 3 نقاط في مستوى واحد",
        icon: "fas fa-star",
        color: "#fdcb6e",
        requirement: { type: "perfect_score", value: 1 }
    },
    {
        id: "star_collector",
        title: "جامع النجوم",
        description: "اجمع 50 نقطة إجمالية",
        icon: "fas fa-star-shooting",
        color: "#a29bfe",
        requirement: { type: "total_points", value: 50 }
    },
    {
        id: "speed_runner",
        title: "عداء سريع",
        description: "أكمل مستوى في أقل من 30 ثانية",
        icon: "fas fa-running",
        color: "#74b9ff",
        requirement: { type: "fast_completion", value: 30 }
    },
    {
        id: "knowledge_seeker",
        title: "باحث عن المعرفة",
        description: "أجب على 5 ألغاز ثقافية بشكل صحيح",
        icon: "fas fa-brain",
        color: "#00cec9",
        requirement: { type: "cultural_correct", value: 5 }
    },
    {
        id: "persistent",
        title: "مثابر",
        description: "لعِب لمدة 30 دقيقة متواصلة",
        icon: "fas fa-hourglass-half",
        color: "#e17055",
        requirement: { type: "play_time", value: 30 }
    },
    {
        id: "daily_challenge",
        title: "تحدي يومي",
        description: "أكمل التحدي اليومي",
        icon: "fas fa-calendar-check",
        color: "#ff7675",
        requirement: { type: "daily_completed", value: 1 }
    },
    {
        id: "stage_master",
        title: "سيد المرحلة",
        description: "أكمل مرحلة كاملة",
        icon: "fas fa-crown",
        color: "#fdcb6e",
        requirement: { type: "stage_completed", value: 1 }
    },
    {
        id: "hint_master",
        title: "خبير التلميحات",
        description: "استخدم 10 تلميحات",
        icon: "fas fa-lightbulb",
        color: "#0984e3",
        requirement: { type: "hints_used", value: 10 }
    },
    {
        id: "streak_keeper",
        title: "حافظ على التسلسل",
        description: "لعب لمدة 7 أيام متتالية",
        icon: "fas fa-fire",
        color: "#e17055",
        requirement: { type: "daily_streak", value: 7 }
    }
];

// تهيئة شاشة الملف الشخصي
function initProfileScreen() {
    console.log('تهيئة شاشة الملف الشخصي...');
    
    // تحميل البيانات من قاعدة البيانات
    loadProfileData();
    
    // إعداد مستمعي الأحداث
    setupProfileEventListeners();
    
    // تحميل الإنجازات
    loadAchievements();
    
    // تحديث الإحصائيات
    updateProfileStats();
}

// تحميل بيانات الملف الشخصي من قاعدة البيانات
function loadProfileData() {
    if (!db) {
        console.error('قاعدة البيانات غير متاحة');
        return;
    }
    
    const transaction = db.transaction(['user', 'stats', 'settings'], 'readonly');
    const userStore = transaction.objectStore('user');
    const statsStore = transaction.objectStore('stats');
    
    // تحميل بيانات المستخدم
    const userRequest = userStore.get('profile');
    userRequest.onsuccess = function(event) {
        if (userRequest.result) {
            const user = userRequest.result;
            userName = user.name;
            userEmail = user.email || '';
            
            // تحديث واجهة المستخدم
            const pName = document.getElementById('profile-name');
            const uName = document.getElementById('user-name');
            const uEmail = document.getElementById('user-email');
            
            if(pName) pName.textContent = userName;
            if(uName) uName.value = userName;
            if(uEmail) uEmail.value = userEmail;
            
            // حساب المستوى بناءً على النقاط
            const level = calculateLevel(user.totalPoints || 0);
            const pLevel = document.getElementById('profile-level');
            if(pLevel) pLevel.textContent = level;
        }
    };
    
    // تحميل الإحصائيات
    const statsRequest = statsStore.get('totalPoints');
    statsRequest.onsuccess = function(event) {
        if (statsRequest.result) {
            totalPoints = statsRequest.result.value;
            const tpProfile = document.getElementById('total-points-profile');
            if(tpProfile) tpProfile.textContent = totalPoints;
        }
    };
}

// حساب مستوى اللاعب بناءً على النقاط
function calculateLevel(points) {
    if (points < 10) return 1;
    if (points < 30) return 2;
    if (points < 60) return 3;
    if (points < 100) return 4;
    if (points < 150) return 5;
    if (points < 210) return 6;
    if (points < 280) return 7;
    if (points < 360) return 8;
    if (points < 450) return 9;
    return 10 + Math.floor((points - 450) / 100);
}

// إعداد مستمعي الأحداث لشاشة الملف الشخصي
function setupProfileEventListeners() {
    const saveProfileBtn = document.getElementById('save-profile');
    const avatarElement = document.querySelector('.profile-avatar');
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfileChanges);
    }
    
    if (avatarElement) {
        avatarElement.addEventListener('click', changeAvatar);
    }
    
    // تحديث الإحصائيات عند الظهور
    document.addEventListener('visibilitychange', function() {
        const profileScreen = document.getElementById('profile-screen');
        if (!document.hidden && profileScreen && profileScreen.classList.contains('active')) {
            updateProfileStats();
        }
    });
}

// حفظ التغييرات في الملف الشخصي
function saveProfileChanges() {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    
    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();
    
    if (!newName) {
        if(typeof showToast === 'function') showToast('الرجاء إدخل اسم المستخدم');
        if(typeof vibrate === 'function') vibrate(100);
        if(window.audioSystem) audioSystem.play('error');
        return;
    }
    
    if (!db) {
        if(typeof showToast === 'function') showToast('خطأ في قاعدة البيانات');
        return;
    }
    
    const transaction = db.transaction(['user'], 'readwrite');
    const userStore = transaction.objectStore('user');
    
    const updateRequest = userStore.get('profile');
    updateRequest.onsuccess = function(event) {
        const user = updateRequest.result || { id: 'profile' };
        user.name = newName;
        user.email = newEmail;
        
        const putRequest = userStore.put(user);
        putRequest.onsuccess = function() {
            userName = newName;
            userEmail = newEmail;
            
            const pName = document.getElementById('profile-name');
            if(pName) pName.textContent = newName;
            
            if(window.audioSystem) audioSystem.play('success');
            if(typeof vibrate === 'function') vibrate(50);
            if(typeof showToast === 'function') showToast('تم حفظ التغييرات بنجاح!');
            
            const saveBtn = document.getElementById('save-profile');
            if(saveBtn && window.gsap) {
                gsap.to(saveBtn, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            }
        };
    };
}

// تغيير صورة الملف الشخصي
function changeAvatar() {
    if(window.audioSystem) audioSystem.play('click');
    if(typeof vibrate === 'function') vibrate(50);
    
    const avatar = document.querySelector('.profile-avatar i');
    if(!avatar) return;

    const icons = ['fas fa-user', 'fas fa-user-astronaut', 'fas fa-user-ninja', 'fas fa-user-graduate'];
    const currentIcon = Array.from(avatar.classList).join(' ');
    let nextIndex = icons.findIndex(icon => currentIcon.includes(icon)) + 1;
    if (nextIndex >= icons.length || nextIndex === 0) nextIndex = 0;
    
    avatar.className = icons[nextIndex];
    
    if(window.gsap) {
        gsap.to(avatar, {
            rotationY: 360,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    }
    
    if (db) {
        const transaction = db.transaction(['settings'], 'readwrite');
        const settingsStore = transaction.objectStore('settings');
        settingsStore.put({ id: 'avatar_icon', value: icons[nextIndex] });
    }
}

// تحميل الإنجازات
function loadAchievements() {
    if (!db) return;
    
    const achievementsContainer = document.getElementById('achievements-container');
    if (!achievementsContainer) return;
    
    const transaction = db.transaction(['achievements'], 'readonly');
    const achievementsStore = transaction.objectStore('achievements');
    const request = achievementsStore.getAll();
    
    request.onsuccess = function(event) {
        const storedAchievements = event.target.result || [];
        achievementsContainer.innerHTML = '';
        
        achievementsData.forEach(achievement => {
            const storedAchievement = storedAchievements.find(a => a.id === achievement.id);
            const isEarned = storedAchievement ? storedAchievement.earned : false;
            const earnedDate = storedAchievement ? storedAchievement.earnedDate : null;
            createAchievementElement(achievement, isEarned, earnedDate);
        });
        
        checkAndUnlockAchievements();
    };
}

// إنشاء عنصر إنجاز
function createAchievementElement(achievement, isEarned, earnedDate) {
    const achievementsContainer = document.getElementById('achievements-container');
    
    const achievementElement = document.createElement('div');
    achievementElement.className = `achievement-item ${isEarned ? 'earned' : 'locked'}`;
    achievementElement.setAttribute('role', 'button');
    achievementElement.setAttribute('tabindex', '0');
    achievementElement.dataset.id = achievement.id;
    
    const icon = document.createElement('div');
    icon.className = 'achievement-icon';
    icon.style.color = achievement.color;
    icon.innerHTML = `<i class="${achievement.icon}" style="font-size: 40px;"></i>`;
    
    const title = document.createElement('div');
    title.className = 'achievement-title';
    title.textContent = achievement.title;
    title.style.fontWeight = 'bold';
    title.style.margin = '10px 0 5px 0';
    
    const description = document.createElement('div');
    description.className = 'achievement-description';
    description.textContent = achievement.description;
    
    achievementElement.appendChild(icon);
    achievementElement.appendChild(title);
    achievementElement.appendChild(description);
    
    achievementElement.addEventListener('click', function(e) {
        showAchievementDetails(achievement, isEarned, earnedDate);
        if(window.audioSystem) audioSystem.play('click');
        if(typeof vibrate === 'function') vibrate(30);
    });
    
    achievementsContainer.appendChild(achievementElement);
}

// عرض تفاصيل الإنجاز (المعدلة والمصلحة)
function showAchievementDetails(achievement, isEarned, earnedDate) {
    // 1. تنظيف أي نافذة سابقة فوراً
    closeAchievementDetails();
    
    const detailsHTML = `
        <div class="achievement-details-overlay" id="achievement-details">
            <div class="achievement-details-container glass-effect">
                <div class="details-header" style="text-align: center;">
                    <div class="achievement-icon-large" style="font-size: 60px; color: ${achievement.color}; margin-bottom: 15px;">
                        <i class="${achievement.icon}"></i>
                    </div>
                    <h3 style="color: #fff; margin-bottom: 10px;">${achievement.title}</h3>
                    <p style="opacity: 0.8; margin-bottom: 5px;">${achievement.description}</p>
                </div>
                
                <div class="details-content" style="margin: 20px 0;">
                    <div class="detail-row" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span style="opacity: 0.7;">الحالة:</span>
                        <span style="color: ${isEarned ? '#00b894' : '#fd79a8'}; font-weight: bold;">
                            ${isEarned ? 'مكتسب ✓' : 'غير مكتسب'}
                        </span>
                    </div>
                    ${isEarned && earnedDate ? `
                    <div class="detail-row" style="display: flex; justify-content: space-between; padding: 10px 0;">
                        <span style="opacity: 0.7;">تاريخ الاكتساب:</span>
                        <span style="font-size: 14px;">${formatDate(earnedDate)}</span>
                    </div>
                    ` : `
                    <div class="detail-row" style="padding: 10px 0; color: #fdcb6e; font-size: 14px;">
                        <i class="fas fa-info-circle"></i> ${getRequirementText(achievement.requirement)}
                    </div>
                    `}
                </div>
                
                <div class="details-actions" style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn" id="achievement-close-btn" style="flex: 1; background: rgba(255,255,255,0.1); color: white; border: none; padding: 10px; border-radius: 10px; cursor: pointer;">
                        <i class="fas fa-times"></i> إغلاق
                    </button>
                    ${isEarned ? `
                    <button class="btn" id="achievement-share-btn" style="flex: 1; background: #6c5ce7; color: white; border: none; padding: 10px; border-radius: 10px; cursor: pointer;">
                        <i class="fas fa-share-alt"></i> مشاركة
                    </button>
                    ` : ''}
                </div>
                
                <div class="details-footer" style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div class="auto-close-timer" style="font-size: 14px; color: rgba(255,255,255,0.6);">
                        <i class="fas fa-clock"></i> ستغلق تلقائياً خلال <span id="countdown-timer">4</span> ثواني
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    const overlay = document.getElementById('achievement-details');
    const closeBtn = document.getElementById('achievement-close-btn');
    const shareBtn = document.getElementById('achievement-share-btn');
    
    // إظهار النافذة بتأثير
    setTimeout(() => {
        if(overlay) overlay.classList.add('active');
        if(window.audioSystem) audioSystem.play('notification');
    }, 10);

    // ربط زر الإغلاق
    if(closeBtn) {
        closeBtn.onclick = function(e) {
            e.preventDefault();
            closeAchievementDetails();
        };
    }

    // ربط زر المشاركة
    if(shareBtn) {
        shareBtn.onclick = function(e) {
            e.preventDefault();
            shareAchievement(achievement.title);
        };
    }

    // إغلاق عند النقر على الخلفية (Overlay)
    overlay.onclick = function(e) {
        if(e.target === overlay) closeAchievementDetails();
    };

    // ربط زر Escape
    const escHandler = function(e) {
        if (e.key === 'Escape') closeAchievementDetails();
    };
    document.addEventListener('keydown', escHandler);
    overlay._escHandler = escHandler; // تخزين المرجع للحذف لاحقاً

    // بدء المؤقت
    startAutoCloseCountdown();
}

// بدء العد التنازلي للإغلاق التلقائي
function startAutoCloseCountdown() {
    let secondsLeft = 4;
    const countdownElement = document.getElementById('countdown-timer');
    
    const countdownInterval = setInterval(() => {
        secondsLeft--;
        if (countdownElement) {
            countdownElement.textContent = secondsLeft;
            if (secondsLeft <= 2) countdownElement.style.color = '#fd79a8';
        }
        
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            closeAchievementDetails();
        }
    }, 1000);
    
    const overlay = document.getElementById('achievement-details');
    if(overlay) overlay._interval = countdownInterval;
}

// إغلاق نافذة تفاصيل الإنجاز
function closeAchievementDetails() {
    const details = document.getElementById('achievement-details');
    if (details) {
        // تنظيف الأحداث والمؤقتات
        if(details._interval) clearInterval(details._interval);
        if(details._escHandler) document.removeEventListener('keydown', details._escHandler);
        
        details.classList.remove('active');
        if(window.audioSystem) audioSystem.play('click');
        
        setTimeout(() => {
            if (details.parentNode) details.remove();
        }, 300);
    }
}

// مشاركة الإنجاز
function shareAchievement(achievementTitle) {
    const text = `لقد حصلت على إنجاز "${achievementTitle}" في لعبة أبطال البطاقات!`;
    if (navigator.share) {
        navigator.share({
            title: 'إنجاز جديد!',
            text: text,
            url: window.location.href
        }).then(() => {
            if(typeof showToast === 'function') showToast('تمت المشاركة!');
            closeAchievementDetails();
        }).catch(() => {});
    } else {
        copyToClipboard(text);
    }
}

function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if(typeof showToast === 'function') showToast('تم نسخ النص!');
}

// تحديث إحصائيات الملف الشخصي
function updateProfileStats() {
    if (!db) return;
    
    const transaction = db.transaction(['stats', 'user', 'levels'], 'readonly');
    const statsStore = transaction.objectStore('stats');
    const levelsStore = transaction.objectStore('levels');
    const userStore = transaction.objectStore('user');
    
    // النقاط
    statsStore.get('totalPoints').onsuccess = function(e) {
        if (e.target.result) {
            totalPoints = e.target.result.value;
            const el = document.getElementById('total-points-profile');
            if(el) el.textContent = totalPoints;
            const lvlEl = document.getElementById('profile-level');
            if(lvlEl) lvlEl.textContent = calculateLevel(totalPoints);
        }
    };
    
    // المستويات
    levelsStore.index('completed').getAll(1).onsuccess = function(e) {
        const count = e.target.result ? e.target.result.length : 0;
        const el = document.getElementById('completed-levels');
        if(el) el.textContent = count;
    };
    
    // وقت اللعب
    userStore.get('profile').onsuccess = function(e) {
        if (e.target.result && e.target.result.playTime) {
            const time = e.target.result.playTime;
            const h = Math.floor(time / 60);
            const m = time % 60;
            const el = document.getElementById('play-time');
            if(el) el.textContent = h > 0 ? `${h}س ${m}د` : `${m} دقيقة`;
        }
    };
}

// فحص وإلغاء قفل الإنجازات الجديدة
function checkAndUnlockAchievements() {
    if (!db) return;
    
    const transaction = db.transaction(['achievements'], 'readwrite');
    const store = transaction.objectStore('achievements');
    
    store.getAll().onsuccess = function(event) {
        const stored = event.target.result || [];
        
        achievementsData.forEach(achievement => {
            const isStored = stored.find(a => a.id === achievement.id);
            if (!isStored || !isStored.earned) {
                if (checkAchievementCondition(achievement)) {
                    const newAch = {
                        id: achievement.id,
                        title: achievement.title,
                        earned: true,
                        earnedDate: new Date().toISOString()
                    };
                    store.put(newAch);
                    showNewAchievementNotification(newAch);
                }
            }
        });
    };
}

function checkAchievementCondition(achievement) {
    const req = achievement.requirement;
    const completedLevels = parseInt(document.getElementById('completed-levels')?.textContent || 0);
    
    switch (req.type) {
        case 'levels_completed': return completedLevels >= req.value;
        case 'total_points': return (window.totalPoints || 0) >= req.value;
        case 'cultural_correct': return (window.culturalCorrect || 0) >= req.value;
        case 'hints_used': return (window.hintsUsed || 0) >= req.value;
        default: return false;
    }
}

// عرض إشعار بالإنجاز الجديد
function showNewAchievementNotification(achievement) {
    const data = achievementsData.find(a => a.id === achievement.id);
    if (!data) return;
    
    const id = `new-ach-${Date.now()}`;
    const html = `
        <div class="new-achievement-notification glass-effect" id="${id}">
            <div class="notification-icon" style="color: ${data.color};">
                <i class="${data.icon}"></i>
            </div>
            <div class="notification-content">
                <h4>🎉 إنجاز جديد!</h4>
                <p><b>${data.title}</b></p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    const note = document.getElementById(id);
    
    if(window.gsap) {
        gsap.from(note, { y: -100, opacity: 0, duration: 0.5, ease: "back.out" });
        setTimeout(() => {
            if(note) gsap.to(note, { y: -100, opacity: 0, onComplete: () => note.remove() });
        }, 5000);
    }
    
    if(window.audioSystem) audioSystem.play('achievement');
}

// دوال مساعدة إضافية
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getRequirementText(req) {
    const map = {
        'levels_completed': `أكمل ${req.value} مستوى`,
        'total_points': `اجمع ${req.value} نقطة`,
        'hints_used': `استخدم ${req.value} تلميح`
    };
    return map[req.type] || 'تحدي خاص';
}

function initProfileStyles() {
    if (document.getElementById('profile-styles')) return;
    const style = document.createElement('style');
    style.id = 'profile-styles';
    style.textContent = `
        .achievement-details-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.85); display: flex;
            align-items: center; justify-content: center; z-index: 10000;
            backdrop-filter: blur(8px); opacity: 0; visibility: hidden;
            transition: all 0.3s ease;
        }
        .achievement-details-overlay.active { opacity: 1; visibility: visible; }
        .achievement-details-container {
            width: 90%; max-width: 400px; padding: 25px; border-radius: 20px;
            background: rgba(45, 52, 54, 0.9); border: 1px solid rgba(255,255,255,0.1);
            transform: scale(0.9); transition: 0.3s ease;
        }
        .achievement-details-overlay.active .achievement-details-container { transform: scale(1); }
        .new-achievement-notification {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            z-index: 10001; display: flex; align-items: center; gap: 15px;
            background: rgba(45, 52, 54, 0.95); padding: 15px 25px; border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid var(--accent);
        }
    `;
    document.head.appendChild(style);
}

// التشغيل
document.addEventListener('DOMContentLoaded', () => {
    const checkDB = setInterval(() => {
        if (typeof db !== 'undefined' && db) {
            clearInterval(checkDB);
            initProfileStyles();
            initProfileScreen();
        }
    }, 200);
});

// تصدير الدوال للنافذة العالمية
window.closeAchievementDetails = closeAchievementDetails;
window.showAchievementDetails = showAchievementDetails;

