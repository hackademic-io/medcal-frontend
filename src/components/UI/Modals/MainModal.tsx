import { IMainModalProps } from "@/types/modal.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainModal: React.FC<IMainModalProps> = ({
  showMenu,
  setShowMenu,
  appointmentId,
}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteAppointment, isPending: deletePending } = useMutation({
    mutationFn: async () =>
      await axios.delete(`/api/appointment/${appointmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setShowMenu(!showMenu);
    },
    onError: (err) => {
      toast.error("Error canceling appointment", {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Error canceling appointment :", err);
    },
  });

  return (
    <>
      {" "}
      <div className={`${showMenu ? "pl-[calc(100vw_-_100%)]" : ""}`}>
        <div
          className={`fixed top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 flex-col items-center bg-white p-12 transition-all duration-300 z-20 ${
            showMenu
              ? " opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={(e) => setShowMenu(!showMenu)}
            className="text-xl font-semibold transition-all hover:opacity-70"
          >
            Go Back
          </button>
          <div className="text-4xl font-bold my-16">
            Are you sure that you want to cancel this appointment?
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => deleteAppointment()}
              disabled={deletePending}
              className="blue_btn "
            >
              {deletePending ? "Canceling..." : "Yes, i want to cancel"}
            </button>
            <button
              onClick={(e) => setShowMenu(!showMenu)}
              className="cancel_btn"
              disabled={deletePending}
            >
              I changed my mind.
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div
        className={`bg-black z-10 fixed w-screen h-screen min-h-[100%] top-0 left-0 duration-300 transition-all ${
          showMenu
            ? "opacity-30 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>
    </>
  );
};

export default MainModal;
