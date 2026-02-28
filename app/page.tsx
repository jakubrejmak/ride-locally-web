import TripSearch from "@/app/ui/trip-search";

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='w-full max-w-3xl px-4 py-16 sm:px-16'>
        <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50'>
          Find a ride
        </h1>
        <p className='mt-2 text-zinc-600 dark:text-zinc-400'>
          Search local transit schedules between two locations.
        </p>
        <TripSearch />
      </main>
    </div>
  );
}
