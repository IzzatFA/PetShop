import { cookies } from "next/headers";
import { dictionaries, Locale } from "./dictionaries";

export async function getDictionary() {
    const cookieStore = await cookies();
    const localeValue = cookieStore.get("NEXT_LOCALE")?.value;

    const locale: Locale = (localeValue === "id" || localeValue === "en") ? localeValue : "en";

    return dictionaries[locale];
}
