import { SelectionModel } from "@angular/cdk/collections"
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"

@Component({
  selector: "app-list-filter",
  templateUrl: "./list-filter.component.html",
  styleUrls: ["./list-filter.component.scss"],
})
export class ListFilterComponent {
  @Input()
  get items() {
    return this._items
  }

  set items(v) {
    this._items = v
    this.runFilter()
  }

  @Input()
  get selected() {
    return this._selected
  }

  set selected(v) {
    this._selected = v
    this.selectedItems.clear()
    this.selectedItems.select(...v)
  }

  @Output() selectionChanged = new EventEmitter<typeof this.items>()

  private _items: string[] = []
  private _selected: string[] = []
  displayedItems: string[] = []
  searchString = ""

  selectedItems = new SelectionModel<string>(true, [])

  constructor() {}

  runFilter() {
    if (this.searchString.length > 0) {
      this.displayedItems = this.items.filter((s) =>
        s.toLowerCase().includes(this.searchString.toLowerCase())
      )
    } else {
      this.displayedItems = this.items
    }
  }

  someSelected(items: string[]) {
    const theItems = items
    const selectedItems = this.selectedItems.selected.filter((itm) =>
      theItems.includes(itm)
    )
    return !!selectedItems.length && !this.allSelected(theItems)
  }

  allSelected(items: string[]) {
    const theItems = items
    const selectedItems = this.selectedItems.selected.filter((itm) =>
      theItems.includes(itm)
    )
    return theItems?.length === selectedItems.length
  }

  itemFilterClick(value: string, event: Event) {
    event.stopPropagation()
    event.preventDefault()
    this.selectedItems.toggle(value)
    this.emitValue()
  }

  checkboxSelectAllClick(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    if (this.allSelected(this.displayedItems)) {
      this.unSelectAll(this.displayedItems, event)
    } else {
      this.selectAll(this.displayedItems, event)
    }
  }

  selectAll(items: string[], event: Event) {
    event.stopPropagation()
    this.selectedItems.clear()
    this.selectedItems.select(...items)
    this.emitValue()
  }

  unSelectAll(items: string[], event: Event) {
    event.stopPropagation()
    const filteredItems = this.selectedItems.selected.filter(
      (itm) => !items.includes(itm)
    )
    this.selectedItems.clear()
    this.selectedItems.select(...filteredItems)
    this.emitValue()
  }

  inverseSelection(event: Event) {
    event.stopPropagation()
    const selected = this.selectedItems.selected
    const nonSelected = this.items.filter((t) => !selected.includes(t))
    this.selectedItems.clear()
    this.selectedItems.select(...nonSelected)
    this.emitValue()
  }

  emitValue() {
    this.selectionChanged.emit(this.selectedItems.selected)
  }

  searchChange() {
    this.runFilter()
  }
}
