import { searchTrips } from "@/app/actions/actions";
import LocationPicker from "@/app/ui/location-picker";
import DatePicker from "@/app/ui/date-picker";
import TimePicker from "@/app/ui/time-picker";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

export default function TripSearch() {
  return (
    <form action={searchTrips}>
      <div className='flex gap-3 mt-7 mb-7'>
        <FieldGroup className='gap-4 flex-2'>
          <LocationPicker variant='origin' />
          <LocationPicker variant='destination' />
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
