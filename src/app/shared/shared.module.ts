import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { sharedComponents } from "./components"

@NgModule({
  declarations: [sharedComponents],
  imports: [CommonModule],
  exports: [sharedComponents],
  providers: [],
})
export class SharedModule {}
