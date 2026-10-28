import { Language } from './types';

export const translations = {
  en: {
    // App & Identity
    appName: 'WorkProof',
    prototypeNotice: 'Prototype: data stays on this phone',
    languageSelect: 'Choose Language',

    // Nav / Common
    back: 'Back',
    cancel: 'Cancel ✗',
    confirm: 'Confirm ✓',
    next: 'Next →',
    skip: 'Skip →',
    retry: 'Retry ↻',
    done: 'Done ✓',
    save: 'Save ✓',
    delete: 'Delete ✗',
    remove: 'Remove ✗',
    close: 'Close',
    yesEnd: 'Yes, End ✗',
    noKeep: 'No, Keep Working ✓',
    switchRole: 'Switch Role / Reset',
    installApp: 'Install App',
    deployGuide: 'How to Deploy / Run',

    // Fake Login steps
    enterPhoneTitle: 'Phone Number',
    phonePlaceholder: '10-digit number',
    phoneError: 'Enter 10 digits',
    enterOtpTitle: 'Enter OTP',
    otpHint: 'Hint: 123456',
    otpError: 'Wrong OTP. Use 123456',
    chooseRoleTitle: 'Who are you?',
    iAmWorker: 'I am a Worker',
    iAmContractor: 'I am a Contractor',
    enterNameTitle: 'Your Name',
    namePlaceholder: 'e.g. Ramesh Kumar',
    nameError: 'Please enter your name',
    startApp: 'Start WorkProof ✓',

    // Worker Home
    startWorkBtn: 'START WORK',
    joinJobBtn: 'Join Job +',
    myProofsBtn: 'My Proofs 📄',
    myJobsTitle: 'My Jobs',
    noJobsYet: 'No jobs joined yet',
    noJobDirectStart: 'You can start directly without a job',
    contractorLabel: 'Contractor',
    codeLabel: 'Code',
    workingNowBadge: 'Working Now',

    // Join Job
    joinJobTitle: 'Join Job',
    enter5DigitCode: 'Enter 5-digit code',
    demoCodesHint: 'Demo codes: 12345 or 67890',
    jobNotFound: 'Job not found with this code ✗',
    lockoutWarning: 'Too many wrong tries. Locked for',
    minutesSuffix: 'min',
    confirmJoinJob: 'Confirm Job',
    joinSuccess: 'Job Joined ✓',

    // Start Flow
    chooseJobToStart: 'Select Work Job',
    noJobOption: 'General Work (No Job)',
    findingLocation: 'Finding GPS Location...',
    locationDenied: 'Location Access Needed ✗',
    locationDeniedDesc: 'Please allow location to prove you are on site',
    outsideSiteWarning: 'You are NOT at the work site ✗',
    distanceAway: 'Distance away',
    startAnyway: 'Start anyway ✓',
    atWorkSite: 'At work site ✓',
    takeSitePhoto: 'Site Photo (Optional)',
    snapPhotoBtn: 'Camera Photo 📷',
    photoAttached: 'Photo added ✓',

    // Working Session
    workInProgress: 'WORK IN PROGRESS',
    startedAt: 'Started at',
    addPhoto: 'Add Photo 📷',
    endWorkBtn: 'END WORK ✗',
    confirmEndTitle: 'End work now?',
    alert12Hours: '⚠️ 12+ hours running! Did you forget to end work?',

    // Proof Screen
    proofTitle: 'WORK PROOF',
    workerLabel: 'Worker',
    dateLabel: 'Date',
    startTimeLabel: 'Start Time',
    endTimeLabel: 'End Time',
    totalHoursLabel: 'TOTAL HOURS',
    locationLabel: 'Location',
    siteStatusLabel: 'Site Status',
    verifiedOnSite: '✓ Verified On Site',
    outsideSite: '✗ Outside Site',
    generalLocation: '✓ GPS Recorded',
    shareOnWhatsApp: 'Share on WhatsApp',
    viewOnMaps: 'View on Google Maps',
    backToHome: 'Back to Home',
    proofSavedLocal: 'Saved to your phone storage ✓',

    // My Proofs
    pastProofsTitle: 'My Work Proofs',
    noPastProofs: 'No past proofs yet',
    tapToShare: 'Tap to view and share',

    // Contractor Home & Jobs
    contractorTitle: 'Contractor Dashboard',
    createJobBtn: 'Create Job +',
    activeJobsList: 'Your Jobs',
    noContractorJobs: 'No jobs created yet. Tap Create Job.',
    workersCount: 'workers',

    // Create Job
    createJobTitle: 'Create New Job',
    jobNameLabel: 'Job Name / Site',
    jobNamePlaceholder: 'e.g. Metro Pillar No. 42',
    setSiteLocationBtn: 'Set site here (GPS)',
    siteLocationSaved: 'Site GPS Captured ✓',
    siteRadiusInfo: 'Radius: 150 meters',
    generatedCodeTitle: 'New Job Code',
    shareCodeOnWhatsApp: 'Share Code on WhatsApp',

    // Job Detail
    jobDetailTitle: 'Job Details',
    workersOnJob: 'Workers On This Job',
    statusWorking: 'Working ✓',
    statusNotWorking: 'Not working',
    todayHoursLabel: 'Today',
    removeWorkerPrompt: 'Remove this worker?',
    workerRemoved: 'Worker removed ✗',

    // WhatsApp Message Templates
    whatsappProofText: (wName: string, jName: string, date: string, start: string, end: string, hours: string, siteStatus: string, mapsUrl: string) =>
      `*WORK PROOF - WorkProof App*\n\n👷 *Worker:* ${wName}\n🏗️ *Job:* ${jName}\n📅 *Date:* ${date}\n⏰ *Time:* ${start} - ${end}\n⏱️ *Total Hours:* *${hours}*\n📍 *Site:* ${siteStatus}\n🗺️ *Map:* ${mapsUrl}\n\n_Verified WorkProof Record_`,

    whatsappJobCodeText: (jName: string, cName: string, code: string) =>
      `*WorkProof Job Invite*\n\n🏗️ *Job:* ${jName}\n👷‍♂️ *Contractor:* ${cName}\n🔑 *5-Digit Join Code:* *${code}*\n\nOpen WorkProof app, tap *Join Job* and enter *${code}* to join!`
  },

  hi: {
    // App & Identity
    appName: 'WorkProof',
    prototypeNotice: 'प्रोटोटाइप: डेटा इसी फोन पर सुरक्षित रहता है',
    languageSelect: 'भाषा चुनें',

    // Nav / Common
    back: 'पीछे',
    cancel: 'रद्द ✗',
    confirm: 'पुष्टि ✓',
    next: 'आगे →',
    skip: 'छोड़ें →',
    retry: 'फिर से ↻',
    done: 'हो गया ✓',
    save: 'सहेजें ✓',
    delete: 'हटाएं ✗',
    remove: 'हटाएं ✗',
    close: 'बंद',
    yesEnd: 'हाँ, काम समाप्त ✗',
    noKeep: 'नहीं, चालू रखें ✓',
    switchRole: 'भूमिका बदलें / रीसेट',
    installApp: 'ऐप इंस्टॉल करें',
    deployGuide: 'डिप्लॉय और चलाएं',

    // Fake Login steps
    enterPhoneTitle: 'मोबाइल नंबर',
    phonePlaceholder: '10 अंकों का नंबर',
    phoneError: '10 अंक दर्ज करें',
    enterOtpTitle: 'ओटीपी दर्ज करें',
    otpHint: 'संकेत: 123456',
    otpError: 'गलत ओटीपी। 123456 डालें',
    chooseRoleTitle: 'आप कौन हैं?',
    iAmWorker: 'मैं कामगार हूँ',
    iAmContractor: 'मैं ठेकेदार हूँ',
    enterNameTitle: 'आपका नाम',
    namePlaceholder: 'उदा. रमेश कुमार',
    nameError: 'कृपया नाम दर्ज करें',
    startApp: 'शुरू करें ✓',

    // Worker Home
    startWorkBtn: 'काम शुरू करें',
    joinJobBtn: 'काम से जुड़ें +',
    myProofsBtn: 'मेरे सबूत 📄',
    myJobsTitle: 'मेरे काम',
    noJobsYet: 'कोई काम नहीं जुड़ा है',
    noJobDirectStart: 'आप बिना काम चुने भी शुरू कर सकते हैं',
    contractorLabel: 'ठेकेदार',
    codeLabel: 'कोड',
    workingNowBadge: 'काम चालू',

    // Join Job
    joinJobTitle: 'काम से जुड़ें',
    enter5DigitCode: '5 अंकों का कोड डालें',
    demoCodesHint: 'डेमो कोड: 12345 या 67890',
    jobNotFound: 'इस कोड का काम नहीं मिला ✗',
    lockoutWarning: 'बार-बार गलत कोड। लॉक समय:',
    minutesSuffix: 'मिनट',
    confirmJoinJob: 'काम की पुष्टि',
    joinSuccess: 'काम जुड़ गया ✓',

    // Start Flow
    chooseJobToStart: 'काम चुनें',
    noJobOption: 'सामान्य काम (कोई साइट नहीं)',
    findingLocation: 'लोकेशन खोज रहे हैं...',
    locationDenied: 'लोकेशन की अनुमति चाहिए ✗',
    locationDeniedDesc: 'साइट पर उपस्थिति सिद्ध करने के लिए GPS चालू करें',
    outsideSiteWarning: 'आप काम की जगह पर नहीं हैं ✗',
    distanceAway: 'दूरी',
    startAnyway: 'फिर भी शुरू करें ✓',
    atWorkSite: 'काम की साइट पर ✓',
    takeSitePhoto: 'साइट की फोटो (वैकल्पिक)',
    snapPhotoBtn: 'कैमरा फोटो 📷',
    photoAttached: 'फोटो जुड़ गई ✓',

    // Working Session
    workInProgress: 'काम चालू है',
    startedAt: 'शुरू समय',
    addPhoto: 'फोटो जोड़ें 📷',
    endWorkBtn: 'काम समाप्त ✗',
    confirmEndTitle: 'काम समाप्त करें?',
    alert12Hours: '⚠️ 12+ घंटे हो गए! क्या काम बंद करना भूल गए?',

    // Proof Screen
    proofTitle: 'काम का सबूत (PROOF)',
    workerLabel: 'कामगार',
    dateLabel: 'तारीख',
    startTimeLabel: 'शुरू समय',
    endTimeLabel: 'समाप्त समय',
    totalHoursLabel: 'कुल घंटे',
    locationLabel: 'स्थान',
    siteStatusLabel: 'साइट स्थिति',
    verifiedOnSite: '✓ साइट पर उपस्थित',
    outsideSite: '✗ साइट से बाहर',
    generalLocation: '✓ GPS दर्ज',
    shareOnWhatsApp: 'व्हाट्सएप पर भेजें',
    viewOnMaps: 'गूगल मैप पर देखें',
    backToHome: 'होम पेज पर जाएं',
    proofSavedLocal: 'फोन में सुरक्षित हुआ ✓',

    // My Proofs
    pastProofsTitle: 'पुराने सबूत',
    noPastProofs: 'अभी कोई रिकॉर्ड नहीं है',
    tapToShare: 'देखने व शेयर करने के लिए छुएं',

    // Contractor Home & Jobs
    contractorTitle: 'ठेकेदार डैशबोर्ड',
    createJobBtn: 'नया काम बनाएं +',
    activeJobsList: 'आपके काम / साइट्स',
    noContractorJobs: 'कोई काम नहीं बना। नया काम बनाएं दबाएं।',
    workersCount: 'कामगार',

    // Create Job
    createJobTitle: 'नया काम बनाएं',
    jobNameLabel: 'काम / साइट का नाम',
    jobNamePlaceholder: 'उदा. मेट्रो पिलर नं 42',
    setSiteLocationBtn: 'यहीं की लोकेशन सेट करें (GPS)',
    siteLocationSaved: 'साइट लोकेशन दर्ज ✓',
    siteRadiusInfo: 'दायरा: 150 मीटर',
    generatedCodeTitle: 'नया काम कोड',
    shareCodeOnWhatsApp: 'व्हाट्सएप पर कोड भेजें',

    // Job Detail
    jobDetailTitle: 'काम का विवरण',
    workersOnJob: 'इस काम पर कामगार',
    statusWorking: 'काम चालू ✓',
    statusNotWorking: 'खाली / बंद',
    todayHoursLabel: 'आज के घंटे',
    removeWorkerPrompt: 'कामगार को हटाएं?',
    workerRemoved: 'कामगार हट गया ✗',

    whatsappProofText: (wName: string, jName: string, date: string, start: string, end: string, hours: string, siteStatus: string, mapsUrl: string) =>
      `*काम का सबूत (WORK PROOF)*\n\n👷 *कामगार:* ${wName}\n🏗️ *काम:* ${jName}\n📅 *तारीख:* ${date}\n⏰ *समय:* ${start} - ${end}\n⏱️ *कुल समय:* *${hours}*\n📍 *साइट स्थिति:* ${siteStatus}\n🗺️ *नक्शा:* ${mapsUrl}\n\n_WorkProof ऐप द्वारा सत्यापित_`,

    whatsappJobCodeText: (jName: string, cName: string, code: string) =>
      `*WorkProof काम आमंत्रण*\n\n🏗️ *काम:* ${jName}\n👷‍♂️ *ठेकेदार:* ${cName}\n🔑 *5-अंकों का कोड:* *${code}*\n\nWorkProof ऐप खोलें, *काम से जुड़ें* पर जाएं और कोड *${code}* डालें!`
  },

  mr: {
    // App & Identity
    appName: 'WorkProof',
    prototypeNotice: 'प्रोटोटाइप: डेटा या फोनवरच सुरक्षित राहतो',
    languageSelect: 'भाषा निवडा',

    // Nav / Common
    back: 'मागे',
    cancel: 'रद्द ✗',
    confirm: 'नक्की ✓',
    next: 'पुढे →',
    skip: 'वगळा →',
    retry: 'पुन्हा ↻',
    done: 'पूर्ण ✓',
    save: 'जतन ✓',
    delete: 'हटवा ✗',
    remove: 'हटवा ✗',
    close: 'बंद',
    yesEnd: 'हो, काम संपले ✗',
    noKeep: 'नाही, चालू ठेवा ✓',
    switchRole: 'भूमिका बदला / रीसेट',
    installApp: 'ॲप इन्स्टॉल करा',
    deployGuide: 'डिप्लॉय व रन माहिती',

    // Fake Login steps
    enterPhoneTitle: 'मोबाईल नंबर',
    phonePlaceholder: '१० अंकी नंबर',
    phoneError: '१० अंक टाका',
    enterOtpTitle: 'ओटीपी टाका',
    otpHint: 'संकेत: 123456',
    otpError: 'चुकीचा ओटीपी. 123456 वापरा',
    chooseRoleTitle: 'तुम्ही कोण आहात?',
    iAmWorker: 'मी कामगार आहे',
    iAmContractor: 'मी कंत्राटदार आहे',
    enterNameTitle: 'तुमचे नाव',
    namePlaceholder: 'उदा. रमेश कुमार',
    nameError: 'कृपया नाव टाका',
    startApp: 'सुरू करा ✓',

    // Worker Home
    startWorkBtn: 'काम सुरू करा',
    joinJobBtn: 'कामाशी जोडा +',
    myProofsBtn: 'माझे पुरावे 📄',
    myJobsTitle: 'माझे काम',
    noJobsYet: 'अजून काम जोडलेले नाही',
    noJobDirectStart: 'तुम्ही काम न निवडताही थेट काम सुरू करू शकता',
    contractorLabel: 'कंत्राटदार',
    codeLabel: 'कोड',
    workingNowBadge: 'काम चालू',

    // Join Job
    joinJobTitle: 'कामाशी जोडा',
    enter5DigitCode: '५ अंकी कोड टाका',
    demoCodesHint: 'डेमो कोड: 12345 किंवा 67890',
    jobNotFound: 'या कोडचे काम सापडले नाही ✗',
    lockoutWarning: 'खूप चुकीचे प्रयत्न. लॉक वेळ:',
    minutesSuffix: 'मिनिटे',
    confirmJoinJob: 'कामाची खात्री करा',
    joinSuccess: 'काम जोडले ✓',

    // Start Flow
    chooseJobToStart: 'कामाची निवड करा',
    noJobOption: 'सामान्य काम (कोणतीही साइट नाही)',
    findingLocation: 'लोकेशन शोधत आहे...',
    locationDenied: 'लोकेशन परवानगी आवश्यक ✗',
    locationDeniedDesc: 'साइटवर उपस्थिती दाखवण्यासाठी GPS चालू करा',
    outsideSiteWarning: 'तुम्ही कामाच्या जागेवर नाही आहात ✗',
    distanceAway: 'अंतर',
    startAnyway: 'तरीही सुरू करा ✓',
    atWorkSite: 'कामाच्या जागेवर ✓',
    takeSitePhoto: 'साइटचा फोटो (ऐच्छिक)',
    snapPhotoBtn: 'कॅमेरा फोटो 📷',
    photoAttached: 'फोटो जोडला ✓',

    // Working Session
    workInProgress: 'काम चालू आहे',
    startedAt: 'सुरू वेळ',
    addPhoto: 'फोटो जोडा 📷',
    endWorkBtn: 'काम संपवा ✗',
    confirmEndTitle: 'काम संपवायचे का?',
    alert12Hours: '⚠️ १२+ तास झाले! काम थांबवणे विसरलात का?',

    // Proof Screen
    proofTitle: 'कामाचा पुरावा (PROOF)',
    workerLabel: 'कामगार',
    dateLabel: 'तारीख',
    startTimeLabel: 'सुरू वेळ',
    endTimeLabel: 'समाप्ती वेळ',
    totalHoursLabel: 'एकूण तास',
    locationLabel: 'ठिकाण',
    siteStatusLabel: 'साइट स्थिती',
    verifiedOnSite: '✓ साइटवर उपस्थित',
    outsideSite: '✗ साइटच्या बाहेर',
    generalLocation: '✓ GPS नोंदवले',
    shareOnWhatsApp: 'व्हॉट्सॲपवर पाठवा',
    viewOnMaps: 'गुगल मॅपवर पहा',
    backToHome: 'होम पेजवर जा',
    proofSavedLocal: 'फोनमध्ये सुरक्षित नोंदवले ✓',

    // My Proofs
    pastProofsTitle: 'जुने पुरावे',
    noPastProofs: 'अद्याप कोणतेही रेकॉर्ड नाही',
    tapToShare: 'पाहण्यासाठी व पाठवण्यासाठी टॅप करा',

    // Contractor Home & Jobs
    contractorTitle: 'कंत्राटदार डॅशबोर्ड',
    createJobBtn: 'नवीन काम तयार करा +',
    activeJobsList: 'तुमची कामे / साइट्स',
    noContractorJobs: 'अद्याप काम तयार केलेले नाही. नवीन काम तयार करा दाबा.',
    workersCount: 'कामगार',

    // Create Job
    createJobTitle: 'नवीन काम तयार करा',
    jobNameLabel: 'काम / साइटचे नाव',
    jobNamePlaceholder: 'उदा. मेट्रो पिलर क्र ४२',
    setSiteLocationBtn: 'येथील लोकेशन सेट करा (GPS)',
    siteLocationSaved: 'साइट लोकेशन नोंदवले ✓',
    siteRadiusInfo: 'मर्यादा: १५० मीटर',
    generatedCodeTitle: 'नवीन काम कोड',
    shareCodeOnWhatsApp: 'व्हॉट्सॲपवर कोड पाठवा',

    // Job Detail
    jobDetailTitle: 'कामाचा तपशील',
    workersOnJob: 'या कामावरील कामगार',
    statusWorking: 'काम चालू ✓',
    statusNotWorking: 'बंद / उपस्थित नाही',
    todayHoursLabel: 'आजचे तास',
    removeWorkerPrompt: 'कामगाराला काढायचे का?',
    workerRemoved: 'कामगार हटवला ✗',

    whatsappProofText: (wName: string, jName: string, date: string, start: string, end: string, hours: string, siteStatus: string, mapsUrl: string) =>
      `*कामाचा पुरावा (WORK PROOF)*\n\n👷 *कामगार:* ${wName}\n🏗️ *काम:* ${jName}\n📅 *तारीख:* ${date}\n⏰ *वेळ:* ${start} - ${end}\n⏱️ *एकूण वेळ:* *${hours}*\n📍 *साइट स्थिती:* ${siteStatus}\n🗺️ *नकाशा:* ${mapsUrl}\n\n_WorkProof ॲपद्वारे प्रमाणित_`,

    whatsappJobCodeText: (jName: string, cName: string, code: string) =>
      `*WorkProof काम आमंत्रण*\n\n🏗️ *काम:* ${jName}\n👷‍♂️ *कंत्राटदार:* ${cName}\n🔑 *५-अंकी कोड:* *${code}*\n\nWorkProof ॲप उघडा, *कामाशी जोडा* दाबा आणि कोड *${code}* टाका!`
  }
};
