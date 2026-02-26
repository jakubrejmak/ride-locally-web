"use server";

import {redirect} from "next/navigation";

export async function searchTrips(formData: FormData) {
    const from = formData.get("from");
    const to = formData.get("to");
    redirect(`/trips?from=${from}&to=${to}`);
}