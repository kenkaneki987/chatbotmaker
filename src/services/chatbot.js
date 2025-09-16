export const getChatbot = async({token}) =>{
    const response = await fetch("/api/chatbot/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        const {err} = await response.json();
        console.log(err)
        throw new Error(err||"Error getting chatbot");
      }
      return response.json();
}
export const createChatbot = async({name,context,token}) =>{

    const response = await fetch("/api/chatbot/create", {
        method: "POST",
        body: JSON.stringify({name,context}),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, context,token }),
        method: "POST",
      });
      if (!response.ok) {
        const {err} = await response.json();
        console.log(err)
        throw new Error(err||"Error creating chatbot");
      }
      return response;
}


export const getChatbotByName = async ({ token, name }) => {
    const response = await fetch(`/api/chatbot/getByChatbotName?name=${encodeURIComponent(name)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) {
        const { err } = await response.json()
        throw new Error(err || "Error getting chatbot by name")
    }
    return response.json()
}

