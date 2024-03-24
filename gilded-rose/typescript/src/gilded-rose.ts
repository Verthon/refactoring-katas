export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class SellIn {
  private sellIn: number;

  constructor(sellIn: number) {
    this.sellIn = sellIn;
  }

  get currentSellIn() {
    return this.sellIn;
  }

  public decrementBy = (decrementBy: number) => {
    this.sellIn -= decrementBy;
  };
}

class Quality {
  private quality: number;
  private readonly minQuality: 0;
  private readonly maxQuality: 50;

  constructor(quality: number) {
    this.quality = quality;
    this.minQuality = 0;
    this.maxQuality = 50;
  }

  get currentQuality() {
    return this.quality;
  }

  public incrementBy = (incrementBy: number) => {
    const incrementedValue = this.quality + incrementBy;

    this.quality = Math.min(incrementedValue, this.maxQuality);
  };

  public decrementBy = (decrementBy: number) => {
    const decrementedValue = this.quality - decrementBy;

    this.quality = Math.max(decrementedValue, this.minQuality);
  };

  public setToZero = () => {
    this.quality = 0;
  };
}

class Sulfuras {
  private item: Item;

  constructor(item: Item) {
    this.item = item;
  }

  get currentItem() {
    return this.item;
  }

  public updateQuality() {
    const quality = new Quality(this.item.quality);

    return quality.currentQuality;
  }

  public updateSellIn() {
    const sellIn = new SellIn(this.item.sellIn);

    return sellIn.currentSellIn;
  }
}

class AgedBrie {
  private item: Item;

  constructor(item: Item) {
    this.item = item;
  }

  get currentItem() {
    return this.item;
  }

  public updateQualityForPositiveSellIn = () => {
    const quality = new Quality(this.item.quality);

    quality.incrementBy(1);

    this.item.quality = quality.currentQuality;

    return this.item.quality;
  };

  public updateQualityForNegativeSellIn = () => {
    const quality = new Quality(this.item.quality);

    quality.incrementBy(2);

    this.item.quality = quality.currentQuality;

    return this.item.quality;
  };

  private getCurrentStrategy = (currentSellIn: SellIn["currentSellIn"]) => {
    const signMap = {
      negative: -1,
      zero: 0,
      positive: 1,
    } as const;

    const qualityUpdateStrategy = {
      negative: this.updateQualityForNegativeSellIn,
      positive: this.updateQualityForPositiveSellIn,
      zero: this.updateQualityForPositiveSellIn,
    } as const;

    const sign = Math.sign(currentSellIn);

    const currentSign = Object.keys(signMap).find(
      (key) => signMap[key] === sign
    ) as keyof typeof signMap;

    return qualityUpdateStrategy[currentSign];
  };

  public updateQuality() {
    const sellIn = new SellIn(this.item.sellIn);

    const updateQualityStrategy = this.getCurrentStrategy(sellIn.currentSellIn);

    return updateQualityStrategy();
  }

  public updateSellIn() {
    const sellIn = new SellIn(this.item.sellIn);

    sellIn.decrementBy(1);

    this.item.sellIn = sellIn.currentSellIn;

    return this.item.sellIn;
  }
}

type BackStagePassesStrategy =
  | "afterConcert"
  | "fiveDaysOrLessLeft"
  | "tenDaysOrLessLeft"
  | "regular";

type UniqueBackStagePassesStrategy = Exclude<
  BackStagePassesStrategy,
  "regular"
>;

class BackstagePasses {
  private item: Item;

  constructor(item: Item) {
    this.item = item;
  }

  get currentItem() {
    return this.item;
  }

  private getQualityUpdateStrategyName = (
    currentSellIn: SellIn["currentSellIn"]
  ) => {
    const strategyName: Record<
      UniqueBackStagePassesStrategy,
      (currentSellIn: SellIn["currentSellIn"]) => boolean
    > = {
      afterConcert: (currentSellIn) => currentSellIn <= 0,
      fiveDaysOrLessLeft: (currentSellIn) => currentSellIn <= 5,
      tenDaysOrLessLeft: (currentSellIn) => currentSellIn <= 10,
    };

    const currentStrategyName = Object.keys(strategyName).find((key) =>
      strategyName[key](currentSellIn)
    ) as UniqueBackStagePassesStrategy | undefined;

    return currentStrategyName || "regular";
  };

  private getQualityUpdateStrategy = (
    strategyName: BackStagePassesStrategy,
    incrementBy: Quality["incrementBy"],
    setQualityToZero: Quality["setToZero"]
  ) => {
    const qualityUpdateStrategy: Record<BackStagePassesStrategy, () => void> = {
      afterConcert: () => {
        return setQualityToZero();
      },
      fiveDaysOrLessLeft: () => {
        return incrementBy(3);
      },
      tenDaysOrLessLeft: () => {
        return incrementBy(2);
      },
      regular: () => {
        return incrementBy(1);
      },
    };

    return qualityUpdateStrategy[strategyName];
  };

  public updateQuality = () => {
    const quality = new Quality(this.item.quality);
    const sellIn = new SellIn(this.item.sellIn);

    const strategyName = this.getQualityUpdateStrategyName(
      sellIn.currentSellIn
    );
    const qualityUpdateStrategy = this.getQualityUpdateStrategy(
      strategyName,
      quality.incrementBy,
      quality.setToZero
    );

    qualityUpdateStrategy();

    this.item.quality = quality.currentQuality;

    return this.item.quality;
  };

  public updateSellIn = () => {
    const sellIn = new SellIn(this.item.sellIn);

    sellIn.decrementBy(1);

    this.item.sellIn = sellIn.currentSellIn;

    return this.item.sellIn;
  };
}

type ConjuredItemStrategyName =
  | "beforeExpirySellInDate"
  | "afterExpirySellInDate";

class Conjured {
  private item: Item;

  constructor(item: Item) {
    this.item = item;
  }

  get currentItem() {
    return this.item;
  }

  private getUpdateQualityStrategyName = (
    currentSellIn: SellIn["currentSellIn"]
  ) => {
    const strategyName: Record<
      ConjuredItemStrategyName,
      (sellIn: SellIn["currentSellIn"]) => boolean
    > = {
      afterExpirySellInDate: (sellIn) => sellIn < 0,
      beforeExpirySellInDate: (sellIn) => sellIn >= 0,
    };

    const currentStrategyName = Object.keys(strategyName).find((key) =>
      strategyName[key](currentSellIn)
    ) as ConjuredItemStrategyName;

    return currentStrategyName;
  };

  private getUpdateQualityStrategy = (decrementBy: Quality["decrementBy"]) => {
    const strategy: Record<ConjuredItemStrategyName, () => void> = {
      afterExpirySellInDate: () => {
        decrementBy(4);
        return;
      },
      beforeExpirySellInDate: () => {
        decrementBy(2);
        return;
      },
    };

    return strategy;
  };

  public updateQuality() {
    const quality = new Quality(this.item.quality);
    const sellIn = new SellIn(this.item.sellIn);
    const updateQualityStrategyName = this.getUpdateQualityStrategyName(
      sellIn.currentSellIn
    );
    const updateQualityStrategy = this.getUpdateQualityStrategy(
      quality.decrementBy
    );

    updateQualityStrategy[updateQualityStrategyName]();
    this.item.quality = quality.currentQuality;

    return this.item.quality;
  }

  public updateSellIn() {
    const sellIn = new SellIn(this.item.sellIn);

    sellIn.decrementBy(1);

    this.item.sellIn = sellIn.currentSellIn;

    return this.item.sellIn;
  }
}

type RegularItemStrategyName =
  | "beforeExpirySellInDate"
  | "afterExpirySellInDate";

class RegularItem {
  private item: Item;

  constructor(item: Item) {
    this.item = item;
  }

  get currentItem() {
    return this.item;
  }

  private getUpdateQualityStrategyName = (
    currentSellIn: SellIn["currentSellIn"]
  ) => {
    const strategyName: Record<
      RegularItemStrategyName,
      (sellIn: SellIn["currentSellIn"]) => boolean
    > = {
      afterExpirySellInDate: (sellIn) => sellIn < 0,
      beforeExpirySellInDate: (sellIn) => sellIn >= 0,
    };

    const currentStrategyName = Object.keys(strategyName).find((key) =>
      strategyName[key](currentSellIn)
    ) as RegularItemStrategyName;

    return currentStrategyName;
  };

  private getUpdateQualityStrategy = (decrementBy: Quality["decrementBy"]) => {
    const strategy: Record<RegularItemStrategyName, () => void> = {
      afterExpirySellInDate: () => decrementBy(2),
      beforeExpirySellInDate: () => decrementBy(1),
    };

    return strategy;
  };

  public updateQuality() {
    const quality = new Quality(this.item.quality);
    const sellIn = new SellIn(this.item.sellIn);
    const qualityUpdateStrategyName = this.getUpdateQualityStrategyName(
      sellIn.currentSellIn
    );
    const qualityUpdateStrategy = this.getUpdateQualityStrategy(
      quality.decrementBy
    );

    qualityUpdateStrategy[qualityUpdateStrategyName]();

    this.item.quality = quality.currentQuality;

    return this.item.quality;
  }

  public updateSellIn() {
    const sellIn = new SellIn(this.item.sellIn);

    sellIn.decrementBy(1);

    this.item.sellIn = sellIn.currentSellIn;

    return this.item.sellIn;
  }
}

interface UpdateQualityStrategy {
  update: (item: Item, items: Item[]) => Item[];
}

class SulfurasStrategy implements UpdateQualityStrategy {
  public update(item: Item, items: Item[]) {
    const sulfurasItem = new Sulfuras(item);
    sulfurasItem.updateSellIn();
    sulfurasItem.updateQuality();
    item = sulfurasItem.currentItem;

    return items;
  }
}

class AgedBrieStrategy implements UpdateQualityStrategy {
  public update(item: Item, items: Item[]) {
    const agedBrie = new AgedBrie(item);

    agedBrie.updateSellIn();
    agedBrie.updateQuality();
    item = agedBrie.currentItem;

    return items;
  }
}

class BackstagePassesStrategy implements UpdateQualityStrategy {
  public update(item: Item, items: Item[]) {
    const backstagePasses = new BackstagePasses(item);

    backstagePasses.updateSellIn();
    backstagePasses.updateQuality();
    item = backstagePasses.currentItem;

    return items;
  }
}

class ConjuredStrategy implements UpdateQualityStrategy {
  public update(item: Item, items: Item[]) {
    const conjured = new Conjured(item);

    conjured.updateSellIn();
    conjured.updateQuality();
    item = conjured.currentItem;

    return items;
  }
}

class RegularStrategy implements UpdateQualityStrategy {
  public update(item: Item, items: Item[]) {
    const regular = new RegularItem(item);

    regular.updateSellIn();
    regular.updateQuality();
    item = regular.currentItem;

    return items;
  }
}

type StrategyName =
  | "sulfuras"
  | "agedBrie"
  | "backstagePasses"
  | "conjured"
  | "regular";

export class GildedRose {
  items: Array<Item>;

  constructor(items: Array<Item>) {
    this.items = items;
  }

  private getCurrentStrategyName(itemName: Item["name"]) {
    const map = {
      "Aged Brie": "agedBrie",
      "Backstage passes to a TAFKAL80ETC concert": "backstagePasses",
      "Sulfuras, Hand of Ragnaros": "sulfuras",
      Conjured: "conjured",
    } as const;

    return map[itemName] || "regular";
  }

  private getCurrentStrategy(strategyName: StrategyName) {
    const strategy = {
      sulfuras: new SulfurasStrategy(),
      agedBrie: new AgedBrieStrategy(),
      backstagePasses: new BackstagePassesStrategy(),
      conjured: new ConjuredStrategy(),
      regular: new RegularStrategy(),
    } as const;

    return strategy[strategyName];
  }

  public updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      const strategyName = this.getCurrentStrategyName(this.items[i].name);
      const strategy = this.getCurrentStrategy(strategyName);

      strategy.update(this.items[i], this.items);
    }

    return this.items;
  }
}
