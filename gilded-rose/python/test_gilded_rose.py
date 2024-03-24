# -*- coding: utf-8 -*-
import unittest
from gilded_rose import Item, GildedRose


class GildedRoseTest(unittest.TestCase):
    def test_should_decrease_quality_at_the_end_of_day(self):
        items = [Item("Regular item", 1, 2)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        item = items[0]

        self.assertEqual(item.quality, 1)
        self.assertEqual(item.sell_in, 0)

    def test_should_decrease_an_item_quality_even_if_sell_in_is_negative(self):
        items = [Item("Regular item", -1, 10)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        item = items[0]

        self.assertEqual(item.quality, 8)

    def test_should_decrease_quality_twice_once_the_sell_by_date_has_passed(self):
        items = [Item("Regular item", 0, 2)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        item = items[0]

        self.assertEqual(item.quality, 0)

    def test_should_not_decrease_the_quality_below_0(self):
        items = [Item("Regular item", 2, 0)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        item = items[0]

        self.assertEqual(item.quality, 0)

    def test_should_increase_quality_of_Aged_Brie_item_when_the_older_it_gets(self):
        items = [Item("Aged Brie", 2, 1)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        agedBrieItem = items[0]

        self.assertEqual(agedBrieItem.quality, 2)

    def test_should_increase_quality_of_Aged_Brie_even_when_sell_in_is_negative(self):
        items = [Item("Aged Brie", -2, 40)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        agedBrieItem = items[0]

        self.assertEqual(agedBrieItem.quality, 42)

    def test_should_not_decrease_sell_in_and_quality_for_Sulfuras(self):
        items = [Item("Sulfuras, Hand of Ragnaros", 2, 1)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        sulfurasItem = items[0]

        self.assertEqual(sulfurasItem.quality, 1)

    def test_should_increase_quality_of_Backstage_passes_by_2_when_there_are_10_days_or_less(
        self,
    ):
        items = [Item("Backstage passes to a TAFKAL80ETC concert", 10, 1)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        backstagePasses = items[0]

        self.assertEqual(backstagePasses.quality, 3)

    def test_should_increase_quality_of_Backstage_passes_by_3_when_there_are_5_days_or_less(
        self,
    ):
        items = [Item("Backstage passes to a TAFKAL80ETC concert", 5, 1)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        backstagePasses = items[0]

        self.assertEqual(backstagePasses.quality, 4)

    def test_should_set_quality_to_0_of_Backstage_passes_after_the_concert(self):
        items = [Item("Backstage passes to a TAFKAL80ETC concert", 0, 2)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        backstagePasses = items[0]

        self.assertEqual(backstagePasses.quality, 0)

    def test_should_not_increase_an_item_quality_above_50(self):
        items = [Item("Backstage passes to a TAFKAL80ETC concert", 20, 50)]
        gilded_rose = GildedRose(items)

        gilded_rose.update_quality()
        backstagePasses = items[0]

        self.assertEqual(backstagePasses.quality, 50)


if __name__ == "__main__":
    unittest.main()
