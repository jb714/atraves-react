import { Box, Text, Grid, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Switch, HStack, useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const Footer = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen: isAboutOpen, onOpen: onAboutOpen, onClose: onAboutClose } = useDisclosure();
  const { isOpen: isPrivacyOpen, onOpen: onPrivacyOpen, onClose: onPrivacyClose } = useDisclosure();

  const supportedLanguages = t('footer.languages', { returnObjects: true }) as string[];

  // Analytics opt-out state
  const [analyticsOptOut, setAnalyticsOptOut] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('atraves_analytics_optout');
    setAnalyticsOptOut(stored === 'true');
  }, [isPrivacyOpen]);
  const handleOptOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnalyticsOptOut(e.target.checked);
    localStorage.setItem('atraves_analytics_optout', e.target.checked ? 'true' : 'false');
    toast({
      title: e.target.checked
        ? t('footer.analyticsOptOutToast', 'You have opted out of anonymous analytics.')
        : t('footer.analyticsOptInToast', 'You have enabled anonymous analytics.'),
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'bottom',
    });
  };

  return (
    <Box as="footer" p={4} bg="white" borderTop="1px solid" borderColor="gray.200" left={0} right={0} bottom={0} zIndex={10}>
      <Grid maxW="1200px" mx="auto" templateColumns="1fr auto 1fr" alignItems="center">
        {/* Left: About */}
        <Box justifySelf="start">
          <Button variant="link" color="blue.600" onClick={onAboutOpen} fontWeight="normal" minW="120px" textAlign="left">
            {t('footer.about')}
          </Button>
        </Box>
        {/* Center: Privacy */}
        <Box justifySelf="center">
          <Button variant="link" color="blue.600" onClick={onPrivacyOpen} fontWeight="normal" minW="120px" textAlign="center">
            {t('footer.privacy')}
          </Button>
        </Box>
        {/* Right: Contact */}
        <Box justifySelf="end">
          <Link href="mailto:your@email.com?subject=Através Feedback" color="blue.600" minW="120px" textAlign="right">
            {t('footer.contact')}
          </Link>
        </Box>
      </Grid>

      {/* About Modal */}
      <Modal isOpen={isAboutOpen} onClose={onAboutClose} isCentered>
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

      {/* Privacy Modal */}
      <Modal isOpen={isPrivacyOpen} onClose={onPrivacyClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('footer.privacy')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {Array.isArray(t('footer.privacyContent', { returnObjects: true })) ? (
              <Box as="ul" mb={4} pl={5}>
                {(t('footer.privacyContent', { returnObjects: true }) as string[]).map((item, idx) => (
                  <Text as="li" key={idx} mb={1}>{item}</Text>
                ))}
              </Box>
            ) : (
              <Text mb={4}>{t('footer.privacyContent')}</Text>
            )}
            <HStack mb={4}>
              <Switch id="analytics-optout" isChecked={analyticsOptOut} onChange={handleOptOutChange} />
              <Text fontSize="sm">
                {t('footer.analyticsOptOutLabel', 'Opt out of anonymous analytics')}
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {t('footer.lastUpdated')}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Footer;