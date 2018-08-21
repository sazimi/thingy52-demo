export enum Sensor {
    TEMPERATURE = "temperature",
    HUMIDITY = "humidity",
    MOTION = "motion",
}

export interface IResult {
    value: string | number;
    type: Sensor
}
