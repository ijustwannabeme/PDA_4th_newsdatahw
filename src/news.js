import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

// 각 주의 URL과 종료 날짜 설정
const urls = [
  {
    url: "https://search.daum.net/search?w=news&cluster=y&q=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90&sd=20240401000000&ed=20240405235959&period=u&DA=STC",
    endDate: "20240405",
  },
  {
    url: "https://search.daum.net/search?w=news&cluster=y&q=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90&sd=20240408000000&ed=20240412235959&period=u&DA=STC",
    endDate: "20240412",
  },
  {
    url: "https://search.daum.net/search?w=news&cluster=y&q=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90&sd=20240415000000&ed=20240419235959&period=u&DA=STC",
    endDate: "20240419",
  },
];

async function fetchNews(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const articles = [];

    $(".item-title").each((index, element) => {
      const aTag = $(element).find("a");
      const title = aTag.text().trim();
      const link = aTag.attr("href");
      if (title && link) {
        articles.push({ title, url: link });
      }
    });

    return articles;
  } catch (error) {
    console.error("데이터 수집 중 오류 발생:", error);
    return [];
  }
}

async function main() {
  const data = {};

  for (const { url, endDate } of urls) {
    const articles = await fetchNews(url);
    data[endDate] = articles;
  }

  // 결과를 JSON 파일로 저장
  fs.writeFileSync("news_data.json", JSON.stringify(data, null, 2), "utf-8");

  console.log("데이터 수집 및 저장 완료");
}

main();
