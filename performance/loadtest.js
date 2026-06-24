import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "1m", target: 1000 },
    { duration: "30s", target: 0 }
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"]
  }
};

export default function () {
  const res = http.get("http://localhost:3000/api/me/entitlements");
  check(res, {
    "status is 200": (r) => r.status === 200
  });
}
