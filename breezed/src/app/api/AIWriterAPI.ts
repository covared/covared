
const backendURL = "api"

export const AIWriterAPI = {
  postReport: async function (studentName: string, className: string, competencies: {}[], topics: {}[], usegpt4: boolean, email: string) {
    let endpointURL = backendURL + "/report-writer";

    let response = await fetch(endpointURL, {
      method: "POST",
      body: JSON.stringify({
        student_name: studentName,
        class_name: className,
        competencies: competencies,
        topics: topics,
        use_gpt4: usegpt4,
        email: email
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  postEmail: async function (email: string) {
    
    let endpointURL = backendURL + "/send-email";

    await fetch(backendURL + "/status")

    let response = await fetch(endpointURL, {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  postCode: async function (code: string, email: string) {
    let endpointURL = backendURL + "/send-code";

    let response = await fetch(endpointURL, {
      method: "POST",
      body: JSON.stringify({
        code: code,
        email: email
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });
    let responseJson = await response.json();
    return responseJson;
  },
  getAuthStatus: async function () {
    console.log('backendURL:', backendURL);
    let endpointURL = backendURL + "/auth/status";

    try {
      let response = await fetch(endpointURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });
      if (!response.ok) {
        console.log('Error response:'+ response);
        return { isLoggedIn: false };
      }
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log("Failed to verify auth status:", error);
      return { isLoggedIn: false }; // Provide a default response
    }
  },
  postAuthLogout: async function () {
    let endpointURL = backendURL + "/auth/logout";

    let response = await fetch(endpointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  createCheckoutSession: async function (email: string, planType: string) {
    let endpointURL = backendURL + "/create-checkout-session";

    let response = await fetch(endpointURL, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        plan_type: planType
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });
    
    let responseJson = await response.json();
    return responseJson;
  },
  checkSessionStatus: async function (sessionId: string) {
    let endpointURL = `${backendURL}/session-status?session_id=${sessionId}`;

    let response = await fetch(endpointURL, {
      method: "GET", // Assuming this endpoint is a GET request
      headers: {
        "Content-Type": "application/json",
      },
    });

    let responseJson = await response.json();
    return responseJson;
  },
}