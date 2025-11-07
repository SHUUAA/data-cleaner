export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      "https://primary-production-aa7d9.up.railway.app/webhook/submit",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ message: "Error forwarding request" });
    console.error("Proxy error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data || "Error forwarding request",
    });
  }
}
