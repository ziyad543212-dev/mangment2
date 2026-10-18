import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    language: 'العربية', workspace: 'Workspace', overview: 'Overview', projects: 'Projects', workspaceSection: 'WORKSPACE',
    help: 'Help center', personalWorkspace: 'Personal workspace', newProject: 'New project',
    yourWorkspace: 'YOUR WORKSPACE', morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening',
    dashboardIntro: 'Here’s what’s happening with your work today.', totalProjects: 'Total projects', activeTasks: 'Active tasks',
    completedItems: 'Completed items', upcomingDeadlines: 'Upcoming deadlines', acrossWorkspace: 'Across your workspace',
    readyAttention: 'Ready for your attention', projectsAndTasks: 'Projects and tasks', next7Days: 'In the next 7 days',
    onTrack: 'On track', yourWork: 'YOUR WORK', findProject: 'Find a project…', filterProjectStatus: 'Filter project status',
    filterProjectPriority: 'Filter project priority', sortProjects: 'Sort projects', allStatuses: 'All statuses',
    notStarted: 'Not started', inProgress: 'In progress', completed: 'Completed', allPriorities: 'All priorities',
    highPriority: 'High priority', mediumPriority: 'Medium priority', lowPriority: 'Low priority',
    recentlyAdded: 'Recently added', dueDate: 'Due date', name: 'Name', noDescription: 'No description yet',
    tasks: 'tasks', task: 'task', noMatchingProjects: 'No projects match those filters', freshStart: 'A fresh start',
    adjustFilters: 'Try adjusting your search or filters.', createFirstProject: 'Create your first project and bring your next big idea to life.',
    createProject: 'Create a project', showing: 'Showing', project: 'project', projectsPlural: 'projects', upToDate: 'Up to date',
    stayAhead: 'STAY AHEAD', comingUp: 'Coming up', clearSkies: 'Clear skies ahead', noDeadlines: 'No deadlines in the next 7 days.',
    projectType: 'Project', nextSevenDays: 'Next 7 days', item: 'item', items: 'items', reminder: 'A SMALL REMINDER',
    progressPractice: 'Progress is a practice.', encouragement: 'Every task you move forward is worth celebrating. Keep going at your own pace.',
    youveGotThis: 'You’ve got this', latest: 'THE LATEST', recentActivity: 'Recent activity', liveUpdates: 'Live updates',
    retry: 'Retry', loadingProject: 'Loading project', projectUnavailable: 'Project unavailable', backOverview: 'Back to overview',
    allProjects: 'All projects', editProject: 'Edit project', deleteProject: 'Delete project', projectOverview: 'PROJECT OVERVIEW',
    projectDescriptionHint: 'Give this project a description to keep everyone aligned.', due: 'Due', noDueDate: 'No due date',
    completeOf: 'of', tasksComplete: 'tasks complete', makeItHappen: 'MAKE IT HAPPEN', taskBoard: 'Task board',
    findTask: 'Find a task…', filterTasks: 'Filter tasks', allTasks: 'All tasks', addTask: 'Add task', todo: 'To do',
    overdue: 'Overdue', today: 'Today', nothingHere: 'Nothing here yet', startTask: 'Add a task to get started',
    noMatchingTasks: 'No matching tasks', boardReady: 'Your board is ready', breakIntoSteps: 'Break this project into small, satisfying steps.',
    addFirstTask: 'Add the first task', deleteTaskConfirm: 'This can’t be undone.', close: 'Close', workspaceLabel: 'WORKSPACE',
    createProjectTitle: 'Create a project', editProjectTitle: 'Edit project', addTaskTitle: 'Add a task', editTaskTitle: 'Edit task',
    projectName: 'Project name', exampleProject: 'e.g. Website redesign', description: 'Description', optional: 'Optional',
    projectDescriptionPlaceholder: 'What are you working towards?', status: 'Status', priority: 'Priority',
    low: 'Low', medium: 'Medium', high: 'High', cancel: 'Cancel', saveProject: 'Save project', saving: 'Saving…',
    taskName: 'Task name', taskNamePlaceholder: 'What needs to get done?', taskDescriptionPlaceholder: 'Add a little more detail',
    saveTask: 'Save task', signIn: 'Sign in', signUp: 'Create an account', backHome: 'Back to home',
    startSomethingGood: 'START SOMETHING GOOD', welcomeBack: 'WELCOME BACK', createWorkspace: 'Create your workspace',
    signInGreeting: 'Good to see you again', signupIntro: 'A focused place to plan, track, and finish your work.',
    signinIntro: 'Sign in to pick up right where you left off.', makeRoom: 'MAKE ROOM FOR YOUR BEST WORK',
    bringIdeas: 'Bring your ideas', intoFocus: 'into focus.', brandIntro: 'A thoughtful space for your projects, priorities, and all the little steps in between.',
    everyDay: 'A little progress, every day.', projectProgress: 'Project progress', madeMeaningful: 'Made for meaningful work',
    yourName: 'Your name', emailAddress: 'Email address', password: 'Password', alexMorgan: 'Alex Morgan',
    passwordHint: 'At least 10 characters', enterPassword: 'Enter your password', useTenCharacters: 'Use at least 10 characters',
    pleaseWait: 'Please wait…', createAccount: 'Create account', alreadyAccount: 'Already have an account?',
    newToDaymark: 'New to Daymark?', privateWorkspace: 'Your workspace is private to you. We’ll never share your data.',
    hidePassword: 'Hide password', showPassword: 'Show password', toggleMenu: 'Open menu', closeMenu: 'Close menu',
    signOut: 'Sign out', edit: 'Edit', delete: 'Delete', unknown: 'Unknown', noProjectsDescription: 'No description yet',
    requestError: 'Invalid request. Check the information and try again.', authRequired: 'Please sign in to continue.',
    invalidSession: 'Your session has expired. Please sign in again.', credentialsError: 'Email or password is incorrect.',
    duplicateRecord: 'A record with that value already exists.', projectMissing: 'Project not found.', taskMissing: 'Task not found.',
    tooManyAttempts: 'Too many authentication attempts. Try again later.', unexpectedError: 'An unexpected server error occurred.',
    untrustedOrigin: 'This request origin is not allowed.', networkError: 'Unable to connect. Check your connection and try again.',
    requestOriginRequired: 'Request origin is required.',
  },
  ar: {
    language: 'English', workspace: 'مساحة العمل', overview: 'نظرة عامة', projects: 'المشاريع', workspaceSection: 'مساحة العمل',
    help: 'مركز المساعدة', personalWorkspace: 'مساحة عمل شخصية', newProject: 'مشروع جديد',
    yourWorkspace: 'مساحة عملك', morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير',
    dashboardIntro: 'إليك ملخص ما يجري في أعمالك اليوم.', totalProjects: 'إجمالي المشاريع', activeTasks: 'المهام النشطة',
    completedItems: 'العناصر المكتملة', upcomingDeadlines: 'المواعيد القادمة', acrossWorkspace: 'في مساحة عملك',
    readyAttention: 'تنتظر اهتمامك', projectsAndTasks: 'المشاريع والمهام', next7Days: 'خلال الأيام السبعة القادمة',
    onTrack: 'على المسار الصحيح', yourWork: 'أعمالك', findProject: 'ابحث عن مشروع…', filterProjectStatus: 'تصفية حسب حالة المشروع',
    filterProjectPriority: 'تصفية حسب أولوية المشروع', sortProjects: 'ترتيب المشاريع', allStatuses: 'كل الحالات',
    notStarted: 'لم يبدأ', inProgress: 'قيد التنفيذ', completed: 'مكتمل', allPriorities: 'كل الأولويات',
    highPriority: 'أولوية عالية', mediumPriority: 'أولوية متوسطة', lowPriority: 'أولوية منخفضة',
    recentlyAdded: 'الأحدث إضافة', dueDate: 'تاريخ الاستحقاق', name: 'الاسم', noDescription: 'لا يوجد وصف بعد',
    tasks: 'مهام', task: 'مهمة', noMatchingProjects: 'لا توجد مشاريع تطابق عوامل التصفية', freshStart: 'بداية جديدة',
    adjustFilters: 'جرّب تعديل البحث أو عوامل التصفية.', createFirstProject: 'أنشئ مشروعك الأول وابدأ بتحويل فكرتك القادمة إلى واقع.',
    createProject: 'إنشاء مشروع', showing: 'عرض', project: 'مشروع', projectsPlural: 'مشاريع', upToDate: 'محدّث',
    stayAhead: 'خطّط مسبقًا', comingUp: 'القادم', clearSkies: 'لا مواعيد قريبة', noDeadlines: 'لا توجد مواعيد خلال الأيام السبعة القادمة.',
    projectType: 'مشروع', nextSevenDays: 'الأيام السبعة القادمة', item: 'عنصر', items: 'عناصر', reminder: 'تذكير بسيط',
    progressPractice: 'التقدم عادة يومية.', encouragement: 'كل مهمة تنجزها تستحق الاحتفاء. واصل التقدم على وتيرتك الخاصة.',
    youveGotThis: 'أنت قادر على ذلك', latest: 'آخر المستجدات', recentActivity: 'النشاط الأخير', liveUpdates: 'تحديثات مباشرة',
    retry: 'إعادة المحاولة', loadingProject: 'جارٍ تحميل المشروع', projectUnavailable: 'المشروع غير متاح', backOverview: 'العودة إلى النظرة العامة',
    allProjects: 'كل المشاريع', editProject: 'تعديل المشروع', deleteProject: 'حذف المشروع', projectOverview: 'نظرة عامة على المشروع',
    projectDescriptionHint: 'أضف وصفًا لهذا المشروع لتبقى الأهداف واضحة للجميع.', due: 'الاستحقاق', noDueDate: 'بلا موعد استحقاق',
    completeOf: 'من', tasksComplete: 'مهام مكتملة', makeItHappen: 'ابدأ الإنجاز', taskBoard: 'لوحة المهام',
    findTask: 'ابحث عن مهمة…', filterTasks: 'تصفية المهام', allTasks: 'كل المهام', addTask: 'إضافة مهمة', todo: 'للإنجاز',
    overdue: 'متأخر', today: 'اليوم', nothingHere: 'لا شيء هنا بعد', startTask: 'أضف مهمة للبدء',
    noMatchingTasks: 'لا توجد مهام مطابقة', boardReady: 'لوحتك جاهزة', breakIntoSteps: 'قسّم المشروع إلى خطوات صغيرة يسهل إنجازها.',
    addFirstTask: 'أضف أول مهمة', deleteTaskConfirm: 'لا يمكن التراجع عن هذا الإجراء.', close: 'إغلاق', workspaceLabel: 'مساحة العمل',
    createProjectTitle: 'إنشاء مشروع', editProjectTitle: 'تعديل المشروع', addTaskTitle: 'إضافة مهمة', editTaskTitle: 'تعديل المهمة',
    projectName: 'اسم المشروع', exampleProject: 'مثال: إعادة تصميم الموقع', description: 'الوصف', optional: 'اختياري',
    projectDescriptionPlaceholder: 'ما الذي تسعى إلى إنجازه؟', status: 'الحالة', priority: 'الأولوية',
    low: 'منخفضة', medium: 'متوسطة', high: 'عالية', cancel: 'إلغاء', saveProject: 'حفظ المشروع', saving: 'جارٍ الحفظ…',
    taskName: 'اسم المهمة', taskNamePlaceholder: 'ما الذي ينبغي إنجازه؟', taskDescriptionPlaceholder: 'أضف مزيدًا من التفاصيل',
    saveTask: 'حفظ المهمة', signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', backHome: 'العودة إلى الرئيسية',
    startSomethingGood: 'ابدأ شيئًا رائعًا', welcomeBack: 'مرحبًا بعودتك', createWorkspace: 'أنشئ مساحة عملك',
    signInGreeting: 'سعداء بعودتك', signupIntro: 'مساحة منظمة لتخطيط أعمالك ومتابعتها وإنجازها.',
    signinIntro: 'سجّل الدخول للمتابعة من حيث توقفت.', makeRoom: 'هيّئ مساحة لأفضل أعمالك',
    bringIdeas: 'حوّل أفكارك', intoFocus: 'إلى واقع واضح.', brandIntro: 'مساحة مدروسة لمشاريعك وأولوياتك وكل خطوة صغيرة في الطريق.',
    everyDay: 'تقدم بسيط، كل يوم.', projectProgress: 'تقدم المشروع', madeMeaningful: 'صُمم للأعمال ذات الأثر',
    yourName: 'اسمك', emailAddress: 'البريد الإلكتروني', password: 'كلمة المرور', alexMorgan: 'أحمد محمد',
    passwordHint: '10 أحرف على الأقل', enterPassword: 'أدخل كلمة المرور', useTenCharacters: 'استخدم 10 أحرف على الأقل',
    pleaseWait: 'يرجى الانتظار…', createAccount: 'إنشاء الحساب', alreadyAccount: 'لديك حساب بالفعل؟',
    newToDaymark: 'مستخدم جديد في Daymark؟', privateWorkspace: 'مساحة عملك خاصة بك. لن نشارك بياناتك مطلقًا.',
    hidePassword: 'إخفاء كلمة المرور', showPassword: 'إظهار كلمة المرور', toggleMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة',
    signOut: 'تسجيل الخروج', edit: 'تعديل', delete: 'حذف', unknown: 'غير معروف', noProjectsDescription: 'لا يوجد وصف بعد',
    requestError: 'الطلب غير صالح. تحقق من المعلومات وحاول مرة أخرى.', authRequired: 'يرجى تسجيل الدخول للمتابعة.',
    invalidSession: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مجددًا.', credentialsError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    duplicateRecord: 'توجد بيانات مسجلة بهذه القيمة بالفعل.', projectMissing: 'المشروع غير موجود.', taskMissing: 'المهمة غير موجودة.',
    tooManyAttempts: 'محاولات تسجيل دخول كثيرة. حاول مرة أخرى لاحقًا.', unexpectedError: 'حدث خطأ غير متوقع في الخادم.',
    untrustedOrigin: 'مصدر هذا الطلب غير مسموح به.', networkError: 'تعذر الاتصال. تحقق من اتصالك وحاول مرة أخرى.',
    requestOriginRequired: 'مصدر الطلب مطلوب.',
  }
};

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem('daymark-locale') === 'ar' ? 'ar' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('daymark-locale', locale);
    } catch {
      // Language selection still works for this session when storage is unavailable.
    }
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    direction: locale === 'ar' ? 'rtl' : 'ltr',
    toggleLocale: () => setLocale((current) => current === 'en' ? 'ar' : 'en'),
    t: (key) => translations[locale][key] ?? key,
    dateLocale: locale === 'ar' ? 'ar' : 'en'
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
