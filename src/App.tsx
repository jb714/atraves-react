import { ChakraProvider } from "@chakra-ui/react"
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
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <ChakraProvider>
          <Header />
          <ContentWrapper />
          <Footer />
        </ChakraProvider>
      </I18nextProvider>
    </div>
  );
}

export default App;
