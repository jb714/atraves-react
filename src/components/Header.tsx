import { Box, Heading, Text, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);

const Header = () => {
  const { t } = useTranslation();

  return (
    <Box 
        as="header" 
        p={4} 
        bgGradient="linear(to-b, #eaf6fc, #d8f0fa)" 
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        position="relative"
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0.4) 85%, transparent 100%)",
          backgroundSize: "300px 6px",
          animation: "wave 6s ease-in-out infinite"
        }}
        sx={{
          "@keyframes wave": {
            "0%, 100%": { backgroundPosition: "0% 0%" },
            "50%": { backgroundPosition: "100% 0%" }
          }
        }}
    >
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