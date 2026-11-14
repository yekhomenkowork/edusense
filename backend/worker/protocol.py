from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, FiniteFloat, model_validator


class State(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schema_version: Literal[1]
    status: Literal["online", "offline"]


class Metric(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: Literal["temperature", "humidity", "co2", "gas_adc"]
    value: FiniteFloat
    unit: Literal["Cel", "%", "ppm", "count"]


class Telemetry(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schema_version: Literal[1]
    message_id: UUID
    metrics: Annotated[list[Metric], Field(min_length=1, max_length=4)]

    @model_validator(mode="after")
    def validate_metrics(self):
        units = {"temperature": "Cel", "humidity": "%", "co2": "ppm", "gas_adc": "count"}
        if len({m.name for m in self.metrics}) != len(self.metrics) or any(
            units[m.name] != m.unit for m in self.metrics
        ):
            raise ValueError("Invalid metrics or units")
        return self


def decode(topic, payload):
    levels = topic.split("/")
    if len(levels) != 5 or levels[:3] != ["edusense", "v1", "devices"] or len(payload) > 8192:
        raise ValueError("Invalid topic or payload size")
    identity = UUID(levels[3])
    if str(identity) != levels[3]:
        raise ValueError("Noncanonical device identifier")
    if levels[4] == "telemetry":
        return identity, Telemetry.model_validate_json(payload)
    if levels[4] == "state":
        return identity, State.model_validate_json(payload)
    raise ValueError("Unknown message type")
