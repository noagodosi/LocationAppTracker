export type TLocation = {
    latitude: number;
    longitude: number;
}

export type TLocationData = {
    location: TLocation;
    timestamp: TTimestamp;
    displayState: StateEnum;
    // method: ModeEnum;
}

export enum ModeEnum {
    REACT_NATIVE = "react-native-get-location",
    NATIVE_ANDROID = "native Android"
}

export enum StateEnum {
    LOCKED = "Locked",
    UNLOCKED = "Unlock"
}


type TTimestamp = {
    date: string;
    time: string
}