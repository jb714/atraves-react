import { Box, Heading, Text, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);

const Header = () => {
  const { t } = useTranslation();

  return (
    <Box as="header" p={4} bg="#e8f6fc">
      <Box maxW="1200px" mx="auto" textAlign="center">
        {/* <Heading size="lg">{t('header.title')}</Heading> */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image 
            src="/Atraves_logo.png" 
            alt="Através" 
            height="60px"
            mx="auto"
            mb={4}
          />
        </MotionBox>
        <MotionText 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          fontFamily="'Caveat', 'Libre Baskerville', 'Baskerville', 'Georgia', serif"
          fontSize="md"
          fontWeight="700"
          letterSpacing="1px"
          opacity={0.85}
        >
          {t('header.subtitle')}
        </MotionText>
      </Box>
    </Box>
  );
};

export default Header;