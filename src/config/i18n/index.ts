import i18next from "i18next";
import Locales from "/src/constants/locales.enum";

import generalEN from "./en/general.json";
import generalTR from "./tr/general.json";

i18next.init({
    lng: Locales.TR,
    debug: import.meta.env.MODE !== "production",
    defaultNS: "general",
    resources: {
        [Locales.EN]: {
            general: generalEN
        },
        [Locales.TR]: {
            general: generalTR
        }
    }
});

export default i18next;