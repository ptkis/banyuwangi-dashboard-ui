import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from "@ngneat/transloco"
import id from "../assets/i18n/id.json"

export function getTranslocoModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { id },
    translocoConfig: {
      availableLangs: ["id"],
      defaultLang: "id",
    },
    preloadLangs: true,
    ...options,
  })
}
