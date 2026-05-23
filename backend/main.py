from fastapi import FastAPI
from typing import List, Dict, Any

app = FastAPI()

@app.get("/sensors/latest")
def get_latest_sensor() -> Dict[str, Any]:
	"""Devuelve la última lectura del sensor."""
	# Ejemplo de respuesta simulada
	return {
		"device_id": "esp32_01",
		"temperature": 23.5, 
		"humidity": 45.2, 
		"timestamp": "1778529751"
	}

@app.get("/sensors/history")
def get_sensor_history() -> List[Dict[str, Any]]:
	"""Devuelve el historial de lecturas del sensor."""
	# Ejemplo de respuesta simulada
	return [
		{"temperature": 23.5, "humidity": 45.2, "timestamp": "2026-05-11T12:00:00Z"},
		{"temperature": 22.8, "humidity": 47.1, "timestamp": "2026-05-11T11:00:00Z"}
	]

@app.get("/health")
def health_check() -> Dict[str, str]:
	"""Endpoint de salud de la API."""
	return {"status": "ok"}
