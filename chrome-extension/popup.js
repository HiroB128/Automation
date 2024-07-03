document
  .getElementById("orderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const orderData = {
      stockName: document.getElementById("stockName").value,
      orderType: document.getElementById("orderType").value,
      quantity: document.getElementById("quantity").value,
      tradeType: document.getElementById("tradeType").value,
      price: document.getElementById("price").value,
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
