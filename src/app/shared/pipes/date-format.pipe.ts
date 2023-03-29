import { Pipe, PipeTransform } from "@angular/core"
import { format } from "date-fns"
import { READABLE_DATE_FORMAT } from "../constants/app.constants"

@Pipe({
  name: "dateFormat",
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    try {
      return format(new Date(value), READABLE_DATE_FORMAT)
    } catch (_err) {}
    return value
  }
}
