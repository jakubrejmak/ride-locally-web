import { searchTrips } from "@/app/actions/actions";
import LocationPicker from "@/app/ui/location-picker";
import DatePicker from "@/app/ui/date-picker";
import TimePicker from "@/app/ui/time-picker";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

export default function TripSearch() {
  return (
    <form action={searchTrips}>
      <div className='flex flex-col sm:flex-row gap-3 mt-7 mb-7'>
        <FieldGroup className='gap-4 flex-2'>
          <LocationPicker name="from" label="Origin" placeholder="Pick origin" initialListVariation='originList' />
          <LocationPicker name="to" label="Destination" placeholder="Pick destination" initialListVariation='destinationList' />
        </FieldGroup>
        <FieldGroup className='gap-4 flex-1'>
          <DatePicker />
          <TimePicker />
        </FieldGroup>
      </div>
      <Button type='submit'>Search</Button>
    </form>
  );
}
