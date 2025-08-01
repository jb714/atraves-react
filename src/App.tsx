import { ChakraProvider, Box } from "@chakra-ui/react"
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Header from "./components/Header";
import ContentWrapper from "./components/ContentWrapper";
import Footer from "./components/Footer";
import { useEffect } from 'react';
import { trackPageView } from './services/analyticsService';

function App() {
  useEffect(() => {
    trackPageView('Home');
  }, []);

  return (
    <Box className="App" minH="100vh" bg="#f9fbfc">
      <I18nextProvider i18n={i18n}>
        <ChakraProvider>
          <Header />
          <ContentWrapper />
          <Footer />
        </ChakraProvider>
      </I18nextProvider>
    </Box>
  );
}

export default App;
