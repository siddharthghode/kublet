#!/usr/bin/env bash
# ==============================================================================
# KubePulse - Load & Traffic Generator for HPA Testing
# ==============================================================================

TARGET_URL="${1:-http://localhost:8080}"
CONCURRENCY="${2:-10}"

echo "======================================================"
echo "    🚀 KubePulse Traffic Generator (HPA Stress Test)"
echo "======================================================"
echo "Target URL:  ${TARGET_URL}"
echo "Concurrency: ${CONCURRENCY} workers"
echo "Press [Ctrl+C] to stop load generation."
echo "======================================================"

for i in $(seq 1 "$CONCURRENCY"); do
  (
    while true; do
      curl -s -o /dev/null -w "%{http_code}\n" "${TARGET_URL}/" >/dev/null 2>&1 || true
      curl -s -o /dev/null -w "%{http_code}\n" "${TARGET_URL}/health" >/dev/null 2>&1 || true
      sleep 0.05
    done
  ) &
done

echo "Traffic generation started. Monitor HPA in another terminal with:"
echo "kubectl get hpa kubepulse-hpa -n kubepulse-dev -w"

wait
