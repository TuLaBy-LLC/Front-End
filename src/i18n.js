import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: "en",
        resources: {
            en: {
                translation: {
                    TuLaBy: "TuLaBy",

                    news: {
                        news: "News",
                        0: "No News Founded..!",
                        date: "Date",
                        wroteBy: "Wrote By",
                        tags: "Tags",
                        header: {
                            all: "All the news",
                            Popular: "Popular",
                            Announcements: "Announcements",
                            Latest: "Latest",
                        },
                    },
                    misc: {
                        readMore: "Read More",
                        likes: "Likes",
                        "views": "Views",
                        Language: "Language",
                        Settings: "Settings",
                        "My Profile": "My Profile",
                        Home: "Home",
                        Attendance: "Attendance",
                        speech: `
            is an educational platform aims to revolutionize the
            learning experience for students and streamline
            administrative tasks for instructors.
            `,
                        "save": "Save",
                        "next lecture": "Next Lecture",
                        "next session": "Next Session",
                        "Time Left": "Time Left",
                        "presence": "Presence",
                        "absence": "Absence",
                        "Attendance Statistics": "Attendance Statistics",
                        "place": "Place",
                        "duration": "Duration",
                        "title": "Title",
                        "bouns": "Bouns",
                        "date": "Date",
                        "totalMarks": "Total Marks",
                        "grade": "Grade",
                        "lectures": "Lectures",
                        "sessions": "Sessions",
                        "Show Lectures": "Show Lectures",
                        "Show Sessions": "Show Sessions",
                        "Capture Attendance": "Capture Attendance",
                        "showStatistics": "Show Statistics",
                        "Days": "Days",
                        "Hours": "Hours",
                        "Minutes": "Minutes",
                        "Seconds": "Seconds",
                        "ok": "Ok",
                        "close": "Close",
                        liveNow:"Live Now.!"
                    },
                    security: {
                        Logout: "Logout",
                        Login: "Login",
                        "Enter code": "Enter code",
                        Password: "Password",
                        forgetPassword: "Forgot Password?",
                        resetPassword: "Reset Password",
                        changePassword: "Change Password",
                        Change: "Change",
                        haveAccount: "Have an Account, Login Now?",
                        "New Password": "New Password",
                        "Default Password": "Default Password",
                        "Submit": "Submit"
                    },
                    profile: {
                        level_1: "First Level",
                        level_2: "Second Level",
                        level_3: "Third Level",
                        level_4: "Fourth Level",

                        form: {
                            name: "Name In English",
                            nameAR: "Name In Arabic",
                            email: "Email",
                            nationalId: "Nationality ID",
                            country: "Country",
                            address: "Address",
                            phoneNumber: "Phone Number",
                            biographical: "Biographical",
                            biographicalAR: "Biographical in Arabic",
                            religion: "Religion",
                            gender: "Gender",
                            picture: "Picture",
                            birthDate: "Birth Date",
                        },
                        "Complete your profile": "Complete your profile",
                        "Edit Profile": "Edit Profile",
                        "updateImage":"Update Image",
                        "chooseImage":"Choose Image",
                        "noImage":"No Image",
                        "edit-success": "Hello, Your Data Successfully Updated."
                    },
                    persons: {
                        professor: "Professor",
                        instructor: "Instructor"
                    },
                    errors: {
                        UpcomingLectures: "There Are No Upcoming Lectures",
                        UpcomingSessions: "There Are No Upcoming Sessions",

                        LecturesRecords: "There Are No Lectures Records Found ..!",
                        SessionsRecords: "There Are No Sessions Records Found ..!",

                        StatisticsProvided: "There Are No Statistics ..!",

                        apiError: "Something went wrong, try again ..!"
                    },
                    warning: {
                        subjects0: "You're not assigned to any subject..!"
                    },
                    filtrationPanel: {
                        "filtration": "Filtration",
                        "filter": "Filter",
                        "ID": "ID",
                        "Title": "Title",
                        "Content": "Content",
                        "PublisherID": "Publisher ID",
                        "PublisherName": "Publisher Name",
                        "PublisherNameAR": "Publisher Arabic Name",
                        "Language": "Language",
                        "Arabic": "Arabic",
                        "English": "English",
                        "Category": "Category",
                        "Source": "Source",
                        "Tags": "Tags",
                        "Views": "Views",
                        "Likes": "Likes",
                        "LastUpdated": "Last Updated",
                        "PublicationDate": "Publication Date",
                        "BreakingNews": "Breaking News",
                        "SortByProperty": "Sort By Property",
                        "Ascending": "Ascending",
                        "Priority": "Priority",
                        "PageIndex": "Page Index",
                        "PageSize": "Page Size",
                        "EnablePublisher": "Add Publisher Data",
                        "EnableImages": "Add Images",
                    },
                    attendance: {
                        title: "Title",
                        startDate: "Start of the Week",
                        endDate: "End of the Week"
                    },
                    times: {
                        "Time": "Time",
                        "AM": "AM",
                        "PM": "PM"
                    },
                    captureAttendance: {
                        "title": "Capture QR-Code",
                        "scanNow": "Scan Now",
                        "paused": "Paused",
                        "typeCode": "Type Code",
                        "typeCodeTitle": "Type Code",
                        "enterCode": "Enter Code",
                        "code": "Code",
                        "captureQRCode": "Capture QR-Code",
                        notInPlace:"You Are Not In Place To Take your Attendenace, Contact Your Leader."
                    },
                },
            },
            ar: {
                translation: {
                    TuLaBy: "طُلابي",

                    news: {
                        news: "ألاخبار",
                        wroteBy: "كٌتب بواسطة",
                        0: "لا يوجد أخبار..!",
                        date: "التاريخ",
                        tags: "هاشتاج",
                        header: {
                            all: "كل الاخبار",
                            Popular: "شائع",
                            Announcements: "تصريحات",
                            Latest: "مؤخرا",
                        },
                    },
                    misc: {
                        likes: "الاعجابات",
                        "readMore": "المزيد",
                        "views": "المشاهدات",
                        Language: "اللغة",
                        Settings: "الاعدادات",
                        "My Profile": "صفحتي الشخصية",
                        Home: "الصفحة الرئيسيه",
                        Attendance: "الغياب والحضور",
                        speech: `
            منصة تعليمية تهدف إلى ثورة في تجربة التعلم للطلاب وتسهيل المهام الإدارية للمدرسين.
            `,
                        "save": "حفظ",
                        "next lecture": "المحاضره القادمه",
                        "next session": "المعمل القادم",
                        "Time Left": "الوقت المتبقي",
                        "presence": "الحضور",
                        "absence": "الغياب",
                        "Attendance Statistics": "احصائيات الحضور",
                        "place": "المكان",
                        "duration": "المده",
                        "title": "العنوان",
                        "bouns": "المكافأه",
                        "date": "التاريخ",
                        "totalMarks": "الدرجات الكليه",
                        "grade": "التقدير",
                        "lectures": "المحاضرات",
                        "sessions": "السكاشن",
                        "Show Lectures": "أعرض المحاضرات",
                        "Show Sessions": "أعرض السكاشن",
                        "Capture Attendance": "خُذ الحضور",
                        "showStatistics": "عرض الاحصائيات",
                        "Days": "يوم",
                        "Hours": "ساعة",
                        "Minutes": "دقيقة",
                        "Seconds": "ثانية",
                        "ok": "موافق",
                        "close": "إغلاق",
                        liveNow:"!..شغاله الان"
                    },
                    security: {
                        Logout: "تسجيل خروج",
                        Login: "تسجيل دخول",
                        "Enter code": "أدخل الكود",
                        Password: "كلملة السر",
                        "forgetPassword": "هل نسيت كلمة السر؟",
                        "resetPassword": "اعادة ضبط كلمة السر",
                        "changePassword": "تغير كلمة السر",
                        "Change": "تغير",
                        haveAccount: "هل لديك حساب,  سجل دخولك الأن؟",
                        "Submit": "تأكيد",
                        "New Password": "كلمة السر الجديده",
                        "Default Password": "كلمة السر الافتراضيه",
                    },
                    profile: {
                        level_1: "المستوى الأول",
                        level_2: "المستوى الثاني",
                        level_3: "المستوى الثالث",
                        level_4: "المستوى الرابع",

                        form: {
                            name: "الاسم بالإنجليزية",
                            nameAR: "الاسم بالعربية",
                            email: "البريد الإلكتروني",
                            nationalId: "الرقم القومي",
                            country: "الدولة",
                            address: "العنوان",
                            phoneNumber: "رقم الهاتف",
                            biographical: "السيرة الذاتيه",
                            biographicalAR: "السيرة الذاتيه بالعربيه",
                            religion: "الديانة",
                            picture: "الصوره الشخصيه",
                            gender: "الجنس",
                            birthDate: "تاريخ الميلاد"
                        },
                        "Complete your profile": "أكمل ملفك الشخصي",
                        "Edit Profile": "تعديل الملف الشخصي",
                        "updateImage":"تعديل الصورة",
                        "chooseImage":"اختر صورة",
                        "noImage":"لا توجد صوره",
                        "edit-success": "مرحبا, بياناتك عُدلت بنجاح."
                    },
                    persons: {
                        professor: "الدكتور",
                        instructor: "المعيد",
                    },
                    errors: {
                        UpcomingLectures: "!.. لا يوجد محاضرات قادمة",
                        UpcomingSessions: "!.. لا يوجد معامل قادمة ",

                        LecturesRecords: "!.. لا توجد سجلات للمحاضرات",
                        SessionsRecords: "!.. لا توجد سجلات للمعامل",

                        StatisticsProvided: "!.. لا توجد احصائيات",

                        apiError: "!.. حدث شيئ خاطئ, حاول مره اخري"
                    },
                    warning: {
                        subjects0: "!..لا توجد مواد مسجله لك"
                    },
                    filtrationPanel: {
                        "filtration": "الفلتره",
                        "filter": "فلتر",
                        "ID": "معرف",
                        "Title": "العنوان",
                        "Content": "المحتوى",
                        "PublisherID": "معرف الناشر",
                        "PublisherName": "اسم الناشر",
                        "PublisherNameAR": "اسم الناشر بالعربية",
                        "Language": "اللغة",
                        "Arabic": "عربي",
                        "English": "إنجليزي",
                        "Category": "الفئة",
                        "Source": "المصدر",
                        "Tags": "العلامات",
                        "Views": "الآراء",
                        "Likes": "الإعجابات",
                        "LastUpdated": "آخر تحديث",
                        "PublicationDate": "تاريخ النشر",
                        "BreakingNews": "أخبار عاجلة",
                        "SortByProperty": "فرز حسب الخاصية",
                        "Ascending": "تصاعدي",
                        "Priority": "الأولوية",
                        "PageIndex": "رقم الصفحة",
                        "PageSize": "حجم الصفحة",
                        "EnablePublisher": "اضافة بيانات الناشر",
                        "EnableImages": "اضافة الصور"
                    },
                    attendance: {
                        title: "العنوان",
                        startDate: "بداية الأسبوع",
                        endDate: "نهاية الاسبوع"
                    },
                    times: {
                        "Time": "الوقت",
                        "AM": "ص",
                        "PM": "م"
                    },
                    "captureAttendance": {
                        "title": "التقاط رمز الاستجابة السريعة",
                        "scanNow": "مسح الآن",
                        "paused": "معلق",
                        "typeCode": "أدخل الرمز",
                        "typeCodeTitle": "أدخل الرمز",
                        "enterCode": "أدخل الرمز",
                        "code": "رمز",
                        "captureQRCode": "التقاط رمز الاستجابة السريعة",
                        notInPlace:"!..أنت لست داخل المكان لأخذ حضورك, تواصل مع القائد"
                    }
                },
            },
            // Add translations for other languages
        },

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
