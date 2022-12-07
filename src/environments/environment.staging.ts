import { environment as prodEnvironment } from "./environment.prod"

export const environment = {
  ...prodEnvironment,
  serverBaseUrl: "https://api.banyuwangi.dasbor.id",
  production: false,
}
