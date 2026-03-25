import { a6 as defineMiddleware, af as sequence } from './chunks/sequence_B8w407xz.mjs';
import 'piccolore';
import 'clsx';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { S as SUPPORTED_LOCALES, D as DEFAULT_LOCALE } from './chunks/index_Bf_3aS85.mjs';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const supabaseUrl = "https://qilbrsswjhnjdkbdvdll.supabase.co";
  const supabaseAnonKey = "sb_publishable_VezDbx0z1XCjGoluPT0WnQ_re4mIfCq";
  let locale = DEFAULT_LOCALE;
  const cookieLocale = context.cookies.get("locale")?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const acceptLang = context.request.headers.get("accept-language") ?? "";
    const detected = detectPreferredLocale(acceptLang);
    if (detected) locale = detected;
  }
  context.locals.locale = locale;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.request.headers.get("cookie") ?? "");
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          context.cookies.set(name, value, {
            path: "/",
            ...options
          });
        }
      }
    }
  });
  context.locals.supabase = supabase;
  return next();
});
function detectPreferredLocale(acceptLang) {
  if (!acceptLang) return null;
  const langs = acceptLang.split(",").map((part) => {
    const [lang, qPart] = part.trim().split(";");
    const q = qPart ? parseFloat(qPart.split("=")[1]) : 1;
    return { lang: lang.trim().split("-")[0].toLowerCase(), q };
  }).sort((a, b) => b.q - a.q);
  for (const { lang } of langs) {
    if (SUPPORTED_LOCALES.includes(lang)) {
      return lang;
    }
  }
  return null;
}

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
