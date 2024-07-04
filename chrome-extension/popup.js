document.addEventListener("DOMContentLoaded", function () {
  const orderForm = document.getElementById("orderForm");
  const tradeTypeRadios = document.getElementsByName("tradeType");
  const orderTypeRadios = document.getElementsByName("orderType");
  const priceInput = document.getElementById("price");

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

    const orderData = {
      accountNumber: document.getElementById("accountNumber").value,
      stockName: document.getElementById("stockName").value,
      orderType: orderType ? orderType.value : "",
      quantity: document.getElementById("quantity").value,
      tradeType: tradeType ? tradeType.value : "",
      price: priceInput.value,
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
});
