const backendURL = "api"

export const CarAssistantAPI = {
  postMessage: async function (message: string, threadId: string) {
    let carAssistantURL = backendURL + "/car-assistant/add-message";

    let response = await fetch(carAssistantURL, {
      method: "POST",
      body: JSON.stringify({
        message: message,
        thread_id: threadId,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  getMessages: async function (threadId: string) {
    let carAssistantURL = backendURL + "/car-assistant/" + threadId + "/messages";

    let response = await fetch(carAssistantURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  postUser: async function () {
    let carAssistantURL = backendURL + "/car-assistant/user";

    let response = await fetch(carAssistantURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  postVerification: async function (code: string, threadId: string, verificationType: string) {
    let carAssistantURL = backendURL + "/car-assistant/verification";

    let response = await fetch(carAssistantURL, {
      method: "POST",
      body: JSON.stringify({
        code: code,
        thread_id: threadId,
        verification_type: verificationType,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
}