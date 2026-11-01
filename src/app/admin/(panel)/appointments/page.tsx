import { Suspense } from "react";
import Appointments from "@/components/admin/Appointments";

export default function Page() {
  return (
    <Suspense>
      <Appointments />
    </Suspense>
  );
}
