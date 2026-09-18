// ==========================================
// MAKTAB DARS JADVALI
// ==========================================


// ==========================================
// 1. SINFLAR VA GURUHLAR
// ==========================================

const classes = {
    1: ["A", "B", "D"],
    2: ["A", "B", "D"],
    3: ["A", "B", "D"],
    4: ["A", "B", "D"],
    5: ["A", "B", ],
    6: ["A", "B", ],
    7: ["A", "B", ],
    8: ["A", "B", ],
    9: ["A", "B", ],
    10:["A", "B", ],
    11:["A", "B", ]
};


// ==========================================
// 2. FANLAR
// ==========================================

const subjects = [
    {
        name: "Matematika",
        teacher: "O‘qituvchi",
        room: "101",
        icon: "📐"
    },
    {
        name: "Ona tili",
        teacher: "O‘qituvchi",
        room: "102",
        icon: "📚"
    },
    {
        name: "Ingliz tili",
        teacher: "O‘qituvchi",
        room: "103",
        icon: "🌎"
    },
    {
        name: "Informatika",
        teacher: "O‘qituvchi",
        room: "104",
        icon: "💻"
    },
    {
        name: "Tarix",
        teacher: "O‘qituvchi",
        room: "105",
        icon: "🏛️"
    },
    {
        name: "Biologiya",
        teacher: "O‘qituvchi",
        room: "106",
        icon: "🌱"
    },
    {
        name: "Fizika",
        teacher: "O‘qituvchi",
        room: "107",
        icon: "⚡"
    },
    {
        name: "Kimyo",
        teacher: "O‘qituvchi",
        room: "108",
        icon: "🧪"
    },
    {
        name: "Jismoniy tarbiya",
        teacher: "O‘qituvchi",
        room: "Sport zal",
        icon: "⚽"
    },
    {
        name: "Geografiya",
        teacher: "O‘qituvchi",
        room: "109",
        icon: "🌍"
    }
];


// ==========================================
// 3. DARS VAQTLARI
// ==========================================

const lessonTimes = [
    "08:00 - 08:45",
    "08:50 - 09:45",
    "09:50 - 10:25",
    "10:30 - 11:00",
    "11:05 - 11:50",
    "11:55 - 12:40",
    "12:45 - 13:30"
];


// ==========================================
// 4. HAFTA KUNLARI
// ==========================================

const dayNames = {
    monday: "Dushanba",
    tuesday: "Seshanba",
    wednesday: "Chorshanba",
    thursday: "Payshanba",
    friday: "Juma",
    saturday: "Shanba"
};


// ==========================================
// 5. HTML ELEMENTLAR
// ==========================================

const gradeButtons = document.getElementById("gradeButtons");
const classGrid = document.getElementById("classGrid");

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

const gradeCounter = document.getElementById("gradeCounter");
const classCounter = document.getElementById("classCounter");

const selectedGradeTitle = document.getElementById("selectedGradeTitle");

const emptyState = document.getElementById("emptyState");

const scheduleSection = document.getElementById("scheduleSection");
const scheduleClassName = document.getElementById("scheduleClassName");

const backBtn = document.getElementById("backBtn");

const weekTabs = document.getElementById("weekTabs");
const lessonsContainer = document.getElementById("lessons");

const themeBtn = document.getElementById("themeBtn");


// ==========================================
// 6. CURRENT STATE
// ==========================================

let selectedGrade = 1;
let selectedClass = null;
let selectedDay = "monday";


// ==========================================
// 7. SINFLARNI CHIQARISH
// ==========================================

function renderClasses(grade = selectedGrade, search = "") {

    classGrid.innerHTML = "";

    const groups = classes[grade] || [];

    const filteredGroups = groups.filter(group => {

        const className = `${grade}-${group}`;

        return className
            .toLowerCase()
            .includes(search.toLowerCase().trim());

    });


    // Counter
    classCounter.textContent = `${filteredGroups.length} ta guruh`;


    // Hech narsa topilmasa
    if (filteredGroups.length === 0) {

        emptyState.classList.add("show");

        return;

    } else {

        emptyState.classList.remove("show");

    }


    // Guruhlarni yaratish
    filteredGroups.forEach((group, index) => {

        const className = `${grade}-${group}`;

        const button = document.createElement("button");

        button.className = "class-card";

        button.innerHTML = `
            <div class="class-card-icon">
                🎓
            </div>

            <div class="class-card-content">
                <h3>${className}</h3>
                <p>${grade}-sinf • ${group}-guruh</p>
            </div>

            <div class="class-card-arrow">
                →
            </div>
        `;

        button.addEventListener("click", () => {

            openSchedule(className);

        });

        classGrid.appendChild(button);

    });

}


// ==========================================
// 8. SINF BUTTONLARINI BOSISH
// ==========================================

gradeButtons.addEventListener("click", (event) => {

    const button = event.target.closest(".grade-btn");

    if (!button) return;

    // Barcha active ni olib tashlash
    document.querySelectorAll(".grade-btn").forEach(btn => {

        btn.classList.remove("active");

    });


    // Tanlangan button
    button.classList.add("active");


    // Grade olish
    selectedGrade = Number(button.dataset.grade);


    // Title
    selectedGradeTitle.textContent =
        `${selectedGrade}-sinf guruhlari`;


    // Searchni tozalash
    searchInput.value = "";


    // Sinflarni qayta chiqarish
    renderClasses(selectedGrade);

});


// ==========================================
// 9. SEARCH
// ==========================================

searchInput.addEventListener("input", () => {

    const value = searchInput.value;

    renderClasses(selectedGrade, value);

});


// ==========================================
// 10. SEARCH CLEAR
// ==========================================

clearSearch.addEventListener("click", () => {

    searchInput.value = "";

    renderClasses(selectedGrade);

    searchInput.focus();

});


// ==========================================
// 11. JADVALNI OCHISH
// ==========================================

function openSchedule(className) {

    selectedClass = className;

    scheduleClassName.textContent = `${className} sinf`;

    // Asosiy bo‘limlarni yashirish
    document.querySelector(".hero").style.display = "none";
    document.querySelector(".search-box").style.display = "none";
    document.querySelector(".grade-section").style.display = "none";
    document.querySelector(".classes-section").style.display = "none";


    // Jadvalni ko‘rsatish
    scheduleSection.classList.remove("hidden");


    // Default kun
    selectedDay = "monday";

    document.querySelectorAll(".day-btn").forEach(btn => {

        btn.classList.remove("active");

    });

    const mondayButton =
        document.querySelector('[data-day="monday"]');

    if (mondayButton) {
        mondayButton.classList.add("active");
    }


    // Darslarni chiqarish
    renderLessons();


    // Tepaga scroll
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// 12. JADVALNI YOPISH
// ==========================================

backBtn.addEventListener("click", () => {

    scheduleSection.classList.add("hidden");

    document.querySelector(".hero").style.display = "";
    document.querySelector(".search-box").style.display = "";
    document.querySelector(".grade-section").style.display = "";
    document.querySelector(".classes-section").style.display = "";


    selectedClass = null;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ==========================================
// 13. HAFTA KUNLARI
// ==========================================

weekTabs.addEventListener("click", (event) => {

    const button = event.target.closest(".day-btn");

    if (!button) return;


    // Active
    document.querySelectorAll(".day-btn").forEach(btn => {

        btn.classList.remove("active");

    });

    button.classList.add("active");


    // Kun
    selectedDay = button.dataset.day;


    // Darslarni chiqarish
    renderLessons();

});


// ==========================================
// 14. DARS JADVALINI CHIQARISH
// ==========================================

function renderLessons() {

    lessonsContainer.innerHTML = "";


    if (!selectedClass) return;


    const grade = parseInt(selectedClass.split("-")[0]);


    // Har bir kun uchun fanlarni
    // grade asosida ozgina farqlantiramiz

    const dayIndex = Object.keys(dayNames).indexOf(selectedDay);


    for (let i = 0; i < 6; i++) {

        const subjectIndex =
            (grade + dayIndex + i) % subjects.length;

        const subject = subjects[subjectIndex];

        const lesson = document.createElement("div");

        lesson.className = "lesson-card";


        lesson.innerHTML = `

            <div class="lesson-number">
                ${i + 1}
            </div>

            <div class="lesson-time">
                <span>🕐</span>
                ${lessonTimes[i]}
            </div>

            <div class="lesson-info">

                <div class="lesson-icon">
                    ${subject.icon}
                </div>

                <div>

                    <h3>
                        ${subject.name}
                    </h3>

                    <p>
                        👨‍🏫 ${subject.teacher}
                    </p>

                </div>

            </div>

        

        `;


        lessonsContainer.appendChild(lesson);

    }

}


// ==========================================
// 15. DARK / LIGHT MODE
// ==========================================

function setTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";

    } else {

        document.body.classList.remove("dark");

        themeBtn.textContent = "🌙";

    }

    localStorage.setItem("school-theme", theme);

}


// ==========================================
// 16. THEME BUTTON
// ==========================================

themeBtn.addEventListener("click", () => {

    const isDark =
        document.body.classList.contains("dark");


    if (isDark) {

        setTheme("light");

    } else {

        setTheme("dark");

    }

});


// ==========================================
// 17. SAQLANGAN TEMANI OLISH
// ==========================================

const savedTheme =
    localStorage.getItem("school-theme");


if (savedTheme) {

    setTheme(savedTheme);

} else {

    setTheme("light");

}


// ==========================================
// 18. BOSHLANG‘ICH HOLAT
// ==========================================

renderClasses(1);


// ==========================================
// 19. ESC BILAN JADVALDAN CHIQISH
// ==========================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (!scheduleSection.classList.contains("hidden")) {

            backBtn.click();

        }

    }

});


// ==========================================
// 20. BUGUNGI KUNNI ANIQLASH
// ==========================================

function getToday() {

    const day = new Date().getDay();

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];

    return days[day];

}


// ==========================================
// 21. BUGUNGI KUNNI AVTOMATIK TANLASH
// ==========================================

const today = getToday();

if (today !== "sunday") {

    const todayButton =
        document.querySelector(`[data-day="${today}"]`);

    if (todayButton) {

        document.querySelectorAll(".day-btn")
            .forEach(btn => btn.classList.remove("active"));

        todayButton.classList.add("active");

        selectedDay = today;

    }

}