# Notion Server Updater

Automatically updates a Notion database with server information: disk usage, public IP, and timestamp.

## Configuration

Create a `.env` file with:

```bash
NOTION_TOKEN=your_notion_integration_token
SERVER_NAME=your_server_name
REFRESH_PERIOD_SECONDS=30
```

## Usage

```bash
# Normal execution
npm install
npm start

# With Docker
docker-compose up -d
```

## Features

- Automatic updates every configurable seconds (default: 30)
- Real disk usage monitoring
- Public IP detection
- Docker and container compatible

## Notion Setup

Your database must have these properties:
- `Server Name` (title)
- `Last Updated` (date)
- `D. Usado` (number)
- `IP` (text)

## License

MIT