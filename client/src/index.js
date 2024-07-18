import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
//imports the context wrapper to be able to use it across the site
import { UserProvider } from "./context/UserContext";
//imports chakra wrapper to be able to use the UI library
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<UserProvider>
		<ChakraProvider>
			<App />
		</ChakraProvider>
	</UserProvider>
);
