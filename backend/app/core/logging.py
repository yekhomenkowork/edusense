import json
import logging
import os
from datetime import UTC, datetime


class Formatter(logging.Formatter):
    def format(self, record):
        return json.dumps({
            "timestamp": datetime.now(UTC).isoformat(), "logger": record.name,
            "level": record.levelname, "message": record.getMessage(),
        }, ensure_ascii=False)


def configure_logging():
    handler = logging.StreamHandler()
    handler.setFormatter(Formatter())
    logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"), handlers=[handler], force=True)
