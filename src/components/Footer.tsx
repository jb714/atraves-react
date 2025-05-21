import { Box, Heading, Text, Flex, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="footer" p={4} bg="white" borderTop="1px solid" borderColor="gray.200" left={0} right={0} bottom={0} zIndex={10}>
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Box>
          <Button variant="link" color="blue.600" onClick={onOpen} fontWeight="normal">
            {t('footer.about')}
          </Button>
        </Box>
        <Box textAlign="center">
          <Heading size="lg">{t('footer.title')}</Heading>
          <Text color="gray.600">{t('footer.subtitle')}</Text>
        </Box>
        <Box>
          <Link href="mailto:your@email.com?subject=Através Feedback" color="blue.600">
            {t('footer.contact')}
          </Link>
        </Box>
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
            <Text fontSize="sm" color="gray.500">
              Built with React, Firebase, and love for global connection.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Footer;