export interface ButtonSwitchConfig<T> {
    selectedOption: T;
    disabled?: boolean;
    options: ButtonSwitchOption<T>[];
    onChange?: (selectedOption: T) => void;
}
export interface ButtonSwitchOption<T> {
    text: string;
    value: T;
    disabled?: boolean;
}
