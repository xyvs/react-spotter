import Flights from "./Flights";
import FlightForm from "./Form";
import Header from "./Header";

import * as React from "react";

import {
    EXAMPLE_MULTISTOP_FLIGHT,
    EXAMPLE_SINGLE_FLIGHT,
    EXAMPLE_EMPTY_FLIGHT,
} from "./../constants.js";

function App() {
    const [flights, setFlights] = React.useState<boolean>(false);

    React.useEffect(() => {
        //setFlights(EXAMPLE_MULTISTOP_FLIGHT);
    }, []);

    return (
        <>
            <div className="bg-background text-foreground min-h-screen min-w-screen flex items-center justify-center dark flex-col gap-8 px-6 py-12 md:p-12">
                <Header />
                <FlightForm setFlights={setFlights} />
                <Flights flights={flights} />
            </div>
        </>
    );
}

export default App;
