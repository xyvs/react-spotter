import { format, formatDuration } from "date-fns"
import { ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as React from "react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"

import FlightSegment from "./FlightSegment"


function Flight({ flight, key }) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div key={key} className="border-t border-border">
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
            >

                <div className="px-8 py-4 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <img src={flight.legs[0].carriers.marketing[0].logoUrl} alt="logo" className="w-8 h-8" />
                        </div>
                        <span className="flex gap-6 items-center">
                            <div>
                                <div className="text-lg font-medium">
                                    {format(flight.legs[0].departure, "p")}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {format(flight.legs[0].departure, "PP")}
                                </div>
                            </div>
                            <div>
                                →
                            </div>
                            <div>
                                <div className="text-lg font-medium">
                                    {format(flight.legs[0].arrival, "p")}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {format(flight.legs[0].arrival, "PP")}
                                </div>
                            </div>
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-8">
                        <div className="md:text-right">
                            <div>
                                {formatDuration({ hours: Math.floor(flight.legs[0].durationInMinutes / 60), minutes: flight.legs[0].durationInMinutes % 60 })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {flight.legs[0].origin.name} → {flight.legs[0].destination.name}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-xl font-medium text-right">{flight.price.formatted} USD</div>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {isOpen ? <X className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </div>

                <CollapsibleContent>
                    {flight.legs[0].segments.map((segment, index) => (
                        <FlightSegment segment={segment} key={index} />
                    ))}
                </CollapsibleContent>
            </Collapsible>

        </div>
    )
}

export default Flight