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
          <LocationPicker
            name='from'
            label='Skąd'
            placeholder='Wpisz punkt początkowy'
            initialListVariation='originList'
          />
          <LocationPicker
            name='to'
            label='Dokąd'
            placeholder='Wpisz cel podróży'
            initialListVariation='destinationList'
          />
        </FieldGroup>
        <FieldGroup className='gap-4 flex-1'>
          <DatePicker
            label='Data'
            placeholder='Wybierz dzień'
          />
          <TimePicker
            name='time'
            label='Godzina'
            placeholder='Wybierz godzinę'
            modes={[
              { value: "departure", label: "Odjazd", shortLabel: "Odj" },
              { value: "arrival", label: "Przyjazd", shortLabel: "Przyj" },
            ]}
          />
        </FieldGroup>
      </div>
      <Button
        className='m-auto block'
        type='submit'
      >
        Szukaj połączenia
      </Button>
    </form>
  );
}
