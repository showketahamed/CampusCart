const testLogin = async () => {
  try {
    console.log("Attempting login...");
    const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "admin@campuscart.com",
        password: "admin123"
      })
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", data);
  } catch (error) {
    console.log("Fetch Failed:", error.message);
  }
};

testLogin();
