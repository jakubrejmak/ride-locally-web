import Image from "next/image";
import TripSearch from "@/app/ui/trip-search";

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black'>
      <div className='relative w-full max-w-3xl'>
        <div className='relative h-48 w-full overflow-hidden sm:h-64'>
          <Image
            src='/intersection_day.jpg'
            alt='City intersection'
            fill
            priority
            className='object-cover dark:hidden'
          />
          <Image
            src='/intersection_night.jpg'
            alt='City intersection at night'
            fill
            priority
            className='hidden object-cover dark:block'
          />
          <div className='absolute inset-0 bg-linear-to-t from-zinc-50 via-zinc-50/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent' />
          <div className='absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-16'>
            <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50'>
              Find a ride
            </h1>
            <p className='mt-2 text-zinc-600 dark:text-zinc-400'>
              Search local transit schedules between two locations.
            </p>
          </div>
        </div>
      </div>
      <main className='w-full max-w-3xl px-4 sm:px-16'>
        <TripSearch />
      </main>
    </div>
  );
}
