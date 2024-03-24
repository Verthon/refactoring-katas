import { expect } from "chai";
import { Item, GildedRose } from "../src/gilded-rose.js";

describe("Gilded Rose", () => {
	it("should decrease quality at the end of day", () => {
		const gildedRose = new GildedRose([new Item("Regular item", 1, 2)]);

		const item = gildedRose.updateQuality()[0];

		expect(item.quality).to.equal(1);
		expect(item.sellIn).to.equal(0);
	});

	it("should decrease an item quality even if sellIn is negative", () => {
		const gildedRose = new GildedRose([new Item("Regular item", -1, 10)]);

		const item = gildedRose.updateQuality()[0];

		expect(item.quality).to.equal(8);
	});

	it("should decrease quality twice once the sell by date has passed", () => {
		const gildedRose = new GildedRose([new Item("Regular item", 0, 2)]);

		const item = gildedRose.updateQuality()[0];

		expect(item.quality).to.equal(0);
	});

	it("should not decrease the quality below 0", () => {
		const gildedRose = new GildedRose([new Item("Regular item", 2, 0)]);

		const item = gildedRose.updateQuality()[0];

		expect(item.quality).to.equal(0);
	});

	it("should increase quality of Aged Brie item when the older it gets", () => {
		const gildedRose = new GildedRose([new Item("Aged Brie", 2, 1)]);

		const agedBrieItem = gildedRose.updateQuality()[0];

		expect(agedBrieItem.quality).to.equal(2);
	});

	it("should increase quality of Aged Brie item when the older it gets even when sellIn is negative", () => {
		const gildedRose = new GildedRose([new Item("Aged Brie", -2, 40)]);

		const backstagePasses = gildedRose.updateQuality()[0];

		expect(backstagePasses.quality).to.equal(42);
	});

	it("should not decrease sellIn and quality for Sulfuras, Hand of Ragnaros item", () => {
		const gildedRose = new GildedRose([
			new Item("Sulfuras, Hand of Ragnaros", 2, 1),
		]);

		const sulfurasItem = gildedRose.updateQuality()[0];

		expect(sulfurasItem.quality).to.equal(1);
	});

	it("should increase quality of Backstage passes by 2 when there are `10` days or less", () => {
		const gildedRose = new GildedRose([
			new Item("Backstage passes to a TAFKAL80ETC concert", 10, 1),
		]);

		const backstagePasses = gildedRose.updateQuality()[0];

		expect(backstagePasses.quality).to.equal(3);
	});

	it("should increase quality of Backstage passes by 3 when there are `5` days or less", () => {
		const gildedRose = new GildedRose([
			new Item("Backstage passes to a TAFKAL80ETC concert", 5, 1),
		]);

		const backstagePasses = gildedRose.updateQuality()[0];

		expect(backstagePasses.quality).to.equal(4);
	});

	it("should set quality to 0 of Backstage passes after the concert", () => {
		const gildedRose = new GildedRose([
			new Item("Backstage passes to a TAFKAL80ETC concert", 0, 2),
		]);

		const backstagePasses = gildedRose.updateQuality()[0];

		expect(backstagePasses.quality).to.equal(0);
	});

	it("should not increase an item quality above 50", () => {
		const gildedRose = new GildedRose([
			new Item("Backstage passes to a TAFKAL80ETC concert", 20, 50),
		]);

		gildedRose.updateQuality();
		const backstagePasses = gildedRose.updateQuality()[0];

		expect(backstagePasses.quality).to.equal(50);
	});

	it("should decrease the Conjured Mana Cake quality twice as fast as regular items when sellIn is positive", () => {
		const gildedRose = new GildedRose([new Item("Conjured Mana Cake", 20, 10)]);

		const conjuredItem = gildedRose.updateQuality()[0];

		expect(conjuredItem.quality).to.equal(8);
	});

	it("should decrease the Conjured Mana Cake quality twice as fast as regular items when sellIn is negative", () => {
		const gildedRose = new GildedRose([new Item("Conjured Mana Cake", -1, 10)]);

		const conjuredItem = gildedRose.updateQuality()[0];

		expect(conjuredItem.quality).to.equal(6);
	});
});
