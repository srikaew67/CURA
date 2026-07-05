.PHONY: run dev backend frontend

run: dev

backend:
	cd backend && npm run dev

frontend:
	cd frontend && npm run dev

dev:
	@echo "Starting backend and frontend..."
	@trap 'kill 0' EXIT; \
	cd backend && npm run dev & \
	cd frontend && npm run dev & \
	wait
