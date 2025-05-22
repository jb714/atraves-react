import { Box, Heading, Text, Flex, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  console.log("Footer rendered");
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const supportedLanguages = t('footer.languages', { returnObjects: true }) as string[];

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
              {t('footer.aboutContent')}
            </Text>
            <Text mt={4} fontWeight="bold">
              {t('footer.languagesTitle')}
            </Text>
            <Box as="ul" pl={5} mb={2}>
              {supportedLanguages.map((lang: string, index: number) => (
                <li key={index}>
                  <Text as="span" fontSize="sm">{lang}</Text>
                </li>
              ))}
            </Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {t('footer.craftedWith')}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Footer;