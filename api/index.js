export default async function handler(req, res) {
  try {
    console.log("🔵 Request received:", req.method);

    if (req.method === "GET") {
      console.log("🟢 GET request test route hit");
      return res.status(200).json({ message: "GET request success" });
    }

    if (req.method === "POST") {
      const body = req.body;
      console.log("📦 Received body:", body);

      // Basic field check
      if (!body || !body.code) {
        console.warn("⚠️ Missing 'code' in request body");
        return res.status(400).json({ error: "Missing 'code' field" });
      }

      // Simulate processing
      console.log("✅ Processing code...");
      const explanation = `Simulated explanation for:\n\n${body.code}`;

      return res.status(200).json({ explanation });
    }

    console.warn("❌ Unsupported method");
    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error("🔥 Error in API:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
