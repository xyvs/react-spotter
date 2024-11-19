import { format, formatDuration } from "date-fns"

function FlightSegment({ segment, key }) {
    return (
        <div key={key} className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-2 border-t border-border p-4 bg-secondary">
            <div>
                <div className="font-medium">
                    {formatDuration({ hours: Math.floor(segment.durationInMinutes / 60), minutes: segment.durationInMinutes % 60 })}
                </div>
                <div className="text-sm text-muted-foreground">
                    {segment.origin.name} ({segment.origin.country}) → {segment.destination.name} ({segment.destination.country})
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="flex gap-6 items-center">
                    <div>
                        <div className="text-lg font-medium">
                            {format(segment.departure, "p")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {format(segment.departure, "PP")}
                        </div>
                    </div>
                    <div>
                        →
                    </div>
                    <div>
                        <div className="text-lg font-medium">
                            {format(segment.arrival, "p")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {format(segment.arrival, "PP")}
                        </div>
                    </div>
                </span>
            </div>
        </div>
    )
}

export default FlightSegment
