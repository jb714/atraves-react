import {
    FormControl,
    FormLabel,
    Input,
    InputProps
} from "@chakra-ui/react"

type LocationInputProps = {
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputProps;

const LocationInput = ({label, value, onChange, ...rest}: LocationInputProps) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Input value={value} onChange={onChange} {...rest} />
        </FormControl>
    )
}

export default LocationInput