"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import this at the top
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { usePathname } from "next/navigation";

const TaskColumnModal = ({refetch}:{refetch?:()=>void}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [step, setStep] = useState<"count" | "names">("count");
  const [columnFields, setColumnFields] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Initialize the router
  const pathname = usePathname();
  const channelId = pathname?.split("/").pop() ?? "";

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    unregister,
  } = useForm();

  const onCountSubmit = () => {
    const count = parseInt(getValues("count"));
    if (!isNaN(count) && count > 0) {
      setColumnFields(Array(count).fill(""));
      setStep("names");
      setError(null);
    } else {
      setError("Please enter a valid number greater than 0.");
    }
  };

  // const onNamesSubmit = async () => {
  //   const columns = columnFields
  //     .map((_, index) => getValues(`column_${index}`))
  //     .filter((name) => name && name.trim() !== "");

  //   if (columns.length === 0) {
  //     setError("Please enter at least one column name.");
  //     return;
  //   }

  //   const payload = {
  //     data: columns.map((name) => ({
  //       name: name.trim(),
  //       channelId,
  //     })),
  //   };

  //   try {
  //     await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/add`, payload);
  //     reset();
  //     setIsModalOpen(false);
  //   } catch (err) {
  //     console.error("Error submitting:", err);
  //     setError("Failed to submit. Please try again.");
  //   }
  // };

  const onNamesSubmit = async () => {
    const columns = columnFields
      .map((_, index) => getValues(`column_${index}`))
      .filter((name) => name && name.trim() !== "");
  
    if (columns.length === 0) {
      setError("Please enter at least one column name.");
      return;
    }
  
    const payload = {
      data: columns.map((name) => ({
        name: name.trim(),
        channelId,
      })),
    };
  
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/taskColumn/add`, payload);
      reset();
      setIsModalOpen(false);
      router.refresh(); // <- This refreshes the current route data
      if(refetch) refetch();
    } catch (err) {
      console.error("Error submitting:", err);
      setError("Failed to submit. Please try again.");
    }
  };
  
  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden rounded-xl shadow-lg max-w-lg">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {step === "count" ? "Enter Column Count" : "Enter Column Names"}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {step === "count"
              ? "How many columns do you want to create?"
              : `Please enter names for ${columnFields.length} column${columnFields.length > 1 ? "s" : ""}.`}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(step === "count" ? onCountSubmit : onNamesSubmit)}
          className="space-y-4 px-6 py-4"
        >
          {step === "count" ? (
            <Input
              type="number"
              min="1"
              placeholder="Enter column count"
              {...register("count", { required: true })}
              className="bg-white text-black border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <>
              {columnFields.map((_, index) => (
                <Input
                  key={index}
                  placeholder={`Column ${index + 1} name`}
                  {...register(`column_${index}`, { required: true })}
                  className="bg-white text-black border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              ))}
              <Button
                type="button"
                variant="outline"
                className="text-white"
                onClick={() => {
                  setStep("count");
                  reset();
                  setColumnFields([]);
                  setError(null);
                }}
              >
                Go Back
              </Button>
            </>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <DialogFooter className="bg-gray-100 px-6 py-4 mt-2">
            <Button type="submit" className="w-full hover:bg-blue-700 hover:text-white">
              {step === "count" ? "Next" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskColumnModal;
