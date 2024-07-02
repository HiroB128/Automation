chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startAutomation") {
    console.log("Received message to start automation");

    chrome.storage.local.get("orderData", function (result) {
      console.log("Attempting to retrieve 'orderData':", result); // 取得を試みるログ出力
      if (result.orderData) {
        const orderData = result.orderData;
        console.log("Order data to be sent:", orderData); // ログ出力
        console.log("Sending request to http://localhost:3000/order"); // ログ出力

        fetch("http://localhost:3000/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })
          .then((response) => {
            console.log("Response status:", response.status);
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => console.log("Response data:", data));
        // .catch((error) => console.error("Fetch error:", error));
      } else {
        console.error("No order data found");
      }
    });
  }
});
