# Notion Server Updater

Automatically updates a Notion database with server information: disk usage, public IP, and timestamp.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with:

```
NOTION_API_KEY=your_notion_api_key
SERVER_NAME=your_server_name
REFRESH_PERIOD_SECONDS=30
```

## Usage

```bash
# Normal execution
npm start

# With Docker
docker-compose up -d
```

## Features

- ✅ Automatic updates every configurable seconds (default: 30)
- ✅ Real disk usage monitoring
- ✅ Public IP detection
- ✅ Docker and container compatible

## Notion Setup

Your database must have these properties:
- `Server Name` (title)
- `Last Updated` (date)
- `D. Usado` (number)
- `IP` (text)

## License

MIT