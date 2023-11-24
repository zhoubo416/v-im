import { match } from "pinyin-pro";

function keywordFilter(items: any[], keyword: string): any[] {
  return items.filter((item) => {
    if (keyword.trim() === "" || match(item.name, keyword)) {
      return true;
    } else {
      return false;
    }
  });
}

export default keywordFilter;
