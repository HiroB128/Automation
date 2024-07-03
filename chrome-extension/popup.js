document.addEventListener("DOMContentLoaded", function () {
  const orderForm = document.getElementById("orderForm");
  const tradeTypeSelect = document.getElementById("tradeType");
  const priceInput = document.getElementById("price");
  const errorMessage = document.createElement("div");

  errorMessage.style.color = "red";
  errorMessage.style.marginTop = "10px";
  orderForm.appendChild(errorMessage);

  // Trade Typeが変更されたときにpriceフィールドの有効/無効を切り替える
  tradeTypeSelect.addEventListener("change", function () {
    if (tradeTypeSelect.value === "成行") {
      priceInput.disabled = true;
      priceInput.value = ""; // 成行の場合、priceフィールドをクリア
      errorMessage.textContent = "";
    } else {
      priceInput.disabled = false;
    }
  });

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const orderData = {
      accountNumber: document.getElementById("accountNumber").value,
      stockName: document.getElementById("stockName").value,
      orderType: document.getElementById("orderType").value,
      quantity: document.getElementById("quantity").value,
      tradeType: tradeTypeSelect.value,
      price: priceInput.value,
    };

    if (orderData.tradeType === "指値" && !orderData.price) {
      errorMessage.textContent = "値段を入力してください。";
      return;
    } else {
      errorMessage.textContent = "";
    }

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
  tradeTypeSelect.dispatchEvent(new Event("change"));
});
