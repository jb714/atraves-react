import { Box, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();

  return (
    <Box as="header" p={4} bg="white">
      <Box maxW="1200px" mx="auto" textAlign="center">
        <Heading size="lg">{t('header.title')}</Heading>
        <Text color="gray.600">{t('header.subtitle')}</Text>
      </Box>
    </Box>
  );
};

export default Header;