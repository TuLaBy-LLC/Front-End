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
                    notifications: {
                        notifications: "Notifications",
                        settings:"Notifications Settings",
                        notification: "Notification",
                        sendAt: "Send At",
                        readAt: "Read At",
                        notificationDetails: "Notification Details",
                        viewAll: "View All",
                        noMore: "No More Notifications",
                    },
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
                        liveNow: "Live Now.!"
                    },
                    security: {
                        security:"Security",
                        settings:"Security Settings",
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
                        "updateImage": "Update Image",
                        "chooseImage": "Choose Image",
                        "noImage": "No Image",
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
                        filtration: "Filtration",
                        filter: "Filter",
                        id: "ID",
                        title: "Title",
                        content: "Content",
                        publisherid: "Publisher ID",
                        publishername: "Publisher Name",
                        publishernamear: "Publisher Arabic Name",
                        language: "Language",
                        arabic: "Arabic",
                        english: "English",
                        category: "Category",
                        source: "Source",
                        tags: "Tags",
                        views: "Views",
                        likes: "Likes",
                        lastupdated: "Last Updated",
                        publicationdate: "Publication Date",
                        breakingnews: "Breaking News",
                        sortbyproperty: "Sort By Property",
                        ascending: "Ascending",
                        priority: "Priority",
                        pageindex: "Page Index",
                        pagesize: "Page Size",
                        enablepublisher: "Add Publisher Data",
                        enableimages: "Add Images",

                        enableclub: "Enable Club",
                        enablenotification: "Enable Notification",
                        id: "ID",
                        isread: "Is Read",
                        isunread: "Is Unread",
                        sendat: "Sent At",
                        readat: "Read At",
                        clubid: "Club ID",
                        senderid: "Sender ID",
                        notificationid: "Notification ID",
                        notificationhead: "Notification Header",
                        sendername: "Sender Name",
                        sendernamear: "Sender Arabic Name",
                    }
                    ,
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
                        notInPlace: "You Are Not In Place To Take your Attendenace, Contact Your Leader."
                    },
                    settings:{
                        settings:"Settings..!"
                    }
                },
            },
            ar: {
                translation: {
                    TuLaBy: "طُلابي",
                    notifications: {
                        settings: "إعدادات الإشعارات",
                        notifications: "الإشعارات",
                        notification: "إشعار",
                        sendAt: "تاريخ الإرسال",
                        readAt: "تاريخ القراءة",
                        viewAll: "عرض الكل",
                        noMore: "لا يوجد إشعارات أُخري",
                        notificationDetails: "تفاصيل الإشعار"
                    },
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
                        liveNow: "!..شغاله الان"
                    },
                    security: {
                        security:"الأمن",
                        settings:"إعدادات الأمن",
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
                        "updateImage": "تعديل الصورة",
                        "chooseImage": "اختر صورة",
                        "noImage": "لا توجد صوره",
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
                        filtration: "الفلتره",
                        filter: "فلتر",
                        id: "معرف",
                        title: "العنوان",
                        content: "المحتوى",
                        publisherid: "معرف الناشر",
                        publishername: "اسم الناشر",
                        publishernamear: "اسم الناشر بالعربية",
                        language: "اللغة",
                        arabic: "عربي",
                        english: "إنجليزي",
                        category: "الفئة",
                        source: "المصدر",
                        tags: "العلامات",
                        views: "الآراء",
                        likes: "الإعجابات",
                        lastupdated: "آخر تحديث",
                        publicationdate: "تاريخ النشر",
                        breakingnews: "أخبار عاجلة",
                        sortbyproperty: "فرز حسب الخاصية",
                        ascending: "تصاعدي",
                        priority: "الأولوية",
                        pageindex: "رقم الصفحة",
                        pagesize: "حجم الصفحة",
                        enablepublisher: "اضافة بيانات الناشر",
                        enableimages: "اضافة الصور",

                        enableclub: "تمكين النادي",
                        enablenotification: "تمكين الإشعارات",
                        id: "المعرف",
                        isread: "تمت القراءة",
                        isunread: "غير مقروء",
                        sendat: "تاريخ الإرسال",
                        readat: "تاريخ القراءة",
                        clubid: "معرف النادي",
                        senderid: "معرف المرسل",
                        notificationid: "معرف الإشعار",
                        notificationhead: "عنوان الإشعار",
                        sendername: "اسم المستخدم",
                        sendernamear: "اسم المستخدم (بالعربية)",
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
                    captureAttendance: {
                        "title": "التقاط رمز الاستجابة السريعة",
                        "scanNow": "مسح الآن",
                        "paused": "معلق",
                        "typeCode": "أدخل الرمز",
                        "typeCodeTitle": "أدخل الرمز",
                        "enterCode": "أدخل الرمز",
                        "code": "رمز",
                        "captureQRCode": "التقاط رمز الاستجابة السريعة",
                        notInPlace: "!..أنت لست داخل المكان لأخذ حضورك, تواصل مع القائد"
                    },
                    settings:{
                        settings:"!..الإعدادات"
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
