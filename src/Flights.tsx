import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Flight from "./Flight";

function Flights({ flights }) {
  {
    if (flights) {
      if (flights.data.itineraries.length > 0) {
        return (
          <Card className="max-w-[1200px] w-full">
            <CardHeader>
              <CardTitle>Flights</CardTitle>
              <CardDescription>List of flights</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {flights.data.itineraries.map((flight, index) => (
                <Flight flight={flight} key={index} />
              ))}
            </CardContent>
          </Card>
        );
      } else {
        return (
          <Card className="max-w-[900px] w-full">
            <CardHeader>
              <CardTitle>Flights</CardTitle>
              <CardDescription>No flights available :(</CardDescription>
            </CardHeader>
            <CardContent className="p-0"></CardContent>
          </Card>
        );
      }
    } else {
      return (
        <Card className="max-w-[900px] w-full">
          <CardHeader>
            <CardTitle>Flights</CardTitle>
            <CardDescription>
              Input your flight details to get started!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0"></CardContent>
        </Card>
      );
    }
  }
}

export default Flights;
