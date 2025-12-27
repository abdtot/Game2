// profile.js - نظام الملف الشخصي والإنجازات المتكامل

// بيانات الإنجازات
const achievementsData = [
    {
        id: "first_level",
        title: "الخطوة الأولى",
        description: "أكمل أول مستوى في اللعبة",
        icon: "fas fa-play-circle",
        color: "#6c5ce7",
        points: 10,
        requirement: { type: "levels_completed", value: 1 }
    },
    {
        id: "fast_learner",
        title: "متعلم سريع",
        description: "أكمل 5 مستويات",
        icon: "fas fa-bolt",
        color: "#00b894",
        points: 25,
        requirement: { type: "levels_completed", value: 5 }
    },
    {
        id: "champion",
        title: "بطل مبتدئ",
        description: "أكمل 10 مستويات",
        icon: "fas fa-shield-alt",
        color: "#fd79a8",
        points: 50,
        requirement: { type: "levels_completed", value: 10 }
    },
    {
        id: "perfect_score",
        title: "نتيجة مثالية",
        description: "احصل على 3 نقاط في مستوى واحد",
        icon: "fas fa-star",
        color: "#fdcb6e",
        points: 30,
        requirement: { type: "perfect_score", value: 1 }
    },
    {
        id: "star_collector",
        title: "جامع النجوم",
        description: "اجمع 50 نقطة إجمالية",
        icon: "fas fa-star-shooting",
        color: "#a29bfe",
        points: 40,
        requirement: { type: "total_points", value: 50 }
    },
    {
        id: "speed_runner",
        title: "عداء سريع",
        description: "أكمل مستوى في أقل من 30 ثانية",
        icon: "fas fa-running",
        color: "#74b9ff",
        points: 35,
        requirement: { type: "fast_completion", value: 30 }
    },
    {
        id: "knowledge_seeker",
        title: "باحث عن المعرفة",
        description: "أجب على 5 ألغاز ثقافية بشكل صحيح",
        icon: "fas fa-brain",
        color: "#00cec9",
        points: 45,
        requirement: { type: "cultural_correct", value: 5 }
    },
    {
        id: "persistent",
        title: "مثابر",
        description: "لعِب لمدة 30 دقيقة متواصلة",
        icon: "fas fa-hourglass-half",
        color: "#e17055",
        points: 60,
        requirement: { type: "play_time", value: 30 }
    },
    {
        id: "daily_challenge",
        title: "تحدي يومي",
        description: "أكمل التحدي اليومي",
        icon: "fas fa-calendar-check",
        color: "#ff7675",
        points: 40,
        requirement: { type: "daily_completed", value: 1 }
    },
    {
        id: "stage_master",
        title: "سيد المرحلة",
        description: "أكمل مرحلة كاملة",
        icon: "fas fa-crown",
        color: "#fdcb6e",
        points: 100,
        requirement: { type: "stage_completed", value: 1 }
    },
    {
        id: "hint_master",
        title: "خبير التلميحات",
        description: "استخدم 10 تلميحات",
        icon: "fas fa-lightbulb",
        color: "#0984e3",
        points: 20,
        requirement: { type: "hints_used", value: 10 }
    },
    {
        id: "streak_keeper",
        title: "حافظ على التسلسل",
        description: "لعب لمدة 7 أيام متتالية",
        icon: "fas fa-fire",
        color: "#e17055",
        points: 70,
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
        
        // فحص الإنجازات المكتسبة حديثًا
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
    
    const points = document.createElement('div');
    points.className = 'achievement-points';
    points.innerHTML = `<i class="fas fa-coins" style="color: #fdcb6e;"></i> ${achievement.points}`;
    points.style.fontSize = '11px';
    points.style.marginTop = '8px';
    
    if (earnedDate) {
        const date = document.createElement('div');
        date.className = 'achievement-date';
        date.textContent = formatDate(earnedDate);
        date.style.fontSize = '10px';
        date.style.opacity = '0.6';
        date.style.marginTop = '5px';
        achievementElement.appendChild(date);
    }
    
    achievementElement.appendChild(icon);
    achievementElement.appendChild(title);
    achievementElement.appendChild(description);
    achievementElement.appendChild(points);
    
    // إضافة تأثير عند النقر
    achievementElement.addEventListener('click', function() {
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

// عرض تفاصيل الإنجاز
function showAchievementDetails(achievement, isEarned, earnedDate) {
    const detailsHTML = `
        <div class="achievement-details-overlay active" id="achievement-details">
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
                    
                    <div class="detail-row" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span style="opacity: 0.7;">المكافأة:</span>
                        <span style="color: #fdcb6e;">
                            <i class="fas fa-coins"></i> ${achievement.points} نقطة
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
                
                <div class="details-actions" style="display: flex; gap: 10px;">
                    <button class="btn ripple" onclick="closeAchievementDetails()" style="flex: 1; background: rgba(255,255,255,0.1);">
                        إغلاق
                    </button>
                    ${isEarned ? `
                    <button class="btn ripple" onclick="shareAchievement('${achievement.title}')" style="flex: 1; background: var(--accent);">
                        <i class="fas fa-share-alt"></i> مشاركة
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى body
    const existingDetails = document.getElementById('achievement-details');
    if (existingDetails) existingDetails.remove();
    
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    // تأثير الظهور
    const container = document.querySelector('#achievement-details .achievement-details-container');
    gsap.from(container, {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
    });
    
    audioSystem.play('notification');
}

// إغلاق نافذة تفاصيل الإنجاز
function closeAchievementDetails() {
    const details = document.getElementById('achievement-details');
    if (details) {
        const container = details.querySelector('.achievement-details-container');
        gsap.to(container, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => details.remove()
        });
        audioSystem.play('click');
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
        }).catch(error => {
            console.log('Error sharing:', error);
            audioSystem.play('error');
        });
    } else {
        // نسخ إلى الحافظة
        const text = `لقد حصلت على إنجاز "${achievementTitle}" في لعبة أبطال البطاقات!`;
        navigator.clipboard.writeText(text).then(() => {
            audioSystem.play('success');
            showToast('تم نسخ الإنجاز إلى الحافظة!');
        });
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
        const successRate = completedLevelsValue > 0 ? 
            Math.min(100, Math.floor((completedLevelsValue / (completedLevelsValue + 5)) * 100)) : 0;
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
    
    switch (requirement.type) {
        case 'levels_completed':
            const completedLevels = parseInt(document.getElementById('completed-levels').textContent) || 0;
            return Math.min(100, (completedLevels / requirement.value) * 100);
            
        case 'total_points':
            return Math.min(100, (totalPoints / requirement.value) * 100);
            
        case 'perfect_score':
            // نتحقق من وجود سجل النتائج المثالية
            return 0; // سيتم تطويره لاحقًا
            
        default:
            return 0;
    }
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

// فحص وإلغاء قفل الإنجازات الجديدة
function checkAndUnlockAchievements() {
    if (!db) return;
    
    const transaction = db.transaction(['achievements', 'stats', 'levels', 'user'], 'readwrite');
    const achievementsStore = transaction.objectStore('achievements');
    const statsStore = transaction.objectStore('stats');
    const levelsStore = transaction.objectStore('levels');
    
    // تحميل الإنجازات المخزنة
    const achievementsRequest = achievementsStore.getAll();
    
    achievementsRequest.onsuccess = function(event) {
        const storedAchievements = event.target.result || [];
        const newAchievements = [];
        
        achievementsData.forEach(achievement => {
            const stored = storedAchievements.find(a => a.id === achievement.id);
            
            if (!stored || !stored.earned) {
                if (checkAchievementRequirement(achievement, transaction)) {
                    newAchievements.push({
                        id: achievement.id,
                        title: achievement.title,
                        earned: true,
                        earnedDate: new Date().toISOString(),
                        points: achievement.points
                    });
                }
            }
        });
        
        // حفظ الإنجازات الجديدة
        newAchievements.forEach(newAchievement => {
            achievementsStore.put(newAchievement);
            
            // منح النقاط للمستخدم
            const currentPointsRequest = statsStore.get('totalPoints');
            currentPointsRequest.onsuccess = function(e) {
                const currentPoints = currentPointsRequest.result ? currentPointsRequest.result.value : 0;
                statsStore.put({
                    id: 'totalPoints',
                    value: currentPoints + newAchievement.points
                });
                
                // عرض إشعار بالإنجاز الجديد
                showNewAchievementNotification(newAchievement);
            };
        });
    };
}

// التحقق من متطلبات الإنجاز
function checkAchievementRequirement(achievement, transaction) {
    const requirement = achievement.requirement;
    
    switch (requirement.type) {
        case 'levels_completed':
            const levelsStore = transaction.objectStore('levels');
            const countRequest = levelsStore.index('completed').count(1);
            return new Promise(resolve => {
                countRequest.onsuccess = function(e) {
                    resolve(e.target.result >= requirement.value);
                };
            });
            
        case 'total_points':
            const statsStore = transaction.objectStore('stats');
            const pointsRequest = statsStore.get('totalPoints');
            return new Promise(resolve => {
                pointsRequest.onsuccess = function(e) {
                    const points = pointsRequest.result ? pointsRequest.result.value : 0;
                    resolve(points >= requirement.value);
                };
            });
            
        case 'perfect_score':
            // التحقق من وجود مستوى بثلاث نقاط
            const perfectLevelsStore = transaction.objectStore('levels');
            const perfectRequest = perfectLevelsStore.getAll();
            return new Promise(resolve => {
                perfectRequest.onsuccess = function(e) {
                    const hasPerfect = e.target.result.some(level => 
                        level.completed && level.points === 3
                    );
                    resolve(hasPerfect);
                };
            });
            
        default:
            return Promise.resolve(false);
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
                    <i class="fas fa-coins"></i> +${achievement.points} نقطة
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
    audioSystem.play('coin');
    
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

// فتح إنجاز محدد (وظيفة مساعدة)
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
            storedAchievement.points = achievement.points;
            
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
                        title: achievement.title,
                        points: achievement.points
                    });
                }
            };
        }
    };
}

// دوال مساعدة
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ar-SA', options);
}

function getRequirementText(requirement) {
    switch (requirement.type) {
        case 'levels_completed':
            return `أكمل ${requirement.value} مستوى`;
        case 'total_points':
            return `اجمع ${requirement.value} نقطة`;
        case 'perfect_score':
            return `احصل على نتيجة مثالية (3/3)`;
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

// تهيئة الأسلوب للنوافذ المنبثقة
function initProfileStyles() {
    const style = document.createElement('style');
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
            animation: fadeIn 0.3s ease;
        }
        
        .achievement-details-container {
            width: 90%;
            max-width: 400px;
            padding: 25px;
            border-radius: 25px;
            animation: slideUp 0.4s ease;
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
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
    `;
    document.head.appendChild(style);
}

// تهيئة شاشة الملف الشخصي عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // انتظار تحميل قاعدة البيانات
    setTimeout(() => {
        initProfileStyles();
        if (typeof initProfileScreen === 'function') {
            initProfileScreen();
        }
    }, 1000);
});
