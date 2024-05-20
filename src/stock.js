/**
4월 1일부터, 4월 19일까지 삼성전자  주봉(3개)가져와서 json으로 저장하기.
json에 들어갈 필수 key
[date, tradePrice(종가), openingPrice, highPrice, lowPrice, candleAccTradePrice(거래대금)]
*/
import axios from "axios";
import fs from "fs";

// URL 설정
const url =
  "https://finance.daum.net/api/charts/A005930/days?limit=200&adjusted=true";

// axios 요청 설정
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Referer: "https://finance.daum.net/quotes/A005930",
  Accept: "application/json, text/plain, */*",
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  const fromDate = new Date("2024-04-01");
  const toDate = new Date("2024-04-19");
  return date >= fromDate && date <= toDate;
};

// axios를 사용하여 GET 요청을 보냅니다.
axios
  .get(url, { headers: headers })
  .then((response) => {
    // JSON 데이터를 파싱합니다.
    const data = response.data.data;

    const filteredData = data
      .filter((item) => isValidDate(item.date))
      .map((item) => ({
        date: item.date,
        tradePrice: item.tradePrice,
        openingPrice: item.openingPrice,
        highPrice: item.highPrice,
        lowPrice: item.lowPrice,
        candleAccTradePrice: item.candleAccTradePrice,
      }));

    // 결과를 콘솔에 출력
    console.log(filteredData);

    // 결과를 JSON 파일로 저장
    fs.writeFile("stock.json", JSON.stringify(filteredData, null, 2), (err) => {
      if (err) throw err;
      console.log("Data saved to stock.json");
    });
  })
  .catch((error) => {
    console.error("Error fetching the data:", error);
  });
