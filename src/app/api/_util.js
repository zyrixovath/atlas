import { NextResponse } from "next/server";
export const ok = (data) => NextResponse.json(data);
export const fail = (message, status=400) => NextResponse.json({error:message},{status});
