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
            <Input 
                value={value} 
                onChange={onChange} 
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                {...rest} 
            />
        </FormControl>
    )
}

export default LocationInput