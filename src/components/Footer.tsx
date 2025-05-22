import { Box, Heading, Text, Flex, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  console.log("Footer rendered");
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const supportedLanguages = [
    "English",
    "Español (Spanish)",
    "Français (French)",
    "Deutsch (German)",
    "Italiano (Italian)",
    "Português (Portuguese)",
    "Nederlands (Dutch)",
    "Русский (Russian)",
    "日本語 (Japanese)",
    "한국어 (Korean)",
    "中文 (Chinese)",
    "Svenska (Swedish)"
  ];

  return (
    <Box as="footer" p={4} bg="white" borderTop="1px solid" borderColor="gray.200" left={0} right={0} bottom={0} zIndex={10}>
      <Flex maxW="1200px" mx="auto" align="center" justify="center">
        <HStack spacing={8}>
          <Button variant="link" color="blue.600" onClick={onOpen} fontWeight="normal">
            {t('footer.about')}
          </Button>
          <Text color="gray.400" fontSize="lg">·</Text>
          <Link href="mailto:your@email.com?subject=Através Feedback" color="blue.600">
            {t('footer.contact')}
          </Link>
        </HStack>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('footer.about')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>
              Através lets you leave and discover messages at the antipode—the exact opposite point on Earth. Messages are discoverable within a 100 km area for privacy, and your exact location is never stored or shared.
            </Text>
            <Text mt={4} fontWeight="bold">
              Languages we support:
            </Text>
            <Box as="ul" pl={5} mb={2}>
              {supportedLanguages.map(lang => (
                <li key={lang}>
                  <Text as="span" fontSize="sm">{lang}</Text>
                </li>
              ))}
            </Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Built with React, Firebase, and love of connection across the globe.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Footer;