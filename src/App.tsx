import { ChakraProvider } from "@chakra-ui/react"
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Header from "./components/Header";
import ContentWrapper from "./components/ContentWrapper";

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <ChakraProvider>
          <Header />
          <ContentWrapper />
        </ChakraProvider>
      </I18nextProvider>
    </div>
  );
}

export default App;
