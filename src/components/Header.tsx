import { Heading, Text, VStack, Box } from "@chakra-ui/react"

const Header = () => {
    return (
        <Box pt={[4, 6, 8]}>
            <VStack spacing={[1, 2]} mb={[4, 6, 8]}>
                <Heading 
                    as="h1" 
                    size={["xl", "2xl", "3xl"]}
                    textAlign="center"
                >
                    Através
                </Heading>
                <Text 
                    fontSize={["md", "lg", "xl"]} 
                    color="gray.600"
                    textAlign="center"
                >
                    The other side of the world, here
                </Text>
            </VStack>
        </Box>
    )
}

export default Header