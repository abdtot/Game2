// profile.js - إدارة الملف الشخصي والإنجازات

// بيانات الإنجازات
const achievementsData = [
    { 
        id: "first_win", 
        title: "الفائز الأول", 
        description: "أكمل مستوى واحد", 
        icon: "fa-trophy", 
        earned: false,
        color: "#fdcb6e",
        points: 10
    },
    { 
        id: "five_wins", 
        title: "بطل مبتدئ", 
        description: "أكمل 5 مستويات", 
        icon: "fa-medal", 
        earned: false,
        color: "#a29bfe",
        points: 25
    },
    { 
        id: "ten_wins", 
        title: "بطل محترف", 
        description: "أكمل 10 مستويات", 
        icon: "fa-crown", 
        earned: false,
        color: "#6c5ce7",
        points: 50
    },
    { 
        id: "daily_challenge", 
        title: "متحدي اليوم", 
        description: "أكمل التحدي اليومي", 
        icon: "fa-calendar", 
        earned: false,
        color: "#00b894",
        points: 30
    },
    { 
        id: "speed_runner", 
        title: "عداء سريع", 
        description: "أكمل مستوى في أقل من 30 ثانية", 
        icon: "fa-stopwatch", 
        earned: false,
        color: "#fd79a8",
        points: 40
    },
    { 
        id: "hint_master", 
        title: "سيد التلميحات", 
        description: "أكمل مستوى دون استخدام تلميحات", 
        icon: "fa-lightbulb", 
        earned: false,
        color: "#fdcb6e",
        points: 35
    },
    { 
        id: "puzzle_master", 
        title: "سيد الألغاز", 
        description: "أجب على 10 ألغاز ثقافية بشكل صحيح", 
        icon: "fa-puzzle-piece", 
        earned: false,
        color: "#74b9ff",
        points: 45
    },
    { 
        id: "perfect_score", 
        title: "نتيجة مثالية", 
        description: "أكمل 3 مستويات بنتيجة 3/3", 
        icon: "fa-star", 
        earned: false,
        color: "#ffeaa7",
        points: 60
    },
    { 
        id: "stage_completer", 
        title: "فاتح المراحل", 
        description: "أكمل مرحلة كاملة", 
        icon: "fa-flag", 
        earned: false,
        color: "#55efc4",
        points: 100
    },
    { 
        id: "collector", 
        title: "جامع البطاقات", 
        description: "تطابق 50 بطاقة بشكل صحيح", 
        icon: "fa-layer-group", 
        earned: false,
        color: "#fd79a8",
        points: 75
    }
];

// تهيئة الملف الشخصي
function initProfileScreen() {
    loadUserProfile();
    setupProfileEventListeners();
    loadAchievements();
    updateProfileStats();
    
    // تحديث الإحصائيات تلقائياً عند فتح الشاشة
    const profileScreen = document.getElementById('profile-screen');
    if (profileScreen) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (profileScreen.classList.contains('active')) {
                        updateProfileStats();
                    }
                }
            });
        });
        
        observer.observe(profileScreen, { attributes: true });
    }
}

// تحميل بيانات المستخدم
function loadUserProfile() {
    if (!db) return;
    
    const transaction = db.transaction(['user'], 'readonly');
    const userStore = transaction.objectStore('user');
    const userRequest = userStore.get('profile');
    
    userRequest.onsuccess = (event) => {
        if (userRequest.result) {
            userName = userRequest.result.name;
            userEmail = userRequest.result.email;
            playTime = userRequest.result.playTime || 0;
            currentStage = userRequest.result.currentStage || 1;
            
            const nameInput = document.getElementById('user-name');
            const emailInput = document.getElementById('user-email');
            const profileName = document.getElementById('profile-name');
            
            if (nameInput) nameInput.value = userName;
            if (emailInput) emailInput.value = userEmail;
            if (profileName) profileName.textContent = userName;
        }
    };
}

// إعداد مستمعي أحداث الملف الشخصي
function setupProfileEventListeners() {
    const saveProfileBtn = document.getElementById('save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveProfile();
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveProfile();
            }
        });
    }
}

// حفظ بيانات الملف الشخصي
function saveProfile() {
    const newName = document.getElementById('user-name')?.value?.trim();
    const newEmail = document.getElementById('user-email')?.value?.trim();
    
    if (!newName) {
        showToast('الرجاء إدخال اسم مستخدم صحيح');
        vibrate(100);
        return;
    }
    
    userName = newName;
    userEmail = newEmail;
    
    if (db) {
        const transaction = db.transaction(['user'], 'readwrite');
        const userStore = transaction.objectStore('user');
        
        userStore.get('profile').onsuccess = (event) => {
            const userData = event.target.result || {
                id: 'profile',
                name: userName,
                email: userEmail,
                playTime: 0,
                totalPoints: 0,
                completedLevels: 0,
                currentStage: 1
            };
            
            userData.name = userName;
            userData.email = userEmail;
            
            userStore.put(userData).onsuccess = () => {
                const profileName = document.getElementById('profile-name');
                if (profileName) profileName.textContent = userName;
                
                showToast('تم حفظ التغييرات بنجاح');
                playSound('success');
                vibrate(50);
                
                // تحديث الإحصائيات بعد الحفظ
                updateProfileStats();
            };
        };
    }
}

// تحديث إحصائيات الملف الشخصي
function updateProfileStats() {
    if (!db) return;
    
    const transaction = db.transaction(['levels', 'user', 'achievements', 'stats'], 'readonly');
    const levelsStore = transaction.objectStore('levels');
    const userStore = transaction.objectStore('user');
    const statsStore = transaction.objectStore('stats');
    
    let completedLevels = 0;
    let totalEarnedPoints = 0;
    let successRate = 0;
    let totalLevels = levelsData.length;
    
    // حساب المستويات المكتملة والنقاط
    const countRequest = levelsStore.index('completed').openCursor(IDBKeyRange.only(true));
    countRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            completedLevels++;
            totalEarnedPoints += cursor.value.points || 0;
            cursor.continue();
        } else {
            // حساب معدل النجاح
            successRate = completedLevels > 0 ? 
                Math.round((totalEarnedPoints / (completedLevels * 3)) * 100) : 0;
            
            // تحديث واجهة المستخدم
            updateProfileUI(completedLevels, totalEarnedPoints, successRate, totalLevels);
            
            // تحديث بيانات المستخدم
            updateUserData(completedLevels, totalEarnedPoints);
            
            // التحقق من الإنجازات
            checkAchievements(completedLevels, totalEarnedPoints);
        }
    };
}

// تحديث واجهة المستخدم للإحصائيات
function updateProfileUI(completedLevels, totalPoints, successRate, totalLevels) {
    // تحديث الإحصائيات
    const totalPointsElement = document.getElementById('total-points-profile');
    const completedLevelsElement = document.getElementById('completed-levels');
    const successRateElement = document.getElementById('success-rate');
    const playTimeElement = document.getElementById('play-time');
    const profileLevelElement = document.getElementById('profile-level');
    
    if (totalPointsElement) totalPointsElement.textContent = totalPoints;
    if (completedLevelsElement) completedLevelsElement.textContent = `${completedLevels}/${totalLevels}`;
    if (successRateElement) successRateElement.textContent = `${successRate}%`;
    if (playTimeElement) {
        const hours = Math.floor(playTime / 60);
        const minutes = playTime % 60;
        playTimeElement.textContent = `${hours} س ${minutes} د`;
    }
    
    // حساب مستوى المستخدم
    const userLevel = Math.floor(completedLevels / 5) + 1;
    if (profileLevelElement) profileLevelElement.textContent = userLevel;
    
    // تحديث شريط التقدم للمستوى
    const levelProgress = (completedLevels % 5) * 20; // 5 مستويات لكل مستوى
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

// تحديث بيانات المستخدم في قاعدة البيانات
function updateUserData(completedLevels, totalPoints) {
    if (!db) return;
    
    const transaction = db.transaction(['user'], 'readwrite');
    const userStore = transaction.objectStore('user');
    
    userStore.get('profile').onsuccess = (event) => {
        const userData = event.target.result || {
            id: 'profile',
            name: userName,
            email: userEmail,
            playTime: 0,
            totalPoints: 0,
            completedLevels: 0,
            currentStage: 1
        };
        
        userData.completedLevels = completedLevels;
        userData.totalPoints = totalPoints;
        userData.playTime = playTime;
        
        userStore.put(userData);
    };
}

// تحميل الإنجازات
function loadAchievements() {
    if (!db) {
        // إذا لم تكن قاعدة البيانات جاهزة، استخدم البيانات المحلية
        renderAchievements(achievementsData);
        return;
    }
    
    const transaction = db.transaction(['achievements'], 'readonly');
    const achievementsStore = transaction.objectStore('achievements');
    const request = achievementsStore.getAll();
    
    request.onsuccess = (event) => {
        if (request.result && request.result.length > 0) {
            achievementsData.forEach((achievement, index) => {
                const savedAchievement = request.result.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievementsData[index].earned = savedAchievement.earned;
                }
            });
            renderAchievements(achievementsData);
        } else {
            // حفظ الإنجازات في قاعدة البيانات للمرة الأولى
            saveAchievementsToDB();
            renderAchievements(achievementsData);
        }
    };
}

// حفظ الإنجازات في قاعدة البيانات
function saveAchievementsToDB() {
    if (!db) return;
    
    const transaction = db.transaction(['achievements'], 'readwrite');
    const achievementsStore = transaction.objectStore('achievements');
    
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
}

// عرض الإنجازات
function renderAchievements(achievements) {
    const achievementsContainer = document.getElementById('achievements-container');
    if (!achievementsContainer) return;
    
    achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementElement = createAchievementElement(achievement);
        achievementsContainer.appendChild(achievementElement);
    });
}

// إنشاء عنصر الإنجاز
function createAchievementElement(achievement) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = `achievement-item ${achievement.earned ? 'earned' : 'locked'}`;
    achievementDiv.dataset.id = achievement.id;
    
    const iconColor = achievement.earned ? achievement.color : '#636e72';
    
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
    if (!achievement.earned) {
        achievementDiv.style.cursor = 'default';
        achievementDiv.title = 'لم يتم كسب هذا الإنجاز بعد';
    } else {
        achievementDiv.style.cursor = 'pointer';
        achievementDiv.title = 'انقر لعرض التفاصيل';
        
        achievementDiv.addEventListener('click', () => {
            showAchievementDetails(achievement);
        });
        
        // تأثير hover للإنجازات المكتسبة
        achievementDiv.addEventListener('mouseenter', () => {
            if (achievement.earned) {
                achievementDiv.style.transform = 'translateY(-5px) scale(1.05)';
                achievementDiv.style.boxShadow = `0 10px 25px ${achievement.color}40`;
            }
        });
        
        achievementDiv.addEventListener('mouseleave', () => {
            if (achievement.earned) {
                achievementDiv.style.transform = 'translateY(0) scale(1)';
                achievementDiv.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }
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
                    <h2>🏆 ${achievement.title}</h2>
                    <span class="puzzle-category" style="background: ${achievement.color}30; color: ${achievement.color};">إنجاز</span>
                </div>
                <div class="achievement-details-content" style="text-align: center; padding: 20px 0;">
                    <div class="achievement-details-icon" style="
                        width: 100px;
                        height: 100px;
                        background: linear-gradient(135deg, ${achievement.color}, ${lightenColor(achievement.color, 30)});
                        border-radius: 25px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px auto;
                        border: 3px solid white;
                        box-shadow: 0 8px 25px ${achievement.color}40;
                    ">
                        <i class="fas ${achievement.icon}" style="font-size: 48px; color: white;"></i>
                    </div>
                    <div class="achievement-details-desc" style="
                        font-size: 18px;
                        margin-bottom: 20px;
                        color: var(--light);
                        line-height: 1.6;
                    ">${achievement.description}</div>
                    <div class="achievement-details-points" style="
                        font-size: 24px;
                        font-weight: bold;
                        color: #fdcb6e;
                        margin-bottom: 25px;
                    ">
                        <i class="fas fa-coins"></i> ${achievement.points} نقطة
                    </div>
                    <div class="achievement-details-status" style="
                        padding: 10px 20px;
                        background: rgba(0, 184, 148, 0.2);
                        border-radius: 50px;
                        display: inline-block;
                        font-weight: bold;
                        color: #00b894;
                    ">
                        <i class="fas fa-check-circle"></i> تم كسبه بنجاح
                    </div>
                </div>
                <div style="display: flex; justify-content: center; margin-top: 20px; gap: 10px;">
                    <button class="btn" id="share-achievement-btn" style="background: linear-gradient(135deg, ${achievement.color}, ${darkenColor(achievement.color, 20)});">
                        <i class="fas fa-share-alt"></i> مشاركة الإنجاز
                    </button>
                    <button class="btn" id="close-details-btn">
                        <i class="fas fa-times"></i> إغلاق
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    document.getElementById('share-achievement-btn').addEventListener('click', () => {
        shareAchievement(achievement);
    });
    
    document.getElementById('close-details-btn').addEventListener('click', () => {
        document.getElementById('achievement-details-overlay').remove();
    });
}

// مشاركة الإنجاز
function shareAchievement(achievement) {
    if (navigator.share) {
        navigator.share({
            title: `لقد كسبت إنجاز: ${achievement.title}!`,
            text: `أنا ألعب أبطال البطاقات وحصلت على إنجاز: ${achievement.title} - ${achievement.description}`,
            url: window.location.href
        })
        .then(() => console.log('تم مشاركة الإنجاز بنجاح'))
        .catch((error) => {
            console.log('خطأ في المشاركة:', error);
            showToast('ميزة المشاركة غير مدعومة في متصفحك');
        });
    } else {
        showToast('ميزة المشاركة غير مدعومة في متصفحك');
    }
}

// التحقق من الإنجازات
function checkAchievements(completedLevels, totalPoints) {
    const achievementsToUpdate = [];
    
    // التحقق من كل إنجاز
    if (completedLevels >= 1 && !getAchievement("first_win").earned) {
        achievementsToUpdate.push({ id: "first_win", earned: true });
    }
    
    if (completedLevels >= 5 && !getAchievement("five_wins").earned) {
        achievementsToUpdate.push({ id: "five_wins", earned: true });
    }
    
    if (completedLevels >= 10 && !getAchievement("ten_wins").earned) {
        achievementsToUpdate.push({ id: "ten_wins", earned: true });
    }
    
    if (completedLevels >= 25 && !getAchievement("stage_completer").earned) {
        achievementsToUpdate.push({ id: "stage_completer", earned: true });
    }
    
    // إكمال 3 مستويات بنتيجة كاملة (هذا مثال، يمكنك تعديل المنطق)
    if (completedLevels >= 3 && !getAchievement("perfect_score").earned) {
        // هنا يمكنك إضافة منطق للتحقق من النتائج المثالية
        achievementsToUpdate.push({ id: "perfect_score", earned: true });
    }
    
    if (achievementsToUpdate.length > 0) {
        updateAchievementsInDB(achievementsToUpdate);
    }
}

// تحديث الإنجازات في قاعدة البيانات
function updateAchievementsInDB(achievementsToUpdate) {
    if (!db) return;
    
    const transaction = db.transaction(['achievements'], 'readwrite');
    const achievementsStore = transaction.objectStore('achievements');
    
    achievementsToUpdate.forEach(achievement => {
        achievementsStore.get(achievement.id).onsuccess = (event) => {
            const data = event.target.result;
            if (data && !data.earned) {
                data.earned = true;
                achievementsStore.put(data);
                
                // تحديث البيانات المحلية
                const localAchievement = getAchievement(achievement.id);
                if (localAchievement) {
                    localAchievement.earned = true;
                }
                
                // عرض إشعار الإنجاز
                showAchievementNotification(data);
                
                // إعادة تحميل الإنجازات في الواجهة
                setTimeout(() => {
                    loadAchievements();
                }, 1000);
            }
        };
    });
}

// الحصول على إنجاز محدد
function getAchievement(achievementId) {
    return achievementsData.find(a => a.id === achievementId);
}

// فتح إنجاز محدد
function unlockAchievement(achievementId) {
    const achievement = getAchievement(achievementId);
    if (achievement && !achievement.earned) {
        achievement.earned = true;
        
        // حفظ في قاعدة البيانات
        if (db) {
            const transaction = db.transaction(['achievements'], 'readwrite');
            const achievementsStore = transaction.objectStore('achievements');
            achievementsStore.put(achievement);
        }
        
        // عرض إشعار
        showAchievementNotification(achievement);
        
        // تحديث الواجهة
        loadAchievements();
        
        return true;
    }
    return false;
}

// عرض إشعار الإنجاز
function showAchievementNotification(achievement) {
    // تأثيرات بصرية
    createEnhancedConfetti();
    
    // عرض شارة الإنجاز
    const badge = document.createElement('div');
    badge.className = 'achievement-badge show';
    badge.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(135deg, ${achievement.color}, ${darkenColor(achievement.color, 20)});
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border: 2px solid rgba(255, 255, 255, 0.3);
        cursor: pointer;
    `;
    
    badge.innerHTML = `
        <i class="fas ${achievement.icon}" style="
            font-size: 28px;
            animation: trophySpin 2s ease-in-out infinite;
        "></i>
        <div style="text-align: right;">
            <div style="font-weight: bold; font-size: 16px;">${achievement.title}</div>
            <div style="font-size: 12px; opacity: 0.9;">${achievement.description}</div>
        </div>
    `;
    
    document.body.appendChild(badge);
    
    // عرض الشارة
    setTimeout(() => {
        badge.style.transform = 'translateX(0)';
        
        // إضافة تأثيرات GSAP
        gsap.from(badge, {
            scale: 0,
            rotation: -10,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    }, 100);
    
    // جعل الشارة قابلة للنقر لعرض التفاصيل
    badge.addEventListener('click', () => {
        showAchievementDetails(achievement);
        badge.remove();
    });
    
    // إخفاء الشارة تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        badge.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (badge.parentNode) {
                badge.remove();
            }
        }, 600);
    }, 5000);
    
    // عرض toast
    showToast(`تهانينا! لقد حصلت على إنجاز: ${achievement.title}`);
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

// تحديث الإحصائيات بشكل دوري
function startProfileStatsUpdater() {
    setInterval(() => {
        if (document.getElementById('profile-screen')?.classList.contains('active')) {
            updateProfileStats();
        }
    }, 30000); // تحديث كل 30 ثانية
}

// تصدير الدوال الرئيسية
export {
    initProfileScreen,
    loadUserProfile,
    saveProfile,
    updateProfileStats,
    loadAchievements,
    checkAchievements,
    unlockAchievement,
    getAchievement,
    achievementsData,
    startProfileStatsUpdater
};
