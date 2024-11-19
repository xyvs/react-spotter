const getAirportIDs = async (airport: string) => {
    const queryParams = new URLSearchParams({
        query: airport,
        locale: "en-US",
    });

    const url =
        `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?${queryParams}`;
    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": import.meta.env.VITE_API_KEY,
            "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
    };

    const response = await fetch(url, options);
    const result = await response.json();
    return result;
};

const getFlights = async ({
    origin,
    destination,
    departure_date,
    return_date,
    flight_class,
}: {
    origin: any;
    destination: any;
    departure_date: string;
    return_date: string;
    flight_class: string;
}) => {
    console.log(origin);
    console.log(origin.skyId);
    console.log(origin.entityId);
    console.log(destination);
    console.log(destination.skyId);
    console.log(destination.entityId);
    console.log(departure_date);
    console.log(return_date);
    console.log(flight_class);

    const queryParams = new URLSearchParams({
        originSkyId: origin.skyId,
        destinationSkyId: destination.skyId,
        originEntityId: origin.entityId,
        destinationEntityId: destination.entityId,
        date: departure_date,
        returnDate: return_date,
        cabinClass: flight_class,
        adults: "1",
        sortBy: "best",
        limit: "25",
        currency: "USD",
        market: "en-US",
        countryCode: "US",
    });

    const url =
        `https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete?${queryParams}`;
    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": import.meta.env.VITE_API_KEY,
            "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        },
    };

    const response = await fetch(url, options);
    const result = await response.json();
    return result;
};

export { getAirportIDs, getFlights };
