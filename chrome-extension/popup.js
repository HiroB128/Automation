document.addEventListener("DOMContentLoaded", function () {
  const orderForm = document.getElementById("orderForm");
  const tradeTypeRadios = document.getElementsByName("tradeType");
  const stockTypeRadios = document.getElementsByName("stockType");
  const priceInput = document.getElementById("price");
  const usdRadio = document.getElementById("CurrencyUSD"); // USDラジオボタンの取得
  const usdLabel = document.querySelector('label[for="CurrencyUSD"]'); //  USDラベルの取得

  stockTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (radio.value === "米国株") {
        usdRadio.classList.remove("hidden"); //  USDラジオボタンを表示
        usdLabel.classList.remove("hidden"); //  USDラベルを表示
      } else {
        usdRadio.classList.add("hidden"); //  USDラジオボタンを非表示
        usdLabel.classList.add("hidden"); //  USDラベルを非表示
      }
    });
  });

  // Trade Typeが変更されたときにpriceフィールドの有効/無効を切り替える
  tradeTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (radio.value === "成行") {
        priceInput.disabled = true;
        priceInput.value = ""; // 成行の場合、priceフィールドをクリア
      } else {
        priceInput.disabled = false;
      }
    });
  });

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const orderType = document.querySelector('input[name="orderType"]:checked');
    const tradeType = document.querySelector('input[name="tradeType"]:checked');
    const stockType = document.querySelector('input[name="stockType"]:checked');
    const currency = document.querySelector('input[name="Currency"]:checked');
    const protectionType = document.querySelector(
      'input[name ="protectionType"]:checked'
    );

    console.log("Order Type:", orderType ? orderType.value : "Not selected");
    console.log("Trade Type:", tradeType ? tradeType.value : "Not selected");
    console.log("Stock Type:", stockType ? stockType.value : "Not selected");
    console.log("Currency:", currency ? currency.value : "Not selected");
    console.log(
      "Protection Type:",
      protectionType ? protectionType.value : "Not selected"
    );

    const orderData = {
      accountNumber: document.getElementById("accountNumber").value,
      stockName: document.getElementById("stockName").value,
      stockType: stockType ? stockType.value : "",
      orderType: orderType ? orderType.value : "",
      quantity: document.getElementById("quantity").value,
      tradeType: tradeType ? tradeType.value : "",
      price: priceInput.value,
      currency: currency ? currency.value : "", // 修正: 通貨選択を含める
      protectionType: protectionType ? protectionType.value : "",
    };

    chrome.storage.local.set({ orderData: orderData }, function () {
      if (chrome.runtime.lastError) {
        console.error("Error saving order data:", chrome.runtime.lastError);
      } else {
        console.log("Order data saved:", orderData);
        chrome.runtime.sendMessage({ action: "startAutomation" });
      }
    });
  });

  // 初期ロード時にtradeTypeの値に基づいてpriceフィールドを設定
  tradeTypeRadios.forEach((radio) => radio.dispatchEvent(new Event("change")));
  stockTypeRadios.forEach((radio) => radio.dispatchEvent(new Event("change"))); // 修正: 初期ロード時にUSDラジオボタンの状態を設定
});
