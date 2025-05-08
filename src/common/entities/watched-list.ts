export abstract class WatchedList<T> {
  public currentItems: T[]
  private initialItems: T[]
  private newItems: T[]
  private removedItems: T[]

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems || []
    this.initialItems = initialItems || []
    this.newItems = []
    this.removedItems = []
  }

  abstract compareItems(a: T, b: T): boolean

  public getItems(): T[] {
    return this.currentItems
  }

  public getNewItems(): T[] {
    return this.newItems
  }

  public getRemovedItems(): T[] {
    return this.removedItems
  }

  private isCurrentItem(item: T): boolean {
    return this.currentItems.some((v: T) => this.compareItems(item, v))
  }

  private isNewItem(item: T): boolean {
    return this.newItems.some((v: T) => this.compareItems(item, v))
  }

  private isRemovedItem(item: T): boolean {
    return this.removedItems.some((v: T) => this.compareItems(item, v))
  }

  private removeFromNew(item: T): void {
    this.newItems = this.newItems.filter((v) => !this.compareItems(v, item))
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    )
  }

  private removeFromRemoved(item: T): void {
    this.removedItems = this.removedItems.filter(
      (v) => !this.compareItems(item, v),
    )
  }

  private wasAddedInitially(item: T): boolean {
    return this.initialItems.some((v: T) => this.compareItems(item, v))
  }

  public exists(item: T): boolean {
    return this.isCurrentItem(item)
  }

  public add(item: T): void {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item)
    }

    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.newItems.push(item)
    }

    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item)
    }
  }

  public remove(item: T): void {
    this.removeFromCurrent(item)

    if (this.isNewItem(item)) {
      this.removeFromNew(item)

      return
    }

    if (!this.isRemovedItem(item)) {
      this.removedItems.push(item)
    }
  }

  public update(items: T[]): void {
    const newItems = items.filter((a) => {
      return !this.getItems().some((b) => this.compareItems(a, b))
    })

    const removedItems = this.getItems().filter((a) => {
      return !items.some((b) => this.compareItems(a, b))
    })

    this.currentItems = items
    this.newItems = newItems
    this.removedItems = removedItems
  }
}
