// api/bus.js
// Vercel serverless function — proxy to Gyeonggi bus arrival API
export default async function handler(req, res) {
  const stationId = req.query.stationId;
  if (!stationId) {
    return res.status(400).json({ error: "stationId required" });
  }

  const API_KEY = process.env.GG_BUS_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "server misconfigured: missing GG_BUS_KEY" });
  }

  const ENDPOINT = "https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalList";

  try {
    // 안전하게 인코딩
    const url =
      `${ENDPOINT}?serviceKey=${encodeURIComponent(API_KEY)}` +
      `&stationId=${encodeURIComponent(stationId)}` +
      `&pageNo=1&numOfRows=10&resultType=json`;

    const upstream = await fetch(url);
    const text = await upstream.text();

    // 업스트림이 JSON 아닌 경우 (에러 메시지 등) 대비
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (parseErr) {
      // JSON 파싱 실패 시 원문을 그대로 전달 (디버깅용)
      return res.status(upstream.ok ? 200 : 502).json({
        upstreamStatus: upstream.status,
        upstreamBody: text,
      });
    }
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "proxy failed", message: err.message });
  }
}
