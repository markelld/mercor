import { ApolloProvider } from "@apollo/client/react";
import client from "./apollo";
import BookmarkList from "./components/BookmarkList";

function App() {
  return (
    <ApolloProvider client={client}>
      <BookmarkList />
    </ApolloProvider>
  );
}

export default App;
