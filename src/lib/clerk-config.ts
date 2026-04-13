import { heIL } from "@clerk/localizations";

export const CLERK_APPEARANCE_CONFIG = {
  variables: {
    colorPrimary: "#6c47ff",
  },
  elements: {
    modalContent: {
      direction: "rtl",
      textAlign: "right",
    },
    card: {
      direction: "rtl",
      textAlign: "right",
    },
    headerTitle: {
      textAlign: "right",
    },
    headerSubtitle: {
      textAlign: "right",
    },
    formFieldInput: {
      direction: "rtl",
      textAlign: "right",
    },
    formFieldLabel: {
      textAlign: "right",
    },

    formButtonPrimary: {
      direction: "rtl",
      // Fix arrow direction for RTL
      "& svg": {
        transform: "scaleX(-1)",
      },
    },
    socialButtonsBlockButton: {
      direction: "rtl",
      textAlign: "right",
      // Fix Google button icon alignment
      "& svg": {
        order: 1,
        marginLeft: "8px",
        marginRight: "0px",
      },
    },
    // Footer RTL support
    footerActionText: {
      textAlign: "right",
    },
    footerActionLink: {
      textAlign: "right",
    },
    // Divider RTL support
    dividerText: {
      textAlign: "right",
    },
    // Form container RTL support
    form: {
      direction: "rtl",
    },
    // Main container RTL support
    main: {
      direction: "rtl",
    },
    // Root container RTL support
    rootBox: {
      direction: "rtl",
    },
    // Fix terms and conditions styling
    footerPageLink: {
      color: "#6c47ff",
      textDecoration: "underline",
    },
  },
} as const;
export const CLERK_LOCALIZATION_CONFIG = {
  ...heIL,

  /* ================= SIGN UP ================= */
  signUp: {
    ...heIL.signUp,

    start: {
      ...heIL.signUp?.start,
      title: "הצטרפות ל-Ina Club",
      subtitle:
        "הצטרפו בחינם ל-Ina Club וקבלו גישה לקבוצות רכישה נבחרות, מידע על פרויקטים בליווי מקצועי, ועדכונים בלעדיים לחברי המועדון",
    },

    legalConsent: {
      checkbox: {
        label__onlyPrivacyPolicy:
          "אני מאשר.ת קבלת עדכונים, תוכן שיווקי ומידע על קבוצות רכישה ופרויקטים מטעם Ina Club, כמפורט ב{{ privacyPolicyLink || link('מדיניות הפרטיות') }}, באמצעות הודעות, דוא״ל וטלפון",

        label__onlyTermsOfService:
          "אני מאשר.ת את {{termsOfServiceLink || link('תנאי השימוש')}} של Ina Club",

        label__termsOfServiceAndPrivacyPolicy:
          "אני מאשר.ת קבלת עדכונים, תוכן שיווקי ומידע על קבוצות רכישה ופרויקטים מטעם Ina Club, כמפורט ב{{ privacyPolicyLink || link('מדיניות הפרטיות') }} ו{{termsOfServiceLink || link('תנאי השימוש')}}, באמצעות הודעות, דוא״ל וטלפון",
      },

      continue: {
        title: "מדיניות פרטיות ותנאי שימוש",
        subtitle: "אנא קראו ואשרו את התנאים על מנת להמשיך",
      },
    },
  },

  /* ================= SIGN IN ================= */
  signIn: {
    ...heIL.signIn,

    start: {
      ...heIL.signIn?.start,
      title: "כניסה ל-Ina Club",
      subtitle:
        "התחברו לחשבון שלכם כדי לצפות בקבוצות הרכישה, לעקוב אחרי פרויקטים פעילים ולקבל עדכונים מותאמים אישית",
    },
  },
} as const;
