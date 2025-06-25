import { Box, Heading, Text, Container } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();

  return (
    <Box 
      as="header" 
      py={8} 
      px={4}
      bg="linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
      color="white"
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        bgImage="radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 50%, white 2px, transparent 2px)"
        bgSize="100px 100px"
      />
      
      <Container maxW="1200px" textAlign="center" position="relative">
        <Heading 
          size="2xl" 
          mb={3}
          fontWeight="bold"
          letterSpacing="tight"
          textShadow="0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)"
          color="white"
        >
          {t('header.title')}
        </Heading>
        <Text 
          fontSize="xl" 
          color="white"
          fontWeight="medium"
          maxW="600px"
          mx="auto"
          textShadow="0 2px 4px rgba(0,0,0,0.4)"
        >
          {t('header.subtitle')}
        </Text>
      </Container>
    </Box>
  );
};

export default Header;