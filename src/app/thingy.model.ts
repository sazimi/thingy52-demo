export enum Sensor {
    TEMPERATURE = "temperature",
    HUMIDITY = "humidity"
}

export interface IResult {
    value: string | number;
    type: Sensor
}
