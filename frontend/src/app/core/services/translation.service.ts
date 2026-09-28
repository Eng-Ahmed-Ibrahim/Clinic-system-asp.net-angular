import { Injectable, signal, computed, effect } from '@angular/core';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly storageKey = 'medicore_lang';
  readonly currentLang = signal<Language>(this.getInitialLang());
  readonly isRtl = computed(() => this.currentLang() === 'ar');
  readonly direction = computed<Direction>(() => (this.isRtl() ? 'rtl' : 'ltr'));

  private readonly dictionary: Record<Language, Record<string, string>> = {
    en: {
      // App branding & layout
      appName: 'MediCore Clinic',
      appSubtitle: 'Clinical Management System',
      searchPlaceholder: 'Search patients, appointments, doctors (Ctrl+K)...',
      quickSearch: 'Quick Search',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      switchToArabic: 'العربية (RTL)',
      switchToEnglish: 'English (LTR)',
      notifications: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No unread notifications',
      viewProfile: 'View Profile',
      accountSettings: 'Account Settings',
      logout: 'Sign Out',
      online: 'Online',
      offline: 'Offline',

      // Navigation
      navDashboard: 'Dashboard Overview',
      navPatients: 'Patients Directory',
      navComponents: 'UI Components',
      navProfile: 'Doctor Profile & Security',
      navAppointments: 'Appointments',
      navSettings: 'Settings',

      // Dashboard KPI Cards
      totalPatients: 'Total Patients',
      totalPatientsDesc: 'vs. last month',
      appointmentsToday: 'Appointments Today',
      appointmentsTodayDesc: 'active scheduled visits',
      consultationsRevenue: 'Total Revenue',
      consultationsRevenueDesc: 'billing this month',
      doctorSatisfaction: 'Satisfaction Rate',
      doctorSatisfactionDesc: 'based on 420 reviews',

      // Quick Actions
      quickActions: 'Quick Actions',
      newPatient: 'New Patient',
      exportReport: 'Export Report',
      filterList: 'Filter List',
      quickSearchTable: 'Filter table records...',

      // Table & Patient Headers
      tableTitle: 'Recent Patients & Consultations',
      tableSubtitle: 'Manage clinical records, triage status, and visit schedules',
      patientName: 'Patient Name',
      patientId: 'Record ID',
      ageGender: 'Age / Gender',
      bloodGroup: 'Blood Type',
      diagnosis: 'Primary Diagnosis',
      doctorAssigned: 'Attending Physician',
      lastVisitDate: 'Last Consultation',
      status: 'Status',
      actions: 'Actions',
      viewDetails: 'View Details',
      editRecord: 'Edit Record',
      deleteRecord: 'Delete Record',
      showingResults: 'Showing',
      ofResults: 'of',
      results: 'results',
      previous: 'Previous',
      next: 'Next',
      rowsPerPage: 'Rows per page',
      selectAll: 'Select all',
      selectedCount: 'selected',
      noRecordsFound: 'No patient records found matching your criteria',

      // Statuses
      statusAll: 'All Records',
      statusActive: 'Active Care',
      statusScheduled: 'Scheduled',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',

      // Modals
      addPatientTitle: 'Register New Patient',
      addPatientSubtitle: 'Enter clinical and demographic details for the new patient',
      editPatientTitle: 'Update Patient Record',
      editPatientSubtitle: 'Modify patient diagnosis and contact information',
      deletePatientTitle: 'Confirm Record Deletion',
      deletePatientMessage: 'Are you sure you want to delete this patient record? This action cannot be reversed.',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      confirmDelete: 'Yes, Delete',
      confirmAction: 'Confirm',
      close: 'Close',

      // Form Labels & Inputs
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Sarah Jenkins',
      emailAddress: 'Email Address',
      emailPlaceholder: 'doctor.ahmed@medicore.com',
      phoneNumber: 'Phone Number',
      phonePlaceholder: '+1 (555) 345-6789',
      specialty: 'Specialty / Department',
      specialtyPlaceholder: 'Cardiology & Internal Medicine',
      hospitalClinic: 'Clinic Location / Branch',
      hospitalPlaceholder: 'Main Medical Center - Floor 4',
      bio: 'Professional Bio',
      bioPlaceholder: 'Brief professional overview and clinical qualifications...',
      age: 'Age',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',

      // Profile & Security Page
      profileTitle: 'Physician Profile & Account Security',
      profileSubtitle: 'Manage your clinical credentials, personal contact, and account protection',
      tabPersonalInfo: 'Personal Information',
      tabSecurity: 'Security & Password',
      tabPreferences: 'System Preferences',
      personalInfoTitle: 'Clinical Credentials',
      personalInfoSubtitle: 'These details are displayed on your prescription headers and patient reports',
      securityTitle: 'Password & Authentication',
      securitySubtitle: 'Keep your clinical portal account protected with a robust password',
      currentPassword: 'Current Password',
      currentPasswordPlaceholder: 'Enter current password',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter new secure password',
      confirmPassword: 'Confirm New Password',
      confirmPasswordPlaceholder: 'Re-enter your new password',
      passwordStrength: 'Password Strength',
      passwordMatch: 'Passwords match',
      passwordMismatch: 'Passwords do not match',
      updatePasswordBtn: 'Update Password',
      passwordRuleMinLength: 'At least 8 characters',
      passwordRuleUpper: 'Contains uppercase letter (A-Z)',
      passwordRuleLower: 'Contains lowercase letter (a-z)',
      passwordRuleNumber: 'Contains at least one number (0-9)',
      passwordRuleSpecial: 'Contains a symbol (!@#$%^&*)',
      twoFactorTitle: 'Two-Factor Authentication (2FA)',
      twoFactorDesc: 'Add an extra layer of security requiring SMS or Authenticator verification upon login',
      twoFactorEnabled: 'Enabled (Secured)',
      twoFactorDisabled: 'Disabled',
      saveProfileSuccess: 'Profile information updated successfully!',
      updatePasswordSuccess: 'Password changed successfully! Next login requires new credentials.',
      fillRequiredFields: 'Please fill in all required fields accurately.',

      // UI Components Showcase
      componentsTitle: 'Design System & UI Components',
      componentsSubtitle: 'Explore pre-built responsive inputs, dynamic tables, search bars, and dialogs',
      inputsShowcaseTitle: 'Interactive Form Inputs',
      tablesShowcaseTitle: 'Modern Data Tables',
      modalsShowcaseTitle: 'Modal Popups & Dialogs',
      searchShowcaseTitle: 'Search Input Variations',
      openModalBtn: 'Launch Interactive Modal',
      openConfirmBtn: 'Launch Confirmation Dialog',
      openFormModalBtn: 'Launch Patient Registration Modal',
    },
    ar: {
      // App branding & layout
      appName: 'عيادة ميديكور',
      appSubtitle: 'نظام إدارة العيادات والمراكز الطبية',
      searchPlaceholder: 'ابحث عن المرضى، المواعيد، الأطباء (Ctrl+K)...',
      quickSearch: 'بحث سريع',
      lightMode: 'الوضع النهاري',
      darkMode: 'الوضع الليلي',
      switchToArabic: 'العربية (RTL)',
      switchToEnglish: 'English (LTR)',
      notifications: 'الإشعارات',
      markAllRead: 'تحديد الكل كمقروء',
      noNotifications: 'لا توجد إشعارات غير مقروءة',
      viewProfile: 'الملف الشخصي',
      accountSettings: 'إعدادات الحساب',
      logout: 'تسجيل الخروج',
      online: 'متصل الآن',
      offline: 'غير متصل',

      // Navigation
      navDashboard: 'لوحة التحكم العامة',
      navPatients: 'سجل المرضى',
      navComponents: 'مكتبة العناصر (Components)',
      navProfile: 'الملف الشخصي والأمان',
      navAppointments: 'جدول المواعيد',
      navSettings: 'الإعدادات العامة',

      // Dashboard KPI Cards
      totalPatients: 'إجمالي المرضى',
      totalPatientsDesc: 'مقارنة بالشهر الماضي',
      appointmentsToday: 'مواعيد اليوم',
      appointmentsTodayDesc: 'زيارات مجدولة نشطة',
      consultationsRevenue: 'إجمالي الإيرادات',
      consultationsRevenueDesc: 'المطالبات المالية هذا الشهر',
      doctorSatisfaction: 'معدل رضا المرضى',
      doctorSatisfactionDesc: 'بناءً على 420 تقييماً معتمداً',

      // Quick Actions
      quickActions: 'الإجراءات السريعة',
      newPatient: 'إضافة مريض جديد',
      exportReport: 'تصدير تقرير',
      filterList: 'تصفية السجلات',
      quickSearchTable: 'ابحث داخل السجلات...',

      // Table & Patient Headers
      tableTitle: 'أحدث سجلات المرضى والاستشارات',
      tableSubtitle: 'إدارة الملفات الطبية، الفرز الإكلينيكي ومواعيد المتابعة',
      patientName: 'اسم المريض',
      patientId: 'رقم الملف',
      ageGender: 'العمر / الجنس',
      bloodGroup: 'فصيلة الدم',
      diagnosis: 'التشخيص الطبي',
      doctorAssigned: 'الطبيب المعالج',
      lastVisitDate: 'تاريخ آخر كشف',
      status: 'الحالة الطبية',
      actions: 'الإجراءات',
      viewDetails: 'عرض التفاصيل',
      editRecord: 'تعديل السجل',
      deleteRecord: 'حذف السجل',
      showingResults: 'عرض',
      ofResults: 'من أصل',
      results: 'سجلات',
      previous: 'السابق',
      next: 'التالي',
      rowsPerPage: 'عدد الصفوف',
      selectAll: 'تحديد الكل',
      selectedCount: 'محدد',
      noRecordsFound: 'لم يتم العثور على سجلات مطابقة للبحث',

      // Statuses
      statusAll: 'جميع السجلات',
      statusActive: 'تحت الرعاية',
      statusScheduled: 'موعد مؤكد',
      statusCompleted: 'مكتمل الكشف',
      statusCancelled: 'ملغي',

      // Modals
      addPatientTitle: 'تسجيل مريض جديد',
      addPatientSubtitle: 'أدخل البيانات الديموغرافية والتشخيصية لفتح ملف طبي جديد',
      editPatientTitle: 'تعديل بيانات المريض',
      editPatientSubtitle: 'تحديث بيانات التواصل والتشخيص الطبي للمريض',
      deletePatientTitle: 'تأكيد حذف الملف الطبي',
      deletePatientMessage: 'هل أنت متأكد من رغبتك في حذف هذا السجل نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      cancel: 'إلغاء',
      saveChanges: 'حفظ التغييرات',
      confirmDelete: 'نعم، احذف السجل',
      confirmAction: 'تأكيد',
      close: 'إغلاق',

      // Form Labels & Inputs
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'مثال: د. أحمد إبراهيم',
      emailAddress: 'البريد الإلكتروني',
      emailPlaceholder: 'doctor.ahmed@medicore.com',
      phoneNumber: 'رقم الهاتف',
      phonePlaceholder: '+20 100 234 5678',
      specialty: 'التخصص الطبي',
      specialtyPlaceholder: 'أمراض القلب والباطنة',
      hospitalClinic: 'مقر العيادة / القسم',
      hospitalPlaceholder: 'المركز الطبي الرئيسي - الطابق 4',
      bio: 'نبذة مهنية',
      bioPlaceholder: 'نبذة عن الخبرات والمؤهلات الأكاديمية والسريرية...',
      age: 'العمر',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',

      // Profile & Security Page
      profileTitle: 'الملف الشخصي وإعدادات الأمان',
      profileSubtitle: 'إدارة البيانات الطبية والمهنية وتحديث كلمة المرور وحماية الحساب',
      tabPersonalInfo: 'البيانات الشخصية والمهنية',
      tabSecurity: 'الأمان وكلمة المرور',
      tabPreferences: 'تفضيلات النظام',
      personalInfoTitle: 'البيانات الطبية المعتمدة',
      personalInfoSubtitle: 'تظهر هذه المعلومات في ترويسة الوصفات الطبية وتقارير المرضى',
      securityTitle: 'كلمة المرور والحماية',
      securitySubtitle: 'حافظ على حماية حسابك الطبي وخصوصية المرضى باختيار كلمة مرور قوية',
      currentPassword: 'كلمة المرور الحالية',
      currentPasswordPlaceholder: 'أدخل كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      newPasswordPlaceholder: 'أدخل كلمة مرور جديدة قوية',
      confirmPassword: 'تأكيد كلمة المرور الجديدة',
      confirmPasswordPlaceholder: 'أعد كتابة كلمة المرور الجديدة',
      passwordStrength: 'قوة كلمة المرور',
      passwordMatch: 'كلمتا المرور متطابقتان',
      passwordMismatch: 'كلمتا المرور غير متطابقتين',
      updatePasswordBtn: 'تحديث كلمة المرور',
      passwordRuleMinLength: '8 أحرف على الأقل',
      passwordRuleUpper: 'تحتوي على حرف كبير بالإنجليزية (A-Z)',
      passwordRuleLower: 'تحتوي على حرف صغير (a-z)',
      passwordRuleNumber: 'تحتوي على رقم واحد على الأقل (0-9)',
      passwordRuleSpecial: 'تحتوي على رمز خاص (!@#$%^&*)',
      twoFactorTitle: 'التحقق بخطوتين (2FA)',
      twoFactorDesc: 'إضافة طبقة أمان إضافية تتطلب رمز تحقق عبر الرسائل القصيرة أو تطبيق المصادقة',
      twoFactorEnabled: 'مفعل (محمي بالكامل)',
      twoFactorDisabled: 'غير مفعل',
      saveProfileSuccess: 'تم تحديث بيانات الملف الشخصي بنجاح!',
      updatePasswordSuccess: 'تم تغيير كلمة المرور بنجاح! يلزم استخدامها في تسجيل الدخول القادم.',
      fillRequiredFields: 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح.',

      // UI Components Showcase
      componentsTitle: 'مكتبة العناصر ومكونات الواجهة',
      componentsSubtitle: 'استكشف حقول الإدخال، الجداول الديناميكية، شريط البحث والنوافذ المنبثقة التفاعلية',
      inputsShowcaseTitle: 'نماذج حقول الإدخال',
      tablesShowcaseTitle: 'الجداول المتقدمة مع التصفية والفرز',
      modalsShowcaseTitle: 'النوافذ المنبثقة (Modals & Popups)',
      searchShowcaseTitle: 'أنماط شريط البحث',
      openModalBtn: 'فتح نافذة منبثقة تفاعلية',
      openConfirmBtn: 'فتح نافذة تأكيد الإجراء',
      openFormModalBtn: 'فتح نافذة تسجيل مريض',
    },
  };

  constructor() {
    effect(() => {
      const lang = this.currentLang();
      const dir = this.direction();
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.setAttribute('lang', lang);
        root.setAttribute('dir', dir);
        try {
          localStorage.setItem(this.storageKey, lang);
        } catch {
          // Ignore storage errors
        }
      }
    });
  }

  private getInitialLang(): Language {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey) as Language | null;
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    }
    return 'en';
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
  }

  toggleLanguage(): void {
    this.currentLang.update((curr) => (curr === 'en' ? 'ar' : 'en'));
  }

  t(key: string): string {
    const lang = this.currentLang();
    return this.dictionary[lang]?.[key] ?? this.dictionary['en']?.[key] ?? key;
  }
}
