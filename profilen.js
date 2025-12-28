// profile.js - نظام الملف الشخصي والإنجازات المتكامل (مصحح)

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
            document.getElementById('profile-name').textContent = userName;
            document.getElementById('user-name').value = userName;
            document.getElementById('user-email').value = userEmail;
            
            // حساب المستوى بناءً على النقاط
            const level = calculateLevel(user.totalPoints || 0);
            document.getElementById('profile-level').textContent = level;
        }
    };
    
    // تحميل الإحصائيات
    const statsRequest = statsStore.get('totalPoints');
    statsRequest.onsuccess = function(event) {
        if (statsRequest.result) {
            totalPoints = statsRequest.result.value;
            document.getElementById('total-points-profile').textContent = totalPoints;
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
        if (!document.hidden && document.getElementById('profile-screen').classList.contains('active')) {
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
        showToast('الرجاء إدخال اسم المستخدم');
        vibrate(100);
        audioSystem.play('error');
        return;
    }
    
    if (!db) {
        showToast('خطأ في قاعدة البيانات');
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
            // تحديث المتغيرات العامة
            userName = newName;
            userEmail = newEmail;
            
            // تحديث الواجهة
            document.getElementById('profile-name').textContent = newName;
            
            // تشغيل التأثيرات
            audioSystem.play('success');
            vibrate(50);
            showToast('تم حفظ التغييرات بنجاح!');
            
            // تأثيرات بصرية
            const saveBtn = document.getElementById('save-profile');
            gsap.to(saveBtn, {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        };
        
        putRequest.onerror = function() {
            showToast('حدث خطأ أثناء الحفظ');
            audioSystem.play('error');
        };
    };
}

// تغيير صورة الملف الشخصي (نظام أولي)
function changeAvatar() {
    // في الإصدار الحالي، نستخدم رمزًا افتراضيًا
    // يمكن توسيعه في المستقبل للسماح برفع الصور
    audioSystem.play('click');
    vibrate(50);
    
    const avatar = document.querySelector('.profile-avatar i');
    const icons = ['fas fa-user', 'fas fa-user-astronaut', 'fas fa-user-ninja', 'fas fa-user-graduate'];
    const currentIcon = avatar.className;
    let nextIndex = icons.findIndex(icon => icon === currentIcon) + 1;
    if (nextIndex >= icons.length) nextIndex = 0;
    
    avatar.className = icons[nextIndex];
    
    // تأثير تحويل
    gsap.to(avatar, {
        rotationY: 360,
        duration: 0.8,
        ease: "back.out(1.7)"
    });
    
    // حفظ التفضيل في قاعدة البيانات
    if (db) {
        const transaction = db.transaction(['settings'], 'readwrite');
        const settingsStore = transaction.objectStore('settings');
        settingsStore.put({ id: 'avatar_icon', value: icons[nextIndex] });
    }
}

// تحميل الإنجازات من قاعدة البيانات وعرضها
function loadAchievements() {
    if (!db) return;
    
    const achievementsContainer = document.getElementById('achievements-container');
    if (!achievementsContainer) return;
    
    // تحميل الإنجازات المخزنة
    const transaction = db.transaction(['achievements'], 'readonly');
    const achievementsStore = transaction.objectStore('achievements');
    const request = achievementsStore.getAll();
    
    request.onsuccess = function(event) {
        const storedAchievements = event.target.result || [];
        
        // مسح الحاوية
        achievementsContainer.innerHTML = '';
        
        // عرض جميع الإنجازات
        achievementsData.forEach(achievement => {
            const storedAchievement = storedAchievements.find(a => a.id === achievement.id);
            const isEarned = storedAchievement ? storedAchievement.earned : false;
            const earnedDate = storedAchievement ? storedAchievement.earnedDate : null;
            
            createAchievementElement(achievement, isEarned, earnedDate);
        });
        
        // فحص الإنجازات المكتسبة حديثًا (بدون منح نقاط)
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
    achievementElement.setAttribute('aria-label', `${achievement.title} - ${achievement.description}`);
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
    description.style.fontSize = '12px';
    description.style.opacity = '0.8';
    
    achievementElement.appendChild(icon);
    achievementElement.appendChild(title);
    achievementElement.appendChild(description);
    
    // إضافة تأثير عند النقر
    achievementElement.addEventListener('click', function(e) {
        e.stopPropagation(); // منع انتشار الحدث
        showAchievementDetails(achievement, isEarned, earnedDate);
        audioSystem.play('click');
        vibrate(30);
    });
    
    // تأثيرات hover باستخدام GSAP
    achievementElement.addEventListener('mouseenter', function() {
        if (isEarned) {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        }
    });
    
    achievementElement.addEventListener('mouseleave', function() {
        if (isEarned) {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
    
    achievementsContainer.appendChild(achievementElement);
}

// عرض تفاصيل الإنجاز (مصحح - بإضافة event delegation)
function showAchievementDetails(achievement, isEarned, earnedDate) {
    // إغلاق أي نافذة مفتوحة مسبقاً
    closeAchievementDetails();
    
    const detailsHTML = `
        <div class="achievement-details-overlay" id="achievement-details">
            <div class="achievement-details-container glass-effect">
                <div class="details-header" style="text-align: center;">
                    <div class="achievement-icon-large" style="font-size: 60px; color: ${achievement.color}; margin-bottom: 15px;">
                        <i class="${achievement.icon}"></i>
                    </div>
                    <h3 style="color: var(--secondary); margin-bottom: 10px;">${achievement.title}</h3>
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
                    <div class="detail-row" style="padding: 10px 0; color: var(--accent); font-size: 14px;">
                        <i class="fas fa-info-circle"></i> ${getRequirementText(achievement.requirement)}
                    </div>
                    `}
                </div>
                
                <div class="details-actions" style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn ripple" id="achievement-close-btn" style="flex: 1; background: rgba(255,255,255,0.1);">
                        <i class="fas fa-times"></i> إغلاق
                    </button>
                    ${isEarned ? `
                    <button class="btn ripple" id="achievement-share-btn" style="flex: 1; background: var(--accent);">
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
    
    // إضافة النافذة المنبثقة إلى body
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    // التأكد من وجود العنصر أولاً
    setTimeout(() => {
        const overlay = document.getElementById('achievement-details');
        if (!overlay) return;
        
        // تأثير الظهور
        overlay.classList.add('active');
        audioSystem.play('notification');
        
        // إضافة مستمعي الأحداث باستخدام event delegation على overlay
        overlay.addEventListener('click', function(e) {
            const target = e.target;
            
            // إذا كان الضغط على زر الإغلاق أو أي عنصر داخله
            if (target.closest('#achievement-close-btn')) {
                e.stopPropagation();
                closeAchievementDetails();
            }
            
            // إذا كان الضغط على زر المشاركة
            if (target.closest('#achievement-share-btn')) {
                e.stopPropagation();
                shareAchievement(achievement.title);
            }
        });
        
        // إغلاق عند الضغط على زر Escape
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeAchievementDetails();
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // حفظ مرجع الدالة لإزالتها لاحقاً
        overlay.dataset.escapeHandler = escapeHandler;
        
        // بدء العد التنازلي للإغلاق التلقائي
        startAutoCloseCountdown();
        
    }, 10);
}

// بدء العد التنازلي للإغلاق التلقائي
function startAutoCloseCountdown() {
    let secondsLeft = 4;
    const countdownElement = document.getElementById('countdown-timer');
    const detailsElement = document.getElementById('achievement-details');
    
    if (!countdownElement || !detailsElement) return;
    
    // تحديث المؤقت كل ثانية
    const countdownInterval = setInterval(() => {
        secondsLeft--;
        
        if (countdownElement) {
            countdownElement.textContent = secondsLeft;
            
            // تأثير رقم المؤقت
            gsap.to(countdownElement, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                ease: "power2.out"
            });
            
            // تغيير اللون عند اقتراب الوقت
            if (secondsLeft <= 2) {
                countdownElement.style.color = '#fd79a8';
                countdownElement.style.fontWeight = 'bold';
            }
        }
        
        // إغلاق بعد 4 ثواني
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            closeAchievementDetails();
        }
    }, 1000);
    
    // حفظ معرف المؤقت للإشارة إليه لاحقاً
    detailsElement.dataset.countdownInterval = countdownInterval;
}

// إغلاق نافذة تفاصيل الإنجاز
function closeAchievementDetails() {
    const details = document.getElementById('achievement-details');
    if (details) {
        // إزالة مستمع حدث Escape
        const escapeHandler = details.dataset.escapeHandler;
        if (escapeHandler) {
            document.removeEventListener('keydown', escapeHandler);
        }
        
        // إيقاف المؤقت
        const countdownInterval = details.dataset.countdownInterval;
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // تأثير الاختفاء
        details.classList.remove('active');
        
        // تشغيل صوت الإغلاق
        audioSystem.play('click');
        
        // إزالة العنصر بعد انتهاء الانتقال
        setTimeout(() => {
            if (details && details.parentNode) {
                details.remove();
            }
        }, 300);
    }
}

// مشاركة الإنجاز
function shareAchievement(achievementTitle) {
    if (navigator.share) {
        navigator.share({
            title: 'لقد حققت إنجازًا في أبطال البطاقات!',
            text: `لقد حصلت على إنجاز "${achievementTitle}" في لعبة أبطال البطاقات!`,
            url: window.location.href
        }).then(() => {
            audioSystem.play('success');
            showToast('تمت المشاركة بنجاح!');
            closeAchievementDetails(); // إغلاق النافذة بعد المشاركة
        }).catch(error => {
            console.log('Error sharing:', error);
            audioSystem.play('error');
        });
    } else {
        // نسخ إلى الحافظة
        const text = `لقد حصلت على إنجاز "${achievementTitle}" في لعبة أبطال البطاقات!`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                audioSystem.play('success');
                showToast('تم نسخ الإنجاز إلى الحافظة!');
            });
        } else {
            // طريقة بديلة
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            audioSystem.play('success');
            showToast('تم نسخ الإنجاز إلى الحافظة!');
        }
    }
}

// تحديث إحصائيات الملف الشخصي
function updateProfileStats() {
    if (!db) return;
    
    const transaction = db.transaction(['stats', 'user', 'levels'], 'readonly');
    const statsStore = transaction.objectStore('stats');
    const levelsStore = transaction.objectStore('levels');
    const userStore = transaction.objectStore('user');
    
    let totalPointsValue = 0;
    let completedLevelsValue = 0;
    let playTimeValue = 0;
    
    // النقاط الإجمالية
    const pointsRequest = statsStore.get('totalPoints');
    pointsRequest.onsuccess = function(event) {
        if (pointsRequest.result) {
            totalPointsValue = pointsRequest.result.value;
            totalPoints = totalPointsValue;
            document.getElementById('total-points-profile').textContent = totalPointsValue;
            
            // تحديث المستوى بناءً على النقاط
            const level = calculateLevel(totalPointsValue);
            document.getElementById('profile-level').textContent = level;
        }
    };
    
    // عدد المستويات المكتملة
    const completedLevelsRequest = levelsStore.index('completed').getAll(1);
    completedLevelsRequest.onsuccess = function(event) {
        completedLevelsValue = event.target.result ? event.target.result.length : 0;
        document.getElementById('completed-levels').textContent = completedLevelsValue;
        
        // حساب معدل النجاح
        const totalAttempts = completedLevelsValue + (window.gameAttempts || 0);
        const successRate = totalAttempts > 0 ? 
            Math.min(100, Math.floor((completedLevelsValue / totalAttempts) * 100)) : 0;
        document.getElementById('success-rate').textContent = `${successRate}%`;
    };
    
    // وقت اللعب
    const userRequest = userStore.get('profile');
    userRequest.onsuccess = function(event) {
        if (userRequest.result && userRequest.result.playTime) {
            playTimeValue = userRequest.result.playTime;
            const hours = Math.floor(playTimeValue / 60);
            const minutes = playTimeValue % 60;
            document.getElementById('play-time').textContent = hours > 0 ? 
                `${hours}س ${minutes}د` : `${minutes} دقيقة`;
        }
    };
    
    transaction.oncomplete = function() {
        // تحديث أي عناصر أخرى تعتمد على هذه البيانات
        updateAchievementsProgress();
    };
}

// تحديث تقدم الإنجازات
function updateAchievementsProgress() {
    if (!db) return;
    
    const transaction = db.transaction(['achievements'], 'readonly');
    const achievementsStore = transaction.objectStore('achievements');
    const request = achievementsStore.getAll();
    
    request.onsuccess = function(event) {
        const storedAchievements = event.target.result || [];
        
        // تحديث واجهة الإنجازات مع التقدم
        achievementsData.forEach(achievement => {
            const stored = storedAchievements.find(a => a.id === achievement.id);
            const element = document.querySelector(`.achievement-item[data-id="${achievement.id}"]`);
            
            if (element && !stored?.earned) {
                const progress = calculateAchievementProgress(achievement);
                if (progress > 0) {
                    updateAchievementProgressUI(element, progress);
                }
            }
        });
    };
}

// حساب تقدم الإنجاز
function calculateAchievementProgress(achievement) {
    const requirement = achievement.requirement;
    let currentValue = 0;
    let requiredValue = requirement.value;
    
    switch (requirement.type) {
        case 'levels_completed':
            currentValue = parseInt(document.getElementById('completed-levels').textContent) || 0;
            break;
            
        case 'total_points':
            currentValue = totalPoints;
            break;
            
        case 'perfect_score':
            // سنتجاهل هذا مؤقتاً
            return 0;
            
        case 'fast_completion':
            // سنتجاهل هذا مؤقتاً
            return 0;
            
        case 'cultural_correct':
            currentValue = window.culturalCorrect || 0;
            break;
            
        case 'play_time':
            const timeText = document.getElementById('play-time').textContent;
            if (timeText.includes('س')) {
                const parts = timeText.split('س');
                const hours = parseInt(parts[0]) || 0;
                const minutes = parseInt(parts[1]) || 0;
                currentValue = hours * 60 + minutes;
            } else {
                currentValue = parseInt(timeText) || 0;
            }
            break;
            
        case 'hints_used':
            currentValue = window.hintsUsed || 0;
            break;
            
        default:
            return 0;
    }
    
    return Math.min(100, (currentValue / requiredValue) * 100);
}

// تحديث واجهة تقدم الإنجاز
function updateAchievementProgressUI(element, progress) {
    // إضافة شريط التقدم إذا لم يكن موجودًا
    let progressBar = element.querySelector('.achievement-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'achievement-progress';
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.right = '0';
        progressBar.style.height = '4px';
        progressBar.style.background = 'rgba(255,255,255,0.1)';
        progressBar.style.borderRadius = '0 0 20px 20px';
        progressBar.style.overflow = 'hidden';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'achievement-progress-fill';
        progressFill.style.height = '100%';
        progressFill.style.background = 'var(--accent)';
        progressFill.style.width = `${progress}%`;
        progressFill.style.transition = 'width 0.5s ease';
        
        progressBar.appendChild(progressFill);
        element.appendChild(progressBar);
    }
}

// فحص وإلغاء قفل الإنجازات الجديدة (بدون منح نقاط)
function checkAndUnlockAchievements() {
    if (!db) return;
    
    const transaction = db.transaction(['achievements', 'stats', 'levels'], 'readwrite');
    const achievementsStore = transaction.objectStore('achievements');
    
    // تحميل الإنجازات المخزنة
    const achievementsRequest = achievementsStore.getAll();
    
    achievementsRequest.onsuccess = function(event) {
        const storedAchievements = event.target.result || [];
        const newAchievements = [];
        
        // فحص كل إنجاز
        achievementsData.forEach(achievement => {
            const stored = storedAchievements.find(a => a.id === achievement.id);
            
            // إذا لم يكن مكتسباً بعد
            if (!stored || !stored.earned) {
                // التحقق من الشروط
                if (checkAchievementCondition(achievement)) {
                    newAchievements.push({
                        id: achievement.id,
                        title: achievement.title,
                        earned: true,
                        earnedDate: new Date().toISOString()
                    });
                }
            }
        });
        
        // حفظ الإنجازات الجديدة فقط (بدون منح نقاط)
        if (newAchievements.length > 0) {
            newAchievements.forEach(newAchievement => {
                achievementsStore.put(newAchievement);
                
                // عرض إشعار بالإنجاز الجديد
                showNewAchievementNotification(newAchievement);
            });
        }
    };
}

// التحقق من شروط الإنجاز
function checkAchievementCondition(achievement) {
    const requirement = achievement.requirement;
    
    switch (requirement.type) {
        case 'levels_completed':
            const completedElement = document.getElementById('completed-levels');
            const completedLevels = completedElement ? parseInt(completedElement.textContent) : 0;
            return completedLevels >= requirement.value;
            
        case 'total_points':
            return totalPoints >= requirement.value;
            
        case 'perfect_score':
            // للتبسيط، سنفترض أن هذا الإنجاز يتحقق عند إكمال أول مستوى
            return false; // سيتم تطويره لاحقاً
            
        case 'fast_completion':
            // للتبسيط، سنرجع false
            return false;
            
        case 'cultural_correct':
            // نفترض وجود متغير global
            return (window.culturalCorrect || 0) >= requirement.value;
            
        case 'play_time':
            const timeElement = document.getElementById('play-time');
            if (!timeElement) return false;
            const timeText = timeElement.textContent;
            let minutes = 0;
            if (timeText.includes('س')) {
                const parts = timeText.split('س');
                const hours = parseInt(parts[0]) || 0;
                minutes = hours * 60 + (parseInt(parts[1]) || 0);
            } else {
                minutes = parseInt(timeText) || 0;
            }
            return minutes >= requirement.value;
            
        case 'daily_completed':
            // للتبسيط، سنفترض أن هذا غير محقق
            return false;
            
        case 'stage_completed':
            // للتبسيط، سنفترض أن هذا غير محقق
            return false;
            
        case 'hints_used':
            return (window.hintsUsed || 0) >= requirement.value;
            
        case 'daily_streak':
            // للتبسيط، سنفترض أن هذا غير محقق
            return false;
            
        default:
            return false;
    }
}

// عرض إشعار بالإنجاز الجديد
function showNewAchievementNotification(achievement) {
    // البحث عن بيانات الإنجاز الكاملة
    const achievementData = achievementsData.find(a => a.id === achievement.id);
    if (!achievementData) return;
    
    // إنشاء إشعار
    const notificationHTML = `
        <div class="new-achievement-notification glass-effect" id="new-achievement-${achievement.id}">
            <div class="notification-icon" style="color: ${achievementData.color}; font-size: 40px;">
                <i class="${achievementData.icon}"></i>
            </div>
            <div class="notification-content">
                <h4 style="color: var(--secondary); margin-bottom: 5px;">🎉 إنجاز جديد! 🎉</h4>
                <p style="font-weight: bold; margin-bottom: 5px;">${achievement.title}</p>
                <p style="font-size: 14px; opacity: 0.8; margin-bottom: 8px;">${achievementData.description}</p>
                <div style="color: #fdcb6e; font-size: 12px;">
                    <i class="fas fa-trophy"></i> تم فتح إنجاز جديد!
                </div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // إضافة الإشعار إلى body
    const existingNotification = document.getElementById(`new-achievement-${achievement.id}`);
    if (existingNotification) existingNotification.remove();
    
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
    
    // تأثيرات
    const notification = document.getElementById(`new-achievement-${achievement.id}`);
    gsap.from(notification, {
        y: -100,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
    });
    
    // تشغيل الأصوات
    audioSystem.play('achievement');
    
    // إزالة تلقائية بعد 5 ثوانٍ
    setTimeout(() => {
        if (notification && notification.parentNode) {
            gsap.to(notification, {
                y: -100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => notification.remove()
            });
        }
    }, 5000);
}

// فتح إنجاز محدد (وظيفة مساعدة - بدون نقاط)
function unlockAchievement(achievementId) {
    if (!db) return;
    
    const achievement = achievementsData.find(a => a.id === achievementId);
    if (!achievement) return;
    
    const transaction = db.transaction(['achievements'], 'readwrite');
    const achievementsStore = transaction.objectStore('achievements');
    
    const getRequest = achievementsStore.get(achievementId);
    getRequest.onsuccess = function(event) {
        const storedAchievement = event.target.result || { id: achievementId };
        
        if (!storedAchievement.earned) {
            storedAchievement.earned = true;
            storedAchievement.earnedDate = new Date().toISOString();
            
            const putRequest = achievementsStore.put(storedAchievement);
            putRequest.onsuccess = function() {
                // تحديث الواجهة
                const element = document.querySelector(`.achievement-item[data-id="${achievementId}"]`);
                if (element) {
                    element.classList.remove('locked');
                    element.classList.add('earned');
                    element.style.animation = 'achievementUnlock 0.6s ease-out forwards';
                    
                    // إضافة التأثيرات
                    createMagicDust(
                        element.getBoundingClientRect().left + element.offsetWidth / 2,
                        element.getBoundingClientRect().top + element.offsetHeight / 2
                    );
                    
                    // عرض إشعار
                    showNewAchievementNotification({
                        id: achievementId,
                        title: achievement.title
                    });
                }
            };
        }
    };
}

// دوال مساعدة
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays < 7) return `منذ ${diffDays} يوم`;
        
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        };
        return date.toLocaleDateString('ar-SA', options);
    } catch (e) {
        return 'تاريخ غير معروف';
    }
}

function getRequirementText(requirement) {
    switch (requirement.type) {
        case 'levels_completed':
            return `أكمل ${requirement.value} مستوى`;
        case 'total_points':
            return `اجمع ${requirement.value} نقطة`;
        case 'perfect_score':
            return `احصل على نتيجة مثالية (3/3) في مستوى`;
        case 'fast_completion':
            return `أكمل مستوى في أقل من ${requirement.value} ثانية`;
        case 'cultural_correct':
            return `أجب على ${requirement.value} ألغاز ثقافية`;
        case 'play_time':
            return `لعب لمدة ${requirement.value} دقيقة`;
        case 'daily_completed':
            return `أكمل التحدي اليومي`;
        case 'stage_completed':
            return `أكمل مرحلة كاملة`;
        case 'hints_used':
            return `استخدم ${requirement.value} تلميح`;
        case 'daily_streak':
            return `لعب لمدة ${requirement.value} أيام متتالية`;
        default:
            return 'متطلب غير معروف';
    }
}

// تحديث تلقائي للإحصائيات عند إكمال مستوى
function updateProfileAfterLevelComplete() {
    if (document.getElementById('profile-screen')?.classList.contains('active')) {
        updateProfileStats();
    }
    
    // التحقق من الإنجازات بعد كل مستوى
    setTimeout(checkAndUnlockAchievements, 500);
}

// تهيئة الأسلوب للنوافذ المنبثقة
function initProfileStyles() {
    // تحقق أولاً إذا كانت الأنماط موجودة بالفعل
    if (document.getElementById('profile-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'profile-styles';
    style.textContent = `
        .achievement-details-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(10px);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            pointer-events: none;
        }
        
        .achievement-details-overlay.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }
        
        .achievement-details-container {
            width: 90%;
            max-width: 400px;
            padding: 25px;
            border-radius: 25px;
            transform: translateY(30px);
            transition: transform 0.4s ease, opacity 0.4s ease;
            opacity: 0;
            pointer-events: auto;
        }
        
        .achievement-details-overlay.active .achievement-details-container {
            transform: translateY(0);
            opacity: 1;
        }
        
        .new-achievement-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            left: 20px;
            max-width: 400px;
            margin: 0 auto;
            padding: 15px 20px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border-left: 4px solid var(--accent);
            pointer-events: auto;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: rgba(255,255,255,0.5);
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            margin-left: auto;
        }
        
        .auto-close-timer {
            animation: pulse 1s infinite;
        }
        
        #achievement-close-btn, #achievement-share-btn {
            transition: all 0.3s ease !important;
            cursor: pointer !important;
        }
        
        #achievement-close-btn:hover {
            background: rgba(255,255,255,0.2) !important;
            transform: translateY(-2px) !important;
        }
        
        #achievement-share-btn:hover {
            background: linear-gradient(135deg, var(--primary), var(--accent)) !important;
            transform: translateY(-2px) !important;
        }
        
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
        
        @keyframes achievementUnlock {
            0% {
                transform: scale(0.8) rotateY(90deg);
                opacity: 0;
            }
            100% {
                transform: scale(1) rotateY(0deg);
                opacity: 1;
            }
        }
        
        /* تحسينات للشاشات الصغيرة */
        @media (max-width: 480px) {
            .achievement-details-container {
                width: 95%;
                padding: 20px;
            }
            
            .new-achievement-notification {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
            
            .notification-close {
                margin-left: 0;
                align-self: flex-end;
            }
        }
        
        /* إضافة شريط التقدم للإنجازات */
        .achievement-progress-fill {
            transition: width 0.5s ease;
            background: linear-gradient(90deg, var(--accent), var(--primary)) !important;
        }
    `;
    document.head.appendChild(style);
}

// تهيئة شاشة الملف الشخصي عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المتغيرات الإحصائية
    window.gameAttempts = 0;
    window.culturalCorrect = 0;
    window.hintsUsed = 0;
    
    // انتظار تحميل قاعدة البيانات
    const checkDB = setInterval(() => {
        if (db) {
            clearInterval(checkDB);
            initProfileStyles();
            if (typeof initProfileScreen === 'function') {
                initProfileScreen();
            }
        }
    }, 100);
});

// إضافة الدوال للاستخدام العام
window.unlockAchievement = unlockAchievement;
window.updateProfileStats = updateProfileStats;
window.updateProfileAfterLevelComplete = updateProfileAfterLevelComplete;
window.closeAchievementDetails = closeAchievementDetails;
window.showAchievementDetails = showAchievementDetails;
window.shareAchievement = shareAchievement;
