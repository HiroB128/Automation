import { chromium } from "playwright";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors()); // CORSを有効にする
app.use(bodyParser.json());

app.post("/order", async (req, res) => {
  const {
    stockName,
    orderType,
    quantity,
    price,
    tradeType,
    accountNumber,
    currency,
    protectionType,
  } = req.body;
  console.log("Received order data:", req.body);

  try {
    const browser = await chromium.launch({ headless: false }); // ヘッドフルモードで起動
    const page = await browser.newPage();

    // ページに遷移する前に、ログを出力
    console.log("Navigating to order page");
    await page.goto(
      "http://fidmmfront01.dev.tworks.co.jp/Standard/#/develop-login"
    ); // 正しいURLに変更
    console.log("Navigated to order page");

    // ログインIDを入力
    console.log("Entering login ID");
    await page.locator('input[name="login-id"]').click();
    await page.locator('input[name="login-id"]').fill(accountNumber.toString());
    await page.getByText("ログイン", { exact: true }).click();
    console.log("Login ID click");

    await page.getByText("注文 / 銘柄情報").click();

    // 銘柄名を入力
    console.log("Clicking on combobox");
    await page.getByRole("combobox", { name: "銘柄名・銘柄コード" }).click();
    console.log("Combobox clicked");

    console.log("Filling stock name");
    await page
      .getByRole("combobox", { name: "銘柄名・銘柄コード" })
      .fill(stockName);
    console.log("Stock name filled");

    console.log("Pressing Enter on combobox");
    await page
      .getByRole("combobox", { name: "銘柄名・銘柄コード" })
      .press("Enter");
    console.log("Enter pressed on combobox");

    // 取引種別に応じて処理を分岐
    if (orderType === "現物") {
      console.log("Selecting 現物 order type");
      await page.getByRole("button", { name: "現物" }).click();
      console.log("Selected 現物 order type");
    } else if (orderType === "信用") {
      console.log("Selecting 信用 order type");
      await page.getByRole("button", { name: "信用", exact: true }).click();
      console.log("Selected 信用 order type");
    }

    // 数量
    console.log("Entering quantity");
    await page.getByPlaceholder("数量を入力").click();
    await page.getByPlaceholder("数量を入力").fill(quantity.toString());
    console.log("Quantity entered");

    if (currency === "円") {
      await page.locator("div").filter({ hasText: /^円$/ }).click();
    } else if (currency === "USD") {
      await page.getByText("USD", { exact: true }).nth(2).click();
    }
    console.log(currency);

    if (protectionType === "保護") {
      await page.getByRole("button", { name: "保護" }).click();
    } else if (protectionType === "日本株信用代用") {
      await page.getByRole("button", { name: "日本株信用代用" }).click();
    } else if (protectionType === "米国株信用代用") {
      await page.getByRole("button", { name: "米国株信用代用" }).click();
    }
    console.log(protectionType);

    if (tradeType === "指値") {
      console.log("指値注文");
      await page.getByText("指値", { exact: true }).click();
      await page.getByPlaceholder("指値を入力").fill(price.toString());
      console.log("指値注文", price);
    } else if (tradeType === "成行") {
      await page.getByText("成行").click();
    }

    console.log("Entering trade Pin");
    await page.waitForSelector('input[placeholder="取引暗証番号を入力"]', {
      timeout: 5000,
    });
    await page.getByPlaceholder("取引暗証番号を入力").click();
    await page.getByPlaceholder("取引暗証番号を入力").fill("0000");
    console.log("暗証番号を入力完了");

    console.log("Clicking on order confirmation");
    await page.getByText("注文確認").click();
    console.log("Order confirmation clicked");

    console.log("Clicking on place order");
    await page.getByText("発注", { exact: true }).click();
    console.log(
      accountNumber,
      stockName,
      orderType,
      currency,
      "数量:" + quantity,
      protectionType,
      "値段:" + price,
      tradeType + "で注文いたしました"
    );

    // 終了処理
    await browser.close();
    res.status(200).json({ status: "Order placed successfully" }); // ステータスコード200を明示的に設定
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ status: "Order failed", error: error.message }); // エラーステータスコード500を設定
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
