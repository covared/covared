const backendURL = "api";

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
      },
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
      },
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
      },
    });

    let responseJson = await response.json();
    return responseJson;
  },
  postVerification: async function (
    code: string,
    threadId: string,
    verificationType: string
  ) {
    // not implimented
    return {};
  },
};
