"use server";

import {redirect} from "next/navigation";

export async function searchTrips(formData: FormData) {
    const params = new URLSearchParams();

    const fields = ["from", "to", "date", "time", "timeMode"];

    for (const field of fields) {
        const value = formData.get(field);
        if (value) params.set(field, String(value));
    }

    redirect(`/trips?${params.toString()}`);
}