let backendURL = process.env.REACT_APP_BACKEND_URL
if (backendURL == null){
    backendURL = "http://localhost:8000"
    //backendURL = "https://storybook-fastapi-8879a9fd0b0f.herokuapp.com"
}

export const WolfAPI = {
  postMessage: async function (message: string, threadId: string) {
    let wolfURL = backendURL + "/wolf";

    let response = await fetch(wolfURL, {
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
    let wolfURL = backendURL + "/wolf/" + threadId;

    let response = await fetch(wolfURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  postUser: async function () {
    let wolfURL = backendURL + "/wolf/user";

    let response = await fetch(wolfURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  postVerification: async function (code: string, threadId: string, verificationType: string) {
    // not implimented
    return {};
  },
}