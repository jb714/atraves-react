import { ChakraProvider } from "@chakra-ui/react"
import Header from "./components/Header";
import MapsAndInputContainer from "./components/MapsAndInputContainer";
import Comments from "./components/Comments";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Header />
        <MapsAndInputContainer />
        <Comments />
      </ChakraProvider>
    </div>
  );
}

export default App;
