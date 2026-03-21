import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",   # Change to "0.0.0.0" to expose on network
        port=8000,
        reload=True,         # Set False in production
        log_level="info",
    )
