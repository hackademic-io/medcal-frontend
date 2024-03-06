"use client";

import ClientError from "@/components/ClientError/ClientError";
import LoadingPage from "@/components/Loading/LoadingPage";
import RedirectFromEmail from "@/components/RedirectFromEmail/FormFromEmail";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();

  useEffect(() => {
    mutation.mutate();
  }, []);

  const hash = searchParams.get("hash");
  const encryptionIV = searchParams.get("iv");

  const mutation = useMutation<
    unknown,
    { response?: { data: { error: string } } }
  >({
    mutationFn: async () =>
      await axios.put(
        `${process.env.NEXT_PUBLIC_APPOINTMENT_URL}/patient/appointment/confirm`,
        { hash, encryptionIV }
      ),
  });

  const errorMessage =
    mutation.error?.response?.data.error || "Something went wrong";

  if (mutation.isPending) {
    return <LoadingPage />;
  }

  if (mutation.isError) {
    return <ClientError error={errorMessage} />;
  }

  if (mutation.isSuccess) {
    return (
      <RedirectFromEmail
        message={"Your appointment is confirmed! See you soon!"}
      />
    );
  }
}
