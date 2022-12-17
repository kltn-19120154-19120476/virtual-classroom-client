import React from "react";

import { Container, Header, Main, Footer, Cards } from "@components";
import { EnvExample } from "@components/examples/env";
import { AxiosExample } from "@components/examples/axios";
import { ZustandExample } from "@components/examples/zustand";

const Home: React.FC = () => {
    return (
        <Container>
            <Header />
            <Main />
            <AxiosExample />
            <EnvExample />
            <ZustandExample />
            <Cards />
            <Footer />
        </Container>
    );
};

export default Home;
