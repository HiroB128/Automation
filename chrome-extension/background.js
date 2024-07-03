chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "startAutomation") {
    console.log("Received message to start automation");
    //orderDataをローカルストレージから取得
    chrome.storage.local.get("orderData", function (result) {
      console.log("Attempting to retrieve 'orderData':", result);
      if (result.orderData) {
        const orderData = result.orderData;
        console.log("Order data to be sent:", orderData);
        console.log("Sending request to http://localhost:3000/order");
        //POSTリクエスト
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
              // throw new Error("Network response was not ok");
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
